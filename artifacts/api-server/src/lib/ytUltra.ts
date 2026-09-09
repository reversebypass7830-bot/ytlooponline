const YT_ULTRA_DOWNLOAD_URL = "https://api.ytultra.com/ikool/youtube/download";

export type YtUltraMedia = {
  url: string;
  format: string;
  fileSize?: number;
  sizeStr?: string | null;
};

export type YtUltraVideo = {
  title: string;
  duration: string;
  medias: YtUltraMedia[];
};

type YtUltraResponse = {
  code?: unknown;
  msg?: unknown;
  data?: {
    title?: unknown;
    duration?: unknown;
    medias?: unknown;
  };
};

function qualityHeight(format: string): number {
  const normalized = format.toLowerCase();
  const numeric = normalized.match(/(\d{3,4})p?/i)?.[1];
  if (numeric) return Number(numeric);
  if (normalized.includes("4k")) return 2160;
  if (normalized.includes("2k")) return 1440;
  return 0;
}

function isMp4Video(media: YtUltraMedia): boolean {
  const format = media.format.toLowerCase();
  return format.includes(".mp4") && !format.includes("audio");
}

function isVideoOnlyMedia(media: YtUltraMedia): boolean {
  const format = media.format.toLowerCase();
  return !format.includes(".weba") && !format.includes(".m4a") && !format.includes("audio");
}

function normalizeMedia(value: unknown): YtUltraMedia | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<YtUltraMedia>;
  if (typeof candidate.url !== "string" || !/^https?:\/\//i.test(candidate.url)) return null;
  if (typeof candidate.format !== "string" || !candidate.format.trim()) return null;
  return {
    url: candidate.url,
    format: candidate.format,
    fileSize: typeof candidate.fileSize === "number" ? candidate.fileSize : undefined,
    sizeStr: typeof candidate.sizeStr === "string" || candidate.sizeStr === null ? candidate.sizeStr : undefined,
  };
}

function formatDuration(value: unknown): string {
  const totalSeconds = Math.max(0, Math.round(Number(value) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function getYtUltraVideo(url: string): Promise<YtUltraVideo> {
  const response = await fetch(YT_ULTRA_DOWNLOAD_URL, {
    method: "POST",
    headers: {
      accept: "*/*",
      "content-type": "application/json",
      origin: "https://www.ytultra.com",
      referer: "https://www.ytultra.com/",
      "user-agent": "Mozilla/5.0 (Signal Desk downloader)",
    },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(90_000),
  });

  const payload = await response.json().catch(() => null) as YtUltraResponse | null;
  if (!response.ok) throw new Error(`YT Ultra request failed (${response.status}).`);
  if (payload?.code !== "0000" || !payload.data) {
    const message = typeof payload?.msg === "string" ? payload.msg : "YT Ultra could not resolve this YouTube URL.";
    throw new Error(message);
  }

  const medias = Array.isArray(payload.data.medias)
    ? payload.data.medias.map(normalizeMedia).filter((media): media is YtUltraMedia => Boolean(media))
    : [];
  if (!medias.length) throw new Error("YT Ultra returned no downloadable media URLs.");

  return {
    title: typeof payload.data.title === "string" && payload.data.title.trim()
      ? payload.data.title.trim()
      : "Downloaded YouTube video",
    duration: formatDuration(payload.data.duration),
    medias,
  };
}

export function chooseYtUltraMedia(video: YtUltraVideo, requestedQuality = "best"): YtUltraMedia {
  // MP4 entries are progressive files in this response and are the safe choice
  // for the app's live player. The WebM 2K/4K entries are video-only.
  const playable = video.medias.filter(isMp4Video);
  const candidates = playable.length ? playable : video.medias.filter(isVideoOnlyMedia);
  if (!candidates.length) throw new Error("YT Ultra returned no playable video URL.");

  const requestedHeight = requestedQuality === "best" ? Number.POSITIVE_INFINITY : Number.parseInt(requestedQuality, 10);
  const underLimit = candidates.filter((media) => qualityHeight(media.format) <= requestedHeight);
  const pool = underLimit.length ? underLimit : candidates;
  return [...pool].sort((left, right) => qualityHeight(right.format) - qualityHeight(left.format))[0];
}

export function ytUltraQualityLabel(format: string): string {
  const height = qualityHeight(format);
  return height ? `${height}p` : "best";
}

export function ytUltraAvailableQualities(video: YtUltraVideo): string[] {
  const qualities = video.medias
    .filter(isMp4Video)
    .map((media) => qualityHeight(media.format))
    .filter((height) => height > 0)
    .sort((left, right) => right - left)
    .filter((height, index, all) => all.indexOf(height) === index)
    .map((height) => `${height}p`);
  return ["best", ...qualities];
}