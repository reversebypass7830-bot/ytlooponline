import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
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
const maxOutputBytes = 12 * 1024 * 1024;
const videoExtensions = new Set([".mp4", ".webm", ".mkv", ".mov", ".m4v", ".avi", ".ts"]);
const proxyFailureCooldownMs = 2 * 60 * 1000;
const defaultProxyAttempts = 12;
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
): Promise<{ stdout: string; stderr: string }> {
  let lastError: unknown;
  const errors: string[] = [];
  for (const extractorArgs of extractorStrategies) {
    try {
      return await runCommand([...commonArgs(cookiePath, proxy, extractorArgs), ...args], cwd);
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
): Promise<{ stdout: string; stderr: string }> {
  const proxies = await loadYoutubeProxies();
  const candidates = selectProxyCandidates(proxies);
  let lastError: unknown;

  for (const proxy of candidates) {
    try {
      const result = await runWithExtractorFallbacks(cookiePath, args, proxy, cwd);
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

function runCommand(args: string[], cwd?: string): Promise<{ stdout: string; stderr: string }> {
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
    }, commandTimeoutMs);
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
  return withCookieFile(async (cookiePath) => {
    const result = await runWithProxyFallbacks(cookiePath, ["--dump-single-json", "--skip-download", url]);
    return parseInfo(result.stdout);
  });
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
      ], tempDir);
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