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
  return parsed.toString();
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
  return height ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]` : "bestvideo*+bestaudio/best";
}

async function downloadYoutubeVideo(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  await mkdir(mediaDir, { recursive: true });
  const outputTemplate = path.join(mediaDir, `${fileId}.%(ext)s`);
  const clients = ["android", "web_embedded", "mweb", "ios"];
  const requestedQuality = (context.quality || "best") as DownloadQuality;
  let lastError = "YouTube video download failed.";

  for (const client of clients) {
    await Promise.all(
      (await readdir(mediaDir).catch(() => []))
         .filter((entry) => entry.startsWith(`${fileId}.`) || entry.startsWith(`${fileId}__`))
        .map((entry) => unlink(path.join(mediaDir, entry)).catch(() => undefined)),
    );

    try {
      const result = await new Promise<{ title: string; duration: string; quality: string }>((resolve, reject) => {
        const flags = ({
          noPlaylist: true,
          noWarnings: true,
          noProgress: true,
           retries: 2,
           fragmentRetries: 2,
           fileAccessRetries: 2,
           socketTimeout: 20,
           concurrentFragments: 8,
           httpChunkSize: "10M",
           bufferSize: "16K",
          extractorArgs: `youtube:player_client=${client}`,
           format: youtubeFormat(requestedQuality),
          mergeOutputFormat: "mp4",
          ffmpegLocation: ffmpegPath ?? undefined,
          output: outputTemplate,
          printJson: true,
        } as unknown) as Parameters<typeof youtubeDownloader.exec>[1];
        const child = youtubeDownloader.exec(url, flags);
        const promiseLike = child as typeof child & { catch?: (handler: () => void) => unknown };
        promiseLike.catch?.(() => undefined);
        let stdout = "";
        let stderr = "";
        child.stdout?.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
        child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
        child.on("error", (error) => reject(error));
        child.on("close", async (code) => {
          if (code !== 0) {
            reject(new Error(stderr.trim().split("\n").filter(Boolean).at(-1) || "YouTube download failed."));
            return;
          }
          const info = stdout.split(/\r?\n/).map((line) => {
            try { return JSON.parse(line) as { title?: unknown; duration?: unknown; height?: unknown }; } catch { return null; }
          }).find(Boolean);
          resolve({
            title: typeof info?.title === "string" && info.title.trim() ? info.title.trim() : "Downloaded YouTube video",
            duration: formatDuration(info?.duration),
            quality: typeof info?.height === "number" ? `${info.height}p` : requestedQuality,
          });
        });
      });

      const files = await readdir(mediaDir).catch(() => []);
       const filename = files.find((entry) => (entry.startsWith(`${fileId}.`) || entry.startsWith(`${fileId}__`)) && !entry.endsWith(".part"));
      if (!filename) throw new Error("YouTube download finished without creating a video file.");
       const title = result.title;
       const finalPath = await finalizeMediaFile(fileId, path.join(mediaDir, filename), title, context);
      return {
         path: finalPath,
         title,
        duration: result.duration,
         quality: result.quality,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "YouTube video download failed.";
      if (lastError.includes("Sign in to confirm") || lastError.includes("not a bot")) break;
    }
  }

  try {
    return await downloadViaYtSave(url, fileId, context);
  } catch (error) {
    const fallbackError = error instanceof Error ? error.message : "YTSave fallback failed.";
    throw new Error(`${lastError} YTSave fallback: ${fallbackError}`);
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
  const videoOptions = api?.mediaItems?.filter((item) => item.type === "Video" && item.mediaUrl) ?? [];
  const requestedHeight = qualityHeight((context.quality || "best") as DownloadQuality);
  const video = videoOptions.find((item) => {
    const label = item.quality || item.mediaUrl?.match(/(\d{3,4})p/i)?.[1];
    return requestedHeight ? Number(label) <= requestedHeight : true;
  }) || videoOptions[0];
  if (api?.status !== "ok" || !video?.mediaUrl) {
    throw new Error(api?.message || "YTSave could not prepare this YouTube video.");
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
  const clients = ["android", "web_embedded"];
  let lastError = "Could not inspect YouTube qualities.";
  for (const client of clients) {
    try {
      const result = await new Promise<{ qualities: string[]; title: string }>((resolve, reject) => {
        const flags = ({
          noPlaylist: true,
          noWarnings: true,
          skipDownload: true,
          dumpSingleJson: true,
          socketTimeout: 20,
          extractorArgs: `youtube:player_client=${client}`,
          format: "best",
        } as unknown) as Parameters<typeof youtubeDownloader.exec>[1];
        const child = youtubeDownloader.exec(url, flags);
        const promiseLike = child as typeof child & { catch?: (handler: () => void) => unknown };
        promiseLike.catch?.(() => undefined);
        let stdout = "";
        let stderr = "";
        child.stdout?.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
        child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
        child.on("error", reject);
        child.on("close", (code) => {
          if (code !== 0) {
            reject(new Error(stderr.trim().split(/\r?\n/).filter(Boolean).at(-1) || lastError));
            return;
          }
          try {
            const info = JSON.parse(stdout) as { title?: unknown; formats?: Array<{ vcodec?: string; height?: number }> };
            const heights = Array.from(new Set((info.formats || [])
              .filter((format) => format.vcodec && format.vcodec !== "none" && Number.isFinite(format.height))
              .map((format) => Number(format.height))))
              .sort((a, b) => b - a);
            resolve({
              qualities: ["best", ...heights.map((height) => `${height}p`).filter((quality) => ["2160p", "1440p", "1080p", "720p", "480p"].includes(quality))],
              title: typeof info.title === "string" ? info.title : "YouTube video",
            });
          } catch {
            reject(new Error("YouTube returned invalid quality data."));
          }
        });
      });
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  throw new Error(lastError);
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
        ? "YouTube is blocking this video for the server right now. Try another public video, or upload the video file directly from Video Library. Private, age-restricted, region-restricted, and newly blocked videos need an authorized YouTube session."
        : rawMessage;
    req.log.warn({ error: message }, "YouTube download failed");
    res.status(missingDownloader ? 503 : 400).json({ error: message });
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
  const destination = path.join(mediaDir, `${fileId}.mp4`);
  try {
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

    res.status(201).json(TrimMediaFileResponse.parse({
      fileId,
      filename: path.basename(destination),
      sourcePath: destination,
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