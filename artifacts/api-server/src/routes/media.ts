import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { copyFile, mkdir, readFile, readdir, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Router, type IRouter, type Request } from "express";
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
import { cleanupVidKrakenDownload, downloadVidKraken, getVidKrakenInfo } from "../lib/vidkraken";

const router: IRouter = Router();
const mediaDir = path.resolve(process.cwd(), "attached_assets", "live-media");
const maxUploadBytes = 1.5 * 1024 * 1024 * 1024;
const mediaIndexPath = path.join(mediaDir, "media-index.json");
const includedFoldersPath = path.join(mediaDir, "included-folders.json");
const includedMediaLicenseId = "__included__";
const includedFolderRoot = "My YouTube Animation/Included Animations";
const defaultOwnerPassword = "traderp1wer";

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

type IncludedFolderRecord = {
  path: string;
  createdAt: string;
};

function ownerAuthorized(req: Request): boolean {
  const expected = process.env.OWNER_PASSWORD?.trim() || defaultOwnerPassword;
  return Boolean(expected && req.header("x-owner-password") === expected);
}

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

async function readIncludedFolders(): Promise<IncludedFolderRecord[]> {
  try {
    const raw = await readFile(includedFoldersPath, "utf8");
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is IncludedFolderRecord => Boolean(
      item
      && typeof item === "object"
      && typeof (item as IncludedFolderRecord).path === "string"
      && typeof (item as IncludedFolderRecord).createdAt === "string",
    ));
  } catch {
    return [];
  }
}

function writeMediaIndex(records: MediaRecord[]): Promise<void> {
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    await mkdir(mediaDir, { recursive: true });
    await writeFile(mediaIndexPath, JSON.stringify(records, null, 2));
  });
  return mediaIndexWrite;
}

function writeIncludedFolders(folders: IncludedFolderRecord[]): Promise<void> {
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    await mkdir(mediaDir, { recursive: true });
    await writeFile(includedFoldersPath, JSON.stringify(folders, null, 2));
  });
  return mediaIndexWrite;
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

function normalizeIncludedFolderName(value: string): string {
  const parts = value
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part !== "." && part !== "..");
  if (!parts.length) return includedFolderRoot;
  const lower = parts.map((part) => part.toLowerCase());
  const rootParts = includedFolderRoot.split("/");
  if (lower.slice(0, rootParts.length).join("/") === rootParts.map((part) => part.toLowerCase()).join("/")) {
    return [...rootParts, ...parts.slice(rootParts.length)].join("/");
  }
  if (lower[0] === "included animations") return [rootParts[0], rootParts[1], ...parts.slice(1)].join("/");
  return [...rootParts, ...parts].join("/");
}

function isIncludedFolderPath(value: string): boolean {
  const normalized = normalizeIncludedFolderName(value).toLowerCase();
  const root = includedFolderRoot.toLowerCase();
  return normalized === root || normalized.startsWith(`${root}/`);
}

function isFolderInScope(value: string, folder: string): boolean {
  const candidate = normalizeIncludedFolderName(value).toLowerCase();
  const target = normalizeIncludedFolderName(folder).toLowerCase();
  return candidate === target || candidate.startsWith(`${target}/`);
}

function replaceFolderPrefix(value: string, from: string, to: string): string {
  const normalizedValue = normalizeIncludedFolderName(value);
  const normalizedFrom = normalizeIncludedFolderName(from);
  const normalizedTo = normalizeIncludedFolderName(to);
  return normalizedValue === normalizedFrom
    ? normalizedTo
    : `${normalizedTo}${normalizedValue.slice(normalizedFrom.length)}`;
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

type ComposeMediaBody = {
  fileIds?: unknown;
  title?: unknown;
  loopCount?: unknown;
  logoFileId?: unknown;
  webcamFileId?: unknown;
  animationFileId?: unknown;
  logoPosition?: unknown;
  webcamPosition?: unknown;
  overlayScale?: unknown;
  webcamScale?: unknown;
  animationScale?: unknown;
  mainX?: unknown;
  mainY?: unknown;
  mainScale?: unknown;
  webcamX?: unknown;
  webcamY?: unknown;
  animationX?: unknown;
  animationY?: unknown;
  animationPreset?: unknown;
  outputAspectRatio?: unknown;
  cropMode?: unknown;
  reverseVideo?: unknown;
  brightness?: unknown;
  contrast?: unknown;
  saturation?: unknown;
  hue?: unknown;
  chromaKeyEnabled?: unknown;
  chromaKeyTarget?: unknown;
  chromaKeyColor?: unknown;
  chromaSimilarity?: unknown;
  chromaBlend?: unknown;
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

function folderAncestors(folderName: string): string[] {
  const normalized = normalizeIncludedFolderName(folderName);
  const parts = normalized.split("/");
  return parts.map((_part, index) => parts.slice(0, index + 1).join("/"));
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

function parseDurationText(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function overlayCoordinates(position: string, mainWidth: string, mainHeight: string): string {
  switch (position) {
    case "top-right": return `${mainWidth}-overlay_w-24:24`;
    case "bottom-left": return `24:${mainHeight}-overlay_h-24`;
    case "bottom-right": return `${mainWidth}-overlay_w-24:${mainHeight}-overlay_h-24`;
    default: return "24:24";
  }
}

function clampNumber(value: unknown, minimum: number, maximum: number, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function animationFilter(preset: string, width: number, height: number): string {
  const copy = preset === "subscribe" ? "SUBSCRIBE" : preset === "like" ? "LIKE" : preset === "follow" ? "FOLLOW" : "";
  if (!copy) return "";
  const subtitle = preset === "subscribe" ? "New drop live" : preset === "like" ? "Show some love" : "Stay with us";
  const safeCopy = copy.replaceAll(":", "\\:");
  const safeSubtitle = subtitle.replaceAll(":", "\\:");
  const fontSize = Math.max(28, Math.round(width / 48));
  const x = `(w-text_w)/2`;
  const y = `h-${Math.round(height * 0.16)}-if(lt(t\\,0.6)\\,(0.6-t)*${Math.round(height * 0.12)}\\,0)`;
  const alpha = `if(lt(t\\,0.35)\\,t/0.35\\,if(lt(t\\,3.2)\\,1\\,if(lt(t\\,4)\\,4-t\\,0)))`;
  const subtitleSize = Math.max(16, Math.round(width / 100));
  return `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='${safeCopy}':fontcolor=white:fontsize=${fontSize}:box=1:boxcolor=0xE53935@0.95:boxborderw=${Math.round(fontSize * 0.8)}:x='${x}':y='${y}':alpha='${alpha}',drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='${safeSubtitle}':fontcolor=white:fontsize=${subtitleSize}:x='(w-text_w)/2':y='h-${Math.round(height * 0.095)}':alpha='${alpha}'`;
}

function decodeHeaderValue(value: string | undefined): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function runFfmpeg(args: string[], onProgress?: (seconds: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath ?? "ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    let stdoutBuffer = "";
    const parseProgress = (chunk: Buffer) => {
      if (!onProgress) return;
      stdoutBuffer += chunk.toString();
      const lines = stdoutBuffer.split(/\r?\n/);
      stdoutBuffer = lines.pop() || "";
      for (const line of lines) {
        const [key, rawValue] = line.split("=", 2);
        if (key !== "out_time_ms" && key !== "out_time_us") continue;
        const value = Number(rawValue);
        if (Number.isFinite(value) && value >= 0) onProgress(value / 1_000_000);
      }
    };
    child.stdout?.on("data", parseProgress);
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
  const download = await downloadVidKraken(url, context.quality || "best");
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
    await cleanupVidKrakenDownload(download.tempDir);
  }
}

async function inspectYoutubeFormats(url: string): Promise<{ qualities: string[]; title: string }> {
  validateYoutubeUrl(url);
  const video = await getVidKrakenInfo(url);
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
  if (/VidKraken TOKEN is missing/i.test(rawMessage)) {
    return "VidKraken is not configured yet. Add TOKEN to the project's .env file.";
  }
  if (/401|missing api key|invalid api key|unauthorized/i.test(rawMessage)) {
    return "VidKraken rejected the TOKEN. Check the API key in the project's .env file.";
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
  const filtered = licenseId
    ? result.filter((file) => file.licenseId === licenseId || file.licenseId === includedMediaLicenseId)
    : result;
  res.json(ListMediaFilesResponse.parse({ files: filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }));
});

router.get("/media/included-folders", async (req, res): Promise<void> => {
  await mediaIndexWrite;
  const [records, savedFolders] = await Promise.all([readMediaIndex(), readIncludedFolders()]);
  const folderMap = new Map<string, IncludedFolderRecord>();
  const addFolder = (folderName: string, createdAt = new Date().toISOString()) => {
    for (const folder of folderAncestors(folderName)) {
      if (!isIncludedFolderPath(folder)) continue;
      const key = folder.toLowerCase();
      if (!folderMap.has(key)) folderMap.set(key, { path: folder, createdAt });
    }
  };
  addFolder(includedFolderRoot);
  for (const folder of savedFolders) addFolder(folder.path, folder.createdAt);
  for (const record of records) {
    if (record.licenseId === includedMediaLicenseId) addFolder(record.folderName || includedFolderRoot, record.createdAt);
  }
  res.json({ root: includedFolderRoot, folders: [...folderMap.values()].sort((a, b) => a.path.localeCompare(b.path)) });
});

router.get("/owner/included-folders", async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Owner access is required." });
    return;
  }
  await mediaIndexWrite;
  const [records, savedFolders] = await Promise.all([readMediaIndex(), readIncludedFolders()]);
  const includedFiles = records.filter((record) => record.licenseId === includedMediaLicenseId);
  const folderMap = new Map<string, IncludedFolderRecord>();
  const addFolder = (folderName: string, createdAt = new Date().toISOString()) => {
    for (const folder of folderAncestors(folderName)) {
      if (!isIncludedFolderPath(folder)) continue;
      const key = folder.toLowerCase();
      if (!folderMap.has(key)) folderMap.set(key, { path: folder, createdAt });
    }
  };
  addFolder(includedFolderRoot);
  for (const folder of savedFolders) addFolder(folder.path, folder.createdAt);
  for (const record of includedFiles) addFolder(record.folderName || includedFolderRoot, record.createdAt);
  res.json({
    root: includedFolderRoot,
    folders: [...folderMap.values()].sort((a, b) => a.path.localeCompare(b.path)),
    files: includedFiles.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  });
});

router.post("/owner/included-folders", async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Owner access is required." });
    return;
  }
  const rawFolderName = typeof req.body?.folderName === "string" ? req.body.folderName : "";
  if (!rawFolderName.trim()) {
    res.status(400).json({ error: "A folder name is required." });
    return;
  }
  const folderName = normalizeIncludedFolderName(rawFolderName);
  if (folderName === includedFolderRoot) {
    res.status(409).json({ error: "The Included Animations root folder already exists." });
    return;
  }
  await mediaIndexWrite;
  const folders = await readIncludedFolders();
  if (folders.some((folder) => folder.path.toLowerCase() === folderName.toLowerCase())) {
    res.status(409).json({ error: "That folder already exists." });
    return;
  }
  const createdAt = new Date().toISOString();
  const next = [...folders, { path: folderName, createdAt }];
  await writeIncludedFolders(next);
  res.status(201).json({ path: folderName, createdAt });
});

router.patch("/owner/included-folders", async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Owner access is required." });
    return;
  }
  const rawFrom = typeof req.body?.from === "string" ? req.body.from : "";
  const rawTo = typeof req.body?.to === "string" ? req.body.to : "";
  if (!rawFrom.trim() || !rawTo.trim()) {
    res.status(400).json({ error: "Both the current and new folder names are required." });
    return;
  }
  const from = normalizeIncludedFolderName(rawFrom);
  const to = normalizeIncludedFolderName(rawTo);
  if (from === includedFolderRoot) {
    res.status(400).json({ error: "The Included Animations root folder cannot be renamed." });
    return;
  }
  if (to === includedFolderRoot || isFolderInScope(to, from)) {
    res.status(400).json({ error: "A folder cannot be moved into itself." });
    return;
  }
  await mediaIndexWrite;
  const [records, folders] = await Promise.all([readMediaIndex(), readIncludedFolders()]);
  const duplicate = folders.some((folder) => folder.path.toLowerCase() === to.toLowerCase() && !isFolderInScope(folder.path, from));
  if (duplicate) {
    res.status(409).json({ error: "That destination folder already exists." });
    return;
  }
  const nextRecords = records.map((record) => ({ ...record }));
  for (let index = 0; index < nextRecords.length; index += 1) {
    const record = nextRecords[index];
    if (record.licenseId !== includedMediaLicenseId || !isFolderInScope(record.folderName || includedFolderRoot, from)) continue;
    const nextFolder = replaceFolderPrefix(record.folderName || includedFolderRoot, from, to);
    const currentPath = await findMediaFile(record.fileId);
    if (currentPath) {
      nextRecords[index].sourcePath = await finalizeMediaFile(record.fileId, currentPath, record.filename, {
        licenseId: includedMediaLicenseId,
        licenseName: record.licenseName || "Included Animations",
        folderName: nextFolder,
      });
    }
    nextRecords[index].folderName = nextFolder;
  }
  const nextFolders = folders.map((folder) => isFolderInScope(folder.path, from)
    ? { ...folder, path: replaceFolderPrefix(folder.path, from, to) }
    : folder);
  const allPaths = new Map(nextFolders.map((folder) => [folder.path.toLowerCase(), folder]));
  for (const ancestor of folderAncestors(to)) {
    if (!allPaths.has(ancestor.toLowerCase())) allPaths.set(ancestor.toLowerCase(), { path: ancestor, createdAt: new Date().toISOString() });
  }
  await writeMediaIndex(nextRecords);
  await writeIncludedFolders([...allPaths.values()]);
  res.json({ from, to });
});

router.delete("/owner/included-folders", async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Owner access is required." });
    return;
  }
  const rawFolderName = typeof req.query.folderName === "string" ? req.query.folderName : "";
  const folderName = normalizeIncludedFolderName(rawFolderName);
  if (!rawFolderName.trim() || folderName === includedFolderRoot) {
    res.status(400).json({ error: "Choose a child folder to delete." });
    return;
  }
  await mediaIndexWrite;
  let deleted = 0;
  mediaIndexWrite = mediaIndexWrite.then(async () => {
    const records = await readMediaIndex();
    const remaining: MediaRecord[] = [];
    for (const record of records) {
      if (record.licenseId !== includedMediaLicenseId || !isFolderInScope(record.folderName || includedFolderRoot, folderName)) {
        remaining.push(record);
        continue;
      }
      const filename = await findMediaFile(record.fileId);
      if (filename) await unlink(filename).catch(() => undefined);
      deleted += 1;
    }
    const folders = await readIncludedFolders();
    await mkdir(mediaDir, { recursive: true });
    await writeFile(mediaIndexPath, JSON.stringify(remaining, null, 2));
    await writeFile(
      includedFoldersPath,
      JSON.stringify(folders.filter((folder) => !isFolderInScope(folder.path, folderName)), null, 2),
    );
  });
  await mediaIndexWrite;
  res.json({ path: folderName, deleted });
});

router.patch("/owner/included-files/:fileId", async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Owner access is required." });
    return;
  }
  const requestedFolder = typeof req.body?.folderName === "string" ? req.body.folderName : "";
  if (!requestedFolder.trim()) {
    res.status(400).json({ error: "A destination folder is required." });
    return;
  }
  const folderName = normalizeIncludedFolderName(requestedFolder);
  await mediaIndexWrite;
  const records = await readMediaIndex();
  const index = records.findIndex((record) => record.fileId === req.params.fileId);
  if (index < 0 || records[index].licenseId !== includedMediaLicenseId) {
    res.status(404).json({ error: "Included video not found." });
    return;
  }
  const nextRecords = records.map((record) => ({ ...record }));
  const record = nextRecords[index];
  const currentPath = await findMediaFile(record.fileId);
  if (currentPath && normalizeIncludedFolderName(record.folderName || includedFolderRoot) !== folderName) {
    record.sourcePath = await finalizeMediaFile(record.fileId, currentPath, record.filename, {
      licenseId: includedMediaLicenseId,
      licenseName: record.licenseName || "Included Animations",
      folderName,
    });
  }
  record.folderName = folderName;
  await writeMediaIndex(nextRecords);
  res.json({ file: record });
});

router.delete("/media/files", async (req, res): Promise<void> => {
  const licenseId = typeof req.query.licenseId === "string" ? req.query.licenseId.trim() : "";
  const folderName = typeof req.query.folderName === "string" ? req.query.folderName.trim() : "";
  if (!licenseId) {
    res.status(400).json({ error: "A license id is required to delete workspace media." });
    return;
  }
  if (licenseId === includedMediaLicenseId && !ownerAuthorized(req)) {
    res.status(403).json({ error: "Only the owner can remove included animations." });
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
  if (!rawName || (!contentType.startsWith("video/") && !contentType.startsWith("image/") && contentType !== "application/octet-stream")) {
    res.status(400).json({ error: "Send a video or image file with an X-File-Name header." });
    return;
  }

  await mkdir(mediaDir, { recursive: true });
  const fileId = randomUUID();
  const context: MediaContext = {
    licenseId: req.header("x-license-id") || undefined,
    licenseName: req.header("x-license-name") || undefined,
    folderName: req.header("x-folder-name") || undefined,
  };
  if (context.licenseId === includedMediaLicenseId && !ownerAuthorized(req)) {
    res.status(403).json({ error: "Only the owner can add included animations." });
    return;
  }
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
    if (parsed.data.licenseId === includedMediaLicenseId && !ownerAuthorized(req)) {
      res.status(403).json({ error: "Only the owner can add included animations." });
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
  if (parsed.data.licenseId === includedMediaLicenseId && !ownerAuthorized(req)) {
    res.status(403).json({ error: "Only the owner can add included animations." });
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

router.post("/media/compose", async (req, res): Promise<void> => {
  const body = req.body as ComposeMediaBody;
  const fileIds = Array.isArray(body.fileIds)
    ? body.fileIds.filter((value): value is string => typeof value === "string" && /^[a-f0-9-]{8,}$/i.test(value))
    : [];
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Edited video";
  const loopCount = Math.min(12, Math.max(1, Number.isInteger(Number(body.loopCount)) ? Number(body.loopCount) : 1));
  const licenseId = req.header("x-license-id") || "";
  const licenseName = req.header("x-license-name") || "";
  // Editor renders always belong to this protected library destination. Do not
  // trust a client-selected folder for composed output.
  const folderName = "Edited Videos";
  const logoFileId = typeof body.logoFileId === "string" ? body.logoFileId : "";
  const webcamFileId = typeof body.webcamFileId === "string" ? body.webcamFileId : "";
  const animationFileId = typeof body.animationFileId === "string" ? body.animationFileId : "";
  const logoPosition = typeof body.logoPosition === "string" ? body.logoPosition : "bottom-right";
  const webcamPosition = typeof body.webcamPosition === "string" ? body.webcamPosition : "top-right";
  const overlayScale = Math.min(0.8, Math.max(0.1, Number(body.overlayScale) || 0.25));
  const webcamScale = clampNumber(body.webcamScale, 0.1, 0.8, 0.25);
  const animationScale = clampNumber(body.animationScale, 0.1, 0.8, 0.25);
  const mainScale = clampNumber(body.mainScale, 0.5, 2.5, 1);
  const mainX = clampNumber(body.mainX, -48, 48, 0);
  const mainY = clampNumber(body.mainY, -48, 48, 0);
  const webcamX = clampNumber(body.webcamX, -48, 48, 0);
  const webcamY = clampNumber(body.webcamY, -48, 48, 0);
  const animationX = clampNumber(body.animationX, -48, 48, 0);
  const animationY = clampNumber(body.animationY, -48, 48, 0);
  const animationPreset = body.animationPreset === "subscribe" || body.animationPreset === "like" || body.animationPreset === "follow"
    ? body.animationPreset
    : "none";
  const outputAspectRatio = body.outputAspectRatio === "shorts" || body.outputAspectRatio === "square" || body.outputAspectRatio === "full"
    ? body.outputAspectRatio
    : "full";
  const cropMode = body.cropMode === "crop" ? "crop" : "fit";
  const reverseVideo = body.reverseVideo === true;
  const brightness = clampNumber(body.brightness, -1, 1, 0);
  const contrast = clampNumber(body.contrast, 0.5, 1.8, 1);
  const saturation = clampNumber(body.saturation, 0, 2, 1);
  const hue = clampNumber(body.hue, -180, 180, 0);
  const chromaKeyTarget = body.chromaKeyTarget === "animation" ? "animation" : "webcam";
  const chromaKeyEnabled = body.chromaKeyEnabled === true
    && Boolean(chromaKeyTarget === "animation" ? animationFileId : webcamFileId);
  const rawChromaKeyColor = typeof body.chromaKeyColor === "string" ? body.chromaKeyColor.trim() : "#00ff00";
  const chromaKeyColor = /^#?[0-9a-f]{6}$/i.test(rawChromaKeyColor)
    ? `0x${rawChromaKeyColor.replace("#", "")}`
    : "0x00ff00";
  const chromaSimilarity = clampNumber(body.chromaSimilarity, 0.05, 0.95, 0.32);
  const chromaBlend = clampNumber(body.chromaBlend, 0, 0.5, 0.08);
  const outputDimensions = {
    shorts: [1080, 1920],
    full: [1920, 1080],
    square: [1080, 1080],
  }[outputAspectRatio];
  if (!fileIds.length) {
    res.status(400).json({ error: "Select at least one server-ready video." });
    return;
  }

  const records = await readMediaIndex();
  const recordById = new Map(records.map((record) => [record.fileId, record]));
  const sourceRecords = fileIds.map((fileId) => recordById.get(fileId)).filter((record): record is MediaRecord => Boolean(record));
  if (sourceRecords.length !== fileIds.length) {
    res.status(404).json({ error: "One or more selected videos are no longer available." });
    return;
  }
  const scopedRecords = [...sourceRecords];
  for (const overlayId of [logoFileId, webcamFileId, animationFileId]) {
    if (overlayId) {
      const overlayRecord = recordById.get(overlayId);
      if (!overlayRecord) {
        res.status(404).json({ error: "One of the selected overlays is no longer available." });
        return;
      }
      scopedRecords.push(overlayRecord);
    }
  }
  if (scopedRecords.some((record) =>
    record.licenseId
    && record.licenseId !== includedMediaLicenseId
    && licenseId
    && record.licenseId !== licenseId
  )) {
    res.status(403).json({ error: "Selected media belongs to another license workspace." });
    return;
  }

  const fileId = randomUUID();
  const listPath = path.join(mediaDir, `${fileId}.concat.txt`);
  const basePath = path.join(mediaDir, `${fileId}.base.mp4`);
  const destination = path.join(mediaDir, `${fileId}.mp4`);
  const repeatedSources = Array.from({ length: loopCount }, () => sourceRecords).flat();
  const concatLines = repeatedSources
    .map((record) => `file '${record.sourcePath.replaceAll("'", "'\\''")}'`)
    .join("\n");
  const estimatedDuration = repeatedSources.reduce((total, record) => total + parseDurationText(record.duration), 0);
  const context = { licenseId, licenseName, folderName };
  const wantsProgress = req.header("accept")?.includes("application/x-ndjson") === true;
  let streamStarted = false;
  const writeEvent = (event: unknown) => {
    if (!wantsProgress) return;
    if (!streamStarted) {
      streamStarted = true;
      res.status(200);
      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");
    }
    res.write(`${JSON.stringify(event)}\n`);
  };
  const writeProgress = (progress: number, phase: string) => {
    writeEvent({ type: "progress", progress: Math.max(0, Math.min(100, Math.round(progress))), phase });
  };

  try {
    writeProgress(2, "Preparing source playlist");
    await mkdir(mediaDir, { recursive: true });
    await writeFile(listPath, `${concatLines}\n`);
    const progressArgs = wantsProgress ? ["-progress", "pipe:1", "-nostats"] : [];
    await runFfmpeg([
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", listPath,
      "-map", "0:v:0",
      "-map", "0:a?",
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "18",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      ...progressArgs,
      basePath,
    ], (seconds) => {
      if (estimatedDuration > 0) writeProgress(4 + (seconds / estimatedDuration) * 30, "Building the main video");
    });

    const [width, height] = outputDimensions;
    const overlayInputs = [
      { id: logoFileId, kind: "logo" as const },
      { id: webcamFileId, kind: "webcam" as const },
      { id: animationFileId, kind: "animation" as const },
    ].filter((overlay): overlay is { id: string; kind: "logo" | "webcam" | "animation" } => Boolean(overlay.id));
    const mainFilters = [
      reverseVideo ? "reverse" : "",
      `scale=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}:force_original_aspect_ratio=${cropMode === "crop" ? "increase" : "decrease"}`,
      ...(cropMode === "crop" ? [`crop=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}`] : []),
      `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`,
      `hue=h=${hue}`,
    ].filter(Boolean).join(",");
    const filterParts: string[] = [
      `color=c=#061518:s=${width}x${height}:d=${Math.max(1, estimatedDuration)}[canvas]`,
      `[0:v]${mainFilters}[main]`,
      `[canvas][main]overlay=x='(W-w)/2+${Math.round(width * mainX / 100)}':y='(H-h)/2+${Math.round(height * mainY / 100)}'[base]`,
    ];
    let current = "[base]";
    overlayInputs.forEach(({ id: overlayId, kind }, index) => {
      const isLogo = kind === "logo";
      const input = `[${index + 1}:v]`;
      const scaled = `[overlay${index}]`;
      const next = `[composed${index}]`;
      const scale = isLogo
        ? `scale=iw*${overlayScale}:ih*${overlayScale}`
        : `scale=${Math.round(width * (kind === "animation" ? animationScale : webcamScale))}:-2`;
      const chroma = ((kind === "webcam" && chromaKeyTarget === "webcam") || (kind === "animation" && chromaKeyTarget === "animation")) && chromaKeyEnabled
        ? `,chromakey=${chromaKeyColor}:similarity=${chromaSimilarity}:blend=${chromaBlend}`
        : "";
      const position = isLogo
        ? overlayCoordinates(logoPosition, "main_w", "main_h")
        : kind === "animation"
          ? `(main_w-overlay_w)/2+${Math.round(width * animationX / 100)}:(main_h-overlay_h)/2+${Math.round(height * animationY / 100)}`
          : `(main_w-overlay_w)/2+${Math.round(width * webcamX / 100)}:(main_h-overlay_h)/2+${Math.round(height * webcamY / 100)}`;
      filterParts.push(`${input}${scale}${chroma}${scaled}`, `${current}${scaled}overlay=${position}:eof_action=repeat${next}`);
      current = next;
    });
    const animation = animationFilter(animationPreset, width, height);
    if (animation) {
      filterParts.push(`${current}${animation}[animated]`);
      current = "[animated]";
    }
    const ffmpegArgs = ["-y", "-i", basePath];
    overlayInputs.forEach(({ id: overlayId }) => {
      const record = recordById.get(overlayId);
      if (record?.filename.match(/\.(png|jpe?g|webp)$/i)) {
        ffmpegArgs.push("-loop", "1");
      } else {
        // Keep video overlays alive for the whole main composition. The output
        // duration is still bounded by the main video's estimated duration.
        ffmpegArgs.push("-stream_loop", "-1");
      }
      ffmpegArgs.push("-i", record?.sourcePath || "");
    });
    ffmpegArgs.push(
      "-filter_complex", `${filterParts.join(";")};${current}null[outv]`,
      "-map", "[outv]",
      "-map", "0:a?",
      ...(reverseVideo ? ["-af", "areverse"] : []),
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "18",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "192k",
      "-shortest",
      ...(estimatedDuration > 0 ? ["-t", String(estimatedDuration)] : []),
      "-movflags", "+faststart",
      ...progressArgs,
      destination,
    );
    writeProgress(36, "Composing overlays and encoding final video");
    await runFfmpeg(ffmpegArgs, (seconds) => {
      if (estimatedDuration > 0) writeProgress(36 + (seconds / estimatedDuration) * 62, "Composing overlays and encoding final video");
    });
    await unlink(basePath).catch(() => undefined);

    const finalPath = await finalizeMediaFile(fileId, destination, `${title}.mp4`, context);
    const fileStats = await stat(finalPath);
    await saveMediaRecord({
      fileId,
      filename: path.basename(finalPath),
      sourcePath: finalPath,
      playbackUrl: `/api/media/files/${fileId}`,
      title,
      duration: formatDuration(estimatedDuration),
      licenseId,
      licenseName,
      folderName,
      quality: "edited",
      createdAt: new Date().toISOString(),
      sizeBytes: fileStats.size,
    });
    const result = {
      fileId,
      filename: path.basename(finalPath),
      sourcePath: finalPath,
      playbackUrl: `/api/media/files/${fileId}`,
      duration: formatDuration(estimatedDuration),
    };
    if (wantsProgress) {
      writeProgress(100, "Render complete");
      writeEvent({ type: "complete", result });
      res.end();
      return;
    }
    res.status(201).json(result);
  } catch (error) {
    await unlink(listPath).catch(() => undefined);
    await unlink(basePath).catch(() => undefined);
    await unlink(destination).catch(() => undefined);
    req.log.warn({ error: error instanceof Error ? error.message : "unknown error" }, "Media compose failed");
    if (wantsProgress) {
      writeEvent({ type: "error", error: error instanceof Error ? error.message : "The edited video could not be created." });
      res.end();
      return;
    }
    res.status(400).json({ error: error instanceof Error ? error.message : "The edited video could not be created." });
  } finally {
    await unlink(listPath).catch(() => undefined);
  }
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
  if (
    sourceRecord?.licenseId
    && sourceRecord.licenseId !== includedMediaLicenseId
    && sourceRecord.licenseId !== licenseId
  ) {
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
  const record = (await readMediaIndex()).find((item) => item.fileId === req.params.fileId);
  const rawLicenseId = req.query.licenseId;
  const requestedLicenseId = typeof rawLicenseId === "string"
    ? rawLicenseId.trim()
    : Array.isArray(rawLicenseId)
      ? String(rawLicenseId.at(-1) || "").trim()
    : req.header("x-license-id")?.trim() || "";
  if (
    record?.licenseId
    && record.licenseId !== includedMediaLicenseId
    && record.licenseId !== requestedLicenseId
  ) {
    res.status(403).json({ error: "This video belongs to another license workspace." });
    return;
  }
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
  if (record?.licenseId === includedMediaLicenseId && !ownerAuthorized(req)) {
    res.status(403).json({ error: "Only the owner can remove included animations." });
    return;
  }
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