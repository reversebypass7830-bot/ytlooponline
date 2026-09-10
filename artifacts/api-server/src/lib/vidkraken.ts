import { createWriteStream } from "node:fs";
import { mkdtemp, rm, stat } from "node:fs/promises";
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
const supportedFormats = [
  { height: 1080, ext: "mp4" },
  { height: 720, ext: "mp4" },
  { height: 480, ext: "mp4" },
  { height: 360, ext: "mp4" },
];

function token(): string {
  const value = process.env.TOKEN?.trim();
  if (!value) {
    throw new Error("VidKraken TOKEN is missing. Add it to the project's .env file.");
  }
  return value;
}

function apiUrl(endpoint: string): string {
  return `${process.env.VIDKRAKEN_API_URL?.trim() || apiBaseUrl}${endpoint}`;
}

async function vidKrakenRequest(endpoint: string, init: RequestInit = {}): Promise<VidKrakenPayload> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token()}`);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(apiUrl(endpoint), {
    ...init,
    headers,
    signal: init.signal || AbortSignal.timeout(60_000),
  });
  const payload = await response.json().catch(() => ({})) as VidKrakenPayload;
  if (!response.ok) {
    const detail = typeof payload.error === "string" ? payload.error : `VidKraken returned HTTP ${response.status}.`;
    throw new Error(detail);
  }
  return payload;
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