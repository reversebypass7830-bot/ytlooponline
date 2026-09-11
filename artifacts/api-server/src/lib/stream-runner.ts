import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { PassThrough, type Writable } from "node:stream";
import { logger } from "./logger";

export type StreamRunnerStatus = "running" | "stopped" | "failed";

export type StreamCompositionInput = {
  mainX?: number;
  mainY?: number;
  mainScale?: number;
  cropMode?: "fit" | "crop";
  webcamSource?: string;
  webcamX?: number;
  webcamY?: number;
  webcamScale?: number;
  animationSource?: string;
  animationX?: number;
  animationY?: number;
  animationScale?: number;
  logoSource?: string;
  logoPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  logoScale?: number;
  animationPreset?: "none" | "subscribe" | "like" | "follow";
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  chromaKeyBySource?: Record<string, {
    enabled?: boolean;
    color?: string;
    similarity?: number;
    blend?: number;
  }>;
  chromaKeyDurations?: Record<string, number>;
  chromaKeyByLayer?: Partial<Record<"main" | "webcam" | "animation", {
    enabled?: boolean;
    color?: string;
    similarity?: number;
    blend?: number;
  }>>;
  chromaKeyEnabled?: boolean;
  chromaKeyTarget?: "main" | "webcam" | "animation";
  chromaKeyColor?: string;
  chromaSimilarity?: number;
  chromaBlend?: number;
};

export type StreamRunnerInput = {
  streamId: string;
  ingestUrl: string;
  category: string;
  videoSource?: string;
  videoSources?: string[];
  faceCategory?: string;
  faceSource?: string;
  faceSources?: string[];
  playbackSpeed?: number;
  quality?: "4k" | "1080p";
  aspectRatio?: "shorts" | "full" | "square";
  facePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  faceScale?: number;
  durationMinutes?: number;
  autoRestart?: boolean;
  voiceAudio?: boolean;
  liveAnimationSource?: string;
  liveAnimationX?: number;
  liveAnimationY?: number;
  liveAnimationScale?: number;
  composition?: StreamCompositionInput;
  baseAudioAvailable?: boolean;
  liveWebcam?: {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
    scale?: number;
  };
  renderOffsetSeconds?: number;
};

export type StreamRunnerResult = {
  streamId: string;
  status: StreamRunnerStatus;
  message: string;
  pid: number | null;
};

type StreamProcess = {
  child: ChildProcess | null;
  publisherInput?: PassThrough;
  publisherIngestUrl?: string;
  renderer?: ChildProcess;
  preview?: ChildProcess;
  previewDir?: string;
  startedAt: string;
  status: StreamRunnerStatus;
  input: StreamRunnerInput;
  durationTimer?: NodeJS.Timeout;
  restartTimer?: NodeJS.Timeout;
  playlistPaths?: string[];
  voiceOutput?: Writable;
  webcamUpload?: PassThrough;
  webcamOutput?: PassThrough;
  webcamPacketBuffer: Buffer;
  webcamQueue: Array<{ data: Buffer; receivedAt: number }>;
  webcamTimer?: NodeJS.Timeout;
  voiceQueue: Array<{ data: Buffer; receivedAt: number }>;
  voiceBufferedBytes: number;
  voiceTimer?: NodeJS.Timeout;
  playbackOffsetSeconds: number;
  renderStartedAtMs: number;
  rendererHandoff?: {
    oldRenderer: ChildProcess;
    oldPlaylistPaths?: string[];
    oldRenderStartedAtMs: number;
    newRenderer: ChildProcess;
    timeout?: NodeJS.Timeout;
  };
};

const assetNamesByCategory: Record<string, string> = {
  "gtv 5 face": "WhatsApp Video 2026-09-04 at 11.30.43 PM.mp4",
  gtv5face: "WhatsApp Video 2026-09-04 at 11.30.43 PM.mp4",
};
const processes = new Map<string, StreamProcess>();
const previewRoot = path.resolve(process.cwd(), ".signal-desk-live-previews");

function findAsset(assetName: string): string | null {
  const candidates = [
    path.resolve(process.cwd(), "attached_assets", assetName),
    path.resolve(process.cwd(), "..", "..", "attached_assets", assetName),
    path.resolve(process.cwd(), "..", "attached_assets", assetName),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function getVideoPath(category: string, explicitSource?: string): string {
  if (explicitSource && path.isAbsolute(explicitSource) && existsSync(explicitSource)) {
    return explicitSource;
  }

  const categoryKey = explicitSource?.startsWith("__asset:")
    ? explicitSource.slice("__asset:".length).trim().toLowerCase()
    : category.trim().toLowerCase();
  const assetName = assetNamesByCategory[categoryKey];
  if (!assetName) {
    throw new Error(
      `The ${category} category is saved in this browser but does not have a server-side video source yet.`,
    );
  }

  const videoPath = findAsset(assetName);
  if (!videoPath) {
    throw new Error(`The ${category} video file is not available on the server.`);
  }
  return videoPath;
}

function getVideoPaths(category: string, explicitSources?: string[], explicitSource?: string): string[] {
  const sources = explicitSources?.length ? explicitSources : explicitSource ? [explicitSource] : [];
  if (!sources.length) {
    throw new Error(`The ${category} category has no server-ready videos.`);
  }
  return sources.map((source) => getVideoPath(category, source));
}

function escapePlaylistPath(filePath: string): string {
  return filePath.replace(/'/g, "'\\''");
}

function clamp(value: number | undefined, minimum: number, maximum: number, fallback: number): number {
  return Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, value as number)) : fallback;
}

function logoPosition(
  position: StreamCompositionInput["logoPosition"] | undefined,
  width: string,
  height: string,
): string {
  switch (position) {
    case "top-right": return `${width}-overlay_w-24:24`;
    case "bottom-left": return `24:${height}-overlay_h-24`;
    case "bottom-right": return `${width}-overlay_w-24:${height}-overlay_h-24`;
    default: return "24:24";
  }
}

function prepareInput(paths: string[]): { path: string; playlistPath?: string; paths: string[] } {
  if (paths.length === 1) return { path: paths[0], paths };
  const playlistPath = path.resolve(process.cwd(), `.signal-desk-playlist-${randomUUID()}.txt`);
  writeFileSync(playlistPath, `${paths.map((filePath) => `file '${escapePlaylistPath(filePath)}'`).join("\n")}\n`);
  return { path: playlistPath, playlistPath, paths };
}

function cleanupPlaylists(process: StreamProcess): void {
  process.playlistPaths?.forEach((playlistPath) => unlinkSync(playlistPath));
  process.playlistPaths = undefined;
}

function cleanupPlaylistPaths(playlistPaths: string[] | undefined): void {
  playlistPaths?.forEach((playlistPath) => {
    try {
      unlinkSync(playlistPath);
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
        throw error;
      }
    }
  });
}

function previewDirectory(streamId: string): string {
  const key = createHash("sha256").update(streamId).digest("hex");
  return path.join(previewRoot, key);
}

function stopPreview(process: StreamProcess, clearFiles = true): void {
  const preview = process.preview;
  if (preview?.stdin && process.renderer?.stdout) {
    process.renderer.stdout.unpipe(preview.stdin);
  }
  process.preview?.kill("SIGTERM");
  process.preview = undefined;
  if (clearFiles && process.previewDir) {
    rmSync(process.previewDir, { recursive: true, force: true });
    process.previewDir = undefined;
  }
}

export function getStreamPreviewFile(streamId: string, filename: string): string | null {
  const previewDir = processes.get(streamId)?.previewDir;
  if (!previewDir || !/^(signal\.m3u8|signal_\d{5}\.ts)$/.test(filename)) return null;
  const candidate = path.resolve(previewDir, filename);
  if (!candidate.startsWith(`${path.resolve(previewDir)}${path.sep}`) || !existsSync(candidate)) return null;
  return candidate;
}

function startPreview(process: StreamProcess, renderer: ChildProcess): void {
  stopPreview(process);
  const directory = previewDirectory(process.input.streamId);
  rmSync(directory, { recursive: true, force: true });
  mkdirSync(directory, { recursive: true });
  const preview = spawn("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-thread_queue_size",
    "1024",
    "-f",
    "mpegts",
    "-i",
    "pipe:0",
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-c",
    "copy",
    "-f",
    "hls",
    "-hls_time",
    "1",
    "-hls_list_size",
    "6",
    "-hls_flags",
    "delete_segments+append_list+independent_segments",
    "-hls_delete_threshold",
    "2",
    "-hls_segment_filename",
    path.join(directory, "signal_%05d.ts"),
    path.join(directory, "signal.m3u8"),
  ], {
    stdio: ["pipe", "ignore", "pipe"],
  });
  process.preview = preview;
  process.previewDir = directory;
  preview.stdin?.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Live preview input pipe closed");
  });
  preview.once("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Live preview process error");
  });
  preview.once("exit", (code, signal) => {
    if (process.preview === preview) process.preview = undefined;
    if (process.status === "running" && code !== 0) {
      logger.warn({ streamId: process.input.streamId, code, signal }, "Live preview process exited");
    }
  });
  renderer.stdout?.pipe(preview.stdin!, { end: false });
}

function detachRendererOutputs(process: StreamProcess, renderer: ChildProcess): void {
  renderer.stdout?.unpipe(process.publisherInput);
  if (process.preview?.stdin) renderer.stdout?.unpipe(process.preview.stdin);

  const webcamOutput = renderer.stdio[4] as Writable | null;
  if (webcamOutput && process.webcamOutput) {
    process.webcamOutput.unpipe(webcamOutput);
  }

  const voiceOutput = renderer.stdio[3] as Writable | null;
  if (process.voiceOutput === voiceOutput) {
    process.voiceOutput = undefined;
  }
}

function stopRenderer(process: StreamProcess, renderer: ChildProcess): void {
  detachRendererOutputs(process, renderer);
  renderer.kill("SIGTERM");
}

const voiceFrameBytes = 1920;
const voiceJitterFrames = 8;
const maxVoiceBufferBytes = voiceFrameBytes * 50;
const silenceFrame = Buffer.alloc(voiceFrameBytes);
const silenceSecond = Buffer.alloc(maxVoiceBufferBytes);
const liveMediaJitterMs = 200;
const liveWebcamMaxQueueFrames = 8;
const liveWebcamFrameIntervalMs = 100;
const transparentWebcamFrame = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

function primeWebcamPipe(process: StreamProcess): void {
  if (!process.input.liveWebcam || !process.webcamOutput || process.webcamOutput.destroyed) return;
  try {
    process.webcamOutput.write(transparentWebcamFrame);
  } catch (error) {
    logger.warn(
      { streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" },
      "Live webcam pipe prime skipped",
    );
  }
}

function resetVoicePipe(process: StreamProcess): void {
  process.voiceOutput = undefined;
}

function takeVoiceFrame(process: StreamProcess): Buffer {
  const frame = Buffer.alloc(voiceFrameBytes);
  let frameOffset = 0;

  while (frameOffset < voiceFrameBytes && process.voiceQueue.length) {
    const queued = process.voiceQueue[0];
    const bytesToCopy = Math.min(voiceFrameBytes - frameOffset, queued.data.length);
    queued.data.copy(frame, frameOffset, 0, bytesToCopy);
    frameOffset += bytesToCopy;
    process.voiceBufferedBytes -= bytesToCopy;

    if (bytesToCopy === queued.data.length) {
      process.voiceQueue.shift();
    } else {
      queued.data = queued.data.subarray(bytesToCopy);
    }
  }

  if (frameOffset < voiceFrameBytes) {
    silenceFrame.copy(frame, frameOffset, 0, voiceFrameBytes - frameOffset);
  }
  return frame;
}

function startVoicePipe(process: StreamProcess, child: ChildProcess): void {
  if (process.input.voiceAudio !== true) return;
  const output = child.stdio[3] as Writable | null;
  if (!output || typeof output.write !== "function") return;
  process.voiceOutput = output;
  output.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Voice input pipe closed");
    if (process.voiceOutput === output) process.voiceOutput = undefined;
  });
  try {
    // Feed one second of silence before browser microphone data arrives so
    // FFmpeg can initialize the s16le input without starving the publisher.
    output.write(silenceSecond);
  } catch (error) {
    logger.warn(
      { streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" },
      "Voice input prime skipped",
    );
  }
  if (!process.voiceTimer) {
    process.voiceTimer = setInterval(() => {
      const current = processes.get(process.input.streamId);
      const voiceOutput = current?.voiceOutput;
      if (!current || current.status !== "running" || !voiceOutput || voiceOutput.destroyed || voiceOutput.writableEnded) return;
      const next = current.voiceBufferedBytes >= voiceFrameBytes * voiceJitterFrames
        ? takeVoiceFrame(current)
        : silenceFrame;
      try {
        voiceOutput.write(next);
      } catch (error) {
        logger.warn({ streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" }, "Voice audio write skipped");
        if (current.voiceOutput === voiceOutput) current.voiceOutput = undefined;
      }
    }, 20);
  }
}

function stopVoicePipe(process: StreamProcess, clearQueue = true): void {
  if (process.voiceTimer) clearInterval(process.voiceTimer);
  process.voiceTimer = undefined;
  resetVoicePipe(process);
  if (clearQueue) {
    process.voiceQueue.length = 0;
    process.voiceBufferedBytes = 0;
  }
}

function stopWebcamPipe(process: StreamProcess): void {
  if (process.webcamTimer) clearInterval(process.webcamTimer);
  process.webcamTimer = undefined;
  process.webcamUpload?.destroy();
  process.webcamUpload = undefined;
  process.webcamOutput?.destroy();
  process.webcamOutput = undefined;
  process.webcamQueue.length = 0;
  process.webcamPacketBuffer = Buffer.alloc(0);
}

function isRunningChild(child: ChildProcess | null | undefined): child is ChildProcess {
  return Boolean(child && child.exitCode === null && child.signalCode === null && !child.stdin?.destroyed);
}

function startPublisher(process: StreamProcess): ChildProcess {
  if (isRunningChild(process.child) && process.publisherInput) {
    return process.child;
  }

  const publisher = spawn("ffmpeg", buildPublisherArgs(process.input), {
    stdio: ["pipe", "ignore", "pipe"],
  });
  const publisherInput = new PassThrough({ highWaterMark: 2 * 1024 * 1024 });
  process.child = publisher;
  process.publisherInput = publisherInput;
  process.publisherIngestUrl = process.input.ingestUrl;

  publisherInput.pipe(publisher.stdin!, { end: false });
  publisherInput.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Publisher input bridge closed");
  });
  publisher.stdin?.on("error", (error) => {
    // An ingest failure is reported by the publisher exit handler below. The
    // stdin error itself must be consumed so an EPIPE cannot crash Node.
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Publisher input pipe closed");
  });
  publisher.stderr?.on("data", () => {
    // FFmpeg output can contain the private ingest URL. Keep it out of logs.
  });
  publisher.once("error", (error) => {
    process.status = "failed";
    logger.error({ streamId: process.input.streamId, error: error.message }, "FFmpeg process error");
  });
  publisher.once("exit", (code, signal) => {
    if (process.publisherInput === publisherInput) {
      publisherInput.unpipe(publisher.stdin!);
      publisherInput.destroy();
      process.publisherInput = undefined;
    }
    if (process.child === publisher) process.child = null;
    if (process.status === "running") {
      process.status = "failed";
      process.renderer?.kill("SIGTERM");
      logger.error({ streamId: process.input.streamId, code, signal }, "Live publisher exited");
    }
  });

  return publisher;
}

function startWebcamPipe(process: StreamProcess): PassThrough {
  if (process.webcamOutput) return process.webcamOutput;
  const output = new PassThrough({ highWaterMark: 1024 * 1024 });
  process.webcamOutput = output;
  output.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Live webcam pipe closed");
  });
  process.webcamTimer = setInterval(() => {
    const current = processes.get(process.input.streamId);
    if (
      !current
      || current.status !== "running"
      || !current.input.liveWebcam
      || !current.webcamOutput
      || current.webcamOutput.destroyed
    ) return;
    const cutoff = Date.now() - liveMediaJitterMs;
    let newestReadyIndex = -1;
    for (let index = 0; index < current.webcamQueue.length; index += 1) {
      if (current.webcamQueue[index].receivedAt > cutoff) break;
      newestReadyIndex = index;
    }
    const readyFrames = newestReadyIndex >= 0
      ? current.webcamQueue.splice(0, newestReadyIndex + 1)
      : [];
    const frame = readyFrames.length
      ? readyFrames[readyFrames.length - 1].data
      : transparentWebcamFrame;
    try {
      current.webcamOutput.write(frame);
    } catch (error) {
      logger.warn(
        { streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" },
        "Live webcam frame write skipped",
      );
    }
  }, liveWebcamFrameIntervalMs);
  primeWebcamPipe(process);
  return output;
}

function appendWebcamPacket(process: StreamProcess, chunk: Buffer): void {
  process.webcamPacketBuffer = Buffer.concat([process.webcamPacketBuffer, chunk]);
  while (process.webcamPacketBuffer.length >= 4) {
    const frameLength = process.webcamPacketBuffer.readUInt32BE(0);
    if (frameLength <= 0 || frameLength > 4 * 1024 * 1024) {
      process.webcamPacketBuffer = Buffer.alloc(0);
      logger.warn({ streamId: process.input.streamId }, "Discarded malformed live webcam packet");
      return;
    }
    if (process.webcamPacketBuffer.length < frameLength + 4) return;
    const frame = Buffer.from(process.webcamPacketBuffer.subarray(4, frameLength + 4));
    process.webcamPacketBuffer = process.webcamPacketBuffer.subarray(frameLength + 4);
    process.webcamQueue.push({ data: frame, receivedAt: Date.now() });
    if (process.webcamQueue.length > liveWebcamMaxQueueFrames) {
      process.webcamQueue.splice(0, process.webcamQueue.length - liveWebcamMaxQueueFrames);
    }
  }
}

function hasAudioStream(input: { path: string; playlistPath?: string }): boolean {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      ...(input.playlistPath ? ["-f", "concat", "-safe", "0"] : []),
      "-select_streams",
      "a:0",
      "-show_entries",
      "stream=index",
      "-of",
      "csv=p=0",
      "-i",
      input.path,
    ],
    { encoding: "utf8" },
  );
  return result.status === 0 && Boolean(result.stdout?.trim());
}

function validateIngestUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Enter a complete live ingest URL.");
  }

  if (!["http:", "https:", "rtmp:", "rtmps:"].includes(url.protocol)) {
    throw new Error("This ingest URL must use HTTP, HTTPS, RTMP, or RTMPS.");
  }
  return url;
}

function setFile(url: URL, filename: string): string {
  const copy = new URL(url.toString());
  copy.searchParams.set("file", filename);
  return copy.toString();
}

function buildFfmpegArgs(
  input: StreamRunnerInput,
  videoInput: { path: string; playlistPath?: string; paths: string[] },
  faceInput?: { path: string; playlistPath?: string; paths: string[] },
  animationInput?: { path: string; playlistPath?: string; paths: string[] },
  logoInput?: { path: string; image: boolean },
): string[] {
  const aspectRatio = input.aspectRatio ?? "full";
  const quality = input.quality ?? "4k";
  const dimensions = {
    shorts: [1080, 1920],
    full: quality === "4k" ? [3840, 2160] : [1920, 1080],
    square: [1080, 1080],
  }[aspectRatio];
  const [width, height] = dimensions;
  const facePath = faceInput?.path;
  const animationPath = animationInput?.path;
  const logoPath = logoInput?.path;
  const composition = input.composition;
  const playbackSpeed = Math.min(2, Math.max(0.5, input.playbackSpeed ?? 1));
  const mainScale = clamp(composition?.mainScale, 0.5, 2.5, 1);
  const webcamScale = clamp(composition?.webcamScale, 0.1, 0.8, input.faceScale ?? 0.25);
  const animationScale = clamp(composition?.animationScale, 0.1, 0.8, input.liveAnimationScale ?? 0.25);
  const logoScale = clamp(composition?.logoScale, 0.1, 0.6, 0.25);
  const liveWebcamInput = Boolean(input.liveWebcam);
  const liveWebcamScale = clamp(input.liveWebcam?.scale, 0.1, 0.8, 0.25);
  const legacyChroma = composition?.chromaKeyEnabled
    ? {
        enabled: true,
        color: composition.chromaKeyColor || "#00ff00",
        similarity: clamp(composition.chromaSimilarity, 0.1, 0.9, 0.32),
        blend: clamp(composition.chromaBlend, 0, 0.35, 0.08),
      }
    : undefined;
  const chromaFor = (layer: "main" | "webcam" | "animation", source?: string) => {
    const sourceSettings = source ? composition?.chromaKeyBySource?.[source] : undefined;
    if (sourceSettings) {
      return {
        enabled: sourceSettings.enabled === true,
        color: sourceSettings.color || "#00ff00",
        similarity: clamp(sourceSettings.similarity, 0.1, 0.9, 0.32),
        blend: clamp(sourceSettings.blend, 0, 0.35, 0.08),
      };
    }
    const saved = composition?.chromaKeyByLayer?.[layer];
    if (saved) {
      return {
        enabled: saved.enabled === true,
        color: saved.color || "#00ff00",
        similarity: clamp(saved.similarity, 0.1, 0.9, 0.32),
        blend: clamp(saved.blend, 0, 0.35, 0.08),
      };
    }
    return composition?.chromaKeyTarget === layer ? legacyChroma : undefined;
  };
  const mainChroma = chromaFor("main");
  const webcamChroma = chromaFor("webcam", faceInput?.paths[0]);
  const animationChroma = chromaFor("animation", animationInput?.paths[0]);
  const sourceChromaSegments = videoInput.paths
    .map((source, index) => {
      const settings = chromaFor("main", source);
      if (!settings?.enabled) return undefined;
      const duration = clamp(composition?.chromaKeyDurations?.[source], 0.01, 24 * 60 * 60, 0);
      return duration > 0 ? { settings, start: videoInput.paths.slice(0, index).reduce((total, item) => total + clamp(composition?.chromaKeyDurations?.[item], 0, 24 * 60 * 60, 0), 0), duration } : undefined;
    })
    .filter((segment): segment is { settings: NonNullable<ReturnType<typeof chromaFor>>; start: number; duration: number } => Boolean(segment));
  const totalChromaDuration = sourceChromaSegments.length
    ? videoInput.paths.reduce((total, source) => total + clamp(composition?.chromaKeyDurations?.[source], 0, 24 * 60 * 60, 0), 0)
    : 0;
  const mainChromaFilters = sourceChromaSegments.length
    ? sourceChromaSegments.map(({ settings, start, duration }) => {
        const end = start + duration;
        const time = totalChromaDuration > 0
          ? `between(mod(t\\,${totalChromaDuration.toFixed(3)})\\,${start.toFixed(3)}\\,${end.toFixed(3)})`
          : "1";
        return `chromakey=${settings.color}:similarity=${settings.similarity}:blend=${settings.blend}:enable='${time}'`;
      }).join(",")
    : mainChroma?.enabled
      ? `chromakey=${mainChroma.color}:similarity=${mainChroma.similarity}:blend=${mainChroma.blend}`
      : "";
  const needsVideoFilter = aspectRatio !== "full"
    || Boolean(facePath)
    || Boolean(animationPath)
    || Boolean(logoPath)
    || liveWebcamInput
    || Boolean(composition)
    || Boolean(mainChroma?.enabled)
    || playbackSpeed !== 1
    || quality === "1080p";
  const videoBitrate = quality === "4k" && aspectRatio === "full" ? "28M" : "8M";
  const videoBuffer = quality === "4k" && aspectRatio === "full" ? "56M" : "16M";
  const videoLevel = quality === "4k" && aspectRatio === "full" ? "5.2" : "4.2";
  const voiceAudio = input.voiceAudio === true;
  const faceInputIndex = 1;
  const animationInputIndex = faceInputIndex + Number(Boolean(facePath));
  const logoInputIndex = animationInputIndex + Number(Boolean(animationPath));
  const voiceInputIndex = logoInputIndex + Number(Boolean(logoPath));
  const silenceInput = voiceAudio && input.baseAudioAvailable === false;
  const liveWebcamInputIndex = voiceInputIndex + Number(silenceInput);
  const voicePipeInputIndex = liveWebcamInputIndex + Number(liveWebcamInput);

  const inputArgs = [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-re",
    "-stream_loop",
    "-1",
    ...(input.renderOffsetSeconds && input.renderOffsetSeconds > 0
      ? ["-ss", input.renderOffsetSeconds.toFixed(3)]
      : []),
    ...(videoInput.playlistPath ? ["-f", "concat", "-safe", "0"] : []),
    "-i",
    videoInput.path,
  ];

  if (faceInput) {
    inputArgs.push(
      "-re",
      "-stream_loop",
      "-1",
      ...(faceInput.playlistPath ? ["-f", "concat", "-safe", "0"] : []),
      "-i",
      faceInput.path,
    );
  }

  if (animationInput) {
    inputArgs.push(
      "-re",
      "-stream_loop",
      "-1",
      ...(animationInput.playlistPath ? ["-f", "concat", "-safe", "0"] : []),
      "-i",
      animationInput.path,
    );
  }
  if (logoInput) {
    inputArgs.push(
      ...(logoInput.image ? ["-loop", "1"] : ["-re", "-stream_loop", "-1"]),
      "-i",
      logoInput.path,
    );
  }
  if (voiceAudio) {
    if (silenceInput) {
      inputArgs.push(
        "-f",
        "lavfi",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=48000",
      );
    }
  }
  if (liveWebcamInput) {
    inputArgs.push(
      "-thread_queue_size",
      "16",
      "-framerate",
      "10",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "-i",
      "pipe:4",
    );
  }
  if (voiceAudio) {
    inputArgs.push(
      "-thread_queue_size",
      "32",
      "-f",
      "s16le",
      "-ar",
      "48000",
      "-ac",
      "1",
      "-i",
      "pipe:3",
    );
  }
  const audioFilter = voiceAudio
    ? `[${silenceInput ? voiceInputIndex : 0}:a:0]aresample=48000[base_audio];[${voicePipeInputIndex}:a:0]aresample=48000[voice_audio];[base_audio][voice_audio]amix=inputs=2:duration=first:dropout_transition=0:weights=1 1[mixed_audio]`
    : "";

  const videoArgs = needsVideoFilter
    ? [
        "-filter_complex",
        [
          ...(composition
            ? [
                `color=c=#061518:s=${width}x${height}[canvas]`,
                `[0:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}:force_original_aspect_ratio=${composition.cropMode === "crop" ? "increase" : "decrease"}${composition.cropMode === "crop" ? `,crop=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}` : ""},eq=brightness=${clamp(composition.brightness, -1, 1, 0)}:contrast=${clamp(composition.contrast, 0.5, 1.8, 1)}:saturation=${clamp(composition.saturation, 0, 2, 1)},hue=h=${clamp(composition.hue, -180, 180, 0)}${mainChromaFilters ? `,${mainChromaFilters}` : ""}[main]`,
                `[canvas][main]overlay=x='(W-w)/2+${Math.round(width * clamp(composition.mainX, -48, 48, 0) / 100)}':y='(H-h)/2+${Math.round(height * clamp(composition.mainY, -48, 48, 0) / 100)}':eof_action=repeat[base]`,
              ]
            : [`[0:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[base]`]),
          ...(facePath
            ? [
                `[${faceInputIndex}:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=iw*${webcamScale}:-1${webcamChroma?.enabled ? `,chromakey=${webcamChroma.color}:similarity=${webcamChroma.similarity}:blend=${webcamChroma.blend}` : ""}[face]`,
                composition
                  ? `[base][face]overlay=x='(main_w-overlay_w)/2+${Math.round(width * clamp(composition.webcamX, -48, 48, 0) / 100)}':y='(main_h-overlay_h)/2+${Math.round(height * clamp(composition.webcamY, -48, 48, 0) / 100)}':eof_action=repeat[with_face]`
                  : `[base][face]overlay=${
                    input.facePosition === "top-left" || input.facePosition === "bottom-left"
                      ? "24"
                      : input.facePosition === "center"
                        ? "(W-w)/2"
                        : "W-w-24"
                  }:${
                    input.facePosition === "top-left" || input.facePosition === "top-right"
                      ? "24"
                      : input.facePosition === "center"
                        ? "(H-h)/2"
                        : "H-h-24"
                  }[with_face]`,
              ]
            : []),
          ...(liveWebcamInput
            ? [
                `[${liveWebcamInputIndex}:v]format=rgba,scale=iw*${liveWebcamScale}:-2:flags=lanczos[live_webcam]`,
                `[${facePath ? "with_face" : "base"}][live_webcam]overlay=${
                  input.liveWebcam?.position === "top-left" || input.liveWebcam?.position === "bottom-left"
                    ? "24"
                    : input.liveWebcam?.position === "center"
                      ? "(main_w-overlay_w)/2"
                      : "main_w-overlay_w-24"
                }:${
                  input.liveWebcam?.position === "top-left" || input.liveWebcam?.position === "top-right"
                    ? "24"
                    : input.liveWebcam?.position === "center"
                      ? "(main_h-overlay_h)/2"
                      : "main_h-overlay_h-24"
                }:eof_action=pass[with_live_webcam]`,
              ]
            : []),
          ...(animationPath
            ? [
                `[${animationInputIndex}:v]scale=${Math.round(width * animationScale)}:-2${animationChroma?.enabled ? `,chromakey=${animationChroma.color}:similarity=${animationChroma.similarity}:blend=${animationChroma.blend}` : ""}[animation]`,
                `[${liveWebcamInput ? "with_live_webcam" : facePath ? "with_face" : "base"}][animation]overlay=(main_w-overlay_w)/2+${Math.round(width * clamp(composition?.animationX ?? input.liveAnimationX, -48, 48, 0) / 100)}:(main_h-overlay_h)/2+${Math.round(height * clamp(composition?.animationY ?? input.liveAnimationY, -48, 48, 0) / 100)}:eof_action=repeat[with_animation]`,
              ]
            : []),
          ...(logoPath
            ? [
                `[${logoInputIndex}:v]scale=iw*${logoScale}:ih*${logoScale}[logo]`,
                `[${animationPath ? "with_animation" : liveWebcamInput ? "with_live_webcam" : facePath ? "with_face" : "base"}][logo]overlay=${logoPosition(composition?.logoPosition, "main_w", "main_h")}:eof_action=repeat[with_logo]`,
              ]
            : []),
          ...(audioFilter ? [audioFilter] : []),
        ].join(";"),
        "-map",
        logoPath ? "[with_logo]" : animationPath ? "[with_animation]" : liveWebcamInput ? "[with_live_webcam]" : facePath ? "[with_face]" : "[base]",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-tune",
        "zerolatency",
        "-b:v",
        videoBitrate,
        "-minrate",
        videoBitrate,
        "-maxrate",
        videoBitrate,
        "-bufsize",
        videoBuffer,
        "-profile:v",
        "high",
        "-level",
        videoLevel,
        "-pix_fmt",
        "yuv420p",
        "-r",
        "60",
        "-g",
        "120",
        "-keyint_min",
        "120",
        "-sc_threshold",
        "0",
        "-fps_mode",
        "cfr",
      ]
    : voiceAudio
      ? ["-filter_complex", audioFilter, "-map", "0:v:0", "-c:v", "copy"]
      : ["-map", "0:v:0", "-c:v", "copy"];

  const audioArgs = [
    "-map",
    voiceAudio ? "[mixed_audio]" : "0:a:0?",
    "-c:a",
    "aac",
    "-b:a",
      "192k",
    "-ar",
    "44100",
    ...(playbackSpeed === 1 ? [] : ["-af", `atempo=${playbackSpeed}`]),
  ];

  return [
    ...inputArgs,
    ...videoArgs,
    ...audioArgs,
    "-f",
    "mpegts",
    "-mpegts_flags",
    "+resend_headers",
    "-flush_packets",
    "1",
    "pipe:1",
  ];
}

function buildPublisherArgs(input: StreamRunnerInput): string[] {
  const ingestUrl = validateIngestUrl(input.ingestUrl);
  const inputArgs = ["-hide_banner", "-loglevel", "warning", "-thread_queue_size", "1024", "-f", "mpegts", "-i", "pipe:0"];
  const outputArgs = ["-map", "0:v:0", "-map", "0:a:0?", "-c", "copy"];

  if (ingestUrl.pathname.includes("http_upload_hls")) {
    const playlistUrl = setFile(ingestUrl, "signal_desk.m3u8");
    const segmentUrl = setFile(ingestUrl, "signal_desk_%05d.ts");
    return [
      ...inputArgs,
      ...outputArgs,
      "-f",
      "hls",
      "-method",
      "PUT",
      "-hls_time",
      "2",
      "-hls_list_size",
      "5",
      "-hls_playlist_type",
      "event",
      "-hls_segment_filename",
      segmentUrl,
      "-http_persistent",
      "1",
      playlistUrl,
    ];
  }

  if (ingestUrl.protocol === "rtmp:" || ingestUrl.protocol === "rtmps:") {
    return [...inputArgs, ...outputArgs, "-f", "flv", ingestUrl.toString()];
  }

  throw new Error("This URL is not a supported YouTube HLS or RTMP ingest URL.");
}

function resultFor(streamId: string, process: StreamProcess, message: string): StreamRunnerResult {
  return {
    streamId,
    status: process.status,
    message,
    pid: process.child?.pid ?? null,
  };
}

const rendererHandoffTimeoutMs = 15_000;

function completeRendererHandoff(process: StreamProcess, renderer: ChildProcess): void {
  const handoff = process.rendererHandoff;
  if (!handoff || handoff.newRenderer !== renderer) return;
  if (handoff.timeout) clearTimeout(handoff.timeout);
  process.rendererHandoff = undefined;
  stopRenderer(process, handoff.oldRenderer);
  cleanupPlaylistPaths(handoff.oldPlaylistPaths);
  logger.info({ streamId: process.input.streamId }, "FFmpeg renderer handoff completed");
}

function abortRendererHandoff(process: StreamProcess, renderer: ChildProcess, reason: string): void {
  const handoff = process.rendererHandoff;
  if (!handoff || handoff.newRenderer !== renderer) return;
  if (handoff.timeout) clearTimeout(handoff.timeout);
  process.rendererHandoff = undefined;

  detachRendererOutputs(process, renderer);
  renderer.kill("SIGTERM");
  cleanupPlaylistPaths(process.playlistPaths);
  process.playlistPaths = handoff.oldPlaylistPaths;
  process.renderer = handoff.oldRenderer;
  process.renderStartedAtMs = handoff.oldRenderStartedAtMs;
  startPreview(process, handoff.oldRenderer);
  startVoicePipe(process, handoff.oldRenderer);
  logger.warn({ streamId: process.input.streamId, reason }, "FFmpeg renderer handoff rolled back");
}

function launchProcess(process: StreamProcess): void {
  if (process.rendererHandoff) {
    throw new Error("A previous renderer update is still warming up. Try the update again shortly.");
  }
  const previousRenderer = process.renderer;
  const previousPlaylistPaths = process.playlistPaths;
  const previousRenderStartedAtMs = process.renderStartedAtMs;

  if (process.durationTimer) clearTimeout(process.durationTimer);
  process.durationTimer = undefined;
  stopVoicePipe(process, false);
  startWebcamPipe(process);
  primeWebcamPipe(process);
  const videoPaths = getVideoPaths(process.input.category, process.input.videoSources, process.input.videoSource);
  const facePaths = process.input.composition?.webcamSource
    ? [getVideoPath("editor face cam", process.input.composition.webcamSource)]
    : process.input.faceCategory
    ? getVideoPaths(process.input.faceCategory, process.input.faceSources, process.input.faceSource)
    : [];
  const animationSource = process.input.composition?.animationSource || process.input.liveAnimationSource;
  const animationInput = animationSource
    ? { path: getVideoPaths("live animation", undefined, animationSource)[0] }
    : undefined;
  const logoInput = process.input.composition?.logoSource
    ? {
        path: getVideoPath("editor logo", process.input.composition.logoSource),
        image: /\.(png|jpe?g|webp)$/i.test(process.input.composition.logoSource),
      }
    : undefined;
  const videoInput = prepareInput(videoPaths);
  const faceInput = facePaths.length ? prepareInput(facePaths) : undefined;
  const preparedAnimationInput = animationInput ? prepareInput([animationInput.path]) : undefined;
  const nextPlaylistPaths = [videoInput.playlistPath, faceInput?.playlistPath, preparedAnimationInput?.playlistPath]
    .filter((playlistPath): playlistPath is string => Boolean(playlistPath));
  const publisher = startPublisher(process);
  const rendererInput = {
    ...process.input,
    baseAudioAvailable: hasAudioStream(videoInput),
    liveWebcam: process.input.liveWebcam ?? { position: "bottom-right" as const, scale: 0.25 },
    renderOffsetSeconds: process.playbackOffsetSeconds,
  };
  let renderer: ChildProcess;
  try {
    renderer = spawn("ffmpeg", buildFfmpegArgs(rendererInput, videoInput, faceInput, preparedAnimationInput, logoInput), {
      stdio: ["ignore", "pipe", "pipe", "pipe", "pipe"],
    });
  } catch (error) {
    cleanupPlaylistPaths(nextPlaylistPaths);
    throw error;
  }

  // Wire the new renderer before stopping the old one. The publisher and its
  // ingest connection therefore survive composition and playlist updates.
  stopPreview(process);
  process.child = publisher;
  process.renderer = renderer;
  process.playlistPaths = nextPlaylistPaths;
  process.startedAt = new Date().toISOString();
  process.renderStartedAtMs = Date.now();
  startPreview(process, renderer);
  const publisherInput = process.publisherInput;
  if (!publisherInput) {
    renderer.kill("SIGTERM");
    throw new Error("The live publisher input bridge could not be created.");
  }
  // The publisher input bridge survives renderer handoffs. A renderer may end
  // or be killed, but it must never end the publisher's stdin.
  renderer.stdout?.pipe(publisherInput, { end: false });
  const detachRendererOutput = () => renderer.stdout?.unpipe(publisherInput);
  renderer.stdout?.once("close", detachRendererOutput);
  renderer.stdout?.once("end", detachRendererOutput);
  renderer.stdout?.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Renderer output pipe closed");
  });
  if (process.webcamOutput) {
    const webcamOutput = renderer.stdio[4] as Writable | null;
    if (webcamOutput && typeof webcamOutput.write === "function") {
      process.webcamOutput.pipe(webcamOutput, { end: false });
    }
    renderer.stdio[4]?.on("error", (error) => {
      logger.warn({ streamId: process.input.streamId, error: error.message }, "Webcam input pipe closed");
    });
  }
  startVoicePipe(process, renderer);
  if (process.input.durationMinutes) {
    process.durationTimer = setTimeout(() => {
      if (process.status === "running") process.renderer?.kill("SIGTERM");
    }, process.input.durationMinutes * 60 * 1000);
  }

  renderer.stderr?.on("data", () => {
    // Renderer output is intentionally not logged.
  });
  renderer.once("error", (error) => {
    if (process.rendererHandoff?.newRenderer === renderer) {
      logger.warn({ streamId: process.input.streamId, error: error.message }, "Warming FFmpeg renderer failed");
      return;
    }
    if (process.renderer !== renderer) return;
    process.status = "failed";
    logger.error({ streamId: process.input.streamId, error: error.message }, "FFmpeg renderer error");
  });
  renderer.once("exit", (code, signal) => {
    if (process.rendererHandoff?.newRenderer === renderer) {
      abortRendererHandoff(process, renderer, `new renderer exited (${code ?? signal ?? "unknown"})`);
      return;
    }
    // A renderer replaced by a handoff is expected to exit after the new
    // renderer has taken over. It must not change the stream status or start
    // another renderer from its stale exit handler.
    if (process.renderer !== renderer) return;
    cleanupPlaylists(process);
    process.renderer = undefined;
    if (process.durationTimer) {
      clearTimeout(process.durationTimer);
      process.durationTimer = undefined;
    }
    if (process.status !== "running") return;

    if (process.input.autoRestart && process.input.durationMinutes) {
      logger.info({ streamId: process.input.streamId, code, signal }, "Stream duration reached; restarting FFmpeg");
      process.restartTimer = setTimeout(() => {
        process.restartTimer = undefined;
        try {
          launchProcess(process);
        } catch (error) {
          process.status = "failed";
          logger.error(
            { streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" },
            "FFmpeg restart rejected",
          );
        }
      }, 1500);
      return;
    }

    stopPreview(process);
    process.status = code === 0 ? "stopped" : "failed";
    logger.info(
      { streamId: process.input.streamId, code, signal, status: process.status },
      "FFmpeg process exited",
    );
  });

  if (previousRenderer && previousRenderer !== renderer) {
    const handoff: NonNullable<StreamProcess["rendererHandoff"]> = {
      oldRenderer: previousRenderer,
      oldPlaylistPaths: previousPlaylistPaths,
      oldRenderStartedAtMs: previousRenderStartedAtMs,
      newRenderer: renderer,
    };
    process.rendererHandoff = handoff;
    renderer.stdout?.once("data", () => completeRendererHandoff(process, renderer));
    handoff.timeout = setTimeout(
      () => abortRendererHandoff(process, renderer, "new renderer produced no output within 15 seconds"),
      rendererHandoffTimeoutMs,
    );
    handoff.timeout.unref();
  }
}

export function startStream(input: StreamRunnerInput): StreamRunnerResult {
  const current = processes.get(input.streamId);
  if (current?.status === "running") {
    throw new Error("This channel is already streaming.");
  }

  getVideoPaths(input.category, input.videoSources, input.videoSource);
  if (input.faceCategory) getVideoPaths(input.faceCategory, input.faceSources, input.faceSource);
  if (input.liveAnimationSource) getVideoPaths("live animation", undefined, input.liveAnimationSource);
  if (input.composition?.webcamSource) getVideoPath("editor face cam", input.composition.webcamSource);
  if (input.composition?.animationSource) getVideoPath("live animation", input.composition.animationSource);
  if (input.composition?.logoSource) getVideoPath("editor logo", input.composition.logoSource);

  const streamProcess: StreamProcess = {
    child: null,
    startedAt: new Date().toISOString(),
    status: "running",
    input,
    voiceQueue: [],
    voiceBufferedBytes: 0,
    webcamPacketBuffer: Buffer.alloc(0),
    webcamQueue: [],
    playbackOffsetSeconds: 0,
    renderStartedAtMs: Date.now(),
  };
  startWebcamPipe(streamProcess);
  processes.set(input.streamId, streamProcess);
  launchProcess(streamProcess);

  return resultFor(input.streamId, streamProcess, "FFmpeg stream process started.");
}

export function updateStream(input: StreamRunnerInput): StreamRunnerResult {
  const current = processes.get(input.streamId);
  if (!current || current.status !== "running") {
    throw new Error("This channel is not currently streaming.");
  }
  if (current.rendererHandoff) {
    throw new Error("A previous renderer update is still warming up. Try the update again shortly.");
  }
  if (current.publisherIngestUrl && current.publisherIngestUrl !== input.ingestUrl) {
    throw new Error("The live destination cannot be changed while on air. Stop the channel and start it again.");
  }

  getVideoPaths(input.category, input.videoSources, input.videoSource);
  if (input.faceCategory) getVideoPaths(input.faceCategory, input.faceSources, input.faceSource);
  if (input.liveAnimationSource) getVideoPaths("live animation", undefined, input.liveAnimationSource);
  if (input.composition?.webcamSource) getVideoPath("editor face cam", input.composition.webcamSource);
  if (input.composition?.animationSource) getVideoPath("live animation", input.composition.animationSource);
  if (input.composition?.logoSource) getVideoPath("editor logo", input.composition.logoSource);

  if (current.durationTimer) {
    clearTimeout(current.durationTimer);
    current.durationTimer = undefined;
  }
  if (current.restartTimer) {
    clearTimeout(current.restartTimer);
    current.restartTimer = undefined;
  }
  current.playbackOffsetSeconds += Math.max(
    0,
    (Date.now() - current.renderStartedAtMs) / 1000,
  ) * Math.min(2, Math.max(0.5, current.input.playbackSpeed ?? 1));
  const previousInput = current.input;
  current.input = {
    ...input,
    // Keep the hot camera overlay attached when a normal stream update arrives
    // from the control room. Detaching it is handled explicitly by the webcam
    // endpoint instead of as a side effect of playlist/composition updates.
    liveWebcam: input.liveWebcam ?? current.input.liveWebcam,
  };
  try {
    launchProcess(current);
  } catch (error) {
    current.input = previousInput;
    throw error;
  }
  return resultFor(input.streamId, current, "FFmpeg playlist update accepted.");
}

export function stopStream(streamId: string): StreamRunnerResult | null {
  const streamProcess = processes.get(streamId);
  if (!streamProcess) return null;

  streamProcess.status = "stopped";
  stopPreview(streamProcess);
  stopVoicePipe(streamProcess);
  stopWebcamPipe(streamProcess);
  if (streamProcess.publisherInput) {
    streamProcess.publisherInput.unpipe(streamProcess.child?.stdin!);
    streamProcess.publisherInput.destroy();
    streamProcess.publisherInput = undefined;
  }
  if (streamProcess.durationTimer) clearTimeout(streamProcess.durationTimer);
  if (streamProcess.restartTimer) clearTimeout(streamProcess.restartTimer);
  const pendingHandoff = streamProcess.rendererHandoff;
  if (pendingHandoff?.timeout) clearTimeout(pendingHandoff.timeout);
  streamProcess.rendererHandoff = undefined;
  if (streamProcess.renderer) stopRenderer(streamProcess, streamProcess.renderer);
  if (pendingHandoff) stopRenderer(streamProcess, pendingHandoff.oldRenderer);
  cleanupPlaylistPaths(streamProcess.playlistPaths);
  cleanupPlaylistPaths(pendingHandoff?.oldPlaylistPaths);
  streamProcess.playlistPaths = undefined;
  streamProcess.child?.kill("SIGTERM");
  setTimeout(() => {
    if (streamProcess.child && !streamProcess.child.killed) streamProcess.child.kill("SIGKILL");
  }, 5000).unref();
  return resultFor(streamId, streamProcess, "FFmpeg stream process stopped.");
}

export function attachLiveWebcam(
  streamId: string,
  webcamInput: PassThrough,
  settings: NonNullable<StreamRunnerInput["liveWebcam"]>,
): void {
  const process = processes.get(streamId);
  if (!process || process.status !== "running") {
    webcamInput.destroy();
    throw new Error("This channel is not currently streaming.");
  }
  process.webcamUpload?.destroy();
  process.webcamUpload = webcamInput;
  const previousInput = process.input;
  process.input = { ...process.input, liveWebcam: settings };
  try {
    launchProcess(process);
  } catch (error) {
    process.input = previousInput;
    throw error;
  }
  webcamInput.on("error", (error) => {
    logger.warn({ streamId, error: error.message }, "Live webcam input closed");
  });
  webcamInput.on("data", (chunk: Buffer) => appendWebcamPacket(process, chunk));
}

export function detachLiveWebcam(streamId: string, webcamInput: PassThrough): void {
  const process = processes.get(streamId);
  if (!process || process.webcamUpload !== webcamInput) return;
  process.webcamUpload.destroy();
  process.webcamUpload = undefined;
  process.input = { ...process.input, liveWebcam: undefined };
}

export function appendVoiceAudio(streamId: string, chunk: Buffer): void {
  const streamProcess = processes.get(streamId);
  if (!streamProcess || streamProcess.status !== "running" || streamProcess.input.voiceAudio !== true) return;
  if (chunk.length === 0) return;
  const data = Buffer.from(chunk);
  streamProcess.voiceQueue.push({ data, receivedAt: Date.now() });
  streamProcess.voiceBufferedBytes += data.length;

  while (streamProcess.voiceBufferedBytes > maxVoiceBufferBytes && streamProcess.voiceQueue.length) {
    const queued = streamProcess.voiceQueue[0];
    const bytesToDrop = Math.min(streamProcess.voiceBufferedBytes - maxVoiceBufferBytes, queued.data.length);
    streamProcess.voiceBufferedBytes -= bytesToDrop;
    if (bytesToDrop === queued.data.length) {
      streamProcess.voiceQueue.shift();
    } else {
      queued.data = queued.data.subarray(bytesToDrop);
    }
  }
}

export function getStreamStatus(streamId: string): StreamRunnerResult {
  const streamProcess = processes.get(streamId);
  if (!streamProcess) {
    return { streamId, status: "stopped", message: "No stream process is running.", pid: null };
  }
  return resultFor(
    streamId,
    streamProcess,
    streamProcess.status === "running" ? "FFmpeg stream process is running." : "FFmpeg stream process is no longer running.",
  );
}