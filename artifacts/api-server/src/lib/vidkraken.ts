import { createWriteStream } from "node:fs";
import { chmod, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

type VidKrakenPayload = Record<string, unknown>;

export type VidKrakenInfo = {
  title: string;
  duration: number;
  formats: Array<{ height?: number; ext?: string }>;
};

export type VidKrakenDownload = {
  path: string;
  tempDir: string;
  info: VidKrakenInfo;
  quality: string;
};

const apiBaseUrl = "https://vidkraken.com/api/v2";
const pollIntervalMs = 2_000;
const infoTimeoutMs = 5 * 60 * 1_000;
const downloadTimeoutMs = 30 * 60 * 1_000;
const tokenCooldownMs = 3 * 60 * 60 * 1_000;
const configuredEnvFilePath = process.env.VIDKRAKEN_ENV_FILE?.trim();
const configuredTokenStateFilePath = process.env.VIDKRAKEN_TOKEN_STATE_FILE?.trim();
const envFileCandidates = [
  configuredEnvFilePath,
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(import.meta.dirname, "../../../../.env"),
  path.resolve(import.meta.dirname, "../../../.env"),
].filter((candidate): candidate is string => Boolean(candidate));
const tokenStateFilePath = configuredTokenStateFilePath || path.resolve(process.cwd(), "../../.vidkraken-token-state.json");
const supportedFormats = [
  { height: 1080, ext: "mp4" },
  { height: 720, ext: "mp4" },
  { height: 480, ext: "mp4" },
  { height: 360, ext: "mp4" },
];

type TokenEntry = {
  key: string;
  value: string;
  fingerprint: string;
};

type TokenState = {
  cooldowns: Record<string, number>;
};

type VidKrakenTokenStatus = {
  key: string;
  status: "ready" | "cooldown";
  cooldownUntil: string | null;
};

let tokenCursor = 0;
let tokenStateLoad: Promise<TokenState> | undefined;
let tokenStateWrite = Promise.resolve();
let envFileWrite = Promise.resolve();

function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function parseEnvValue(raw: string): string {
  const value = raw.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "string" ? parsed.trim() : "";
    } catch {
      return value.slice(1, -1).trim();
    }
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).trim();
  return value;
}

function tokenKeyOrder(key: string): number {
  return key === "TOKEN" ? 1 : Number.parseInt(key.slice("TOKEN_".length), 10) || Number.MAX_SAFE_INTEGER;
}

async function readTokenEntries(): Promise<TokenEntry[]> {
  const source = await readEnvSource();
  const raw = source.raw;
  const values = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*(TOKEN(?:_\d+)?)\s*=(.*)$/);
    if (!match) continue;
    const value = parseEnvValue(match[2]);
    if (value) values.set(match[1], value);
  }
  if (!source.exists) {
    for (const [key, value] of Object.entries(process.env)) {
      if (/^TOKEN(?:_\d+)?$/.test(key) && value?.trim()) values.set(key, value.trim());
    }
  }
  return [...values.entries()]
    .sort(([left], [right]) => tokenKeyOrder(left) - tokenKeyOrder(right))
    .map(([key, value]) => ({ key, value, fingerprint: fingerprint(value) }));
}

type EnvSource = { filePath: string; raw: string; exists: boolean };

async function readEnvSource(): Promise<EnvSource> {
  for (const candidate of envFileCandidates) {
    const raw = await readFile(candidate, "utf8").catch(() => null);
    if (raw !== null) return { filePath: candidate, raw, exists: true };
  }
  return { filePath: envFileCandidates[0] || path.resolve(process.cwd(), ".env"), raw: "", exists: false };
}

async function resolveEnvFilePath(): Promise<string> {
  return (await readEnvSource()).filePath;
}

async function readTokenState(): Promise<TokenState> {
  if (!tokenStateLoad) {
    tokenStateLoad = readFile(tokenStateFilePath, "utf8")
      .then((raw) => {
        const parsed = JSON.parse(raw) as Partial<TokenState>;
        const cooldowns = parsed.cooldowns && typeof parsed.cooldowns === "object" ? parsed.cooldowns : {};
        return { cooldowns: Object.fromEntries(Object.entries(cooldowns).filter(([, value]) => typeof value === "number")) };
      })
      .catch(() => ({ cooldowns: {} }));
  }
  return tokenStateLoad;
}

function saveTokenState(state: TokenState): Promise<void> {
  tokenStateWrite = tokenStateWrite.then(async () => {
    await writeFile(tokenStateFilePath, JSON.stringify(state, null, 2), { mode: 0o600 });
    await chmod(tokenStateFilePath, 0o600).catch(() => undefined);
  });
  return tokenStateWrite;
}

function cooldownUntil(entry: TokenEntry, state: TokenState): number {
  const until = state.cooldowns[entry.fingerprint] || 0;
  return until > Date.now() ? until : 0;
}

function tokenAvailable(entry: TokenEntry, state: TokenState): boolean {
  return cooldownUntil(entry, state) === 0;
}

async function markTokenCooldown(entry: TokenEntry): Promise<void> {
  const state = await readTokenState();
  state.cooldowns[entry.fingerprint] = Date.now() + tokenCooldownMs;
  await saveTokenState(state);
}

function tokenCandidates(entries: TokenEntry[], state: TokenState): TokenEntry[] {
  const available = entries.filter((entry) => tokenAvailable(entry, state));
  if (!available.length) return [];
  const start = tokenCursor % available.length;
  tokenCursor = (tokenCursor + 1) % available.length;
  return [...available.slice(start), ...available.slice(0, start)];
}

function tokenLimitError(status: number, message: string): boolean {
  return status === 401 || status === 403 || status === 429 || /credit|quota|rate.?limit|too many pending|limit reached|account.*limit/i.test(message);
}

function tokenErrorMessage(payload: VidKrakenPayload, status: number): string {
  return stringValue(payload, "error", "message", "detail") || `VidKraken returned HTTP ${status}.`;
}

function envTokenLines(raw: string): string[] {
  return raw.split(/\r?\n/);
}

function nextTokenKey(lines: string[]): string {
  const used = new Set(lines.map((line) => line.match(/^\s*(TOKEN(?:_\d+)?)\s*=/)?.[1]).filter((value): value is string => Boolean(value)));
  if (!used.has("TOKEN")) return "TOKEN";
  for (let index = 2; index < 10_000; index += 1) {
    const key = `TOKEN_${index}`;
    if (!used.has(key)) return key;
  }
  throw new Error("The VidKraken token pool is full.");
}

async function updateEnvToken(mutator: (lines: string[]) => { lines: string[]; key: string }): Promise<string> {
  let addedKey = "";
  envFileWrite = envFileWrite.then(async () => {
    const filePath = await resolveEnvFilePath();
    const raw = await readFile(filePath, "utf8").catch(() => "");
    const updated = mutator(envTokenLines(raw));
    const content = `${updated.lines.join("\n").replace(/\n+$/, "")}\n`;
    await writeFile(filePath, content, { mode: 0o600 });
    await chmod(filePath, 0o600).catch(() => undefined);
    addedKey = updated.key;
  });
  await envFileWrite;
  return addedKey;
}

export async function listVidKrakenTokens(): Promise<VidKrakenTokenStatus[]> {
  const [entries, state] = await Promise.all([readTokenEntries(), readTokenState()]);
  const statuses = entries.map((entry) => {
    const until = cooldownUntil(entry, state);
    return {
      key: entry.key,
      status: until ? "cooldown" as const : "ready" as const,
      cooldownUntil: until ? new Date(until).toISOString() : null,
    };
  });
  return statuses;
}

export async function addVidKrakenToken(value: string): Promise<string> {
  const normalized = value.trim();
  if (!normalized || normalized.includes("\n") || normalized.includes("\r")) {
    throw new Error("Enter one valid VidKraken token.");
  }
  const existing = await readTokenEntries();
  if (existing.some((entry) => entry.value === normalized)) throw new Error("This VidKraken token is already configured.");
  return updateEnvToken((lines) => {
    const key = nextTokenKey(lines);
    return { key, lines: [...lines, `${key}=${JSON.stringify(normalized)}`] };
  });
}

export async function deleteVidKrakenToken(key: string): Promise<void> {
  if (!/^TOKEN(?:_\d+)?$/.test(key)) throw new Error("Invalid VidKraken token key.");
  await new Promise<void>((resolve, reject) => {
    envFileWrite = envFileWrite.then(async () => {
      const filePath = await resolveEnvFilePath();
      const raw = await readFile(filePath, "utf8").catch(() => "");
      const lines = envTokenLines(raw);
      const remaining = lines.filter((line) => !new RegExp(`^\\s*${key}\\s*=`).test(line));
      if (remaining.length === lines.length) throw new Error("VidKraken token key not found.");
      await writeFile(filePath, `${remaining.join("\n").replace(/\n+$/, "")}\n`, { mode: 0o600 });
      await chmod(filePath, 0o600).catch(() => undefined);
    }).then(resolve, reject);
  });
}

function apiUrl(endpoint: string): string {
  return `${process.env.VIDKRAKEN_API_URL?.trim() || apiBaseUrl}${endpoint}`;
}

async function vidKrakenRequest(endpoint: string, init: RequestInit = {}): Promise<VidKrakenPayload> {
  const entries = await readTokenEntries();
  if (!entries.length) throw new Error("VidKraken TOKEN is missing. Add it to the project's .env file.");
  const state = await readTokenState();
  const candidates = tokenCandidates(entries, state);
  if (!candidates.length) throw new Error("All VidKraken tokens are on cooldown. Please try again after the 3-hour limit window.");
  let lastError = "VidKraken could not process this request.";

  for (const entry of candidates) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${entry.value}`);
    headers.set("Accept", "application/json");
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(apiUrl(endpoint), {
      ...init,
      headers,
      signal: init.signal || AbortSignal.timeout(60_000),
    });
    const payload = await response.json().catch(() => ({})) as VidKrakenPayload;
    if (response.ok) return payload;
    const message = tokenErrorMessage(payload, response.status);
    lastError = message;
    if (!tokenLimitError(response.status, message)) throw new Error(message);
    await markTokenCooldown(entry);
  }
  throw new Error(lastError);
}

function stringValue(payload: VidKrakenPayload, ...keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function expandedPayload(payload: VidKrakenPayload): VidKrakenPayload {
  let expanded = { ...payload };
  for (const key of ["data", "result", "metadata", "video"]) {
    const nested = expanded[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      expanded = { ...expanded, ...(nested as VidKrakenPayload) };
    }
  }
  return expanded;
}

function numberValue(payload: VidKrakenPayload, ...keys: string[]): number {
  for (const key of keys) {
    const value = payload[key];
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return 0;
}

function jobStatus(payload: VidKrakenPayload): string {
  return stringValue(payload, "status").toUpperCase();
}

function jobId(payload: VidKrakenPayload): string {
  const value = stringValue(payload, "jobId", "job_id");
  if (!value) throw new Error("VidKraken did not return a job id.");
  return value;
}

function errorMessage(payload: VidKrakenPayload): string {
  return stringValue(payload, "error", "message", "detail") || "VidKraken could not process this YouTube video.";
}

function parseInfo(payload: VidKrakenPayload): VidKrakenInfo {
  const resolved = expandedPayload(payload);
  const title = stringValue(resolved, "title") || "Downloaded YouTube video";
  const duration = numberValue(resolved, "duration", "durationSeconds", "duration_seconds");
  return { title, duration, formats: supportedFormats };
}

async function pollJob(
  endpoint: (id: string) => string,
  initial: VidKrakenPayload,
  timeoutMs: number,
): Promise<VidKrakenPayload> {
  const id = jobId(initial);
  const startedAt = Date.now();
  let current = initial;
  while (Date.now() - startedAt < timeoutMs) {
    const status = jobStatus(current);
    if (["COMPLETED", "COMPLETE", "SUCCEEDED", "SUCCESS", "DONE"].includes(status)) return current;
    if (["FAILED", "ERROR", "CANCELLED", "CANCELED"].includes(status)) throw new Error(errorMessage(current));
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    current = await vidKrakenRequest(endpoint(id));
  }
  throw new Error("VidKraken took too long to finish this request. Please try again.");
}

async function fetchInfo(url: string): Promise<VidKrakenInfo> {
  const submitted = await vidKrakenRequest("/info", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  return parseInfo(await pollJob((id) => `/info/${encodeURIComponent(id)}`, submitted, infoTimeoutMs));
}

function requestedFormat(quality: string): string {
  if (quality === "audio") return "audio";
  const height = quality === "best" ? 1080 : Number.parseInt(quality, 10);
  if (!Number.isFinite(height)) return "1080";
  if (height >= 1080) return "1080";
  if (height >= 720) return "720";
  if (height >= 480) return "480";
  return "360";
}

function selectedQuality(quality: string): string {
  const format = requestedFormat(quality);
  return format === "audio" ? "audio" : `${format}p`;
}

function completedMediaUrl(payload: VidKrakenPayload): string {
  const resolved = expandedPayload(payload);
  const url = stringValue(resolved, "downloadUrl", "download_url", "cdnUrl", "cdn_url", "fileUrl", "file_url");
  if (url) return url;
  const fallback = stringValue(resolved, "url");
  if (fallback && !fallback.includes("youtube.com") && !fallback.includes("youtu.be")) return fallback;
  throw new Error("VidKraken completed the job without returning a CDN download URL.");
}

function extensionFromResponse(response: Response, mediaUrl: string, format: string): string {
  const disposition = response.headers.get("content-disposition") || "";
  const filename = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1];
  const fromName = filename ? path.extname(decodeURIComponent(filename)).toLowerCase() : "";
  if (/^\.[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (format === "audio") return ".mp3";
  try {
    const fromUrl = path.extname(new URL(mediaUrl).pathname).toLowerCase();
    if (/^\.[a-z0-9]{2,5}$/.test(fromUrl)) return fromUrl;
  } catch {
    // Use the default video extension below.
  }
  return ".mp4";
}

async function saveCdnMedia(mediaUrl: string, tempDir: string, format: string): Promise<string> {
  const response = await fetch(mediaUrl, {
    headers: { Accept: "*/*" },
    signal: AbortSignal.timeout(downloadTimeoutMs),
  });
  if (!response.ok || !response.body) {
    throw new Error(`VidKraken CDN download failed (HTTP ${response.status}).`);
  }
  const outputPath = path.join(tempDir, `youtube${extensionFromResponse(response, mediaUrl, format)}`);
  await pipeline(Readable.fromWeb(response.body as globalThis.ReadableStream), createWriteStream(outputPath));
  const fileStats = await stat(outputPath);
  if (!fileStats.size) throw new Error("VidKraken returned an empty media file.");
  return outputPath;
}

export async function getVidKrakenInfo(url: string): Promise<VidKrakenInfo> {
  return fetchInfo(url);
}

export async function downloadVidKraken(url: string, quality: string): Promise<VidKrakenDownload> {
  const format = requestedFormat(quality);
  const submitted = await vidKrakenRequest("/download", {
    method: "POST",
    body: JSON.stringify({ url, format }),
  });
  const completed = await pollJob((id) => `/download/${encodeURIComponent(id)}`, submitted, downloadTimeoutMs);
  const resolved = expandedPayload(completed);
  const submittedResolved = expandedPayload(submitted);
  const info = {
    title: stringValue(resolved, "title") || stringValue(submittedResolved, "title") || "Downloaded YouTube video",
    duration: numberValue(resolved, "duration") || numberValue(submittedResolved, "duration"),
    formats: supportedFormats,
  };
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "vidkraken-youtube-"));
  try {
    const mediaPath = await saveCdnMedia(completedMediaUrl(completed), tempDir, format);
    return { path: mediaPath, tempDir, info, quality: selectedQuality(quality) };
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
}

export async function cleanupVidKrakenDownload(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
}