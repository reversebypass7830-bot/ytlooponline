import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  CreateOwnerFeedbackBody,
  CreateOwnerFeedbackUploadUrlBody,
  UpdateOwnerFeedbackBody,
} from "@workspace/api-zod";
import { firebaseDelete, firebaseGet, firebasePut } from "../lib/firebase-rest";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { requireAccountOwner } from "./accounts";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const feedbackPath = "publicFeedback";
const feedbackImagePrefix = "/objects/feedback-showcase/";
const feedbackSeedMarkerPath = "publicFeedbackMeta/ownerShowcaseSeededV1";
const maxFeedbackImageBytes = 5 * 1024 * 1024;
const maxFeedbackImages = 8;
const maxPinnedFeedback = 4;
const feedbackImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const existingShowcaseChannels = [
  {
    id: "seed-kai-asmr",
    title: "Live stream and channel page",
    channelName: "Kai ASMR",
    channelUrl: "https://youtube.com/@kaiasmr4real",
    imagePaths: ["/images/feedback-demo/kai-asmr-live.webp", "/images/feedback-demo/kai-asmr-about.webp"],
  },
  {
    id: "seed-dambiesyt",
    title: "WWE 2K live channel",
    channelName: "Dambiesyt",
    channelUrl: "https://youtube.com/@dambiesyt",
    imagePaths: ["/images/feedback-demo/dambiesyt-live.webp", "/images/feedback-demo/dambiesyt-about.webp"],
  },
  {
    id: "seed-tang-tien",
    title: "Raw egg peeling ASMR live",
    channelName: "Tăng Tiến Official",
    channelUrl: "https://youtube.com/@tangtienofficial2050",
    imagePaths: ["/images/feedback-demo/tang-tien-live.webp", "/images/feedback-demo/tang-tien-about.webp"],
  },
  {
    id: "seed-candy-talks",
    title: "Satisfying candy ASMR live",
    channelName: "CANDY TALKS",
    channelUrl: "https://youtube.com/@candytalks-z9b",
    imagePaths: ["/images/feedback-demo/candy-talks-live.webp", "/images/feedback-demo/candy-talks-about.webp"],
  },
] as const;
const existingShowcaseImagePaths = new Set(existingShowcaseChannels.flatMap((entry) => entry.imagePaths));
let feedbackWriteQueue: Promise<void> = Promise.resolve();

type FeedbackRecord = {
  id: string;
  title: string;
  channelName: string;
  channelUrl: string;
  imagePath: string;
  imagePaths?: string[];
  pinned?: boolean;
  createdAt: string;
  updatedAt?: string;
};

function isFeedbackRecord(value: unknown): value is FeedbackRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<FeedbackRecord>;
  return typeof record.id === "string"
    && typeof record.title === "string"
    && typeof record.channelName === "string"
    && typeof record.channelUrl === "string"
    && typeof record.imagePath === "string"
    && typeof record.createdAt === "string"
    && (record.imagePaths === undefined || (Array.isArray(record.imagePaths) && record.imagePaths.every((path) => typeof path === "string")))
    && (record.pinned === undefined || typeof record.pinned === "boolean");
}

function isAllowedFeedbackImagePath(path: string): boolean {
  return path.startsWith(feedbackImagePrefix) || existingShowcaseImagePaths.has(path);
}

function feedbackImagePaths(record: FeedbackRecord): string[] {
  const paths = Array.isArray(record.imagePaths)
    ? record.imagePaths.filter(isAllowedFeedbackImagePath)
    : [];
  if (paths.length > 0) return [...new Set(paths)];
  return isAllowedFeedbackImagePath(record.imagePath) ? [record.imagePath] : [];
}

async function loadFeedback(): Promise<FeedbackRecord[]> {
  const stored = await firebaseGet<Record<string, unknown> | null>(feedbackPath);
  return Object.values(stored || {})
    .filter(isFeedbackRecord)
    .sort((left, right) => Number(right.pinned === true) - Number(left.pinned === true)
      || right.createdAt.localeCompare(left.createdAt));
}

function publicFeedback(record: FeedbackRecord) {
  const basePath = `/api/public/feedback/${encodeURIComponent(record.id)}`;
  const version = encodeURIComponent(record.updatedAt || record.createdAt);
  const imagePaths = feedbackImagePaths(record);
  const imageUrl = (imagePath: string, index: number) => existingShowcaseImagePaths.has(imagePath)
    ? imagePath
    : `${basePath}/images/${index}?v=${version}`;
  return {
    id: record.id,
    title: record.title,
    channelName: record.channelName,
    channelUrl: record.channelUrl,
    imageUrl: imagePaths[0] ? imageUrl(imagePaths[0], 0) : `${basePath}/image?v=${version}`,
    imageUrls: imagePaths.map(imageUrl),
    pinned: record.pinned === true,
    createdAt: record.createdAt,
  };
}

async function isValidFeedbackImage(imagePath: string): Promise<boolean> {
  if (existingShowcaseImagePaths.has(imagePath)) return true;
  if (!imagePath.startsWith(feedbackImagePrefix)) return false;
  try {
    const imageFile = await objectStorageService.getObjectEntityFile(imagePath);
    const [metadata] = await imageFile.getMetadata();
    const uploadedType = String(metadata.contentType || "").toLowerCase();
    const uploadedSize = Number(metadata.size || 0);
    return feedbackImageTypes.has(uploadedType)
      && Number.isFinite(uploadedSize)
      && uploadedSize >= 1
      && uploadedSize <= maxFeedbackImageBytes;
  } catch (error) {
    if (error instanceof ObjectNotFoundError) return false;
    throw error;
  }
}

function validChannelUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

async function withFeedbackWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const previous = feedbackWriteQueue;
  let release!: () => void;
  feedbackWriteQueue = new Promise<void>((resolve) => { release = resolve; });
  await previous;
  try {
    return await operation();
  } finally {
    release();
  }
}

function normalizeChannelUrl(channelUrl: string): string {
  try {
    const parsed = new URL(channelUrl);
    return `${parsed.hostname.toLowerCase().replace(/^www\./, "")}${parsed.pathname.replace(/\/+$/, "").toLowerCase()}`;
  } catch {
    return channelUrl.trim().toLowerCase();
  }
}

async function seedExistingShowcaseChannels(): Promise<void> {
  await withFeedbackWriteLock(async () => {
    const seeded = await firebaseGet<string | null>(feedbackSeedMarkerPath);
    if (seeded) return;
    const records = await loadFeedback();
    const knownUrls = new Set(records.map((record) => normalizeChannelUrl(record.channelUrl)));
    let pinnedCount = records.filter((record) => record.pinned === true).length;
    for (const channel of existingShowcaseChannels) {
      if (records.some((record) => record.id === channel.id)
        || knownUrls.has(normalizeChannelUrl(channel.channelUrl))) continue;
      const record: FeedbackRecord = {
        id: channel.id,
        title: channel.title,
        channelName: channel.channelName,
        channelUrl: channel.channelUrl,
        imagePath: channel.imagePaths[0],
        imagePaths: [...channel.imagePaths],
        pinned: pinnedCount < maxPinnedFeedback,
        createdAt: new Date().toISOString(),
      };
      if (record.pinned) pinnedCount += 1;
      await firebasePut(`${feedbackPath}/${record.id}`, record);
      knownUrls.add(normalizeChannelUrl(channel.channelUrl));
    }
    await firebasePut(feedbackSeedMarkerPath, new Date().toISOString());
  });
}

function sendFeedbackError(req: Request, res: Response, error: unknown, message: string): void {
  req.log.error({ error: error instanceof Error ? error.message : "unknown" }, message);
  res.status(500).json({ error: message });
}

router.get("/public/feedback", async (req, res): Promise<void> => {
  try {
    const feedback = (await loadFeedback()).map(publicFeedback);
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.json({ feedback });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not load creator feedback.");
  }
});

router.get("/public/feedback/:feedbackId/image", async (req, res): Promise<void> => {
  try {
    const record = (await loadFeedback()).find((item) => item.id === req.params.feedbackId);
    const imagePath = record ? feedbackImagePaths(record)[0] : undefined;
    if (!imagePath) {
      res.status(404).json({ error: "Feedback image not found." });
      return;
    }
    const objectFile = await objectStorageService.getObjectEntityFile(imagePath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    if (response.body) Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    else res.end();
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Feedback image not found." });
      return;
    }
    sendFeedbackError(req, res, error, "Could not load the feedback image.");
  }
});

router.get("/public/feedback/:feedbackId/images/:imageIndex", async (req, res): Promise<void> => {
  try {
    const record = (await loadFeedback()).find((item) => item.id === req.params.feedbackId);
    const index = Number(req.params.imageIndex);
    const imagePath = record && Number.isSafeInteger(index) && index >= 0
      ? feedbackImagePaths(record)[index]
      : undefined;
    if (!imagePath) {
      res.status(404).json({ error: "Feedback image not found." });
      return;
    }
    const objectFile = await objectStorageService.getObjectEntityFile(imagePath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
    if (response.body) Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    else res.end();
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Feedback image not found." });
      return;
    }
    sendFeedbackError(req, res, error, "Could not load the feedback image.");
  }
});

router.get("/owner/feedback", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const feedback = (await loadFeedback()).map((record) => ({
      ...publicFeedback(record),
      imagePath: feedbackImagePaths(record)[0] || record.imagePath,
      imagePaths: feedbackImagePaths(record),
    }));
    res.json({ feedback });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not load feedback entries.");
  }
});

router.post("/owner/feedback/upload-url", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = CreateOwnerFeedbackUploadUrlBody.safeParse(req.body);
  const contentType = parsed.success ? parsed.data.contentType.toLowerCase() : "";
  const extension = feedbackImageTypes.get(contentType);
  const size = parsed.success ? parsed.data.size : 0;
  if (!parsed.success || !extension || !Number.isInteger(size) || size < 1 || size > maxFeedbackImageBytes) {
    res.status(400).json({ error: "Choose a JPG, PNG, or WebP image up to 5 MB." });
    return;
  }
  try {
    const upload = await objectStorageService.getFeedbackImageUploadURL(extension);
    res.json({ ...upload, contentType, maxBytes: maxFeedbackImageBytes });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Feedback image upload URL failed");
    res.status(502).json({ error: "Could not prepare feedback image storage." });
  }
});

router.post("/owner/feedback", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = CreateOwnerFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a title, channel name, secure channel link, and at least one uploaded image." });
    return;
  }
  const channelUrl = validChannelUrl(parsed.data.channelUrl);
  const imagePaths = [...new Set(parsed.data.imagePaths.map((path) => path.trim()))];
  if (!channelUrl || channelUrl.protocol !== "https:") {
    res.status(400).json({ error: "Enter a valid HTTPS channel URL." });
    return;
  }
  if (parsed.data.title.trim().length < 2 || parsed.data.channelName.trim().length < 2
    || imagePaths.length < 1 || imagePaths.length > maxFeedbackImages
    || imagePaths.some((path) => !path.startsWith(feedbackImagePrefix))) {
    res.status(400).json({ error: "Enter valid feedback details and upload up to eight feedback images." });
    return;
  }
  try {
    await withFeedbackWriteLock(async () => {
      const records = await loadFeedback();
      if (parsed.data.pinned && records.filter((record) => record.pinned === true).length >= maxPinnedFeedback) {
        res.status(409).json({ error: "All four homepage feedback spots are pinned. Unpin one first." });
        return;
      }
      for (const imagePath of imagePaths) {
        if (!(await isValidFeedbackImage(imagePath))) {
          res.status(400).json({ error: "Each uploaded image must be a JPG, PNG, or WebP file up to 5 MB." });
          return;
        }
      }
      const feedback: FeedbackRecord = {
        id: randomUUID(),
        title: parsed.data.title.trim(),
        channelName: parsed.data.channelName.trim(),
        channelUrl: channelUrl.toString(),
        imagePath: imagePaths[0],
        imagePaths,
        pinned: parsed.data.pinned,
        createdAt: new Date().toISOString(),
      };
      await firebasePut(`${feedbackPath}/${feedback.id}`, feedback);
      res.status(201).json({
        feedback: { ...publicFeedback(feedback), imagePath: feedback.imagePath, imagePaths },
      });
    });
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(400).json({ error: "One of the uploaded feedback images could not be found." });
      return;
    }
    sendFeedbackError(req, res, error, "Could not save the feedback entry.");
  }
});

router.patch("/owner/feedback/:feedbackId", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = UpdateOwnerFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter valid feedback details and at least one uploaded image." });
    return;
  }
  const feedbackId = Array.isArray(req.params.feedbackId) ? req.params.feedbackId[0] : req.params.feedbackId;
  const channelUrl = validChannelUrl(parsed.data.channelUrl);
  const imagePaths = [...new Set(parsed.data.imagePaths.map((path) => path.trim()))];
  if (!channelUrl || parsed.data.title.trim().length < 2 || parsed.data.channelName.trim().length < 2
    || imagePaths.length < 1 || imagePaths.length > maxFeedbackImages
    || imagePaths.some((path) => !path.startsWith(feedbackImagePrefix))) {
    res.status(400).json({ error: "Enter valid feedback details and upload up to eight feedback images." });
    return;
  }
  try {
    await withFeedbackWriteLock(async () => {
      const records = await loadFeedback();
      const current = records.find((record) => record.id === feedbackId);
      if (!current) {
        res.status(404).json({ error: "Feedback entry not found." });
        return;
      }
      const pinnedCount = records.filter((record) => record.pinned === true).length;
      if (parsed.data.pinned && current.pinned !== true && pinnedCount >= maxPinnedFeedback) {
        res.status(409).json({ error: "All four homepage feedback spots are pinned. Unpin one first." });
        return;
      }
      for (const imagePath of imagePaths) {
        if (!(await isValidFeedbackImage(imagePath))) {
          res.status(400).json({ error: "Each uploaded image must be a JPG, PNG, or WebP file up to 5 MB." });
          return;
        }
      }
      const updated: FeedbackRecord = {
        ...current,
        title: parsed.data.title.trim(),
        channelName: parsed.data.channelName.trim(),
        channelUrl: channelUrl.toString(),
        imagePath: imagePaths[0],
        imagePaths,
        pinned: parsed.data.pinned,
        updatedAt: new Date().toISOString(),
      };
      await firebasePut(`${feedbackPath}/${encodeURIComponent(feedbackId)}`, updated);
      const retainedPaths = new Set(imagePaths);
      const pathsStillUsed = new Set(records
        .filter((record) => record.id !== feedbackId)
        .flatMap(feedbackImagePaths));
      for (const oldPath of feedbackImagePaths(current)) {
        if (retainedPaths.has(oldPath) || pathsStillUsed.has(oldPath)) continue;
        try {
          await objectStorageService.deleteObjectEntity(oldPath);
        } catch (error) {
          req.log.warn({ feedbackId, error: error instanceof Error ? error.message : "unknown" }, "Could not remove a replaced feedback image");
        }
      }
      res.json({
        feedback: { ...publicFeedback(updated), imagePath: updated.imagePath, imagePaths },
      });
    });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not update the feedback entry.");
  }
});

router.delete("/owner/feedback/:feedbackId", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const feedbackId = Array.isArray(req.params.feedbackId) ? req.params.feedbackId[0] : req.params.feedbackId;
    await withFeedbackWriteLock(async () => {
      const record = (await loadFeedback()).find((entry) => entry.id === feedbackId);
      if (!record) {
        res.status(404).json({ error: "Feedback entry not found." });
        return;
      }
      await firebaseDelete(`${feedbackPath}/${encodeURIComponent(feedbackId)}`);
      for (const imagePath of feedbackImagePaths(record)) {
        try {
          await objectStorageService.deleteObjectEntity(imagePath);
        } catch (error) {
          if (!(error instanceof ObjectNotFoundError)) {
            req.log.warn({ feedbackId, error: error instanceof Error ? error.message : "unknown" }, "Could not remove a deleted feedback image");
          }
        }
      }
      res.json({ success: true });
    });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not delete the feedback entry.");
  }
});

export default router;