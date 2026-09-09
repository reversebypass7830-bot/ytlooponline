const YT_DOWNLOAD_PROXY_URL = "https://yt-download-proxy-cqkedn65a-dev-e6b8.vercel.app/api/download";

export type YtDownloadProxyMedia = {
  url: string;
  quality: string;
  ext: string;
  itag: string;
  fileSize?: number;
};

export type YtDownloadProxyVideo = {
  title: string;
  duration: string;
  video: YtDownloadProxyMedia[];
};

type YtDownloadProxyResponse = {
  ok?: unknown;
  error?: unknown;
  title?: unknown;
  duration?: unknown;
  video?: unknown;
};

function qualityHeight(quality: string): number {
  const normalized = quality.toLowerCase();
  if (normalized.includes("4k")) return 2160;
  if (normalized.includes("2k")) return 1440;
  const numeric = normalized.match(/(\d{3,4})p?/i)?.[1];
  return numeric ? Number(numeric) : 0;
}

function qualityLabel(quality: string): string {
  const height = qualityHeight(quality);
  return height ? `${height}p` : quality;
}

function parseItag(url: string): string | undefined {
  try {
    return new URL(url).searchParams.get("itag") || undefined;
  } catch {
    return undefined;
  }
}

function normalizeMedia(value: unknown): YtDownloadProxyMedia | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as {
    url?: unknown;
    quality?: unknown;
    ext?: unknown;
    itag?: unknown;
    fileSize?: unknown;
  };
  if (typeof candidate.url !== "string" || !/^https?:\/\//i.test(candidate.url)) return null;
  if (typeof candidate.quality !== "string" || !candidate.quality.trim()) return null;
  if (typeof candidate.ext !== "string" || !/^(mp4|webm)$/i.test(candidate.ext.trim())) return null;
  const itag = typeof candidate.itag === "string" || typeof candidate.itag === "number"
    ? String(candidate.itag)
    : parseItag(candidate.url);
  if (!itag) return null;
  return {
    url: candidate.url,
    quality: qualityLabel(candidate.quality),
    ext: candidate.ext.toLowerCase(),
    itag,
    fileSize: typeof candidate.fileSize === "number" ? candidate.fileSize : undefined,
  };
}

function formatDuration(value: unknown, fallbackUrl?: string): string {
  let totalSeconds = Number(value);
  if (!Number.isFinite(totalSeconds) && fallbackUrl) {
    try {
      totalSeconds = Number(new URL(fallbackUrl).searchParams.get("dur"));
    } catch {
      totalSeconds = 0;
    }
  }
  totalSeconds = Math.max(0, Math.round(totalSeconds || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function getYtDownloadProxyVideo(url: string): Promise<YtDownloadProxyVideo> {
  const endpoint = new URL(YT_DOWNLOAD_PROXY_URL);
  endpoint.searchParams.set("url", url);
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 (Signal Desk downloader)",
    },
    signal: AbortSignal.timeout(90_000),
  });
  const payload = await response.json().catch(() => null) as YtDownloadProxyResponse | null;
  if (!response.ok || payload?.ok !== true) {
    const message = typeof payload?.error === "string" ? payload.error : `YT download proxy request failed (${response.status}).`;
    throw new Error(message);
  }

  const medias = Array.isArray(payload.video)
    ? payload.video.map(normalizeMedia).filter((media): media is YtDownloadProxyMedia => Boolean(media))
    : [];
  if (!medias.length) throw new Error("YT download proxy returned no downloadable video formats.");

  const firstMedia = medias[0];
  return {
    title: typeof payload.title === "string" && payload.title.trim() ? payload.title.trim() : "Downloaded YouTube video",
    duration: formatDuration(payload.duration, firstMedia.url),
    video: medias,
  };
}

export function chooseYtDownloadProxyMedia(video: YtDownloadProxyVideo, requestedQuality = "best"): YtDownloadProxyMedia {
  return ytDownloadProxyMediaCandidates(video, requestedQuality)[0];
}

export function ytDownloadProxyMediaCandidates(video: YtDownloadProxyVideo, requestedQuality = "best"): YtDownloadProxyMedia[] {
  const requestedHeight = requestedQuality === "best" ? Number.POSITIVE_INFINITY : Number.parseInt(requestedQuality, 10);
  const underLimit = video.video.filter((media) => qualityHeight(media.quality) <= requestedHeight);
  const pool = underLimit.length ? underLimit : video.video;
  return [...pool].sort((left, right) => qualityHeight(right.quality) - qualityHeight(left.quality));
}

export function ytDownloadProxyQualityLabel(media: YtDownloadProxyMedia): string {
  return qualityLabel(media.quality);
}

export function ytDownloadProxyAvailableQualities(video: YtDownloadProxyVideo): string[] {
  const qualities = video.video
    .map((media) => qualityHeight(media.quality))
    .filter((height) => height > 0)
    .sort((left, right) => right - left)
    .filter((height, index, all) => all.indexOf(height) === index)
    .map((height) => `${height}p`);
  return ["best", ...qualities];
}

export async function streamYtDownloadProxyMedia(
  youtubeUrl: string,
  media: YtDownloadProxyMedia,
): Promise<Response> {
  const endpoint = new URL(YT_DOWNLOAD_PROXY_URL);
  endpoint.searchParams.set("url", youtubeUrl);
  endpoint.searchParams.set("stream", "1");
  endpoint.searchParams.set("itag", media.itag);
  const response = await fetch(endpoint, {
    headers: {
      accept: "video/mp4,video/webm,application/octet-stream",
      "user-agent": "Mozilla/5.0 (Signal Desk downloader)",
    },
    signal: AbortSignal.timeout(60 * 60 * 1000),
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message.trim() || `YT download proxy stream failed (${response.status}).`);
  }
  const contentLength = Number(response.headers.get("content-length") || media.fileSize || 0);
  if (contentLength > 1.5 * 1024 * 1024 * 1024) throw new Error("The YouTube video is larger than 1.5 GB.");
  const contentType = response.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("video/") && !contentType.includes("application/octet-stream")) {
    throw new Error("YT download proxy did not return a video file.");
  }
  return response;
}