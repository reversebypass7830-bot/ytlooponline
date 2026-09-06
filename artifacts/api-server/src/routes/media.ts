import { createWriteStream } from "node:fs";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Router, type IRouter } from "express";
import { createHmac, randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { DownloadYoutubeVideoBody, DownloadYoutubeVideoResponse } from "@workspace/api-zod";
import youtubeDl, { create as createYoutubeDl } from "youtube-dl-exec";
import ffmpegPath from "ffmpeg-static";

const router: IRouter = Router();
const mediaDir = path.resolve(process.cwd(), "attached_assets", "live-media");
const maxUploadBytes = 1.5 * 1024 * 1024 * 1024;
const youtubeDownloader = process.env.YT_DLP_BIN?.trim()
  ? createYoutubeDl(process.env.YT_DLP_BIN.trim())
  : youtubeDl;

function getMediaName(rawName: string): string {
  const base = path.basename(rawName).replace(/[^a-zA-Z0-9._-]/g, "-");
  const extension = path.extname(base).toLowerCase() || ".mp4";
  return `${randomUUID()}${extension}`;
}

async function findMediaFile(fileId: string): Promise<string | null> {
  if (!/^[a-f0-9-]+$/i.test(fileId)) return null;
  const files = await readdir(mediaDir).catch(() => []);
  const filename = files.find((entry) => entry.startsWith(`${fileId}.`));
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

async function downloadYoutubeVideo(url: string, fileId: string): Promise<{ path: string; title: string; duration: string }> {
  await mkdir(mediaDir, { recursive: true });
  const outputTemplate = path.join(mediaDir, `${fileId}.%(ext)s`);
  const clients = ["android", "web_embedded", "mweb", "ios"];
  let lastError = "YouTube video download failed.";

  for (const client of clients) {
    await Promise.all(
      (await readdir(mediaDir).catch(() => []))
        .filter((entry) => entry.startsWith(`${fileId}.`))
        .map((entry) => unlink(path.join(mediaDir, entry)).catch(() => undefined)),
    );

    try {
      const result = await new Promise<{ title: string; duration: string }>((resolve, reject) => {
        const flags = ({
          noPlaylist: true,
          noWarnings: true,
          noProgress: true,
          retries: 3,
          fragmentRetries: 3,
          fileAccessRetries: 3,
          socketTimeout: 30,
          extractorArgs: `youtube:player_client=${client}`,
          format: "bestvideo*+bestaudio/best",
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
            try { return JSON.parse(line) as { title?: unknown; duration?: unknown }; } catch { return null; }
          }).find(Boolean);
          resolve({
            title: typeof info?.title === "string" && info.title.trim() ? info.title.trim() : "Downloaded YouTube video",
            duration: formatDuration(info?.duration),
          });
        });
      });

      const files = await readdir(mediaDir).catch(() => []);
      const filename = files.find((entry) => entry.startsWith(`${fileId}.`) && !entry.endsWith(".part"));
      if (!filename) throw new Error("YouTube download finished without creating a video file.");
      return {
        path: path.join(mediaDir, filename),
        title: result.title,
        duration: result.duration,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "YouTube video download failed.";
      if (lastError.includes("Sign in to confirm") || lastError.includes("not a bot")) break;
    }
  }

  try {
    return await downloadViaYtSave(url, fileId);
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
): Promise<{ path: string; title: string; duration: string }> {
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
  // YTSave returns video resolutions from highest to lowest. Do not apply the
  // browser-upload cap here: downloads should use the best available quality.
  const video = videoOptions[0];
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

  return {
    path: destination,
    title: api.title?.trim() || "Downloaded YouTube video",
    duration: normalizeDuration(video.mediaDuration),
  };
}

router.post("/media/upload", async (req, res): Promise<void> => {
  const rawName = req.header("x-file-name");
  const contentType = req.header("content-type") || "";
  if (!rawName || (!contentType.startsWith("video/") && contentType !== "application/octet-stream")) {
    res.status(400).json({ error: "Send a video file with an X-File-Name header." });
    return;
  }

  await mkdir(mediaDir, { recursive: true });
  const filename = getMediaName(rawName);
  const destination = path.join(mediaDir, filename);
  let received = 0;
  req.on("data", (chunk: Buffer) => {
    received += chunk.length;
    if (received > maxUploadBytes) req.destroy(new Error("Video upload is larger than 1.5 GB."));
  });

  try {
    await pipeline(req, createWriteStream(destination));
    const fileId = path.parse(filename).name;
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

router.post("/media/youtube-download", async (req, res): Promise<void> => {
  try {
    const parsed = DownloadYoutubeVideoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const url = validateYoutubeUrl(parsed.data.url.trim());
    const fileId = randomUUID();
    const result = await downloadYoutubeVideo(url, fileId);
    res.status(201).json(DownloadYoutubeVideoResponse.parse({
      fileId,
      filename: path.basename(result.path),
      sourcePath: result.path,
      playbackUrl: `/api/media/files/${fileId}`,
      title: result.title,
      duration: result.duration,
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
    req.log.info({ fileId: req.params.fileId }, "Media file deleted");
    res.json({ fileId: req.params.fileId, deleted: true });
  } catch (error) {
    req.log.warn({ fileId: req.params.fileId, error: error instanceof Error ? error.message : "unknown" }, "Media file deletion failed");
    res.status(500).json({ error: "The video file could not be deleted." });
  }
});

export default router;