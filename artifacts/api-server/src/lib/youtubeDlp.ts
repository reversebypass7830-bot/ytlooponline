import { spawn } from "node:child_process";
import { appendFile, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type YoutubeDlpFormat = {
  height?: unknown;
  ext?: unknown;
  vcodec?: unknown;
  acodec?: unknown;
  filesize?: unknown;
  filesize_approx?: unknown;
};

type DirectProxyVideo = {
  url?: unknown;
  quality?: unknown;
  ext?: unknown;
  fileSize?: unknown;
  size?: unknown;
};

type DirectProxyPayload = {
  ok?: unknown;
  title?: unknown;
  duration?: unknown;
  video?: unknown;
};

export type YoutubeDlpInfo = {
  title: string;
  duration: number;
  formats: YoutubeDlpFormat[];
};

export type YoutubeDlpDownload = {
  path: string;
  tempDir: string;
  info: YoutubeDlpInfo;
  quality: string;
};

const commandTimeoutMs = 20 * 60 * 1000;
const fallbackCommandTimeoutMs = 2 * 60 * 1000;
const directProxyChunkSize = 1 * 1024 * 1024;
const directProxyRequestTimeoutMs = 45 * 1000;
const maxOutputBytes = 12 * 1024 * 1024;
const videoExtensions = new Set([".mp4", ".webm", ".mkv", ".mov", ".m4v", ".avi", ".ts"]);
const proxyFailureCooldownMs = 2 * 60 * 1000;
const defaultProxyAttempts = 1;
const directProxyBaseUrl = "https://yt-download-proxy-cqkedn65a-dev-e6b8.vercel.app/api/download";
let proxyCursor = 0;
const proxyFailures = new Map<string, number>();

function ytdlpCommand(): string {
  return process.env.YTDLP_PATH?.trim() || process.env.YTDLP_MCP_YTDLP_PATH?.trim() || "yt-dlp";
}

function normalizeCookieSecret(raw: string): string {
  const value = raw.trim();
  if (!value) throw new Error("The YouTube cookies secret is empty.");
  if (value.startsWith("# Netscape") || value.startsWith("# HTTP Cookie File")) {
    return value.endsWith("\n") ? value : `${value}\n`;
  }
  if (!value.startsWith("[") && !value.startsWith("{")) return value.endsWith("\n") ? value : `${value}\n`;

  let cookies: unknown;
  try {
    cookies = JSON.parse(value);
  } catch {
    throw new Error("The YouTube cookies secret is not valid cookie JSON.");
  }
  if (!Array.isArray(cookies) && cookies && typeof cookies === "object" && Array.isArray((cookies as { cookies?: unknown }).cookies)) {
    cookies = (cookies as { cookies: unknown[] }).cookies;
  }
  if (typeof cookies === "string") {
    return normalizeCookieSecret(cookies);
  }
  if (!Array.isArray(cookies) || !cookies.length) {
    throw new Error("The YouTube cookies secret does not contain any cookies.");
  }

  const lines = ["# Netscape HTTP Cookie File", "# Generated in memory for yt-dlp; never persisted with the secret."];
  for (const item of cookies) {
    if (!item || typeof item !== "object") continue;
    const cookie = item as {
      domain?: unknown;
      hostOnly?: unknown;
      path?: unknown;
      secure?: unknown;
      httpOnly?: unknown;
      expirationDate?: unknown;
      name?: unknown;
      value?: unknown;
    };
    if (typeof cookie.domain !== "string" || typeof cookie.name !== "string" || typeof cookie.value !== "string") continue;
    const domain = cookie.domain.trim();
    if (!domain) continue;
    const includeSubdomains = cookie.hostOnly === true ? "FALSE" : "TRUE";
    const cookiePath = typeof cookie.path === "string" && cookie.path ? cookie.path : "/";
    const secure = cookie.secure === true ? "TRUE" : "FALSE";
    const expiration = typeof cookie.expirationDate === "number" && Number.isFinite(cookie.expirationDate)
      ? String(Math.max(0, Math.floor(cookie.expirationDate)))
      : "0";
    const netscapeDomain = cookie.httpOnly === true ? `#HttpOnly_${domain}` : domain;
    lines.push([netscapeDomain, includeSubdomains, cookiePath, secure, expiration, cookie.name, cookie.value.replace(/[\r\n\t]/g, "")].join("\t"));
  }
  if (lines.length === 2) throw new Error("The YouTube cookies secret contains no usable cookies.");
  return `${lines.join("\n")}\n`;
}

async function withCookieFile<T>(callback: (cookiePath: string) => Promise<T>): Promise<T> {
  const secret = process.env.YOUTUBE_COOKIES;
  if (!secret?.trim()) {
    throw new Error("YouTube downloads require the YOUTUBE_COOKIES secret.");
  }
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "signal-desk-youtube-cookies-"));
  const cookiePath = path.join(tempDir, "cookies.txt");
  try {
    await writeFile(cookiePath, normalizeCookieSecret(secret), { mode: 0o600 });
    return await callback(cookiePath);
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

const extractorStrategies: Array<string | undefined> = [
  undefined,
  "youtube:player_client=default,-web,-web_safari",
  "youtube:player_client=android",
];

async function loadYoutubeProxies(): Promise<string[]> {
  const configuredPath = process.env.YOUTUBE_PROXY_FILE?.trim();
  const candidatePaths = configuredPath
    ? [path.resolve(configuredPath)]
    : [
        path.resolve(process.cwd(), "proxy.txt"),
        path.resolve(process.cwd(), "../../proxy.txt"),
      ];
  let proxyPath = candidatePaths[0];
  let raw = "";
  for (const candidatePath of candidatePaths) {
    const candidateRaw = await readFile(candidatePath, "utf8").catch(() => "");
    if (!candidateRaw.trim()) continue;
    proxyPath = candidatePath;
    raw = candidateRaw;
    break;
  }
  const proxies = new Set<string>();

  for (const line of raw.split(/\r?\n/)) {
    const candidate = line.trim();
    if (!candidate || candidate.startsWith("#")) continue;
    try {
      const parsed = new URL(candidate);
      if (!["http:", "https:", "socks4:", "socks5:"].includes(parsed.protocol)) continue;
      if (!parsed.hostname || !parsed.port) continue;
      proxies.add(parsed.toString());
    } catch {
      // Ignore malformed entries and continue with the rest of the pool.
    }
  }

  if (!proxies.size) {
    throw new Error(`The YouTube proxy list is missing or empty: ${proxyPath}`);
  }
  return Array.from(proxies);
}

function proxyAttemptLimit(proxyCount: number): number {
  const configured = Number.parseInt(process.env.YOUTUBE_PROXY_MAX_ATTEMPTS || "", 10);
  const limit = Number.isFinite(configured) && configured > 0 ? configured : defaultProxyAttempts;
  return Math.min(limit, proxyCount);
}

function directProxyUrl(): string {
  return process.env.YOUTUBE_DOWNLOAD_PROXY_URL?.trim() || directProxyBaseUrl;
}

function directProxyHeight(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;
  const normalized = value.trim().toLowerCase();
  if (normalized === "4k") return 2160;
  if (normalized === "2k") return 1440;
  const match = normalized.match(/(\d{3,4})p?/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

async function fetchDirectProxyPayload(url: string): Promise<{ payload: DirectProxyPayload; videos: DirectProxyVideo[] }> {
  const endpoint = `${directProxyUrl()}?url=${encodeURIComponent(url)}`;
  const response = await fetch(endpoint, {
    headers: { accept: "application/json", "user-agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(45_000),
  });
  const payload = await response.json().catch(() => ({})) as DirectProxyPayload & { error?: unknown };
  if (!response.ok || payload.ok === false) {
    const detail = typeof payload.error === "string" ? payload.error : `HTTP ${response.status}`;
    throw new Error(`YouTube link resolver failed: ${detail}`);
  }
  const videos = Array.isArray(payload.video)
    ? payload.video.filter((item): item is DirectProxyVideo => Boolean(item && typeof item === "object" && typeof (item as DirectProxyVideo).url === "string"))
    : [];
  if (!videos.length) throw new Error("The YouTube link resolver returned no video streams.");
  return { payload, videos };
}

function selectDirectProxyVideo(videos: DirectProxyVideo[], requested: string): DirectProxyVideo {
  const requestedHeight = requested === "best" ? Number.POSITIVE_INFINITY : directProxyHeight(requested);
  const ranked = videos
    .map((video, index) => ({ video, index, height: directProxyHeight(video.quality) }))
    .filter((item) => item.height > 0 && item.height <= requestedHeight)
    .sort((left, right) => right.height - left.height || left.index - right.index);
  if (ranked.length) return ranked[0].video;
  return videos[0];
}

function directProxyFileSize(video: DirectProxyVideo, mediaUrl: string): number {
  if (typeof video.fileSize === "number" && Number.isSafeInteger(video.fileSize) && video.fileSize > 0) {
    return video.fileSize;
  }
  try {
    const contentLength = Number.parseInt(new URL(mediaUrl).searchParams.get("clen") || "", 10);
    return Number.isSafeInteger(contentLength) && contentLength > 0 ? contentLength : 0;
  } catch {
    return 0;
  }
}

async function downloadDirectProxyRanges(
  getMediaUrl: () => Promise<string>,
  outputPath: string,
  totalBytes: number,
  proxies: string[],
): Promise<void> {
  let lastError: unknown;
  let preferredProxy: string | undefined;

  for (let start = 0; start < totalBytes; start += directProxyChunkSize) {
    const end = Math.min(totalBytes - 1, start + directProxyChunkSize - 1);
    const chunkPath = `${outputPath}.${start}.part`;
    const candidates = selectDirectDownloadProxyCandidates(proxies).filter((proxy) => proxy !== preferredProxy);
    if (preferredProxy) candidates.unshift(preferredProxy);
    let downloaded = false;
    let mediaUrl = "";

    for (const proxy of candidates) {
      await rm(chunkPath, { force: true }).catch(() => undefined);
      try {
        if (!mediaUrl) mediaUrl = await getMediaUrl();
        await runCurlDownload([
          "--silent",
          "--show-error",
          "--location",
          "--fail",
          "--retry",
          "0",
          "--connect-timeout",
          "8",
          "--max-time",
          String(Math.ceil(directProxyRequestTimeoutMs / 1000)),
          "--proxy",
          proxy,
          "--range",
          `${start}-${end}`,
          "--user-agent",
          "Mozilla/5.0",
          "--referer",
          "https://www.youtube.com/",
          "--output",
          chunkPath,
          mediaUrl,
        ], directProxyRequestTimeoutMs);
        const chunkStats = await stat(chunkPath);
        if (chunkStats.size !== end - start + 1) {
          throw new Error(`Proxy returned ${chunkStats.size} bytes for a ${end - start + 1}-byte range.`);
        }
        markProxySuccess(proxy);
        preferredProxy = proxy;
        await appendFile(outputPath, await readFile(chunkPath));
        await rm(chunkPath, { force: true });
        downloaded = true;
        break;
      } catch (error) {
        lastError = error;
        markProxyFailure(proxy);
      } finally {
        if (!downloaded) await rm(chunkPath, { force: true }).catch(() => undefined);
      }
    }

    if (!downloaded) {
      const detail = lastError instanceof Error ? lastError.message : "unknown proxy error";
      throw new Error(`All YouTube media proxy attempts failed for byte range ${start}-${end}: ${detail}`);
    }
  }
}

async function getDirectProxyInfo(url: string): Promise<YoutubeDlpInfo> {
  const { payload, videos } = await fetchDirectProxyPayload(url);
  const duration = typeof payload.duration === "number"
    ? payload.duration
    : Number.parseFloat(typeof payload.duration === "string" ? payload.duration : "0");
  return {
    title: typeof payload.title === "string" && payload.title.trim() ? payload.title.trim() : "Downloaded YouTube video",
    duration: Number.isFinite(duration) ? duration : 0,
    formats: videos.map((video) => ({
      height: directProxyHeight(video.quality),
      ext: typeof video.ext === "string" ? video.ext : undefined,
      filesize: typeof video.fileSize === "number" && video.fileSize > 0 ? video.fileSize : undefined,
      vcodec: "unknown",
      acodec: "unknown",
    })),
  };
}

async function downloadDirectProxy(url: string, quality: string): Promise<YoutubeDlpDownload> {
  const { payload, videos } = await fetchDirectProxyPayload(url);
  const selected = selectDirectProxyVideo(videos, quality);
  const mediaUrl = typeof selected.url === "string" ? selected.url : "";
  if (!mediaUrl) throw new Error("The YouTube link resolver returned an empty video URL.");
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "signal-desk-youtube-direct-"));
  const extension = typeof selected.ext === "string" && /^[a-z0-9]{2,5}$/i.test(selected.ext) ? `.${selected.ext.toLowerCase()}` : ".mp4";
  const outputPath = path.join(tempDir, `youtube.${extension}`);
  try {
    const totalBytes = directProxyFileSize(selected, mediaUrl);
    if (!totalBytes) throw new Error("The YouTube link resolver returned no usable file size.");
    const proxies = await loadYoutubeProxies();
    await downloadDirectProxyRanges(async () => {
      const fresh = await fetchDirectProxyPayload(url);
      const selectedFresh = selectDirectProxyVideo(fresh.videos, quality);
      if (typeof selectedFresh.url !== "string" || !selectedFresh.url) {
        throw new Error("The YouTube link resolver returned an empty video URL.");
      }
      return selectedFresh.url;
    }, outputPath, totalBytes, proxies);
    const fileStats = await stat(outputPath);
    if (!fileStats.size) throw new Error("Direct YouTube media URL returned an empty file.");
    const duration = typeof payload.duration === "number"
      ? payload.duration
      : Number.parseFloat(typeof payload.duration === "string" ? payload.duration : "0");
    return {
      path: outputPath,
      tempDir,
      info: {
        title: typeof payload.title === "string" && payload.title.trim() ? payload.title.trim() : "Downloaded YouTube video",
        duration: Number.isFinite(duration) ? duration : 0,
        formats: videos.map((video) => ({ height: directProxyHeight(video.quality), ext: video.ext, vcodec: "unknown", acodec: "unknown" })),
      },
      quality: typeof selected.quality === "string" && selected.quality.trim() ? selected.quality : quality,
    };
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
}

function selectProxyCandidates(proxies: string[]): string[] {
  const now = Date.now();
  const available: string[] = [];
  const coolingDown: string[] = [];

  for (let offset = 0; offset < proxies.length; offset += 1) {
    const proxy = proxies[(proxyCursor + offset) % proxies.length];
    const failedAt = proxyFailures.get(proxy);
    if (failedAt && now - failedAt < proxyFailureCooldownMs) {
      coolingDown.push(proxy);
    } else {
      available.push(proxy);
    }
  }

  const ordered = [...available, ...coolingDown];
  proxyCursor = (proxyCursor + 1) % proxies.length;
  return ordered.slice(0, proxyAttemptLimit(proxies.length));
}

function selectDirectDownloadProxyCandidates(proxies: string[]): string[] {
  const now = Date.now();
  const available: string[] = [];
  const coolingDown: string[] = [];

  for (let offset = 0; offset < proxies.length; offset += 1) {
    const proxy = proxies[(proxyCursor + offset) % proxies.length];
    const failedAt = proxyFailures.get(proxy);
    if (failedAt && now - failedAt < proxyFailureCooldownMs) {
      coolingDown.push(proxy);
    } else {
      available.push(proxy);
    }
  }

  const ordered = [...available, ...coolingDown];
  proxyCursor = (proxyCursor + 1) % proxies.length;
  return ordered.slice(0, Math.min(4, proxies.length));
}

function markProxySuccess(proxy: string): void {
  proxyFailures.delete(proxy);
}

function markProxyFailure(proxy: string): void {
  proxyFailures.set(proxy, Date.now());
}

function commonArgs(cookiePath: string, proxy: string, extractorArgs?: string): string[] {
  const args = [
    "--ignore-config",
    "--no-warnings",
    "--no-playlist",
    "--cookies",
    cookiePath,
    "--proxy",
    proxy,
    "--socket-timeout",
    "15",
    "--retries",
    "2",
    "--fragment-retries",
    "2",
  ];
  if (extractorArgs) args.push("--extractor-args", extractorArgs);
  return args;
}

async function runWithExtractorFallbacks(
  cookiePath: string,
  args: string[],
  proxy: string,
  cwd?: string,
  timeoutMs = commandTimeoutMs,
): Promise<{ stdout: string; stderr: string }> {
  let lastError: unknown;
  const errors: string[] = [];
  for (const extractorArgs of extractorStrategies) {
    try {
      return await runCommand([...commonArgs(cookiePath, proxy, extractorArgs), ...args], cwd, timeoutMs);
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.message) errors.push(error.message);
    }
  }
  if (errors.some((message) => /page needs to be reloaded|requested format is not available|sign in|not a bot|bot check|cookies.*authentication/i.test(message))) {
    throw new Error("YouTube rejected the configured cookies. Export a fresh cookie set from a signed-in YouTube session, including youtube.com and google.com cookies, then replace YOUTUBE_COOKIES.");
  }
  throw lastError instanceof Error ? lastError : new Error("yt-dlp could not access this YouTube video.");
}

async function runWithProxyFallbacks(
  cookiePath: string,
  args: string[],
  cwd?: string,
  timeoutMs = commandTimeoutMs,
): Promise<{ stdout: string; stderr: string }> {
  const proxies = await loadYoutubeProxies();
  const candidates = selectProxyCandidates(proxies);
  let lastError: unknown;

  for (const proxy of candidates) {
    try {
      const result = await runWithExtractorFallbacks(cookiePath, args, proxy, cwd, timeoutMs);
      markProxySuccess(proxy);
      return result;
    } catch (error) {
      lastError = error;
      markProxyFailure(proxy);
    }
  }

  const detail = lastError instanceof Error ? lastError.message : "unknown proxy error";
  throw new Error(`All YouTube proxy attempts failed (${candidates.length} tried): ${detail}`);
}

function runCommand(args: string[], cwd?: string, timeoutMs = commandTimeoutMs): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const childEnv = { ...process.env };
    delete childEnv.YOUTUBE_COOKIES;
    const child = spawn(ytdlpCommand(), args, {
      cwd,
      env: childEnv,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout: Buffer<ArrayBufferLike> = Buffer.alloc(0);
    let stderr: Buffer<ArrayBufferLike> = Buffer.alloc(0);
    let settled = false;
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!settled) child.kill("SIGKILL");
      }, 2_000).unref();
    }, timeoutMs);
    timer.unref();
    const append = (current: Buffer<ArrayBufferLike>, chunk: Buffer): Buffer<ArrayBufferLike> => {
      const next = Buffer.concat([current, chunk]);
      return next.length > maxOutputBytes ? next.subarray(next.length - maxOutputBytes) : next;
    };
    child.stdout.on("data", (chunk: Buffer) => { stdout = append(stdout, chunk); });
    child.stderr.on("data", (chunk: Buffer) => { stderr = append(stderr, chunk); });
    child.on("error", (error) => {
      settled = true;
      clearTimeout(timer);
      reject(new Error(`Could not start yt-dlp: ${error.message}`));
    });
    child.on("close", (code) => {
      settled = true;
      clearTimeout(timer);
      const result = { stdout: stdout.toString("utf8"), stderr: stderr.toString("utf8") };
      if (code === 0) {
        resolve(result);
        return;
      }
      const detail = result.stderr.trim() || result.stdout.trim();
      reject(new Error(detail.split(/\r?\n/).filter(Boolean).slice(-4).join(" ") || `yt-dlp exited with code ${code ?? "unknown"}.`));
    });
  });
}

function runCurlDownload(args: string[], timeoutMs = commandTimeoutMs): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.env.CURL_PATH?.trim() || "curl", args, {
      env: { ...process.env },
      shell: false,
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!settled) child.kill("SIGKILL");
      }, 2_000).unref();
    }, timeoutMs);
    timer.unref();
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = `${stderr}${chunk.toString("utf8")}`.slice(-4_000);
    });
    child.on("error", (error) => {
      settled = true;
      clearTimeout(timer);
      reject(new Error(`Could not start curl: ${error.message}`));
    });
    child.on("close", (code) => {
      settled = true;
      clearTimeout(timer);
      if (code === 0) {
        resolve();
        return;
      }
      const detail = stderr.trim().split(/\r?\n/).filter(Boolean).at(-1);
      reject(new Error(detail || `curl exited with code ${code ?? "unknown"}.`));
    });
  });
}

function parseInfo(stdout: string): YoutubeDlpInfo {
  const jsonStart = stdout.indexOf("{");
  const jsonEnd = stdout.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error("yt-dlp returned no video metadata.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
  } catch {
    throw new Error("yt-dlp returned invalid video metadata.");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("yt-dlp returned invalid video metadata.");
  const value = parsed as { title?: unknown; duration?: unknown; formats?: unknown };
  return {
    title: typeof value.title === "string" && value.title.trim() ? value.title.trim() : "Downloaded YouTube video",
    duration: typeof value.duration === "number" && Number.isFinite(value.duration) ? value.duration : 0,
    formats: Array.isArray(value.formats) ? value.formats as YoutubeDlpFormat[] : [],
  };
}

export async function getYoutubeDlpInfo(url: string): Promise<YoutubeDlpInfo> {
  try {
    return await getDirectProxyInfo(url);
  } catch {
    return withCookieFile(async (cookiePath) => {
      const result = await runWithProxyFallbacks(cookiePath, ["--dump-single-json", "--skip-download", url], undefined, fallbackCommandTimeoutMs);
      return parseInfo(result.stdout);
    });
  }
}

function formatSelector(quality: string): string {
  if (quality === "best") return "bestvideo+bestaudio/best";
  const height = Number.parseInt(quality, 10);
  if (!Number.isFinite(height)) return "bestvideo+bestaudio/best";
  return `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`;
}

function qualityLabel(info: YoutubeDlpInfo, requested: string): string {
  if (requested !== "best") return requested;
  const heights = info.formats
    .map((format) => typeof format.height === "number" ? format.height : 0)
    .filter((height) => height > 0);
  const height = Math.max(0, ...heights);
  return height ? `${height}p` : "best";
}

async function findDownloadedVideo(tempDir: string, stdout: string): Promise<string> {
  const printed = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => videoExtensions.has(path.extname(line).toLowerCase()))
    .at(-1);
  if (printed) {
    const printedPath = path.resolve(printed);
    const printedStats = await stat(printedPath).catch(() => null);
    if (printedStats?.isFile() && printedStats.size > 0) return printedPath;
  }
  const entries = await readdir(tempDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !videoExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const candidate = path.join(tempDir, entry.name);
    const candidateStats = await stat(candidate);
    if (candidateStats.size > 0) return candidate;
  }
  throw new Error("yt-dlp completed without producing a video file.");
}

export async function downloadYoutubeDlp(url: string, quality: string): Promise<YoutubeDlpDownload> {
  let directProxyError: unknown;
  try {
    return await downloadDirectProxy(url, quality);
  } catch (error) {
    directProxyError = error;
    // The direct signed URL can be rejected by server egress even when the
    // resolver succeeds. Keep the authenticated yt-dlp path as a fallback.
  }
  if (!process.env.YOUTUBE_COOKIES?.trim()) {
    throw directProxyError instanceof Error
      ? directProxyError
      : new Error("The direct YouTube proxy download failed and no YOUTUBE_COOKIES fallback is configured.");
  }
  const info = await getYoutubeDlpInfo(url);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "signal-desk-youtube-download-"));
  try {
    return await withCookieFile(async (cookiePath) => {
      const outputTemplate = path.join(tempDir, "%(id)s.%(ext)s");
      const result = await runWithProxyFallbacks(cookiePath, [
        "--format",
        formatSelector(quality),
        "--merge-output-format",
        "mp4",
        "--output",
        outputTemplate,
        "--print",
        "after_move:filepath",
        "--force-overwrites",
        url,
      ], tempDir, fallbackCommandTimeoutMs);
      return {
        path: await findDownloadedVideo(tempDir, result.stdout),
        tempDir,
        info,
        quality: qualityLabel(info, quality),
      };
    });
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
}

export async function cleanupYoutubeDlpDownload(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
}