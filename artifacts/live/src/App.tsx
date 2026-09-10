import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type SyntheticEvent, type WheelEvent as ReactWheelEvent } from "react";
import { Link, Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import {
  Activity as ActivityIcon, ArrowRight, BookOpen, Check, CircleHelp, Clipboard,
  Download, FileVideo, FolderOpen, Gauge, Instagram, LayoutDashboard,
  Image, Layers, Link2, Menu, MessageCircle, MonitorPlay, Pencil, Play, Plus, Radio, Scissors, Search, Send, Settings,
  ShieldCheck, Sparkles, Square, Trash2, Type, Upload, Video, Wand2, X, Youtube,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { GatewayPage, LandingPage, PricingPage } from "@/pages/public";
import { extractYoutubeChannelLinks, getStreamStatus, startStream, stopStream, trimMediaFile, updateStream } from "@workspace/api-client-react";
import logoImage from "@assets/image_1788788255512.png";

type LiveStatus = "live" | "scheduled" | "stopped";
type VideoStatus = "published" | "draft" | "archived";
type DownloadQuality = "best" | "1080p" | "720p" | "480p" | "360p";
type AspectRatio = "shorts" | "full" | "square";
type StreamQuality = "4k" | "1080p";
type FacePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
type EditorLayer = "main" | "webcam";
type AnimationPreset = "none" | "subscribe" | "like" | "follow";
type EditorTransform = { x: number; y: number; scale: number };
type EditorColorAdjustments = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
};
type LiveChannel = {
  id: string; title: string; platform: string; status: LiveStatus; groupId: string;
  streamUrl: string; streamKey: string; viewers: number; startedAt: string | null;
  thumbnailColor: string; createdAt: string; aspectRatio?: AspectRatio; playbackSpeed?: number; faceGroupId?: string;
  facePosition?: FacePosition; faceSize?: number; durationHours?: number; autoRestart?: boolean; streamQuality?: StreamQuality;
  playlistVideoIds?: string[];
};
type VideoItem = {
  id: string; title: string; duration: string; status: VideoStatus; groupId: string;
  sourceUrl: string; serverSource?: string; thumbnailColor: string; views: number; createdAt: string;
  licenseId?: string; licenseName?: string; folderName?: string; quality?: string;
};
type VideoGroup = { id: string; name: string; description: string; videoIds: string[]; createdAt: string; parentId?: string };
type EditorAsset = { id: string; fileId: string; title: string; playbackUrl: string; sourcePath: string; kind: "logo"; createdAt: string };
type Activity = { id: string; type: string; message: string; time: string };
type DataState = { channels: LiveChannel[]; videos: VideoItem[]; groups: VideoGroup[]; editorAssets: EditorAsset[]; activities: Activity[] };
type LicenseSession = { licenseId: string; key: string; name: string; expiresAt: string; active: boolean; clientId?: string };
type VidKrakenTokenStatus = { key: string; status: "ready" | "cooldown"; cooldownUntil: string | null };
const accessSocialLinks = [
  { label: "Instagram", detail: "Updates & behind the scenes", href: "https://www.instagram.com/", icon: Instagram },
  { label: "Telegram", detail: "Channel announcements", href: "https://t.me/", icon: Send },
  { label: "WhatsApp", detail: "Direct support line", href: "https://wa.me/", icon: MessageCircle },
  { label: "YouTube", detail: "Watch the live signal", href: "https://www.youtube.com/", icon: Youtube },
];
type MediaFileRecord = {
  fileId: string; filename: string; sourcePath: string; playbackUrl: string; title: string; duration: string;
  licenseId: string; licenseName: string; folderName: string; quality: string; createdAt: string; sizeBytes: number;
};
type IncludedFolderRecord = { path: string; createdAt: string };
type IncludedFoldersResponse = { root: string; folders: IncludedFolderRecord[]; files: MediaFileRecord[] };
type YoutubeDownloadTask = {
  id: string;
  total: number;
  completed: number;
  failed: number;
  done: boolean;
  errors: string[];
};
type StartYoutubeDownloadsInput = {
  entries: string[];
  quality: DownloadQuality;
  groupId: string;
  licenseId: string;
  licenseName: string;
  folderName: string;
};

const queryClient = new QueryClient();
const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const isLicenseActive = (license: LicenseSession | null) => Boolean(license && license.active && new Date(license.expiresAt).getTime() > Date.now());
const getClientId = () => {
  const existing = localStorage.getItem("signal-desk-client-id");
  if (existing) return existing;
  const next = `client-${crypto.randomUUID()}`;
  localStorage.setItem("signal-desk-client-id", next);
  return next;
};
async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    const error = new Error(payload.error || "The request could not be completed.") as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return payload;
}
type YoutubeDownloadResult = {
  fileId: string;
  title: string;
  duration: string;
  quality: string;
  sourcePath: string;
  playbackUrl: string;
};
type YoutubeDownloadJobStatus = {
  jobId: string;
  status: "queued" | "running" | "completed" | "failed";
  result?: YoutubeDownloadResult;
  error?: string;
};
async function downloadYoutubeVideoAsync(input: { url: string; quality: DownloadQuality; licenseId?: string; licenseName?: string; folderName?: string; ownerPassword?: string }): Promise<YoutubeDownloadResult> {
  const { ownerPassword, ...payload } = input;
  const queueJob = () => apiJson<{ jobId: string }>("/api/media/youtube-download/jobs", {
    method: "POST",
    headers: ownerPassword ? { "X-Owner-Password": ownerPassword } : undefined,
    body: JSON.stringify(payload),
  });
  let queued = await queueJob();
  let recoveredMissingJob = false;
  let waitMs = 0;
  while (true) {
    if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
    let job: YoutubeDownloadJobStatus;
    try {
      job = await apiJson<YoutubeDownloadJobStatus>(`/api/media/youtube-download/jobs/${encodeURIComponent(queued.jobId)}`);
    } catch (error) {
      const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined;
      if (status !== 404 || recoveredMissingJob) throw error;
      // Jobs are kept in API memory. If the API restarted while this tab was
      // polling, start the download again instead of surfacing a stale job ID.
      recoveredMissingJob = true;
      queued = await queueJob();
      waitMs = 0;
      continue;
    }
    if (job.status === "completed" && job.result) return job.result;
    if (job.status === "failed") throw new Error(job.error || "The YouTube video could not be downloaded.");
    waitMs = 2000;
  }
}
const fmtTime = (date: string | null) => {
  if (!date) return "—";
  const mins = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
};
const fmtNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);
const colors = ["#2c8b88", "#da814b", "#607a98", "#788d52", "#9a6591", "#3f6d66"];
// These demo files are intentionally not bundled in the public repository.
// Users can add a video through the upload or YouTube download flow instead.
const gtv5FaceVideoUrl = "";
const platformFromUrl = (url: string) => {
  const value = url.toLowerCase();
  if (value.includes("youtube")) return "YouTube";
  if (value.includes("twitch")) return "Twitch";
  if (value.includes("vimeo")) return "Vimeo";
  return "Custom RTMP";
};

const seed: DataState = {
  channels: [],
  videos: [],
  groups: [],
  editorAssets: [],
  activities: [],
};

const youtubeAnimationFolderId = "folder-youtube-animations";
const includedAnimationFolderId = "folder-youtube-included";
const myAnimationFolderId = "folder-youtube-my";
const includedMediaLicenseId = "__included__";
const youtubeAnimationRootName = "My YouTube Animation";
const includedFolderRoot = `${youtubeAnimationRootName}/Included Animations`;
const youtubeAnimationRootAliases = new Set(["youtube animations", "my youtube animation", "my youtube animations"]);
const defaultYoutubeFolders = [
  { id: youtubeAnimationFolderId, name: youtubeAnimationRootName, description: "Reusable YouTube animation clips shared through the workspace.", parentId: undefined },
  { id: includedAnimationFolderId, name: "Included Animations", description: "Animations added by the admin and shared with every license.", parentId: youtubeAnimationFolderId },
  { id: myAnimationFolderId, name: "My Animations", description: "Your private downloaded animations for this license only.", parentId: youtubeAnimationFolderId },
] as const;
const legacyYoutubeFolderIds = new Set(["folder-youtube-starting-ending", "folder-youtube-subscribe", "folder-youtube-like", "folder-youtube-follow"]);
const builtInYoutubeFolderIds = new Set([youtubeAnimationFolderId, includedAnimationFolderId, myAnimationFolderId]);

function isIncludedVideo(video: VideoItem | undefined): boolean {
  return video?.licenseId === includedMediaLicenseId;
}

function isBuiltInYoutubeFolder(group: VideoGroup | undefined): boolean {
  return Boolean(group && (
    builtInYoutubeFolderIds.has(group.id)
    || youtubeAnimationRootAliases.has(group.name.trim().toLowerCase())
    || ["included animations", "my animations"].includes(group.name.trim().toLowerCase())
  ));
}

function isYoutubeAnimationRoot(groupId: string | undefined, groups: VideoGroup[]): boolean {
  const group = groups.find((item) => item.id === groupId);
  return Boolean(group && (
    group.id === youtubeAnimationFolderId
    || (!group.parentId && youtubeAnimationRootAliases.has(group.name.trim().toLowerCase()))
  ));
}

function isVideoDestinationFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  return Boolean(groupId && !isYoutubeAnimationRoot(groupId, groups) && !isIncludedFolder(groupId, groups));
}

function descendantGroupIds(groupId: string, groups: VideoGroup[]): Set<string> {
  const ids = new Set<string>([groupId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const group of groups) {
      if (group.parentId && ids.has(group.parentId) && !ids.has(group.id)) {
        ids.add(group.id);
        changed = true;
      }
    }
  }
  return ids;
}

function isVideoInFolderScope(video: VideoItem, groupId: string, groups: VideoGroup[]): boolean {
  return descendantGroupIds(groupId, groups).has(video.groupId);
}

function isIncludedFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  const seen = new Set<string>();
  let current = groups.find((group) => group.id === groupId);
  while (current && !seen.has(current.id)) {
    if (current.id === includedAnimationFolderId || current.name.trim().toLowerCase() === "included animations") return true;
    seen.add(current.id);
    current = current.parentId ? groups.find((group) => group.id === current?.parentId) : undefined;
  }
  return false;
}

function folderPathForGroup(groupId: string | undefined, groups: VideoGroup[]): string {
  const path: string[] = [];
  const seen = new Set<string>();
  let current = groups.find((group) => group.id === groupId);
  while (current && !seen.has(current.id)) {
    path.unshift(current.name.trim());
    seen.add(current.id);
    current = current.parentId ? groups.find((group) => group.id === current?.parentId) : undefined;
  }
  return path.join("/");
}

function normalizeYoutubeMediaFolder(folderName: string): string {
  const segments = folderName.split("/").map((segment) => segment.trim()).filter(Boolean);
  if (!segments.length) return "";
  if (youtubeAnimationRootAliases.has(segments[0].toLowerCase())) {
    segments[0] = youtubeAnimationRootName;
  } else if (segments[0].toLowerCase() === "included animations" || segments[0].toLowerCase() === "my animations") {
    return [youtubeAnimationRootName, ...segments].join("/");
  }
  return segments.join("/");
}

function groupDepth(groupId: string, groups: VideoGroup[]): number {
  let depth = 0;
  const seen = new Set<string>();
  let current = groups.find((group) => group.id === groupId);
  while (current?.parentId && !seen.has(current.id)) {
    depth += 1;
    seen.add(current.id);
    current = groups.find((group) => group.id === current?.parentId);
  }
  return depth;
}

function scopedMediaPlaybackUrl(url: string, mediaLicenseId: string | undefined, currentLicenseId: string): string {
  if (!url || !url.includes("/api/media/files/") || mediaLicenseId === includedMediaLicenseId || !currentLicenseId) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}licenseId=${encodeURIComponent(currentLicenseId)}`;
}

function ensureDefaultYoutubeFolders(groups: VideoGroup[]): VideoGroup[] {
  const legacyGroups = groups.filter((group) => legacyYoutubeFolderIds.has(group.id));
  let next = groups.filter((group) => !legacyYoutubeFolderIds.has(group.id));
  const legacyVideoIds = legacyGroups.flatMap((group) => group.videoIds);
  const existingRoot = next.find((group) =>
    group.id === youtubeAnimationFolderId
    || (
      youtubeAnimationRootAliases.has(group.name.trim().toLowerCase())
      && !group.parentId
    ),
  );
  const rootId = existingRoot?.id || youtubeAnimationFolderId;
  if (existingRoot) {
    next = next.map((group) => group.id === existingRoot.id
      ? { ...group, name: youtubeAnimationRootName, description: defaultYoutubeFolders[0].description, parentId: undefined }
      : group);
  } else {
    next.push({ ...defaultYoutubeFolders[0], videoIds: [], createdAt: now() });
  }
  next = next.map((group) => group.parentId === youtubeAnimationFolderId && rootId !== youtubeAnimationFolderId
    ? { ...group, parentId: rootId }
    : group);
  for (const folder of defaultYoutubeFolders.slice(1)) {
    const existing = next.find((group) =>
      group.id === folder.id
      || (
        group.name.trim().toLowerCase() === folder.name.toLowerCase()
        && (group.parentId || undefined) === rootId
      ),
    );
    if (existing) {
      next = next.map((group) => group.id === existing.id
        ? { ...group, name: folder.name, description: folder.description, parentId: rootId }
        : group);
    } else {
      next.push({ ...folder, parentId: rootId, videoIds: [], createdAt: now() });
    }
  }
  const myFolder = next.find((group) => group.id === myAnimationFolderId || (
    group.name.trim().toLowerCase() === "my animations" && group.parentId === rootId
  ));
  return myFolder && legacyVideoIds.length
    ? next.map((group) => group.id === myAnimationFolderId
      ? { ...group, videoIds: Array.from(new Set([...group.videoIds, ...legacyVideoIds])) }
      : group)
    : next;
}

function ensureBundledFaceVideo(value: DataState): DataState {
  const normalizedValue = {
    ...value,
    videos: value.videos,
  };
  const existingGroup = normalizedValue.groups.find((group) => ["gtv5face", "gtv 5 face"].includes(group.name.trim().toLowerCase()));
  const groupId = existingGroup?.id || "gtv5face";
  const existingVideo = normalizedValue.videos.find((video) => video.id === "vid-gtv5-face" || video.title.toLowerCase() === "whatsapp video 2026-09-04 at 11.30.43 pm");
  const video = existingVideo || {
    id: "vid-gtv5-face",
    title: "WhatsApp Video 2026-09-04 at 11.30.43 PM",
    duration: "00:00",
    status: "published" as VideoStatus,
    groupId,
    sourceUrl: gtv5FaceVideoUrl,
    serverSource: "__asset:gtv5face",
    thumbnailColor: "#9a6591",
    views: 0,
    createdAt: now(),
  };
  const groups = existingGroup
    ? normalizedValue.groups.map((group) => group.id === groupId ? { ...group, videoIds: group.videoIds.includes(video.id) ? group.videoIds : [...group.videoIds, video.id] } : group)
    : [...normalizedValue.groups, { id: groupId, name: "GTV 5 face", description: "Face recording overlay video.", videoIds: [video.id], createdAt: now() }];
  const videos = existingVideo
    ? normalizedValue.videos.map((item) => item.id === video.id ? { ...item, groupId, sourceUrl: item.sourceUrl || gtv5FaceVideoUrl, serverSource: item.serverSource || "__asset:gtv5face" } : item)
    : [...normalizedValue.videos, video];
  const alreadyAnnounced = normalizedValue.activities.some((activity) => activity.message.toLowerCase().includes("gtv 5 face video"));
  return { ...normalizedValue, groups, videos, activities: alreadyAnnounced ? normalizedValue.activities : [{ id: uid("act"), type: "video", message: "GTV 5 face video is ready", time: "Just now" }, ...normalizedValue.activities].slice(0, 8) };
}

function removeBundledGtaVideo(value: DataState): DataState {
  const bundledIds = new Set(
    value.videos
      .filter((video) => video.id === "vid-gta-local" || video.title.trim().toLowerCase() === "local gta video")
      .filter((video) => !video.sourceUrl && video.serverSource === "__asset:gta")
      .map((video) => video.id),
  );
  if (!bundledIds.size) return value;
  return {
    ...value,
    videos: value.videos.filter((video) => !bundledIds.has(video.id)),
    groups: value.groups.map((group) => ({ ...group, videoIds: group.videoIds.filter((id) => !bundledIds.has(id)) })),
    activities: value.activities.filter((activity) => !activity.message.toLowerCase().includes("gta category is ready with the local video")),
  };
}

function rebuildGroupMembership(groups: VideoGroup[], videos: VideoItem[]): VideoGroup[] {
  return groups.map((group) => {
    const validVideoIds = new Set(videos.filter((video) => video.groupId === group.id).map((video) => video.id));
    const orderedIds = group.videoIds.filter((id) => validVideoIds.has(id));
    for (const video of videos) {
      if (video.groupId === group.id && !orderedIds.includes(video.id)) orderedIds.push(video.id);
    }
    return { ...group, videoIds: orderedIds };
  });
}

function normalizeWorkspace(value: unknown): DataState {
  if (!value || typeof value !== "object") return { ...seed, groups: ensureDefaultYoutubeFolders([]) };
  const candidate = value as Partial<DataState>;
  const groups: VideoGroup[] = (Array.isArray(candidate.groups) ? candidate.groups : [])
    .filter((group): group is VideoGroup => Boolean(group && typeof group === "object"))
    .map((group, index) => ({
      id: typeof group.id === "string" && group.id ? group.id : `group-${index + 1}`,
      name: typeof group.name === "string" && group.name.trim() ? group.name : "Untitled folder",
      description: typeof group.description === "string" ? group.description : "",
      videoIds: Array.isArray(group.videoIds) ? group.videoIds.filter((id): id is string => typeof id === "string") : [],
      createdAt: typeof group.createdAt === "string" ? group.createdAt : now(),
      parentId: typeof group.parentId === "string" && group.parentId ? group.parentId : undefined,
    }));
  const activities: Activity[] = (Array.isArray(candidate.activities) ? candidate.activities : [])
    .filter((activity): activity is Activity => Boolean(activity && typeof activity === "object"))
    .map((activity, index) => ({
      id: typeof activity.id === "string" && activity.id ? activity.id : `activity-${index + 1}`,
      type: typeof activity.type === "string" ? activity.type : "edit",
      message: typeof activity.message === "string" ? activity.message : "Workspace updated",
      time: typeof activity.time === "string" ? activity.time : "Recently",
    }));
  const videos: VideoItem[] = (Array.isArray(candidate.videos) ? candidate.videos : [])
    .filter((video): video is VideoItem => Boolean(video && typeof video === "object" && typeof (video as VideoItem).id === "string"))
    .map((video) => ({
      ...video,
      title: typeof video.title === "string" ? video.title : "Untitled video",
      groupId: typeof video.groupId === "string" ? video.groupId : "",
      sourceUrl: typeof video.sourceUrl === "string" ? video.sourceUrl : "",
      duration: typeof video.duration === "string" ? video.duration : "00:00",
      status: video.status === "draft" || video.status === "archived" ? video.status : "published",
      views: typeof video.views === "number" ? video.views : 0,
      createdAt: typeof video.createdAt === "string" ? video.createdAt : now(),
    }));
  const editorAssets: EditorAsset[] = (Array.isArray(candidate.editorAssets) ? candidate.editorAssets : [])
    .filter((asset): asset is EditorAsset => Boolean(asset && typeof asset === "object" && typeof (asset as EditorAsset).id === "string"))
    .map((asset) => ({
      id: asset.id,
      fileId: typeof asset.fileId === "string" ? asset.fileId : "",
      title: typeof asset.title === "string" ? asset.title : "Logo",
      playbackUrl: typeof asset.playbackUrl === "string" ? asset.playbackUrl : "",
      sourcePath: typeof asset.sourcePath === "string" ? asset.sourcePath : "",
      kind: "logo",
      createdAt: typeof asset.createdAt === "string" ? asset.createdAt : now(),
    }));
  const repairedGroups = rebuildGroupMembership(groups, videos);
  const legacyGroups = repairedGroups.filter((group) =>
    group.videoIds.length > 0
    || (
      !["gta", "default videos"].includes(group.name.trim().toLowerCase())
      && group.description.trim().toLowerCase() !== "default folder for this license workspace."
    ),
  );
  const youtubeFolders = ensureDefaultYoutubeFolders(legacyGroups);
  const legacyIds = new Set(legacyYoutubeFolderIds);
  const migratedVideos = videos.map((video) =>
    legacyIds.has(video.groupId)
      ? { ...video, groupId: myAnimationFolderId, folderName: "My Animations" }
      : video,
  );
  return removeBundledGtaVideo({
    channels: Array.isArray(candidate.channels) ? candidate.channels : [],
    videos: migratedVideos,
    groups: rebuildGroupMembership(youtubeFolders, migratedVideos),
    editorAssets,
    activities,
  });
}

function ensureFolderPath(groups: VideoGroup[], folderName: string, createdAt: string): { groups: VideoGroup[]; group?: VideoGroup } {
  const normalizedFolderName = normalizeYoutubeMediaFolder(folderName);
  const segments = normalizedFolderName.split("/").map((segment) => segment.trim()).filter(Boolean);
  if (!segments.length) return { groups };
  let nextGroups = [...groups];
  let parentId: string | undefined;
  let current: VideoGroup | undefined;
  for (const segment of segments) {
    const normalized = segment.toLowerCase();
    current = nextGroups.find((group) =>
      group.name.trim().toLowerCase() === normalized
      && (group.parentId || undefined) === parentId,
    );
    if (!current) {
      const id = `media-${normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || uid("folder")}-${uid("folder").slice(-4)}`;
      current = { id, name: segment, description: "Recovered from server media.", videoIds: [], createdAt, parentId };
      nextGroups = [...nextGroups, current];
    }
    parentId = current.id;
  }
  return { groups: nextGroups, group: current };
}

function reconcileMediaFolders(value: DataState, files: MediaFileRecord[]): DataState {
  let groups = [...value.groups];
  const records = new Map(files.map((file) => [file.fileId, file]));
  const videos = value.videos.map((video) => {
    const fileId = getMediaFileId(video);
    const record = fileId ? records.get(fileId) : undefined;
    const folderName = video.folderName?.trim() || record?.folderName?.trim() || "";
    const normalizedFolderName = normalizeYoutubeMediaFolder(folderName);
    const result = ensureFolderPath(groups, folderName, record?.createdAt || video.createdAt);
    groups = result.groups;
    const group = result.group;
    return group
      ? { ...video, groupId: group.id, folderName: normalizedFolderName || group.name }
      : video;
  });
  return normalizeWorkspace({ ...value, groups, videos });
}

function getMediaFileId(video: VideoItem | undefined): string | undefined {
  if (!video) return undefined;
  for (const source of [video.sourceUrl, video.serverSource]) {
    if (!source) continue;
    const apiMatch = source.match(/\/api\/media\/files\/([^/?#]+)/i);
    if (apiMatch?.[1]) return apiMatch[1];
    const fileMatch = source.match(/(?:^|[/\\])([a-f0-9-]{8,})\.[^/\\/?#]+$/i);
    if (fileMatch?.[1]) return fileMatch[1];
  }
  return undefined;
}

function parseDurationSeconds(value: string): number {
  const normalized = value.trim();
  if (!normalized) return 0;
  const parts = normalized.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part) || part < 0)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function formatTimecode(value: number): string {
  const totalMilliseconds = Math.max(0, Math.round(value * 1000));
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;
  const base = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return milliseconds ? `${base}.${String(milliseconds).padStart(3, "0")}` : base;
}

function useLicense() {
  const [clientId] = useState(getClientId);
  const [license, setLicense] = useState<LicenseSession | null>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("signal-desk-license") || "null") as LicenseSession | null;
      return stored ? { ...stored, clientId: stored.clientId || getClientId() } : null;
    } catch { return null; }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const activate = async (key: string) => {
    setBusy(true); setError("");
    try {
      const result = await apiJson<LicenseSession>("/api/licenses/validate", { method: "POST", body: JSON.stringify({ key: key.trim(), clientId }) });
      const next = { ...result, clientId };
      setLicense(next); localStorage.setItem("signal-desk-license", JSON.stringify(next));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This license could not be activated.");
      throw reason;
    } finally { setBusy(false); }
  };
  const renew = async () => {
    if (!license) return;
    setBusy(true); setError("");
    try {
      const result = await apiJson<LicenseSession>("/api/licenses/renew", { method: "POST", body: JSON.stringify({ key: license.key, clientId, days: 30 }) });
      const next = { ...result, clientId };
      setLicense(next); localStorage.setItem("signal-desk-license", JSON.stringify(next));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This license could not be renewed.");
    } finally { setBusy(false); }
  };
  const clear = () => { setLicense(null); localStorage.removeItem("signal-desk-license"); };
  return { clientId, license, busy, error, activate, renew, clear, setError };
}

function useWorkspace(license: LicenseSession | null, clearLicense: () => void) {
  const [data, setData] = useState<DataState>(seed);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [youtubeDownloads, setYoutubeDownloads] = useState<YoutubeDownloadTask[]>([]);
  const user = license?.name || "";
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    if (!license || !isLicenseActive(license)) {
      setData(seed); setReady(true);
      return () => { cancelled = true; };
    }
    void Promise.all([
      apiJson<{ data: DataState | null }>("/api/licenses/workspace/get", {
        method: "POST",
        body: JSON.stringify({ key: license.key, clientId: license.clientId }),
      }),
      apiJson<{ files: MediaFileRecord[] }>(`/api/media/files?licenseId=${encodeURIComponent(license.licenseId)}`).catch(() => ({ files: [] as MediaFileRecord[] })),
    ]).then(([workspaceResult, mediaResult]) => {
      if (cancelled) return;
       const base = reconcileMediaFolders(
          normalizeWorkspace(workspaceResult.data),
         mediaResult.files,
       );
       const scopedBase = {
         ...base,
         videos: base.videos.map((video) => ({
           ...video,
           sourceUrl: scopedMediaPlaybackUrl(video.sourceUrl, video.licenseId, license.licenseId),
         })),
         editorAssets: base.editorAssets.map((asset) => ({
           ...asset,
           playbackUrl: scopedMediaPlaybackUrl(asset.playbackUrl, license.licenseId, license.licenseId),
         })),
       };
      const availableMediaIds = new Set(mediaResult.files.map((file) => file.fileId));
       const existingVideos = scopedBase.videos.filter((video) => {
        const mediaFileId = getMediaFileId(video);
        return !mediaFileId || availableMediaIds.has(mediaFileId);
      });
        const workspaceBase = existingVideos.length === scopedBase.videos.length
          ? scopedBase
          : reconcileMediaFolders(normalizeWorkspace({ ...scopedBase, videos: existingVideos }), mediaResult.files);
      const knownIds = new Set(workspaceBase.videos.map((video) => getMediaFileId(video)));
      const extraFiles = mediaResult.files.filter((file) => !knownIds.has(file.fileId));
      if (!extraFiles.length) {
        setData(workspaceBase);
        setReady(true);
        return;
      }
      let groups = [...workspaceBase.groups];
      const extraVideos = extraFiles.map((file, index) => {
        const folderName = file.folderName.trim();
        const folderResult = ensureFolderPath(groups, folderName, file.createdAt);
        groups = folderResult.groups;
        const group = folderResult.group;
        const video: VideoItem = {
          id: `media-${file.fileId}`,
          title: file.title || file.filename,
          duration: file.duration || "00:00",
          status: "published",
          groupId: group?.id || "",
          sourceUrl: scopedMediaPlaybackUrl(file.playbackUrl, file.licenseId, license.licenseId),
          serverSource: file.sourcePath,
          thumbnailColor: colors[index % colors.length],
          views: 0,
          createdAt: file.createdAt,
          licenseId: file.licenseId,
          licenseName: file.licenseName,
          folderName: file.folderName,
          quality: file.quality,
        };
        if (group && !group.videoIds.includes(video.id)) {
          groups = groups.map((item) => item.id === group?.id ? { ...item, videoIds: [...item.videoIds, video.id] } : item);
        }
        return video;
      });
      setData(normalizeWorkspace({ ...workspaceBase, groups, videos: [...workspaceBase.videos, ...extraVideos] }));
      setReady(true);
    }).catch((reason) => {
      if (!cancelled) {
        setData(normalizeWorkspace(null));
        setToast(reason instanceof Error ? reason.message : "Could not load the workspace.");
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [license?.licenseId, license?.key, license?.clientId]);
  useEffect(() => {
    if (!ready || !license || !isLicenseActive(license)) return;
    const timer = window.setTimeout(() => {
      void apiJson("/api/licenses/workspace", {
        method: "PUT",
        body: JSON.stringify({ key: license.key, clientId: license.clientId, data }),
      }).catch((reason) => setToast(reason instanceof Error ? reason.message : "Could not save the workspace."));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [data, ready, license?.licenseId, license?.key, license?.clientId]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 2600); return () => clearTimeout(timer); }, [toast]);
  const addActivity = (message: string, type = "edit") => ({ id:uid("act"), type, message, time:"Just now" });
  const update = (next: Partial<DataState>, activity?: { message: string; type?: string }) => {
    setData((old) => ({ ...old, ...next, activities: activity ? [addActivity(activity.message, activity.type), ...old.activities].slice(0, 8) : old.activities }));
    if (activity) setToast(activity.message);
  };
  const dismissYoutubeDownload = (taskId: string) => {
    setYoutubeDownloads((current) => current.filter((task) => task.id !== taskId));
  };
  const startYoutubeDownloads = (input: StartYoutubeDownloadsInput) => {
    const taskId = uid("youtube-download");
    setYoutubeDownloads((current) => [...current, { id: taskId, total: input.entries.length, completed: 0, failed: 0, done: false, errors: [] }]);
    void (async () => {
      const completedVideos: Array<VideoItem | undefined> = new Array(input.entries.length);
      const failures: Array<string | undefined> = new Array(input.entries.length);
      let nextIndex = 0;
      let completedCount = 0;
      let failedCount = 0;
      const downloadNext = async () => {
        while (true) {
          const index = nextIndex++;
          if (index >= input.entries.length) return;
          try {
            const result = await downloadYoutubeVideoAsync({
              url: input.entries[index],
              quality: input.quality,
              licenseId: input.licenseId,
              licenseName: input.licenseName,
              folderName: input.folderName,
            });
            completedVideos[index] = {
              id: uid("vid"),
              title: result.title,
              duration: result.duration,
              status: "published",
              groupId: input.groupId,
              sourceUrl: scopedMediaPlaybackUrl(result.playbackUrl, input.licenseId, input.licenseId),
              serverSource: result.sourcePath,
              thumbnailColor: colors[index % colors.length],
              views: 0,
              createdAt: now(),
              licenseId: input.licenseId,
              licenseName: input.licenseName,
              folderName: input.folderName,
              quality: result.quality,
            };
          } catch (reason) {
            failures[index] = `${index + 1}. ${reason instanceof Error ? reason.message : "Download failed."}`;
            failedCount += 1;
          } finally {
            completedCount += 1;
            setYoutubeDownloads((current) => current.map((task) => task.id === taskId
              ? { ...task, completed: completedCount, failed: failedCount }
              : task));
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(2, input.entries.length) }, () => downloadNext()));
      const videos = completedVideos.filter((video): video is VideoItem => Boolean(video));
      if (videos.length) {
        setData((old) => {
          const nextVideos = [...old.videos, ...videos];
          return {
            ...old,
            videos: nextVideos,
            groups: rebuildGroupMembership(old.groups, nextVideos),
            activities: [{ id: uid("act"), type: "video", message: `${videos.length} YouTube video${videos.length === 1 ? "" : "s"} added to the library`, time: "Just now" }, ...old.activities].slice(0, 8),
          };
        });
      }
      const failureCount = failures.filter(Boolean).length;
      setYoutubeDownloads((current) => current.map((task) => task.id === taskId ? { ...task, completed: completedCount, failed: failureCount, errors: failures.filter((failure): failure is string => Boolean(failure)), done: true } : task));
      if (failureCount) {
        setToast(`${videos.length} downloaded, ${failureCount} failed.`);
      } else {
        setToast(`${videos.length} YouTube video${videos.length === 1 ? "" : "s"} added to the library.`);
      }
      window.setTimeout(() => dismissYoutubeDownload(taskId), failureCount ? 20000 : 8000);
    })();
  };
  const logout = () => { clearLicense(); };
  return { clientId: license?.clientId || "", licenseId: license?.licenseId || "", data, user, toast, ready, update, logout, setToast, youtubeDownloads, startYoutubeDownloads, dismissYoutubeDownload };
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand" data-testid="brand">
    <div className="brand-mark"><img src={logoImage} alt="Reverse Bypass logo" /></div>
    {!compact && <div><div className="brand-name">Reverse Bypass</div><div className="brand-note">reverse access console</div></div>}
  </div>;
}

function Sidebar({ path, open, onClose, user, onLogout, data }: { path:string; open:boolean; onClose:()=>void; user:string; onLogout:()=>void; data:DataState }) {
  const nav = [
    { href:"/dashboard", label:"Overview", icon:LayoutDashboard },
    { href:"/live", label:"Live channels", icon:MonitorPlay, count:data.channels.filter(c=>c.status==="live").length || undefined },
    { href:"/videos", label:"Video library", icon:FileVideo },
    { href:"/editor", label:"Video editor", icon:Wand2 },
  ];
  return <aside className={`sidebar ${open ? "open" : ""}`} data-testid="sidebar">
    <Brand />
    <div className="nav-label">Reverse Bypass</div>
    <nav className="nav">
      {nav.map(({href,label,icon:Icon,count}) => <Link key={href} href={href} onClick={onClose} className={`nav-link ${path === href ? "active" : ""}`} data-testid={`link-${label.toLowerCase().replaceAll(" ","-")}`}><Icon size={16}/><span>{label}</span>{count !== undefined && <span className="nav-count">{count}</span>}</Link>)}
    </nav>
    <div className="nav-label" style={{marginTop:28}}>Workspace</div>
    <nav className="nav">
      <Link href="/settings" onClick={onClose} className={`nav-link ${path === "/settings" ? "active" : ""}`} data-testid="link-settings"><Settings size={16}/><span>Settings</span></Link>
      <button className="nav-link" onClick={() => { onLogout(); onClose(); }} data-testid="button-sign-out"><ShieldCheck size={16}/><span>Sign out</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="workspace-card"><strong>Private workspace</strong><p>Your private workspace is saved in your Firebase license workspace.</p></div>
      <div className="mini-user"><span className="avatar">{user.slice(0,2).toUpperCase()}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user}</span></div>
    </div>
  </aside>;
}

function Header({ title, onMenu }: { title:string; onMenu:()=>void }) {
  return <header className="topbar">
    <div className="crumb"><button className="icon-button mobile-menu" onClick={onMenu} data-testid="button-open-menu"><Menu size={18}/></button><span className="crumb-label">Reverse Bypass /</span><span className="crumb-title">{title}</span></div>
    <div className="top-actions"><div className="live-pulse"><span className="pulse"/><span>Broadcast monitor</span></div><button className="icon-button" data-testid="button-help" title="Help"><CircleHelp size={17}/></button></div>
  </header>;
}

function DownloadActivity({ downloads, onDismiss }: { downloads: YoutubeDownloadTask[]; onDismiss: (taskId: string) => void }) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  if (!downloads.length) return null;
   return <div className="background-downloads" data-testid="background-downloads" role="status" aria-live="polite">
    {downloads.map((task) => {
      const percent = task.total ? Math.round((task.completed / task.total) * 100) : 0;
      const label = task.done
        ? task.failed ? `${task.completed - task.failed} downloaded · ${task.failed} failed` : `${task.completed} download${task.completed === 1 ? "" : "s"} complete`
        : `Downloading ${task.completed}/${task.total} in background`;
      const expanded = expandedTaskId === task.id;
      const detail = task.done
        ? task.failed
          ? task.errors.length ? task.errors : ["The download failed without a detailed server message."]
          : ["All queued videos were added to the library."]
        : ["Download is still running in the background."];
      return <div className={`background-download ${task.done ? "done" : ""}`} key={task.id}>
        <div className="background-download-icon"><Download size={15}/></div>
        <button className="background-download-main" onClick={() => setExpandedTaskId(expanded ? null : task.id)} aria-expanded={expanded} aria-controls={`download-details-${task.id}`}>
          <span className="background-download-copy"><strong>{label}</strong><span>{task.done ? "Click to see download details." : "Click to see status details."}</span>{!task.done && <span className="background-download-track"><span style={{ width: `${percent}%` }}/></span>}</span>
          <span className="background-download-meta">{task.done ? <span className="background-download-chevron">{expanded ? "Hide" : "View"}</span> : <span>{percent}%</span>}</span>
        </button>
        {task.done && <button className="icon-button background-download-dismiss" onClick={() => onDismiss(task.id)} title="Dismiss download status" aria-label="Dismiss download status"><X size={15}/></button>}
        {expanded && <div className="background-download-details" id={`download-details-${task.id}`}>{detail.map((message, index) => <div key={`${task.id}-detail-${index}`} className={task.failed && index < task.errors.length ? "background-download-error" : ""}>{message}</div>)}</div>}
      </div>;
    })}
  </div>;
}

function AppShell({ children, title, workspace }: { children:ReactNode; title:string; workspace:ReturnType<typeof useWorkspace> }) {
  const [path] = useLocation();
  const [menu, setMenu] = useState(false);
  return <div className="shell">
    {menu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} data-testid="button-close-menu" />}
    <Sidebar path={path} open={menu} onClose={()=>setMenu(false)} user={workspace.user} onLogout={workspace.logout} data={workspace.data}/>
    <main className="main"><Header title={title} onMenu={()=>setMenu(true)}/><DownloadActivity downloads={workspace.youtubeDownloads} onDismiss={workspace.dismissYoutubeDownload}/>{children}</main>
    {workspace.toast && <div className="toast" data-testid="status-toast"><Check size={14} style={{verticalAlign:"-2px", marginRight:7}}/>{workspace.toast}</div>}
  </div>;
}

function LicenseGate({ license, busy, error, onActivate, onRenew }: { license:LicenseSession|null; busy:boolean; error:string; onActivate:(key:string)=>Promise<void>; onRenew:()=>Promise<void> }) {
  const [key, setKey] = useState(license?.key || "");
  useEffect(() => { setKey(license?.key || ""); }, [license?.key]);
  const expired = Boolean(license && !isLicenseActive(license));
  const submit = (event:FormEvent) => {
    event.preventDefault();
    if (key.trim()) void onActivate(key).catch(() => undefined);
  };
  return <div className="access-page">
    <header className="access-nav">
      <Link href="/" className="access-brand" data-testid="link-access-home">
        <span className="access-brand-mark"><img src={logoImage} alt="R Loop Bypass logo" /></span>
        <span>R LOOP <b>BYPASS</b></span>
      </Link>
      <div className="access-nav-status"><span /> PRIVATE ACCESS</div>
    </header>
    <main className="access-main">
      <section className="access-intro">
        <div>
          <span className="access-kicker"><i /> R LOOP BYPASS / PRIVATE ROOM</span>
          <h1>Bring your<br /><em>room on air.</em></h1>
          <p>Enter your license key to open your private workspace. Your channels, videos, and settings stay separate from every other license.</p>
          <div className="access-proof"><span><i /> ONE KEY · ONE ROOM</span><span><i /> READY WHEN YOU ARE</span></div>
        </div>
        <div className="access-social-block">
          <div className="access-social-heading"><span>Stay close to the signal</span><small>Follow, ask, and keep up.</small></div>
          <div className="access-social-grid">
            {accessSocialLinks.map(({ label, detail, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="access-social-link" data-testid={`link-access-${label.toLowerCase()}`} aria-label={`${label}: ${detail}`}>
              <span className={`access-social-icon access-social-${label.toLowerCase()}`}><Icon size={18} strokeWidth={2} /></span>
              <span className="access-social-copy"><strong>{label}</strong><small>{detail}</small></span>
              <ArrowRight size={15} className="access-social-arrow" />
            </a>)}
          </div>
        </div>
      </section>
      <section className="access-panel">
        <div className="access-panel-grid" />
        <div className="access-card">
          <div className="access-card-top"><span className="access-card-led" /> <span>PRIVATE ACCESS GATE</span><span className="access-card-code">01 / 01</span></div>
          <div className="access-card-icon"><Radio size={20} /></div>
          <p className="access-eyebrow">{expired ? "License expired" : "Enter your license"}</p>
          <h2>{expired ? "Renew your key." : "Unlock the room."}</h2>
          <p className="access-card-copy">{expired ? "Your workspace is waiting. Renew this same key for 30 more days, or enter a different active key." : "Use the license key provided by the owner to continue."}</p>
          {error && <div className="access-error" data-testid="status-license-error">{error}</div>}
          <form className="access-form" onSubmit={submit}>
            <div className="access-field"><label htmlFor="license-key">License key</label><input id="license-key" value={key} onChange={e=>setKey(e.target.value)} placeholder="SD-XXXXXXXXXXXX" autoComplete="off" data-testid="input-license-key"/></div>
            <button className="access-submit" type="submit" disabled={busy || !key.trim()} data-testid="button-activate-license"><strong>{busy ? "Checking…" : "Open workspace"}</strong><ArrowRight size={16}/></button>
          </form>
          {expired && <button className="access-renew" onClick={()=>void onRenew()} disabled={busy} data-testid="button-renew-license">{busy ? "Renewing…" : "Renew your key · 30 days"} <Check size={14}/></button>}
          {license && <div className="access-license-status"><strong>{license.name}</strong><span>Key: <span className="mono">{license.key}</span></span><span>Expired {new Date(license.expiresAt).toLocaleDateString()}</span></div>}
          <div className="access-card-foot"><ShieldCheck size={14} /><span>Workspace data stays private to this license.</span></div>
        </div>
      </section>
    </main>
    <footer className="access-footer"><span>Broadcast automation for the long signal.</span><Link href="/pricing" data-testid="link-access-pricing">View access options <ArrowRight size={13} /></Link></footer>
  </div>;
}

function IncludedAnimationsModal({ ownerPassword, onClose, folderName = includedFolderRoot, onChanged }: { ownerPassword: string; onClose: () => void; folderName?: string; onChanged?: () => void }) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeDownloading, setYoutubeDownloading] = useState(false);

  useEffect(() => {
    folderInputRef.current?.setAttribute("webkitdirectory", "");
    folderInputRef.current?.setAttribute("directory", "");
  }, []);

  const chooseFiles = (list: FileList | null) => {
    const selected = Array.from(list || [])
      .filter((file) => file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm|mkv|avi|ts)$/i.test(file.name))
      .sort((a, b) => (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name, undefined, { numeric: true, sensitivity: "base" }));
    setFiles(selected);
    setMessage("");
    setError(selected.length ? "" : "Choose a folder containing animation videos.");
  };

  const downloadYoutube = async () => {
    const url = youtubeUrl.trim();
    if (!url || youtubeDownloading || uploading) return;
    setYoutubeDownloading(true);
    setMessage("");
    setError("");
    try {
      const result = await downloadYoutubeVideoAsync({
        url,
        quality: "best",
        licenseId: includedMediaLicenseId,
        licenseName: "Included Animations",
        folderName,
        ownerPassword,
      });
      setYoutubeUrl("");
      setMessage(`YouTube animation "${result.title}" downloaded and added to Included Animations.`);
      onChanged?.();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The YouTube animation could not be downloaded.");
    } finally {
      setYoutubeDownloading(false);
    }
  };

  const folderForFile = (file: File) => {
    const parts = (file.webkitRelativePath || "").split("/").filter(Boolean);
    const nested = parts.length > 2 ? parts.slice(1, -1) : [];
    return [folderName, ...nested].join("/");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!files.length || uploading) return;
    setUploading(true);
    setProgress(0);
    setMessage("");
    setError("");
    let uploaded = 0;
    const failures: string[] = [];
    for (const file of files) {
      try {
        const response = await fetch("/api/media/upload", {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "X-File-Name": file.name,
            "X-License-Id": includedMediaLicenseId,
            "X-License-Name": "Included Animations",
            "X-Folder-Name": folderForFile(file),
            "X-Owner-Password": ownerPassword,
            "X-Media-Title": file.name.replace(/\.[^.]+$/, ""),
            "X-Quality": "included",
          },
          body: file,
        });
        const payload = await response.json() as { error?: string };
        if (!response.ok) throw new Error(payload.error || "Upload failed.");
        uploaded += 1;
      } catch (reason) {
        failures.push(`${file.name}: ${reason instanceof Error ? reason.message : "Upload failed."}`);
      }
      setProgress(uploaded + failures.length);
    }
    setUploading(false);
    if (failures.length) {
      setError(`${uploaded} uploaded, ${failures.length} failed.\n${failures.join("\n")}`);
    } else {
      setMessage(`${uploaded} included animation${uploaded === 1 ? "" : "s"} added. They are now available to every active license.`);
      setFiles([]);
      onChanged?.();
    }
  };

  return <Modal title="Add included animations" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading || youtubeDownloading}>Close</button><button className="button" type="submit" form="included-animation-form" disabled={uploading || youtubeDownloading || !files.length}>{uploading ? `Uploading ${progress}/${files.length}…` : "Upload selected videos"} {!uploading && <Upload size={14}/>}</button></>}><form id="included-animation-form" onSubmit={submit}>
      <div className="included-youtube-import">
       <div className="included-import-heading"><div><strong>Download from YouTube</strong><span>Add a video directly to <b>{folderName.split("/").at(-1) || "Included Animations"}</b>.</span></div><Youtube size={18}/></div>
      <div className="input-action-row"><input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" type="url" inputMode="url" disabled={uploading || youtubeDownloading} data-testid="input-owner-included-youtube-url"/><button type="button" className="button secondary small" onClick={() => void downloadYoutube()} disabled={uploading || youtubeDownloading || !youtubeUrl.trim()} data-testid="button-owner-download-included-youtube">{youtubeDownloading ? "Downloading…" : "Download"} {!youtubeDownloading && <Download size={13}/>}</button></div>
    </div>
    <div className="included-upload-divider"><span>OR UPLOAD MANUALLY</span></div>
    <div className="form-grid">
      <div className="field full"><label>Choose videos from phone or computer</label><input ref={videoInputRef} autoFocus type="file" multiple accept="video/*,.mp4,.mov,.m4v,.webm,.mkv,.avi,.ts" onChange={(event) => chooseFiles(event.target.files)} data-testid="input-included-animation-videos"/><span className="field-hint">{files.length ? `${files.length} animation${files.length === 1 ? "" : "s"} selected.` : "On phone, tap here to select videos from Files or Gallery. You can select multiple videos."}</span></div>
      <div className="field full"><label>Or choose an animation folder <span className="field-optional">desktop</span></label><input ref={folderInputRef} type="file" multiple accept="video/*,.mp4,.mov,.m4v,.webm,.mkv,.avi,.ts" onChange={(event) => chooseFiles(event.target.files)} data-testid="input-included-animation-folder"/><span className="field-hint">Folder subfolders are preserved under Included Animations. Use the video option above on phones.</span></div>
    </div>
    {message && <div className="file-picked"><Check size={13}/> {message}</div>}{error && <div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Only the owner can add or remove shared animations. License users can watch and use them, but cannot change them.</div></form></Modal>;
}

function OwnerFoldersPage({ ownerPassword, onBack }: { ownerPassword: string; onBack: () => void }) {
  const [library, setLibrary] = useState<IncludedFoldersResponse | null>(null);
  const [selectedFolder, setSelectedFolder] = useState(includedFolderRoot);
  const [search, setSearch] = useState("");
  const [folderDialog, setFolderDialog] = useState<"create" | "rename" | null>(null);
  const [folderDraft, setFolderDraft] = useState("");
  const [uploadFolder, setUploadFolder] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const result = await apiJson<IncludedFoldersResponse>("/api/owner/included-folders", { headers: { "X-Owner-Password": ownerPassword } });
      setLibrary(result);
      setSelectedFolder((current) => result.folders.some((folder) => folder.path === current) ? current : result.root);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The included folders could not be loaded.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, [ownerPassword]);
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2800);
    return () => window.clearTimeout(timer);
  }, [message]);

  const folders = library?.folders || [];
  const files = library?.files || [];
  const root = library?.root || includedFolderRoot;
  const selectedFiles = useMemo(() => files.filter((file) => (file.folderName || root) === selectedFolder), [files, root, selectedFolder]);
  const childFolders = useMemo(() => folders.filter((folder) => folder.path !== selectedFolder && folder.path.split("/").slice(0, -1).join("/") === selectedFolder), [folders, selectedFolder]);
  const filteredFiles = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return needle ? selectedFiles.filter((file) => `${file.title} ${file.filename}`.toLowerCase().includes(needle)) : selectedFiles;
  }, [search, selectedFiles]);
  const folderLabel = (folderPath: string) => {
    const relative = folderPath.startsWith(`${root}/`) ? folderPath.slice(root.length + 1) : folderPath;
    return relative || "Included Animations";
  };
  const folderDepth = (folderPath: string) => Math.max(0, folderPath.split("/").length - root.split("/").length);
  const folderName = selectedFolder.split("/").at(-1) || "Included Animations";
  const isRoot = selectedFolder === root;
  const totalBytes = files.reduce((sum, file) => sum + (Number.isFinite(file.sizeBytes) ? file.sizeBytes : 0), 0);
  const formatBytes = (value: number) => value < 1024 * 1024 ? `${Math.max(1, Math.round(value / 1024))} KB` : `${(value / (1024 * 1024)).toFixed(1)} MB`;

  const submitFolder = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = folderDraft.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError("");
    try {
      if (folderDialog === "create") {
        const result = await apiJson<{ path: string }>("/api/owner/included-folders", { method: "POST", headers: { "X-Owner-Password": ownerPassword }, body: JSON.stringify({ folderName: `${selectedFolder}/${trimmed}` }) });
        await load();
        setSelectedFolder(result.path);
        setMessage(`Folder "${trimmed}" created.`);
      } else {
        const parent = selectedFolder.split("/").slice(0, -1).join("/");
        const result = await apiJson<{ to: string }>("/api/owner/included-folders", { method: "PATCH", headers: { "X-Owner-Password": ownerPassword }, body: JSON.stringify({ from: selectedFolder, to: `${parent}/${trimmed}` }) });
        await load();
        setSelectedFolder(result.to);
        setMessage(`Folder renamed to "${trimmed}".`);
      }
      setFolderDraft("");
      setFolderDialog(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The folder could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const deleteFolder = async () => {
    if (isRoot || busy || !window.confirm(`Delete "${folderName}" and all videos inside it? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    try {
      const result = await apiJson<{ deleted: number }>(`/api/owner/included-folders?folderName=${encodeURIComponent(selectedFolder)}`, { method: "DELETE", headers: { "X-Owner-Password": ownerPassword } });
      await load();
      setSelectedFolder(root);
      setMessage(result.deleted ? `Folder deleted with ${result.deleted} video${result.deleted === 1 ? "" : "s"}.` : "Empty folder deleted.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The folder could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  const moveVideo = async (fileId: string, folderName: string) => {
    if (!folderName || busy) return;
    setBusy(true);
    setError("");
    try {
      await apiJson(`/api/owner/included-files/${encodeURIComponent(fileId)}`, { method: "PATCH", headers: { "X-Owner-Password": ownerPassword }, body: JSON.stringify({ folderName }) });
      await load();
      setMessage("Video moved.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The video could not be moved.");
    } finally {
      setBusy(false);
    }
  };

  const deleteVideo = async (file: MediaFileRecord) => {
    if (busy || !window.confirm(`Delete "${file.title}"? This removes the shared video for every license.`)) return;
    setBusy(true);
    setError("");
    try {
      await apiJson(`/api/media/files/${encodeURIComponent(file.fileId)}?licenseId=${encodeURIComponent(includedMediaLicenseId)}`, { method: "DELETE", headers: { "X-Owner-Password": ownerPassword } });
      await load();
      setMessage("Video deleted from the shared library.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The video could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="owner-page owner-folders-page">
    <header className="owner-topbar"><Brand /><div className="actions"><button className="button secondary" onClick={onBack}><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> License keys</button><a href="/" className="button secondary">Open license gate <ArrowRight size={14} /></a></div></header>
    <main className="owner-content">
      <div className="page-head owner-folder-page-head"><div><p className="eyebrow">Admin library control</p><h1>My folders</h1><p className="subtle">Organize the shared Included Animations library. Changes here are visible to every active license.</p></div><div className="owner-folder-summary"><strong>{folders.length}</strong><span>folders</span><strong>{files.length}</strong><span>videos · {formatBytes(totalBytes)}</span></div></div>
      {error && <div className="error-note" style={{ marginBottom: 16 }}>{error}</div>}
      {message && <div className="form-note owner-folder-message"><Check size={14} /> {message}</div>}
      <div className="folder-manager-grid">
        <aside className="card folder-tree-panel"><div className="section-head"><div><h2 className="section-title">Folder structure</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Create, rename, move, or remove folders.</p></div><FolderOpen size={17} color="#6c8b83" /></div><button className={`folder-tree-item root ${isRoot ? "selected" : ""}`} onClick={() => setSelectedFolder(root)}><FolderOpen size={15} /><span>Included Animations</span><b>{files.filter((file) => file.folderName === root).length}</b></button><div className="folder-tree-list">{folders.filter((folder) => folder.path !== root).map((folder) => <button key={folder.path} className={`folder-tree-item ${selectedFolder === folder.path ? "selected" : ""}`} style={{ paddingLeft: `${14 + folderDepth(folder.path) * 16}px` }} onClick={() => setSelectedFolder(folder.path)}><FolderOpen size={14} /><span>{folder.path.split("/").at(-1)}</span><b>{files.filter((file) => file.folderName === folder.path).length}</b></button>)}</div><button className="button secondary folder-create-button" onClick={() => { setFolderDraft(""); setFolderDialog("create"); }}><Plus size={14} /> New folder</button></aside>
        <section className="folder-manager-main">
          <div className="card folder-manager-toolbar"><div><p className="eyebrow">Selected folder</p><h2>{folderLabel(selectedFolder)}</h2><p className="subtle">{isRoot ? "Shared root folder" : "Shared admin folder"} · {selectedFiles.length} direct video{selectedFiles.length === 1 ? "" : "s"}</p></div><div className="folder-toolbar-actions"><button className="button" onClick={() => setUploadFolder(selectedFolder)}><Upload size={14} /> Add videos</button>{!isRoot && <><button className="button secondary" onClick={() => { setFolderDraft(folderName); setFolderDialog("rename"); }}><Pencil size={14} /> Rename</button><button className="button ghost danger" onClick={() => void deleteFolder()} disabled={busy}><Trash2 size={14} /> Delete</button></>}</div></div>
          <div className="folder-child-grid">{childFolders.map((folder) => <button className="folder-child-card" key={folder.path} onClick={() => setSelectedFolder(folder.path)}><FolderOpen size={18} /><span><strong>{folder.path.split("/").at(-1)}</strong><small>{files.filter((file) => file.folderName === folder.path).length} videos</small></span><ArrowRight size={14} /></button>)}</div>
          <div className="card folder-video-panel"><div className="section-head"><div><h2 className="section-title">Videos in {folderName}</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Move a video to another folder or remove it from the shared library.</p></div><div className="folder-video-tools"><div className="input-wrap"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search videos" /></div><span className="mono">{filteredFiles.length}/{selectedFiles.length}</span></div></div>{loading ? <div className="owner-folder-empty"><FolderOpen size={22} /><strong>Loading shared folders…</strong></div> : filteredFiles.length === 0 ? <div className="owner-folder-empty"><FileVideo size={22} /><strong>{search ? "No matching videos" : "This folder is empty"}</strong><span>Use Add videos to upload files or download a YouTube animation here.</span></div> : <div className="folder-video-list">{filteredFiles.map((file) => <div className="folder-video-row" key={file.fileId}><div className="folder-video-icon"><Play size={14} /></div><div className="folder-video-copy"><strong>{file.title}</strong><span>{file.duration} · {file.quality || "included"} · {formatBytes(file.sizeBytes)}</span></div><a className="icon-button" href={file.playbackUrl} target="_blank" rel="noreferrer" title="Preview video"><Play size={13} /></a><select value={file.folderName || root} onChange={(event) => void moveVideo(file.fileId, event.target.value)} disabled={busy} aria-label={`Move ${file.title}`}><option value={file.folderName || root}>Move to…</option>{folders.map((folder) => <option key={folder.path} value={folder.path}>{folderLabel(folder.path)}</option>)}</select><button className="icon-button" onClick={() => void deleteVideo(file)} disabled={busy} title="Delete shared video"><Trash2 size={13} /></button></div>)}</div>}</div>
        </section>
      </div>
    </main>
    {folderDialog && <Modal title={folderDialog === "create" ? "Create folder" : "Rename folder"} onClose={() => setFolderDialog(null)} footer={<><button className="button ghost" onClick={() => setFolderDialog(null)}>Cancel</button><button className="button" type="submit" form="owner-folder-form" disabled={busy || !folderDraft.trim()}>{folderDialog === "create" ? "Create folder" : "Save name"} <Check size={14} /></button></>}><form id="owner-folder-form" onSubmit={submitFolder}><div className="field"><label>{folderDialog === "create" ? "Folder name" : "New folder name"}</label><input autoFocus value={folderDraft} onChange={(event) => setFolderDraft(event.target.value)} placeholder="e.g. Subscribe animations" /></div><span className="field-hint">{folderDialog === "create" ? `This folder will be created inside ${folderName}.` : "All child folders and videos will move with it."}</span></form></Modal>}
    {uploadFolder && <IncludedAnimationsModal ownerPassword={ownerPassword} folderName={uploadFolder} onClose={() => setUploadFolder(null)} onChanged={() => void load()} />}
  </div>;
}

function OwnerPage() {
  const [password, setPassword] = useState("");
  const [authorizedPassword, setAuthorizedPassword] = useState("");
  const [licenses, setLicenses] = useState<LicenseSession[]>([]);
  const [vidKrakenTokens, setVidKrakenTokens] = useState<VidKrakenTokenStatus[]>([]);
  const [showKeys, setShowKeys] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState("30");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showIncludedAnimations, setShowIncludedAnimations] = useState(false);
  const [ownerView, setOwnerView] = useState<"licenses" | "folders">("licenses");
  const load = async (ownerPassword: string) => {
    const result = await apiJson<{ licenses?: LicenseSession[] }>("/api/licenses", { headers: { "X-Owner-Password": ownerPassword } });
    if (!Array.isArray(result?.licenses)) {
      throw new Error("License list could not be loaded. Please try again.");
    }
    setLicenses(result.licenses);
  };
  const loadVidKrakenTokens = async (ownerPassword: string) => {
    const result = await apiJson<{ count: number; tokens: VidKrakenTokenStatus[] }>("/api/owner/vidkraken-keys", { headers: { "X-Owner-Password": ownerPassword } });
    if (!Array.isArray(result?.tokens)) throw new Error("VidKraken key list could not be loaded.");
    setVidKrakenTokens(result.tokens);
  };
  const signIn = async (event:FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await load(password); await loadVidKrakenTokens(password); setAuthorizedPassword(password); } catch (reason) { setError(reason instanceof Error ? reason.message : "Owner access was denied."); } finally { setBusy(false); }
  };
  const openKeys = async () => {
    setKeyBusy(true); setError("");
    try { await loadVidKrakenTokens(authorizedPassword); setShowKeys(true); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load VidKraken keys."); }
    finally { setKeyBusy(false); }
  };
  const addToken = async (event:FormEvent) => {
    event.preventDefault(); if (!tokenDraft.trim()) return;
    setKeyBusy(true); setError("");
    try {
      await apiJson("/api/owner/vidkraken-keys", { method:"POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ token: tokenDraft }) });
      setTokenDraft(""); await loadVidKrakenTokens(authorizedPassword);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add the VidKraken key."); }
    finally { setKeyBusy(false); }
  };
  const removeToken = async (token:VidKrakenTokenStatus) => {
    if (!window.confirm(`Delete ${token.key} from the VidKraken token pool?`)) return;
    setKeyBusy(true); setError("");
    try {
      await apiJson(`/api/owner/vidkraken-keys/${encodeURIComponent(token.key)}`, { method:"DELETE", headers: { "X-Owner-Password": authorizedPassword } });
      await loadVidKrakenTokens(authorizedPassword);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete the VidKraken key."); }
    finally { setKeyBusy(false); }
  };
  const create = async (event:FormEvent) => {
    event.preventDefault(); if (!name.trim()) return;
    setBusy(true); setError("");
    try {
      await apiJson<LicenseSession>("/api/licenses", { method:"POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ name: name.trim(), days: Number(days) }) });
      setName(""); await load(authorizedPassword);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create the license."); } finally { setBusy(false); }
  };
  const renew = async (licenseId:string) => {
    setBusy(true); setError("");
    try { await apiJson<LicenseSession>(`/api/licenses/${encodeURIComponent(licenseId)}/renew`, { method:"POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ days: 30 }) }); await load(authorizedPassword); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not renew the license."); } finally { setBusy(false); }
  };
  const remove = async (license:LicenseSession) => {
    if (!window.confirm(`Delete ${license.name} and its workspace data?`)) return;
    setBusy(true); setError("");
    try { await apiJson(`/api/licenses/${encodeURIComponent(license.licenseId)}`, { method:"DELETE", headers: { "X-Owner-Password": authorizedPassword } }); await load(authorizedPassword); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete the license."); } finally { setBusy(false); }
  };
  if (!authorizedPassword) return <div className="login-page owner-login-page"><section className="login-visual"><div className="login-logo"><div className="brand-mark"><img src={logoImage} alt="Reverse Bypass logo" /></div><div><div className="brand-name">Reverse Bypass</div><div className="brand-note">owner console</div></div></div><div className="login-copy"><div className="signal-line"><span/>OWNER CONSOLE · PRIVATE</div><h1>Keep every<br/><em>key in hand.</em></h1><p>Create, renew, and remove license access for the workspaces you manage.</p></div><div className="signal-line"><span/>LICENSE ADMINISTRATION</div></section><section className="login-panel"><div className="login-card"><p className="eyebrow">Owner access</p><h2>Welcome, owner.</h2><p className="subtle">Enter the owner password to manage license keys.</p>{error&&<div className="error-note">{error}</div>}<form className="login-form" onSubmit={signIn}><div className="field"><label htmlFor="owner-password">Owner password</label><input id="owner-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoFocus data-testid="input-owner-password"/></div><button className="button login-submit" type="submit" disabled={busy||!password} data-testid="button-owner-login">{busy?"Checking…":"Open owner console"} <ArrowRight size={16}/></button></form><div className="demo-note"><ShieldCheck size={15}/><span>Public license access is enabled by the Firebase Realtime Database rules.</span></div><a href="/" className="section-link">Back to license access</a></div></section></div>;
  if (ownerView === "folders") return <OwnerFoldersPage ownerPassword={authorizedPassword} onBack={() => setOwnerView("licenses")} />;
  return <div className="owner-page"><header className="owner-topbar"><Brand/><div className="actions"><button className="button secondary" onClick={()=>setOwnerView("folders")} data-testid="button-owner-folders"><FolderOpen size={14}/> My folders</button><button className="button secondary" onClick={()=>setShowIncludedAnimations(true)} data-testid="button-owner-included-animations"><Upload size={14}/> Included animations</button><button className="button secondary" onClick={()=>void openKeys()} disabled={keyBusy} data-testid="button-owner-keys"><ShieldCheck size={14}/> KEY{vidKrakenTokens.length ? ` · ${vidKrakenTokens.length}` : ""}</button><a href="/" className="button secondary">Open license gate <ArrowRight size={14}/></a></div></header><main className="owner-content"><div className="page-head"><div><p className="eyebrow">Owner console</p><h1>License keys</h1><p className="subtle">Create access keys, keep customer workspaces separate, and manage the shared Included Animations library.</p></div><div className="status live"><span className="status-dot"/>Firebase connected</div></div>{error&&<div className="error-note">{error}</div>}<section className="card section-card owner-create"><div className="section-head"><div><h2 className="section-title">Create license</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>The generated key can be used by more than one browser; each browser gets its own workspace.</p></div><Plus size={17} color="#6c8b83"/></div><form className="owner-create-form" onSubmit={create}><div className="field"><label>Customer / workspace name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Studio A" data-testid="input-license-name"/></div><div className="field"><label>Valid for days</label><input type="number" min="1" max="3650" value={days} onChange={e=>setDays(e.target.value)} data-testid="input-license-days"/></div><button className="button" type="submit" disabled={busy||!name.trim()} data-testid="button-create-license"><Plus size={15}/> Create license</button></form></section><section className="card section-card owner-list"><div className="section-head"><div><h2 className="section-title">{licenses.length} license{licenses.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Existing access keys and renewal controls.</p></div><Clipboard size={17} color="#6c8b83"/></div>{licenses.length===0?<EmptyState icon={<ShieldCheck size={21}/>} title="No licenses yet" copy="Create the first key above to give a workspace access."/>:<div className="license-list">{licenses.map(license=>{const active=isLicenseActive(license);return <div className="license-row" key={license.licenseId}><div className="license-row-main"><div className="license-key-badge"><ShieldCheck size={15}/></div><div><strong>{license.name}</strong><span className="mono">{license.key}</span></div></div><div className={`status ${active?"live":"stopped"}`}><span className="status-dot"/>{active?"Active":"Expired"} · {new Date(license.expiresAt).toLocaleDateString()}</div><div className="actions"><button className="button secondary small" onClick={()=>void renew(license.licenseId)} disabled={busy}>Renew 30 days</button><button className="icon-button" onClick={()=>void remove(license)} disabled={busy} title="Delete license" data-testid={`button-delete-license-${license.licenseId}`}><Trash2 size={13}/></button></div></div>})}</div>}</section></main>{showKeys&&<Modal title="VidKraken KEY pool" onClose={()=>setShowKeys(false)} footer={<button className="button ghost" onClick={()=>setShowKeys(false)} data-testid="button-close-owner-keys">Close</button>}><div className="key-panel"><div className="key-panel-summary"><div><p className="eyebrow">Server token rotation</p><h3 data-testid="text-vidkraken-token-count">{vidKrakenTokens.length} token{vidKrakenTokens.length===1?"":"s"} configured</h3><p className="subtle">Token values stay hidden. A limited token is paused for 3 hours, then becomes available again.</p></div><a className="button secondary" href="https://vidkraken.com/" target="_blank" rel="noreferrer" data-testid="link-get-vidkraken-key">Get key <ArrowRight size={14}/></a></div><form className="owner-key-form" onSubmit={addToken}><div className="field"><label htmlFor="vidkraken-token">Add new VidKraken token</label><input id="vidkraken-token" type="password" autoComplete="new-password" value={tokenDraft} onChange={e=>setTokenDraft(e.target.value)} placeholder="Paste token securely" disabled={keyBusy} data-testid="input-vidkraken-token"/></div><button className="button" type="submit" disabled={keyBusy||!tokenDraft.trim()} data-testid="button-add-vidkraken-token"><Plus size={15}/> Add token</button></form>{vidKrakenTokens.length===0?<EmptyState icon={<ShieldCheck size={21}/>} title="No VidKraken tokens" copy="Add a token to enable YouTube downloads."/>:<div className="key-list">{vidKrakenTokens.map(token=>{const cooling=token.status==="cooldown";return <div className="key-row" key={token.key} data-testid={`row-vidkraken-token-${token.key}`}><div><strong>{token.key}</strong><span className="subtle">Secret value hidden</span></div><div className={`status ${cooling?"stopped":"live"}`} data-testid={`status-vidkraken-token-${token.key}`}><span className="status-dot"/>{cooling&&token.cooldownUntil?`Cooldown until ${new Date(token.cooldownUntil).toLocaleTimeString()}`:"Ready"}</div><button className="icon-button" onClick={()=>void removeToken(token)} disabled={keyBusy} title={`Delete ${token.key}`} data-testid={`button-delete-vidkraken-token-${token.key}`}><Trash2 size={13}/></button></div>})}</div>}</div></Modal>}{showIncludedAnimations&&<IncludedAnimationsModal ownerPassword={authorizedPassword} onClose={()=>setShowIncludedAnimations(false)}/>}</div>;
}

function Metric({ label, value, detail, dim }: { label:string; value:string|number; detail:string; dim?:boolean }) { return <div className="card metric" data-testid={`metric-${label.toLowerCase().replaceAll(" ","-")}`}><div className="metric-kicker">{label}</div><div className="metric-value">{value}</div><div className={`metric-delta ${dim ? "dim":""}`}>{detail}</div></div>; }

function ActivityList({ activities }: { activities:Activity[] }) {
  const Icon = ({type}:{type:string}) => type==="live" ? <Radio size={14}/> : type==="video" ? <FileVideo size={14}/> : type==="group" ? <FolderOpen size={14}/> : <Pencil size={14}/>;
  return <div className="activity">{activities.map(a=><div className="activity-item" key={a.id} data-testid={`activity-${a.id}`}><div className="activity-icon"><Icon type={a.type}/></div><div><p className="activity-message">{a.message}</p><div className="activity-time">{a.time}</div></div></div>)}</div>;
}

function Dashboard({ workspace }: { workspace:ReturnType<typeof useWorkspace> }) {
  const {data, update} = workspace;
  const live = data.channels.filter(c=>c.status==="live");
  return <AppShell title="Overview" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Tuesday · 21 May 2024</p><h1>Good morning, {workspace.user.split("@")[0]}.</h1><p className="subtle">The room is quiet. One channel is currently on air.</p></div><Link href="/live" className="button" data-testid="link-go-live"><Radio size={15}/> Manage live room</Link></div>
    <div className="metric-grid"><Metric label="On air now" value={live.length} detail={live.length ? "Signal is healthy" : "Nothing is live"} /><Metric label="Library videos" value={data.videos.length} detail={`${data.videos.filter(v=>v.status==="published").length} published`} /><Metric label="Categories" value={data.groups.length} detail="Playlist folders" /> </div>
    <div className="split-grid"><section className="card section-card"><div className="section-head"><div><h2 className="section-title">Live channels</h2><p className="subtle" style={{margin: "5px 0 0", fontSize:11}}>Your broadcast surface, at a glance.</p></div><Link href="/live" className="section-link" data-testid="link-view-all-live">View all <ArrowRight size={12} style={{verticalAlign:"-2px"}}/></Link></div>{live.length ? <div className="live-list">{live.map(c=><div className="live-row" key={c.id} data-testid={`live-row-${c.id}`}><div className="thumb" style={{background:c.thumbnailColor}}><Radio size={16}/></div><div><div className="row-title">{c.title}</div><div className="row-meta">{c.platform} · live for {fmtTime(c.startedAt)}</div></div><div className="status live"><span className="status-dot"/>Live</div></div>)}</div> : <EmptyState icon={<Radio size={21}/>} title="Nothing is live" copy="Start a channel when the room is ready." action="Open live room" href="/live"/>}<div className="quick-actions"><Link href="/live" className="quick" data-testid="quick-new-channel"><Plus size={15}/> New channel</Link><Link href="/videos" className="quick" data-testid="quick-add-video"><Upload size={15}/> Add to library</Link></div></section>
      <section className="card section-card"><div className="section-head"><div><h2 className="section-title">Recent activity</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>A small paper trail for the room.</p></div><ActivityIcon size={17} color="#6c8b83"/></div><ActivityList activities={data.activities}/></section></div>
    </div></AppShell>;
}

function EmptyState({ icon, title, copy, action, href, onClick }: {icon:ReactNode; title:string; copy:string; action?:string; href?:string; onClick?:()=>void}) { return <div className="empty"><div className="empty-art">{icon}</div><h3>{title}</h3><p className="subtle">{copy}</p>{action && (href ? <Link href={href} className="button secondary" data-testid="link-empty-action">{action} <ArrowRight size={14}/></Link> : <button className="button secondary" onClick={onClick} data-testid="button-empty-action">{action} <ArrowRight size={14}/></button>)}</div>; }

function Modal({ title, children, footer, onClose }: {title:string; children:ReactNode; footer:ReactNode; onClose:()=>void}) { return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal" role="dialog" aria-modal="true"><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} data-testid="button-close-modal"><X size={17}/></button></div><div className="modal-body">{children}</div><div className="modal-foot">{footer}</div></div></div>; }

function ChannelPreview({ mainUrl, faceUrl, ratio, facePosition, faceSize }: { mainUrl?: string; faceUrl?: string; ratio:AspectRatio; facePosition:FacePosition; faceSize:number }) {
  return <div className={`channel-preview preview-${ratio}`}>
    <div className="preview-grid" />
    {mainUrl ? <video className="preview-main-video" src={mainUrl} autoPlay muted loop playsInline /> : <div className="preview-empty"><Video size={18}/><span>Select a main video category</span></div>}
    {faceUrl && <video className={`preview-face-video position-${facePosition}`} style={{width:`${faceSize}%`}} src={faceUrl} autoPlay muted loop playsInline />}
    <div className="preview-label"><span className="pulse" />Live composition preview</div>
    <div className="preview-ratio">{ratio === "shorts" ? "9:16 Shorts" : ratio === "square" ? "1:1 Square" : "16:9 Full"}</div>
  </div>;
}

function ChannelModal({ channel, groups, videos, onSave, onClose }: {channel?:LiveChannel; groups:VideoGroup[]; videos:VideoItem[]; onSave:(c:LiveChannel)=>void; onClose:()=>void}) {
  const existingVideos = channel ? videosForGroup(channel.groupId, groups, videos) : [];
  const [form,setForm] = useState({
    groupId:channel?.groupId||"",
    streamUrl:channel?.streamUrl||"https://a.upload.youtube.com/http_upload_hls?cid=&copy=0&file=",
    aspectRatio:channel?.aspectRatio||"full" as AspectRatio,
    playbackSpeed:channel?.playbackSpeed||1,
    faceGroupId:channel?.faceGroupId||"",
    facePosition:channel?.facePosition||"bottom-right" as FacePosition,
    faceSize:channel?.faceSize||25,
     streamQuality:channel?.streamQuality||"4k" as StreamQuality,
    durationHours:channel?.durationHours||1,
    autoRestart:channel?.autoRestart||false,
    playlistVideoIds: channel?.playlistVideoIds?.length ? channel.playlistVideoIds : existingVideos.map((video) => video.id),
  });
  const set=(key:string,value:string|number|boolean)=>setForm(f=>({...f,[key]:value}));
  const selectedGroup = groups.find(g=>g.id===form.groupId);
  const faceGroup = groups.find(g=>g.id===form.faceGroupId);
  const mainVideos = videosForGroup(form.groupId, groups, videos);
  const faceVideos = videosForGroup(form.faceGroupId, groups, videos);
  const selectedMainVideos = form.playlistVideoIds
    .map((id) => mainVideos.find((video) => video.id === id))
    .filter((video): video is VideoItem => Boolean(video));
  const mainVideo = selectedMainVideos[0];
  const faceVideo = faceVideos[0];
  const mainServerReady = selectedMainVideos.length > 0 && selectedMainVideos.every(video=>Boolean(video.serverSource));
  const faceServerReady = !form.faceGroupId || (faceVideos.length > 0 && faceVideos.every(video=>Boolean(video.serverSource)));
  const togglePlaylistVideo = (videoId: string) => {
    setForm((current) => ({
      ...current,
      playlistVideoIds: current.playlistVideoIds.includes(videoId)
        ? current.playlistVideoIds.filter((id) => id !== videoId)
        : [...current.playlistVideoIds, videoId],
    }));
  };
  const submit=(e:FormEvent)=>{
    e.preventDefault();
    if(!form.streamUrl.trim() || !form.groupId || !form.playlistVideoIds.length) return;
    const platform=platformFromUrl(form.streamUrl);
    onSave({
      id:channel?.id||uid("ch"), title:channel?.title||`${platform} channel`, platform,
      status:channel?.status||"stopped", groupId:form.groupId, streamUrl:form.streamUrl.trim(),
      streamKey:channel?.streamKey||"", viewers:channel?.viewers||0, startedAt:channel?.startedAt||null,
      thumbnailColor:channel?.thumbnailColor||colors[0], createdAt:channel?.createdAt||now(),
       aspectRatio:form.aspectRatio, playbackSpeed:Number(form.playbackSpeed), faceGroupId:form.faceGroupId || undefined,
      facePosition:form.facePosition, faceSize:Number(form.faceSize), durationHours:Number(form.durationHours),
        autoRestart:form.autoRestart, streamQuality:form.streamQuality, playlistVideoIds:form.playlistVideoIds,
    });
  };
   return <Modal title={channel ? "Update channel" : "Add live channel"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} data-testid="button-cancel-channel">Cancel</button><button className="button" type="submit" form="channel-form" disabled={!form.streamUrl.trim() || !form.groupId || !form.playlistVideoIds.length} data-testid="button-save-channel">{channel ? "Save changes" : "Add channel"} <Check size={14}/></button></>}><form id="channel-form" onSubmit={submit}>
    <div className="form-grid">
      <div className="field full"><label>Live URL</label><input autoFocus required value={form.streamUrl} onChange={e=>set("streamUrl",e.target.value)} placeholder="https://a.upload.youtube.com/http_upload_hls?...&file=" data-testid="input-stream-url"/></div>
       <div className="field"><label>Main video folder</label><select required value={form.groupId} onChange={e=>{const groupId=e.target.value;setForm(current=>({...current,groupId,playlistVideoIds:[]}));}} data-testid="select-channel-group"><option value="">Select a folder</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
       <div className="field"><label>Live format</label><select value={form.aspectRatio} onChange={e=>set("aspectRatio",e.target.value as AspectRatio)} data-testid="select-channel-ratio"><option value="shorts">Shorts · 9:16 vertical</option><option value="full">Big live · 16:9 landscape</option><option value="square">Square · 1:1</option></select></div>
       <div className="field"><label>Video speed</label><select value={form.playbackSpeed} onChange={e=>set("playbackSpeed",Number(e.target.value))} data-testid="select-channel-speed"><option value="0.5">0.5× slow</option><option value="0.75">0.75×</option><option value="1">1× normal</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2× fast</option></select></div>
       <div className="field"><label>Broadcast quality</label><select value={form.streamQuality} onChange={e=>set("streamQuality",e.target.value as StreamQuality)} data-testid="select-channel-quality"><option value="4k">4K · highest available</option><option value="1080p">Full HD · 1080p</option></select></div>
       <div className="field full"><label>Playlist videos <span className="label-optional">{form.playlistVideoIds.length ? `· ${form.playlistVideoIds.length} selected` : "· tick videos in play order"}</span></label>
         {!form.groupId ? <div className="playlist-empty">Select a folder to see its videos.</div> : mainVideos.length === 0 ? <div className="playlist-empty">This folder has no videos yet.</div> : <div className="playlist-picker">{mainVideos.map((video) => {
           const queueNumber = form.playlistVideoIds.indexOf(video.id);
           const checked = queueNumber !== -1;
           return <label className={`playlist-item ${checked ? "selected" : ""}`} key={video.id}>
             <input type="checkbox" checked={checked} onChange={() => togglePlaylistVideo(video.id)} />
             <span className="playlist-number">{checked ? queueNumber + 1 : "—"}</span>
             <span className="playlist-copy"><strong>{video.title}</strong><small>{video.duration} · {video.quality || "local video"}</small></span>
             {checked && <Check size={14} />}
           </label>;
         })}</div>}
          <span className="field-hint">Tick the first video, then the second, third, and so on. The live stream follows this queue, repeats from video 1 after the last one, and keeps looping until the selected stream duration ends.</span>
       </div>
      <div className="field full"><label>Face video category <span className="label-optional">optional overlay</span></label><select value={form.faceGroupId} onChange={e=>set("faceGroupId",e.target.value)} data-testid="select-channel-face-group"><option value="">No face overlay</option>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
      <div className="field"><label>Face position</label><select disabled={!form.faceGroupId} value={form.facePosition} onChange={e=>set("facePosition",e.target.value as FacePosition)} data-testid="select-face-position"><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option><option value="center">Center</option></select></div>
      <div className="field"><label>Face size · {form.faceSize}%</label><input disabled={!form.faceGroupId} type="range" min="10" max="60" step="1" value={form.faceSize} onChange={e=>set("faceSize",Number(e.target.value))} data-testid="input-face-size"/></div>
      <div className="field"><label>Stream duration</label><select value={form.durationHours} onChange={e=>set("durationHours",Number(e.target.value))} data-testid="select-stream-duration"><option value="0.5">30 minutes</option><option value="1">1 hour</option><option value="2">2 hours</option><option value="4">4 hours</option><option value="8">8 hours</option><option value="12">12 hours</option><option value="24">24 hours</option></select></div>
      <div className="field field-check"><label>After duration</label><label className="check-control"><input type="checkbox" checked={form.autoRestart} onChange={e=>set("autoRestart",e.target.checked)} data-testid="toggle-auto-restart"/><span><strong>Auto-start again</strong><small>Restart the stream after the selected duration.</small></span></label></div>
    </div>
    <ChannelPreview mainUrl={mainVideo?.sourceUrl} faceUrl={faceVideo?.sourceUrl} ratio={form.aspectRatio} facePosition={form.facePosition} faceSize={Number(form.faceSize)} />
     {(!mainServerReady || !faceServerReady) && <div className="error-note stream-source-warning"><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Preview is ready, but Start needs every selected video to be server-ready. Re-add missing videos from Video library once so the local stream server can use them.</div>}
      <div className="form-note"><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Only ticked videos enter this channel's queue. They play in the tick order, one after another, then loop back to the first. Face placement and size are shown in the preview.</div>
  </form></Modal>;
}

function ConfirmModal({title, copy, onConfirm, onClose}: {title:string;copy:string;onConfirm:()=>void;onClose:()=>void}) { return <Modal title={title} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} data-testid="button-cancel-confirm">Keep it</button><button className="button danger" onClick={onConfirm} data-testid="button-confirm-delete"><Trash2 size={14}/> Delete</button></>}><p className="confirm-copy">{copy}</p><div className="form-note"><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>This action cannot be undone from the workspace.</div></Modal>; }

function streamIdFor(clientId:string, channelId:string):string {
  return `${clientId}:${channelId}`;
}

function videosForGroup(groupId: string | undefined, groups: VideoGroup[], videos: VideoItem[]): VideoItem[] {
  if (!groupId) return [];
  const group = groups.find((item) => item.id === groupId);
  if (!group) return [];
  const byId = new Map(videos.map((video) => [video.id, video]));
  const ordered: VideoItem[] = [];
  for (const id of group.videoIds) {
    const video = byId.get(id);
    if (video?.groupId === groupId) ordered.push(video);
  }
  for (const video of videos) {
    if (video.groupId === groupId && !ordered.some((item) => item.id === video.id)) ordered.push(video);
  }
  return ordered;
}

function videosForFolderScope(groupId: string | undefined, groups: VideoGroup[], videos: VideoItem[]): VideoItem[] {
  if (!groupId) return [];
  const ids = descendantGroupIds(groupId, groups);
  return videos.filter((video) => ids.has(video.groupId));
}

function playlistFor(channel:LiveChannel, groups:VideoGroup[], videos:VideoItem[]) {
  const mainGroup=groups.find(group=>group.id===channel.groupId);
  const faceGroup=channel.faceGroupId?groups.find(group=>group.id===channel.faceGroupId):undefined;
  const folderVideos=videosForGroup(channel.groupId, groups, videos);
  const mainVideos=channel.playlistVideoIds?.length
    ? channel.playlistVideoIds.map((id) => folderVideos.find((video) => video.id === id)).filter((video): video is VideoItem => Boolean(video))
    : folderVideos;
  const faceVideos=videosForGroup(channel.faceGroupId, groups, videos);
  return {
    category:mainGroup?.name,
    mainVideos,
    faceCategory:faceGroup?.name,
    faceVideos,
    videoSources:mainVideos.map(video=>video.serverSource).filter((source): source is string=>Boolean(source)),
    faceSources:faceVideos.map(video=>video.serverSource).filter((source): source is string=>Boolean(source)),
  };
}

function LivePage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data,update}=workspace; const [editing,setEditing]=useState<LiveChannel|undefined>(); const [showForm,setShowForm]=useState(false); const [deleting,setDeleting]=useState<LiveChannel|undefined>(); const [busy,setBusy]=useState<string[]>([]);
  const playlistSignatures=useRef(new Map<string,string>());
  const save=(channel:LiveChannel)=>{const exists=data.channels.some(c=>c.id===channel.id); update({channels:exists?data.channels.map(c=>c.id===channel.id?channel:c):[channel,...data.channels]}, {message:exists?`${channel.title} was updated`:`${channel.title} was added`,type:"edit"}); setShowForm(false);setEditing(undefined);};
  const start=async(c:LiveChannel)=>{if(busy.includes(c.id))return;setBusy(ids=>[...ids,c.id]);try{
     const playlist=playlistFor(c,data.groups,data.videos);
     const category=playlist.category;
     const faceCategory=playlist.faceCategory;
     const mainVideo=playlist.mainVideos[0];
     const faceVideo=playlist.faceVideos[0];
     if(!category)throw new Error("Choose a video category before starting.");
      if(!playlist.mainVideos.length)throw new Error("Tick at least one video in the selected folder before starting.");
      if(!playlist.mainVideos.every(video=>video.serverSource))throw new Error("Every ticked video in the selected folder must be server-ready before starting.");
     if(playlist.faceVideos.length&&!playlist.faceVideos.every(video=>video.serverSource))throw new Error("Every video in the face category must be server-ready before starting.");
     const scopedStreamId=streamIdFor(workspace.clientId,c.id);
    const result=await startStream({
        streamId:scopedStreamId, ingestUrl:c.streamUrl, category, videoSource:mainVideo?.serverSource,
        videoSources:playlist.videoSources,
        faceCategory, faceSource:faceVideo?.serverSource,
        faceSources:playlist.faceSources,
       playbackSpeed:c.playbackSpeed||1, quality:c.streamQuality||"4k", aspectRatio:c.aspectRatio||"full", facePosition:c.facePosition||"bottom-right",
      faceScale:(c.faceSize||25)/100, durationMinutes:(c.durationHours||1)*60,
      autoRestart:Boolean(c.autoRestart),
    });
    if(result.status!=="running")throw new Error(result.message);
     playlistSignatures.current.set(scopedStreamId,JSON.stringify({videoSources:playlist.videoSources,faceSources:playlist.faceSources}));
    update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"live",viewers:0,startedAt:now()}:x)},{message:`${c.title} is now streaming from the ${category} video`,type:"live"});
  }catch(error){workspace.setToast(error instanceof Error?error.message:"Could not start the real stream.");}finally{setBusy(ids=>ids.filter(id=>id!==c.id));}};
   const stop=async(c:LiveChannel)=>{if(busy.includes(c.id))return;setBusy(ids=>[...ids,c.id]);try{const scopedStreamId=streamIdFor(workspace.clientId,c.id);await stopStream({streamId:scopedStreamId});playlistSignatures.current.delete(scopedStreamId);update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} was taken off air`,type:"edit"});}catch(error){workspace.setToast(error instanceof Error?error.message:"Could not stop the stream.");}finally{setBusy(ids=>ids.filter(id=>id!==c.id));}};
   useEffect(()=>{const liveChannels=data.channels.filter(c=>c.status==="live");if(!liveChannels.length)return;const timer=window.setInterval(()=>{void Promise.all(liveChannels.map(async c=>{try{const result=await getStreamStatus(streamIdFor(workspace.clientId,c.id));if(result.status!=="running"){update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} stream process ${result.status}`,type:"edit"});}}catch{ /* Keep the visible state until the API is reachable again. */ }}));},5000);return()=>window.clearInterval(timer);},[data.channels,update,workspace.clientId]);
   useEffect(()=>{const liveChannels=data.channels.filter(c=>c.status==="live");void Promise.all(liveChannels.map(async c=>{const scopedStreamId=streamIdFor(workspace.clientId,c.id);const playlist=playlistFor(c,data.groups,data.videos);if(!playlist.category)return;const signature=JSON.stringify({videoSources:playlist.videoSources,faceSources:playlist.faceSources});if(playlistSignatures.current.get(scopedStreamId)===signature)return;if(!playlist.videoSources.length){try{await stopStream({streamId:scopedStreamId});playlistSignatures.current.set(scopedStreamId,signature);update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} stopped because its playlist is empty`,type:"edit"});}catch(error){workspace.setToast(error instanceof Error?error.message:"The empty live playlist could not be stopped.");}return;}try{await updateStream({streamId:scopedStreamId,ingestUrl:c.streamUrl,category:playlist.category,videoSources:playlist.videoSources,faceCategory:playlist.faceSources.length?playlist.faceCategory:undefined,faceSources:playlist.faceSources,playbackSpeed:c.playbackSpeed||1,quality:c.streamQuality||"4k",aspectRatio:c.aspectRatio||"full",facePosition:c.facePosition||"bottom-right",faceScale:(c.faceSize||25)/100,durationMinutes:(c.durationHours||1)*60,autoRestart:Boolean(c.autoRestart)});playlistSignatures.current.set(scopedStreamId,signature);workspace.setToast(`${c.title} playlist updated while live`);}catch(error){workspace.setToast(error instanceof Error?error.message:"The live playlist could not be updated.");}}));},[data.channels,data.groups,data.videos,workspace.clientId,workspace.setToast,update]);
  const groupsById=useMemo(()=>Object.fromEntries(data.groups.map(g=>[g.id,g.name])),[data.groups]);
   return <AppShell title="Live channels" workspace={workspace}><div className="page live-page"><div className="page-head"><div><p className="eyebrow">Broadcast operations / control room</p><h1>Live channels</h1><p className="subtle">Prepare your destinations, then take the room live with confidence.</p></div><div className="page-head-actions"><span className="page-live-indicator"><span className="status-dot"/>{data.channels.filter(c=>c.status==="live").length ? "Signal monitored" : "Room is ready"}</span><button className="button" onClick={()=>{setEditing(undefined);setShowForm(true)}} data-testid="button-add-channel"><Plus size={16}/> Add channel</button></div></div>
      <div className="live-overview-grid">
        <div className="live-overview-card live-overview-primary"><div className="metric-kicker">On air now</div><strong>{data.channels.filter(c=>c.status==="live").length}</strong><span>{data.channels.filter(c=>c.status==="live").length ? "Broadcasting channels" : "No active broadcast"}</span><div className="live-overview-meter"><i style={{width:`${Math.min(100, data.channels.length ? (data.channels.filter(c=>c.status==="live").length / data.channels.length) * 100 : 0)}%`}}/></div></div>
        <div className="live-overview-card"><div className="metric-kicker">Destinations</div><strong>{data.channels.length}</strong><span>{data.channels.length === 1 ? "Channel configured" : "Channels configured"}</span><Radio size={18}/></div>
        <div className="live-overview-card"><div className="metric-kicker">Playlist coverage</div><strong>{data.channels.reduce((total, channel) => total + (channel.playlistVideoIds?.length || videosForGroup(channel.groupId,data.groups,data.videos).length), 0)}</strong><span>Videos in active queues</span><FileVideo size={18}/></div>
      </div>
     <div className="card section-card"><div className="section-head"><div><h2 className="section-title">{data.channels.length} channel{data.channels.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>{data.channels.filter(c=>c.status==="live").length} currently broadcasting · {data.channels.filter(c=>c.status==="scheduled").length} scheduled</p></div><div className="status live"><span className="status-dot"/>{data.channels.filter(c=>c.status==="live").length ? "Room monitored" : "Room quiet"}</div></div>{data.channels.length===0?<EmptyState icon={<MonitorPlay size={21}/>} title="Your live room is empty" copy="Add a destination to start preparing your first broadcast." action="Add first channel" onClick={()=>setShowForm(true)}/>:<div className="table-wrap"><table className="data-table"><thead><tr><th>Channel</th><th>Platform</th><th>Status</th><th>Playlist</th><th>Live URL</th><th/></tr></thead><tbody>{data.channels.map(c=><tr key={c.id} data-testid={`row-channel-${c.id}`}><td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="thumb" style={{background:c.thumbnailColor,width:34,height:34}}><Radio size={14}/></div><div><div className="table-title">{c.title}</div><div className="table-sub">{c.status==="live" ? `Live for ${fmtTime(c.startedAt)}` : "Ready to broadcast"}</div></div></div></td><td><span className="mono" style={{fontSize:11}}>{c.platform}</span></td><td><div className={`status ${c.status}`}><span className="status-dot"/>{c.status}</div></td><td><span className="table-sub">{groupsById[c.groupId]||"Unassigned"} · {c.playlistVideoIds?.length || videosForGroup(c.groupId,data.groups,data.videos).length} video{(c.playlistVideoIds?.length || videosForGroup(c.groupId,data.groups,data.videos).length)===1?"":"s"}</span></td><td><span className="table-sub url-cell" title={c.streamUrl}>{c.streamUrl}</span></td><td><div className="actions">{c.status==="live"?<button className="button warn small" onClick={()=>stop(c)} data-testid={`button-stop-${c.id}`}><Square size={12}/> Stop</button>:<button className="button secondary small" onClick={()=>start(c)} data-testid={`button-start-${c.id}`}><Play size={12}/> Start</button>}<button className="icon-button" style={{width:30,height:30}} onClick={()=>{setEditing(c);setShowForm(true)}} title="Edit channel" data-testid={`button-edit-channel-${c.id}`}><Pencil size={13}/></button><button className="icon-button" style={{width:30,height:30}} onClick={()=>setDeleting(c)} title="Delete channel" data-testid={`button-delete-channel-${c.id}`}><Trash2 size={13}/></button></div></td></tr>)}</tbody></table></div>}</div>
    <div className="card section-card" style={{marginTop:18}}><div className="section-head"><div><h2 className="section-title">Signal checklist</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>A few calm checks before you go on air.</p></div><Clipboard size={17} color="#6c8b83"/></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>{["Live URL is saved locally","At least one destination is ready","Stream process status is monitored"].map((t)=><div key={t} style={{display:"flex",gap:9,alignItems:"center",fontSize:11,color:"#60736c",padding:11,background:"#f5f8f1",borderRadius:8}}><span style={{width:20,height:20,borderRadius:"50%",display:"grid",placeItems:"center",background:"#dcefe1",color:"#2a7a72"}}><Check size={12}/></span>{t}</div>)}</div></div>
  </div>{showForm&&<ChannelModal channel={editing} groups={data.groups} videos={data.videos} onSave={save} onClose={()=>{setShowForm(false);setEditing(undefined)}}/>}{deleting&&<ConfirmModal title="Delete this channel?" copy={`“${deleting.title}” and its stream settings will be removed from this workspace. Any live signal must be stopped first.`} onClose={()=>setDeleting(undefined)} onConfirm={()=>{update({channels:data.channels.filter(c=>c.id!==deleting.id)},{message:`${deleting.title} was deleted`,type:"edit"});setDeleting(undefined)}}/>}</AppShell>;
}

function VideoModal({video,groups,defaultGroupId="",licenseId="",licenseName="",onSave,onClose}:{video?:VideoItem;groups:VideoGroup[];defaultGroupId?:string;licenseId?:string;licenseName?:string;onSave:(v:VideoItem)=>void;onClose:()=>void}) {
  const [form,setForm]=useState({title:video?.title||"",duration:video?.duration||"",status:video?.status||"published",groupId:video?.groupId||defaultGroupId,sourceUrl:video?.sourceUrl||"",thumbnailColor:video?.thumbnailColor||colors[1]});
  const [fileName,setFileName]=useState(""); const [file,setFile]=useState<File>(); const [uploading,setUploading]=useState(false); const [uploadError,setUploadError]=useState("");
  const set=(key:string,value:string)=>setForm(f=>({...f,[key]:value}));
  const submit=async(e:FormEvent)=>{
    e.preventDefault(); if(!form.title.trim() || uploading)return;
    setUploadError("");
    let sourceUrl=form.sourceUrl; let serverSource=video?.serverSource;
    if(file){
      setUploading(true);
      try{
         const folderName=folderPathForGroup(form.groupId, groups);
         const response=await fetch("/api/media/upload",{method:"POST",headers:{"Content-Type":file.type||"application/octet-stream","X-File-Name":file.name,"X-License-Id":licenseId,"X-License-Name":licenseName,"X-Folder-Name":folderName},body:file});
        const payload=await response.json() as {sourcePath?:string;playbackUrl?:string;error?:string};
        if(!response.ok || !payload.sourcePath || !payload.playbackUrl) throw new Error(payload.error||"Video upload failed.");
         serverSource=payload.sourcePath; sourceUrl=scopedMediaPlaybackUrl(payload.playbackUrl, licenseId, licenseId);
      }catch(error){setUploadError(error instanceof Error?error.message:"Video upload failed.");setUploading(false);return;}
      setUploading(false);
    }
     onSave({id:video?.id||uid("vid"),title:form.title.trim(),duration:form.duration||"00:00",status:form.status as VideoStatus,groupId:form.groupId,sourceUrl,serverSource,thumbnailColor:form.thumbnailColor,views:video?.views||0,createdAt:video?.createdAt||now(),licenseId,licenseName,folderName:folderPathForGroup(form.groupId, groups),quality:video?.quality||"uploaded"});
  };
  return <Modal title={video?"Edit video":"Add video"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-video">Cancel</button><button className="button" type="submit" form="video-form" disabled={uploading} data-testid="button-save-video">{uploading ? "Uploading…" : video ? "Save changes" : "Add video"} {!uploading&&<Check size={14}/>}</button></>}><form id="video-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>{video?"Replace video file (optional)":"Choose video file"}</label><input autoFocus required={!form.sourceUrl} type="file" accept="video/*" onChange={e=>{const next=e.target.files?.[0];if(!next)return;setFile(next);setFileName(next.name);setForm(f=>({...f,title:f.title||next.name.replace(/\.[^.]+$/,""),sourceUrl:URL.createObjectURL(next)}))}} data-testid="input-video-file"/>{fileName&&<span className="file-picked"><Check size={13}/> {fileName} · server-ready upload</span>}{uploadError&&<div className="error-note">{uploadError}</div>}</div><div className="field full"><label>Video title</label><input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Title for this video" data-testid="input-video-title"/></div><div className="field"><label>Video category</label><select required value={form.groupId} onChange={e=>set("groupId",e.target.value)}><option value="">Select a folder</option>{groups.filter((group) => isVideoDestinationFolder(group.id, groups) || group.id === video?.groupId).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id, groups)}</option>)}</select></div><div className="field"><label>Duration</label><input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="24:18" data-testid="input-video-duration"/></div></div><div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Included animations are read-only for license users. Add personal videos to My Animations or any folder inside it.</div></form></Modal>;
}

function TrimModal({video,licenseId="",licenseName="",folderName="",onCreate,onClose}:{video:VideoItem;licenseId?:string;licenseName?:string;folderName?:string;onCreate:(clip:VideoItem)=>void;onClose:()=>void}) {
  const fileId = getMediaFileId(video);
  const previewUrl = video.sourceUrl || (fileId ? `/api/media/files/${fileId}` : "");
  const initialDuration = parseDurationSeconds(video.duration);
  const [duration,setDuration] = useState(initialDuration);
  const [start,setStart] = useState(formatTimecode(0));
  const [end,setEnd] = useState(formatTimecode(initialDuration));
  const [title,setTitle] = useState(`${video.title} · clip`);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const loadMetadata=(event:SyntheticEvent<HTMLVideoElement>)=>{
    const nextDuration=event.currentTarget.duration;
    if(!Number.isFinite(nextDuration)||nextDuration<=0)return;
    setDuration(nextDuration);
    setEnd(current=>{
      const currentSeconds=parseDurationSeconds(current);
      return currentSeconds>0&&currentSeconds<=nextDuration?current:formatTimecode(nextDuration);
    });
  };
  const submit=async(event:FormEvent)=>{
    event.preventDefault();
    const startSeconds=parseDurationSeconds(start);
    const endSeconds=parseDurationSeconds(end);
    if(!fileId){setError("This video is not available on the server for trimming.");return;}
    if(!Number.isFinite(startSeconds)||!Number.isFinite(endSeconds)||startSeconds<0||endSeconds<=startSeconds||endSeconds>duration){setError("Use a valid timecode and keep the end time after the start time.");return;}
    setBusy(true);setError("");
    try{
       const result=await trimMediaFile(fileId,{startSeconds,endSeconds},{
         headers:{
           "X-License-Id":licenseId,
           "X-License-Name":licenseName,
           "X-Folder-Name":folderName,
           "X-Quality":video.quality||"clip",
           "X-Replace-File-Id":fileId,
           "X-Clip-Title":title.trim()||`${video.title} · clip`,
         },
       });
        onCreate({id:uid("vid"),title:title.trim()||`${video.title} · clip`,duration:result.duration,status:"published",groupId:video.groupId,sourceUrl:scopedMediaPlaybackUrl(result.playbackUrl, licenseId, licenseId),serverSource:result.sourcePath,thumbnailColor:video.thumbnailColor,views:0,createdAt:now(),licenseId,licenseName,folderName,quality:video.quality});
    }catch(reason){setError(reason instanceof Error?reason.message:"The clip could not be created.");}
    finally{setBusy(false);}
  };
  return <Modal title="Trim a video clip" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={busy} data-testid="button-cancel-trim">Cancel</button><button className="button" type="submit" form="trim-form" disabled={busy||!fileId} data-testid="button-create-trim">{busy?"Creating clip…":"Create clip"} <Scissors size={14}/></button></>}><form id="trim-form" onSubmit={submit}>
    {previewUrl?<video controls preload="metadata" src={previewUrl} onLoadedMetadata={loadMetadata} style={{width:"100%",maxHeight:260,borderRadius:10,background:"#102e31",display:"block",marginBottom:16}}/>:<div className="error-note">This video has no server playback file available.</div>}
    <div className="form-grid">
       <div className="field"><label>Start time · HH:MM:SS</label><input inputMode="decimal" value={start} onChange={e=>setStart(e.target.value)} placeholder="00:00:00.000" data-testid="input-trim-start"/></div>
       <div className="field"><label>End time · HH:MM:SS</label><input inputMode="decimal" value={end} onChange={e=>setEnd(e.target.value)} placeholder="01:02:03.000" data-testid="input-trim-end"/></div>
      <div className="field full"><label>Clip title</label><input required value={title} onChange={e=>setTitle(e.target.value)} data-testid="input-trim-title"/></div>
    </div>
      <div className="form-note"><Scissors size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Use HH:MM:SS or MM:SS; milliseconds are optional. Save karne par original video replace hokar selected part hi rahega; stream quality preserve karne ke liye lossless copy prefer hoti hai. {duration>0&&<span>Source length: {formatTimecode(duration)}.</span>}</div>
    {error&&<div className="error-note">{error}</div>}
  </form></Modal>;
}

function YoutubeDownloadModal({groups,defaultGroupId="",licenseId="",licenseName="",onSaveMany,onClose}:{groups:VideoGroup[];defaultGroupId?:string;licenseId?:string;licenseName?:string;onSaveMany:(input:VideoItem[] | StartYoutubeDownloadsInput)=>void;onClose:()=>void}) {
  const [urls,setUrls]=useState(""); const [groupId,setGroupId]=useState(defaultGroupId); const [quality,setQuality]=useState<DownloadQuality>("best"); const [availableQualities,setAvailableQualities]=useState<string[]>(["best","1080p","720p","480p","360p"]); const [checkingQuality,setCheckingQuality]=useState(false);
  const [channelUrl,setChannelUrl]=useState(""); const [linkLimit,setLinkLimit]=useState<"all"|"5"|"10">("all"); const [extracting,setExtracting]=useState(false); const [downloading,setDownloading]=useState(false); const [progress,setProgress]=useState(0); const [error,setError]=useState(""); const [extractedCount,setExtractedCount]=useState(0);
  const entries=urls.split(/\r?\n|,/).map(value=>value.trim()).filter(Boolean);
  const folderName=folderPathForGroup(groupId, groups);
  const checkQuality=async()=>{
    if(!entries[0]||checkingQuality||downloading)return;
    setCheckingQuality(true);setError("");
    try{
      const result=await apiJson<{qualities:string[];title:string}>("/api/media/youtube-formats",{method:"POST",body:JSON.stringify({url:entries[0]})});
      setAvailableQualities(result.qualities.length?result.qualities:["best"]);
      setQuality(current=>result.qualities.includes(current)?current:"best");
    }catch(reason){setError(reason instanceof Error?reason.message:"Quality options could not be loaded.");}
    finally{setCheckingQuality(false);}
  };
  const extractChannel=async()=>{
    if(!channelUrl.trim()||extracting||downloading)return;
    setExtracting(true);setError("");setExtractedCount(0);
    try{
      const result=await extractYoutubeChannelLinks({url:channelUrl.trim()});
      const existing=new Set(entries);
      const available=result.links.filter(link=>!existing.has(link));
      const fresh=linkLimit==="all"?available:available.slice(0,Number(linkLimit));
      setUrls(current=>[current.trim(),...fresh].filter(Boolean).join("\n"));
      setExtractedCount(fresh.length);
      if(!fresh.length)setError("Those channel videos are already in the queue.");
    }catch(reason){setError(reason instanceof Error?reason.message:"Channel links could not be extracted.");}
    finally{setExtracting(false);}
  };
  const submit=(e:FormEvent)=>{
    e.preventDefault();
    if(!entries.length||!groupId||downloading||extracting||checkingQuality)return;
    onSaveMany({ entries, quality, groupId, licenseId, licenseName, folderName });
    onClose();
  };
    return <Modal title="YouTube bulk downloader" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={downloading||extracting||checkingQuality} data-testid="button-cancel-youtube-download">Close</button><button className="button" type="submit" form="youtube-download-form" disabled={downloading||extracting||checkingQuality||!entries.length} data-testid="button-start-youtube-download">Start background download <Download size={14}/></button></>}><form id="youtube-download-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>Auto-fill from YouTube channel</label><div className="input-action-row"><input value={channelUrl} onChange={e=>setChannelUrl(e.target.value)} placeholder="https://www.youtube.com/@channel" data-testid="input-youtube-channel-url"/><button type="button" className="button secondary small" onClick={extractChannel} disabled={extracting||downloading||!channelUrl.trim()} data-testid="button-extract-channel-links">{extracting?"Extracting…":"Extract links"} {!extracting&&<Link2 size={13}/>}</button></div><span className="field-hint">Enter a public channel URL, choose how many links to add, then extract them.</span></div><div className="field"><label>Links to add</label><select value={linkLimit} onChange={e=>setLinkLimit(e.target.value as "all"|"5"|"10")} disabled={extracting||downloading} data-testid="select-youtube-link-limit"><option value="all">All links</option><option value="5">First 5 links</option><option value="10">First 10 links</option></select></div><div className="field"><label>Save in folder</label><select required value={groupId} onChange={e=>setGroupId(e.target.value)} disabled={downloading} data-testid="select-youtube-group"><option value="">Select a folder</option>{groups.filter((group) => isVideoDestinationFolder(group.id, groups)).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id, groups)}</option>)}</select></div><div className="field"><label>Download quality</label><select value={quality} onChange={e=>setQuality(e.target.value as DownloadQuality)} disabled={checkingQuality||downloading} data-testid="select-youtube-quality">{availableQualities.map(item=><option value={item} key={item}>{item==="best"?"Best available":item}</option>)}</select><span className="field-hint">Choose quality for every queued video.</span></div><div className="field"><label>Check this link's qualities</label><button type="button" className="button secondary small" onClick={checkQuality} disabled={checkingQuality||downloading||!entries.length} data-testid="button-check-youtube-quality">{checkingQuality?"Checking…":"Show available quality"} <Gauge size={13}/></button></div><div className="field full"><label>Video links queue</label><textarea autoFocus required value={urls} onChange={e=>setUrls(e.target.value)} placeholder={"Paste one URL per line\nhttps://www.youtube.com/watch?v=…\nhttps://youtu.be/…"} rows={6} data-testid="input-youtube-urls"/><span className="field-hint">{extractedCount ? `${extractedCount} new link${extractedCount===1?"":"s"} added to the queue.` : entries.length ? `${entries.length} URL${entries.length===1?"":"s"} queued · 2 downloads at a time, saved in your pasted order.` : "Paste multiple links manually, or auto-fill them from a channel above."}</span></div></div>{error&&<div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><Download size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Dialog submit karte hi close ho jayega. Download background mein chalega and status library ke top par dikhega.</div></form></Modal>;
}

function BulkUploadModal({groups,defaultGroupId="",licenseId="",licenseName="",onSaveMany,onClose}:{groups:VideoGroup[];defaultGroupId?:string;licenseId?:string;licenseName?:string;onSaveMany:(videos:VideoItem[])=>void;onClose:()=>void}) {
  const inputRef=useRef<HTMLInputElement>(null);
  const [files,setFiles]=useState<File[]>([]); const [groupId,setGroupId]=useState(defaultGroupId);
  const [uploading,setUploading]=useState(false); const [progress,setProgress]=useState(0); const [error,setError]=useState("");
  useEffect(()=>{inputRef.current?.setAttribute("webkitdirectory","");inputRef.current?.setAttribute("directory","");},[]);
  const chooseFiles=(list:FileList|null)=>{
    const selected=Array.from(list||[]).filter(file=>file.type.startsWith("video/")||/\.(mp4|mov|m4v|webm|mkv|avi|ts)$/i.test(file.name)).sort((a,b)=>(a.webkitRelativePath||a.name).localeCompare(b.webkitRelativePath||b.name,undefined,{numeric:true,sensitivity:"base"}));
    setFiles(selected);setError(selected.length?"": "Choose a folder containing video files.");
  };
  const submit=async(e:FormEvent)=>{
    e.preventDefault();
    if(!files.length||!groupId||uploading)return;
    setUploading(true);setError("");setProgress(0);
    const videos:VideoItem[]=[];const failures:string[]=[];
    for(let index=0;index<files.length;index+=1){
      const file=files[index];
      try{
         const folderName=folderPathForGroup(groupId, groups);
         const response=await fetch("/api/media/upload",{method:"POST",headers:{"Content-Type":file.type||"application/octet-stream","X-File-Name":file.name,"X-License-Id":licenseId,"X-License-Name":licenseName,"X-Folder-Name":folderName},body:file});
        const payload=await response.json() as {sourcePath?:string;playbackUrl?:string;error?:string};
        if(!response.ok||!payload.sourcePath||!payload.playbackUrl)throw new Error(payload.error||"Upload failed.");
          videos.push({id:uid("vid"),title:file.name.replace(/\.[^.]+$/,""),duration:"00:00",status:"published",groupId,sourceUrl:scopedMediaPlaybackUrl(payload.playbackUrl, licenseId, licenseId),serverSource:payload.sourcePath,thumbnailColor:colors[index%colors.length],views:0,createdAt:now(),licenseId,licenseName,folderName:folderPathForGroup(groupId, groups),quality:"uploaded"});
      }catch(reason){failures.push(`${index+1}. ${file.name}: ${reason instanceof Error?reason.message:"Upload failed."}`);}
      setProgress(index+1);
    }
    if(videos.length)onSaveMany(videos);
    setUploading(false);
    setError(failures.length?`${videos.length} uploaded, ${failures.length} failed.\n${failures.join("\n")}`:`${videos.length} video${videos.length===1?"":"s"} uploaded and added in folder order.`);
  };
    return <Modal title="Add a video folder" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-folder-upload">Close</button><button className="button" type="submit" form="folder-upload-form" disabled={uploading||!files.length} data-testid="button-start-folder-upload">{uploading?`Uploading ${progress}/${files.length}…`:"Upload folder"} {!uploading&&<Upload size={14}/>}</button></>}><form id="folder-upload-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>Choose a folder</label><input ref={inputRef} autoFocus type="file" multiple accept="video/*" onChange={e=>chooseFiles(e.target.files)} data-testid="input-video-folder"/><span className="field-hint">{files.length?`${files.length} video${files.length===1?"":"s"} selected · browser folder order will be used.`:"Select a folder with videos 1, 2, 3…10."}</span></div><div className="field full"><label>Save in folder</label><select required value={groupId} onChange={e=>setGroupId(e.target.value)} data-testid="select-folder-group"><option value="">Select a folder</option>{groups.filter((group) => isVideoDestinationFolder(group.id, groups)).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id, groups)}</option>)}</select></div></div>{error&&<div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Videos are uploaded one by one and appended to the selected folder. Included animations stay shared and cannot be changed from a license workspace.</div></form></Modal>;
}

function GroupModal({group,groups,defaultParentId="",onSave,onClose}:{group?:VideoGroup;groups:VideoGroup[];defaultParentId?:string;onSave:(g:VideoGroup)=>void;onClose:()=>void}) {
  const [name,setName]=useState(group?.name||"");
  const [description,setDescription]=useState(group?.description||"");
  const [parentId,setParentId]=useState(group?.parentId||defaultParentId);
  const descendants = new Set<string>();
  const visitChildren = (id: string) => {
    for (const child of groups.filter((item) => item.parentId === id)) {
      if (descendants.has(child.id)) continue;
      descendants.add(child.id);
      visitChildren(child.id);
    }
  };
  if (group) visitChildren(group.id);
  const parentOptions = groups.filter((item) =>
    item.id !== group?.id
    && !descendants.has(item.id)
    && !isIncludedFolder(item.id, groups)
  );
  const submit = () => {
    if (!name.trim()) return;
    const reservedName = name.trim().toLowerCase();
    if (
      (reservedName === "included animations" || reservedName === "my animations")
      && parentId !== youtubeAnimationFolderId
    ) return;
    onSave({
      id: group?.id || uid("grp"),
      name: name.trim(),
      description,
      videoIds: group?.videoIds || [],
      createdAt: group?.createdAt || now(),
      parentId: parentId || undefined,
    });
  };
  return <Modal title={group?"Edit folder":"New folder"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} data-testid="button-cancel-group">Cancel</button><button className="button" onClick={submit} data-testid="button-save-group">Save folder <Check size={14}/></button></>}><div className="form-grid"><div className="field full"><label>Folder name</label><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="My new folder" data-testid="input-group-name"/></div><div className="field full"><label>Inside folder <span className="label-optional">optional</span></label><select value={parentId} onChange={e=>setParentId(e.target.value)} data-testid="select-group-parent"><option value="">Top level folder</option>{parentOptions.map((item)=><option key={item.id} value={item.id}>{folderPathForGroup(item.id, groups)}</option>)}</select><span className="field-hint">You can nest folders at any depth. Included Animations is managed by the owner.</span></div><div className="field full"><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What belongs in this folder?" data-testid="input-group-description"/></div></div></Modal>;
}

function VideosPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data,update}=workspace;
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("all"); const [group,setGroup]=useState("all");
  const [tab,setTab]=useState<"library"|"groups">("groups"); const [videoModal,setVideoModal]=useState(false); const [youtubeModal,setYoutubeModal]=useState(false); const [folderModal,setFolderModal]=useState(false);
  const [videoGroupId,setVideoGroupId]=useState(""); const [groupModal,setGroupModal]=useState(false); const [newGroupParentId,setNewGroupParentId]=useState("");
   const [editingGroup,setEditingGroup]=useState<VideoGroup|undefined>(); const [editingVideo,setEditingVideo]=useState<VideoItem|undefined>(); const [trimVideo,setTrimVideo]=useState<VideoItem|undefined>(); const [deleting,setDeleting]=useState<{kind:"video"|"group";id:string;name:string}|undefined>(); const [deletingAll,setDeletingAll]=useState(false);
    const filtered=useMemo(()=>data.videos.filter(v=>!isIncludedVideo(v)&&(!search||v.title.toLowerCase().includes(search.toLowerCase()))&&(status==="all"||v.status===status)&&(group==="all"||isVideoInFolderScope(v,group,data.groups))),[data.videos,data.groups,search,status,group]);
  const openAddVideo=(groupId="")=>{setVideoGroupId(isVideoDestinationFolder(groupId, data.groups) ? groupId : myAnimationFolderId);setVideoModal(true);};
  const openGroup=(groupId:string)=>{if(isYoutubeAnimationRoot(groupId,data.groups))return;setGroup(groupId);setTab("library");};
    const saveVideos=(items:VideoItem[]|StartYoutubeDownloadsInput)=>{if(!Array.isArray(items)){workspace.startYoutubeDownloads(items);return;}if(!items.length)return;const byId=new Map(data.videos.map(video=>[video.id,video]));for(const item of items)byId.set(item.id,item);const videos=Array.from(byId.values());const groups=rebuildGroupMembership(data.groups,videos);update({videos,groups},{message:items.length===1?`${items[0].title} was added to the library`:`${items.length} videos were added in playlist order`,type:"video"});};
  const saveVideo=(v:VideoItem)=>{saveVideos([v]);setVideoModal(false);setVideoGroupId("");setEditingVideo(undefined);};
  const openEditVideo=(video:VideoItem)=>{setEditingVideo(video);setVideoGroupId(video.groupId);setVideoModal(true);};
   const saveGroup=(g:VideoGroup)=>{const exists=data.groups.some(x=>x.id===g.id);update({groups:exists?data.groups.map(x=>x.id===g.id?g:x):[...data.groups,g]},{message:exists?`${g.name} was updated`:`${g.name} was created`,type:"group"});setGroupModal(false);setEditingGroup(undefined);setNewGroupParentId("");};
    const remove=async()=>{if(!deleting)return;try{if(deleting.kind==="video"){const video=data.videos.find(item=>item.id===deleting.id);if(isIncludedVideo(video)){setDeleting(undefined);return;}const fileId=getMediaFileId(video);if(fileId)await apiJson(`/api/media/files/${encodeURIComponent(fileId)}?licenseId=${encodeURIComponent(workspace.licenseId)}`,{method:"DELETE"});update({videos:data.videos.filter(v=>v.id!==deleting.id),groups:data.groups.map(g=>({...g,videoIds:g.videoIds.filter(id=>id!==deleting.id)}))},{message:`${deleting.name} and its stored file were deleted`,type:"video"});}else{const target=data.groups.find((item)=>item.id===deleting.id);if(!target||isBuiltInYoutubeFolder(target)){setDeleting(undefined);return;}const removedGroupIds=new Set<string>([deleting.id]);let changed=true;while(changed){changed=false;for(const item of data.groups){if(item.parentId&&removedGroupIds.has(item.parentId)&&!removedGroupIds.has(item.id)){removedGroupIds.add(item.id);changed=true;}}}const groupVideos=data.videos.filter((video)=>removedGroupIds.has(video.groupId));const fileIds=groupVideos.map(getMediaFileId).filter((id):id is string=>Boolean(id));await Promise.all([...new Set(groupVideos.map((video)=>folderPathForGroup(video.groupId,data.groups)))].map((folderName)=>apiJson(`/api/media/files?licenseId=${encodeURIComponent(workspace.licenseId)}&folderName=${encodeURIComponent(folderName)}`,{method:"DELETE"}).catch(()=>undefined)));await Promise.all(fileIds.map(fileId=>apiJson(`/api/media/files/${encodeURIComponent(fileId)}?licenseId=${encodeURIComponent(workspace.licenseId)}`,{method:"DELETE"}).catch(()=>undefined)));update({groups:data.groups.filter(g=>!removedGroupIds.has(g.id)),videos:data.videos.filter(v=>!removedGroupIds.has(v.groupId))},{message:`${deleting.name} and its nested folders were deleted`,type:"group"});if(removedGroupIds.has(group))setGroup("all");}setDeleting(undefined);}catch(reason){workspace.setToast(reason instanceof Error?reason.message:"The video files could not be deleted.");}};
    const removeAll=async()=>{if(!workspace.licenseId)return;try{await apiJson(`/api/media/files?licenseId=${encodeURIComponent(workspace.licenseId)}`,{method:"DELETE"});const includedVideos=data.videos.filter((video)=>isIncludedVideo(video));update({videos:includedVideos,groups:rebuildGroupMembership(data.groups,includedVideos)},{message:"All personal videos and stored files were deleted from this license workspace",type:"video"});setDeletingAll(false);}catch(reason){workspace.setToast(reason instanceof Error?reason.message:"All workspace videos could not be deleted.");}};
    const library=<div className="card section-card"><div className="section-head"><div><h2 className="section-title">{filtered.length} personal video{filtered.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>{search||status!=="all"||group!=="all"?"Filtered personal library":"Your private server media index · shared YouTube animations are available in Video editor"}</p></div></div>{filtered.length===0?<EmptyState icon={<Search size={21}/>} title="No personal videos found" copy="Add a personal video or open Video editor to use shared YouTube animations." action="Add video" onClick={()=>openAddVideo(group!=="all"?group:"")}/>:<div className="table-wrap"><table className="data-table"><thead><tr><th>Video</th><th>Status</th><th>Category</th><th>Quality</th><th>Source</th><th/></tr></thead><tbody>{filtered.map(v=><tr key={v.id} data-testid={`row-video-${v.id}`}><td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="thumb" style={{background:v.thumbnailColor,width:52,height:34}}><Video size={14}/><span style={{fontSize:9,marginLeft:-3}}>{v.duration}</span></div><div><div className="table-title">{v.title}</div><div className="table-sub">Added {new Date(v.createdAt).toLocaleDateString()}{v.licenseName?` · ${v.licenseName}`:""}</div></div></div></td><td><span className={`status ${v.status==="published"?"live":v.status==="draft"?"scheduled":"stopped"}`}><span className="status-dot"/>{v.status}</span></td><td><span className="table-sub">{folderPathForGroup(v.groupId,data.groups)||v.folderName||"Unassigned"}</span></td><td><span className="table-sub">{v.quality&&v.quality!=="best"?v.quality:v.quality==="best"?"Best":"—"}</span></td><td>{v.sourceUrl?<a href={v.sourceUrl} target="_blank" rel="noreferrer" className="section-link" data-testid={`link-source-${v.id}`}><Link2 size={12} style={{verticalAlign:"-2px"}}/> {v.serverSource?"Server-ready":"Preview only"}</a>:<span className="table-sub">Not attached</span>}</td><td><div className="actions">{v.serverSource&&<button className="icon-button" style={{width:30,height:30}} onClick={()=>setTrimVideo(v)} title="Trim clip" data-testid={`button-trim-video-${v.id}`}><Scissors size={13}/></button>}<><button className="icon-button" style={{width:30,height:30}} onClick={()=>openEditVideo(v)} title="Edit video" data-testid={`button-edit-video-${v.id}`}><Pencil size={13}/></button><button className="icon-button" style={{width:30,height:30}} onClick={()=>setDeleting({kind:"video",id:v.id,name:v.title})} title="Delete video" data-testid={`button-delete-video-${v.id}`}><Trash2 size={13}/></button></></div></td></tr>)}</tbody></table></div>}</div>;
    const openNewGroup=(parentId="")=>{setEditingGroup(undefined);setNewGroupParentId(isIncludedFolder(parentId,data.groups)? "":parentId);setGroupModal(true);};
    const renderGroupCard=(g:VideoGroup):ReactNode=>{
      const children=data.groups.filter((child)=>child.parentId===g.id);
      const isRoot=isYoutubeAnimationRoot(g.id,data.groups);
      const canAddChild=!isIncludedFolder(g.id,data.groups);
      const canAddVideo=isVideoDestinationFolder(g.id,data.groups);
      const openLabel=isRoot?"Choose Included Animations or My Animations":g.id===includedAnimationFolderId?"Admin managed · shared with every license":g.id===myAnimationFolderId?"Private to this license":"Open folder";
       return <div className="folder-tree-node" key={g.id}><div className={`card group-card ${children.length ? "group-card-parent" : ""}`} data-testid={`card-group-${g.id}`}><button className={`group-open ${isRoot ? "group-open-static" : ""}`} disabled={isRoot} onClick={()=>openGroup(g.id)} data-testid={`button-open-group-${g.id}`}><h3>{g.name}</h3><p>{g.description||"No description yet."}</p><span className="group-open-label">{openLabel} {!isRoot&&<ArrowRight size={12}/>}</span></button><div className="group-foot"><span>{g.videoIds.length} video{g.videoIds.length===1?"":"s"}</span><div className="group-actions">{canAddVideo&&<button onClick={()=>openAddVideo(g.id)} className="section-link" data-testid={`button-add-video-${g.id}`}>Add video</button>}{canAddChild&&<button onClick={()=>openNewGroup(g.id)} className="section-link" data-testid={`button-add-subfolder-${g.id}`}>Add folder inside</button>}{!isBuiltInYoutubeFolder(g)&&<button onClick={()=>setDeleting({kind:"group",id:g.id,name:g.name})} className="section-link" style={{color:"#a05b45"}} data-testid={`button-delete-group-${g.id}`}>Delete</button>}</div></div>{children.length>0&&<div className="folder-tree-children"><span className="folder-tree-label">Inside {g.name}</span>{children.filter((child)=>!isIncludedFolder(child.id,data.groups)).map(renderGroupCard)}</div>}</div></div>;
    };
     const personalGroups = data.groups.filter((item) => !isYoutubeAnimationRoot(item.id, data.groups) && !isIncludedFolder(item.id, data.groups));
     const groups=<div>{personalGroups.length===0?<div className="card"><EmptyState icon={<FolderOpen size={21}/>} title="No personal categories yet" copy="Create a category to organize your personal videos. Shared YouTube animations are available inside Video editor." action="Create category" onClick={()=>openNewGroup()}/></div>:<div className="group-tree">{personalGroups.filter((item)=>!item.parentId).map(renderGroupCard)}</div>}</div>;
          return <AppShell title="Video library" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Archive & distribution</p><h1>Video library</h1><p className="subtle">Personal videos live here. Shared YouTube animations are available only inside Video editor.</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}><Link className="button secondary" href="/editor" data-testid="link-open-video-editor"><Wand2 size={15}/> Video editor</Link>{tab==="groups"&&<button className="button secondary" onClick={()=>openNewGroup()} data-testid="button-add-group"><Plus size={15}/> New category</button>}{tab==="library"&&<button className="button danger" onClick={()=>setDeletingAll(true)} disabled={!data.videos.some((video)=>!isIncludedVideo(video))} data-testid="button-delete-all-videos"><Trash2 size={15}/> Delete personal videos</button>}<button className="button secondary" onClick={()=>setFolderModal(true)} data-testid="button-folder-upload"><FolderOpen size={15}/> Add folder</button><button className="button secondary" onClick={()=>setYoutubeModal(true)} data-testid="button-youtube-downloader"><Download size={15}/> Bulk YouTube download</button><button className="button" onClick={()=>openAddVideo(group!=="all"?group:myAnimationFolderId)} data-testid="button-add-video"><Plus size={15}/> Add video</button></div></div><div className="toolbar"><div className="filter-row"><button className={`button small ${tab==="library"?"":"ghost"}`} onClick={()=>setTab("library")} data-testid="button-tab-library"><FileVideo size={13}/> Videos</button><button className={`button small ${tab==="groups"?"":"ghost"}`} onClick={()=>setTab("groups")} data-testid="button-tab-groups"><FolderOpen size={13}/> Folders</button></div>{tab==="library"&&<div className="filter-row"><div className="input-wrap"><Search size={14}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search personal videos…" data-testid="input-search-videos"/></div><select value={status} onChange={e=>setStatus(e.target.value)} data-testid="select-filter-status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select><select value={group} onChange={e=>setGroup(e.target.value)} data-testid="select-filter-group"><option value="all">All personal folders</option>{data.groups.filter((item)=>!isIncludedFolder(item.id,data.groups)).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id,data.groups)}</option>)}</select></div>}</div>{tab==="library"?library:groups}</div>{videoModal&&<VideoModal video={editingVideo} groups={data.groups} defaultGroupId={videoGroupId} licenseId={workspace.licenseId} licenseName={workspace.user} onSave={saveVideo} onClose={()=>{setVideoModal(false);setVideoGroupId("");setEditingVideo(undefined)}}/>}{trimVideo&&<TrimModal video={trimVideo} licenseId={workspace.licenseId} licenseName={workspace.user} folderName={folderPathForGroup(trimVideo.groupId,data.groups)||trimVideo.folderName||""} onCreate={clip=>{const videos=data.videos.filter(video=>video.id!==trimVideo.id);update({videos:[...videos,clip],groups:rebuildGroupMembership(data.groups,[...videos,clip])},{message:`${trimVideo.title} was replaced by ${clip.title}`,type:"video"});setTrimVideo(undefined)}} onClose={()=>setTrimVideo(undefined)}/>} {youtubeModal&&<YoutubeDownloadModal groups={data.groups} defaultGroupId={group!=="all"&&isVideoDestinationFolder(group,data.groups)?group:myAnimationFolderId} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setYoutubeModal(false)}/>} {folderModal&&<BulkUploadModal groups={data.groups} defaultGroupId={group!=="all"&&isVideoDestinationFolder(group,data.groups)?group:myAnimationFolderId} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setFolderModal(false)}/>} {groupModal&&<GroupModal group={editingGroup} groups={data.groups} defaultParentId={newGroupParentId} onSave={saveGroup} onClose={()=>{setGroupModal(false);setEditingGroup(undefined);setNewGroupParentId("")}}/>}{deleting&&<ConfirmModal title={`Delete this ${deleting.kind}?`} copy={`“${deleting.name}” will be removed from the ${deleting.kind==="video"?"library and its stored file":"workspace along with every video inside it"}. This cannot be undone.`} onClose={()=>setDeleting(undefined)} onConfirm={()=>void remove()}/>} {deletingAll&&<ConfirmModal title="Delete personal videos?" copy="Every stored video file for this license will be deleted. Included Animations will stay available to everyone." onClose={()=>setDeletingAll(false)} onConfirm={()=>void removeAll()}/>}</AppShell>;
}

function VideoEditorPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data, update, setToast} = workspace;
  const [groupId, setGroupId] = useState("");
  const [editorLibrary, setEditorLibrary] = useState<"personal" | "youtube">("personal");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loopCount, setLoopCount] = useState("1");
  const [title, setTitle] = useState("");
  const [outputAspectRatio, setOutputAspectRatio] = useState<AspectRatio>("full");
  const [logoPosition, setLogoPosition] = useState("bottom-right");
  const [overlayScale, setOverlayScale] = useState("25");
  const [webcamPosition, setWebcamPosition] = useState("top-right");
  const [webcamScale, setWebcamScale] = useState("25");
  const [mainTransform, setMainTransform] = useState<EditorTransform>({ x: 0, y: 0, scale: 1 });
  const [webcamTransform, setWebcamTransform] = useState<EditorTransform>({ x: 0, y: 0, scale: 0.25 });
  const [selectedLayer, setSelectedLayer] = useState<EditorLayer>("main");
  const [animationPreset, setAnimationPreset] = useState<AnimationPreset>("none");
  const [reverseVideo, setReverseVideo] = useState(false);
  const [colorAdjustments, setColorAdjustments] = useState<EditorColorAdjustments>({ brightness: 0, contrast: 1, saturation: 1, hue: 0 });
  const [chromaKeyEnabled, setChromaKeyEnabled] = useState(false);
  const [chromaKeyColor, setChromaKeyColor] = useState("#00ff00");
  const [chromaSimilarity, setChromaSimilarity] = useState(0.32);
  const [chromaBlend, setChromaBlend] = useState(0.08);
  const [webcamId, setWebcamId] = useState("");
  const [logoId, setLogoId] = useState("");
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const selectedGroup = data.groups.find((group) => group.id === groupId);
  const editorGroups = useMemo(
    () => data.groups.filter((group) => editorLibrary === "youtube"
      ? isIncludedFolder(group.id, data.groups)
      : !isYoutubeAnimationRoot(group.id, data.groups) && !isIncludedFolder(group.id, data.groups)),
    [data.groups, editorLibrary],
  );
  const groupVideos = useMemo(
    () => selectedGroup ? videosForFolderScope(selectedGroup.id, data.groups, data.videos).filter((video) => video.serverSource) : [],
    [selectedGroup, data.groups, data.videos],
  );
  const selectedVideos = selectedIds.map((id) => groupVideos.find((video) => video.id === id)).filter((video): video is VideoItem => Boolean(video));
  const logo = data.editorAssets.find((asset) => asset.id === logoId);
  const webcam = data.videos.find((video) => video.id === webcamId);
  const previewVideo = selectedVideos[0];
  const previewUrl = previewVideo?.sourceUrl || (previewVideo ? `/api/media/files/${getMediaFileId(previewVideo)}` : "");
  const editorCanvasProps = {
    previewUrl,
    webcamUrl: webcam?.sourceUrl || (webcam ? `/api/media/files/${getMediaFileId(webcam)}` : ""),
    logo,
    logoPosition,
    outputAspectRatio,
    mainTransform,
    webcamTransform,
    selectedLayer,
    animationPreset,
    reverseVideo,
    colorAdjustments,
    chromaKeyEnabled,
    chromaKeyColor,
    chromaSimilarity,
    chromaBlend,
    onSelectLayer: setSelectedLayer,
    onMainTransformChange: setMainTransform,
    onWebcamTransformChange: setWebcamTransform,
  };
  const setGroup = (nextGroupId: string) => {
    setGroupId(nextGroupId);
    const nextVideos = videosForFolderScope(nextGroupId, data.groups, data.videos).filter((video) => video.serverSource);
    setSelectedIds(nextVideos.map((video) => video.id));
    const nextGroup = data.groups.find((group) => group.id === nextGroupId);
    setTitle(nextGroup ? `${nextGroup.name} · edited` : "");
    setWebcamId("");
  };
  const chooseEditorLibrary = (nextLibrary: "personal" | "youtube") => {
    setEditorLibrary(nextLibrary);
    setGroupId("");
    setSelectedIds([]);
    setTitle("");
    setWebcamId("");
    setReverseVideo(false);
    setColorAdjustments({ brightness: 0, contrast: 1, saturation: 1, hue: 0 });
    setChromaKeyEnabled(false);
  };
  const toggleVideo = (videoId: string) => {
    setSelectedIds((current) => current.includes(videoId) ? current.filter((id) => id !== videoId) : [...current, videoId]);
  };
  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);
    setError("");
    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": file.name,
          "X-License-Id": workspace.licenseId,
          "X-License-Name": workspace.user,
          "X-Folder-Name": "__editor-assets",
          "X-Media-Title": file.name.replace(/\.[^.]+$/, ""),
          "X-Quality": "logo",
        },
        body: file,
      });
      const payload = await response.json() as { fileId?: string; sourcePath?: string; playbackUrl?: string; error?: string };
      if (!response.ok || !payload.fileId || !payload.sourcePath || !payload.playbackUrl) throw new Error(payload.error || "Logo upload failed.");
      const asset: EditorAsset = {
        id: uid("logo"),
        fileId: payload.fileId,
        title: file.name.replace(/\.[^.]+$/, ""),
        playbackUrl: scopedMediaPlaybackUrl(payload.playbackUrl, workspace.licenseId, workspace.licenseId),
        sourcePath: payload.sourcePath,
        kind: "logo",
        createdAt: now(),
      };
      update({ editorAssets: [...data.editorAssets, asset] }, { message: `${asset.title} is ready as a watermark`, type: "edit" });
      setLogoId(asset.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };
  const compose = async (event: FormEvent) => {
    event.preventDefault();
    if (!groupId || selectedVideos.length === 0 || busy) {
      setError("Choose a category and at least one server-ready video.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await apiJson<{ fileId: string; sourcePath: string; playbackUrl: string; duration: string }>("/api/media/compose", {
        method: "POST",
        headers: {
          "X-License-Id": workspace.licenseId,
          "X-License-Name": workspace.user,
           "X-Folder-Name": folderPathForGroup(selectedGroup?.id, data.groups),
        },
        body: JSON.stringify({
          fileIds: selectedVideos.map((video) => getMediaFileId(video)).filter((id): id is string => Boolean(id)),
          title: title.trim() || `${selectedGroup?.name || "Library"} · edited`,
          loopCount: Number(loopCount),
          logoFileId: logo?.fileId,
          webcamFileId: webcam ? getMediaFileId(webcam) : undefined,
          logoPosition,
          mainX: mainTransform.x,
          mainY: mainTransform.y,
          mainScale: mainTransform.scale,
          webcamX: webcamTransform.x,
          webcamY: webcamTransform.y,
          webcamScale: webcamTransform.scale,
          overlayScale: Number(overlayScale) / 100,
          animationPreset,
          outputAspectRatio,
           reverseVideo,
           brightness: colorAdjustments.brightness,
           contrast: colorAdjustments.contrast,
           saturation: colorAdjustments.saturation,
           hue: colorAdjustments.hue,
           chromaKeyEnabled,
           chromaKeyColor,
           chromaSimilarity,
           chromaBlend,
        }),
      });
      const output: VideoItem = {
        id: uid("vid"),
        title: title.trim() || `${selectedGroup?.name || "Library"} · edited`,
        duration: result.duration,
        status: "published",
        groupId,
        sourceUrl: result.playbackUrl,
        serverSource: result.sourcePath,
        thumbnailColor: "#2c8b88",
        views: 0,
        createdAt: now(),
        licenseId: workspace.licenseId,
        licenseName: workspace.user,
         folderName: folderPathForGroup(selectedGroup?.id, data.groups),
        quality: "edited",
      };
      const videos = [...data.videos, output];
      update({ videos, groups: rebuildGroupMembership(data.groups, videos) }, { message: `${output.title} was saved to ${selectedGroup?.name || "the library"}`, type: "video" });
      setSelectedIds([]);
      setToast("Edited video is ready in the library.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The edited video could not be created.");
    } finally {
      setBusy(false);
    }
  };
  return <AppShell title="Video editor" workspace={workspace}>
    <div className="page editor-page">
      <div className="page-head">
         <div><p className="eyebrow">Edit & compose</p><h1>Build your video</h1><p className="subtle">Pick a category, choose Short or Long format, add a face cam, and save the final file back into your library.</p></div>
        <div className="editor-head-badge"><Wand2 size={15}/> Server render</div>
      </div>
       <div className="editor-command-bar">
         <div className="editor-command-intro"><span className="editor-command-kicker">Production desk</span><strong>Shape the next signal</strong><span>Every choice is previewed here before the server renders your final file.</span></div>
         <div className="editor-steps"><div className="editor-step active"><b>01</b><span>Choose clips</span></div><div className="editor-step"><b>02</b><span>Compose layers</span></div><div className="editor-step"><b>03</b><span>Render library cut</span></div></div>
       </div>
      <form className="editor-layout" onSubmit={compose}>
        <section className="editor-stage card">
          <div className="editor-stage-head"><div><span className="metric-kicker">Live composition</span><strong>{selectedVideos.length ? `${selectedVideos.length} clips · loops ${loopCount}` : "Choose videos to preview"}</strong></div><span className="editor-stage-status"><span className="status-dot"/>Preview</span></div>
            <EditorCanvas {...editorCanvasProps} />
            <div className="editor-preview-actions">
              <div><strong>{previewUrl ? "Preview is ready to edit" : "Select a video first"}</strong><span>{previewUrl ? "Open the large canvas to position, zoom, and fit every layer precisely." : "Choose a category and at least one server-ready video from the panel."}</span></div>
              <button type="button" className="button editor-expand-button" onClick={() => setPreviewExpanded(true)} disabled={!previewUrl}><MonitorPlay size={15}/> Open large preview & edit <ArrowRight size={14}/></button>
            </div>
           <div className="editor-stage-foot"><span><Layers size={13}/> {selectedVideos.length || 0} clips selected · {outputAspectRatio === "shorts" ? "Short 9:16" : outputAspectRatio === "square" ? "Square 1:1" : "Long 16:9"}</span><span><Sparkles size={13}/> Logo and face cam are rendered into the saved MP4</span></div>
        </section>
         {previewExpanded && <div className="editor-focus-backdrop" role="dialog" aria-modal="true" aria-label="Large video editor" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewExpanded(false); }}>
           <div className="editor-focus-window">
             <div className="editor-focus-head"><div><span className="metric-kicker">Focused editor</span><strong>{previewVideo?.title || "Selected video"}</strong><span>Drag to move · scroll or pinch to zoom · use the handle to resize face cam</span></div><button type="button" className="editor-focus-close" onClick={() => setPreviewExpanded(false)} aria-label="Close large preview"><X size={17}/><span>Close</span></button></div>
             <div className="editor-focus-stage"><EditorCanvas {...editorCanvasProps} expanded onCloseExpanded={() => setPreviewExpanded(false)} /></div>
             <div className="editor-focus-controls"><EditorTransformControls {...editorCanvasProps} hasWebcam={Boolean(webcam)} /></div>
           </div>
         </div>}
        <aside className="editor-controls">
          <section className="card editor-panel">
             <div className="section-head"><div><h2 className="section-title">1. Choose a library</h2><p className="subtle">Personal files stay private. Shared animation clips are available here only.</p></div><FileVideo size={17} color="#6c8b83"/></div>
             <div className="editor-library-tabs" role="tablist" aria-label="Editor libraries">
               <button type="button" className={editorLibrary === "personal" ? "active" : ""} onClick={() => chooseEditorLibrary("personal")} role="tab" aria-selected={editorLibrary === "personal"} data-testid="button-editor-personal-library"><FileVideo size={13}/> Personal videos</button>
               <button type="button" className={editorLibrary === "youtube" ? "active" : ""} onClick={() => chooseEditorLibrary("youtube")} role="tab" aria-selected={editorLibrary === "youtube"} data-testid="button-editor-youtube-animations"><Youtube size={13}/> YouTube Animations</button>
             </div>
             <select value={groupId} onChange={(event) => setGroup(event.target.value)} data-testid="select-editor-group"><option value="">{editorLibrary === "youtube" ? "Select animation folder" : "Select category"}</option>{editorGroups.map((group) => <option key={group.id} value={group.id}>{folderPathForGroup(group.id, data.groups)}</option>)}</select>
            <div className="editor-clip-list">{groupVideos.length ? groupVideos.map((video, index) => <label className={`editor-clip ${selectedIds.includes(video.id) ? "selected" : ""}`} key={video.id}><input type="checkbox" checked={selectedIds.includes(video.id)} onChange={() => toggleVideo(video.id)}/><span className="editor-clip-number">{String(index + 1).padStart(2, "0")}</span><span className="editor-clip-copy"><strong>{video.title}</strong><small>{video.duration} · {video.quality || "ready"}</small></span><GripIcon /></label>) : <div className="editor-mini-empty"><FolderOpen size={17}/> Create a category and add videos first.</div>}</div>
          </section>
          <section className="card editor-panel">
             <div className="section-head"><div><h2 className="section-title">2. Timing & output</h2><p className="subtle">Choose whether this edit is a vertical Short or a landscape Long video.</p></div><Type size={17} color="#6c8b83"/></div>
            <div className="field"><label>Output title</label><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Night drive · long cut" data-testid="input-editor-title"/></div>
             <div className="form-grid"><div className="field"><label>Video format</label><select value={outputAspectRatio} onChange={(event) => setOutputAspectRatio(event.target.value as AspectRatio)} data-testid="select-editor-format"><option value="full">Long video · 16:9 landscape</option><option value="shorts">Short video · 9:16 vertical</option><option value="square">Square video · 1:1</option></select></div><div className="field"><label>Loop playlist</label><input type="number" min="1" max="12" value={loopCount} onChange={(event) => setLoopCount(event.target.value)} data-testid="input-editor-loop-count"/></div></div>
             <div className="field"><label>Selected total</label><div className="editor-readonly">{selectedVideos.length} clip{selectedVideos.length === 1 ? "" : "s"} · {outputAspectRatio === "shorts" ? "Short format" : outputAspectRatio === "square" ? "Square format" : "Long format"}</div></div>
          </section>
          <section className="card editor-panel">
             <div className="section-head"><div><h2 className="section-title">3. Face cam & brand layers</h2><p className="subtle">Place a face cam video on top of the main video, then add a logo if needed.</p></div><Image size={17} color="#6c8b83"/></div>
            <div className="field"><label>Logo / watermark</label><div className="input-action-row"><select value={logoId} onChange={(event) => setLogoId(event.target.value)}><option value="">No logo</option>{data.editorAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.title}</option>)}</select><label className="button secondary small editor-file-button"><Upload size={13}/>{uploadingLogo ? "Uploading…" : "Upload"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingLogo} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLogo(file); event.currentTarget.value = ""; }}/></label></div></div>
            {logo && <div className="form-grid"><div className="field"><label>Logo position</label><select value={logoPosition} onChange={(event) => setLogoPosition(event.target.value)}><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option></select></div><div className="field"><label>Logo size · {overlayScale}%</label><input type="range" min="10" max="60" value={overlayScale} onChange={(event) => setOverlayScale(event.target.value)}/></div></div>}
             <div className="field"><label>Face cam video</label><select value={webcamId} onChange={(event) => { setWebcamId(event.target.value); setSelectedLayer(event.target.value ? "webcam" : "main"); }} data-testid="select-editor-facecam"><option value="">No face cam</option>{data.videos.filter((video) => video.serverSource && video.id !== previewVideo?.id).map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</select><span className="field-hint">Choose another uploaded video to place as the face cam layer.</span></div>
             {webcam && <div className="editor-layer-note"><span>Canvas face cam: {Math.round(webcamTransform.scale * 100)}%</span><button type="button" className="section-link" onClick={() => setSelectedLayer("webcam")}>Edit on canvas <ArrowRight size={12}/></button></div>}
             <div className="field"><label>Animated callout</label><select value={animationPreset} onChange={(event) => setAnimationPreset(event.target.value as AnimationPreset)} data-testid="select-editor-animation"><option value="none">No animation</option><option value="subscribe">Subscribe pop-in</option><option value="like">Like burst</option><option value="follow">Follow pulse</option></select><span className="field-hint">The animation is previewed on the canvas and burned into the final MP4.</span></div>
             <EditorTransformControls
               selectedLayer={selectedLayer}
               hasWebcam={Boolean(webcam)}
               mainTransform={mainTransform}
               webcamTransform={webcamTransform}
               onSelectLayer={setSelectedLayer}
               onMainTransformChange={setMainTransform}
               onWebcamTransformChange={setWebcamTransform}
             />
             {webcam && <div className="form-grid"><div className="field"><label>Face cam position</label><select value={webcamPosition} onChange={(event) => setWebcamPosition(event.target.value)} data-testid="select-editor-facecam-position"><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option></select></div><div className="field"><label>Face cam size · {webcamScale}%</label><input type="range" min="10" max="60" value={webcamScale} onChange={(event) => setWebcamScale(event.target.value)} data-testid="input-editor-facecam-size"/></div></div>}
          </section>
           <section className="card editor-panel">
             <div className="section-head"><div><h2 className="section-title">4. Color & effects</h2><p className="subtle">Adjust the main video, reverse it, or key out a green background.</p></div><Sparkles size={17} color="#6c8b83"/></div>
             <label className="check-control editor-toggle-control"><input type="checkbox" checked={reverseVideo} onChange={(event) => setReverseVideo(event.target.checked)} data-testid="toggle-editor-reverse"/><span><strong>Reverse main video</strong><small>Plays the selected clips from end to start when rendered.</small></span></label>
             <div className="editor-effect-grid">
               <div className="field"><label>Brightness · {Math.round(colorAdjustments.brightness * 100)}%</label><input type="range" min="-100" max="100" value={Math.round(colorAdjustments.brightness * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, brightness: Number(event.target.value) / 100 }))} data-testid="input-editor-brightness"/></div>
               <div className="field"><label>Contrast · {Math.round(colorAdjustments.contrast * 100)}%</label><input type="range" min="50" max="180" value={Math.round(colorAdjustments.contrast * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, contrast: Number(event.target.value) / 100 }))} data-testid="input-editor-contrast"/></div>
               <div className="field"><label>Saturation · {Math.round(colorAdjustments.saturation * 100)}%</label><input type="range" min="0" max="200" value={Math.round(colorAdjustments.saturation * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, saturation: Number(event.target.value) / 100 }))} data-testid="input-editor-saturation"/></div>
               <div className="field"><label>Hue · {colorAdjustments.hue}°</label><input type="range" min="-180" max="180" value={colorAdjustments.hue} onChange={(event) => setColorAdjustments((current) => ({ ...current, hue: Number(event.target.value) }))} data-testid="input-editor-hue"/></div>
             </div>
             <label className="check-control editor-toggle-control"><input type="checkbox" checked={chromaKeyEnabled} onChange={(event) => setChromaKeyEnabled(event.target.checked)} disabled={!webcam} data-testid="toggle-editor-green-screen"/><span><strong>Remove green screen from face cam</strong><small>{webcam ? "Removes the selected key color from the face cam layer." : "Add a face cam first to enable green-screen removal."}</small></span></label>
             {chromaKeyEnabled && <div className="editor-effect-grid chroma-key-grid"><div className="field"><label>Key color</label><input type="color" value={chromaKeyColor} onChange={(event) => setChromaKeyColor(event.target.value)} data-testid="input-editor-key-color"/></div><div className="field"><label>Color range · {Math.round(chromaSimilarity * 100)}%</label><input type="range" min="10" max="90" value={Math.round(chromaSimilarity * 100)} onChange={(event) => setChromaSimilarity(Number(event.target.value) / 100)} data-testid="input-editor-key-similarity"/></div><div className="field"><label>Edge blend · {Math.round(chromaBlend * 100)}%</label><input type="range" min="0" max="35" value={Math.round(chromaBlend * 100)} onChange={(event) => setChromaBlend(Number(event.target.value) / 100)} data-testid="input-editor-key-blend"/></div></div>}
             <div className="form-note"><Sparkles size={14} style={{verticalAlign:"-3px",marginRight:6}}/>These effects are shown in the preview and applied to the saved MP4 during render.</div>
           </section>
          {error && <div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}
           <button className="button editor-render-button" type="submit" disabled={busy || !selectedVideos.length}>{busy ? `Rendering ${outputAspectRatio === "shorts" ? "Short" : outputAspectRatio === "square" ? "Square" : "Long"} video…` : "Render & save to library"} <ArrowRight size={15}/></button>
          <div className="form-note"><Sparkles size={14} style={{verticalAlign:"-3px",marginRight:6}}/>The source clips stay untouched. The rendered result is added as a new video in the selected category.</div>
        </aside>
      </form>
    </div>
  </AppShell>;
}

function GripIcon() {
  return <span className="editor-clip-grip" aria-hidden="true">⋮⋮</span>;
}

type EditorCanvasProps = {
  previewUrl: string;
  webcamUrl: string;
  logo?: EditorAsset;
  logoPosition: string;
  outputAspectRatio: AspectRatio;
  mainTransform: EditorTransform;
  webcamTransform: EditorTransform;
  selectedLayer: EditorLayer;
  animationPreset: AnimationPreset;
  reverseVideo: boolean;
  colorAdjustments: EditorColorAdjustments;
  chromaKeyEnabled: boolean;
  chromaKeyColor: string;
  chromaSimilarity: number;
  chromaBlend: number;
  onSelectLayer: (layer: EditorLayer) => void;
  onMainTransformChange: (transform: EditorTransform) => void;
  onWebcamTransformChange: (transform: EditorTransform) => void;
  expanded?: boolean;
  onCloseExpanded?: () => void;
};

function EditorCanvas({
  previewUrl,
  webcamUrl,
  logo,
  logoPosition,
  outputAspectRatio,
  mainTransform,
  webcamTransform,
  selectedLayer,
  animationPreset,
  reverseVideo,
  colorAdjustments,
  chromaKeyEnabled,
  chromaKeyColor,
  chromaSimilarity,
  chromaBlend,
  onSelectLayer,
  onMainTransformChange,
  onWebcamTransformChange,
  expanded = false,
  onCloseExpanded,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const gestureRef = useRef<{ layer: EditorLayer; distance: number; scale: number } | undefined>(undefined);
  const dragRef = useRef<{ layer: EditorLayer; x: number; y: number; transform: EditorTransform; resize?: boolean } | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === canvasRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video || !reverseVideo) return;
    video.pause();
    const rewind = window.setInterval(() => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      video.currentTime = video.currentTime <= 0.05 ? video.duration : video.currentTime - 0.05;
    }, 50);
    return () => window.clearInterval(rewind);
  }, [previewUrl, reverseVideo]);

  const getPoint = (event: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return rect ? { x: event.clientX, y: event.clientY, width: rect.width, height: rect.height } : undefined;
  };
  const getTransform = (layer: EditorLayer) => layer === "main" ? mainTransform : webcamTransform;
  const updateTransform = (layer: EditorLayer, next: EditorTransform) => {
    if (layer === "main") onMainTransformChange(next);
    else onWebcamTransformChange(next);
  };
  const clampTransform = (layer: EditorLayer, transform: EditorTransform): EditorTransform => ({
    x: Math.max(-48, Math.min(48, transform.x)),
    y: Math.max(-48, Math.min(48, transform.y)),
    scale: layer === "main"
      ? Math.max(0.5, Math.min(2.5, transform.scale))
      : Math.max(0.1, Math.min(0.8, transform.scale)),
  });
  const centerFor = (layer: EditorLayer, transform: EditorTransform, point: { width: number; height: number }) => ({
    x: point.width / 2 + (layer === "main" ? 0 : point.width * transform.x / 100),
    y: point.height / 2 + (layer === "main" ? 0 : point.height * transform.y / 100),
  });
  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    const target = event.target instanceof Element ? event.target : undefined;
    const targetLayer = target?.closest<HTMLElement>("[data-editor-layer]")?.dataset.editorLayer as EditorLayer | undefined;
    const resizeLayer = target?.closest<HTMLElement>("[data-editor-resize]")?.dataset.editorResize as EditorLayer | undefined;
    const layer = resizeLayer || targetLayer || selectedLayer;
    if (layer === "webcam" && !webcamUrl) return;
    onSelectLayer(layer);
    const point = getPoint(event);
    if (!point) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointersRef.current.size === 2) {
      const [first, second] = [...pointersRef.current.values()];
      gestureRef.current = { layer, distance: Math.max(1, distance(first, second)), scale: getTransform(layer).scale };
      dragRef.current = undefined;
      return;
    }
    if (resizeLayer) {
      const current = getTransform(layer);
      const center = centerFor(layer, current, point);
      dragRef.current = { layer, x: Math.hypot(event.clientX - center.x, event.clientY - center.y), y: 0, transform: current, resize: true };
    } else {
      dragRef.current = { layer, x: event.clientX, y: event.clientY, transform: getTransform(layer) };
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const active = dragRef.current;
    if (gestureRef.current && pointersRef.current.size >= 2) {
      const [first, second] = [...pointersRef.current.values()];
      const gesture = gestureRef.current;
      updateTransform(gesture.layer, clampTransform(gesture.layer, { ...getTransform(gesture.layer), scale: gesture.scale * distance(first, second) / gesture.distance }));
      return;
    }
    if (!active) return;
    const point = getPoint(event);
    if (!point) return;
    if (active.resize) {
      const center = centerFor(active.layer, active.transform, point);
      updateTransform(active.layer, clampTransform(active.layer, { ...active.transform, scale: active.transform.scale * Math.hypot(event.clientX - center.x, event.clientY - center.y) / active.x }));
      return;
    }
    const next = {
      ...active.transform,
      x: active.transform.x + ((event.clientX - active.x) / point.width) * 100,
      y: active.transform.y + ((event.clientY - active.y) / point.height) * 100,
    };
    updateTransform(active.layer, clampTransform(active.layer, next));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    dragRef.current = undefined;
    if (pointersRef.current.size < 2) gestureRef.current = undefined;
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const layer = selectedLayer === "webcam" && webcamUrl ? "webcam" : "main";
    event.preventDefault();
    const current = getTransform(layer);
    updateTransform(layer, clampTransform(layer, { ...current, scale: current.scale + (event.deltaY < 0 ? 0.04 : -0.04) }));
  };

  const resetLayer = (layer: EditorLayer) => {
    updateTransform(layer, layer === "main" ? { x: 0, y: 0, scale: 1 } : { x: 0, y: 0, scale: 0.25 });
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void canvasRef.current?.requestFullscreen();
  };
  const animationCopy = {
    none: "",
    subscribe: "SUBSCRIBE",
    like: "LIKE",
    follow: "FOLLOW",
  }[animationPreset];

  return <div
    ref={canvasRef}
    className={`editor-canvas editor-canvas-${outputAspectRatio}${expanded ? " editor-canvas-expanded" : ""}`}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={onPointerUp}
    onWheel={onWheel}
  >
    {previewUrl ? <video
       ref={mainVideoRef}
       src={previewUrl}
       muted
       autoPlay={!reverseVideo}
       loop
       playsInline
       className={`editor-preview-video editor-layer-main ${selectedLayer === "main" ? "active" : ""}`}
       data-editor-layer="main"
       style={{
         transform: `translate(${mainTransform.x}%, ${mainTransform.y}%) scale(${mainTransform.scale})`,
         filter: `brightness(${1 + colorAdjustments.brightness}) contrast(${colorAdjustments.contrast}) saturate(${colorAdjustments.saturation}) hue-rotate(${colorAdjustments.hue}deg)`,
       }}
    /> : <div className="editor-empty"><Layers size={27}/><strong>Your composition appears here</strong><span>Choose a category and tick the clips you want to merge.</span></div>}
    {webcamUrl && <video
      src={webcamUrl}
      muted
      autoPlay
      loop
      playsInline
       className={`editor-face-layer ${selectedLayer === "webcam" ? "active" : ""} ${chromaKeyEnabled ? "editor-face-layer-keyed" : ""}`}
      data-editor-layer="webcam"
       data-key-color={chromaKeyColor}
       data-key-similarity={chromaSimilarity}
       data-key-blend={chromaBlend}
      style={{ left: `${50 + webcamTransform.x}%`, top: `${50 + webcamTransform.y}%`, width: `${webcamTransform.scale * 100}%` }}
    />}
    {logo && <img src={logo.playbackUrl} alt="Logo overlay preview" className={`editor-overlay logo-${logoPosition}`}/>}
    {logo && <span className={`editor-watermark-label logo-${logoPosition}`}>BRANDED</span>}
    {animationCopy && <div className={`editor-animation-preview editor-animation-${animationPreset}`}><strong>{animationCopy}</strong><span>{animationPreset === "subscribe" ? "New drop live" : animationPreset === "like" ? "Show some love" : "Stay with us"}</span></div>}
    {selectedLayer === "main" && previewUrl && <div className="editor-selection editor-selection-main" aria-hidden="true"><span className="editor-selection-label">Main video · {Math.round(mainTransform.scale * 100)}%</span></div>}
    {selectedLayer === "webcam" && webcamUrl && <div
      className="editor-selection editor-selection-webcam"
      aria-hidden="true"
      style={{ left: `${50 + webcamTransform.x}%`, top: `${50 + webcamTransform.y}%`, width: `${webcamTransform.scale * 100}%` }}
    ><span className="editor-selection-label">Face cam · {Math.round(webcamTransform.scale * 100)}%</span><button type="button" data-editor-resize="webcam" aria-label="Resize face cam" className="editor-resize-handle" /></div>}
     {(reverseVideo || chromaKeyEnabled || colorAdjustments.brightness !== 0 || colorAdjustments.contrast !== 1 || colorAdjustments.saturation !== 1 || colorAdjustments.hue !== 0) && <div className="editor-effect-badges"><span>{reverseVideo ? "Reverse" : "Effects"}</span>{chromaKeyEnabled && <span>Green screen removed</span>}{colorAdjustments.brightness !== 0 || colorAdjustments.contrast !== 1 || colorAdjustments.saturation !== 1 || colorAdjustments.hue !== 0 ? <span>Color grade</span> : null}</div>}
    <div className="editor-canvas-toolbar">
      <span className="editor-canvas-hint">{isFullscreen ? "Fullscreen preview" : "Drag to move · wheel or pinch to zoom"}</span>
       {expanded && onCloseExpanded && <button type="button" className="editor-canvas-button" onPointerDown={(event) => event.stopPropagation()} onClick={onCloseExpanded} title="Close large preview">Close editor</button>}
       {!expanded && <button type="button" className="editor-canvas-button" onPointerDown={(event) => event.stopPropagation()} onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}>{isFullscreen ? "Exit" : "Fullscreen"}</button>}
    </div>
  </div>;
}

type EditorTransformControlsProps = {
  selectedLayer: EditorLayer;
  hasWebcam: boolean;
  mainTransform: EditorTransform;
  webcamTransform: EditorTransform;
  onSelectLayer: (layer: EditorLayer) => void;
  onMainTransformChange: (transform: EditorTransform) => void;
  onWebcamTransformChange: (transform: EditorTransform) => void;
};

function EditorTransformControls({ selectedLayer, hasWebcam, mainTransform, webcamTransform, onSelectLayer, onMainTransformChange, onWebcamTransformChange }: EditorTransformControlsProps) {
  const transform = selectedLayer === "main" ? mainTransform : webcamTransform;
  const update = (scale: number) => {
    const next = { ...transform, scale };
    if (selectedLayer === "main") onMainTransformChange(next);
    else onWebcamTransformChange(next);
  };
  const reset = () => {
    if (selectedLayer === "main") onMainTransformChange({ x: 0, y: 0, scale: 1 });
    else onWebcamTransformChange({ x: 0, y: 0, scale: 0.25 });
  };
  return <div className="editor-transform-controls">
    <div className="editor-layer-tabs"><button type="button" className={selectedLayer === "main" ? "active" : ""} onClick={() => onSelectLayer("main")}>Main video</button><button type="button" className={selectedLayer === "webcam" ? "active" : ""} onClick={() => onSelectLayer("webcam")} disabled={!hasWebcam}>Face cam</button></div>
    <div className="editor-control-row"><label>{selectedLayer === "main" ? "Video zoom" : "Face cam size"} <strong>{Math.round(transform.scale * 100)}%</strong></label><input type="range" min={selectedLayer === "main" ? "50" : "10"} max={selectedLayer === "main" ? "250" : "80"} value={Math.round(transform.scale * 100)} onChange={(event) => update(Number(event.target.value) / 100)} data-testid={`input-editor-${selectedLayer}-zoom`}/></div>
    <div className="editor-control-actions"><span>Position {Math.round(transform.x)} / {Math.round(transform.y)}</span><button type="button" className="section-link" onClick={reset}>Reset layer</button></div>
    <p className="field-hint">Select a layer, drag it with the cursor, pinch with two fingers, or scroll over the canvas to zoom.</p>
  </div>;
}

function SettingsPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const [autoSave,setAutoSave]=useState(()=>localStorage.getItem("signal-desk-autosave")!=="off");const [compact,setCompact]=useState(()=>localStorage.getItem("signal-desk-compact")==="on");const toggle=(key:string,value:boolean,setter:(v:boolean)=>void)=>{setter(value);localStorage.setItem(key,value?"on":"off");workspace.setToast(value?"Preference enabled":"Preference disabled")};
   return <AppShell title="Settings" workspace={workspace}>
     <div className="page">
       <div className="page-head"><div><p className="eyebrow">Workspace preferences</p><h1>Settings</h1><p className="subtle">Tune Reverse Bypass to match how you work. Everything here stays local.</p></div></div>
       <div className="settings-grid">
         <section className="card setting-section"><div className="section-head"><div><h2 className="section-title">Workspace</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Simple controls for a focused desk.</p></div><Settings size={17} color="#6c8b83"/></div><div className="setting-row"><div><h3>Save changes automatically</h3><p>Keep channel and library edits in local storage as you make them.</p></div><button className={`toggle ${autoSave?"on":""}`} onClick={()=>toggle("signal-desk-autosave",!autoSave,setAutoSave)} data-testid="toggle-autosave"><span/></button></div><div className="setting-row"><div><h3>Compact data tables</h3><p>Use a denser row height when the library gets busy.</p></div><button className={`toggle ${compact?"on":""}`} onClick={()=>toggle("signal-desk-compact",!compact,setCompact)} data-testid="toggle-compact"><span/></button></div><div className="setting-row"><div><h3>Storage status</h3><p>Your data is persisted in this browser only.</p></div><span className="status live"><span className="status-dot"/>Local only</span></div></section>
         <section className="card setting-section"><div className="section-head"><div><h2 className="section-title">Stream tools</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Useful links for getting your workspace ready.</p></div><Download size={17} color="#6c8b83"/></div><div className="download-list"><a className="download" href="https://obsproject.com/download" target="_blank" rel="noreferrer" data-testid="link-download-obs"><div className="download-icon"><Download size={15}/></div><div className="download-copy"><strong>OBS Studio</strong><span>Open source broadcast software</span></div><ArrowRight size={14} color="#80908a"/></a><a className="download" href="https://vdo.ninja/" target="_blank" rel="noreferrer" data-testid="link-open-vdo"><div className="download-icon"><Link2 size={15}/></div><div className="download-copy"><strong>VDO.Ninja</strong><span>Browser guests and remote feeds</span></div><ArrowRight size={14} color="#80908a"/></a><a className="download" href="https://support.google.com/youtube/answer/2907883" target="_blank" rel="noreferrer" data-testid="link-stream-guide"><div className="download-icon"><Download size={15}/></div><div className="download-copy"><strong>Streaming guide</strong><span>Platform setup reference</span></div><ArrowRight size={14} color="#80908a"/></a></div><div className="form-note" style={{marginTop:17}}><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Keep private live URLs out of public chat.</div></section>
       </div>
       <section className="card setting-section" style={{marginTop:18}}><div className="section-head"><div><h2 className="section-title">About this demo</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Reverse Bypass runs entirely on your device.</p></div><Gauge size={17} color="#6c8b83"/></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:22}}><div><div className="metric-kicker">Environment</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>Local demo</div></div><div><div className="metric-kicker">Data layer</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>Browser storage</div></div><div><div className="metric-kicker">Workspace owner</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>{workspace.user}</div></div></div></section>
     </div>
   </AppShell>;
}

function Routed({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  return <Switch><Route path="/dashboard"><Dashboard workspace={workspace}/></Route><Route path="/live"><LivePage workspace={workspace}/></Route><Route path="/videos"><VideosPage workspace={workspace}/></Route><Route path="/editor"><VideoEditorPage workspace={workspace}/></Route><Route path="/settings"><SettingsPage workspace={workspace}/></Route><Route><NotFound/></Route></Switch>;
}

function App() {
  const license = useLicense();
  const workspace=useWorkspace(license.license, license.clear); const [location,setLocation]=useLocation();
  useEffect(() => {
    if (isLicenseActive(license.license) && (location === "/" || location === "/access")) {
      setLocation("/dashboard");
    }
  }, [license.license, location, setLocation]);
  if (location === "/owner") return <OwnerPage/>;
  if (location === "/pricing") return <PricingPage />;
  if (location === "/gateway") return <GatewayPage />;
  if (location === "/" && !isLicenseActive(license.license)) return <LandingPage />;
  if (location === "/access") return <LicenseGate license={license.license} busy={license.busy} error={license.error} onActivate={license.activate} onRenew={license.renew}/>;
  if (!license.license || !isLicenseActive(license.license)) return <LicenseGate license={license.license} busy={license.busy} error={license.error} onActivate={license.activate} onRenew={license.renew}/>;
  if (!workspace.ready) return <div className="workspace-loading"><Radio size={20}/><span>Loading your private workspace…</span></div>;
  return <Routed workspace={workspace}/>;
}

export default function RootApp() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,"")}><App/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}