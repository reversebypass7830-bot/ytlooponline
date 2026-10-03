import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  CreateOwnerFeedbackBody,
  CreateOwnerFeedbackUploadUrlBody,
} from "@workspace/api-zod";
import { firebaseDelete, firebaseGet, firebasePut } from "../lib/firebase-rest";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { requireAccountOwner } from "./accounts";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const feedbackPath = "publicFeedback";
const feedbackImagePrefix = "/objects/feedback-showcase/";
const maxFeedbackImageBytes = 5 * 1024 * 1024;
const feedbackImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

type FeedbackRecord = {
  id: string;
  title: string;
  channelName: string;
  channelUrl: string;
  imagePath: string;
  createdAt: string;
};

function isFeedbackRecord(value: unknown): value is FeedbackRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<FeedbackRecord>;
  return typeof record.id === "string"
    && typeof record.title === "string"
    && typeof record.channelName === "string"
    && typeof record.channelUrl === "string"
    && typeof record.imagePath === "string"
    && typeof record.createdAt === "string";
}

async function loadFeedback(): Promise<FeedbackRecord[]> {
  const stored = await firebaseGet<Record<string, unknown> | null>(feedbackPath);
  return Object.values(stored || {})
    .filter(isFeedbackRecord)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function publicFeedback(record: FeedbackRecord) {
  return {
    id: record.id,
    title: record.title,
    channelName: record.channelName,
    channelUrl: record.channelUrl,
    imageUrl: `/api/public/feedback/${encodeURIComponent(record.id)}/image`,
    createdAt: record.createdAt,
  };
}

function sendFeedbackError(req: Request, res: Response, error: unknown, message: string): void {
  req.log.error({ error: error instanceof Error ? error.message : "unknown" }, message);
  res.status(500).json({ error: message });
}

router.get("/public/feedback", async (req, res): Promise<void> => {
  try {
    const feedback = (await loadFeedback()).slice(0, 5).map(publicFeedback);
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    res.json({ feedback });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not load creator feedback.");
  }
});

router.get("/public/feedback/:feedbackId/image", async (req, res): Promise<void> => {
  try {
    const record = (await loadFeedback()).find((item) => item.id === req.params.feedbackId);
    if (!record || !record.imagePath.startsWith(feedbackImagePrefix)) {
      res.status(404).json({ error: "Feedback image not found." });
      return;
    }
    const objectFile = await objectStorageService.getObjectEntityFile(record.imagePath);
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
      imagePath: record.imagePath,
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
    res.status(400).json({ error: "Enter a title, channel name, secure channel link, and uploaded image." });
    return;
  }
  let channelUrl: URL;
  try {
    channelUrl = new URL(parsed.data.channelUrl.trim());
  } catch {
    res.status(400).json({ error: "Enter a valid public channel URL." });
    return;
  }
  if (channelUrl.protocol !== "https:") {
    res.status(400).json({ error: "Channel links must use HTTPS." });
    return;
  }
  const imagePath = parsed.data.imagePath.trim();
  if (!imagePath.startsWith(feedbackImagePrefix)) {
    res.status(400).json({ error: "Upload the feedback image using the owner image uploader." });
    return;
  }
  try {
    const imageFile = await objectStorageService.getObjectEntityFile(imagePath);
    const [metadata] = await imageFile.getMetadata();
    const uploadedType = String(metadata.contentType || "").toLowerCase();
    const uploadedSize = Number(metadata.size || 0);
    if (!feedbackImageTypes.has(uploadedType) || !Number.isFinite(uploadedSize) || uploadedSize < 1 || uploadedSize > maxFeedbackImageBytes) {
      await objectStorageService.deleteObjectEntity(imagePath);
      res.status(400).json({ error: "The uploaded image must be a JPG, PNG, or WebP file up to 5 MB." });
      return;
    }
    const feedback: FeedbackRecord = {
      id: randomUUID(),
      title: parsed.data.title.trim(),
      channelName: parsed.data.channelName.trim(),
      channelUrl: channelUrl.toString(),
      imagePath,
      createdAt: new Date().toISOString(),
    };
    await firebasePut(`${feedbackPath}/${feedback.id}`, feedback);
    res.status(201).json({
      feedback: { ...publicFeedback(feedback), imagePath: feedback.imagePath },
    });
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(400).json({ error: "The uploaded feedback image could not be found." });
      return;
    }
    sendFeedbackError(req, res, error, "Could not save the feedback entry.");
  }
});

router.delete("/owner/feedback/:feedbackId", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const feedbackId = req.params.feedbackId;
    const records = await firebaseGet<Record<string, unknown> | null>(feedbackPath);
    const record = records?.[feedbackId];
    if (!record) {
      res.status(404).json({ error: "Feedback entry not found." });
      return;
    }
    if (isFeedbackRecord(record) && record.imagePath.startsWith(feedbackImagePrefix)) {
      try {
        await objectStorageService.deleteObjectEntity(record.imagePath);
      } catch (error) {
        if (!(error instanceof ObjectNotFoundError)) throw error;
      }
    }
    await firebaseDelete(`${feedbackPath}/${encodeURIComponent(feedbackId)}`);
    res.json({ success: true });
  } catch (error) {
    sendFeedbackError(req, res, error, "Could not delete the feedback entry.");
  }
});

export default router;