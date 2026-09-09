import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { copyFile, mkdir, readFile, readdir, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import {
  DownloadYoutubeVideoBody,
  DownloadYoutubeVideoResponse,
  ExtractYoutubeChannelLinksBody,
  ExtractYoutubeChannelLinksResponse,
  GetYoutubeFormatsBody,
  GetYoutubeFormatsResponse,
  ListMediaFilesResponse,
  TrimMediaFileBody,
  TrimMediaFileResponse,
} from "@workspace/api-zod";
import ffmpegPath from "ffmpeg-static";
import { cleanupYoutubeDlpDownload, downloadYoutubeDlp, getYoutubeDlpInfo } from "../lib/youtubeDlp";

const router: IRouter = Router();
const mediaDir = path.resolve(process.cwd(), "attached_assets", "live-media");
const maxUploadBytes = 1.5 * 1024 * 1024 * 1024;
const mediaIndexPath = path.join(mediaDir, "media-index.json");

type MediaRecord = {
  fileId: string;
  filename: string;
  sourcePath: string;
  playbackUrl: string;
  title: string;
  duration: string;
  licenseId: string;
  licenseName: string;
  folderName: string;
  quality: string;
  createdAt: string;
  sizeBytes: number;
};

let mediaIndexWrite = Promise.resolve();

async function readMediaIndex(): Promise<MediaRecord[]> {
  try {
    const raw = await readFile(mediaIndexPath, "utf8");
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? value.filter((item): item is MediaRecord => Boolean(item && typeof item === "object" && typeof (item as MediaRecord).fileId === "string")) : [];
  } catch {
    return [];
  }
}

function saveMediaRecord(record: MediaRecord): Promise<void> {
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    await mkdir(mediaDir, { recursive: true });
    const records = await readMediaIndex();
    const next = [...records.filter((item) => item.fileId !== record.fileId), record];
    await writeFile(mediaIndexPath, JSON.stringify(next, null, 2));
  });
  return mediaIndexWrite;
}

function removeMediaRecord(fileId: string): Promise<void> {
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    const records = await readMediaIndex();
    await writeFile(mediaIndexPath, JSON.stringify(records.filter((item) => item.fileId !== fileId), null, 2));
  });
  return mediaIndexWrite;
}

async function deleteIndexedMedia(
  predicate: (record: MediaRecord) => boolean,
): Promise<number> {
  let deleted = 0;
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    const records = await readMediaIndex();
    const remaining: MediaRecord[] = [];
    for (const record of records) {
      if (!predicate(record)) {
        remaining.push(record);
        continue;
      }
      const filename = await findMediaFile(record.fileId);
      if (filename) await unlink(filename).catch(() => undefined);
      deleted += 1;
    }
    await mkdir(mediaDir, { recursive: true });
    await writeFile(mediaIndexPath, JSON.stringify(remaining, null, 2));
  });
  await mediaIndexWrite;
  return deleted;
}

export function deleteMediaFilesForLicense(licenseId: string): Promise<number> {
  return deleteIndexedMedia((record) => record.licenseId === licenseId);
}

export function deleteMediaFilesForFolder(licenseId: string, folderName: string): Promise<number> {
  const normalizedFolder = folderName.trim().toLowerCase();
  return deleteIndexedMedia((record) =>
    record.licenseId === licenseId && record.folderName.trim().toLowerCase() === normalizedFolder,
  );
}

type MediaContext = {
  licenseId?: string;
  licenseName?: string;
  folderName?: string;
  quality?: string;
};

type YoutubeDownloadInput = {
  url: string;
  quality?: string;
  licenseId?: string;
  licenseName?: string;
  folderName?: string;
};

type YoutubeDownloadResult = {
  fileId: string;
  filename: string;
  sourcePath: string;
  playbackUrl: string;
  title: string;
  duration: string;
  quality: string;
  licenseId: string;
  licenseName: string;
  folderName: string;
};

type YoutubeDownloadJob = {
  jobId: string;
  status: "queued" | "running" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  result?: YoutubeDownloadResult;
  error?: string;
};

const youtubeDownloadJobs = new Map<string, YoutubeDownloadJob>();

function slugify(value: string, fallback: string): string {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56);
  return slug || fallback;
}

function mediaScopePath(context: MediaContext): string {
  const license = slugify(context.licenseName || context.licenseId || "workspace", "workspace");
  const folder = slugify(context.folderName || "media", "media");
  return path.join(mediaDir, folder, license);
}

export function ensureLicenseMediaFolder(licenseId: string, licenseName: string): Promise<void> {
  const licenseFolder = slugify(licenseName || licenseId, "workspace");
  return mkdir(path.join(mediaDir, licenseFolder), { recursive: true }).then(() => undefined);
}

function storedMediaFilename(fileId: string, rawName: string, context: MediaContext): string {
  const extension = path.extname(rawName).toLowerCase() || ".mp4";
  const title = slugify(path.basename(rawName, extension), "video");
  return `${fileId}__${title}${extension}`;
}

async function finalizeMediaFile(fileId: string, currentPath: string, rawName: string, context: MediaContext): Promise<string> {
  const destination = path.join(mediaScopePath(context), storedMediaFilename(fileId, rawName, context));
  await mkdir(path.dirname(destination), { recursive: true });
  if (currentPath !== destination) {
    await unlink(destination).catch(() => undefined);
    try {
      await rename(currentPath, destination);
    } catch (error) {
      const errorCode = error && typeof error === "object" && "code" in error ? error.code : undefined;
      if (errorCode !== "EXDEV") throw error;
      try {
        await copyFile(currentPath, destination);
        await unlink(currentPath);
      } catch (copyError) {
        await unlink(destination).catch(() => undefined);
        throw copyError;
      }
    }
  }
  return destination;
}

async function findMediaFile(fileId: string): Promise<string | null> {
  if (!/^[a-f0-9-]+$/i.test(fileId)) return null;
  const visit = async (directory: string): Promise<string | null> => {
    const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        const nested = await visit(entryPath);
        if (nested) return nested;
      } else if (entry.name.startsWith(`${fileId}.`) || entry.name.startsWith(`${fileId}__`)) {
        return entryPath;
      }
    }
    return null;
  };
  return visit(mediaDir);
}

async function collectMediaFiles(directory: string): Promise<Array<{ filename: string; path: string }>> {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files: Array<{ filename: string; path: string }> = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMediaFiles(entryPath));
    } else {
      files.push({ filename: entry.name, path: entryPath });
    }
  }
  return files;
}

function formatDuration(seconds: unknown): string {
  const totalSeconds = typeof seconds === "number" && Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainder = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function decodeHeaderValue(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath ?? "ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      const detail = stderr.trim().split(/\r?\n/).filter(Boolean).at(-1);
      reject(new Error(detail || `FFmpeg exited with code ${code ?? "unknown"}.`));
    });
  });
}

function validateYoutubeUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Enter a complete YouTube video URL.");
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (!["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"].includes(hostname)) {
    throw new Error("Only YouTube video links are supported.");
  }
  const videoId = hostname === "youtu.be"
    ? parsed.pathname.slice(1).split("/")[0]
    : parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:shorts\/|embed\/)?([^/]+)/i)?.[1];
  if (!videoId || !/^[\w-]{6,}$/.test(videoId)) {
    throw new Error("Enter a complete YouTube video URL.");
  }
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function validateYoutubeChannelUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Enter a complete YouTube channel URL.");
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const validHost = ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(hostname);
  const channelPath = parsed.pathname.toLowerCase();
  const validPath =
    channelPath.startsWith("/@") ||
    channelPath.startsWith("/channel/") ||
    channelPath.startsWith("/c/") ||
    channelPath.startsWith("/user/");
  if (!validHost || !validPath) {
    throw new Error("Enter a valid YouTube channel URL, such as https://www.youtube.com/@channel.");
  }
  return parsed.toString();
}

async function extractYoutubeChannelLinks(url: string): Promise<string[]> {
  const response = await fetch("https://tubepilot.ai/wp-admin/admin-ajax.php", {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: "https://tubepilot.ai",
      referer: "https://tubepilot.ai/tools/youtube-channel-video-links-extractor/",
      "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest",
    },
    body: new URLSearchParams({ action: "video_links_extract", yt_url: url }).toString(),
    signal: AbortSignal.timeout(60_000),
  });
  const html = await response.text();
  if (!response.ok) throw new Error(`Channel link extractor failed (${response.status}).`);

  const links = new Set<string>();
  const hrefPattern = /href=['"]([^'"]+)['"]/gi;
  for (const match of html.matchAll(hrefPattern)) {
    const candidate = match[1].replace(/&amp;/g, "&");
    try {
      const parsed = new URL(candidate);
      const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
      if (!["youtube.com", "m.youtube.com", "youtu.be"].includes(hostname)) continue;
      if (hostname === "youtu.be" || parsed.pathname === "/watch" || parsed.pathname === "/shorts/") {
        const videoId = hostname === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).at(-1);
        if (videoId && /^[\w-]{6,}$/.test(videoId)) {
          links.add(`https://www.youtube.com/watch?v=${videoId}`);
        }
      }
    } catch {
      // Ignore unrelated links from the extractor's HTML response.
    }
  }
  if (!links.size) throw new Error("No public video links were found for this channel.");
  return Array.from(links);
}

async function downloadYoutubeVideo(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  const download = await downloadYoutubeDlp(url, context.quality || "best");
  try {
    const extension = path.extname(download.path).toLowerCase() || ".mp4";
    const finalPath = await finalizeMediaFile(fileId, download.path, `${download.info.title}${extension}`, context);
    return {
      path: finalPath,
      title: download.info.title,
      duration: formatDuration(download.info.duration),
      quality: download.quality,
    };
  } finally {
    await cleanupYoutubeDlpDownload(download.tempDir);
  }
}

async function inspectYoutubeFormats(url: string): Promise<{ qualities: string[]; title: string }> {
  validateYoutubeUrl(url);
  const video = await getYoutubeDlpInfo(url);
  const qualities = video.formats
    .map((format) => typeof format.height === "number" ? format.height : 0)
    .filter((height) => height > 0)
    .sort((left, right) => right - left)
    .filter((height, index, all) => all.indexOf(height) === index)
    .map((height) => `${height}p`);
  return { qualities: ["best", ...qualities], title: video.title };
}

function youtubeDownloadError(error: unknown): string {
  const rawMessage = error instanceof Error ? error.message : "The YouTube video could not be downloaded.";
  if (/all youtube proxy attempts failed/i.test(rawMessage)) {
    return "YouTube could not be reached through the configured proxies. Refresh proxy.txt or try again in a few minutes.";
  }
  if (/sign in|not a bot|bot check|cookies.*authentication|rejected the configured cookies/i.test(rawMessage)) {
    return "yt-dlp could not access this YouTube video with the configured cookies. Refresh the YouTube cookies secret and try again.";
  }
  return rawMessage;
}

async function performYoutubeDownload(input: YoutubeDownloadInput): Promise<YoutubeDownloadResult> {
  const url = validateYoutubeUrl(input.url.trim());
  const fileId = randomUUID();
  const context: MediaContext = {
    quality: input.quality,
    licenseId: input.licenseId,
    licenseName: input.licenseName,
    folderName: input.folderName,
  };
  const result = await downloadYoutubeVideo(url, fileId, context);
  const fileStats = await stat(result.path);
  await saveMediaRecord({
    fileId,
    filename: path.basename(result.path),
    sourcePath: result.path,
    playbackUrl: `/api/media/files/${fileId}`,
    title: result.title,
    duration: result.duration,
    licenseId: context.licenseId || "",
    licenseName: context.licenseName || "",
    folderName: context.folderName || "",
    quality: result.quality,
    createdAt: new Date().toISOString(),
    sizeBytes: fileStats.size,
  });
  return DownloadYoutubeVideoResponse.parse({
    fileId,
    filename: path.basename(result.path),
    sourcePath: result.path,
    playbackUrl: `/api/media/files/${fileId}`,
    title: result.title,
    duration: result.duration,
    quality: result.quality,
    licenseId: context.licenseId || "",
    licenseName: context.licenseName || "",
    folderName: context.folderName || "",
  });
}

async function runYoutubeDownloadJob(jobId: string, input: YoutubeDownloadInput): Promise<void> {
  const job = youtubeDownloadJobs.get(jobId);
  if (!job) return;
  job.status = "running";
  job.updatedAt = new Date().toISOString();
  try {
    job.result = await performYoutubeDownload(input);
    job.status = "completed";
  } catch (error) {
    job.error = youtubeDownloadError(error);
    job.status = "failed";
  } finally {
    job.updatedAt = new Date().toISOString();
  }
}

router.get("/media/files", async (req, res): Promise<void> => {
  await mediaIndexWrite;
  const records = await readMediaIndex();
  const indexed = new Map(records.map((record) => [record.fileId, record]));
  const files = await collectMediaFiles(mediaDir);
  const result: MediaRecord[] = [];
  for (const { filename, path: filePath } of files) {
    if (filename === "media-index.json" || filename.endsWith(".part") || !/\.(mp4|mov|m4v|webm|mkv|avi|ts)$/i.test(filename)) continue;
    const fileId = filename.match(/^([a-f0-9-]{8,})(?:\.|__)/i)?.[1];
    if (!fileId) continue;
    const fileStats = await stat(filePath).catch(() => null);
    if (!fileStats) continue;
    const current = indexed.get(fileId);
    result.push(current ? { ...current, filename, sourcePath: filePath, sizeBytes: fileStats.size } : {
      fileId,
      filename,
      sourcePath: filePath,
      playbackUrl: `/api/media/files/${fileId}`,
      title: filename.includes("__")
        ? filename.replace(/^([a-f0-9-]{8,})__(.*?)(?:\.[^.]+)?$/i, "$2").replace(/[-_]+/g, " ")
        : "Recovered media file",
      duration: "00:00",
      licenseId: "",
      licenseName: "",
      folderName: "",
      quality: "unknown",
      createdAt: new Date(fileStats.mtimeMs).toISOString(),
      sizeBytes: fileStats.size,
    });
  }
  const licenseId = typeof req.query.licenseId === "string" ? req.query.licenseId : "";
  const filtered = licenseId ? result.filter((file) => file.licenseId === licenseId) : result;
  res.json(ListMediaFilesResponse.parse({ files: filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }));
});

router.delete("/media/files", async (req, res): Promise<void> => {
  const licenseId = typeof req.query.licenseId === "string" ? req.query.licenseId.trim() : "";
  const folderName = typeof req.query.folderName === "string" ? req.query.folderName.trim() : "";
  if (!licenseId) {
    res.status(400).json({ error: "A license id is required to delete workspace media." });
    return;
  }
  try {
    const deleted = folderName
      ? await deleteMediaFilesForFolder(licenseId, folderName)
      : await deleteMediaFilesForLicense(licenseId);
    res.json({ licenseId, folderName, deleted });
  } catch (error) {
    req.log.warn({ licenseId, folderName, error: error instanceof Error ? error.message : "unknown" }, "Media bulk deletion failed");
    res.status(500).json({ error: "The workspace video files could not be deleted." });
  }
});

router.post("/media/youtube-formats", async (req, res): Promise<void> => {
  try {
    const parsed = GetYoutubeFormatsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const url = validateYoutubeUrl(parsed.data.url.trim());
    res.json(GetYoutubeFormatsResponse.parse(await inspectYoutubeFormats(url)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "YouTube qualities could not be loaded.";
    req.log.warn({ error: message }, "YouTube format inspection failed");
    res.status(400).json({ error: message });
  }
});

router.post("/media/upload", async (req, res): Promise<void> => {
  const rawName = req.header("x-file-name");
  const contentType = req.header("content-type") || "";
  if (!rawName || (!contentType.startsWith("video/") && contentType !== "application/octet-stream")) {
    res.status(400).json({ error: "Send a video file with an X-File-Name header." });
    return;
  }

  await mkdir(mediaDir, { recursive: true });
  const fileId = randomUUID();
  const context: MediaContext = {
    licenseId: req.header("x-license-id") || undefined,
    licenseName: req.header("x-license-name") || undefined,
    folderName: req.header("x-folder-name") || undefined,
  };
  const mediaTitle = decodeHeaderValue(req.header("x-media-title"));
  const mediaDuration = decodeHeaderValue(req.header("x-media-duration"));
  const mediaQuality = decodeHeaderValue(req.header("x-quality"));
  const filename = storedMediaFilename(fileId, rawName, context);
  const destination = path.join(mediaScopePath(context), filename);
  await mkdir(path.dirname(destination), { recursive: true });
  let received = 0;
  req.on("data", (chunk: Buffer) => {
    received += chunk.length;
    if (received > maxUploadBytes) req.destroy(new Error("Video upload is larger than 1.5 GB."));
  });

  try {
    await pipeline(req, createWriteStream(destination));
    const fileStats = await stat(destination);
    await saveMediaRecord({
      fileId,
      filename: rawName,
      sourcePath: destination,
      playbackUrl: `/api/media/files/${fileId}`,
      title: mediaTitle || path.basename(rawName, path.extname(rawName)),
      duration: mediaDuration || "00:00",
      licenseId: context.licenseId || "",
      licenseName: context.licenseName || "",
      folderName: context.folderName || "",
      quality: mediaQuality || "uploaded",
      createdAt: new Date().toISOString(),
      sizeBytes: fileStats.size,
    });
    res.status(201).json({
      fileId,
      filename: rawName,
      sourcePath: destination,
      playbackUrl: `/api/media/files/${fileId}`,
    });
  } catch (error) {
    await unlink(destination).catch(() => undefined);
    req.log.warn({ error: error instanceof Error ? error.message : "unknown error" }, "Media upload failed");
    res.status(400).json({ error: "The video upload could not be completed." });
  }
});

router.post("/media/youtube-channel-links", async (req, res): Promise<void> => {
  try {
    const parsed = ExtractYoutubeChannelLinksBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const url = validateYoutubeChannelUrl(parsed.data.url.trim());
    const links = await extractYoutubeChannelLinks(url);
    res.json(ExtractYoutubeChannelLinksResponse.parse({ channelUrl: url, links, count: links.length }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The channel video links could not be extracted.";
    req.log.warn({ error: message }, "YouTube channel link extraction failed");
    res.status(400).json({ error: message });
  }
});

router.post("/media/youtube-download", async (req, res): Promise<void> => {
  try {
    const parsed = DownloadYoutubeVideoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    res.status(201).json(await performYoutubeDownload(parsed.data));
  } catch (error) {
    const message = youtubeDownloadError(error);
    req.log.warn({ error: message }, "YouTube download failed");
    res.status(400).json({ error: message });
  }
});

router.post("/media/youtube-download/jobs", async (req, res): Promise<void> => {
  const parsed = DownloadYoutubeVideoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    validateYoutubeUrl(parsed.data.url.trim());
  } catch (error) {
    res.status(400).json({ error: youtubeDownloadError(error) });
    return;
  }
  const now = new Date().toISOString();
  const jobId = randomUUID();
  youtubeDownloadJobs.set(jobId, { jobId, status: "queued", createdAt: now, updatedAt: now });
  void runYoutubeDownloadJob(jobId, parsed.data);
  res.status(202).json({ jobId, status: "queued" });
});

router.get("/media/youtube-download/jobs/:jobId", (req, res): void => {
  const job = youtubeDownloadJobs.get(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "YouTube download job not found." });
    return;
  }
  res.json(job);
});

router.post("/media/files/:fileId/trim", async (req, res): Promise<void> => {
  const parsed = TrimMediaFileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = await findMediaFile(req.params.fileId);
  if (!input) {
    res.status(404).json({ error: "Media file not found." });
    return;
  }

  const startSeconds = parsed.data.startSeconds;
  const endSeconds = parsed.data.endSeconds;
  if (!Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) || startSeconds >= endSeconds) {
    res.status(400).json({ error: "End time must be greater than start time." });
    return;
  }

  await mkdir(mediaDir, { recursive: true });
  const fileId = randomUUID();
  const sourceRecord = (await readMediaIndex()).find((record) => record.fileId === req.params.fileId);
  const licenseId = req.header("x-license-id") || sourceRecord?.licenseId || "";
  const licenseName = req.header("x-license-name") || sourceRecord?.licenseName || "";
  const folderName = req.header("x-folder-name") || sourceRecord?.folderName || "";
  const quality = req.header("x-quality") || sourceRecord?.quality || "clip";
  const clipTitle = req.header("x-clip-title")?.trim() || `${sourceRecord?.title || path.basename(input, path.extname(input))} · clip`;
  const replaceFileId = req.header("x-replace-file-id")?.trim() || "";
  if (sourceRecord?.licenseId && sourceRecord.licenseId !== licenseId) {
    res.status(403).json({ error: "This video belongs to another license workspace." });
    return;
  }
  const destination = path.join(mediaDir, `${fileId}.mp4`);
  try {
    try {
      await runFfmpeg([
        "-y",
        "-ss", String(startSeconds),
        "-i", input,
        "-t", String(endSeconds - startSeconds),
        "-map", "0:v:0",
        "-map", "0:a?",
        "-c", "copy",
        "-avoid_negative_ts", "make_zero",
        "-movflags", "+faststart",
        destination,
      ]);
    } catch {
      await unlink(destination).catch(() => undefined);
      await runFfmpeg([
        "-y",
        "-ss", String(startSeconds),
        "-i", input,
        "-t", String(endSeconds - startSeconds),
        "-map", "0:v:0",
        "-map", "0:a?",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        destination,
      ]);
    }

    const finalPath = await finalizeMediaFile(fileId, destination, `${clipTitle}.mp4`, {
      licenseId,
      licenseName,
      folderName,
    });
    const clipStats = await stat(finalPath);
    await saveMediaRecord({
      fileId,
      filename: path.basename(finalPath),
      sourcePath: finalPath,
      playbackUrl: `/api/media/files/${fileId}`,
      title: clipTitle,
      duration: formatDuration(endSeconds - startSeconds),
      licenseId,
      licenseName,
      folderName,
      quality,
      createdAt: new Date().toISOString(),
      sizeBytes: clipStats.size,
    });
    if (replaceFileId && replaceFileId === req.params.fileId) {
      await unlink(input).catch(() => undefined);
      await removeMediaRecord(replaceFileId);
    }
    res.status(201).json(TrimMediaFileResponse.parse({
      fileId,
      filename: path.basename(finalPath),
      sourcePath: finalPath,
      playbackUrl: `/api/media/files/${fileId}`,
      duration: formatDuration(endSeconds - startSeconds),
    }));
  } catch (error) {
    await unlink(destination).catch(() => undefined);
    req.log.warn({ fileId: req.params.fileId, error: error instanceof Error ? error.message : "unknown" }, "Media trim failed");
    res.status(400).json({ error: "The video clip could not be created. Check the start and end times." });
  }
});

router.get("/media/files/:fileId", async (req, res): Promise<void> => {
  const filename = await findMediaFile(req.params.fileId);
  if (!filename) {
    res.status(404).json({ error: "Media file not found." });
    return;
  }

  const fileStats = await stat(filename);
  res.setHeader("Content-Length", fileStats.size);
  res.setHeader("Content-Type", "video/mp4");
  res.sendFile(filename);
});

router.delete("/media/files/:fileId", async (req, res): Promise<void> => {
  const requestedLicenseId = typeof req.query.licenseId === "string"
    ? req.query.licenseId.trim()
    : req.header("x-license-id")?.trim() || "";
  const record = (await readMediaIndex()).find((item) => item.fileId === req.params.fileId);
  if (record?.licenseId && record.licenseId !== requestedLicenseId) {
    res.status(403).json({ error: "This video belongs to another license workspace." });
    return;
  }
  const filename = await findMediaFile(req.params.fileId);
  if (!filename) {
    res.json({ fileId: req.params.fileId, deleted: false });
    return;
  }
  try {
    await unlink(filename);
    await removeMediaRecord(req.params.fileId);
    req.log.info({ fileId: req.params.fileId }, "Media file deleted");
    res.json({ fileId: req.params.fileId, deleted: true });
  } catch (error) {
    req.log.warn({ fileId: req.params.fileId, error: error instanceof Error ? error.message : "unknown" }, "Media file deletion failed");
    res.status(500).json({ error: "The video file could not be deleted." });
  }
});

export default router;