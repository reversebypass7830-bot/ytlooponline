import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Router, type IRouter } from "express";
import { randomUUID } from "node:crypto";
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
import ffmpegPath from "ffmpeg-static";
import { bgutilPluginDir, bgutilPotBaseUrl } from "../lib/bgutilPotProvider";

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
    await rename(currentPath, destination);
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

function normalizeQualityLabel(value: string | undefined, fallback: string): string {
  const match = value?.match(/(\d{3,4})p?/i);
  return match ? `${match[1]}p` : fallback;
}

const YTDLP_PLAYER_CLIENT_FALLBACKS = [
  "youtube:player_client=mweb",
  "youtube:player_client=ios",
  "youtube:player_client=android",
  "youtube:player_client=web_safari",
  "youtube:player_client=default,-web,-web_safari",
];
const YTDLP_BGUTIL_ARGS = ["--extractor-args", `youtubepot-bgutilhttp:base_url=${bgutilPotBaseUrl()}`];
const YTDLP_DOWNLOAD_TIMEOUT_MS = 60 * 60 * 1000;

type YtDlpCommand = {
  executable: string;
  prefixArgs: string[];
  label: string;
  supportsCurlCffi: boolean;
};

function ytDlpSourceCandidates(): string[] {
  return [
    process.env.YT_DLP_REPO,
    path.resolve(process.cwd(), "yt-dlp", "yt_dlp", "__main__.py"),
    path.resolve(process.cwd(), "..", "..", "yt-dlp", "yt_dlp", "__main__.py"),
  ].filter((candidate): candidate is string => Boolean(candidate));
}

function preferredPython(): string {
  const configured = process.env.PYTHON_PATH?.trim();
  if (configured) return configured;

  const workspacePython = path.resolve(process.cwd(), ".pythonlibs", "bin", "python");
  if (existsSync(workspacePython)) return workspacePython;

  return "python3";
}

function pythonSupportsCurlCffi(executable: string): boolean {
  const result = spawnSync(executable, ["-c", "import curl_cffi"], {
    stdio: "ignore",
    windowsHide: true,
  });
  return result.status === 0;
}

function resolveYtDlpCommand(): YtDlpCommand {
  const configured = process.env.YT_DLP_PATH?.trim();
  if (configured && existsSync(configured)) {
    return configured.endsWith(".py")
      ? {
          executable: preferredPython(),
          prefixArgs: [configured],
          label: configured,
          supportsCurlCffi: pythonSupportsCurlCffi(preferredPython()),
        }
      : { executable: configured, prefixArgs: [], label: configured, supportsCurlCffi: false };
  }

  const source = ytDlpSourceCandidates()
    .map((candidate) => candidate.endsWith(".py") ? candidate : path.join(candidate, "yt_dlp", "__main__.py"))
    .find((candidate) => existsSync(candidate));
  if (source) {
    const executable = preferredPython();
    return {
      executable,
      prefixArgs: [source],
      label: source,
      supportsCurlCffi: pythonSupportsCurlCffi(executable),
    };
  }

  const binary = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
  return { executable: binary, prefixArgs: [], label: binary, supportsCurlCffi: false };
}

type BrowserCookie = {
  domain?: unknown;
  hostOnly?: unknown;
  path?: unknown;
  secure?: unknown;
  httpOnly?: unknown;
  name?: unknown;
  value?: unknown;
  expirationDate?: unknown;
  expires?: unknown;
  expiration?: unknown;
};

function normalizeCookieText(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return rawText;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return rawText;
  }

  const cookies = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { cookies?: unknown }).cookies)
      ? (parsed as { cookies: unknown[] }).cookies
      : [];
  if (!cookies.length) return rawText;

  const lines = cookies.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const cookie = item as BrowserCookie;
    const domainValue = typeof cookie.domain === "string" ? cookie.domain.trim() : "";
    const name = typeof cookie.name === "string" ? cookie.name : "";
    if (!domainValue || !name) return [];

    const domain = cookie.httpOnly === true && !domainValue.startsWith("#HttpOnly_")
      ? `#HttpOnly_${domainValue}`
      : domainValue;
    const includeSubdomains = cookie.hostOnly === true
      ? "FALSE"
      : cookie.hostOnly === false || domainValue.startsWith(".") ? "TRUE" : "FALSE";
    const cookiePath = typeof cookie.path === "string" && cookie.path ? cookie.path : "/";
    const secure = cookie.secure === true ? "TRUE" : "FALSE";
    const rawExpiration = cookie.expirationDate ?? cookie.expires ?? cookie.expiration;
    const numericExpiration = Number(rawExpiration);
    const expiration = Number.isFinite(numericExpiration) && numericExpiration > 0
      ? String(Math.floor(numericExpiration > 100_000_000_000 ? numericExpiration / 1000 : numericExpiration))
      : "0";
    const value = typeof cookie.value === "string" ? cookie.value.replace(/[\r\n\t]/g, "") : "";
    return [`${domain}\t${includeSubdomains}\t${cookiePath}\t${secure}\t${expiration}\t${name}\t${value}`];
  });
  return lines.length ? `# Netscape HTTP Cookie File\n${lines.join("\n")}\n` : rawText;
}

async function createYtDlpCookieFile(): Promise<{ path?: string; cleanup: () => Promise<void> }> {
  const configuredPath = process.env.YT_DLP_COOKIES_FILE?.trim();
  const configuredCookies = process.env.YOUTUBE_COOKIES?.trim();
  const workspaceCookiePaths = [
    path.resolve(process.cwd(), "cookies.txt"),
    path.resolve(process.cwd(), "cokkies.txt"),
    path.resolve(process.cwd(), "..", "..", "cookies.txt"),
    path.resolve(process.cwd(), "..", "..", "cokkies.txt"),
  ];
  const cookieSources = [configuredPath, ...workspaceCookiePaths, configuredCookies]
    .filter((value): value is string => Boolean(value));
  if (!cookieSources.length) return { cleanup: async () => undefined };

  let cookieText = "";
  for (const source of cookieSources) {
    try {
      const sourceStats = await stat(source);
      if (sourceStats.isFile()) {
        cookieText = normalizeCookieText(await readFile(source, "utf8"));
        break;
      }
    } catch {
      if (source === configuredCookies) cookieText = normalizeCookieText(source);
    }
  }
  if (!cookieText.trim()) return { cleanup: async () => undefined };

  const cookieDirectory = path.join("/tmp", `yt-dlp-youtube-cookies-${randomUUID()}`);
  const cookiePath = path.join(cookieDirectory, "cookies.txt");
  try {
    await mkdir(cookieDirectory, { recursive: true, mode: 0o700 });
    await writeFile(cookiePath, cookieText, { encoding: "utf8", mode: 0o600 });
  } catch (error) {
    await rm(cookieDirectory, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
  return {
    path: cookiePath,
    cleanup: () => rm(cookieDirectory, { recursive: true, force: true }).catch(() => undefined),
  };
}

function ytDlpFormatSelector(quality: DownloadQuality): string {
  const height = quality === "best" ? undefined : Number.parseInt(quality, 10);
  return height
    ? `bv*[height<=${height}]+ba/b[height<=${height}]/b`
    : "bv*+ba/b";
}

type YtDlpRun = {
  code: number;
  stdout: string;
  stderr: string;
};

function runYtDlp(command: YtDlpCommand, args: string[]): Promise<YtDlpRun> {
  return new Promise((resolve, reject) => {
    const childEnv = { ...process.env };
    delete childEnv.YOUTUBE_COOKIES;
    const child = spawn(command.executable, [...command.prefixArgs, ...args], {
      env: { ...childEnv, ...(ffmpegPath ? { PATH: `${path.dirname(ffmpegPath)}${path.delimiter}${process.env.PATH || ""}` } : {}) },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      if (!settled) {
        settled = true;
        resolve({ code: -1, stdout, stderr: `${stderr}\nyt-dlp timed out.` });
      }
    }, YTDLP_DOWNLOAD_TIMEOUT_MS);
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.once("error", (error) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      reject(error);
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      if (settled) return;
      settled = true;
      resolve({ code: code ?? -1, stdout, stderr });
    });
  });
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  for (const line of stdout.trim().split(/\r?\n/).reverse()) {
    try {
      const parsed = JSON.parse(line) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      // Progress output can contain non-JSON lines before --print-json.
    }
  }
  return {};
}

function shouldTryYtDlpFallback(stderr: string): boolean {
  return /bot|sign in|not available on this app|player response|requested format|po token|page needs to be reloaded/i.test(stderr);
}

function withYtDlpFormat(args: string[], selector: string): string[] {
  const formatIndex = args.indexOf("--format");
  if (formatIndex === -1 || formatIndex === args.length - 1) return args;
  return [
    ...args.slice(0, formatIndex),
    "--format",
    selector,
    ...args.slice(formatIndex + 2),
  ];
}

async function downloadViaYtDlp(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  const requestedQuality = (context.quality || "best") as DownloadQuality;
  const command = resolveYtDlpCommand();
  const cookie = await createYtDlpCookieFile();
  const destination = path.join(mediaDir, `${fileId}.mp4`);
  const pluginDir = bgutilPluginDir();
  const baseArgs = [
    "--no-playlist",
    "--no-warnings",
    "--newline",
    "--js-runtimes", "node",
    ...(command.supportsCurlCffi ? ["--impersonate", "chrome"] : []),
    ...(pluginDir ? ["--plugin-dirs", pluginDir, ...YTDLP_BGUTIL_ARGS] : []),
    "--print-json",
    "--format", ytDlpFormatSelector(requestedQuality),
    "--merge-output-format", "mp4",
    "--output", destination,
    "--retries", "20",
    "--fragment-retries", "20",
    "--retry-sleep", "fragment:exp=1:20",
    "--abort-on-unavailable-fragments",
    "--ffmpeg-location", ffmpegPath ? path.dirname(ffmpegPath) : "ffmpeg",
    ...(cookie.path ? ["--cookies", cookie.path] : []),
    url,
  ];
  await mkdir(mediaDir, { recursive: true });
  try {
    let result = await runYtDlp(command, baseArgs);
    if (result.code !== 0 && shouldTryYtDlpFallback(result.stderr)) {
      const fallbackBaseArgs = baseArgs.slice(0, -1);
      for (const playerClient of YTDLP_PLAYER_CLIENT_FALLBACKS) {
        result = await runYtDlp(command, [
          ...fallbackBaseArgs,
          "--extractor-args", playerClient,
          url,
        ]);
        if (result.code === 0) break;
        if (/requested format/i.test(result.stderr)) {
          result = await runYtDlp(command, [
            ...withYtDlpFormat(fallbackBaseArgs, "b/best"),
            "--extractor-args", playerClient,
            url,
          ]);
          if (result.code === 0) break;
        }
      }
    }
    if (result.code !== 0) {
      const detail = result.stderr.trim().split(/\r?\n/).filter(Boolean).at(-1)
        || `yt-dlp could not download this YouTube video using ${command.label}.`;
      throw new Error(detail.slice(-1200));
    }
    const metadata = lastJsonLine(result.stdout);
    const title = typeof metadata.title === "string" && metadata.title.trim() ? metadata.title.trim() : "Downloaded YouTube video";
    const durationValue = typeof metadata.duration_string === "string" ? metadata.duration_string : metadata.duration;
    const duration = typeof durationValue === "string" ? normalizeDuration(durationValue) : formatDuration(durationValue);
    const quality = typeof metadata.height === "number" && metadata.height > 0
      ? `${metadata.height}p`
      : normalizeQualityLabel(typeof metadata.resolution === "string" ? metadata.resolution : undefined, requestedQuality);
    const finalPath = await finalizeMediaFile(fileId, destination, title, context);
    return { path: finalPath, title, duration, quality };
  } catch (error) {
    await unlink(destination).catch(() => undefined);
    throw error;
  } finally {
    await cookie.cleanup();
  }
}

async function downloadYoutubeVideo(
  url: string,
  fileId: string,
  context: MediaContext,
): Promise<{ path: string; title: string; duration: string; quality: string }> {
  return downloadViaYtDlp(url, fileId, context);
}

async function inspectYoutubeFormats(url: string): Promise<{ qualities: string[]; title: string }> {
  validateYoutubeUrl(url);
  return {
    qualities: ["best", "2160p", "1440p", "1080p", "720p", "480p"],
    title: "YouTube video",
  };
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
    const message = rawMessage.includes("sign in") || rawMessage.includes("not a bot") || rawMessage.includes("bot")
      ? "YouTube rejected this server request. The local open-source PO-token provider was tried automatically; optional YOUTUBE_COOKIES can help with account-restricted videos, or try a direct video URL."
      : rawMessage;
    req.log.warn({ error: message }, "YouTube download failed");
    res.status(400).json({ error: message });
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