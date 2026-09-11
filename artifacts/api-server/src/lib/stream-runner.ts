import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
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
  chromaKeyEnabled?: boolean;
  chromaKeyTarget?: "webcam" | "animation";
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
};

export type StreamRunnerResult = {
  streamId: string;
  status: StreamRunnerStatus;
  message: string;
  pid: number | null;
};

type StreamProcess = {
  child: ChildProcess | null;
  renderer?: ChildProcess;
  startedAt: string;
  status: StreamRunnerStatus;
  input: StreamRunnerInput;
  durationTimer?: NodeJS.Timeout;
  restartTimer?: NodeJS.Timeout;
  playlistPaths?: string[];
  playlistUpdateRequested?: boolean;
  voiceOutput?: Writable;
  webcamInput?: PassThrough;
  voiceQueue: Buffer[];
  voiceTimer?: NodeJS.Timeout;
};

const assetNamesByCategory: Record<string, string> = {
  "gtv 5 face": "WhatsApp Video 2026-09-04 at 11.30.43 PM.mp4",
  gtv5face: "WhatsApp Video 2026-09-04 at 11.30.43 PM.mp4",
};
const processes = new Map<string, StreamProcess>();

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

function prepareInput(paths: string[]): { path: string; playlistPath?: string } {
  if (paths.length === 1) return { path: paths[0] };
  const playlistPath = path.resolve(process.cwd(), `.signal-desk-playlist-${randomUUID()}.txt`);
  writeFileSync(playlistPath, `${paths.map((filePath) => `file '${escapePlaylistPath(filePath)}'`).join("\n")}\n`);
  return { path: playlistPath, playlistPath };
}

function cleanupPlaylists(process: StreamProcess): void {
  process.playlistPaths?.forEach((playlistPath) => unlinkSync(playlistPath));
  process.playlistPaths = undefined;
}

const voiceFrameBytes = 1920;
const silenceFrame = Buffer.alloc(voiceFrameBytes);

function resetVoicePipe(process: StreamProcess): void {
  process.voiceOutput = undefined;
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
  if (!process.voiceTimer) {
    process.voiceTimer = setInterval(() => {
      const current = processes.get(process.input.streamId);
      const voiceOutput = current?.voiceOutput;
      if (!current || current.status !== "running" || !voiceOutput || voiceOutput.destroyed || voiceOutput.writableEnded) return;
      const next = current.voiceQueue.shift() || silenceFrame;
      try {
        voiceOutput.write(next);
      } catch (error) {
        logger.warn({ streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" }, "Voice audio write skipped");
        if (current.voiceOutput === voiceOutput) current.voiceOutput = undefined;
      }
    }, 20);
  }
}

function stopVoicePipe(process: StreamProcess): void {
  if (process.voiceTimer) clearInterval(process.voiceTimer);
  process.voiceTimer = undefined;
  resetVoicePipe(process);
  process.voiceQueue.length = 0;
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
  videoInput: { path: string; playlistPath?: string },
  faceInput?: { path: string; playlistPath?: string },
  animationInput?: { path: string; playlistPath?: string },
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
  const needsVideoFilter = aspectRatio !== "full"
    || Boolean(facePath)
    || Boolean(animationPath)
    || Boolean(logoPath)
    || liveWebcamInput
    || Boolean(composition)
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
      "512",
      "-f",
      "webm",
      "-i",
      "pipe:4",
    );
  }
  if (voiceAudio) {
    inputArgs.push(
      "-thread_queue_size",
      "512",
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
                `[0:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}:force_original_aspect_ratio=${composition.cropMode === "crop" ? "increase" : "decrease"}${composition.cropMode === "crop" ? `,crop=${Math.round(width * mainScale)}:${Math.round(height * mainScale)}` : ""},eq=brightness=${clamp(composition.brightness, -1, 1, 0)}:contrast=${clamp(composition.contrast, 0.5, 1.8, 1)}:saturation=${clamp(composition.saturation, 0, 2, 1)},hue=h=${clamp(composition.hue, -180, 180, 0)}[main]`,
                `[canvas][main]overlay=x='(W-w)/2+${Math.round(width * clamp(composition.mainX, -48, 48, 0) / 100)}':y='(H-h)/2+${Math.round(height * clamp(composition.mainY, -48, 48, 0) / 100)}':eof_action=repeat[base]`,
              ]
            : [`[0:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[base]`]),
          ...(facePath
            ? [
                `[${faceInputIndex}:v]${playbackSpeed === 1 ? "" : `setpts=PTS/${playbackSpeed},`}scale=iw*${webcamScale}:-1${composition?.chromaKeyEnabled && composition.chromaKeyTarget === "webcam" ? `,chromakey=${composition.chromaKeyColor || "#00ff00"}:similarity=${clamp(composition.chromaSimilarity, 0.1, 0.9, 0.32)}:blend=${clamp(composition.chromaBlend, 0, 0.35, 0.08)}` : ""}[face]`,
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
                `[${liveWebcamInputIndex}:v]scale=iw*${liveWebcamScale}:-2[live_webcam]`,
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
                `[${animationInputIndex}:v]scale=${Math.round(width * animationScale)}:-2${composition?.chromaKeyEnabled && composition.chromaKeyTarget === "animation" ? `,chromakey=${composition.chromaKeyColor || "#00ff00"}:similarity=${clamp(composition.chromaSimilarity, 0.1, 0.9, 0.32)}:blend=${clamp(composition.chromaBlend, 0, 0.35, 0.08)}` : ""}[animation]`,
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

function launchProcess(process: StreamProcess): void {
  stopVoicePipe(process);
  cleanupPlaylists(process);
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
  process.playlistPaths = [videoInput.playlistPath, faceInput?.playlistPath, preparedAnimationInput?.playlistPath].filter((playlistPath): playlistPath is string => Boolean(playlistPath));
  const publisher = spawn("ffmpeg", buildPublisherArgs(process.input), {
    stdio: ["pipe", "ignore", "pipe"],
  });
  const rendererInput = {
    ...process.input,
    baseAudioAvailable: hasAudioStream(videoInput),
    liveWebcam: process.webcamInput ? process.input.liveWebcam : undefined,
  };
  const renderer = spawn("ffmpeg", buildFfmpegArgs(rendererInput, videoInput, faceInput, preparedAnimationInput, logoInput), {
    stdio: ["ignore", "pipe", "pipe", "pipe", "pipe"],
  });

  process.child = publisher;
  process.renderer = renderer;
  process.startedAt = new Date().toISOString();
  renderer.stdout?.pipe(publisher.stdin!, { end: false });
  renderer.stdout?.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Renderer output pipe closed");
  });
  publisher.stdin?.on("error", (error) => {
    logger.warn({ streamId: process.input.streamId, error: error.message }, "Publisher input pipe closed");
  });
  if (process.webcamInput) {
    process.webcamInput.pipe(renderer.stdio[4] as Writable, { end: false });
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

  publisher.stderr?.on("data", () => {
    // FFmpeg output can contain the private ingest URL. Keep it out of logs.
  });
  renderer.stderr?.on("data", () => {
    // Renderer output is intentionally not logged.
  });
  publisher.once("error", (error) => {
    process.status = "failed";
    logger.error({ streamId: process.input.streamId, error: error.message }, "FFmpeg process error");
  });
  publisher.once("exit", (code, signal) => {
    if (process.status === "running") {
      process.status = "failed";
      process.renderer?.kill("SIGTERM");
      logger.error({ streamId: process.input.streamId, code, signal }, "Live publisher exited");
    }
  });
  renderer.once("error", (error) => {
    process.status = "failed";
    logger.error({ streamId: process.input.streamId, error: error.message }, "FFmpeg renderer error");
  });
  renderer.once("exit", (code, signal) => {
    cleanupPlaylists(process);
    process.renderer = undefined;
    if (process.durationTimer) {
      clearTimeout(process.durationTimer);
      process.durationTimer = undefined;
    }
    if (process.status !== "running") return;

    if (process.playlistUpdateRequested) {
      process.playlistUpdateRequested = false;
      try {
        launchProcess(process);
      } catch (error) {
        process.status = "failed";
        logger.error(
          { streamId: process.input.streamId, error: error instanceof Error ? error.message : "unknown error" },
          "Stream playlist update rejected",
        );
      }
      return;
    }

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

    process.status = code === 0 ? "stopped" : "failed";
    logger.info(
      { streamId: process.input.streamId, code, signal, status: process.status },
      "FFmpeg process exited",
    );
  });
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
  };
  processes.set(input.streamId, streamProcess);
  launchProcess(streamProcess);

  return resultFor(input.streamId, streamProcess, "FFmpeg stream process started.");
}

export function updateStream(input: StreamRunnerInput): StreamRunnerResult {
  const current = processes.get(input.streamId);
  if (!current || current.status !== "running") {
    throw new Error("This channel is not currently streaming.");
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
  current.input = input;
  current.playlistUpdateRequested = true;
  current.renderer?.kill("SIGTERM");
  if (!current.renderer) {
    current.playlistUpdateRequested = false;
    launchProcess(current);
  }
  return resultFor(input.streamId, current, "FFmpeg playlist update accepted.");
}

export function stopStream(streamId: string): StreamRunnerResult | null {
  const streamProcess = processes.get(streamId);
  if (!streamProcess) return null;

  streamProcess.status = "stopped";
  streamProcess.playlistUpdateRequested = false;
  stopVoicePipe(streamProcess);
  streamProcess.webcamInput?.destroy();
  streamProcess.webcamInput = undefined;
  if (streamProcess.durationTimer) clearTimeout(streamProcess.durationTimer);
  if (streamProcess.restartTimer) clearTimeout(streamProcess.restartTimer);
  streamProcess.renderer?.kill("SIGTERM");
  streamProcess.child?.kill("SIGTERM");
  setTimeout(() => {
    if (streamProcess.child && !streamProcess.child.killed) streamProcess.child.kill("SIGKILL");
  }, 5000).unref();
  return resultFor(streamId, streamProcess, "FFmpeg stream process stopped.");
}

function restartWithWebcam(process: StreamProcess): void {
  process.playlistUpdateRequested = true;
  process.renderer?.kill("SIGTERM");
  if (!process.renderer) {
    process.playlistUpdateRequested = false;
    launchProcess(process);
  }
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
  process.webcamInput?.destroy();
  process.webcamInput = webcamInput;
  process.input = { ...process.input, liveWebcam: settings };
  webcamInput.on("error", (error) => {
    logger.warn({ streamId, error: error.message }, "Live webcam input closed");
  });
  restartWithWebcam(process);
}

export function detachLiveWebcam(streamId: string, webcamInput: PassThrough): void {
  const process = processes.get(streamId);
  if (!process || process.webcamInput !== webcamInput) return;
  process.webcamInput.destroy();
  process.webcamInput = undefined;
  process.input = { ...process.input, liveWebcam: undefined };
  restartWithWebcam(process);
}

export function appendVoiceAudio(streamId: string, chunk: Buffer): void {
  const streamProcess = processes.get(streamId);
  if (!streamProcess || streamProcess.status !== "running" || streamProcess.input.voiceAudio !== true) return;
  if (chunk.length === 0) return;
  streamProcess.voiceQueue.push(Buffer.from(chunk));
  if (streamProcess.voiceQueue.length > 150) {
    streamProcess.voiceQueue.splice(0, streamProcess.voiceQueue.length - 150);
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