import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Router, type IRouter } from "express";
import { createHmac, randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import {
  DownloadYoutubeVideoBody,
  DownloadYoutubeVideoResponse,
  DownloadDirectVideoBody,
  DownloadDirectVideoResponse,
  ExtractYoutubeChannelLinksBody,
  ExtractYoutubeChannelLinksResponse,
  GetYoutubeFormatsBody,
  GetYoutubeFormatsResponse,
  ListMediaFilesResponse,
  TrimMediaFileBody,
  TrimMediaFileResponse,
} from "@workspace/api-zod";
import youtubeDl, { create as createYoutubeDl } from "youtube-dl-exec";
import ffmpegPath from "ffmpeg-static";

const router: IRouter = Router();
const mediaDir = path.resolve(process.cwd(), "attached_assets", "live-media");
const maxUploadBytes = 1.5 * 1024 * 1024 * 1024;
const youtubeDownloader = process.env.YT_DLP_BIN?.trim()
  ? createYoutubeDl(process.env.YT_DLP_BIN.trim())
  : youtubeDl;
const mediaIndexPath = path.join(mediaDir, "media-index.json");
const configuredYoutubeCookies = process.env.YOUTUBE_COOKIES?.trim();
const configuredYoutubeCookiesFile = process.env.YT_DLP_COOKIES_FILE?.trim();
let youtubeCookiesFilePromise: Promise<string | undefined> | undefined;
const youtubeBridgePath = path.resolve(process.cwd(), "youtube-downloader-bridge/bin/Release/net10.0/YoutubeDownloaderBridge.dll");

function normalizeYoutubeCookies(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return raw;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const cookies = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as { cookies?: unknown }).cookies)
        ? (parsed as { cookies: unknown[] }).cookies
        : null;
    if (!cookies) return raw;
    const lines = [
      "# Netscape HTTP Cookie File",
      ...cookies.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const cookie = item as {
          domain?: unknown; path?: unknown; name?: unknown; value?: unknown;
          expirationDate?: unknown; expires?: unknown; expiration?: unknown;
          hostOnly?: unknown; includeSubdomains?: unknown; secure?: unknown;
        };
        if (typeof cookie.domain !== "string" || typeof cookie.name !== "string" || typeof cookie.value !== "string") return [];
        const includeSubdomains = cookie.includeSubdomains === true || cookie.hostOnly !== true || cookie.domain.startsWith(".");
        const expiry = [cookie.expirationDate, cookie.expires, cookie.expiration]
          .map((value) => Number(value))
          .find((value) => Number.isFinite(value) && value > 0);
        return [[
          cookie.domain,
          includeSubdomains ? "TRUE" : "FALSE",
          typeof cookie.path === "string" && cookie.path ? cookie.path : "/",
          cookie.secure === true ? "TRUE" : "FALSE",
          expiry ? String(Math.floor(expiry)) : "0",
          cookie.name,
          cookie.value,
        ].join("\t")];
      }),
    ];
    return lines.join("\n");
  } catch {
    return raw;
  }
}

async function getYoutubeCookiesFile(): Promise<string | undefined> {
  if (configuredYoutubeCookiesFile) return configuredYoutubeCookiesFile;
  if (!configuredYoutubeCookies) return undefined;
  youtubeCookiesFilePromise ??= (async () => {
    const filePath = path.join("/tmp", `signal-desk-youtube-cookies-${randomUUID()}.txt`);
    await writeFile(filePath, normalizeYoutubeCookies(configuredYoutubeCookies), { encoding: "utf8", mode: 0o600 });
    return filePath;
  })();
  return youtubeCookiesFilePromise;
}

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

function slugify(value: string, fallback: string): string {
  const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56);
  return slug || fallback;
}

function storedMediaFilename(fileId: string, rawName: string, context: MediaContext): string {
  const extension = path.extname(rawName).toLowerCase() || ".mp4";
  const license = slugify(context.licenseName || context.licenseId || "workspace", "workspace");
  const folder = slugify(context.folderName || "media", "media");
  const title = slugify(path.basename(rawName, extension), "video");
  return `${fileId}__${license}__${folder}__${title}${extension}`;
}

async function finalizeMediaFile(fileId: string, currentPath: string, rawName: string, context: MediaContext): Promise<string> {
  const destination = path.join(mediaDir, storedMediaFilename(fileId, rawName, context));
  if (currentPath !== destination) {
    await unlink(destination).catch(() => undefined);
    await rename(currentPath, destination);
  }
  return destination;
}

async function findMediaFile(fileId: string): Promise<string | null> {
  if (!/^[a-f0-9-]+$/i.test(fileId)) return null;
  const files = await readdir(mediaDir).catch(() => []);
  const filename = files.find((entry) => entry.startsWith(`${fileId}.`) || entry.startsWith(`${fileId}__`));
  return filename ? path.join(mediaDir, filename) : null;
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

function normalizeDuration(value: unknown): string {
  if (typeof value === "number") return formatDuration(value);
  if (typeof value !== "string") return "00:00";
  const parts = value.trim().split(":").map(Number);
  if (parts.length < 2 || parts.some((part) => !Number.isFinite(part))) return "00:00";
  const [first, second, third] = parts;
  const seconds = parts.length === 3 ? first * 3600 + second * 60 + third : first * 60 + second;
  return formatDuration(seconds);
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

function isAllowedDirectMediaHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return normalized === "files.ytcontent.com"
    || normalized === "googlevideo.com"
    || normalized.endsWith(".googlevideo.com")
    || normalized === "youtube.com"
    || normalized.endsWith(".youtube.com");
}

function validateDirectMediaUrl(rawUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Enter a complete direct video URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || !isAllowedDirectMediaHost(parsed.hostname)) {
    throw new Error("Direct downloads support files.ytcontent.com and YouTube video file URLs.");
  }
  return parsed.toString();
}

function safeDirectFilename(response: Response): string {
  const disposition = response.headers.get("content-disposition") || "";
  const encodedName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plainName = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  const urlName = (() => {
    try {
      return decodeURIComponent(new URL(response.url).pathname.split("/").filter(Boolean).at(-1) || "");
    } catch {
      return "";
    }
  })();
  const candidate = (encodedName ? decodeURIComponent(encodedName) : plainName || urlName).trim();
  const cleaned = candidate.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").slice(0, 180);
  if (cleaned && /\.[a-z0-9]{2,5}$/i.test(cleaned)) return cleaned;
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  const extension = contentType.includes("webm") ? ".webm" : contentType.includes("quicktime") ? ".mov" : ".mp4";
  return `${cleaned || "direct-video"}${extension}`;
}

async function fetchDirectMedia(url: string): Promise<Response> {
  let currentUrl = validateDirectMediaUrl(url);
  for (let redirect = 0; redirect <= 5; redirect += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        accept: "video/*,application/octet-stream;q=0.9,*/*;q=0.1",
        "user-agent": "Mozilla/5.0 Signal Desk media downloader",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(60 * 60 * 1000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The direct video URL returned an invalid redirect.");
      currentUrl = validateDirectMediaUrl(new URL(location, currentUrl).toString());
      continue;
    }
    if (!response.ok) throw new Error(`Direct video download failed (${response.status}).`);
    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > maxUploadBytes) throw new Error("The direct video file is larger than 1.5 GB.");
    const contentType = response.headers.get("content-type")?.toLowerCase() || "";
    if (!contentType.startsWith("video/") && !contentType.includes("application/octet-stream")) {
      throw new Error("The direct URL did not return a video file.");
    }
    return response;
  }
  throw new Error("The direct video URL redirected too many times.");
}

async function downloadDirectVideo(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  await mkdir(mediaDir, { recursive: true });
  const response = await fetchDirectMedia(url);
  if (!response.body) throw new Error("The direct video response had no file content.");
  const rawName = safeDirectFilename(response);
  const partialPath = path.join(mediaDir, `${fileId}.part`);
  try {
    const readable = Readable.fromWeb(response.body as import("node:stream/web").ReadableStream);
    await pipeline(readable, createWriteStream(partialPath));
    const finalPath = await finalizeMediaFile(fileId, partialPath, rawName, context);
    return {
      path: finalPath,
      title: path.basename(rawName, path.extname(rawName)),
      duration: "00:00",
      quality: "direct",
    };
  } catch (error) {
    await unlink(partialPath).catch(() => undefined);
    throw error;
  }
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

type DownloadQuality = "best" | "2160p" | "1440p" | "1080p" | "720p" | "480p";

function qualityHeight(quality: DownloadQuality): number | undefined {
  return quality === "best" ? undefined : Number.parseInt(quality, 10);
}

function normalizeQualityLabel(value: string | undefined, fallback: string): string {
  const match = value?.match(/(\d{3,4})p?/i);
  return match ? `${match[1]}p` : fallback;
}

function youtubeFormat(quality: DownloadQuality): string {
  const height = qualityHeight(quality);
  // Prefer separate video/audio streams so yt-dlp does not silently fall back
  // to a low-resolution combined format when a higher stream is available.
  return height
    ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
    : "bestvideo+bestaudio/best";
}

async function downloadYoutubeVideo(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  await mkdir(mediaDir, { recursive: true });
  const outputPath = path.join(mediaDir, `${fileId}.mp4`);
  const requestedQuality = context.quality || "best";

  const result = await new Promise<{ title: string; duration: string; quality: string }>((resolve, reject) => {
    const child = spawn("dotnet", [youtubeBridgePath, url, outputPath, requestedQuality], {
      env: {
        ...process.env,
        ...(configuredYoutubeCookies ? { YOUTUBE_COOKIES: configuredYoutubeCookies } : {}),
        ...(ffmpegPath ? { FFMPEG_PATH: ffmpegPath } : {}),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
        try {
          const parsed = line ? JSON.parse(line) as { title?: unknown; duration?: unknown; quality?: unknown } : {};
          resolve({
            title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : "Downloaded YouTube video",
            duration: typeof parsed.duration === "string" ? parsed.duration : "00:00",
            quality: typeof parsed.quality === "string" ? parsed.quality : requestedQuality,
          });
        } catch {
          reject(new Error("The GitHub downloader returned invalid video metadata."));
        }
        return;
      }
      const detail = stderr.trim().split(/\r?\n/).filter(Boolean).at(-1) || "The GitHub YouTube downloader failed.";
      reject(new Error(detail.slice(-1200)));
    });
  });

  try {
    const title = result.title;
    const finalPath = await finalizeMediaFile(fileId, outputPath, title, context);
    return { path: finalPath, title, duration: result.duration, quality: result.quality };
  } catch (error) {
    await unlink(outputPath).catch(() => undefined);
    throw error;
  }
}

type YtSaveApi = {
  status?: string;
  message?: string;
  title?: string;
  progress?: string;
  fileName?: string;
  fileUrl?: string;
  mediaItems?: Array<{
    type?: string;
    mediaUrl?: string;
    mediaDuration?: string;
    mediaFileSize?: string;
    quality?: string;
  }>;
};

type YtSaveResponse = { api?: YtSaveApi };

const ytsaveBaseUrl = "https://ytsave.to";
const ytsaveUserAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36";
const ytsaveMintSecret = "bf735103af6bb295633270b05a7b0a42";

function updateYtSaveCookies(response: Response, current: string): string {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) return current;

  const values = new Map(
    current
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .filter(([name, value]) => name && value)
      .map(([name, ...value]) => [name, value.join("=")]),
  );
  for (const cookie of setCookie.split(/,(?=[^;,]+=)/)) {
    const [name, ...value] = cookie.split(";", 1)[0].trim().split("=");
    if (name && value.length) values.set(name, value.join("="));
  }
  return Array.from(values.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function ytsaveFetch(
  endpoint: string,
  options: { body?: string; cookies?: string; timeoutMs?: number } = {},
): Promise<{ response: Response; cookies: string }> {
  const response = await fetch(`${ytsaveBaseUrl}${endpoint}`, {
    method: options.body === undefined ? "GET" : "POST",
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: ytsaveBaseUrl,
      referer: `${ytsaveBaseUrl}/en2/`,
      "user-agent": ytsaveUserAgent,
      "x-requested-with": "XMLHttpRequest",
      ...(options.cookies ? { cookie: options.cookies } : {}),
    },
    ...(options.body === undefined ? {} : { body: options.body }),
    signal: AbortSignal.timeout(options.timeoutMs ?? 30_000),
  });
  return { response, cookies: updateYtSaveCookies(response, options.cookies ?? "") };
}

async function parseYtSaveResponse(response: Response): Promise<YtSaveResponse> {
  const raw = await response.text();
  let parsed: YtSaveResponse;
  try {
    parsed = JSON.parse(raw) as YtSaveResponse;
  } catch {
    throw new Error(`YTSave returned an invalid response (${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(parsed.api?.message || `YTSave request failed (${response.status}).`);
  }
  return parsed;
}

async function downloadViaYtSave(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  const landing = await ytsaveFetch("/en2/", { timeoutMs: 30_000 });
  const landingHtml = await landing.response.text();
  if (!landing.response.ok) throw new Error(`YTSave landing page failed (${landing.response.status}).`);

  const challenge = landingHtml.match(/data-ch="([^"]+)"/)?.[1];
  if (!challenge) throw new Error("YTSave did not provide its verification challenge.");
  const answer = createHmac("sha256", ytsaveMintSecret).update(challenge).digest("hex").slice(0, 32);
  const minted = await ytsaveFetch("/mint.php", {
    body: new URLSearchParams({ ch: challenge, answer }).toString(),
    cookies: landing.cookies,
    timeoutMs: 30_000,
  });
  const mintedJson = await parseYtSaveResponse(minted.response) as YtSaveResponse & { dt?: string };
  if (!mintedJson.dt) throw new Error("YTSave verification did not return a download token.");

  let cookies = minted.cookies;
  const details = await ytsaveFetch("/proxy.php", {
    body: new URLSearchParams({ url, dt: mintedJson.dt }).toString(),
    cookies,
    timeoutMs: 60_000,
  });
  cookies = details.cookies;
  const detailsJson = await parseYtSaveResponse(details.response);
  const api = detailsJson.api;
  const mediaItems = Array.isArray(api?.mediaItems) ? api.mediaItems : [];
   const videoOptions = mediaItems
     .filter((item) => item.type === "Video" && item.mediaUrl)
     .map((item) => ({
       item,
       height: Number(item.quality?.match(/\d{3,4}/)?.[0] || item.mediaUrl?.match(/(\d{3,4})p/i)?.[1] || 0),
     }))
     .sort((a, b) => b.height - a.height);
  const requestedHeight = qualityHeight((context.quality || "best") as DownloadQuality);
   const selectedOptions = requestedHeight
     ? videoOptions.filter((option) => !option.height || option.height <= requestedHeight)
     : videoOptions;
   const video = (selectedOptions[0] || videoOptions[0])?.item;
  if (api?.status !== "ok" || !video?.mediaUrl) {
    throw new Error(api?.message || "YTSave could not prepare this YouTube video. The fallback provider returned no downloadable formats.");
  }

  let completed: YtSaveApi | undefined;
  for (let attempt = 0; attempt < 900; attempt += 1) {
    const poll = await ytsaveFetch("/proxy.php", {
      body: new URLSearchParams({ url: video.mediaUrl, dt: mintedJson.dt }).toString(),
      cookies,
      timeoutMs: 60_000,
    });
    cookies = poll.cookies;
    const pollApi = (await parseYtSaveResponse(poll.response)).api;
    if (pollApi?.status === "completed" && pollApi.fileUrl) {
      completed = pollApi;
      break;
    }
    if (pollApi?.status === "error") {
      throw new Error(pollApi.message || "YTSave could not render the selected quality.");
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  if (!completed?.fileUrl) throw new Error("YTSave took too long to prepare the video.");

  const fileResponse = await fetch(completed.fileUrl, {
    headers: { referer: `${ytsaveBaseUrl}/en2/`, "user-agent": ytsaveUserAgent },
    signal: AbortSignal.timeout(60 * 60 * 1000),
  });
  if (!fileResponse.ok || !fileResponse.body) {
    throw new Error(`YTSave file download failed (${fileResponse.status}).`);
  }

  const destination = path.join(mediaDir, `${fileId}.mp4`);
  const readable = Readable.fromWeb(fileResponse.body as import("node:stream/web").ReadableStream);
  try {
    await pipeline(readable, createWriteStream(destination));
  } catch (error) {
    await unlink(destination).catch(() => undefined);
    throw error;
  }

  const title = api.title?.trim() || "Downloaded YouTube video";
  const finalPath = await finalizeMediaFile(fileId, destination, title, context);
  return {
    path: finalPath,
    title,
    duration: normalizeDuration(video.mediaDuration),
    quality: normalizeQualityLabel(video.quality || video.mediaUrl?.match(/(\d{3,4})p/i)?.[1], context.quality || "best"),
  };
}

async function inspectYoutubeFormats(url: string): Promise<{ qualities: string[]; title: string }> {
  return await new Promise((resolve, reject) => {
    const child = spawn("dotnet", [youtubeBridgePath, "--formats", url], {
      env: {
        ...process.env,
        ...(configuredYoutubeCookies ? { YOUTUBE_COOKIES: configuredYoutubeCookies } : {}),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim().split(/\r?\n/).filter(Boolean).at(-1) || "YouTube qualities could not be loaded."));
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "{}") as { qualities?: unknown; title?: unknown };
        resolve({
          qualities: Array.isArray(parsed.qualities) ? parsed.qualities.filter((quality): quality is string => typeof quality === "string") : ["best"],
          title: typeof parsed.title === "string" ? parsed.title : "YouTube video",
        });
      } catch {
        reject(new Error("The GitHub downloader returned invalid quality data."));
      }
    });
  });
}

router.get("/media/files", async (req, res): Promise<void> => {
  await mediaIndexWrite;
  const records = await readMediaIndex();
  const indexed = new Map(records.map((record) => [record.fileId, record]));
  const files = await readdir(mediaDir).catch(() => []);
  const result: MediaRecord[] = [];
  for (const filename of files) {
    if (filename === "media-index.json" || filename.endsWith(".part") || !/\.(mp4|mov|m4v|webm|mkv|avi|ts)$/i.test(filename)) continue;
    const fileId = filename.match(/^([a-f0-9-]{8,})(?:\.|__)/i)?.[1];
    if (!fileId) continue;
    const filePath = path.join(mediaDir, filename);
    const fileStats = await stat(filePath).catch(() => null);
    if (!fileStats) continue;
    const current = indexed.get(fileId);
    result.push(current ? { ...current, filename, sourcePath: filePath, sizeBytes: fileStats.size } : {
      fileId,
      filename,
      sourcePath: filePath,
      playbackUrl: `/api/media/files/${fileId}`,
      title: filename.includes("__")
        ? filename.replace(/^([a-f0-9-]{8,})__[^_]+__[^_]+__(.*?)(?:\.[^.]+)?$/i, "$2").replace(/[-_]+/g, " ")
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
  const filtered = licenseId ? result.filter((file) => !file.licenseId || file.licenseId === licenseId) : result;
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
  const filename = storedMediaFilename(fileId, rawName, context);
  const destination = path.join(mediaDir, filename);
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
      title: path.basename(rawName, path.extname(rawName)),
      duration: "00:00",
      licenseId: context.licenseId || "",
      licenseName: context.licenseName || "",
      folderName: context.folderName || "",
      quality: "uploaded",
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
    const url = validateYoutubeUrl(parsed.data.url.trim());
    const fileId = randomUUID();
    const context: MediaContext = {
      quality: parsed.data.quality,
      licenseId: parsed.data.licenseId,
      licenseName: parsed.data.licenseName,
      folderName: parsed.data.folderName,
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
    res.status(201).json(DownloadYoutubeVideoResponse.parse({
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
    }));
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "The YouTube video could not be downloaded.";
    const errorCode = error instanceof Error ? (error as NodeJS.ErrnoException).code : undefined;
    const missingDownloader = errorCode === "ENOENT" || rawMessage.includes("spawn yt-dlp ENOENT");
    const blockedByYoutube = rawMessage.includes("Sign in to confirm") || rawMessage.includes("not a bot");
    const message = missingDownloader
      ? "The bundled YouTube downloader is unavailable. Redeploy the latest build and try again."
      : blockedByYoutube
        ? "YouTube is blocking this video for the server. Add an authorized Netscape cookies file as the YOUTUBE_COOKIES secret, or upload the video directly from Video Library. Private, age-restricted, region-restricted, and newly blocked videos require an authorized YouTube session."
        : rawMessage;
    req.log.warn({ error: message }, "YouTube download failed");
    res.status(missingDownloader ? 503 : 400).json({ error: message });
  }
});

router.post("/media/direct-download", async (req, res): Promise<void> => {
  try {
    const parsed = DownloadDirectVideoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const fileId = randomUUID();
    const context: MediaContext = {
      licenseId: parsed.data.licenseId,
      licenseName: parsed.data.licenseName,
      folderName: parsed.data.folderName,
    };
    const result = await downloadDirectVideo(parsed.data.url.trim(), fileId, context);
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
    res.status(201).json(DownloadDirectVideoResponse.parse({
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
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The direct video could not be downloaded.";
    req.log.warn({ error: message }, "Direct media download failed");
    res.status(400).json({ error: message });
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