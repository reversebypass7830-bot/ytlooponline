import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type SyntheticEvent } from "react";
import { Link, Redirect, Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import {
  Activity as ActivityIcon, ArrowRight, BookOpen, Camera, Check, CircleHelp, Clipboard,
  CalendarDays, Download, FileVideo, Filter, FolderOpen, Gauge, Gift, Instagram, LayoutDashboard,
  Image, Layers, Link2, Menu, MessageCircle, MonitorPlay, Pencil, Play, Plus, Radio, Scissors, Search, Send, Settings,
  UserRound, CreditCard, KeyRound, Mail, Receipt, Users,
  Mic, ShieldCheck, Smartphone, Sparkles, Square, Trash2, Type, Upload, Video, Wand2, X, Youtube,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmailAuthProvider, GoogleAuthProvider, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut, updateEmail, updatePassword, updateProfile, type User as FirebaseUser } from "firebase/auth";
import Hls from "hls.js";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { GatewayPage, LandingPage, PricingPage } from "@/pages/public";
import { extractYoutubeChannelLinks, getStreamStatus, startStream, stopStream, trimMediaFile, updateStream } from "@workspace/api-client-react";
import logoImage from "@assets/image_1788788255512.png";
import analyticsVideoIcon from "@assets/video_files_clay_icon_cutout_1790011470854.png";
import analyticsFolderIcon from "@assets/folder_tag_clay_cutout_1790011484726.png";
import analyticsClockIcon from "@assets/clock_pulse_clay_cutout_1790011496199.png";
import analyticsBarIcon from "@assets/bar_chart_clay_icon_1790011507711.png";
import analyticsTowerIcon from "@assets/live_tower_final_v3_1790011518949.png";
import analyticsPieIcon from "@assets/pie_orange_teal_final_1790011732864.png";
import { type AccessGateProfile } from "./components/AccessGate";
import LoginPage from "./pages/login";
import { firebaseAuth } from "./lib/firebase-auth";
import "./profile-completion.css";

type LiveStatus = "live" | "scheduled" | "stopped";
type VideoStatus = "published" | "draft" | "archived";
type DownloadQuality = "best" | "1080p" | "720p" | "480p" | "360p";
type AspectRatio = "shorts" | "full" | "square";
type StreamQuality = "4k" | "1080p";
type FacePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
type EditorLayer = "main" | "webcam" | "animation";
type AnimationPreset = "none" | "subscribe" | "like" | "follow";
type EditorTransform = { x: number; y: number; scale: number };
type EditorChromaSettings = { enabled: boolean; color: string; similarity: number; blend: number };
type EditorChromaByLayer = Record<EditorLayer, EditorChromaSettings>;
type EditorChromaByVideoId = Record<string, EditorChromaSettings>;
type EditorColorAdjustments = {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
};
type EditorCropMode = "fit" | "crop";
type EditorChromaTarget = EditorLayer;
type EditorStreamComposition = {
  mainX: number;
  mainY: number;
  mainScale: number;
  cropMode: EditorCropMode;
  webcamSource?: string;
  webcamX: number;
  webcamY: number;
  webcamScale: number;
  animationSource?: string;
  animationX: number;
  animationY: number;
  animationScale: number;
  logoSource?: string;
  logoPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  logoScale: number;
  animationPreset: AnimationPreset;
  comingSoon?: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  chromaKeyByLayer?: EditorChromaByLayer;
  chromaKeyBySource?: Record<string, EditorChromaSettings>;
  chromaKeyDurations?: Record<string, number>;
  chromaKeyEnabled?: boolean;
  chromaKeyTarget?: EditorChromaTarget;
  chromaKeyColor?: string;
  chromaSimilarity?: number;
  chromaBlend?: number;
};
type EditorDraft = {
  groupId: string;
  animationGroupId: string;
  editorLibrary: "personal" | "youtube";
  selectedIds: string[];
  loopEnabled: boolean;
  loopCount: string;
  title: string;
  outputAspectRatio: AspectRatio;
  cropMode: EditorCropMode;
  logoPosition: string;
  overlayScale: string;
  webcamPosition: string;
  webcamScale: string;
  mainTransform: EditorTransform;
  webcamTransform: EditorTransform;
  selectedLayer: EditorLayer;
  animationPreset: AnimationPreset;
  reverseVideo: boolean;
  colorAdjustments: EditorColorAdjustments;
  chromaKeyByLayer: EditorChromaByLayer;
  chromaKeyByVideoId: EditorChromaByVideoId;
  webcamId: string;
  animationId: string;
  animationTransform: EditorTransform;
  logoId: string;
};
type LiveChannel = {
  id: string; title: string; platform: string; status: LiveStatus; groupId: string;
  streamUrl: string; streamKey: string; viewers: number; startedAt: string | null;
  thumbnailColor: string; createdAt: string; aspectRatio?: AspectRatio; playbackSpeed?: number; faceGroupId?: string;
  facePosition?: FacePosition; faceSize?: number; durationHours?: number; autoRestart?: boolean; streamQuality?: StreamQuality;
  playlistVideoIds?: string[];
  liveAnimationId?: string; liveAnimationX?: number; liveAnimationY?: number; liveAnimationScale?: number;
  editorComposition?: EditorStreamComposition;
};
type VideoItem = {
  id: string; title: string; duration: string; status: VideoStatus; groupId: string;
  sourceUrl: string; serverSource?: string; thumbnailColor: string; views: number; createdAt: string;
  licenseId?: string; licenseName?: string; folderName?: string; quality?: string;
};
type VideoGroup = { id: string; name: string; description: string; videoIds: string[]; createdAt: string; parentId?: string };
type EditorAsset = { id: string; fileId: string; title: string; playbackUrl: string; sourcePath: string; kind: "logo"; createdAt: string };
type Activity = { id: string; type: string; message: string; time: string };
type DataState = { channels: LiveChannel[]; videos: VideoItem[]; groups: VideoGroup[]; editorAssets: EditorAsset[]; activities: Activity[]; editorDraft?: EditorDraft };
type LicenseSession = { licenseId: string; key: string; name: string; expiresAt: string; active: boolean; clientId?: string };
type AccountPlan = { id: string; name: string; description: string; durationDays: number; price: string; streamLimit?: number; isTrial?: boolean; active: boolean; createdAt: string; updatedAt: string };
type AccountHistoryItem = { id: string; type: "trial_started" | "purchase" | "grant" | "login"; message: string; at: string; planId?: string; days?: number; streamLimit?: number };
type AccountSummary = {
  id: string; displayName: string; email: string; phone?: string; profileImagePath?: string; profileCompleted?: boolean; role: "owner" | "user";
  licenseId: string; licenseKey: string; trialStartedAt: string; trialEndsAt: string;
  activePlanId: string; activePlan: AccountPlan | null; accessEndsAt: string; active: boolean; streamLimit: number;
  history: AccountHistoryItem[]; createdAt: string;
};
type AccountResponse = { account: AccountSummary; plans: AccountPlan[] };
type OwnerUser = AccountSummary;
type VidKrakenTokenStatus = { key: string; status: "ready" | "cooldown"; cooldownUntil: string | null };
const accessSocialLinks = [
  { label: "Instagram", detail: "Updates & behind the scenes", href: "https://www.instagram.com/", icon: Instagram },
  { label: "Telegram", detail: "Channel announcements", href: "https://t.me/", icon: Send },
  { label: "WhatsApp", detail: "Direct support line", href: "https://wa.me/", icon: MessageCircle },
  { label: "YouTube", detail: "Watch the live signal", href: "https://www.youtube.com/", icon: Youtube },
];
const mobileDeviceStorageKey = "loop_mobile_device_id";

function getMobileDeviceId(): string {
  if (typeof window === "undefined") return "WebBrowser-server";
  try {
    const existing = window.localStorage.getItem(mobileDeviceStorageKey);
    if (existing && /^[A-Za-z0-9._:-]{8,80}$/.test(existing)) return existing;
    const generated = `WebBrowser-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
    window.localStorage.setItem(mobileDeviceStorageKey, generated);
    return generated;
  } catch {
    return "WebBrowser-browser";
  }
}
type MediaFileRecord = {
  fileId: string; filename: string; sourcePath: string; playbackUrl: string; title: string; duration: string;
  licenseId: string; licenseName: string; folderName: string; quality: string; createdAt: string; sizeBytes: number;
};
type IncludedFolderRecord = { path: string; createdAt: string };
type IncludedFoldersResponse = { root: string; folders: IncludedFolderRecord[]; files: MediaFileRecord[] };
type IncludedFolderTreeResponse = { root: string; folders: IncludedFolderRecord[] };
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
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const purchasePath = "/pricing";
const now = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const isLicenseActive = (license: LicenseSession | null) => Boolean(license && license.active && new Date(license.expiresAt).getTime() > Date.now());
const profilePhotoKey = (userId: string) => `reverse-bypass-profile-photo:${userId}`;
const defaultProfilePhoto = (userId: string) => `https://i.pravatar.cc/200?img=${(Array.from(userId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 70) + 1}`;
const profileImageUrl = (path?: string) => path ? `/api/storage${path}` : "";
const getClientId = () => {
  const existing = localStorage.getItem("signal-desk-client-id");
  if (existing) return existing;
  const next = `client-${crypto.randomUUID()}`;
  localStorage.setItem("signal-desk-client-id", next);
  return next;
};
async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) {
    const error = new Error(payload.error || "The request could not be completed.") as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return payload;
}
function resolveStreamIngestUrl(streamUrl: string, streamKey: string): string {
  const key = streamKey.trim();
  if (!key) return streamUrl.trim();
  if (streamUrl.includes("{streamKey}")) return streamUrl.replaceAll("{streamKey}", encodeURIComponent(key));
  let url: URL;
  try {
    url = new URL(streamUrl.trim());
  } catch {
    return streamUrl.trim();
  }
  if (url.protocol === "rtmp:" || url.protocol === "rtmps:") {
    const pathName = url.pathname.replace(/\/+$/, "");
    url.pathname = `${pathName}/${encodeURIComponent(key)}`;
    return url.toString();
  }
  if (url.pathname.includes("http_upload_hls")) {
    if (!url.searchParams.get("cid")) url.searchParams.set("cid", key);
    else if (!url.searchParams.get("stream_key")) url.searchParams.set("stream_key", key);
  }
  return url.toString();
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
const editedVideosFolderId = "folder-edited-videos";
const includedMediaLicenseId = "__included__";
const youtubeAnimationRootName = "My YouTube Animation";
const editedVideosFolderName = "Edited Videos";
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

function isEditedVideosFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  const group = groups.find((item) => item.id === groupId);
  return Boolean(group && (group.id === editedVideosFolderId || (
    !group.parentId && group.name.trim().toLowerCase() === editedVideosFolderName.toLowerCase()
  )));
}

function isProtectedWorkspaceFolder(group: VideoGroup | undefined, groups: VideoGroup[]): boolean {
  return Boolean(group && (isBuiltInYoutubeFolder(group) || isEditedVideosFolder(group.id, groups)));
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

function isUserUploadFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  return isVideoDestinationFolder(groupId, groups) && !isEditedVideosFolder(groupId, groups);
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

function isMyAnimationFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  const seen = new Set<string>();
  let current = groups.find((group) => group.id === groupId);
  while (current && !seen.has(current.id)) {
    if (current.id === myAnimationFolderId || current.name.trim().toLowerCase() === "my animations") return true;
    seen.add(current.id);
    current = current.parentId ? groups.find((group) => group.id === current?.parentId) : undefined;
  }
  return false;
}

function isAnimationFolder(groupId: string | undefined, groups: VideoGroup[]): boolean {
  return isIncludedFolder(groupId, groups) || isMyAnimationFolder(groupId, groups);
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
  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const withoutLicense = withoutHash
    .replace(/([?&])licenseId=[^&]*/gi, "")
    .replace("?&", "?")
    .replace(/[?&]$/, "");
  const separator = withoutLicense.includes("?") ? "&" : "?";
  return `${withoutLicense}${separator}licenseId=${encodeURIComponent(currentLicenseId)}${hash}`;
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
  if (myFolder && legacyVideoIds.length) {
    next = next.map((group) => group.id === myFolder?.id
      ? { ...group, videoIds: Array.from(new Set([...group.videoIds, ...legacyVideoIds])) }
      : group);
  }
  if (!next.some((group) => isEditedVideosFolder(group.id, next))) {
    next.push({
      id: editedVideosFolderId,
      name: editedVideosFolderName,
      description: "Protected destination for media created by the workspace.",
      videoIds: [],
      createdAt: now(),
    });
  }
  return next;
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

function normalizeEditorDraft(value: unknown): EditorDraft | undefined {
  if (!value || typeof value !== "object") return undefined;
  const draft = value as Partial<EditorDraft> & {
    chromaKeyEnabled?: unknown;
    chromaKeyTarget?: unknown;
    chromaKeyColor?: unknown;
    chromaSimilarity?: unknown;
    chromaBlend?: unknown;
  };
  const transform = (candidate: unknown, fallback: EditorTransform): EditorTransform => {
    if (!candidate || typeof candidate !== "object") return fallback;
    const item = candidate as Partial<EditorTransform>;
    return {
      x: typeof item.x === "number" && Number.isFinite(item.x) ? Math.max(-48, Math.min(48, item.x)) : fallback.x,
      y: typeof item.y === "number" && Number.isFinite(item.y) ? Math.max(-48, Math.min(48, item.y)) : fallback.y,
      scale: typeof item.scale === "number" && Number.isFinite(item.scale) ? Math.max(0.1, Math.min(2.5, item.scale)) : fallback.scale,
    };
  };
  const adjustments = draft.colorAdjustments && typeof draft.colorAdjustments === "object"
    ? draft.colorAdjustments as Partial<EditorColorAdjustments>
    : {};
  const editorLibrary = draft.editorLibrary === "youtube" ? "youtube" : "personal";
  const selectedLayer = draft.selectedLayer === "webcam" || draft.selectedLayer === "animation" ? draft.selectedLayer : "main";
  const chromaKeyTarget = draft.chromaKeyTarget === "main" || draft.chromaKeyTarget === "animation" ? draft.chromaKeyTarget : "webcam";
  const chromaSettings = (candidate: unknown, fallback: EditorChromaSettings): EditorChromaSettings => {
    if (!candidate || typeof candidate !== "object") return fallback;
    const item = candidate as Partial<EditorChromaSettings>;
    return {
      enabled: item.enabled === true,
      color: typeof item.color === "string" && /^#[0-9a-f]{6}$/i.test(item.color) ? item.color : fallback.color,
      similarity: typeof item.similarity === "number" ? Math.max(0.05, Math.min(0.95, item.similarity)) : fallback.similarity,
      blend: typeof item.blend === "number" ? Math.max(0, Math.min(0.5, item.blend)) : fallback.blend,
    };
  };
  const legacyChroma = {
    enabled: draft.chromaKeyEnabled === true,
    color: typeof draft.chromaKeyColor === "string" && /^#[0-9a-f]{6}$/i.test(draft.chromaKeyColor) ? draft.chromaKeyColor : "#00ff00",
    similarity: typeof draft.chromaSimilarity === "number" ? Math.max(0.05, Math.min(0.95, draft.chromaSimilarity)) : 0.32,
    blend: typeof draft.chromaBlend === "number" ? Math.max(0, Math.min(0.5, draft.chromaBlend)) : 0.08,
  };
  const savedChroma = draft.chromaKeyByLayer && typeof draft.chromaKeyByLayer === "object"
    ? draft.chromaKeyByLayer as Partial<EditorChromaByLayer>
    : {};
  const savedChromaByVideoId = draft.chromaKeyByVideoId && typeof draft.chromaKeyByVideoId === "object"
    ? draft.chromaKeyByVideoId as Record<string, unknown>
    : {};
  const chromaKeyByVideoId: EditorChromaByVideoId = Object.fromEntries(
    Object.entries(savedChromaByVideoId)
      .filter(([key]) => Boolean(key))
      .map(([key, value]) => [key, chromaSettings(value, { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 })]),
  );
  const chromaKeyByLayer: EditorChromaByLayer = {
    main: chromaSettings(savedChroma.main, { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 }),
    webcam: chromaSettings(savedChroma.webcam, chromaKeyTarget === "webcam" ? legacyChroma : { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 }),
    animation: chromaSettings(savedChroma.animation, chromaKeyTarget === "animation" ? legacyChroma : { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 }),
  };
  if (chromaKeyTarget === "main" && legacyChroma.enabled && !savedChroma.main) chromaKeyByLayer.main = legacyChroma;
  const cropMode = draft.cropMode === "crop" ? "crop" : "fit";
  return {
    groupId: typeof draft.groupId === "string" ? draft.groupId : "",
    animationGroupId: typeof draft.animationGroupId === "string" ? draft.animationGroupId : "",
    editorLibrary,
    selectedIds: Array.isArray(draft.selectedIds) ? draft.selectedIds.filter((id): id is string => typeof id === "string") : [],
    loopEnabled: draft.loopEnabled !== false,
    loopCount: typeof draft.loopCount === "string" ? draft.loopCount : "1",
    title: typeof draft.title === "string" ? draft.title : "",
    outputAspectRatio: draft.outputAspectRatio === "shorts" || draft.outputAspectRatio === "square" ? draft.outputAspectRatio : "full",
    cropMode,
    logoPosition: typeof draft.logoPosition === "string" ? draft.logoPosition : "bottom-right",
    overlayScale: typeof draft.overlayScale === "string" ? draft.overlayScale : "25",
    webcamPosition: typeof draft.webcamPosition === "string" ? draft.webcamPosition : "top-right",
    webcamScale: typeof draft.webcamScale === "string" ? draft.webcamScale : "25",
    mainTransform: transform(draft.mainTransform, { x: 0, y: 0, scale: 1 }),
    webcamTransform: transform(draft.webcamTransform, { x: 0, y: 0, scale: 0.25 }),
    selectedLayer,
    animationPreset: draft.animationPreset === "subscribe" || draft.animationPreset === "like" || draft.animationPreset === "follow" ? draft.animationPreset : "none",
    reverseVideo: draft.reverseVideo === true,
    colorAdjustments: {
      brightness: typeof adjustments.brightness === "number" ? Math.max(-1, Math.min(1, adjustments.brightness)) : 0,
      contrast: typeof adjustments.contrast === "number" ? Math.max(0.5, Math.min(1.8, adjustments.contrast)) : 1,
      saturation: typeof adjustments.saturation === "number" ? Math.max(0, Math.min(2, adjustments.saturation)) : 1,
      hue: typeof adjustments.hue === "number" ? Math.max(-180, Math.min(180, adjustments.hue)) : 0,
    },
    chromaKeyByLayer,
    chromaKeyByVideoId,
    webcamId: typeof draft.webcamId === "string" ? draft.webcamId : "",
    animationId: typeof draft.animationId === "string" ? draft.animationId : "",
    animationTransform: transform(draft.animationTransform, { x: 0, y: 0, scale: 0.25 }),
    logoId: typeof draft.logoId === "string" ? draft.logoId : "",
  };
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
    editorDraft: normalizeEditorDraft(candidate.editorDraft),
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

function reconcileIncludedFolders(value: DataState, folders: IncludedFolderRecord[]): DataState {
  let groups = [...value.groups];
  for (const folder of folders) {
    groups = ensureFolderPath(groups, folder.path, folder.createdAt).groups;
  }
  return normalizeWorkspace({ ...value, groups });
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

function videoPlaybackUrl(video: VideoItem | undefined, currentLicenseId: string): string {
  if (!video) return "";
  const directUrl = scopedMediaPlaybackUrl(video.sourceUrl, video.licenseId, currentLicenseId);
  if (directUrl) return directUrl;
  const fileId = getMediaFileId(video);
  if (!fileId) return "";
  const query = video.licenseId === includedMediaLicenseId || !currentLicenseId
    ? ""
    : `?licenseId=${encodeURIComponent(currentLicenseId)}`;
  return `/api/media/files/${encodeURIComponent(fileId)}${query}`;
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

function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      void (async () => {
        if (!nextUser) {
          if (mounted) {
            setUser(null);
            setError("");
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setLoading(true);
          setError("");
        }
        try {
          const idToken = await nextUser.getIdToken();
          await apiJson("/api/firebase-auth/session", {
            method: "POST",
            body: JSON.stringify({ idToken }),
          });
          if (mounted) setUser(nextUser);
        } catch (reason) {
          if (mounted) {
            setUser(null);
            setError(reason instanceof Error ? reason.message : "Could not connect your Google account.");
          }
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    } catch (reason) {
      const code = typeof reason === "object" && reason && "code" in reason ? String((reason as { code?: unknown }).code) : "";
      if (code === "auth/popup-blocked") {
        await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
        return;
      }
      const message = reason instanceof Error ? reason.message : "Google sign-in could not be completed.";
      setError(message);
      throw new Error(message);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(firebaseAuth);
    await apiJson("/api/firebase-auth/logout", { method: "POST" }).catch(() => undefined);
  };

  return { user, loading, busy, error, signInWithGoogle, signOut };
}

function useAccountSession(isSignedIn: boolean, userId?: string, authReady = true) {
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [plans, setPlans] = useState<AccountPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const load = async () => {
    const requestId = ++requestIdRef.current;
    try {
      const result = await apiJson<AccountResponse>("/api/account");
      if (requestId !== requestIdRef.current) return result.account;
      setAccount(result.account);
      setPlans(result.plans || []);
      setError("");
      return result.account;
    } catch (reason) {
      if (requestId !== requestIdRef.current) return null;
      const status = (reason as Error & { status?: number }).status;
      if (status === 401) {
        setAccount(null);
        setPlans([]);
        setError("");
      } else {
        setError(reason instanceof Error ? reason.message : "Could not load your account.");
      }
      return null;
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) {
      setLoading(true);
      return;
    }
    setLoading(Boolean(isSignedIn));
    void load();
    if (!isSignedIn && !account) return;
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      window.clearInterval(timer);
      requestIdRef.current += 1;
    };
  }, [authReady, isSignedIn, userId, Boolean(account)]);

  const saveProfile = async (profile: { displayName: string; email: string; phone?: string; profileImagePath?: string }) => {
    const result = await apiJson<AccountResponse>("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
    setAccount(result.account);
    setPlans(result.plans || []);
  };

  const savePhone = async (phone: string) => {
    await saveProfile({
      displayName: account?.displayName || "",
      email: account?.email || "",
      phone,
    });
  };

  const claimOwner = async (password: string) => {
    const result = await apiJson<AccountResponse>("/api/account/claim-owner", {
      method: "POST",
      headers: { "X-Owner-Password": password },
    });
    setAccount(result.account);
    setPlans(result.plans || []);
  };

  const selectPlan = async (planId: string, streamLimit: number, durationMultiplier = 1) => {
    const result = await apiJson<AccountResponse>("/api/account/subscription/select", {
      method: "POST",
      body: JSON.stringify({ planId, streamLimit, durationMultiplier }),
    });
    setAccount(result.account);
    setPlans(result.plans || []);
    return result.account;
  };

  const clear = () => {
    requestIdRef.current += 1;
    setAccount(null);
    setPlans([]);
    setError("");
  };

  const reload = async () => {
    const nextAccount = await load();
    if (!nextAccount) throw new Error("Your session could not be restored. Please sign in again.");
  };

  return { account, plans, loading, error, reload, saveProfile, savePhone, claimOwner, selectPlan, clear };
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
      apiJson<IncludedFolderTreeResponse>("/api/media/included-folders").catch(() => ({ root: includedFolderRoot, folders: [] })),
    ]).then(([workspaceResult, mediaResult, includedFolderResult]) => {
      if (cancelled) return;
        const base = reconcileMediaFolders(
          reconcileIncludedFolders(
            normalizeWorkspace(workspaceResult.data),
            includedFolderResult.folders,
          ),
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
    <div className="brand-mark">
      <span className="brand-wordmark" aria-label="YT LOOP"><b>YT</b><span>LOOP</span></span>
    </div>
  </div>;
}

function Sidebar({ path, open, onClose, user, photo, data }: { path:string; open:boolean; onClose:()=>void; user:string; photo?:string; data:DataState }) {
  const nav = [
    { href:"/dashboard", label:"Dashboard", icon:LayoutDashboard },
    { href:"/analytics", label:"Analytics", icon:Gauge },
    { href:"/live", label:"Live", icon:MonitorPlay, count:data.channels.filter(c=>c.status==="live").length || undefined },
    { href:"/videos", label:"Video", icon:FileVideo },
    { href:"/live-preview", label:"Stream preview", icon:Radio, count:data.channels.filter(c=>c.status==="live").length || undefined },
    { href:"/editor", label:"Video editor", icon:Wand2 },
    { href:"/subscription", label:"Subscription", icon:CreditCard },
  ];
  return <aside className={`sidebar ${open ? "open" : ""}`} data-testid="sidebar">
    <Brand />
     <div className="nav-label">Workspace</div>
    <nav className="nav">
      {nav.map(({href,label,icon:Icon,count}) => <Link key={href} href={href} onClick={onClose} className={`nav-link ${path === href ? "active" : ""}`} data-testid={`link-${label.toLowerCase().replaceAll(" ","-")}`}><Icon size={16}/><span>{label}</span>{count !== undefined && <span className="nav-count">{count}</span>}</Link>)}
    </nav>
     <div className="nav-label" style={{marginTop:28}}>Account</div>
    <nav className="nav">
      <Link href="/profile" onClick={onClose} className={`nav-link ${path === "/profile" ? "active" : ""}`} data-testid="link-profile"><UserRound size={16}/><span>Profile</span></Link>
    </nav>
    <div className="sidebar-bottom">
      <div className="workspace-card"><strong>Private workspace</strong><p>Your private workspace is saved in your Firebase license workspace.</p></div>
      <div className="mini-user"><span className="avatar">{photo ? <img src={photo} alt="" /> : user.slice(0,2).toUpperCase()}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user}</span></div>
    </div>
  </aside>;
}

function Header({ title, account, onMenu }: { title:string; account?: AccountSummary | null; onMenu:()=>void }) {
  return <header className="topbar">
    <div className="crumb"><button className="icon-button mobile-menu" onClick={onMenu} data-testid="button-open-menu"><Menu size={18}/></button><span className="crumb-label">Reverse Bypass /</span><span className="crumb-title">{title}</span></div>
    <div className="top-actions"><AccountAccessTimer account={account}/></div>
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

function MobileNav({ path }: { path:string }) {
  const primary = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: Gauge },
    { href: "/subscription", label: "Subscription", icon: CreditCard },
    { href: "/profile", label: "Profile", icon: UserRound },
  ];
  return <div className="mobile-nav-wrap">
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {primary.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`mobile-nav-link ${path === href ? "active" : ""}`}><Icon size={18}/><span>{label}</span></Link>)}
    </nav>
  </div>;
}

function AppShell({ children, title, account, profilePhoto, workspace }: { children:ReactNode; title:string; account?: AccountSummary | null; profilePhoto?: string; workspace:ReturnType<typeof useWorkspace> }) {
  const [path] = useLocation();
  const [menu, setMenu] = useState(false);
  return <div className={`shell ${title === "Analytics" ? "analytics-surface" : ""}`}>
    {menu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} data-testid="button-close-menu" />}
    <Sidebar path={path} open={menu} onClose={()=>setMenu(false)} user={account?.displayName || account?.email || workspace.user} photo={profilePhoto} data={workspace.data}/>
     <main className="main"><Header title={title} account={account} onMenu={()=>setMenu(true)}/><DownloadActivity downloads={workspace.youtubeDownloads} onDismiss={workspace.dismissYoutubeDownload}/>{children}</main>
     <MobileNav path={path}/>
    {workspace.toast && <div className="toast" data-testid="status-toast"><Check size={14} style={{verticalAlign:"-2px", marginRight:7}}/>{workspace.toast}</div>}
  </div>;
}

function WaterFillAvatar({ src, alt, animate, animationKey }: { src: string; alt: string; animate: boolean; animationKey: number }) {
  const id = useId().replace(/:/g, "");
  const clipId = `profile-avatar-clip-${id}`;
  const maskId = `profile-avatar-mask-${id}-${animationKey}`;
  const gradientId = `profile-avatar-water-${id}`;
  return <svg className="profile-avatar profile-avatar-svg" viewBox="0 0 112 112" role="img" aria-label={alt} key={animationKey}>
    <defs>
      <clipPath id={clipId}><circle cx="56" cy="56" r="56" /></clipPath>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="112">
        <rect width="112" height="112" fill="black" />
        <rect className="profile-avatar-reveal" x="0" y={animate ? 112 : 0} width="112" height="112" fill="white">
          {animate && <animate attributeName="y" from="112" to="0" dur="1.2s" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" fill="freeze" />}
        </rect>
      </mask>
      <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#ff63ae" stopOpacity=".36" />
        <stop offset="1" stopColor="#a35bd7" stopOpacity=".24" />
      </linearGradient>
    </defs>
    <circle className="profile-avatar-backdrop" cx="56" cy="56" r="56" />
    <image href={src} x="0" y="0" width="112" height="112" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} mask={animate ? `url(#${maskId})` : undefined} />
    {animate && <g clipPath={`url(#${clipId})`} pointerEvents="none">
      <path className="profile-avatar-water" fill={`url(#${gradientId})`} d="M-12 112 C 10 104, 25 119, 48 112 S 86 105, 124 112 V0 H-12 Z">
        <animateTransform attributeName="transform" type="translate" from="0 112" to="0 0" dur="1.2s" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" fill="freeze" />
      </path>
      <path className="profile-avatar-wave" d="M-12 0 C 10 -7, 25 7, 48 0 S 86 -7, 124 0" fill="none">
        <animateTransform attributeName="transform" type="translate" from="0 112" to="0 0" dur="1.2s" calcMode="spline" keyTimes="0;1" keySplines="0.22 1 0.36 1" fill="freeze" />
      </path>
    </g>}
    <circle className="profile-avatar-border" cx="56" cy="56" r="54.5" />
  </svg>;
}

function LicenseGate({ license, busy, error, signedIn, onActivate, onRenew, onGoogleLogin, onMobileAccountLogin, onGiftReady, onOpenRoom }: {
  license: LicenseSession | null;
  busy: boolean;
  error: string;
  signedIn: boolean;
  onActivate: (key: string) => Promise<void>;
  onRenew: () => Promise<void>;
  onGoogleLogin: () => void;
  onMobileAccountLogin: () => Promise<void>;
  onGiftReady: (key: string) => void;
  onOpenRoom: () => void;
}) {
  const [, setLocation] = useLocation();
  const [mobileRequestId, setMobileRequestId] = useState("");
  const [mobileOnboardingToken, setMobileOnboardingToken] = useState("");
  const [giftKey, setGiftKey] = useState("");
  const [mobileBusy, setMobileBusy] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const expired = Boolean(license && !isLicenseActive(license));

  const sendMobileOtp = async (phone: string): Promise<{ expiresAt: string; expiresInSeconds: number }> => {
    setMobileBusy(true);
    setMobileError("");
    try {
      const result = await apiJson<{ requestId: string; expiresAt: string; expiresInSeconds: number }>("/api/mobile-auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone, deviceId: getMobileDeviceId() }),
      });
      setMobileRequestId(result.requestId);
      return { expiresAt: result.expiresAt, expiresInSeconds: result.expiresInSeconds };
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not send the OTP.";
      setMobileError(message);
      throw new Error(message);
    } finally {
      setMobileBusy(false);
    }
  };

  const verifyMobileOtp = async (phone: string, otp: string): Promise<boolean> => {
    setMobileBusy(true);
    setMobileError("");
    try {
      const result = await apiJson<{ code?: string; onboardingToken?: string }>("/api/mobile-auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ requestId: mobileRequestId, phone, otp }),
      });
      if (result.code === "PROFILE_REQUIRED" && result.onboardingToken) {
        setMobileOnboardingToken(result.onboardingToken);
        return true;
      }
      await onMobileAccountLogin();
      setLocation("/dashboard");
      return false;
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not verify the OTP.";
      setMobileError(message);
      throw new Error(message);
    } finally {
      setMobileBusy(false);
    }
  };

  const completeMobileProfile = async (profile: AccessGateProfile) => {
    if (!mobileOnboardingToken) throw new Error("This verification has expired. Request a new OTP.");
    setMobileBusy(true);
    setMobileError("");
    try {
      const result = await apiJson<{ account: { licenseKey: string } }>("/api/mobile-auth/complete-profile", {
        method: "POST",
        body: JSON.stringify({ onboardingToken: mobileOnboardingToken, ...profile }),
      });
      await onMobileAccountLogin();
      setGiftKey(result.account.licenseKey);
      onGiftReady(result.account.licenseKey);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Could not create your workspace.";
      setMobileError(message);
      throw new Error(message);
    } finally {
      setMobileBusy(false);
    }
  };

  return <LoginPage
    expired={expired}
    error={error || mobileError}
    busy={busy || mobileBusy}
    signedIn={signedIn}
    onActivate={onActivate}
    onRenew={onRenew}
    onGoogleLogin={onGoogleLogin}
    onSendMobileOtp={sendMobileOtp}
    onVerifyMobileOtp={verifyMobileOtp}
    onCompleteProfile={completeMobileProfile}
    onOpenRoom={onOpenRoom}
  />;
}

function FirebaseAuthPage({ mode, onGoogleLogin, busy, error }: {
  mode: "sign-in" | "sign-up";
  onGoogleLogin: () => void | Promise<void>;
  busy: boolean;
  error: string;
}) {
  return <div className="auth-page">
    <div className="auth-page-backdrop" />
    <div className="auth-page-intro">
      <Link href="/" className="access-brand"><span className="access-brand-mark" aria-hidden="true"><span>S</span><i /></span><span>Streamly</span></Link>
      <p className="eyebrow">STREAMLY / ACCOUNT ACCESS</p>
      <h1>{mode === "sign-in" ? <>Keep your<br /><em>signal moving.</em></> : <>Create your<br /><em>signal room.</em></>}</h1>
      <p>{mode === "sign-in" ? "Continue with Google to return to your workspace, trial, and active plan." : "Continue with Google and your trial workspace will be ready immediately."}</p>
    </div>
    <div className="auth-card">
      <div className="firebase-auth-card">
        <p className="eyebrow">FIREBASE / SECURE ACCESS</p>
        <h2>{mode === "sign-in" ? "Welcome back." : "Start your room."}</h2>
        <p className="subtle">Your Google account is used only to connect you to your private Streamly workspace.</p>
        {error && <div className="error-note" role="alert">{error}</div>}
        <button className="button login-submit firebase-google-submit" type="button" onClick={() => void onGoogleLogin()} disabled={busy}>
          <span className="access-gate-google-mark" aria-hidden="true">G</span>
          {busy ? "Connecting…" : "Continue with Google"}
          <ArrowRight size={15}/>
        </button>
        <p className="form-note">New Google accounts receive a one-day trial workspace automatically.</p>
        <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="firebase-auth-switch">
          {mode === "sign-in" ? "Need a new workspace? Create one" : "Already have a workspace? Sign in"}
        </Link>
      </div>
    </div>
  </div>;
}

function AccountCompletionDialog({ account, onSave, onClose }: {
  account: AccountSummary;
  onSave: (profile: { displayName: string; email: string; phone?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [displayName, setDisplayName] = useState(account.displayName.startsWith("Workspace ") ? "" : account.displayName);
  const [email, setEmail] = useState(account.email);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!displayName.trim() || !email.trim()) return;
    setBusy(true);
    setError("");
    try {
      await onSave({ displayName: displayName.trim(), email: email.trim(), phone: account.phone });
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="profile-completion-backdrop" role="presentation">
    <section className="profile-completion-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-completion-title">
      <div className="profile-completion-icon"><Gift size={25}/></div>
      {!saved ? <>
        <p className="eyebrow">One last detail</p>
        <h2 id="profile-completion-title">Make the room yours.</h2>
        <p className="profile-completion-copy">Your Google account is connected. Add your name and email so your private workspace and license are easy to recover.</p>
        {error && <div className="error-note" role="alert">{error}</div>}
        <form className="profile-completion-form" onSubmit={save}>
          <label className="field"><span>Your name</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" placeholder="Your name" /></label>
          <label className="field"><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
          <button className="button login-submit" type="submit" disabled={busy || !displayName.trim() || !email.trim()}>{busy ? "Saving profile…" : "Save and continue"} <ArrowRight size={15}/></button>
        </form>
      </> : <>
        <p className="eyebrow">Your room is ready</p>
        <h2 id="profile-completion-title">A license, made for you.</h2>
        <p className="profile-completion-copy">Your trial workspace and its license have been created. Tap the gift to reveal the key, then open your room.</p>
        <button className={`profile-completion-gift ${revealed ? "revealed" : ""}`} type="button" onClick={() => setRevealed(true)} aria-label={revealed ? "License revealed" : "Reveal license"}>
          <Gift size={30}/>
          <span>{revealed ? account.licenseKey : "Tap to reveal your license"}</span>
          <Sparkles size={17}/>
        </button>
        {revealed && <button className="button login-submit" type="button" onClick={onClose}>Open my room <ArrowRight size={15}/></button>}
        {!revealed && <p className="profile-completion-footnote"><ShieldCheck size={14}/> Generated securely for this account.</p>}
      </>}
    </section>
  </div>;
}

function OwnerAccountPage({ account, onSwitchToUser }: { account: AccountSummary; onSwitchToUser: () => void }) {
  const [view, setView] = useState<"users" | "plans">("users");
  const [users, setUsers] = useState<OwnerUser[]>([]);
  const [plans, setPlans] = useState<AccountPlan[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [grantDays, setGrantDays] = useState("7");
  const [grantPlanId, setGrantPlanId] = useState("");
  const [planDraft, setPlanDraft] = useState({ name: "", description: "", durationDays: "30", price: "Contact us" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [userResult, planResult] = await Promise.all([
        apiJson<{ users: OwnerUser[] }>("/api/owner/users"),
        apiJson<{ plans: AccountPlan[] }>("/api/owner/plans"),
      ]);
      setUsers(userResult.users || []);
      setPlans(planResult.plans || []);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load owner data.");
    }
  };

  useEffect(() => { void load(); }, []);

  const grant = async (user: OwnerUser) => {
    setBusy(true); setError(""); setMessage("");
    try {
      await apiJson(`/api/owner/users/${encodeURIComponent(user.id)}/grant`, {
        method: "POST",
        body: JSON.stringify({ days: Number(grantDays), planId: grantPlanId || user.activePlanId }),
      });
      await load();
      setSelectedUser("");
      setMessage(`Access extended for ${user.displayName || user.email || "this user"}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not grant access.");
    } finally { setBusy(false); }
  };

  const createPlan = async (event: FormEvent) => {
    event.preventDefault();
    if (!planDraft.name.trim()) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await apiJson("/api/owner/plans", { method: "POST", body: JSON.stringify({
        name: planDraft.name.trim(), description: planDraft.description.trim(),
        durationDays: Number(planDraft.durationDays), price: planDraft.price.trim(),
      }) });
      setPlanDraft({ name: "", description: "", durationDays: "30", price: "Contact us" });
      await load();
      setMessage("Plan created.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create plan.");
    } finally { setBusy(false); }
  };

  const updatePlan = async (plan: AccountPlan, patch: Partial<AccountPlan>) => {
    setBusy(true); setError(""); setMessage("");
    try {
      await apiJson(`/api/owner/plans/${encodeURIComponent(plan.id)}`, { method: "PUT", body: JSON.stringify(patch) });
      await load();
      setMessage("Plan updated.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update plan.");
    } finally { setBusy(false); }
  };

  return <div className="owner-page">
    <header className="owner-topbar"><Brand/><div className="actions"><span className="owner-user-label">{account.email || account.displayName}</span><button className="button secondary" onClick={onSwitchToUser} data-testid="button-switch-user-view"><LayoutDashboard size={14}/> Normal user view</button></div></header>
    <main className="owner-content">
      <div className="page-head"><div><p className="eyebrow">Owner control room</p><h1>Accounts & access</h1><p className="subtle">Review user history, extend access, and control the plans that drive trials and purchases.</p></div><div className="status live"><span className="status-dot"/>Google account owner</div></div>
      {error && <div className="error-note">{error}</div>}{message && <div className="owner-success">{message}</div>}
      <div className="owner-tabs"><button className={`owner-tab ${view === "users" ? "active" : ""}`} onClick={() => setView("users")}><ShieldCheck size={15}/> Users <span>{users.length}</span></button><button className={`owner-tab ${view === "plans" ? "active" : ""}`} onClick={() => setView("plans")}><Gauge size={15}/> Plans <span>{plans.length}</span></button></div>
      {view === "users" ? <section className="card section-card owner-list"><div className="section-head"><div><h2 className="section-title">Users</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Trial starts, purchases, owner grants, and current access are kept together.</p></div><Clipboard size={17} color="#6c8b83"/></div>{users.length === 0 ? <EmptyState icon={<ShieldCheck size={21}/>} title="No Google accounts yet" copy="New accounts appear here after their first sign-in."/> : <div className="account-user-list">{users.map((user) => { const expanded = selectedUser === user.id; const active = user.active && new Date(user.accessEndsAt).getTime() > Date.now(); return <article className={`account-user-row ${expanded ? "expanded" : ""}`} key={user.id}><div className="account-user-main"><div className="account-avatar">{(user.displayName || user.email || "U").slice(0, 1).toUpperCase()}</div><div><strong>{user.displayName || "Unnamed account"}</strong><span>{user.email || user.id}</span><small>{user.activePlan?.name || user.activePlanId} · access until {new Date(user.accessEndsAt).toLocaleString()}</small></div></div><div className={`status ${active ? "live" : "stopped"}`}><span className="status-dot"/>{active ? "Active" : "Expired"}</div><button className="button secondary small" onClick={() => setSelectedUser(expanded ? "" : user.id)}>{expanded ? "Close" : "Manage"}</button>{expanded && <div className="account-user-details"><div className="grant-grid"><div className="field"><label>Extend by days</label><input type="number" min="1" max="3650" value={grantDays} onChange={(event) => setGrantDays(event.target.value)} /></div><div className="field"><label>Plan</label><select value={grantPlanId || user.activePlanId} onChange={(event) => setGrantPlanId(event.target.value)}>{plans.map((plan) => <option value={plan.id} key={plan.id}>{plan.name} · {plan.durationDays} days</option>)}</select></div><button className="button" onClick={() => void grant(user)} disabled={busy}>Grant access <Plus size={14}/></button></div><div className="account-history"><strong>History</strong>{(user.history || []).length === 0 ? <span className="subtle">No history yet.</span> : user.history.map((item) => <div key={item.id}><span>{item.message}</span><small>{new Date(item.at).toLocaleString()}</small></div>)}</div></div>}</article>; })}</div>}</section>
        : <div className="owner-plans-layout"><section className="card section-card"><div className="section-head"><div><h2 className="section-title">Create a plan</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Set trial or paid duration in days. Every plan receives a stable ID.</p></div><Plus size={17} color="#6c8b83"/></div><form className="plan-create-form" onSubmit={createPlan}><div className="field"><label>Name</label><input value={planDraft.name} onChange={(event) => setPlanDraft({ ...planDraft, name: event.target.value })} placeholder="7 day launch offer"/></div><div className="field"><label>Duration in days</label><input type="number" min="1" max="3650" value={planDraft.durationDays} onChange={(event) => setPlanDraft({ ...planDraft, durationDays: event.target.value })}/></div><div className="field"><label>Price label</label><input value={planDraft.price} onChange={(event) => setPlanDraft({ ...planDraft, price: event.target.value })} placeholder="₹799"/></div><div className="field"><label>Description</label><input value={planDraft.description} onChange={(event) => setPlanDraft({ ...planDraft, description: event.target.value })} placeholder="What this plan includes"/></div><button className="button" type="submit" disabled={busy || !planDraft.name.trim()}><Plus size={14}/> Add plan</button></form></section><section className="card section-card"><div className="section-head"><div><h2 className="section-title">Plan settings</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Update duration, pricing text, or availability without changing the plan ID.</p></div><Settings size={17} color="#6c8b83"/></div><div className="plan-list">{plans.map((plan) => <div className="plan-row" key={plan.id}><div><strong>{plan.name}{plan.isTrial ? " · trial" : ""}</strong><span className="mono">{plan.id}</span><small>{plan.description || "No description"}</small></div><div className="plan-edit-fields"><input type="number" min="1" max="3650" defaultValue={plan.durationDays} aria-label={`${plan.name} duration`} onBlur={(event) => { const value = Number(event.target.value); if (value !== plan.durationDays) void updatePlan(plan, { durationDays: value }); }}/><input defaultValue={plan.price} aria-label={`${plan.name} price`} onBlur={(event) => { if (event.target.value !== plan.price) void updatePlan(plan, { price: event.target.value }); }}/><button className={`toggle ${plan.active ? "on" : ""}`} onClick={() => void updatePlan(plan, { active: !plan.active })} aria-label={`${plan.active ? "Disable" : "Enable"} ${plan.name}`}><span/></button></div></div>)}</div></section></div>}
    </main>
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

function OwnerFoldersPage({ ownerPassword, onBack, onKeys, onNavigate }: { ownerPassword: string; onBack: () => void; onKeys?: () => void; onNavigate?: (section: OwnerSection) => void }) {
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

  return <div className="owner-page owner-folders-page">{onNavigate && <OwnerDesktopSidebar active="folders" onNavigate={onNavigate} />}
    <header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>My Folder</strong></div><div className="actions"><button className="button secondary" onClick={onBack}><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Dashboard</button></div></header>
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
    {onKeys && <OwnerMobileNav active="dashboard" onDashboard={onBack} onKeys={onKeys} />}
  </div>;
}

function OwnerMobileNav({ active, onDashboard, onKeys }: { active: "dashboard" | "keys"; onDashboard: () => void; onKeys: () => void }) {
  return <nav className="owner-tab-bar" aria-label="Owner navigation">
    <button className={`owner-tab-link ${active === "dashboard" ? "active" : ""}`} onClick={onDashboard} type="button"><LayoutDashboard size={18}/><span>Dashboard</span></button>
    <button className={`owner-tab-link ${active === "keys" ? "active" : ""}`} onClick={onKeys} type="button"><KeyRound size={18}/><span>Key</span></button>
  </nav>;
}

type OwnerSection = "dashboard" | "folders" | "animations" | "licenses" | "users" | "keys";

function OwnerDesktopSidebar({ active, onNavigate }: { active: OwnerSection; onNavigate: (section: OwnerSection) => void }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("loop-owner-sidebar") === "collapsed");
  const items: Array<{ section: OwnerSection; label: string; icon: typeof LayoutDashboard }> = [
    { section: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { section: "folders", label: "My Folder", icon: FolderOpen },
    { section: "animations", label: "Include Animation", icon: Upload },
    { section: "licenses", label: "License key", icon: KeyRound },
    { section: "users", label: "Users", icon: Users },
    { section: "keys", label: "Key", icon: ShieldCheck },
  ];
  const toggle = () => setCollapsed((current) => {
    const next = !current;
    localStorage.setItem("loop-owner-sidebar", next ? "collapsed" : "expanded");
    return next;
  });
  return <aside className={`owner-sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Owner navigation">
    <div className="owner-sidebar-brand"><span className="owner-sidebar-mark">S</span><div className="owner-sidebar-brand-copy"><strong>Slash Owner</strong><small>Control room</small></div><button className="owner-sidebar-toggle" type="button" onClick={toggle} aria-label={collapsed ? "Expand owner navigation" : "Minimize owner navigation"} aria-expanded={!collapsed}><Menu size={17}/></button></div>
    <div className="owner-sidebar-label">Workspace</div>
    <nav>{items.map(({ section, label, icon: Icon }) => <button key={section} className={active === section ? "active" : ""} onClick={() => onNavigate(section)} type="button"><Icon size={16}/><span>{label}</span></button>)}</nav>
    <div className="owner-sidebar-footer"><ShieldCheck size={14}/><span>Private owner access</span></div>
  </aside>;
}

function OwnerKeysPanel({ tokens, tokenDraft, keyBusy, error, onDraftChange, onAdd, onRemove, onDashboard, onNavigate }: {
  tokens: VidKrakenTokenStatus[];
  tokenDraft: string;
  keyBusy: boolean;
  error: string;
  onDraftChange: (value: string) => void;
  onAdd: (event: FormEvent) => void;
  onRemove: (token: VidKrakenTokenStatus) => void;
  onDashboard: () => void;
  onNavigate?: (section: OwnerSection) => void;
}) {
  return <div className="owner-page owner-key-page">{onNavigate && <OwnerDesktopSidebar active="keys" onNavigate={onNavigate} />}
    <header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>Key</strong></div></header>
    <main className="owner-content">
      <div className="page-head owner-page-heading"><div><p className="eyebrow">System access</p><h1>Key</h1><p className="subtle">Manage the secure VidKraken key pool used for YouTube downloads.</p></div><div className="owner-page-badge"><KeyRound size={16}/> {tokens.length} configured</div></div>
      {error && <div className="error-note">{error}</div>}
      <OwnerMobileNav active="keys" onDashboard={onDashboard} onKeys={() => undefined} />
      <section className="card section-card owner-key-card"><div className="section-head"><div><h2 className="section-title">Add a key</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Key values stay hidden after they are saved.</p></div><KeyRound size={18} color="#5b52c7"/></div><form className="owner-key-form" onSubmit={onAdd}><div className="field"><label htmlFor="owner-vidkraken-token">VidKraken key</label><input id="owner-vidkraken-token" type="password" autoComplete="new-password" value={tokenDraft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Paste key securely" disabled={keyBusy} data-testid="input-owner-key"/></div><button className="button" type="submit" disabled={keyBusy || !tokenDraft.trim()}><Plus size={15}/> Add key</button></form>{tokens.length === 0 ? <EmptyState icon={<KeyRound size={21}/>} title="No keys yet" copy="Add a key to enable YouTube downloads."/> : <div className="key-list">{tokens.map((token) => { const cooling = token.status === "cooldown"; return <div className="key-row" key={token.key} data-testid={`row-owner-key-${token.key}`}><div><strong>{token.key}</strong><span className="subtle">Secret value hidden</span></div><div className={`status ${cooling ? "stopped" : "live"}`}><span className="status-dot"/>{cooling && token.cooldownUntil ? `Cooldown until ${new Date(token.cooldownUntil).toLocaleTimeString()}` : "Ready"}</div><button className="icon-button" onClick={() => onRemove(token)} disabled={keyBusy} title={`Delete ${token.key}`} aria-label={`Delete ${token.key}`}><Trash2 size={13}/></button></div>; })}</div>}</section>
    </main>
  </div>;
}

function OwnerLicensePage({ licenses, name, days, busy, error, message, onNameChange, onDaysChange, onCreate, onRenew, onRemove, onRecover, onDashboard, onKeys, onNavigate }: {
  licenses: LicenseSession[];
  name: string;
  days: string;
  busy: boolean;
  error: string;
  message: string;
  onNameChange: (value: string) => void;
  onDaysChange: (value: string) => void;
  onCreate: (event: FormEvent) => void;
  onRenew: (licenseId: string) => void;
  onRemove: (license: LicenseSession) => void;
  onRecover: (license: LicenseSession) => void;
  onDashboard: () => void;
  onKeys: () => void;
  onNavigate?: (section: OwnerSection) => void;
}) {
  return <div className="owner-page owner-license-page">{onNavigate && <OwnerDesktopSidebar active="licenses" onNavigate={onNavigate} />}
    <header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>License key</strong></div><button className="button secondary owner-desktop-back" onClick={onDashboard} type="button"><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to dashboard</button></header>
    <main className="owner-content">
      <div className="page-head owner-page-heading"><div><p className="eyebrow">Customer access</p><h1>License key</h1><p className="subtle">Create, recover, renew, and remove workspace access keys from one place.</p></div><div className="owner-page-badge"><KeyRound size={16}/> {licenses.length} configured</div></div>
      {error && <div className="error-note">{error}</div>}{message && <div className="owner-success">{message}</div>}
      <OwnerMobileNav active="dashboard" onDashboard={onDashboard} onKeys={onKeys} />
      <section className="card section-card owner-create"><div className="section-head"><div><h2 className="section-title">Create license key</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Create a separate workspace and access key for each customer.</p></div><KeyRound size={18} color="#5b52c7"/></div><form className="owner-create-form" onSubmit={onCreate}><div className="field"><label>Customer / workspace name</label><input value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Studio A" data-testid="input-license-name"/></div><div className="field"><label>Valid for days</label><input type="number" min="1" max="3650" value={days} onChange={(event) => onDaysChange(event.target.value)} data-testid="input-license-days"/></div><button className="button" type="submit" disabled={busy || !name.trim()}><Plus size={15}/> Create license key</button></form></section>
      <section className="card section-card owner-list"><div className="section-head"><div><h2 className="section-title">Existing license keys</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Recover a key for a customer or renew their access.</p></div><KeyRound size={18} color="#5b52c7"/></div>{licenses.length === 0 ? <EmptyState icon={<KeyRound size={21}/>} title="No license keys yet" copy="Create the first key above to give a workspace access."/> : <div className="license-list">{licenses.map((license) => { const active = isLicenseActive(license); return <div className="license-row" key={license.licenseId}><div className="license-row-main"><div className="license-key-badge"><KeyRound size={15}/></div><div><strong>{license.name}</strong><span className="mono">{license.key}</span></div></div><div className={`status ${active ? "live" : "stopped"}`}><span className="status-dot"/>{active ? "Active" : "Expired"} · {new Date(license.expiresAt).toLocaleDateString()}</div><div className="actions"><button className="button secondary small" onClick={() => onRecover(license)} disabled={busy}><KeyRound size={13}/> Recover</button><button className="button secondary small" onClick={() => onRenew(license.licenseId)} disabled={busy}>Renew</button><button className="icon-button" onClick={() => onRemove(license)} disabled={busy} title="Delete license" aria-label={`Delete ${license.name}`}><Trash2 size={13}/></button></div></div>; })}</div>}</section>
    </main>
  </div>;
}

function OwnerDashboardPage({ ownerPassword, error, message, keyBusy, showIncludedAnimations, onFolder, onAnimations, onLicense, onKeys, onUsers, onNavigate, onCloseAnimations }: {
  ownerPassword: string;
  error: string;
  message: string;
  keyBusy: boolean;
  showIncludedAnimations: boolean;
  onFolder: () => void;
  onAnimations: () => void;
  onLicense: () => void;
  onKeys: () => void;
  onCloseAnimations: () => void;
  onUsers?: () => void;
  onNavigate?: (section: OwnerSection) => void;
}) {
  return <div className="owner-page owner-dashboard-page">{onNavigate && <OwnerDesktopSidebar active="dashboard" onNavigate={onNavigate} />}
    <header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>Dashboard</strong></div><span className="owner-secure-label"><ShieldCheck size={15}/> Secure owner workspace</span></header>
    <main className="owner-content">
      <div className="page-head owner-page-heading"><div><p className="eyebrow">Owner workspace</p><h1>Dashboard</h1><p className="subtle">Choose a workspace area to manage your folders, animations, or system access.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Connected</div></div>
      {error && <div className="error-note">{error}</div>}{message && <div className="owner-success">{message}</div>}
      <OwnerMobileNav active="dashboard" onDashboard={() => undefined} onKeys={onKeys} />
      <section className="owner-action-grid" aria-label="Owner actions">
        <button className="owner-action-card folder" onClick={onFolder}><span className="owner-action-icon"><FolderOpen size={22}/></span><span><strong>My Folder</strong><small>Organize shared animation folders and videos.</small></span><ArrowRight size={17}/></button>
        <button className="owner-action-card animation" onClick={onAnimations}><span className="owner-action-icon"><Upload size={22}/></span><span><strong>Include Animation</strong><small>Add videos available to every active license.</small></span><ArrowRight size={17}/></button>
        <button className="owner-action-card license" onClick={onLicense}><span className="owner-action-icon"><KeyRound size={22}/></span><span><strong>License key</strong><small>Create and recover customer access keys.</small></span><ArrowRight size={17}/></button>
         <button className="owner-action-card system-key" onClick={onKeys} disabled={keyBusy}><span className="owner-action-icon"><ShieldCheck size={22}/></span><span><strong>Key</strong><small>Manage the secure downloader key pool.</small></span><ArrowRight size={17}/></button>
         {onUsers && <button className="owner-action-card users" onClick={onUsers}><span className="owner-action-icon"><Users size={22}/></span><span><strong>Users</strong><small>Review account identity, plans, keys, and history.</small></span><ArrowRight size={17}/></button>}
      </section>
    </main>
    {showIncludedAnimations && <IncludedAnimationsModal ownerPassword={ownerPassword} onClose={onCloseAnimations} />}
  </div>;
}

function OwnerUsersPage({ ownerPassword, onNavigate }: { ownerPassword: string; onNavigate: (section: OwnerSection) => void }) {
  const [users, setUsers] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const result = await apiJson<{ users: OwnerUser[] }>("/api/owner/users", { headers: { "X-Owner-Password": ownerPassword } });
      setUsers(result.users || []); setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, [ownerPassword]);
  const downloadUserInvoice = (user: OwnerUser, item: AccountHistoryItem) => {
    const text = ["LOOP STREAM ACCOUNT INVOICE", "--------------------------", `Reference: ${item.id}`, `Date: ${new Date(item.at).toLocaleString()}`, `Customer: ${user.displayName || user.email}`, `Email: ${user.email}`, `Mobile: ${user.phone || "Not provided"}`, `License key: ${user.licenseKey}`, `Plan: ${user.activePlan?.name || item.planId || "Subscription"}`, `Access duration: ${item.days || 0} days`, `Stream limit: ${item.streamLimit || user.streamLimit}`].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `invoice-${user.id}-${item.id}.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  return <div className="owner-page owner-users-page"><OwnerDesktopSidebar active="users" onNavigate={onNavigate}/><header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>Users</strong></div><button className="button secondary" onClick={() => void load()} disabled={loading}>Refresh</button></header><main className="owner-content"><div className="page-head owner-page-heading"><div><p className="eyebrow">Customer accounts</p><h1>Users</h1><p className="subtle">Every account keeps one generated license key and one workspace. Renewals update the same access record.</p></div><div className="owner-page-badge"><Users size={16}/> {users.length} accounts</div></div>{error && <div className="error-note">{error}</div>}{loading ? <div className="owner-users-empty">Loading account records…</div> : users.length === 0 ? <div className="owner-users-empty">No user accounts yet.</div> : <div className="owner-users-list">{users.map((user) => { const expanded = selected === user.id; const history = user.history.filter((item) => item.type === "purchase" || item.type === "grant"); const active = user.active && new Date(user.accessEndsAt).getTime() > Date.now(); return <article className={`owner-user-card ${expanded ? "expanded" : ""}`} key={user.id}><div className="owner-user-card-main"><div className="account-avatar">{(user.displayName || user.email || "U").slice(0, 1).toUpperCase()}</div><div className="owner-user-identity"><strong>{user.displayName || "Unnamed account"}</strong><span>{user.email || "No email"}{user.phone ? ` · ${user.phone}` : ""}</span><small>Registered {new Date(user.createdAt).toLocaleDateString()}</small></div><div className={`status ${active ? "live" : "stopped"}`}><span className="status-dot"/>{active ? "Active" : "Expired"}</div><button className="button secondary small" onClick={() => setSelected(expanded ? "" : user.id)}>{expanded ? "Close" : "View account"}</button></div>{expanded && <div className="owner-user-detail-grid"><div><span className="metric-kicker">License key</span><strong className="mono">{user.licenseKey}</strong><small>One key for this account</small></div><div><span className="metric-kicker">Active subscription</span><strong>{user.activePlan?.name || user.activePlanId || "None"}</strong><small>Until {new Date(user.accessEndsAt).toLocaleString()}</small></div><div><span className="metric-kicker">Stream limit</span><strong>{user.streamLimit}</strong><small>simultaneous streams</small></div><div className="owner-user-history"><span className="metric-kicker">Subscription history</span>{history.length === 0 ? <small>No paid subscription history.</small> : history.map((item) => <div key={item.id}><span>{item.message} · {item.days || 0} days</span><small>{new Date(item.at).toLocaleString()}</small><button className="button ghost small" onClick={() => downloadUserInvoice(user, item)}><Download size={12}/> Invoice</button></div>)}</div></div>}</article>; })}</div>}</main></div>;
}

function OwnerConsolePage() {
  const [password, setPassword] = useState("");
  const [authorizedPassword, setAuthorizedPassword] = useState("");
  const [licenses, setLicenses] = useState<LicenseSession[]>([]);
  const [vidKrakenTokens, setVidKrakenTokens] = useState<VidKrakenTokenStatus[]>([]);
  const [tokenDraft, setTokenDraft] = useState("");
  const [keyBusy, setKeyBusy] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState("30");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showIncludedAnimations, setShowIncludedAnimations] = useState(false);
  const [ownerView, setOwnerView] = useState<"dashboard" | "licenses" | "keys" | "folders" | "users">("dashboard");

  const load = async (ownerPassword: string) => {
    const result = await apiJson<{ licenses?: LicenseSession[] }>("/api/licenses", { headers: { "X-Owner-Password": ownerPassword } });
    if (!Array.isArray(result?.licenses)) throw new Error("License list could not be loaded. Please try again.");
    setLicenses(result.licenses);
  };
  const loadVidKrakenTokens = async (ownerPassword: string) => {
    const result = await apiJson<{ count: number; tokens: VidKrakenTokenStatus[] }>("/api/owner/vidkraken-keys", { headers: { "X-Owner-Password": ownerPassword } });
    if (!Array.isArray(result?.tokens)) throw new Error("Key list could not be loaded.");
    setVidKrakenTokens(result.tokens);
  };
  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await load(password); await loadVidKrakenTokens(password); setAuthorizedPassword(password); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Owner access was denied."); }
    finally { setBusy(false); }
  };
  const openKeys = async () => {
    setKeyBusy(true); setError("");
    try { await loadVidKrakenTokens(authorizedPassword); setOwnerView("keys"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load keys."); }
    finally { setKeyBusy(false); }
  };
  const navigateOwner = (section: OwnerSection) => {
    if (section === "animations") {
      setShowIncludedAnimations(true);
      return;
    }
    if (section === "keys") {
      void openKeys();
      return;
    }
    setOwnerView(section);
  };
  const addToken = async (event: FormEvent) => {
    event.preventDefault(); if (!tokenDraft.trim()) return;
    setKeyBusy(true); setError("");
    try { await apiJson("/api/owner/vidkraken-keys", { method: "POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ token: tokenDraft }) }); setTokenDraft(""); await loadVidKrakenTokens(authorizedPassword); setMessage("Key added."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add the key."); }
    finally { setKeyBusy(false); }
  };
  const removeToken = async (token: VidKrakenTokenStatus) => {
    if (!window.confirm(`Delete ${token.key} from the key pool?`)) return;
    setKeyBusy(true); setError("");
    try { await apiJson(`/api/owner/vidkraken-keys/${encodeURIComponent(token.key)}`, { method: "DELETE", headers: { "X-Owner-Password": authorizedPassword } }); await loadVidKrakenTokens(authorizedPassword); setMessage("Key removed."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete the key."); }
    finally { setKeyBusy(false); }
  };
  const create = async (event: FormEvent) => {
    event.preventDefault(); if (!name.trim()) return;
    setBusy(true); setError(""); setMessage("");
    try { await apiJson<LicenseSession>("/api/licenses", { method: "POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ name: name.trim(), days: Number(days) }) }); setName(""); await load(authorizedPassword); setMessage("License key created."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create the license key."); }
    finally { setBusy(false); }
  };
  const renew = async (licenseId: string) => {
    setBusy(true); setError(""); setMessage("");
    try { await apiJson<LicenseSession>(`/api/licenses/${encodeURIComponent(licenseId)}/renew`, { method: "POST", headers: { "X-Owner-Password": authorizedPassword }, body: JSON.stringify({ days: 30 }) }); await load(authorizedPassword); setMessage("License key renewed for 30 days."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not renew the license key."); }
    finally { setBusy(false); }
  };
  const remove = async (license: LicenseSession) => {
    if (!window.confirm(`Delete ${license.name} and its workspace data?`)) return;
    setBusy(true); setError(""); setMessage("");
    try { await apiJson(`/api/licenses/${encodeURIComponent(license.licenseId)}`, { method: "DELETE", headers: { "X-Owner-Password": authorizedPassword } }); await load(authorizedPassword); setMessage("License key removed."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not delete the license key."); }
    finally { setBusy(false); }
  };
  const recover = async (license: LicenseSession) => {
    try {
      await navigator.clipboard.writeText(license.key);
      setMessage(`License key for ${license.name} copied.`);
    } catch {
      setMessage(`License key: ${license.key}`);
    }
  };
  const goDashboard = () => setOwnerView("dashboard");

  if (!authorizedPassword) return <div className="owner-login-page"><section className="owner-login-panel"><div className="owner-login-mark"><KeyRound size={22}/></div><p className="eyebrow">Slash Owner</p><h1>Owner console</h1><p className="subtle">Create license keys, manage shared animations, and keep system keys organized.</p>{error && <div className="error-note">{error}</div>}<form className="login-form" onSubmit={signIn}><div className="field"><label htmlFor="slash-owner-password">Owner password</label><input id="slash-owner-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" autoFocus data-testid="input-owner-password"/></div><button className="button login-submit" type="submit" disabled={busy || !password} data-testid="button-owner-login">{busy ? "Checking…" : "Open dashboard"} <ArrowRight size={16}/></button></form></section></div>;
  if (ownerView === "folders") return <OwnerFoldersPage ownerPassword={authorizedPassword} onBack={goDashboard} onKeys={openKeys} onNavigate={navigateOwner} />;
  if (ownerView === "keys") return <OwnerKeysPanel tokens={vidKrakenTokens} tokenDraft={tokenDraft} keyBusy={keyBusy} error={error} onDraftChange={setTokenDraft} onAdd={(event) => void addToken(event)} onRemove={(token) => void removeToken(token)} onDashboard={goDashboard} onNavigate={navigateOwner} />;
  if (ownerView === "licenses") return <OwnerLicensePage licenses={licenses} name={name} days={days} busy={busy} error={error} message={message} onNameChange={setName} onDaysChange={setDays} onCreate={(event) => void create(event)} onRenew={(licenseId) => void renew(licenseId)} onRemove={(license) => void remove(license)} onRecover={(license) => void recover(license)} onDashboard={goDashboard} onKeys={openKeys} onNavigate={navigateOwner} />;
  if (ownerView === "users") return <OwnerUsersPage ownerPassword={authorizedPassword} onNavigate={navigateOwner} />;
  if (ownerView === "dashboard") return <OwnerDashboardPage ownerPassword={authorizedPassword} error={error} message={message} keyBusy={keyBusy} showIncludedAnimations={showIncludedAnimations} onFolder={() => setOwnerView("folders")} onAnimations={() => setShowIncludedAnimations(true)} onLicense={() => setOwnerView("licenses")} onKeys={openKeys} onUsers={() => setOwnerView("users")} onNavigate={navigateOwner} onCloseAnimations={() => setShowIncludedAnimations(false)} />;

  return <div className="owner-page owner-dashboard-page">
    <header className="owner-topbar"><div className="owner-topbar-title"><span className="owner-topbar-kicker">Slash Owner</span><strong>Dashboard</strong></div><span className="owner-secure-label"><ShieldCheck size={15}/> Secure owner workspace</span></header>
    <main className="owner-content">
      <div className="page-head owner-page-heading"><div><p className="eyebrow">Owner workspace</p><h1>Dashboard</h1><p className="subtle">Choose a workspace area to manage your folders, animations, or system access.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Connected</div></div>
      {error && <div className="error-note">{error}</div>}{message && <div className="owner-success">{message}</div>}
      <OwnerMobileNav active="dashboard" onDashboard={goDashboard} onKeys={openKeys} />
      <section className="owner-action-grid" aria-label="Owner actions">
        <button className="owner-action-card folder" onClick={() => setOwnerView("folders")}><span className="owner-action-icon"><FolderOpen size={22}/></span><span><strong>My Folder</strong><small>Organize shared animation folders and videos.</small></span><ArrowRight size={17}/></button>
        <button className="owner-action-card animation" onClick={() => setShowIncludedAnimations(true)}><span className="owner-action-icon"><Upload size={22}/></span><span><strong>Include Animation</strong><small>Add videos available to every active license.</small></span><ArrowRight size={17}/></button>
        <button className="owner-action-card license" onClick={() => setOwnerView("licenses")}><span className="owner-action-icon"><KeyRound size={22}/></span><span><strong>License key</strong><small>Create and recover customer access keys.</small></span><ArrowRight size={17}/></button>
        <button className="owner-action-card system-key" onClick={() => void openKeys()} disabled={keyBusy}><span className="owner-action-icon"><ShieldCheck size={22}/></span><span><strong>Key</strong><small>Manage the secure downloader key pool.</small></span><ArrowRight size={17}/></button>
      </section>
      <section className="card section-card owner-create"><div className="section-head"><div><h2 className="section-title">Create license key</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>Create a separate workspace and access key for each customer.</p></div><KeyRound size={18} color="#5b52c7"/></div><form className="owner-create-form" onSubmit={create}><div className="field"><label>Customer / workspace name</label><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Studio A" data-testid="input-license-name"/></div><div className="field"><label>Valid for days</label><input type="number" min="1" max="3650" value={days} onChange={(event) => setDays(event.target.value)} data-testid="input-license-days"/></div><button className="button" type="submit" disabled={busy || !name.trim()}><Plus size={15}/> Create key</button></form></section>
      <section className="card section-card owner-list"><div className="section-head"><div><h2 className="section-title">License keys</h2><p className="subtle" style={{ margin: "5px 0 0", fontSize: 11 }}>{licenses.length} key{licenses.length === 1 ? "" : "s"} · Recover or renew access below.</p></div><KeyRound size={18} color="#5b52c7"/></div>{licenses.length === 0 ? <EmptyState icon={<KeyRound size={21}/>} title="No license keys yet" copy="Create the first key above to give a workspace access."/> : <div className="license-list">{licenses.map((license) => { const active = isLicenseActive(license); return <div className="license-row" key={license.licenseId}><div className="license-row-main"><div className="license-key-badge"><KeyRound size={15}/></div><div><strong>{license.name}</strong><span className="mono">{license.key}</span></div></div><div className={`status ${active ? "live" : "stopped"}`}><span className="status-dot"/>{active ? "Active" : "Expired"} · {new Date(license.expiresAt).toLocaleDateString()}</div><div className="actions"><button className="button secondary small" onClick={() => void recover(license)} disabled={busy}><KeyRound size={13}/> Recover</button><button className="button secondary small" onClick={() => void renew(license.licenseId)} disabled={busy}>Renew</button><button className="icon-button" onClick={() => void remove(license)} disabled={busy} title="Delete license" aria-label={`Delete ${license.name}`}><Trash2 size={13}/></button></div></div>; })}</div>}</section>
    </main>
    {showIncludedAnimations && <IncludedAnimationsModal ownerPassword={authorizedPassword} onClose={() => setShowIncludedAnimations(false)} />}
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

function Metric({ label, value, detail, image, dim }: { label:string; value:string|number; detail:string; image?:string; dim?:boolean }) {
  return <div className="card metric" data-testid={`metric-${label.toLowerCase().replaceAll(" ","-")}`}>
    {image && <div className="metric-art" aria-hidden="true"><img src={image} alt="" /></div>}
    <div className="metric-copy"><div className="metric-kicker">{label}</div><div className="metric-value">{value}</div><div className={`metric-delta ${dim ? "dim":""}`}>{detail}</div></div>
  </div>;
}

function ActivityList({ activities }: { activities:Activity[] }) {
  const Icon = ({type}:{type:string}) => type==="live" ? <Radio size={14}/> : type==="video" ? <FileVideo size={14}/> : type==="group" ? <FolderOpen size={14}/> : <Pencil size={14}/>;
  return <div className="activity">{activities.map(a=><div className="activity-item" key={a.id} data-testid={`activity-${a.id}`}><div className="activity-icon"><Icon type={a.type}/></div><div><p className="activity-message">{a.message}</p><div className="activity-time">{a.time}</div></div></div>)}</div>;
}

function AccountAccessTimer({ account }: { account?: AccountSummary | null }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const update = () => {
      if (!account) return setRemaining("");
      const ms = Math.max(0, new Date(account.accessEndsAt).getTime() - Date.now());
      const hours = Math.floor(ms / 3_600_000);
      const minutes = Math.floor((ms % 3_600_000) / 60_000);
      const seconds = Math.floor((ms % 60_000) / 1000);
      setRemaining(ms > 0 ? `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s` : "Expired");
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [account?.accessEndsAt]);
  if (!account || !remaining) return null;
  return <div className={`account-access-timer ${remaining === "Expired" ? "expired" : ""}`}><span className="status-dot"/><span>{account.activePlan?.name || "Access"} · {remaining}</span></div>;
}

function PhoneProfileCard({ onSave }: { onSave: (phone: string) => Promise<void> }) {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!phone.trim()) return;
    setBusy(true); setMessage("");
    try { await onSave(phone.trim()); setMessage("Mobile number saved to this account."); }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : "Could not save the number."); }
    finally { setBusy(false); }
  };
  return <section className="account-profile-card"><div><p className="eyebrow">Account profile</p><h2>Add a mobile number</h2><p className="subtle">Keep it linked to this Google account. OTP login can use this same account when mobile sign-in is enabled.</p></div><form onSubmit={save}><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" aria-label="Mobile number"/><button className="button" type="submit" disabled={busy || !phone.trim()}>{busy ? "Saving…" : "Save number"} <Check size={14}/></button></form>{message && <span className="form-hint">{message}</span>}</section>;
}

function SubscriptionPage({ workspace, account, plans, onSelectPlan }: { workspace: ReturnType<typeof useWorkspace>; account: AccountSummary; plans: AccountPlan[]; onSelectPlan: (planId: string, streamLimit: number, durationMultiplier?: number) => Promise<AccountSummary> }) {
  const [billing, setBilling] = useState<"Day" | "Month" | "Year">("Day");
  const [duration, setDuration] = useState(1);
  const [streamCounts, setStreamCounts] = useState({ standard: 9, premium: 9 });
  const [busyPlan, setBusyPlan] = useState("");
  const [message, setMessage] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"all" | "purchase" | "grant">("all");
  const [historySearch, setHistorySearch] = useState("");
  const [historyRange, setHistoryRange] = useState<"all" | "30" | "90" | "365">("all");
  const pricing = {
    Day: { unit: "day", limit: 30, standard: 35, standardCompare: 50, premium: 51, premiumCompare: 76, standardId: "day-standard", premiumId: "day-premium" },
    Month: { unit: "month", limit: 12, standard: 899, standardCompare: 1199, premium: 1299, premiumCompare: 1699, standardId: "monthly-standard", premiumId: "monthly-premium" },
    Year: { unit: "year", limit: 5, standard: 8999, standardCompare: 11999, premium: 12999, premiumCompare: 16999, standardId: "annual-standard", premiumId: "annual-premium" },
  } as const;
  const selected = pricing[billing];
  const findPlan = (id: string) => plans.find((plan) => plan.id === id);
  const changeStreams = (kind: "standard" | "premium", change: number) => setStreamCounts((current) => ({ ...current, [kind]: Math.min(10, Math.max(1, current[kind] + change)) }));
  const activate = async (planId: string, streams: number) => {
    setBusyPlan(planId); setMessage("");
    try {
      await onSelectPlan(planId, streams, duration);
      setMessage("Plan active. Your existing license key and workspace are unchanged.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not activate this plan.");
    } finally {
      setBusyPlan("");
    }
  };
  const downloadInvoice = (item: AccountHistoryItem) => {
    const plan = item.planId ? findPlan(item.planId) : undefined;
    const text = [
      "LOOP STREAM INVOICE",
      "-------------------",
      `Invoice reference: ${item.id}`,
      `Date: ${new Date(item.at).toLocaleString()}`,
      `Customer: ${account.displayName || account.email}`,
      `Email: ${account.email}`,
      `License key: ${account.licenseKey}`,
      `Plan: ${plan?.name || item.planId || "Subscription"}`,
      `Access duration: ${item.days || plan?.durationDays || 0} days`,
      `Stream limit: ${item.streamLimit || account.streamLimit}`,
      "",
      "Payment gateway receipt will replace this account invoice after Cashfree checkout is connected.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `loop-stream-invoice-${item.id}.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  const active = account.active && new Date(account.accessEndsAt).getTime() > Date.now();
  const trial = findPlan("trial-1-day");
  const trialActive = account.activePlanId === trial?.id && active;
  const dayMs = 24 * 60 * 60 * 1000;
  const billingHistory = account.history.filter((item) => item.type === "purchase" || item.type === "grant");
  const filteredHistory = billingHistory.filter((item) => {
    const matchesType = historyFilter === "all" || item.type === historyFilter;
    const plan = item.planId ? findPlan(item.planId) : undefined;
    const searchValue = `${item.message} ${plan?.name || ""} ${item.planId || ""} ${item.id}`.toLowerCase();
    const matchesSearch = !historySearch.trim() || searchValue.includes(historySearch.trim().toLowerCase());
    const rangeDays = historyRange === "all" ? null : Number(historyRange);
    const matchesRange = rangeDays === null || Date.now() - new Date(item.at).getTime() <= rangeDays * dayMs;
    return matchesType && matchesSearch && matchesRange;
  });
  const clearHistoryFilters = () => {
    setHistoryFilter("all");
    setHistorySearch("");
    setHistoryRange("all");
  };
  const paidOptions = [
    { kind: "standard" as const, label: "STANDARD", title: "1080p Standard", id: selected.standardId, price: selected.standard, compare: selected.standardCompare, copy: "Simple. Stable. Reliable", bestFor: "Casual creators easing into live before going all-in", quality: "Standard broadcast quality", storage: "10 GB video storage/stream" },
    { kind: "premium" as const, label: "PREMIUM", title: "1080p Premium", id: selected.premiumId, price: selected.premium, compare: selected.premiumCompare, copy: "Professional quality. Total control", bestFor: "Always-on channels like news, devotional, games or lofi", quality: "Premium broadcast quality", storage: "20 GB video storage/stream" },
  ];
  return <AppShell title="Subscription" account={account} workspace={workspace}>
    <div className="page subscription-page">
      <div className="page-head subscription-heading"><div><p className="eyebrow">Account billing</p><h1>Choose your subscription</h1><p className="subtle">Reuse the same landing-page pricing model inside your workspace. The selected plan activates on this account without creating another key or folder.</p></div><div className={`subscription-status ${active ? "active" : "expired"}`}><span className="status-dot"/>{active ? `${account.activePlan?.name || "Plan"} · ${account.streamLimit} streams` : "Please upgrade your plan"}</div></div>
      {message && <div className="subscription-message"><Check size={15}/>{message}</div>}
      <section className="subscription-current card"><div><span className="metric-kicker">Current access</span><strong>{account.activePlan?.name || "No active plan"}</strong><span>{active ? `Until ${new Date(account.accessEndsAt).toLocaleString()}` : "Your trial has ended. Choose a plan to continue."}</span></div><div><span className="metric-kicker">Stream limit</span><strong>{account.streamLimit}</strong><span>simultaneous live streams</span></div><div><span className="metric-kicker">License</span><strong className="mono">{account.licenseKey}</strong><span>same key on every renewal</span></div></section>
      <section className="subscription-pricing">
        <div className="subscription-controls"><div className="billing-switch">{(["Day", "Month", "Year"] as const).map((item) => <button key={item} type="button" className={billing === item ? "active" : ""} onClick={() => { setBilling(item); setDuration(1); }}>{item}</button>)}</div><div className="duration-control"><button type="button" onClick={() => setDuration((value) => Math.max(1, value - 1))} disabled={duration === 1} aria-label="Decrease duration">−</button><strong>{duration} {selected.unit}{duration === 1 ? "" : "s"}</strong><button type="button" onClick={() => setDuration((value) => Math.min(selected.limit, value + 1))} disabled={duration === selected.limit} aria-label="Increase duration">+</button></div></div>
        <div className="subscription-plan-grid">
          <article className={`subscription-plan-card trial ${trialActive ? "selected" : ""}`}>
            <div className="subscription-plan-top"><span className="plan-label">FREE TRIAL</span>{trialActive && <span className="plan-active"><Check size={13}/> Active</span>}</div>
            <h2>Try 24hrs Trial</h2>
            <p>Explore Loop Stream risk-free before choosing a longer plan.</p>
            <div className="subscription-price"><strong>FREE</strong><span>/ 24 hours</span></div>
            <div className="subscription-feature-tiles"><span><Radio size={16}/><b>Stream your<br/>videos as live</b></span><span><Sparkles size={16}/><b>Premium<br/>broadcast quality</b></span><span><Layers size={16}/><b>20 GB video<br/>storage/stream</b></span></div>
            <ul className="subscription-features"><li><Check size={12}/>Create and loop playlists</li><li><Check size={12}/>Premium audio clarity</li><li><Check size={12}/>Schedule in advance</li><li><Check size={12}/>Upload from cloud</li></ul>
            <div className="subscription-best"><span>BEST FOR</span><p>Creators who want to try Loop Stream before choosing a plan</p></div>
            <button className="button subscription-select secondary" type="button" disabled><Check size={15}/>{trialActive ? "Current plan" : "Trial already used"}</button>
            <small>No card required. Your existing license key stays with this workspace.</small>
          </article>
          {paidOptions.map((option) => {
          const plan = findPlan(option.id);
          const selectedPlan = account.activePlanId === option.id && active;
          const streams = streamCounts[option.kind];
          return <article className={`subscription-plan-card ${option.kind} ${selectedPlan ? "selected" : ""}`} key={option.id}><div className="subscription-plan-top"><span className="plan-label">{option.label}</span>{selectedPlan && <span className="plan-active"><Check size={13}/> Active</span>}</div><h2>{option.title}</h2><p>{option.copy}</p><div className="subscription-price"><strong>₹{(option.price * duration * streams).toLocaleString("en-IN")}</strong><del>₹{(option.compare * duration * streams).toLocaleString("en-IN")}</del><span>/ {selected.unit}</span><em>{Math.round((1 - option.price / option.compare) * 100)}%<br/>OFF</em></div><div className="subscription-feature-tiles"><span><Radio size={16}/><b>Stream your<br/>videos as live</b></span><span><Sparkles size={16}/><b>{option.quality.split(" ")[0]}<br/>broadcast quality</b></span><span><Layers size={16}/><b>{option.storage.split(" ")[0]} GB video<br/>storage/stream</b></span></div><ul className="subscription-features"><li><Check size={12}/>Loop your videos endlessly</li><li><Check size={12}/>{option.kind === "premium" ? "Premium" : "Standard"} audio quality</li><li><Check size={12}/>Add and remove videos</li><li><Check size={12}/>Upload from cloud</li></ul><div className="subscription-best"><span>BEST FOR</span><p>{option.bestFor}</p></div><div className="stream-stepper"><span>Stream count</span><button type="button" onClick={() => changeStreams(option.kind, -1)} aria-label={`Decrease ${option.label} stream count`}>−</button><strong>{streams}</strong><button type="button" onClick={() => changeStreams(option.kind, 1)} aria-label={`Increase ${option.label} stream count`}>+</button></div><button className="button subscription-select" type="button" onClick={() => void activate(option.id, streams)} disabled={!plan || busyPlan === option.id || selectedPlan}>{busyPlan === option.id ? "Activating…" : selectedPlan ? "Current plan" : "Select now"} <ArrowRight size={15}/></button><small>Up to {streams} simultaneous streams. The {streams + 1}th stream will show “Please upgrade your plan.”</small></article>;
        })}</div>
      </section>
      <section className="card subscription-history">
        <div className="subscription-history-header">
          <div><span className="metric-kicker">Billing record</span><h2 className="section-title">Transaction history</h2><p>Review every subscription purchase and owner-granted extension on this account.</p></div>
          <div className="subscription-history-count"><strong>{filteredHistory.length}</strong><span>of {billingHistory.length} records</span></div>
        </div>
        <div className="subscription-history-toolbar">
          <label className="subscription-history-search"><Search size={15}/><input value={historySearch} onChange={(event) => setHistorySearch(event.target.value)} placeholder="Search plan or invoice reference" aria-label="Search transaction history"/></label>
          <div className="subscription-history-filters" role="tablist" aria-label="Transaction type">
            {([{ value: "all", label: "All" }, { value: "purchase", label: "Purchases" }, { value: "grant", label: "Grants" }] as const).map((filter) => <button key={filter.value} type="button" role="tab" aria-selected={historyFilter === filter.value} className={historyFilter === filter.value ? "active" : ""} onClick={() => setHistoryFilter(filter.value)}><Filter size={13}/>{filter.label}</button>)}
          </div>
          <label className="subscription-history-range"><CalendarDays size={14}/><span className="sr-only">Filter transactions by date</span><select value={historyRange} onChange={(event) => setHistoryRange(event.target.value as typeof historyRange)} aria-label="Filter transactions by date"><option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option></select></label>
        </div>
        {billingHistory.length === 0 ? <div className="subscription-history-empty"><Receipt size={22}/><strong>No billing transactions yet</strong><p>Your subscription invoices will appear here after activation.</p></div> : filteredHistory.length === 0 ? <div className="subscription-history-empty"><Search size={22}/><strong>No matching transactions</strong><p>Try a different search or remove one of the filters.</p><button className="button secondary small" type="button" onClick={clearHistoryFilters}>Clear filters</button></div> : <div className="subscription-history-list">{filteredHistory.map((item) => { const plan = item.planId ? findPlan(item.planId) : undefined; return <div className="subscription-history-row" key={item.id}><div className="subscription-history-row-main"><span className={`subscription-transaction-icon ${item.type}`}><Receipt size={16}/></span><div className="subscription-history-copy"><div className="subscription-history-title"><strong>{plan?.name || item.message}</strong><span className={`subscription-transaction-type ${item.type}`}>{item.type === "grant" ? "Owner grant" : "Purchase"}</span></div><p>{item.message} · {item.days || plan?.durationDays || 0} days · {item.streamLimit || account.streamLimit} streams</p><small><CalendarDays size={12}/>{new Date(item.at).toLocaleString()} <span>·</span> Ref {item.id.slice(0, 8)}</small></div></div><div className="subscription-history-row-action"><span className="subscription-transaction-status">Completed</span><button className="button secondary small" type="button" onClick={() => downloadInvoice(item)}><Download size={13}/> Download invoice</button></div></div>; })}</div>}
      </section>
    </div>
  </AppShell>;
}

function Dashboard({ workspace, account }: { workspace:ReturnType<typeof useWorkspace>; account?: AccountSummary | null }) {
  const actions = [
    { href: "/live", label: "Live", description: "Manage live channels and start a broadcast.", image: `${basePath}/images/dashboard/live.png`, tone: "live" },
    { href: "/videos", label: "Video", description: "Browse your video library and categories.", image: `${basePath}/images/dashboard/video-library.png`, tone: "video" },
    { href: "/live-preview", label: "Stream preview", description: "Check the live composition before it goes out.", image: `${basePath}/images/dashboard/stream-preview.png`, tone: "preview" },
    { href: "/editor", label: "Video editor", description: "Build a polished stream composition.", image: `${basePath}/images/dashboard/editor.png`, tone: "editor" },
  ];
  return <AppShell title="Dashboard" account={account} workspace={workspace}>
    <div className="page dashboard-home-page">
      <div className="page-head"><div><p className="eyebrow">Workspace</p><h1>Dashboard</h1><p className="subtle">Choose what you want to work on.</p></div></div>
      <div className="dashboard-action-grid">
         {actions.map(({ href, label, description, image, tone }) => <Link key={href} href={href} className={`dashboard-action-card dashboard-action-${tone}`} data-testid={`link-dashboard-action-${tone}`} aria-label={`${label}: ${description}`}><span className="dashboard-action-art"><img src={image} alt="" /></span><span className="dashboard-action-copy"><strong>{label}</strong><small>{description}</small></span><ArrowRight size={17} className="dashboard-action-arrow"/></Link>)}
      </div>
    </div>
  </AppShell>;
}

function AnalyticsPage({ workspace, account, onSavePhone }: { workspace:ReturnType<typeof useWorkspace>; account?: AccountSummary | null; onSavePhone?: (phone: string) => Promise<void> }) {
  const {data} = workspace;
  const live = data.channels.filter(c=>c.status==="live");
  const volumeData = [
    { label: "Live channels", value: data.channels.length, color: "#fecdd3" },
    { label: "Library videos", value: data.videos.length, color: "#ddd6fe" },
    { label: "Categories", value: data.groups.length, color: "#a7f3d0" },
    { label: "Activities", value: data.activities.length, color: "#fed7aa" },
  ];
  const maxVolume = Math.max(1, ...volumeData.map((item) => item.value));
  const publishedVideos = data.videos.filter((video) => video.status === "published").length;
  const draftVideos = data.videos.filter((video) => video.status === "draft").length;
  const archivedVideos = data.videos.filter((video) => video.status === "archived").length;
  return <AppShell title="Analytics" account={account} workspace={workspace}><div className="page analytics-page"><div className="page-head"><div><p className="eyebrow">Workspace overview</p><h1>Analytics</h1><p className="subtle">Your live channels, library, categories, and recent activity in one view.</p></div></div>{account && !account.phone && onSavePhone && <PhoneProfileCard onSave={onSavePhone} />}
    <div className="metric-grid"><Metric label="On air now" value={live.length} detail={live.length ? "Signal is healthy" : "Nothing is live"} image={analyticsTowerIcon} /><Metric label="Library videos" value={data.videos.length} detail={`${data.videos.filter(v=>v.status==="published").length} published`} image={analyticsVideoIcon} /><Metric label="Categories" value={data.groups.length} detail="Playlist folders" image={analyticsFolderIcon} /> </div>
     <div className="analytics-chart-grid">
       <section className="card section-card analytics-chart-card"><div className="section-head"><div><h2 className="section-title">Workspace volume</h2><p className="subtle" style={{margin: "5px 0 0", fontSize:11}}>A quick view of the content in your workspace.</p></div><img className="analytics-heading-art" src={analyticsBarIcon} alt="" /></div><div className="analytics-bars" aria-label="Workspace volume chart">{volumeData.map((item) => <div className="analytics-bar-column" key={item.label}><div className="analytics-bar-value">{item.value}</div><div className="analytics-bar-track"><div className="analytics-bar-fill" style={{ height: `${Math.max(item.value ? 10 : 3, (item.value / maxVolume) * 100)}%`, background: item.color }} /></div><span>{item.label}</span></div>)}</div></section>
       <section className="card section-card analytics-chart-card"><div className="section-head"><div><h2 className="section-title">Library breakdown</h2><p className="subtle" style={{margin: "5px 0 0", fontSize:11}}>Video status across your library.</p></div><img className="analytics-heading-art analytics-pie-art" src={analyticsPieIcon} alt="" /></div><div className="analytics-breakdown"><div className="analytics-breakdown-row"><span><i className="analytics-dot published"/>Published</span><strong>{publishedVideos}</strong><div className="analytics-progress"><span style={{ width: `${data.videos.length ? (publishedVideos / data.videos.length) * 100 : 0}%`, background: "#14b8a6" }}/></div></div><div className="analytics-breakdown-row"><span><i className="analytics-dot draft"/>Draft</span><strong>{draftVideos}</strong><div className="analytics-progress"><span style={{ width: `${data.videos.length ? (draftVideos / data.videos.length) * 100 : 0}%`, background: "#f59e0b" }}/></div></div><div className="analytics-breakdown-row"><span><i className="analytics-dot archived"/>Archived</span><strong>{archivedVideos}</strong><div className="analytics-progress"><span style={{ width: `${data.videos.length ? (archivedVideos / data.videos.length) * 100 : 0}%`, background: "#8b5cf6" }}/></div></div></div></section>
     </div>
      <div className="split-grid"><section className="card section-card"><div className="section-head"><div><h2 className="section-title">Live channels</h2><p className="subtle" style={{margin: "5px 0 0", fontSize:11}}>Your broadcast surface, at a glance.</p></div><div className="analytics-section-actions"><img className="analytics-heading-art" src={analyticsTowerIcon} alt="" /><Link href="/live" className="section-link" data-testid="link-view-all-live">View all <ArrowRight size={12} style={{verticalAlign:"-2px"}}/></Link></div></div>{live.length ? <div className="live-list">{live.map(c=><div className="live-row" key={c.id} data-testid={`live-row-${c.id}`}><div className="thumb" style={{background:c.thumbnailColor}}><Radio size={16}/></div><div><div className="row-title">{c.title}</div><div className="row-meta">{c.platform} · live for {fmtTime(c.startedAt)}</div></div><div className="status live"><span className="status-dot"/>Live</div></div>)}</div> : <EmptyState icon={<Radio size={21}/>} title="Nothing is live" copy="Your live channels will appear here when they are on air."/>}</section>
        <section className="card section-card"><div className="section-head"><div><h2 className="section-title">Recent activity</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>A small paper trail for the room.</p></div><img className="analytics-heading-art" src={analyticsClockIcon} alt="" /></div><ActivityList activities={data.activities}/></section></div>
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
    streamUrl:channel?.streamUrl||"",
    streamKey:channel?.streamKey||"",
    aspectRatio:channel?.aspectRatio||"full" as AspectRatio,
    playbackSpeed:channel?.playbackSpeed||1,
    faceGroupId:channel?.faceGroupId||"",
    facePosition:channel?.facePosition||"bottom-right" as FacePosition,
    faceSize:channel?.faceSize||25,
     streamQuality:channel?.streamQuality||"1080p" as StreamQuality,
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
      streamKey:form.streamKey.trim(), viewers:channel?.viewers||0, startedAt:channel?.startedAt||null,
      thumbnailColor:channel?.thumbnailColor||colors[0], createdAt:channel?.createdAt||now(),
       aspectRatio:form.aspectRatio, playbackSpeed:Number(form.playbackSpeed), faceGroupId:form.faceGroupId || undefined,
      facePosition:form.facePosition, faceSize:Number(form.faceSize), durationHours:Number(form.durationHours),
         autoRestart:form.autoRestart, streamQuality:form.streamQuality, playlistVideoIds:form.playlistVideoIds,
         liveAnimationId:channel?.liveAnimationId, liveAnimationX:channel?.liveAnimationX, liveAnimationY:channel?.liveAnimationY, liveAnimationScale:channel?.liveAnimationScale,
          editorComposition:channel?.editorComposition,
    });
  };
   return <Modal title={channel ? "Update channel" : "Add live channel"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} data-testid="button-cancel-channel">Cancel</button><button className="button" type="submit" form="channel-form" disabled={!form.streamUrl.trim() || !form.groupId || !form.playlistVideoIds.length} data-testid="button-save-channel">{channel ? "Save changes" : "Add channel"} <Check size={14}/></button></>}><form id="channel-form" onSubmit={submit}>
    <div className="form-grid">
      <div className="field full"><label>Stream URL</label><input autoFocus required value={form.streamUrl} onChange={e=>set("streamUrl",e.target.value)} placeholder="Paste your platform stream URL" data-testid="input-stream-url"/><span className="field-hint">Paste the URL provided by your platform. The stream key can stay separate below, or be included in the full URL.</span></div>
       <div className="field full"><label>Stream key</label><input type="password" autoComplete="new-password" value={form.streamKey} onChange={e=>set("streamKey",e.target.value)} placeholder="Paste the platform stream key" data-testid="input-channel-stream-key"/><span className="field-hint">Stored only in this workspace and never shown in the channel table.</span></div>
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

function StreamKeyModal({
  channel,
  value,
  onChange,
  onContinue,
  onClose,
  busy,
}: {
  channel: LiveChannel;
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onClose: () => void;
  busy?: boolean;
}) {
  return <Modal title={`Add stream key · ${channel.title}`} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={busy} data-testid="button-cancel-stream-key">Cancel</button><button className="button" onClick={onContinue} disabled={busy || !value.trim()} data-testid="button-continue-stream-key">Continue to stream <ArrowRight size={14}/></button></>}><div className="stream-key-notice"><ShieldCheck size={18}/><div><strong>This channel needs its stream key before it can go live.</strong><p>The edited composition is already attached. Add the key, continue, then use Start on the channel.</p></div></div><div className="field"><label htmlFor="stream-key-prompt">Stream key</label><input id="stream-key-prompt" type="password" autoFocus autoComplete="new-password" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Paste your platform stream key" data-testid="input-stream-key-prompt"/><span className="field-hint">The key is used only to build the private ingest request. It is never displayed in the channel list.</span></div></Modal>;
}

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
  const folderVideos=videosForFolderScope(channel.groupId, groups, videos);
  const mainVideos=channel.playlistVideoIds?.length
    ? channel.playlistVideoIds.map((id) => folderVideos.find((video) => video.id === id)).filter((video): video is VideoItem => Boolean(video))
    : folderVideos;
  const faceVideos=videosForFolderScope(channel.faceGroupId, groups, videos);
  return {
    category:mainGroup?.name,
    mainVideos,
    faceCategory:faceGroup?.name,
    faceVideos,
    videoSources:mainVideos.map(video=>video.serverSource).filter((source): source is string=>Boolean(source)),
    faceSources:faceVideos.map(video=>video.serverSource).filter((source): source is string=>Boolean(source)),
  };
}

type LiveAnimationSettings = { id: string; x: number; y: number; scale: number; comingSoon: boolean };

function LiveAnimationControl({
  channel,
  data,
  licenseId,
  busy,
  onApply,
  webcamStream,
  webcamEnabled,
  webcamPosition,
  webcamScale,
}: {
  channel: LiveChannel;
  data: DataState;
  licenseId: string;
  busy: boolean;
  onApply: (settings: LiveAnimationSettings) => Promise<void>;
  webcamStream?: MediaStream | null;
  webcamEnabled?: boolean;
  webcamPosition?: FacePosition;
  webcamScale?: number;
}) {
  const livePlaylist = playlistFor(channel, data.groups, data.videos);
  const mainVideo = livePlaylist.mainVideos[0];
  const faceVideo = livePlaylist.faceVideos[0];
  const animations = data.videos.filter((video) =>
    video.serverSource
    && (isIncludedVideo(video) || isVideoInFolderScope(video, myAnimationFolderId, data.groups)),
  );
  const [animationId, setAnimationId] = useState(channel.liveAnimationId || "");
  const [position, setPosition] = useState({
    x: channel.liveAnimationX || 0,
    y: channel.liveAnimationY || 0,
    scale: channel.liveAnimationScale || 0.25,
  });
  const [comingSoon, setComingSoon] = useState(Boolean(channel.editorComposition?.comingSoon));
  const previewRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{ x: number; y: number; position: typeof position } | null>(null);
  const animation = animations.find((video) => video.id === animationId);

  useEffect(() => {
    const webcam = webcamRef.current;
    if (!webcam) return;
    webcam.srcObject = webcamStream || null;
    if (webcamStream) void webcam.play().catch(() => undefined);
    return () => { webcam.srcObject = null; };
  }, [webcamStream]);

  useEffect(() => {
    setAnimationId(channel.liveAnimationId || "");
    setPosition({
      x: channel.liveAnimationX || 0,
      y: channel.liveAnimationY || 0,
      scale: channel.liveAnimationScale || 0.25,
    });
    setComingSoon(Boolean(channel.editorComposition?.comingSoon));
  }, [channel.id, channel.liveAnimationId, channel.liveAnimationX, channel.liveAnimationY, channel.liveAnimationScale, channel.editorComposition?.comingSoon]);

  const clampPosition = (next: typeof position) => ({
    x: Math.max(-48, Math.min(48, next.x)),
    y: Math.max(-48, Math.min(48, next.y)),
    scale: Math.max(0.1, Math.min(0.8, next.scale)),
  });
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!animation || !previewRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, position };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const rect = previewRef.current?.getBoundingClientRect();
    if (!drag || !rect) return;
    setPosition(clampPosition({
      ...drag.position,
      x: drag.position.x + ((event.clientX - drag.x) / rect.width) * 100,
      y: drag.position.y + ((event.clientY - drag.y) / rect.height) * 100,
    }));
  };
  const stopDragging = () => { dragRef.current = null; };

  const composition = channel.editorComposition;
  const editorWebcam = composition?.webcamSource
    ? data.videos.find((video) => video.serverSource === composition.webcamSource)
    : undefined;
  const editorAnimation = composition?.animationSource
    ? data.videos.find((video) => video.serverSource === composition.animationSource)
    : undefined;
  const previewFaceVideo = editorWebcam || faceVideo;
  const previewAnimation = editorAnimation || animation;
  const previewFaceSize = composition?.webcamScale ? composition.webcamScale * 100 : (channel.faceSize || 25);
  const previewFaceStyle: CSSProperties | undefined = composition
    ? {
        width: `${previewFaceSize}%`,
        left: `${50 + (composition.webcamX || 0)}%`,
        top: `${50 + (composition.webcamY || 0)}%`,
        transform: "translate(-50%, -50%)",
      }
    : undefined;
  const previewMainStyle: CSSProperties | undefined = composition
    ? {
        transform: `translate(${composition.mainX || 0}%, ${composition.mainY || 0}%) scale(${composition.mainScale || 1})`,
        filter: `brightness(${1 + (composition.brightness || 0)}) contrast(${composition.contrast || 1}) saturate(${composition.saturation || 1}) hue-rotate(${composition.hue || 0}deg)`,
      }
    : undefined;
  const previewAnimationStyle: CSSProperties | undefined = composition
    ? {
        left: `${50 + (composition.animationX || 0)}%`,
        top: `${50 + (composition.animationY || 0)}%`,
        width: `${(composition.animationScale || 0.25) * 100}%`,
      }
    : undefined;
  return <section className="card live-animation-control" data-testid={`live-animation-control-${channel.id}`}>
    <div className="section-head">
      <div><h2 className="section-title">Live animation control</h2><p className="subtle">Drag an overlay on the preview, then apply it directly to the running stream.</p></div>
      <Sparkles size={17} color="#6c8b83"/>
    </div>
    <div className="live-animation-layout">
      <div
        ref={previewRef}
         className={`live-animation-preview live-preview-ratio-${channel.aspectRatio || "full"}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        {mainVideo ? <video src={videoPlaybackUrl(mainVideo, licenseId)} muted autoPlay loop playsInline style={previewMainStyle} /> : <div className="live-animation-empty"><MonitorPlay size={22}/><span>Choose a live playlist first.</span></div>}
        {previewFaceVideo && <video
           src={videoPlaybackUrl(previewFaceVideo, licenseId)}
          muted
          autoPlay
          loop
          playsInline
          className={`live-server-face-layer live-webcam-${channel.facePosition || "bottom-right"}`}
           style={previewFaceStyle || { width: `${(channel.faceSize || 25)}%` }}
        />}
        {webcamEnabled && webcamStream && <video
          ref={webcamRef}
          muted
          autoPlay
          playsInline
          className={`live-webcam-layer live-webcam-${webcamPosition || "bottom-right"}`}
          style={{ width: `${(webcamScale || 0.25) * 100}%` }}
        />}
        {previewAnimation && <video
           src={videoPlaybackUrl(previewAnimation, licenseId)}
          muted
          autoPlay
          loop
          playsInline
          className="live-animation-layer"
           style={previewAnimationStyle || { left: `${50 + position.x}%`, top: `${50 + position.y}%`, width: `${position.scale * 100}%` }}
        />}
         {comingSoon && <div className="live-coming-soon-overlay">COMING SOON</div>}
        <span className="live-animation-live-badge"><span className="status-dot"/>LIVE PREVIEW</span>
        {animation && <span className="live-animation-drag-hint">Drag overlay</span>}
      </div>
      <div className="live-animation-fields">
        <div className="field"><label>Animation to run</label><select value={animationId} onChange={(event) => setAnimationId(event.target.value)} data-testid={`select-live-animation-${channel.id}`}><option value="">No animation overlay</option>{animations.map((video) => <option key={video.id} value={video.id}>{isIncludedVideo(video) ? "Included · " : "My Animations · "}{video.title}</option>)}</select></div>
        <div className="field"><label>Overlay size · {Math.round(position.scale * 100)}%</label><input type="range" min="10" max="80" value={Math.round(position.scale * 100)} onChange={(event) => setPosition((current) => ({ ...current, scale: Number(event.target.value) / 100 }))} disabled={!animation}/></div>
        <div className="live-animation-position"><span>Position {Math.round(position.x)} / {Math.round(position.y)}</span><button type="button" className="section-link" onClick={() => setPosition({ x: 0, y: 0, scale: 0.25 })} disabled={!animation}>Center overlay</button></div>
        <label className="live-coming-soon-toggle"><input type="checkbox" checked={comingSoon} onChange={(event) => setComingSoon(event.target.checked)} /> <span>Show <strong>COMING SOON</strong> at the bottom of the preview</span></label>
        <div className="live-animation-actions"><button type="button" className="button" onClick={() => void onApply({ id: animationId, x: position.x, y: position.y, scale: position.scale, comingSoon })} disabled={busy || !livePlaylist.videoSources.length}>{busy ? "Updating live…" : "Apply now"} <Radio size={14}/></button><button type="button" className="button ghost" onClick={() => void onApply({ id: "", x: 0, y: 0, scale: 0.25, comingSoon: false })} disabled={busy || (!channel.liveAnimationId && !channel.editorComposition?.comingSoon && !comingSoon)}>Remove overlay</button></div>
         <span className="field-hint">The configured playlist, edited layers, face camera, and animation are previewed together. Applying a new overlay briefly rebuilds the live FFmpeg composition without creating a rendered copy.</span>
      </div>
    </div>
  </section>;
}

function useLivePreviewDevices({
  streamId,
  webcamEnabled,
  webcamPosition,
  webcamScale,
}: {
  streamId?: string;
  webcamEnabled: boolean;
  webcamPosition: FacePosition;
  webcamScale: number;
}) {
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [voiceStream, setVoiceStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const voiceLevelRef = useRef(0);

  const stopTracks = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };
  const enableWebcam = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setWebcamError("This browser does not provide camera permissions.");
      return false;
    }
    try {
      setWebcamError("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stopTracks(webcamStream);
      setWebcamStream(stream);
      return true;
    } catch (error) {
      setWebcamError(error instanceof Error ? error.message : "Camera permission was denied.");
      return false;
    }
  };
  const disableWebcam = () => {
    stopTracks(webcamStream);
    setWebcamStream(null);
  };
  const enableVoice = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError("This browser does not provide microphone permissions.");
      return false;
    }
    try {
      setVoiceError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stopTracks(voiceStream);
      setVoiceStream(stream);
      return true;
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : "Microphone permission was denied.");
      return false;
    }
  };
  const disableVoice = () => {
    stopTracks(voiceStream);
    setVoiceStream(null);
    setVoiceLevel(0);
  };

  useEffect(() => () => {
    stopTracks(webcamStream);
  }, [webcamStream]);

  useEffect(() => () => {
    stopTracks(voiceStream);
  }, [voiceStream]);

  useEffect(() => {
    if (!webcamStream || !streamId || !webcamEnabled) return;
    const sourceTrack = webcamStream.getVideoTracks()[0];
    if (!sourceTrack) return;
    const worker = new Worker(new URL("./workers/webcam-capture.worker.ts", import.meta.url), { type: "module" });
    const workerTrack = sourceTrack.clone();
    worker.addEventListener("error", () => {
      setWebcamError("The background webcam processor stopped. Try enabling the camera again.");
    });
    worker.addEventListener("message", (event: MessageEvent<{ type?: string; message?: string }>) => {
      if (event.data.type === "error" && event.data.message) setWebcamError(event.data.message);
    });
    try {
      worker.postMessage({
        type: "start",
        track: workerTrack,
        uploadUrl: `/api/stream/webcam/${encodeURIComponent(streamId)}?position=${encodeURIComponent(webcamPosition)}&scale=${encodeURIComponent(webcamScale)}`,
        maxWidth: 512,
        frameIntervalMs: 100,
        jpegQuality: 0.72,
      }, [workerTrack as unknown as Transferable]);
    } catch (error) {
      workerTrack.stop();
      worker.terminate();
      setWebcamError(error instanceof Error ? error.message : "The webcam could not start its background processor.");
    }
    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
    };
  }, [webcamEnabled, webcamPosition, webcamScale, streamId, webcamStream]);

  useEffect(() => {
    if (!voiceStream) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      setVoiceError("This browser does not provide an audio worklet.");
      return;
    }
    const context = new AudioContextClass({ sampleRate: 48000 });
    const source = context.createMediaStreamSource(voiceStream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    const silentOutput = context.createGain();
    silentOutput.gain.value = 0;
    silentOutput.connect(context.destination);
    let uploadController: ReadableStreamDefaultController<Uint8Array> | null = null;
    let uploadClosed = false;
    const pcmBytes = 1920;
    const uploadBody = new ReadableStream<Uint8Array>({
      start(controller) {
        uploadController = controller;
      },
      cancel() {
        uploadClosed = true;
      },
    }, { highWaterMark: pcmBytes * 10, size: (chunk) => chunk.byteLength });
    const upload = streamId
      ? fetch(`/api/stream/voice/${encodeURIComponent(streamId)}`, {
          method: "POST",
          headers: { "content-type": "application/octet-stream" },
          body: uploadBody,
          duplex: "half",
        } as RequestInit & { duplex: "half" }).catch(() => undefined)
      : Promise.resolve();
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    const measure = () => {
      analyser.getByteTimeDomainData(buffer);
      const average = buffer.reduce((sum, value) => sum + Math.abs(value - 128), 0) / buffer.length;
      const nextLevel = Math.min(100, Math.round(average * 2.8));
      if (Math.abs(nextLevel - voiceLevelRef.current) >= 2) {
        voiceLevelRef.current = nextLevel;
        setVoiceLevel(nextLevel);
      }
    };
    const meterTimer = window.setInterval(measure, 100);
    let processor: AudioWorkletNode | null = null;
    let disposed = false;
    const startWorklet = async () => {
      try {
        if (!context.audioWorklet) throw new Error("This browser does not provide an audio worklet.");
        await context.audioWorklet.addModule(new URL("./workers/microphone-capture.worklet.ts", import.meta.url));
        if (disposed) return;
        processor = new AudioWorkletNode(context, "r-loop-microphone-capture", {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        });
        processor.port.onmessage = (event: MessageEvent<{ type?: string; buffer?: ArrayBuffer }>) => {
          if (event.data.type !== "pcm" || !event.data.buffer || uploadClosed || !uploadController) return;
          if (uploadController.desiredSize === null || uploadController.desiredSize < pcmBytes) return;
          try {
            uploadController.enqueue(new Uint8Array(event.data.buffer));
          } catch {
            uploadClosed = true;
            uploadController = null;
          }
        };
        source.connect(processor);
        processor.connect(silentOutput);
        await context.resume();
      } catch (error) {
        setVoiceError(error instanceof Error ? error.message : "The microphone background processor could not start.");
      }
    };
    void startWorklet();
    return () => {
      disposed = true;
      window.clearInterval(meterTimer);
      uploadClosed = true;
      const controller = uploadController;
      uploadController = null;
      try { controller?.close(); } catch { /* The fetch body may already be closed. */ }
      processor?.port.close();
      processor?.disconnect();
      silentOutput.disconnect();
      source.disconnect();
      analyser.disconnect();
      void context.close().catch(() => undefined);
      void upload;
    };
  }, [voiceStream, streamId]);

  return {
    webcamStream,
    voiceStream,
    voiceLevel,
    webcamError,
    voiceError,
    enableWebcam,
    disableWebcam,
    enableVoice,
    disableVoice,
  };
}

function LiveOutputPreview({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    setError("");
    let player: Hls | undefined;
    const play = () => { void video.play().catch(() => undefined); };
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", play);
    } else if (Hls.isSupported()) {
      player = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 2,
        backBufferLength: 30,
      });
      player.loadSource(src);
      player.attachMedia(video);
      player.on(Hls.Events.MANIFEST_PARSED, play);
      player.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        setError("Live output reconnecting…");
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          player?.recoverMediaError();
        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          player?.startLoad(-1);
        } else {
          player?.destroy();
          player = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            liveSyncDurationCount: 2,
            backBufferLength: 30,
          });
          player.loadSource(src);
          player.attachMedia(video);
          player.on(Hls.Events.MANIFEST_PARSED, play);
        }
      });
    } else {
      setError("This browser cannot play the live preview stream.");
    }
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      player?.destroy();
    };
  }, [src]);

  return <div className="live-output-preview">
    {src ? <video ref={videoRef} muted autoPlay playsInline controls={false} aria-label="Actual live output preview" /> : <div className="live-preview-empty"><MonitorPlay size={22}/><span>Start the channel to see the encoded live output.</span></div>}
    <span className="live-output-badge"><span className="status-dot"/>ACTUAL OUTPUT</span>
    {error && <span className="live-output-error">{error}</span>}
  </div>;
}

function LivePage({workspace, account}:{workspace:ReturnType<typeof useWorkspace>; account?:AccountSummary|null}) {
  const {data,update}=workspace; const [location,setLocation]=useLocation(); const [editing,setEditing]=useState<LiveChannel|undefined>(); const [showForm,setShowForm]=useState(false); const [deleting,setDeleting]=useState<LiveChannel|undefined>(); const [busy,setBusy]=useState<string[]>([]); const [streamKeyChannel,setStreamKeyChannel]=useState<LiveChannel|undefined>(); const [streamKeyDraft,setStreamKeyDraft]=useState("");
  const playlistSignatures=useRef(new Map<string,string>());
  const save=(channel:LiveChannel)=>{const exists=data.channels.some(c=>c.id===channel.id); update({channels:exists?data.channels.map(c=>c.id===channel.id?channel:c):[channel,...data.channels]}, {message:exists?`${channel.title} was updated`:`${channel.title} was added`,type:"edit"}); setShowForm(false);setEditing(undefined);};
  useEffect(() => {
    const channelId = new URLSearchParams(location.split("?")[1] || "").get("editChannel");
    if (!channelId) return;
    const channel = data.channels.find((item) => item.id === channelId);
    if (!channel) return;
    setEditing(channel);
    setShowForm(true);
    setLocation("/live");
  }, [data.channels, location, setLocation]);
  const start=async(c:LiveChannel)=>{if(busy.includes(c.id))return;if(account && data.channels.filter((channel)=>channel.status==="live").length >= account.streamLimit){workspace.setToast("Please upgrade your plan to run more streams.");return;}if(!c.streamUrl?.trim()){setEditing(c);setShowForm(true);workspace.setToast("Paste the stream URL before starting.");return;}if(!c.streamKey?.trim()&&c.streamUrl.includes("{streamKey}")){setStreamKeyDraft("");setStreamKeyChannel(c);return;}setBusy(ids=>[...ids,c.id]);try{
     const playlist=playlistFor(c,data.groups,data.videos);
     const category=playlist.category;
     const faceCategory=playlist.faceCategory;
     const mainVideo=playlist.mainVideos[0];
     const faceVideo=playlist.faceVideos[0];
       const composition=c.editorComposition;
       const liveAnimation=data.videos.find((video)=>video.id===c.liveAnimationId && video.serverSource);
     if(!category)throw new Error("Choose a video category before starting.");
      if(!playlist.mainVideos.length)throw new Error("Tick at least one video in the selected folder before starting.");
      if(!playlist.mainVideos.every(video=>video.serverSource))throw new Error("Every ticked video in the selected folder must be server-ready before starting.");
     if(playlist.faceVideos.length&&!playlist.faceVideos.every(video=>video.serverSource))throw new Error("Every video in the face category must be server-ready before starting.");
     const scopedStreamId=streamIdFor(workspace.clientId,c.id);
    const result=await startStream({
         streamId:scopedStreamId, ingestUrl:resolveStreamIngestUrl(c.streamUrl,c.streamKey), category, videoSource:mainVideo?.serverSource,
        videoSources:playlist.videoSources,
         faceCategory:composition?.webcamSource ? "editor face cam" : faceCategory, faceSource:composition?.webcamSource || faceVideo?.serverSource,
         faceSources:composition?.webcamSource ? [composition.webcamSource] : playlist.faceSources,
       playbackSpeed:c.playbackSpeed||1, quality:c.streamQuality||"1080p", aspectRatio:c.aspectRatio||"full", facePosition:c.facePosition||"bottom-right",
      faceScale:(c.faceSize||25)/100, durationMinutes:(c.durationHours||1)*60,
      autoRestart:Boolean(c.autoRestart),
      voiceAudio:true,
        liveAnimationSource:composition?.animationSource || liveAnimation?.serverSource,
        liveAnimationX:composition?.animationX ?? c.liveAnimationX ?? 0,
        liveAnimationY:composition?.animationY ?? c.liveAnimationY ?? 0,
        liveAnimationScale:composition?.animationScale ?? c.liveAnimationScale ?? 0.25,
        composition,
    });
    if(result.status!=="running")throw new Error(result.message);
       playlistSignatures.current.set(scopedStreamId,JSON.stringify({videoSources:playlist.videoSources,faceSources:composition?.webcamSource?[composition.webcamSource]:playlist.faceSources,liveAnimationId:c.liveAnimationId,liveAnimationX:(composition?.animationX ?? c.liveAnimationX) || 0,liveAnimationY:(composition?.animationY ?? c.liveAnimationY) || 0,liveAnimationScale:(composition?.animationScale ?? c.liveAnimationScale) || 0.25,composition}));
    update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"live",viewers:0,startedAt:now()}:x)},{message:`${c.title} is now streaming from the ${category} video`,type:"live"});
  }catch(error){workspace.setToast(error instanceof Error?error.message:"Could not start the real stream.");}finally{setBusy(ids=>ids.filter(id=>id!==c.id));}};
   const stop=async(c:LiveChannel)=>{if(busy.includes(c.id))return;setBusy(ids=>[...ids,c.id]);try{const scopedStreamId=streamIdFor(workspace.clientId,c.id);await stopStream({streamId:scopedStreamId});playlistSignatures.current.delete(scopedStreamId);update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} was taken off air`,type:"edit"});}catch(error){workspace.setToast(error instanceof Error?error.message:"Could not stop the stream.");}finally{setBusy(ids=>ids.filter(id=>id!==c.id));}};
   useEffect(()=>{const liveChannels=data.channels.filter(c=>c.status==="live");if(!liveChannels.length)return;const timer=window.setInterval(()=>{void Promise.all(liveChannels.map(async c=>{try{const result=await getStreamStatus(streamIdFor(workspace.clientId,c.id));if(result.status!=="running"){update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} stream process ${result.status}`,type:"edit"});}}catch{ /* Keep the visible state until the API is reachable again. */ }}));},5000);return()=>window.clearInterval(timer);},[data.channels,update,workspace.clientId]);
     useEffect(()=>{const liveChannels=data.channels.filter(c=>c.status==="live");void Promise.all(liveChannels.map(async c=>{const scopedStreamId=streamIdFor(workspace.clientId,c.id);const playlist=playlistFor(c,data.groups,data.videos);if(!playlist.category)return;const composition=c.editorComposition;const liveAnimation=data.videos.find((video)=>video.id===c.liveAnimationId && video.serverSource);const signature=JSON.stringify({videoSources:playlist.videoSources,faceSources:composition?.webcamSource?[composition.webcamSource]:playlist.faceSources,liveAnimationId:c.liveAnimationId,liveAnimationX:(composition?.animationX ?? c.liveAnimationX) || 0,liveAnimationY:(composition?.animationY ?? c.liveAnimationY) || 0,liveAnimationScale:(composition?.animationScale ?? c.liveAnimationScale) || 0.25,composition});if(playlistSignatures.current.get(scopedStreamId)===signature)return;if(!playlist.videoSources.length){try{await stopStream({streamId:scopedStreamId});playlistSignatures.current.set(scopedStreamId,signature);update({channels:data.channels.map(x=>x.id===c.id?{...x,status:"stopped",viewers:0}:x)},{message:`${c.title} stopped because its playlist is empty`,type:"edit"});}catch(error){workspace.setToast(error instanceof Error?error.message:"The empty live playlist could not be stopped.");}return;}try{await updateStream({streamId:scopedStreamId,ingestUrl:resolveStreamIngestUrl(c.streamUrl,c.streamKey),category:playlist.category,videoSources:playlist.videoSources,videoSource:playlist.mainVideos[0]?.serverSource,faceCategory:composition?.webcamSource?"editor face cam":(playlist.faceSources.length?playlist.faceCategory:undefined),faceSource:composition?.webcamSource||playlist.faceVideos[0]?.serverSource,faceSources:composition?.webcamSource?[composition.webcamSource]:playlist.faceSources,playbackSpeed:c.playbackSpeed||1,quality:c.streamQuality||"1080p",aspectRatio:c.aspectRatio||"full",facePosition:c.facePosition||"bottom-right",faceScale:(c.faceSize||25)/100,durationMinutes:(c.durationHours||1)*60,autoRestart:Boolean(c.autoRestart),voiceAudio:true,liveAnimationSource:composition?.animationSource||liveAnimation?.serverSource,liveAnimationX:(composition?.animationX ?? c.liveAnimationX) || 0,liveAnimationY:(composition?.animationY ?? c.liveAnimationY) || 0,liveAnimationScale:(composition?.animationScale ?? c.liveAnimationScale) || 0.25,composition});playlistSignatures.current.set(scopedStreamId,signature);workspace.setToast(`${c.title} playlist updated while live`);}catch(error){workspace.setToast(error instanceof Error?error.message:"The live playlist could not be updated.");}}));},[data.channels,data.groups,data.videos,workspace.clientId,workspace.setToast,update]);
   const groupsById=useMemo(()=>Object.fromEntries(data.groups.map(g=>[g.id,g.name])),[data.groups]);
    return <AppShell title="Live channels" account={account} workspace={workspace}><div className="page live-page"><div className="page-head"><div><p className="eyebrow">Broadcast operations / control room</p><h1>Live channels</h1><p className="subtle">Prepare your destinations, then take the room live with confidence.</p></div><div className="page-head-actions"><span className="page-live-indicator"><span className="status-dot"/>{data.channels.filter(c=>c.status==="live").length ? "Signal monitored" : "Room is ready"}</span><button className="button" onClick={()=>{setEditing(undefined);setShowForm(true)}} data-testid="button-add-channel"><Plus size={16}/> Add channel</button></div></div>
      <div className="live-overview-grid">
        <div className="live-overview-card live-overview-primary"><div className="metric-kicker">On air now</div><strong>{data.channels.filter(c=>c.status==="live").length}</strong><span>{data.channels.filter(c=>c.status==="live").length ? "Broadcasting channels" : "No active broadcast"}</span><div className="live-overview-meter"><i style={{width:`${Math.min(100, data.channels.length ? (data.channels.filter(c=>c.status==="live").length / data.channels.length) * 100 : 0)}%`}}/></div></div>
        <div className="live-overview-card"><div className="metric-kicker">Destinations</div><strong>{data.channels.length}</strong><span>{data.channels.length === 1 ? "Channel configured" : "Channels configured"}</span><Radio size={18}/></div>
        <div className="live-overview-card"><div className="metric-kicker">Playlist coverage</div><strong>{data.channels.reduce((total, channel) => total + (channel.playlistVideoIds?.length || videosForGroup(channel.groupId,data.groups,data.videos).length), 0)}</strong><span>Videos in active queues</span><FileVideo size={18}/></div>
      </div>
     <div className="card section-card"><div className="section-head"><div><h2 className="section-title">{data.channels.length} channel{data.channels.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>{data.channels.filter(c=>c.status==="live").length} currently broadcasting · {data.channels.filter(c=>c.status==="scheduled").length} scheduled</p></div><div className="status live"><span className="status-dot"/>{data.channels.filter(c=>c.status==="live").length ? "Room monitored" : "Room quiet"}</div></div>{data.channels.length===0?<EmptyState icon={<MonitorPlay size={21}/>} title="Your live room is empty" copy="Add a destination to start preparing your first broadcast." action="Add first channel" onClick={()=>setShowForm(true)}/>:<div className="table-wrap"><table className="data-table"><thead><tr><th>Channel</th><th>Platform</th><th>Status</th><th>Playlist</th><th>Live URL</th><th/></tr></thead><tbody>{data.channels.map(c=><tr key={c.id} data-testid={`row-channel-${c.id}`}><td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="thumb" style={{background:c.thumbnailColor,width:34,height:34}}><Radio size={14}/></div><div><div className="table-title">{c.title}</div><div className="table-sub">{c.status==="live" ? `Live for ${fmtTime(c.startedAt)}` : "Ready to broadcast"}</div></div></div></td><td><span className="mono" style={{fontSize:11}}>{c.platform}</span></td><td><div className={`status ${c.status}`}><span className="status-dot"/>{c.status}</div></td><td><span className="table-sub">{groupsById[c.groupId]||"Unassigned"} · {c.playlistVideoIds?.length || videosForGroup(c.groupId,data.groups,data.videos).length} video{(c.playlistVideoIds?.length || videosForGroup(c.groupId,data.groups,data.videos).length)===1?"":"s"}</span></td><td><span className="table-sub url-cell" title={c.streamUrl}>{c.streamUrl}</span></td><td><div className="actions">{c.status==="live"?<button className="button warn small" onClick={()=>stop(c)} data-testid={`button-stop-${c.id}`}><Square size={12}/> Stop</button>:<button className="button secondary small" onClick={()=>start(c)} data-testid={`button-start-${c.id}`}><Play size={12}/> Start</button>}<button className="icon-button" style={{width:30,height:30}} onClick={()=>{setEditing(c);setShowForm(true)}} title="Edit channel" data-testid={`button-edit-channel-${c.id}`}><Pencil size={13}/></button><button className="icon-button" style={{width:30,height:30}} onClick={()=>setDeleting(c)} title="Delete channel" data-testid={`button-delete-channel-${c.id}`}><Trash2 size={13}/></button></div></td></tr>)}</tbody></table></div>}</div>
      <div className="card section-card signal-checklist-card" style={{marginTop:18}}><div className="section-head"><div><h2 className="section-title">Signal checklist</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>A few calm checks before you go on air.</p></div><Clipboard className="signal-checklist-icon" size={17}/></div><div className="signal-checklist-grid">{["Live URL is saved locally","At least one destination is ready","Stream process status is monitored"].map((t)=><div className="signal-check-item" key={t}><span className="signal-check-icon"><Check size={12}/></span>{t}</div>)}</div></div>
   </div>{showForm&&<ChannelModal channel={editing} groups={data.groups} videos={data.videos} onSave={save} onClose={()=>{setShowForm(false);setEditing(undefined)}}/>}{deleting&&<ConfirmModal title="Delete this channel?" copy={`“${deleting.title}” and its stream settings will be removed from this workspace. Any live signal must be stopped first.`} onClose={()=>setDeleting(undefined)} onConfirm={()=>{update({channels:data.channels.filter(c=>c.id!==deleting.id)},{message:`${deleting.title} was deleted`,type:"edit"});setDeleting(undefined)}}/>}{streamKeyChannel&&<StreamKeyModal channel={streamKeyChannel} value={streamKeyDraft} onChange={setStreamKeyDraft} onClose={()=>setStreamKeyChannel(undefined)} onContinue={()=>{const channel={...streamKeyChannel,streamKey:streamKeyDraft.trim()};update({channels:data.channels.map((item)=>item.id===channel.id?channel:item)},{message:`Stream key saved for ${channel.title}`,type:"edit"});setStreamKeyChannel(undefined);void start(channel);}}/>}</AppShell>;
}

function LivePreviewPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data, update} = workspace;
  const liveChannels = data.channels.filter((channel) => channel.status === "live");
  const [selectedChannelId, setSelectedChannelId] = useState(liveChannels[0]?.id || data.channels[0]?.id || "");
  const [overlayBusy, setOverlayBusy] = useState(false);
  const [webcamPosition, setWebcamPosition] = useState<FacePosition>("bottom-right");
  const [webcamScale, setWebcamScale] = useState(0.25);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const selectedChannel = data.channels.find((channel) => channel.id === selectedChannelId);
  const livePreviewUrl = selectedChannel?.status === "live"
    ? `/api/stream/preview/${encodeURIComponent(streamIdFor(workspace.clientId, selectedChannel.id))}/signal.m3u8`
    : "";
   const devices = useLivePreviewDevices({
     streamId: selectedChannel?.status === "live" ? streamIdFor(workspace.clientId, selectedChannel.id) : undefined,
     webcamEnabled,
     webcamPosition,
     webcamScale,
   });

  useEffect(() => {
    if (selectedChannel && data.channels.some((channel) => channel.id === selectedChannel.id)) return;
    setSelectedChannelId(liveChannels[0]?.id || data.channels[0]?.id || "");
  }, [data.channels, liveChannels, selectedChannel]);

  const applyLiveAnimation = async (settings: LiveAnimationSettings) => {
    if (!selectedChannel) return;
    if (selectedChannel.status !== "live") {
      workspace.setToast("Start this channel in Live channels before applying a live animation.");
      return;
    }
    const playlist = playlistFor(selectedChannel, data.groups, data.videos);
    if (!playlist.videoSources.length) {
      workspace.setToast("Choose at least one playlist video first.");
      return;
    }
    const animation = data.videos.find((video) => video.id === settings.id && video.serverSource);
    setOverlayBusy(true);
    try {
      const streamId = streamIdFor(workspace.clientId, selectedChannel.id);
      const composition: EditorStreamComposition | undefined = selectedChannel.editorComposition
        ? {
            ...selectedChannel.editorComposition,
            animationSource: animation?.serverSource,
            animationX: settings.x,
            animationY: settings.y,
            animationScale: settings.scale,
            comingSoon: settings.comingSoon,
          }
        : settings.comingSoon
          ? {
              mainX: 0,
              mainY: 0,
              mainScale: 1,
              cropMode: "fit",
              webcamX: 0,
              webcamY: 0,
              webcamScale: selectedChannel.faceSize ? selectedChannel.faceSize / 100 : 0.25,
              animationX: settings.x,
              animationY: settings.y,
              animationScale: settings.scale,
              logoPosition: "bottom-right",
              logoScale: 0.25,
              animationPreset: "none",
              comingSoon: true,
              brightness: 0,
              contrast: 1,
              saturation: 1,
              hue: 0,
            }
        : undefined;
      await updateStream({
        streamId,
        ingestUrl: resolveStreamIngestUrl(selectedChannel.streamUrl, selectedChannel.streamKey),
        category: playlist.category || "",
        videoSource: playlist.mainVideos[0]?.serverSource,
        videoSources: playlist.videoSources,
        faceCategory: composition?.webcamSource ? "editor face cam" : (playlist.faceSources.length ? playlist.faceCategory : undefined),
        faceSource: composition?.webcamSource || playlist.faceVideos[0]?.serverSource,
        faceSources: composition?.webcamSource ? [composition.webcamSource] : playlist.faceSources,
        playbackSpeed: selectedChannel.playbackSpeed || 1,
         quality: selectedChannel.streamQuality || "1080p",
        aspectRatio: selectedChannel.aspectRatio || "full",
        facePosition: selectedChannel.facePosition || "bottom-right",
        faceScale: (selectedChannel.faceSize || 25) / 100,
        durationMinutes: (selectedChannel.durationHours || 1) * 60,
        autoRestart: Boolean(selectedChannel.autoRestart),
        voiceAudio: true,
        liveAnimationSource: composition?.animationSource || animation?.serverSource,
        liveAnimationX: settings.x,
        liveAnimationY: settings.y,
        liveAnimationScale: settings.scale,
        composition,
      });
      const next = {
        ...selectedChannel,
        liveAnimationId: animation?.id,
        liveAnimationX: settings.x,
        liveAnimationY: settings.y,
        liveAnimationScale: settings.scale,
        editorComposition: composition,
      };
      update(
        { channels: data.channels.map((channel) => channel.id === next.id ? next : channel) },
        { message: animation ? `${animation.title} is now live on ${next.title}` : `Live animation removed from ${next.title}`, type: "live" },
      );
    } catch (error) {
      workspace.setToast(error instanceof Error ? error.message : "The live animation could not be applied.");
    } finally {
      setOverlayBusy(false);
    }
  };

  return <AppShell title="Live Stream Preview" workspace={workspace}>
    <div className="page live-preview-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Broadcast preview / live studio</p>
          <h1>Live Stream Preview</h1>
          <p className="subtle">Watch the active stream composition separately from normal video editing. Camera, microphone, and live animations are controlled here.</p>
        </div>
        <div className="page-head-actions">
          <span className={`page-live-indicator ${selectedChannel?.status === "live" ? "is-live" : ""}`}><span className="status-dot"/>{selectedChannel?.status === "live" ? "Live signal running" : "Preview only"}</span>
          <Link className="button secondary" href="/live"><MonitorPlay size={15}/> Manage channels</Link>
        </div>
      </div>

      <div className="live-preview-toolbar card">
        <div className="field"><label>Preview channel</label><select value={selectedChannelId} onChange={(event) => setSelectedChannelId(event.target.value)} data-testid="select-live-preview-channel"><option value="">Choose a channel</option>{data.channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.title} · {channel.status}</option>)}</select></div>
        <div className="live-preview-toolbar-copy"><span className={`status ${selectedChannel?.status === "live" ? "live" : "stopped"}`}><span className="status-dot"/>{selectedChannel?.status === "live" ? "Broadcasting" : "Not on air"}</span><small>{selectedChannel?.status === "live" ? "This preview follows the selected live channel." : "Start the channel to apply preview controls to the stream."}</small></div>
      </div>

      {!selectedChannel ? <div className="card live-preview-empty"><Radio size={26}/><h2>No live channel configured</h2><p>Create a channel and select a playlist before opening the live preview.</p><Link className="button" href="/live">Open live channels <ArrowRight size={14}/></Link></div> : <div className="live-preview-stack">
       <section className="card live-output-card">
           <div className="section-head"><div><h2 className="section-title">Actual live output</h2><p className="subtle">This is the same encoded composition sent to the live destination, including playlist, camera, animation, and voice.</p></div><Radio size={17} color="#b0d84a"/></div>
           <LiveOutputPreview src={livePreviewUrl}/>
           <p className="live-output-note">The preview follows the broadcast buffer, so it is intentionally a few seconds behind the source. Applying a composition keeps the publisher on air while the next encoded renderer warms up.</p>
         </section>
        <LiveAnimationControl
          channel={selectedChannel}
          data={data}
          licenseId={workspace.licenseId}
          busy={overlayBusy}
          onApply={applyLiveAnimation}
          webcamStream={devices.webcamStream}
          webcamEnabled={webcamEnabled}
          webcamPosition={webcamPosition}
          webcamScale={webcamScale}
        />
        <section className="card live-device-panel">
           <div className="section-head"><div><h2 className="section-title">Camera and voice over</h2><p className="subtle">Give this browser permission to send your camera and microphone into the selected live channel.</p></div><Mic size={17} color="#6c8b83"/></div>
          <div className="live-device-grid">
            <div className={`live-device-card ${webcamEnabled && devices.webcamStream ? "ready" : ""}`}>
              <div className="live-device-icon"><Camera size={18}/></div>
                <div><strong>Direct webcam</strong><p>{devices.webcamStream ? "Camera is connected. Broadcast output is delayed by 10 seconds." : "Send your camera directly into the live composition."}</p></div>
              <button className={`button small ${webcamEnabled && devices.webcamStream ? "ghost" : "secondary"}`} onClick={() => { if (devices.webcamStream) { setWebcamEnabled((enabled) => !enabled); } else { void devices.enableWebcam().then((enabled) => setWebcamEnabled(enabled)); } }} data-testid="button-toggle-live-webcam">{webcamEnabled && devices.webcamStream ? "Hide camera" : "Enable camera"}</button>
            </div>
            <div className={`live-device-card ${devices.voiceStream ? "ready" : ""}`}>
              <div className="live-device-icon"><Mic size={18}/></div>
              <div className="live-device-copy"><strong>Voice over microphone</strong><p>{devices.voiceStream ? "Your microphone is being mixed into the live broadcast." : "Allow microphone access to add your voice to the live broadcast."}</p>{devices.voiceStream && <div className="voice-meter"><span style={{ width: `${devices.voiceLevel}%` }}/></div>}</div>
              <button className={`button small ${devices.voiceStream ? "ghost" : "secondary"}`} onClick={() => { if (devices.voiceStream) devices.disableVoice(); else void devices.enableVoice(); }} data-testid="button-toggle-live-microphone">{devices.voiceStream ? "Mute mic" : "Enable mic"}</button>
            </div>
          </div>
          {(devices.webcamError || devices.voiceError) && <div className="error-note">{devices.webcamError || devices.voiceError}</div>}
          <div className="live-device-adjustments">
            <div className="field"><label>Webcam position</label><select value={webcamPosition} onChange={(event) => setWebcamPosition(event.target.value as FacePosition)} disabled={!webcamEnabled}><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option><option value="center">Center</option></select></div>
            <div className="field"><label>Webcam size · {Math.round(webcamScale * 100)}%</label><input type="range" min="10" max="60" value={Math.round(webcamScale * 100)} onChange={(event) => setWebcamScale(Number(event.target.value) / 100)} disabled={!webcamEnabled}/></div>
              <div className="live-preview-note"><ShieldCheck size={14}/><span>Camera and microphone use a coordinated 10-second broadcast buffer. Turning either device on or off keeps the main broadcast process alive without replaying the playlist.</span></div>
          </div>
        </section>
      </div>}
    </div>
  </AppShell>;
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
  return <Modal title={video?"Edit video":"Add video"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-video">Cancel</button><button className="button" type="submit" form="video-form" disabled={uploading} data-testid="button-save-video">{uploading ? "Uploading…" : video ? "Save changes" : "Add video"} {!uploading&&<Check size={14}/>}</button></>}><form id="video-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>{video?"Replace video file (optional)":"Choose video file"}</label><input autoFocus required={!form.sourceUrl} type="file" accept="video/*" onChange={e=>{const next=e.target.files?.[0];if(!next)return;setFile(next);setFileName(next.name);setForm(f=>({...f,title:f.title||next.name.replace(/\.[^.]+$/,""),sourceUrl:URL.createObjectURL(next)}))}} data-testid="input-video-file"/>{fileName&&<span className="file-picked"><Check size={13}/> {fileName} · server-ready upload</span>}{uploadError&&<div className="error-note">{uploadError}</div>}</div><div className="field full"><label>Video title</label><input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Title for this video" data-testid="input-video-title"/></div><div className="field"><label>Video category</label><select required value={form.groupId} onChange={e=>set("groupId",e.target.value)}><option value="">Select a folder</option>{groups.filter((group) => isUserUploadFolder(group.id, groups) || group.id === video?.groupId).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id, groups)}</option>)}</select></div><div className="field"><label>Duration</label><input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="24:18" data-testid="input-video-duration"/></div></div><div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Included animations are read-only for license users. Rendered files are saved automatically in the protected Edited Videos folder.</div></form></Modal>;
}

function TrimModal({video,licenseId="",licenseName="",folderName="",onCreate,onClose}:{video:VideoItem;licenseId?:string;licenseName?:string;folderName?:string;onCreate:(clip:VideoItem)=>void;onClose:()=>void}) {
  const fileId = getMediaFileId(video);
  const previewUrl = videoPlaybackUrl(video, licenseId);
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

function AddToStreamChannelModal({
  channels,
  mainGroupId,
  mainVideoIds,
  animationId,
  title,
  composition,
  onSave,
  onClose,
}: {
  channels: LiveChannel[];
  mainGroupId: string;
  mainVideoIds: string[];
  animationId?: string;
  title: string;
  composition: EditorStreamComposition;
  onSave: (channel: LiveChannel) => void;
  onClose: () => void;
}) {
  const [channelId, setChannelId] = useState(channels[0]?.id || "");
  const channel = channels.find((item) => item.id === channelId);
  const [streamKey, setStreamKey] = useState(channel?.streamKey || "");
  useEffect(() => {
    setStreamKey(channel?.streamKey || "");
  }, [channelId, channel?.streamKey]);
  const continueToStream = () => {
    if (!channel || !streamKey.trim() || !mainGroupId || !mainVideoIds.length) return;
    onSave({
      ...channel,
      groupId: mainGroupId,
      playlistVideoIds: mainVideoIds,
      streamKey: streamKey.trim(),
      liveAnimationId: animationId || undefined,
      liveAnimationX: composition.animationX,
      liveAnimationY: composition.animationY,
      liveAnimationScale: composition.animationScale,
      editorComposition: composition,
    });
  };
  return <Modal title="Add edited stream to a channel" onClose={onClose} footer={channels.length ? <><button className="button ghost" onClick={onClose} data-testid="button-cancel-add-stream">Cancel</button><button className="button" onClick={continueToStream} disabled={!channel || !streamKey.trim() || !mainGroupId || !mainVideoIds.length} data-testid="button-continue-add-stream">Continue to stream channel <ArrowRight size={14}/></button></> : <Link className="button" href="/live" onClick={onClose}>Create a stream channel <ArrowRight size={14}/></Link>}>
    {!channels.length ? <div className="stream-key-notice"><Radio size={18}/><div><strong>Create a stream channel first.</strong><p>Your edited composition will be ready to attach as soon as a destination is configured.</p></div></div> : <><div className="stream-key-notice"><Check size={18}/><div><strong>{title || "Edited composition"} is ready.</strong><p>The selected clips, face cam, animation, logo, color adjustments, and canvas positions will be used by the live encoder without creating a slow rendered copy.</p></div></div><div className="field"><label>Stream channel</label><select value={channelId} onChange={(event) => setChannelId(event.target.value)} data-testid="select-add-stream-channel">{channels.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.status}</option>)}</select></div><div className="field"><label>Stream key</label><input type="password" autoFocus autoComplete="new-password" value={streamKey} onChange={(event) => setStreamKey(event.target.value)} placeholder="Paste your platform stream key" data-testid="input-add-stream-key"/><span className="field-hint">The key is required before Continue. It is used only when this channel starts.</span></div><div className="form-note"><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>After Continue, open the channel, press Start, then use Live Stream Preview for the live composition, face cam, and voice-over.</div></>}
  </Modal>;
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
    return <Modal title="Add a video folder" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-folder-upload">Close</button><button className="button" type="submit" form="folder-upload-form" disabled={uploading||!files.length} data-testid="button-start-folder-upload">{uploading?`Uploading ${progress}/${files.length}…`:"Upload folder"} {!uploading&&<Upload size={14}/>}</button></>}><form id="folder-upload-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>Choose a folder</label><input ref={inputRef} autoFocus type="file" multiple accept="video/*" onChange={e=>chooseFiles(e.target.files)} data-testid="input-video-folder"/><span className="field-hint">{files.length?`${files.length} video${files.length===1?"":"s"} selected · browser folder order will be used.`:"Select a folder with videos 1, 2, 3…10."}</span></div><div className="field full"><label>Save in folder</label><select required value={groupId} onChange={e=>setGroupId(e.target.value)} data-testid="select-folder-group"><option value="">Select a folder</option>{groups.filter((group) => isUserUploadFolder(group.id, groups)).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id, groups)}</option>)}</select></div></div>{error&&<div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Videos are uploaded one by one and appended to the selected folder. Included animations and Edited Videos are protected folders.</div></form></Modal>;
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
    && !isEditedVideosFolder(item.id, groups)
  );
  const submit = () => {
    if (!name.trim()) return;
    const reservedName = name.trim().toLowerCase();
    if (
      (reservedName === "included animations" || reservedName === "my animations" || reservedName === editedVideosFolderName.toLowerCase())
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

function EditorClipCard({ video, index, selected, onToggle, licenseId, animationMode = false }: { video: VideoItem; index: number; selected: boolean; onToggle: () => void; licenseId: string; animationMode?: boolean }) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const previewUrl = videoPlaybackUrl(video, licenseId);
  const startPreview = () => {
    setHovering(true);
    void previewRef.current?.play().catch(() => undefined);
  };
  const stopPreview = () => {
    setHovering(false);
    const preview = previewRef.current;
    if (!preview) return;
    preview.pause();
    preview.currentTime = 0;
  };
  return <label
    className={`editor-clip ${selected ? "selected" : ""} ${hovering ? "previewing" : ""}`}
    onMouseEnter={startPreview}
    onMouseLeave={stopPreview}
    onFocus={startPreview}
    onBlur={stopPreview}
  >
    <div className="editor-clip-preview">
      {previewUrl ? <video ref={previewRef} src={previewUrl} muted loop playsInline preload="metadata" /> : <Video size={19} />}
       <span className="editor-clip-preview-badge">{animationMode ? "Overlay layer" : hovering ? "Previewing" : "Hover to play"}</span>
      <span className="editor-clip-check"><input type="checkbox" checked={selected} onChange={onToggle} /></span>
    </div>
    <div className="editor-clip-copy"><strong title={video.title}>{video.title}</strong><small>{String(index + 1).padStart(2, "0")} · {video.duration} · {video.quality || "ready"}</small></div>
  </label>;
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
      const canAddVideo=isUserUploadFolder(g.id,data.groups);
      const canManageChildren=!isProtectedWorkspaceFolder(g,data.groups);
      const openLabel=isRoot?"Choose Included Animations or My Animations":g.id===includedAnimationFolderId?"Admin managed · shared with every license":g.id===myAnimationFolderId?"Private to this license":isEditedVideosFolder(g.id,data.groups)?"Protected media destination":"Open folder";
       return <div className="folder-tree-node" key={g.id}><div className={`card group-card ${children.length ? "group-card-parent" : ""}`} data-testid={`card-group-${g.id}`}><button className={`group-open ${isRoot ? "group-open-static" : ""}`} disabled={isRoot} onClick={()=>openGroup(g.id)} data-testid={`button-open-group-${g.id}`}><h3>{g.name}{isEditedVideosFolder(g.id,data.groups)&&<span className="folder-protected-badge">Protected</span>}</h3><p>{g.description||"No description yet."}</p><span className="group-open-label">{openLabel} {!isRoot&&<ArrowRight size={12}/>}</span></button><div className="group-foot"><span>{g.videoIds.length} video{g.videoIds.length===1?"":"s"}</span><div className="group-actions">{canAddVideo&&<button onClick={()=>openAddVideo(g.id)} className="section-link" data-testid={`button-add-video-${g.id}`}>Add video</button>}{canAddChild&&canManageChildren&&<button onClick={()=>openNewGroup(g.id)} className="section-link" data-testid={`button-add-subfolder-${g.id}`}>Add folder inside</button>}{!isProtectedWorkspaceFolder(g,data.groups)&&<button onClick={()=>setDeleting({kind:"group",id:g.id,name:g.name})} className="section-link" style={{color:"#a05b45"}} data-testid={`button-delete-group-${g.id}`}>Delete</button>}</div></div>{children.length>0&&<div className="folder-tree-children"><span className="folder-tree-label">Inside {g.name}</span>{children.filter((child)=>!isIncludedFolder(child.id,data.groups)).map(renderGroupCard)}</div>}</div></div>;
    };
      const personalGroups = data.groups.filter((item) => !isYoutubeAnimationRoot(item.id, data.groups) && !isIncludedFolder(item.id, data.groups));
     const groups=<div>{personalGroups.length===0?<div className="card"><EmptyState icon={<FolderOpen size={21}/>} title="No personal categories yet" copy="Create a category to organize your personal videos. Shared YouTube animations are available inside Video editor." action="Create category" onClick={()=>openNewGroup()}/></div>:<div className="group-tree">{personalGroups.filter((item)=>!item.parentId).map(renderGroupCard)}</div>}</div>;
          return <AppShell title="Video library" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Archive & distribution</p><h1>Video library</h1><p className="subtle">Personal videos live here. Shared YouTube animations are available only inside Video editor.</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}><Link className="button secondary" href="/editor" data-testid="link-open-video-editor"><Wand2 size={15}/> Video editor</Link>{tab==="groups"&&<button className="button secondary" onClick={()=>openNewGroup()} data-testid="button-add-group"><Plus size={15}/> New category</button>}{tab==="library"&&<button className="button danger" onClick={()=>setDeletingAll(true)} disabled={!data.videos.some((video)=>!isIncludedVideo(video))} data-testid="button-delete-all-videos"><Trash2 size={15}/> Delete personal videos</button>}<button className="button secondary" onClick={()=>setFolderModal(true)} data-testid="button-folder-upload"><FolderOpen size={15}/> Add folder</button><button className="button secondary" onClick={()=>setYoutubeModal(true)} data-testid="button-youtube-downloader"><Download size={15}/> Bulk YouTube download</button><button className="button" onClick={()=>openAddVideo(group!=="all"?group:myAnimationFolderId)} data-testid="button-add-video"><Plus size={15}/> Add video</button></div></div><div className="toolbar"><div className="filter-row"><button className={`button small ${tab==="library"?"":"ghost"}`} onClick={()=>setTab("library")} data-testid="button-tab-library"><FileVideo size={13}/> Videos</button><button className={`button small ${tab==="groups"?"":"ghost"}`} onClick={()=>setTab("groups")} data-testid="button-tab-groups"><FolderOpen size={13}/> Folders</button></div>{tab==="library"&&<div className="filter-row"><div className="input-wrap"><Search size={14}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search personal videos…" data-testid="input-search-videos"/></div><select value={status} onChange={e=>setStatus(e.target.value)} data-testid="select-filter-status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select><select value={group} onChange={e=>setGroup(e.target.value)} data-testid="select-filter-group"><option value="all">All personal folders</option>{data.groups.filter((item)=>!isIncludedFolder(item.id,data.groups)).map(g=><option value={g.id} key={g.id}>{folderPathForGroup(g.id,data.groups)}</option>)}</select></div>}</div>{tab==="library"?library:groups}</div>{videoModal&&<VideoModal video={editingVideo} groups={data.groups} defaultGroupId={videoGroupId} licenseId={workspace.licenseId} licenseName={workspace.user} onSave={saveVideo} onClose={()=>{setVideoModal(false);setVideoGroupId("");setEditingVideo(undefined)}}/>}{trimVideo&&<TrimModal video={trimVideo} licenseId={workspace.licenseId} licenseName={workspace.user} folderName={folderPathForGroup(trimVideo.groupId,data.groups)||trimVideo.folderName||""} onCreate={clip=>{const videos=data.videos.filter(video=>video.id!==trimVideo.id);update({videos:[...videos,clip],groups:rebuildGroupMembership(data.groups,[...videos,clip])},{message:`${trimVideo.title} was replaced by ${clip.title}`,type:"video"});setTrimVideo(undefined)}} onClose={()=>setTrimVideo(undefined)}/>} {youtubeModal&&<YoutubeDownloadModal groups={data.groups} defaultGroupId={group!=="all"&&isVideoDestinationFolder(group,data.groups)?group:myAnimationFolderId} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setYoutubeModal(false)}/>} {folderModal&&<BulkUploadModal groups={data.groups} defaultGroupId={group!=="all"&&isVideoDestinationFolder(group,data.groups)?group:myAnimationFolderId} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setFolderModal(false)}/>} {groupModal&&<GroupModal group={editingGroup} groups={data.groups} defaultParentId={newGroupParentId} onSave={saveGroup} onClose={()=>{setGroupModal(false);setEditingGroup(undefined);setNewGroupParentId("")}}/>}{deleting&&<ConfirmModal title={`Delete this ${deleting.kind}?`} copy={`“${deleting.name}” will be removed from the ${deleting.kind==="video"?"library and its stored file":"workspace along with every video inside it"}. This cannot be undone.`} onClose={()=>setDeleting(undefined)} onConfirm={()=>void remove()}/>} {deletingAll&&<ConfirmModal title="Delete personal videos?" copy="Every stored video file for this license will be deleted. Included Animations will stay available to everyone." onClose={()=>setDeletingAll(false)} onConfirm={()=>void removeAll()}/>}</AppShell>;
}

function VideoEditorPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data, update, setToast} = workspace;
  const [, setLocation] = useLocation();
  const [groupId, setGroupId] = useState("");
  const [animationGroupId, setAnimationGroupId] = useState("");
  const [editorLibrary, setEditorLibrary] = useState<"personal" | "youtube">("personal");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [loopCount, setLoopCount] = useState("1");
  const [title, setTitle] = useState("");
  const [outputAspectRatio, setOutputAspectRatio] = useState<AspectRatio>("full");
  const [cropMode, setCropMode] = useState<EditorCropMode>("fit");
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
  const [chromaKeyByLayer, setChromaKeyByLayer] = useState<EditorChromaByLayer>(() => ({
    main: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 },
    webcam: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 },
    animation: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 },
  }));
  const [chromaKeyByVideoId, setChromaKeyByVideoId] = useState<EditorChromaByVideoId>({});
  const [chromaDraft, setChromaDraft] = useState<EditorChromaSettings>(() => ({
    enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08,
  }));
  const [chromaSourceId, setChromaSourceId] = useState("");
  const [webcamId, setWebcamId] = useState("");
  const [animationId, setAnimationId] = useState("");
  const [animationTransform, setAnimationTransform] = useState<EditorTransform>({ x: 0, y: 0, scale: 0.25 });
  const [logoId, setLogoId] = useState("");
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [mobileEditorPanel, setMobileEditorPanel] = useState<"files" | "timing" | "layers" | "effects">("files");
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const editorDraft = data.editorDraft;
  const selectedGroup = data.groups.find((group) => group.id === groupId);
  const editorGroups = useMemo(
    () => data.groups.filter((group) => editorLibrary === "youtube"
      ? isAnimationFolder(group.id, data.groups)
      : !isYoutubeAnimationRoot(group.id, data.groups) && !isIncludedFolder(group.id, data.groups)),
    [data.groups, editorLibrary],
  );
  const animationFolders = useMemo(
    () => editorGroups
      .filter((group) => group.id !== youtubeAnimationFolderId)
      .sort((a, b) => {
        const aMy = isMyAnimationFolder(a.id, data.groups);
        const bMy = isMyAnimationFolder(b.id, data.groups);
        return Number(aMy) - Number(bMy) || a.name.localeCompare(b.name);
      }),
    [data.groups, editorGroups],
  );
  const personalGroupVideos = useMemo(
    () => selectedGroup
      ? videosForFolderScope(selectedGroup.id, data.groups, data.videos).filter((video) => video.serverSource)
      : [],
    [selectedGroup, data.groups, data.videos],
  );
  const selectedAnimationGroup = data.groups.find((group) => group.id === animationGroupId);
  const animationGroupVideos = useMemo(
    () => selectedAnimationGroup
      ? videosForFolderScope(selectedAnimationGroup.id, data.groups, data.videos).filter((video) => video.serverSource)
      : [],
    [selectedAnimationGroup, data.groups, data.videos],
  );
  const groupVideos = editorLibrary === "youtube" ? animationGroupVideos : personalGroupVideos;
  const selectedVideos = selectedIds.map((id) => personalGroupVideos.find((video) => video.id === id)).filter((video): video is VideoItem => Boolean(video));
  const logo = data.editorAssets.find((asset) => asset.id === logoId);
  const previewVideo = selectedVideos.find((video) => video.id === chromaSourceId) || selectedVideos[0];
  const webcamVideos = useMemo(
    () => data.videos.filter((video) =>
      video.serverSource
      && video.id !== previewVideo?.id
      && video.licenseId === workspace.licenseId
      && !isIncludedVideo(video),
    ),
    [data.videos, previewVideo?.id, workspace.licenseId],
  );
  const webcam = webcamVideos.find((video) => video.id === webcamId);
  const animationVideos = useMemo(
    () => data.videos.filter((video) => video.serverSource && (isIncludedVideo(video) || isVideoInFolderScope(video, myAnimationFolderId, data.groups))),
    [data.videos, data.groups],
  );
  const animation = animationVideos.find((video) => video.id === animationId);
  const includedAnimationVideos = animationVideos.filter((video) => isIncludedVideo(video));
  const myAnimationVideos = animationVideos.filter((video) => !isIncludedVideo(video));
  useEffect(() => {
    if (draftHydrated) return;
    const draft = editorDraft;
    if (draft) {
      setGroupId(draft.groupId);
      setAnimationGroupId(draft.animationGroupId);
      setEditorLibrary(draft.editorLibrary);
      setSelectedIds(draft.selectedIds);
      setLoopEnabled(draft.loopEnabled);
      setLoopCount(draft.loopCount);
      setTitle(draft.title);
      setOutputAspectRatio(draft.outputAspectRatio);
      setCropMode(draft.cropMode);
      setLogoPosition(draft.logoPosition);
      setOverlayScale(draft.overlayScale);
      setWebcamPosition(draft.webcamPosition);
      setWebcamScale(draft.webcamScale);
      setMainTransform(draft.mainTransform);
      setWebcamTransform(draft.webcamTransform);
      setSelectedLayer(draft.selectedLayer);
      setAnimationPreset(draft.animationPreset);
      setReverseVideo(draft.reverseVideo);
      setColorAdjustments(draft.colorAdjustments);
       setChromaKeyByLayer(draft.chromaKeyByLayer);
       setChromaKeyByVideoId(draft.chromaKeyByVideoId);
       setChromaDraft(draft.chromaKeyByVideoId[draft.selectedIds[0]] || draft.chromaKeyByLayer[draft.selectedLayer]);
       setChromaSourceId(draft.selectedIds[0] || "");
      setWebcamId(draft.webcamId);
      setAnimationId(draft.animationId);
      setAnimationTransform(draft.animationTransform);
      setLogoId(draft.logoId);
    }
    setDraftHydrated(true);
  }, [draftHydrated, editorDraft]);
  useEffect(() => {
    if (!draftHydrated) return;
    update({
      editorDraft: {
        groupId,
        animationGroupId,
        editorLibrary,
        selectedIds,
        loopEnabled,
        loopCount,
        title,
        outputAspectRatio,
        cropMode,
        logoPosition,
        overlayScale,
        webcamPosition,
        webcamScale,
        mainTransform,
        webcamTransform,
        selectedLayer,
        animationPreset,
        reverseVideo,
        colorAdjustments,
         chromaKeyByLayer,
         chromaKeyByVideoId,
        webcamId,
        animationId,
        animationTransform,
        logoId,
      },
    });
  }, [
    draftHydrated, groupId, animationGroupId, editorLibrary, selectedIds, loopEnabled, loopCount, title,
    outputAspectRatio, cropMode, logoPosition, overlayScale, webcamPosition, webcamScale, mainTransform,
    webcamTransform, selectedLayer, animationPreset, reverseVideo, colorAdjustments, chromaKeyByLayer, chromaKeyByVideoId,
    webcamId, animationId, animationTransform, logoId,
  ]);
  const activeMainVideo = selectedVideos.find((video) => video.id === chromaSourceId) || selectedVideos[0];
  const activeChromaVideo = selectedLayer === "main" ? activeMainVideo : selectedLayer === "webcam" ? webcam : animation;
  useEffect(() => {
    if (selectedLayer === "main" && activeMainVideo && !selectedVideos.some((video) => video.id === chromaSourceId)) {
      setChromaSourceId(activeMainVideo.id);
    }
    const sourceSettings = activeChromaVideo
      ? chromaKeyByVideoId[activeChromaVideo.id]
      : chromaKeyByLayer[selectedLayer];
    setChromaDraft(sourceSettings || chromaKeyByLayer[selectedLayer]);
  }, [selectedLayer, activeMainVideo?.id, activeChromaVideo?.id, chromaSourceId, chromaKeyByVideoId, chromaKeyByLayer]);
  useEffect(() => {
    if (webcamId && !webcam) {
      setWebcamId("");
      setSelectedLayer("main");
    }
  }, [webcamId, webcam]);
  useEffect(() => {
    if (animationId && !animation) {
      setAnimationId("");
      if (selectedLayer === "animation") setSelectedLayer("main");
    }
  }, [animationId, animation, selectedLayer]);
  const previewUrl = videoPlaybackUrl(previewVideo, workspace.licenseId);
  const previewChromaByLayer: EditorChromaByLayer = {
    main: previewVideo ? chromaKeyByVideoId[previewVideo.id] || chromaKeyByLayer.main : chromaKeyByLayer.main,
    webcam: webcam ? chromaKeyByVideoId[webcam.id] || chromaKeyByLayer.webcam : chromaKeyByLayer.webcam,
    animation: animation ? chromaKeyByVideoId[animation.id] || chromaKeyByLayer.animation : chromaKeyByLayer.animation,
  };
  const editorCanvasProps = {
    previewUrl,
     loopEnabled,
    webcamUrl: videoPlaybackUrl(webcam, workspace.licenseId),
    animationUrl: videoPlaybackUrl(animation, workspace.licenseId),
    logo,
    logoPosition,
    outputAspectRatio,
    cropMode,
    mainTransform,
    webcamTransform,
    animationTransform,
    selectedLayer,
    animationPreset,
    reverseVideo,
    colorAdjustments,
     chromaKeyByLayer: previewChromaByLayer,
    onSelectLayer: setSelectedLayer,
    onMainTransformChange: setMainTransform,
    onWebcamTransformChange: setWebcamTransform,
    onAnimationTransformChange: setAnimationTransform,
  };
  const setGroup = (nextGroupId: string) => {
    if (editorLibrary === "youtube") {
      setAnimationGroupId(nextGroupId);
      setAnimationId("");
      setSelectedLayer("main");
      return;
    }
    setGroupId(nextGroupId);
    const nextVideos = videosForFolderScope(nextGroupId, data.groups, data.videos).filter((video) => video.serverSource);
    setSelectedIds(nextVideos.map((video) => video.id));
    setChromaSourceId(nextVideos[0]?.id || "");
    const nextGroup = data.groups.find((group) => group.id === nextGroupId);
    setTitle(nextGroup ? `${nextGroup.name} · edited` : "");
    setWebcamId("");
    setAnimationId("");
  };
  const chooseEditorLibrary = (nextLibrary: "personal" | "youtube") => {
    setEditorLibrary(nextLibrary);
    setAnimationId("");
    setSelectedLayer("main");
  };
  const toggleVideo = (videoId: string) => {
    setSelectedIds((current) => {
      const next = current.includes(videoId) ? current.filter((id) => id !== videoId) : [...current, videoId];
      if (!chromaSourceId && next.includes(videoId)) setChromaSourceId(videoId);
      if (chromaSourceId === videoId && !next.includes(videoId)) setChromaSourceId(next[0] || "");
      return next;
    });
  };
  const selectAnimation = (videoId: string) => {
    setAnimationId((current) => current === videoId ? "" : videoId);
    setSelectedLayer((current) => current === "animation" && animationId === videoId ? "main" : "animation");
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
  const streamComposition: EditorStreamComposition = {
    mainX: mainTransform.x,
    mainY: mainTransform.y,
    mainScale: mainTransform.scale,
    cropMode,
    webcamSource: webcam?.serverSource,
    webcamX: webcamTransform.x,
    webcamY: webcamTransform.y,
    webcamScale: webcamTransform.scale,
    animationSource: animation?.serverSource,
    animationX: animationTransform.x,
    animationY: animationTransform.y,
    animationScale: animationTransform.scale,
    logoSource: logo?.sourcePath,
    logoPosition: logoPosition as EditorStreamComposition["logoPosition"],
    logoScale: Number(overlayScale) / 100,
    animationPreset,
    brightness: colorAdjustments.brightness,
    contrast: colorAdjustments.contrast,
    saturation: colorAdjustments.saturation,
    hue: colorAdjustments.hue,
    chromaKeyByLayer,
    chromaKeyBySource: Object.fromEntries(
      [
        ...selectedVideos.map((video) => [video.serverSource, chromaKeyByVideoId[video.id]] as const),
        ...(webcam?.serverSource ? [[webcam.serverSource, chromaKeyByVideoId[webcam.id]] as const] : []),
        ...(animation?.serverSource ? [[animation.serverSource, chromaKeyByVideoId[animation.id]] as const] : []),
      ].filter((entry): entry is readonly [string, EditorChromaSettings] => Boolean(entry[0] && entry[1])),
    ),
    chromaKeyDurations: Object.fromEntries(
      selectedVideos
        .filter((video): video is VideoItem & { serverSource: string } => Boolean(video.serverSource))
        .map((video) => [video.serverSource, parseDurationSeconds(video.duration)]),
    ),
    chromaKeyEnabled: Object.values(chromaKeyByLayer).some((settings) => settings.enabled),
    chromaKeyTarget: (chromaKeyByLayer.webcam.enabled ? "webcam" : chromaKeyByLayer.animation.enabled ? "animation" : "main"),
    chromaKeyColor: chromaKeyByLayer[selectedLayer].color,
    chromaSimilarity: chromaKeyByLayer[selectedLayer].similarity,
    chromaBlend: chromaKeyByLayer[selectedLayer].blend,
  };
  const selectedChromaLabel = activeChromaVideo
    ? `${selectedLayer === "main" ? "main video" : selectedLayer === "webcam" ? "face cam" : "animation"} · ${activeChromaVideo.title}`
    : selectedLayer === "main" ? "main video" : selectedLayer === "webcam" ? "face cam" : "animation overlay";
  const selectedChromaAvailable = Boolean(activeChromaVideo);
  const appliedChromaVideos = Object.values(chromaKeyByVideoId).filter((settings) => settings.enabled).length;
  const mobilePanelClass = (panel: typeof mobileEditorPanel) =>
    `card editor-panel mobile-editor-panel mobile-editor-panel-${panel} ${mobileEditorPanel === panel ? "is-mobile-active" : ""}`;
  const applyChromaToSelected = () => {
    if (!selectedChromaAvailable) return;
    if (activeChromaVideo) {
      setChromaKeyByVideoId((current) => ({ ...current, [activeChromaVideo.id]: { ...chromaDraft } }));
    } else {
      setChromaKeyByLayer((current) => ({ ...current, [selectedLayer]: { ...chromaDraft } }));
    }
    setToast(`${selectedChromaLabel} background removal applied`);
  };
  const createStreamFromEditor = () => {
    if (!groupId || !selectedVideos.length) {
      setError("Select at least one server-ready video before creating a stream.");
      return;
    }
    const channelId = uid("ch");
    const channelTitle = title.trim() || `${selectedGroup?.name || "Edited"} stream`;
    const channel: LiveChannel = {
      id: channelId,
      title: channelTitle,
      platform: "Custom RTMP",
      status: "stopped",
      groupId,
      streamUrl: "",
      streamKey: "",
      viewers: 0,
      startedAt: null,
      thumbnailColor: colors[0],
      createdAt: now(),
      aspectRatio: outputAspectRatio,
      playbackSpeed: 1,
      facePosition: webcamPosition as FacePosition,
      faceSize: Number(webcamScale),
      durationHours: 1,
      autoRestart: false,
      streamQuality: "1080p",
      playlistVideoIds: selectedVideos.map((video) => video.id),
      liveAnimationId: animationId || undefined,
      liveAnimationX: animationTransform.x,
      liveAnimationY: animationTransform.y,
      liveAnimationScale: animationTransform.scale,
      editorComposition: streamComposition,
    };
    update(
      { channels: [channel, ...data.channels] },
      { message: `${channel.title} was created from the editor`, type: "live" },
    );
    setLocation(`/live?editChannel=${encodeURIComponent(channelId)}`);
  };
  return <AppShell title="Video editor" workspace={workspace}>
    <div className="page editor-page">
      <div className="page-head">
         <div><p className="eyebrow">Edit & compose</p><h1>Build your live signal</h1><p className="subtle">Shape the video, add layers, then send the finished composition directly to a stream channel.</p></div>
        <div className="editor-head-badge"><Radio size={15}/> Direct to stream</div>
      </div>
       <div className="editor-command-bar">
          <div className="editor-command-intro"><span className="editor-command-kicker">Production desk</span><strong>Shape the next signal</strong><span>Every choice is previewed here before the live encoder takes it on air.</span></div>
         <div className="editor-steps"><div className="editor-step active"><b>01</b><span>Choose clips</span></div><div className="editor-step"><b>02</b><span>Compose layers</span></div><div className="editor-step"><b>03</b><span>Send to live channel</span></div></div>
       </div>
      <form className="editor-layout" onSubmit={(event)=>event.preventDefault()}>
        <div className="editor-mobile-preview-stack">
          <section className="editor-stage card">
           <div className="editor-stage-head"><div><span className="metric-kicker">Live composition</span><strong>{selectedVideos.length ? `${selectedVideos.length} clips · ${loopEnabled ? `loops ${loopCount}` : "single pass"}` : "Choose videos to preview"}</strong></div><span className="editor-stage-status"><span className="status-dot"/>Preview</span></div>
            <EditorCanvas {...editorCanvasProps} />
            <div className="editor-preview-actions">
              <div><strong>{previewUrl ? "Preview is ready to edit" : "Select a video first"}</strong><span>{previewUrl ? "Open the large canvas to position, zoom, and fit every layer precisely." : "Choose a category and at least one server-ready video from the panel."}</span></div>
              <button type="button" className="button editor-expand-button" onClick={() => setPreviewExpanded(true)} disabled={!previewUrl}><MonitorPlay size={15}/> Open large preview & edit <ArrowRight size={14}/></button>
            </div>
            <div className="editor-stage-foot"><span><Layers size={13}/> {selectedVideos.length || 0} clips selected · {outputAspectRatio === "shorts" ? "Short 9:16" : outputAspectRatio === "square" ? "Square 1:1" : "Long 16:9"}</span><span><Sparkles size={13}/> Logo, face cam, and effects follow the live signal</span></div>
          </section>
          <div className="mobile-editor-tabs" role="tablist" aria-label="Mobile editor controls">
            {([
              ["files", <FileVideo size={14}/>, "Files"],
              ["timing", <Type size={14}/>, "Timing"],
              ["layers", <Image size={14}/>, "Layers"],
              ["effects", <Sparkles size={14}/>, "Effects"],
            ] as const).map(([panel, icon, label]) => <button
              key={panel}
              type="button"
              className={mobileEditorPanel === panel ? "active" : ""}
              onClick={() => setMobileEditorPanel(panel)}
              role="tab"
              aria-selected={mobileEditorPanel === panel}
              data-testid={`button-mobile-editor-${panel}`}
            >{icon}<span>{label}</span></button>)}
          </div>
        </div>
         {previewExpanded && <div className="editor-focus-backdrop" role="dialog" aria-modal="true" aria-label="Large video editor" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewExpanded(false); }}>
           <div className="editor-focus-window">
             <div className="editor-focus-head"><div><span className="metric-kicker">Focused editor</span><strong>{previewVideo?.title || "Selected video"}</strong><span>Drag to move · scroll or pinch to zoom · use the handle to resize face cam</span></div><button type="button" className="editor-focus-close" onClick={() => setPreviewExpanded(false)} aria-label="Close large preview"><X size={17}/><span>Close</span></button></div>
             <div className="editor-focus-stage"><EditorCanvas {...editorCanvasProps} expanded onCloseExpanded={() => setPreviewExpanded(false)} /></div>
              <div className="editor-focus-controls"><EditorTransformControls {...editorCanvasProps} hasWebcam={Boolean(webcam)} hasAnimation={Boolean(animation)} /></div>
           </div>
         </div>}
         <aside className="editor-controls">
           <section className={mobilePanelClass("files")} data-mobile-editor-panel="files">
              <div className="section-head"><div><h2 className="section-title">1. Choose files & source layers</h2><p className="subtle">Choose your files first. Personal videos and Admin + My animations stay in separate tabs.</p></div><FileVideo size={17} color="#6c8b83"/></div>
             <div className="editor-library-tabs" role="tablist" aria-label="Editor libraries">
                <button type="button" className={editorLibrary === "personal" ? "active" : ""} onClick={() => chooseEditorLibrary("personal")} role="tab" aria-selected={editorLibrary === "personal"} data-testid="button-editor-personal-library"><FileVideo size={13}/> Personal video</button>
                <button type="button" className={editorLibrary === "youtube" ? "active" : ""} onClick={() => chooseEditorLibrary("youtube")} role="tab" aria-selected={editorLibrary === "youtube"} data-testid="button-editor-youtube-animations"><Youtube size={13}/> Admin + My animations</button>
             </div>
              {editorLibrary === "youtube" ? <><div className="editor-category-lock"><FolderOpen size={15}/><div><strong>Animation overlays</strong><span>Admin Included + your My Animations · kept separate from Personal video</span></div><ShieldCheck size={14}/></div><div className="editor-animation-folders">{animationFolders.map((folder) => { const count = data.videos.filter((video) => video.serverSource && isVideoInFolderScope(video, folder.id, data.groups)).length; const label = folderPathForGroup(folder.id, data.groups).replace(`${youtubeAnimationRootName}/`, ""); return <button type="button" key={folder.id} className={`editor-animation-folder ${animationGroupId === folder.id ? "selected" : ""}`} onClick={() => setGroup(folder.id)} aria-label={`Open ${label}`}><FolderOpen size={17}/><span><strong>{folder.name}</strong><small>{label} · {count} video{count === 1 ? "" : "s"}</small></span><ArrowRight size={13}/></button>; })}</div></> : <select value={groupId} onChange={(event) => setGroup(event.target.value)} data-testid="select-editor-group"><option value="">Select personal category</option>{editorGroups.map((group) => <option key={group.id} value={group.id}>{folderPathForGroup(group.id, data.groups)}</option>)}</select>}
            <div className="editor-clip-list">{groupVideos.length ? groupVideos.map((video, index) => <EditorClipCard key={video.id} video={video} index={index} licenseId={workspace.licenseId} animationMode={editorLibrary === "youtube"} selected={editorLibrary === "youtube" ? animationId === video.id : selectedIds.includes(video.id)} onToggle={() => editorLibrary === "youtube" ? selectAnimation(video.id) : toggleVideo(video.id)} />) : <div className="editor-mini-empty"><FolderOpen size={17}/>{editorLibrary === "youtube" ? "Choose Included Animations or My Animations to see overlay videos." : "Choose a personal category to see its videos."}</div>}</div>
              <div className="editor-selected-folder">{editorLibrary === "youtube" ? (selectedAnimationGroup ? <><FolderOpen size={13}/><span>Overlay folder: <strong>{folderPathForGroup(selectedAnimationGroup.id, data.groups).replace(`${youtubeAnimationRootName}/`, "") || selectedAnimationGroup.name}</strong></span></> : <span>Choose Admin Included or My Animations.</span>) : (selectedGroup ? <><FolderOpen size={13}/><span>Main folder: <strong>{folderPathForGroup(selectedGroup.id, data.groups)}</strong></span></> : <span>Choose a personal category for the main video.</span>)}</div>
          </section>
          <section className={mobilePanelClass("timing")} data-mobile-editor-panel="timing">
             <div className="section-head"><div><h2 className="section-title">2. Timing & output</h2><p className="subtle">Choose whether this edit is a vertical Short or a landscape Long video.</p></div><Type size={17} color="#6c8b83"/></div>
            <div className="field"><label>Output title</label><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Night drive · long cut" data-testid="input-editor-title"/></div>
              <div className="form-grid"><div className="field"><label>Video format</label><select value={outputAspectRatio} onChange={(event) => setOutputAspectRatio(event.target.value as AspectRatio)} data-testid="select-editor-format"><option value="full">Long video · 16:9 landscape</option><option value="shorts">Short video · 9:16 vertical</option><option value="square">Square video · 1:1</option></select></div><div className="field"><label>Frame behavior</label><select value={cropMode} onChange={(event) => setCropMode(event.target.value as EditorCropMode)} data-testid="select-editor-crop-mode"><option value="fit">Fit entire video</option><option value="crop">Fill frame & crop edges</option></select></div></div>
              <div className="form-grid"><label className="check-control editor-toggle-control"><input type="checkbox" checked={loopEnabled} onChange={(event) => setLoopEnabled(event.target.checked)} data-testid="toggle-editor-loop"/><span><strong>Loop selected video</strong><small>Repeat the selected playlist when enabled.</small></span></label><div className="field"><label>Loop count</label><input type="number" min="1" max="12" value={loopCount} disabled={!loopEnabled} onChange={(event) => setLoopCount(event.target.value)} data-testid="input-editor-loop-count"/></div></div>
             <div className="field"><label>Selected total</label><div className="editor-readonly">{selectedVideos.length} clip{selectedVideos.length === 1 ? "" : "s"} · {outputAspectRatio === "shorts" ? "Short format" : outputAspectRatio === "square" ? "Square format" : "Long format"}</div></div>
          </section>
          <section className={mobilePanelClass("layers")} data-mobile-editor-panel="layers">
             <div className="section-head"><div><h2 className="section-title">3. Face cam & brand layers</h2><p className="subtle">Place a face cam video on top of the main video, then add a logo if needed.</p></div><Image size={17} color="#6c8b83"/></div>
            <div className="field"><label>Logo / watermark</label><div className="input-action-row"><select value={logoId} onChange={(event) => setLogoId(event.target.value)}><option value="">No logo</option>{data.editorAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.title}</option>)}</select><label className="button secondary small editor-file-button"><Upload size={13}/>{uploadingLogo ? "Uploading…" : "Upload"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingLogo} onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadLogo(file); event.currentTarget.value = ""; }}/></label></div></div>
            {logo && <div className="form-grid"><div className="field"><label>Logo position</label><select value={logoPosition} onChange={(event) => setLogoPosition(event.target.value)}><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option></select></div><div className="field"><label>Logo size · {overlayScale}%</label><input type="range" min="10" max="60" value={overlayScale} onChange={(event) => setOverlayScale(event.target.value)}/></div></div>}
              <div className="field"><label>Face cam video</label><select value={webcamId} onChange={(event) => { setWebcamId(event.target.value); setSelectedLayer(event.target.value ? "webcam" : "main"); }} data-testid="select-editor-facecam"><option value="">No face cam</option>{webcamVideos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</select><span className="field-hint">Only videos from this license workspace are available here.</span></div>
             {webcam && <div className="editor-layer-note"><span>Canvas face cam: {Math.round(webcamTransform.scale * 100)}%</span><button type="button" className="section-link" onClick={() => setSelectedLayer("webcam")}>Edit on canvas <ArrowRight size={12}/></button></div>}
                <div className="field"><label>Animation overlay</label><select value={animationId} onChange={(event) => { setAnimationId(event.target.value); setSelectedLayer(event.target.value ? "animation" : "main"); }} data-testid="select-editor-animation-overlay"><option value="">No animation overlay</option>{includedAnimationVideos.length > 0 && <optgroup label="Admin · Included Animations">{includedAnimationVideos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</optgroup>}{myAnimationVideos.length > 0 && <optgroup label="My Animations">{myAnimationVideos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</optgroup>}</select><span className="field-hint">Admin and My Animations stay separate from Personal video and appear above it in the live signal.</span></div>
              {animation && <div className="editor-layer-note"><span>Animation overlay: {Math.round(animationTransform.scale * 100)}%</span><button type="button" className="section-link" onClick={() => setSelectedLayer("animation")}>Edit on canvas <ArrowRight size={12}/></button></div>}
             <div className="field"><label>Animated callout</label><select value={animationPreset} onChange={(event) => setAnimationPreset(event.target.value as AnimationPreset)} data-testid="select-editor-animation"><option value="none">No animation</option><option value="subscribe">Subscribe pop-in</option><option value="like">Like burst</option><option value="follow">Follow pulse</option></select><span className="field-hint">The animation is previewed on the canvas and burned into the final MP4.</span></div>
             <EditorTransformControls
               selectedLayer={selectedLayer}
               hasWebcam={Boolean(webcam)}
                hasAnimation={Boolean(animation)}
               mainTransform={mainTransform}
               webcamTransform={webcamTransform}
                animationTransform={animationTransform}
               onSelectLayer={setSelectedLayer}
               onMainTransformChange={setMainTransform}
               onWebcamTransformChange={setWebcamTransform}
                onAnimationTransformChange={setAnimationTransform}
             />
             {webcam && <div className="form-grid"><div className="field"><label>Face cam position</label><select value={webcamPosition} onChange={(event) => setWebcamPosition(event.target.value)} data-testid="select-editor-facecam-position"><option value="top-left">Top left</option><option value="top-right">Top right</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option></select></div><div className="field"><label>Face cam size · {webcamScale}%</label><input type="range" min="10" max="60" value={webcamScale} onChange={(event) => setWebcamScale(event.target.value)} data-testid="input-editor-facecam-size"/></div></div>}
          </section>
           <section className={mobilePanelClass("effects")} data-mobile-editor-panel="effects">
             <div className="section-head"><div><h2 className="section-title">4. Color & effects</h2><p className="subtle">Adjust the main video, reverse it, or key out a green background.</p></div><Sparkles size={17} color="#6c8b83"/></div>
              <label className="check-control editor-toggle-control"><input type="checkbox" checked={reverseVideo} onChange={(event) => setReverseVideo(event.target.checked)} data-testid="toggle-editor-reverse"/><span><strong>Reverse main video</strong><small>Plays the selected clips from end to start in the live composition.</small></span></label>
             <div className="editor-effect-grid">
               <div className="field"><label>Brightness · {Math.round(colorAdjustments.brightness * 100)}%</label><input type="range" min="-100" max="100" value={Math.round(colorAdjustments.brightness * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, brightness: Number(event.target.value) / 100 }))} data-testid="input-editor-brightness"/></div>
               <div className="field"><label>Contrast · {Math.round(colorAdjustments.contrast * 100)}%</label><input type="range" min="50" max="180" value={Math.round(colorAdjustments.contrast * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, contrast: Number(event.target.value) / 100 }))} data-testid="input-editor-contrast"/></div>
               <div className="field"><label>Saturation · {Math.round(colorAdjustments.saturation * 100)}%</label><input type="range" min="0" max="200" value={Math.round(colorAdjustments.saturation * 100)} onChange={(event) => setColorAdjustments((current) => ({ ...current, saturation: Number(event.target.value) / 100 }))} data-testid="input-editor-saturation"/></div>
               <div className="field"><label>Hue · {colorAdjustments.hue}°</label><input type="range" min="-180" max="180" value={colorAdjustments.hue} onChange={(event) => setColorAdjustments((current) => ({ ...current, hue: Number(event.target.value) }))} data-testid="input-editor-hue"/></div>
             </div>
                 <label className="check-control editor-toggle-control"><input type="checkbox" checked={chromaDraft.enabled} onChange={(event) => setChromaDraft((current) => ({ ...current, enabled: event.target.checked }))} disabled={!selectedChromaAvailable} data-testid="toggle-editor-green-screen"/><span><strong>Remove background from selected video</strong><small>{selectedChromaAvailable ? `Editing ${selectedChromaLabel}. Configure it, then apply it to this video.` : `Select a ${selectedChromaLabel} first.`}</small></span></label>
                 {selectedLayer === "main" && <div className="field"><label>Video to edit</label><select value={activeMainVideo?.id || ""} onChange={(event) => { setChromaSourceId(event.target.value); setSelectedLayer("main"); }} disabled={!selectedVideos.length} data-testid="select-editor-chroma-video"><option value="">Select a selected video</option>{selectedVideos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</select><span className="field-hint">Select one video, configure the key, press Apply, then choose the next video. Each video keeps its own setting.</span></div>}
                 <div className="field"><label>Selected video for background removal</label><div className="editor-readonly">{selectedChromaLabel} · {chromaDraft.enabled ? "green screen removal on" : "off"}</div></div>
                {selectedChromaAvailable && <div className="editor-effect-grid chroma-key-grid"><div className="field"><label>Key color</label><input type="color" value={chromaDraft.color} onChange={(event) => setChromaDraft((current) => ({ ...current, color: event.target.value }))} data-testid="input-editor-key-color"/></div><div className="field"><label>Color range · {Math.round(chromaDraft.similarity * 100)}%</label><input type="range" min="10" max="90" value={Math.round(chromaDraft.similarity * 100)} onChange={(event) => setChromaDraft((current) => ({ ...current, similarity: Number(event.target.value) / 100 }))} data-testid="input-editor-key-similarity"/></div><div className="field"><label>Edge blend · {Math.round(chromaDraft.blend * 100)}%</label><input type="range" min="0" max="35" value={Math.round(chromaDraft.blend * 100)} onChange={(event) => setChromaDraft((current) => ({ ...current, blend: Number(event.target.value) / 100 }))} data-testid="input-editor-key-blend"/></div></div>}
                 <div className="editor-chroma-apply-row"><button type="button" className="button secondary small" onClick={applyChromaToSelected} disabled={!selectedChromaAvailable} data-testid="button-apply-editor-green-screen"><Check size={13}/> Apply to {selectedChromaLabel}</button><span>{appliedChromaVideos ? `${appliedChromaVideos} video${appliedChromaVideos === 1 ? "" : "s"} have background removal applied.` : "No video has background removal applied."}</span></div>
               <div className="editor-reset-row"><span>Reset all crop, layer, loop and effect changes.</span><button type="button" className="button ghost small" onClick={() => { const resetChroma = { main: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 }, webcam: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 }, animation: { enabled: false, color: "#00ff00", similarity: 0.32, blend: 0.08 } } satisfies EditorChromaByLayer; setLoopEnabled(true); setLoopCount("1"); setOutputAspectRatio("full"); setCropMode("fit"); setLogoPosition("bottom-right"); setOverlayScale("25"); setWebcamPosition("top-right"); setWebcamScale("25"); setMainTransform({ x: 0, y: 0, scale: 1 }); setWebcamTransform({ x: 0, y: 0, scale: 0.25 }); setAnimationTransform({ x: 0, y: 0, scale: 0.25 }); setSelectedLayer("main"); setAnimationPreset("none"); setReverseVideo(false); setColorAdjustments({ brightness: 0, contrast: 1, saturation: 1, hue: 0 }); setChromaKeyByLayer(resetChroma); setChromaKeyByVideoId({}); setChromaSourceId(selectedVideos[0]?.id || ""); setChromaDraft(resetChroma.main); setWebcamId(""); setAnimationId(""); setLogoId(""); setToast("All editor changes were reset"); }} data-testid="button-reset-editor">Reset edits</button></div>
               <div className="form-note"><Sparkles size={14} style={{verticalAlign:"-3px",marginRight:6}}/>These effects are shown in the preview and applied directly by the live encoder.</div>
           </section>
           {error && <div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}
              <button className="button editor-render-button" type="button" disabled={!selectedVideos.length} onClick={createStreamFromEditor} data-testid="button-add-edited-stream"><Radio size={15}/> Add to stream channel <ArrowRight size={15}/></button>
            <div className="form-note"><Sparkles size={14} style={{verticalAlign:"-3px",marginRight:6}}/>No intermediate MP4 is created. The selected composition is applied live by the stream encoder, including face cam, animation, logo, color, and microphone audio.</div>
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
  loopEnabled: boolean;
  webcamUrl: string;
  animationUrl: string;
  logo?: EditorAsset;
  logoPosition: string;
  outputAspectRatio: AspectRatio;
  cropMode: EditorCropMode;
  mainTransform: EditorTransform;
  webcamTransform: EditorTransform;
  animationTransform: EditorTransform;
  selectedLayer: EditorLayer;
  animationPreset: AnimationPreset;
  reverseVideo: boolean;
  colorAdjustments: EditorColorAdjustments;
  chromaKeyByLayer: EditorChromaByLayer;
  onSelectLayer: (layer: EditorLayer) => void;
  onMainTransformChange: (transform: EditorTransform) => void;
  onWebcamTransformChange: (transform: EditorTransform) => void;
  onAnimationTransformChange: (transform: EditorTransform) => void;
  expanded?: boolean;
  onCloseExpanded?: () => void;
};

function EditorCanvas({
  previewUrl,
  loopEnabled,
  webcamUrl,
  animationUrl,
  logo,
  logoPosition,
  outputAspectRatio,
  cropMode,
  mainTransform,
  webcamTransform,
  animationTransform,
  selectedLayer,
  animationPreset,
  reverseVideo,
  colorAdjustments,
  chromaKeyByLayer,
  onSelectLayer,
  onMainTransformChange,
  onWebcamTransformChange,
  onAnimationTransformChange,
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
  const getTransform = (layer: EditorLayer) => {
    if (layer === "main") return mainTransform;
    if (layer === "webcam") return webcamTransform;
    return animationTransform;
  };
  const updateTransform = (layer: EditorLayer, next: EditorTransform) => {
    if (layer === "main") onMainTransformChange(next);
    else if (layer === "webcam") onWebcamTransformChange(next);
    else onAnimationTransformChange(next);
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
    if ((layer === "webcam" && !webcamUrl) || (layer === "animation" && !animationUrl)) return;
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

  const onWheel = (event: WheelEvent) => {
    const layer = selectedLayer === "webcam" && webcamUrl
      ? "webcam"
      : selectedLayer === "animation" && animationUrl
        ? "animation"
        : "main";
    event.preventDefault();
    event.stopPropagation();
    const current = getTransform(layer);
    updateTransform(layer, clampTransform(layer, { ...current, scale: current.scale + (event.deltaY < 0 ? 0.04 : -0.04) }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const resetLayer = (layer: EditorLayer) => {
    updateTransform(layer, layer === "main" ? { x: 0, y: 0, scale: 1 } : { x: 0, y: 0, scale: 0.25 });
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void canvasRef.current?.requestFullscreen();
  };
  const zoomLayer = selectedLayer === "webcam" && webcamUrl
    ? "webcam"
    : selectedLayer === "animation" && animationUrl
      ? "animation"
      : "main";
  const zoomPercent = Math.round(getTransform(zoomLayer).scale * 100);
  const adjustZoom = (delta: number) => {
    const current = getTransform(zoomLayer);
    updateTransform(zoomLayer, clampTransform(zoomLayer, { ...current, scale: current.scale + delta }));
  };
  const animationCopy = {
    none: "",
    subscribe: "SUBSCRIBE",
    like: "LIKE",
    follow: "FOLLOW",
  }[animationPreset];
  const mainChroma = chromaKeyByLayer.main;
  const webcamChroma = chromaKeyByLayer.webcam;
  const animationChroma = chromaKeyByLayer.animation;
  const anyChromaEnabled = Object.values(chromaKeyByLayer).some((settings) => settings.enabled);

  return <div
    ref={canvasRef}
    className={`editor-canvas editor-canvas-${outputAspectRatio}${expanded ? " editor-canvas-expanded" : ""}`}
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={onPointerUp}
  >
     {previewUrl && mainChroma.enabled ? <ChromaKeyPreview
        src={previewUrl}
        className={`editor-preview-video editor-layer-main ${selectedLayer === "main" ? "active" : ""}`}
        style={{
          transform: `translate(${mainTransform.x}%, ${mainTransform.y}%) scale(${mainTransform.scale})`,
        }}
        layer="main"
        keyColor={mainChroma.color}
        similarity={mainChroma.similarity}
        blend={mainChroma.blend}
     /> : previewUrl ? <video
       ref={mainVideoRef}
       src={previewUrl}
       muted
       autoPlay={!reverseVideo}
       loop={loopEnabled}
       playsInline
       className={`editor-preview-video editor-layer-main ${selectedLayer === "main" ? "active" : ""}`}
       data-editor-layer="main"
       style={{
         transform: `translate(${mainTransform.x}%, ${mainTransform.y}%) scale(${mainTransform.scale})`,
          objectFit: cropMode === "crop" ? "cover" : "contain",
         filter: `brightness(${1 + colorAdjustments.brightness}) contrast(${colorAdjustments.contrast}) saturate(${colorAdjustments.saturation}) hue-rotate(${colorAdjustments.hue}deg)`,
       }}
    /> : <div className="editor-empty"><Layers size={27}/><strong>Your composition appears here</strong><span>Choose a category and tick the clips you want to merge.</span></div>}
       {webcamUrl && (webcamChroma.enabled ? <ChromaKeyPreview
        src={webcamUrl}
        className={`editor-face-layer ${selectedLayer === "webcam" ? "active" : ""}`}
        style={{ left: `${50 + webcamTransform.x}%`, top: `${50 + webcamTransform.y}%`, width: `${webcamTransform.scale * 100}%` }}
        layer="webcam"
         keyColor={webcamChroma.color}
         similarity={webcamChroma.similarity}
         blend={webcamChroma.blend}
      /> : <video
        src={webcamUrl}
        muted
        autoPlay
        loop
        playsInline
        className={`editor-face-layer ${selectedLayer === "webcam" ? "active" : ""}`}
        data-editor-layer="webcam"
        style={{ left: `${50 + webcamTransform.x}%`, top: `${50 + webcamTransform.y}%`, width: `${webcamTransform.scale * 100}%` }}
      />)}
       {animationUrl && (animationChroma.enabled ? <ChromaKeyPreview
        src={animationUrl}
        className={`editor-face-layer editor-animation-layer ${selectedLayer === "animation" ? "active" : ""}`}
        style={{ left: `${50 + animationTransform.x}%`, top: `${50 + animationTransform.y}%`, width: `${animationTransform.scale * 100}%` }}
        layer="animation"
         keyColor={animationChroma.color}
         similarity={animationChroma.similarity}
         blend={animationChroma.blend}
      /> : <video
        src={animationUrl}
        muted
        autoPlay
        loop
        playsInline
        className={`editor-face-layer editor-animation-layer ${selectedLayer === "animation" ? "active" : ""}`}
        data-editor-layer="animation"
        style={{ left: `${50 + animationTransform.x}%`, top: `${50 + animationTransform.y}%`, width: `${animationTransform.scale * 100}%` }}
      />)}
    {logo && <img src={logo.playbackUrl} alt="Logo overlay preview" className={`editor-overlay logo-${logoPosition}`}/>}
    {logo && <span className={`editor-watermark-label logo-${logoPosition}`}>BRANDED</span>}
    {animationCopy && <div className={`editor-animation-preview editor-animation-${animationPreset}`}><strong>{animationCopy}</strong><span>{animationPreset === "subscribe" ? "New drop live" : animationPreset === "like" ? "Show some love" : "Stay with us"}</span></div>}
     {selectedLayer === "main" && previewUrl && <div className="editor-selection editor-selection-main" aria-hidden="true"><span className="editor-selection-label">Main video · {cropMode === "crop" ? "Crop" : "Fit"} · {Math.round(mainTransform.scale * 100)}%</span></div>}
    {selectedLayer === "webcam" && webcamUrl && <div
      className="editor-selection editor-selection-webcam"
      aria-hidden="true"
      style={{ left: `${50 + webcamTransform.x}%`, top: `${50 + webcamTransform.y}%`, width: `${webcamTransform.scale * 100}%` }}
    ><span className="editor-selection-label">Face cam · {Math.round(webcamTransform.scale * 100)}%</span><button type="button" data-editor-resize="webcam" aria-label="Resize face cam" className="editor-resize-handle" /></div>}
     {selectedLayer === "animation" && animationUrl && <div
       className="editor-selection editor-selection-webcam editor-selection-animation"
       aria-hidden="true"
       style={{ left: `${50 + animationTransform.x}%`, top: `${50 + animationTransform.y}%`, width: `${animationTransform.scale * 100}%` }}
     ><span className="editor-selection-label">Animation · {Math.round(animationTransform.scale * 100)}%</span><button type="button" data-editor-resize="animation" aria-label="Resize animation" className="editor-resize-handle" /></div>}
     {(reverseVideo || anyChromaEnabled || colorAdjustments.brightness !== 0 || colorAdjustments.contrast !== 1 || colorAdjustments.saturation !== 1 || colorAdjustments.hue !== 0) && <div className="editor-effect-badges"><span>{reverseVideo ? "Reverse" : "Effects"}</span>{anyChromaEnabled && <span>Green screen removed</span>}{colorAdjustments.brightness !== 0 || colorAdjustments.contrast !== 1 || colorAdjustments.saturation !== 1 || colorAdjustments.hue !== 0 ? <span>Color grade</span> : null}</div>}
     <div className="editor-canvas-toolbar" onPointerDown={(event) => event.stopPropagation()}>
       <div className="editor-canvas-zoom" aria-label="Preview zoom controls">
         <button type="button" onClick={() => adjustZoom(-0.1)} aria-label="Zoom out">−</button>
         <span>{zoomPercent}%</span>
         <button type="button" onClick={() => adjustZoom(0.1)} aria-label="Zoom in">+</button>
       </div>
       {expanded && onCloseExpanded && <button type="button" className="editor-canvas-button" onClick={onCloseExpanded} title="Close large preview">Close editor</button>}
       {!expanded && <button type="button" className="editor-canvas-button" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Open fullscreen"}>{isFullscreen ? "Exit" : "Fullscreen"}</button>}
     </div>
  </div>;
}

type ChromaKeyPreviewProps = {
  src: string;
  className: string;
  style: CSSProperties;
  layer: EditorLayer;
  keyColor: string;
  similarity: number;
  blend: number;
};

function ChromaKeyPreview({ src, className, style, layer, keyColor, similarity, blend }: ChromaKeyPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const normalizedColor = keyColor.replace("#", "");
    const red = Number.parseInt(normalizedColor.slice(0, 2), 16);
    const green = Number.parseInt(normalizedColor.slice(2, 4), 16);
    const blue = Number.parseInt(normalizedColor.slice(4, 6), 16);
    const targetRed = Number.isFinite(red) ? red : 0;
    const targetGreen = Number.isFinite(green) ? green : 255;
    const targetBlue = Number.isFinite(blue) ? blue : 0;
    const threshold = Math.max(0.01, similarity * 0.72);
    const feather = Math.max(0.01, blend);
    let frame = 0;
    let width = 0;
    let height = 0;

    const draw = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        const scale = Math.min(1, 640 / video.videoWidth);
        const nextWidth = Math.max(1, Math.round(video.videoWidth * scale));
        const nextHeight = Math.max(1, Math.round(video.videoHeight * scale));
        if (nextWidth !== width || nextHeight !== height) {
          width = nextWidth;
          height = nextHeight;
          canvas.width = width;
          canvas.height = height;
        }
        context.drawImage(video, 0, 0, width, height);
        const pixels = context.getImageData(0, 0, width, height);
        for (let index = 0; index < pixels.data.length; index += 4) {
          const pixelRed = pixels.data[index];
          const pixelGreen = pixels.data[index + 1];
          const pixelBlue = pixels.data[index + 2];
          const colorDistance = Math.hypot(pixelRed - targetRed, pixelGreen - targetGreen, pixelBlue - targetBlue) / 441.673;
          if (colorDistance <= threshold) {
            pixels.data[index + 3] = 0;
          } else if (colorDistance < threshold + feather) {
            pixels.data[index + 3] = Math.round(((colorDistance - threshold) / feather) * 255);
          }
        }
        context.putImageData(pixels, 0, 0);
      }
      frame = window.requestAnimationFrame(draw);
    };

    video.load();
    void video.play().catch(() => undefined);
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [src, keyColor, similarity, blend]);

  return <div className={`${className} editor-chroma-preview`} data-editor-layer={layer} style={style}>
    <video ref={videoRef} src={src} muted autoPlay loop playsInline aria-hidden="true" />
    <canvas ref={canvasRef} aria-label={`${layer === "main" ? "Main video" : layer === "webcam" ? "Face cam" : "Animation"} with green screen removed`} />
  </div>;
}

type EditorTransformControlsProps = {
  selectedLayer: EditorLayer;
  hasWebcam: boolean;
  hasAnimation: boolean;
  mainTransform: EditorTransform;
  webcamTransform: EditorTransform;
  animationTransform: EditorTransform;
  onSelectLayer: (layer: EditorLayer) => void;
  onMainTransformChange: (transform: EditorTransform) => void;
  onWebcamTransformChange: (transform: EditorTransform) => void;
  onAnimationTransformChange: (transform: EditorTransform) => void;
};

function EditorTransformControls({ selectedLayer, hasWebcam, hasAnimation, mainTransform, webcamTransform, animationTransform, onSelectLayer, onMainTransformChange, onWebcamTransformChange, onAnimationTransformChange }: EditorTransformControlsProps) {
  const transform = selectedLayer === "main" ? mainTransform : selectedLayer === "webcam" ? webcamTransform : animationTransform;
  const update = (scale: number) => {
    const next = { ...transform, scale };
    if (selectedLayer === "main") onMainTransformChange(next);
    else if (selectedLayer === "webcam") onWebcamTransformChange(next);
    else onAnimationTransformChange(next);
  };
  const reset = () => {
    if (selectedLayer === "main") onMainTransformChange({ x: 0, y: 0, scale: 1 });
    else if (selectedLayer === "webcam") onWebcamTransformChange({ x: 0, y: 0, scale: 0.25 });
    else onAnimationTransformChange({ x: 0, y: 0, scale: 0.25 });
  };
  const isMain = selectedLayer === "main";
  const isAnimation = selectedLayer === "animation";
  return <div className="editor-transform-controls">
    <div className="editor-layer-tabs"><button type="button" className={selectedLayer === "main" ? "active" : ""} onClick={() => onSelectLayer("main")}>Main video</button><button type="button" className={selectedLayer === "webcam" ? "active" : ""} onClick={() => onSelectLayer("webcam")} disabled={!hasWebcam}>Face cam</button><button type="button" className={selectedLayer === "animation" ? "active" : ""} onClick={() => onSelectLayer("animation")} disabled={!hasAnimation}>Animation</button></div>
    <div className="editor-control-row"><label>{isMain ? "Video zoom" : isAnimation ? "Animation size" : "Face cam size"} <strong>{Math.round(transform.scale * 100)}%</strong></label><input type="range" min={isMain ? "50" : "10"} max={isMain ? "250" : "80"} value={Math.round(transform.scale * 100)} onChange={(event) => update(Number(event.target.value) / 100)} data-testid={`input-editor-${selectedLayer}-zoom`}/></div>
    <div className="editor-control-actions"><span>Position {Math.round(transform.x)} / {Math.round(transform.y)}</span><button type="button" className="section-link" onClick={reset}>Reset layer</button></div>
    <p className="field-hint">Select a layer, drag it with the cursor, pinch with two fingers, or scroll over the canvas to zoom.</p>
  </div>;
}

function ProfilePage({ workspace, account, firebaseUser, profilePhoto, onProfilePhotoChange, onSaveProfile, onLogout }: {
  workspace: ReturnType<typeof useWorkspace>;
  account: AccountSummary;
  firebaseUser: FirebaseUser | null;
  profilePhoto: string;
  onProfilePhotoChange: (photo: string) => void;
  onSaveProfile?: (profile: { displayName: string; email: string; phone?: string; profileImagePath?: string }) => Promise<void>;
  onLogout: () => Promise<void>;
}) {
  const [name, setName] = useState(account.displayName || "");
  const [email, setEmail] = useState(account.email || firebaseUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoAnimationKey, setPhotoAnimationKey] = useState(0);
  const [profilePanel, setProfilePanel] = useState<"details" | "password" | null>(null);
  const hasPasswordProvider = Boolean(firebaseUser?.providerData.some((provider) => provider.providerId === "password"));
  const displayPhoto = profilePhoto || defaultProfilePhoto(firebaseUser?.uid || workspace.licenseId || "profile");

  useEffect(() => {
    setName(account.displayName || "");
    setEmail(account.email || firebaseUser?.email || "");
  }, [account.displayName, account.email, firebaseUser?.email]);

  const saveDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || (firebaseUser && !email.trim())) return;
    setSaving(true);
    setNotice("");
    try {
      if (firebaseUser) {
        if (email.trim() !== (firebaseUser.email || "")) await updateEmail(firebaseUser, email.trim());
        await updateProfile(firebaseUser, { displayName: name.trim() });
      }
      if (onSaveProfile) {
        await onSaveProfile({ displayName: name.trim(), email: email.trim(), phone: account.phone });
      } else {
        localStorage.setItem(`reverse-bypass-profile:${workspace.licenseId}`, JSON.stringify({ displayName: name.trim(), email: email.trim() }));
      }
      setNotice("Your profile details were saved.");
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not save your profile details.");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordNotice("");
    if (!hasPasswordProvider) {
      setPasswordNotice("This account uses Google sign-in. Use the password reset email if a password login is enabled.");
      return;
    }
    if (newPassword.length < 6 || newPassword !== confirmPassword) {
      setPasswordNotice("Use at least 6 characters and make both password fields match.");
      return;
    }
    setPasswordBusy(true);
    try {
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(firebaseUser?.email || email, currentPassword);
        if (firebaseUser) await reauthenticateWithCredential(firebaseUser, credential);
      }
      if (firebaseUser) await updatePassword(firebaseUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordNotice("Password changed successfully.");
    } catch (reason) {
      setPasswordNotice(reason instanceof Error ? reason.message : "Could not change the password. Please sign in again and retry.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const sendResetEmail = async () => {
    setPasswordBusy(true);
    setPasswordNotice("");
    try {
      if (!firebaseUser) {
        setPasswordNotice("Password reset is available after you connect a Google account.");
        return;
      }
      await sendPasswordResetEmail(firebaseAuth, email);
      setPasswordNotice("Password reset instructions were sent to your email.");
    } catch (reason) {
      setPasswordNotice(reason instanceof Error ? reason.message : "Could not send a password reset email.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const uploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!onSaveProfile) {
      setNotice("Sign in before uploading a profile image.");
      return;
    }
    setPhotoBusy(true);
    setNotice("");
    try {
      const upload = await apiJson<{ uploadURL: string; objectPath: string }>("/api/account/profile-image/upload-url", {
        method: "POST",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      const response = await fetch(upload.uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!response.ok) throw new Error("The image could not be stored.");
      await onSaveProfile({ displayName: name.trim(), email: email.trim(), phone: account.phone, profileImagePath: upload.objectPath });
      const photo = profileImageUrl(upload.objectPath);
      onProfilePhotoChange(photo);
      setPhotoAnimationKey((value) => value + 1);
      if (firebaseUser) {
        const authenticatedFirebaseUser = firebaseUser;
        await updateProfile(authenticatedFirebaseUser, { photoURL: photo });
      }
      setNotice("Profile photo updated.");
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not upload your profile photo.");
    } finally {
      setPhotoBusy(false);
    }
  };

  return <AppShell title="Profile" account={account} profilePhoto={profilePhoto} workspace={workspace}>
    <div className="page profile-page">
      <div className="page-head"><div><p className="eyebrow">Account</p><h1>Profile</h1><p className="subtle">Manage your account details and sign-in security.</p></div></div>
      <section className="card profile-single-card">
        <div className="profile-avatar-wrap"><WaterFillAvatar src={displayPhoto} alt={`${name || "Your"} profile`} animate={photoAnimationKey > 0} animationKey={photoAnimationKey} /><label className={`profile-avatar-edit ${photoBusy ? "is-busy" : ""}`} title="Change profile photo" aria-label="Change profile photo"><Pencil size={13}/><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void uploadPhoto(event)} disabled={photoBusy} /></label></div>
        <div className="profile-identity-copy"><strong>{name || "Your profile"}</strong>{email && <p>{email}</p>}</div>
        <div className="profile-action-list">
          <button type="button" className={`profile-action-button ${profilePanel === "details" ? "active" : ""}`} onClick={() => setProfilePanel(profilePanel === "details" ? null : "details")}><UserRound size={16}/><span>Personal details</span><ArrowRight size={14}/></button>
          <button type="button" className={`profile-action-button ${profilePanel === "password" ? "active" : ""}`} onClick={() => setProfilePanel(profilePanel === "password" ? null : "password")}><KeyRound size={16}/><span>Change password</span><ArrowRight size={14}/></button>
          <button type="button" className="profile-action-button danger-button" onClick={() => void onLogout()} data-testid="button-profile-logout"><ShieldCheck size={16}/><span>Logout</span><ArrowRight size={14}/></button>
        </div>
        {profilePanel === "details" && <div className="profile-action-panel">
          <div className="profile-action-panel-head"><div><h2>Personal details</h2><p className="subtle">These details are used for your workspace account.</p></div><UserRound size={18}/></div>
          <form className="profile-form" onSubmit={saveDetails}>
            <div className="field"><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" data-testid="input-profile-name" /></div>
            <div className="field"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" data-testid="input-profile-email" /></div>
            <button className="button" type="submit" disabled={saving || !name.trim() || Boolean(firebaseUser && !email.trim())}>{saving ? "Saving…" : "Save changes"} <Check size={14}/></button>
            {notice && <p className="profile-message">{notice}</p>}
          </form>
        </div>}
        {profilePanel === "password" && <div className="profile-action-panel">
          <div className="profile-action-panel-head"><div><h2>Change password</h2><p className="subtle">Keep your account secure with a password only you know.</p></div><KeyRound size={18}/></div>
          {hasPasswordProvider ? <form className="profile-form" onSubmit={savePassword}>
            <div className="field"><label htmlFor="current-password">Current password <span className="field-hint">(optional)</span></label><input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /></div>
            <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></div>
            <div className="field"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>
            <button className="button" type="submit" disabled={passwordBusy}>{passwordBusy ? "Updating…" : "Change password"} <KeyRound size={14}/></button>
          </form> : <div className="profile-provider-note"><p>You signed in with Google, so password access is managed by Google.</p><button className="button secondary" onClick={() => void sendResetEmail()} disabled={passwordBusy}>{passwordBusy ? "Sending…" : "Email password reset link"} <Mail size={14}/></button></div>}
          {passwordNotice && <p className="profile-message">{passwordNotice}</p>}
        </div>}
      </section>
    </div>
  </AppShell>;
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

function Routed({workspace, account, plans, onSelectPlan, firebaseUser, profilePhoto, onProfilePhotoChange, onSaveProfile, onSavePhone, onLogout}:{workspace:ReturnType<typeof useWorkspace>; account:AccountSummary|null; plans:AccountPlan[]; onSelectPlan:(planId:string, streamLimit:number, durationMultiplier?:number)=>Promise<AccountSummary>; firebaseUser:FirebaseUser|null; profilePhoto:string; onProfilePhotoChange:(photo:string)=>void; onSaveProfile:(profile:{displayName:string; email:string; phone?:string; profileImagePath?:string})=>Promise<void>; onSavePhone:(phone:string)=>Promise<void>; onLogout:()=>Promise<void>}) {
  let localProfile: { displayName?: string; email?: string } = {};
  try {
    localProfile = JSON.parse(localStorage.getItem(`reverse-bypass-profile:${workspace.licenseId}`) || "{}") as { displayName?: string; email?: string };
  } catch {
    localProfile = {};
  }
  const profileAccount = account || {
    id: `local-${workspace.licenseId || "profile"}`,
    displayName: localProfile.displayName || workspace.user || "Workspace user",
    email: localProfile.email || "",
    role: "user" as const,
    licenseId: workspace.licenseId,
    licenseKey: "",
    trialStartedAt: "",
    trialEndsAt: "",
    activePlanId: "",
    activePlan: null,
    accessEndsAt: "",
    active: true,
    streamLimit: 1,
    createdAt: "",
    history: [],
  };
  return <Switch><Route path="/dashboard"><Dashboard workspace={workspace} account={account}/></Route><Route path="/analytics"><AnalyticsPage workspace={workspace} account={account} onSavePhone={onSavePhone}/></Route><Route path="/aesthetics"><Redirect to="/analytics"/></Route><Route path="/live"><LivePage workspace={workspace} account={account}/></Route><Route path="/live-preview"><LivePreviewPage workspace={workspace}/></Route><Route path="/videos"><VideosPage workspace={workspace}/></Route><Route path="/editor"><VideoEditorPage workspace={workspace}/></Route><Route path="/subscription">{account ? <SubscriptionPage workspace={workspace} account={account} plans={plans} onSelectPlan={onSelectPlan}/> : <Redirect to="/sign-in"/>}</Route><Route path="/profile"><ProfilePage workspace={workspace} account={profileAccount} firebaseUser={firebaseUser} profilePhoto={profilePhoto} onProfilePhotoChange={onProfilePhotoChange} onSaveProfile={account ? onSaveProfile : undefined} onLogout={onLogout}/></Route><Route path="/settings"><Redirect to="/profile"/></Route><Route><NotFound/></Route></Switch>;
}

function App() {
  const { user, loading: firebaseLoading, busy: firebaseBusy, error: firebaseError, signInWithGoogle, signOut } = useFirebaseAuth();
  const isSignedIn = Boolean(user);
  const license = useLicense();
  const accountSession = useAccountSession(isSignedIn, user?.uid, !firebaseLoading);
  const hasAccountSession = Boolean(accountSession.account);
  const [profilePhoto, setProfilePhoto] = useState("");
  const profileOwnerId = user?.uid || license.license?.licenseId || "";
  useEffect(() => {
    if (!profileOwnerId) {
      setProfilePhoto("");
      return;
    }
    setProfilePhoto(profileImageUrl(accountSession.account?.profileImagePath) || user?.photoURL || localStorage.getItem(profilePhotoKey(profileOwnerId)) || defaultProfilePhoto(profileOwnerId));
  }, [profileOwnerId, user?.photoURL, accountSession.account?.profileImagePath]);
  const handleProfilePhotoChange = (photo: string) => {
    if (!profileOwnerId) return;
    setProfilePhoto(photo);
  };
  const [mobileGiftKey, setMobileGiftKey] = useState("");
  const [profileGateId, setProfileGateId] = useState<string | null>(null);
  const accountLicense = accountSession.account ? {
    licenseId: accountSession.account.licenseId,
    key: accountSession.account.licenseKey,
    name: accountSession.account.displayName || user?.email || "Workspace",
    expiresAt: accountSession.account.accessEndsAt,
    active: accountSession.account.active,
  } satisfies LicenseSession : null;
  const activeLicense = hasAccountSession ? accountLicense : license.license;
  const [location, setLocation] = useLocation();
  const browserPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const isOwnerRoute = ["/owner", "/owner.html"].includes(location) || ["/owner", "/owner.html"].includes(browserPath);
  const workspace = useWorkspace(activeLicense, () => {
    license.clear();
    accountSession.clear();
    void apiJson("/api/mobile-auth/logout", { method: "POST" }).catch(() => undefined);
    void signOut();
  });
  useEffect(() => {
    if (accountSession.account?.profileCompleted === false && !profileGateId) {
      setProfileGateId(accountSession.account.id);
    }
  }, [accountSession.account, profileGateId]);
  useEffect(() => {
    if (firebaseLoading || (isSignedIn && accountSession.loading)) return;
    if (!mobileGiftKey && accountSession.account && (location === "/" || location === "/access" || location.startsWith("/sign-in") || location.startsWith("/sign-up"))) {
      setLocation(accountSession.account.role === "owner" ? "/owner" : "/dashboard");
      return;
    }
    if (!isSignedIn && isLicenseActive(license.license) && (location === "/" || location === "/access")) {
      setLocation("/dashboard");
    }
  }, [accountSession.account, accountSession.loading, firebaseLoading, hasAccountSession, isSignedIn, license.license, location, mobileGiftKey, setLocation]);
  if (firebaseLoading) return <div className="workspace-loading"><Radio size={20}/><span>Connecting secure sign-in…</span></div>;
  if (isOwnerRoute) return <OwnerConsolePage/>;
  if (location.startsWith("/sign-in") || location.startsWith("/sign-up")) {
    return <LicenseGate
      license={activeLicense}
      busy={license.busy || firebaseBusy}
      error={license.error || firebaseError}
      signedIn={Boolean(isSignedIn || hasAccountSession)}
      onActivate={license.activate}
      onRenew={license.renew}
      onGoogleLogin={signInWithGoogle}
      onMobileAccountLogin={accountSession.reload}
      onGiftReady={setMobileGiftKey}
      onOpenRoom={() => { setMobileGiftKey(""); setLocation("/dashboard"); }}
    />;
  }
  if (location === "/pricing") return isSignedIn || hasAccountSession ? <Redirect to="/dashboard" /> : <Redirect to="/sign-in" />;
  if (location === "/gateway") return <GatewayPage />;
  if (isSignedIn && accountSession.loading) return <div className="workspace-loading"><Radio size={20}/><span>Preparing your account…</span></div>;
  if (isSignedIn && accountSession.error && !accountSession.account) return <div className="workspace-loading"><span>{accountSession.error}</span></div>;
  if (location === "/" && !isLicenseActive(activeLicense)) return <LandingPage />;
  const openMobileRoom = () => { setMobileGiftKey(""); setLocation("/dashboard"); };
  if (location === "/access") return <LicenseGate license={activeLicense} busy={license.busy} error={license.error || firebaseError} signedIn={Boolean(isSignedIn || hasAccountSession)} onActivate={license.activate} onRenew={license.renew} onGoogleLogin={() => setLocation("/sign-in")} onMobileAccountLogin={accountSession.reload} onGiftReady={setMobileGiftKey} onOpenRoom={openMobileRoom}/>;
  if (!hasAccountSession && (!activeLicense || !isLicenseActive(activeLicense))) return <LicenseGate license={activeLicense} busy={license.busy} error={license.error || firebaseError} signedIn={Boolean(isSignedIn || hasAccountSession)} onActivate={license.activate} onRenew={license.renew} onGoogleLogin={() => setLocation("/sign-in")} onMobileAccountLogin={accountSession.reload} onGiftReady={setMobileGiftKey} onOpenRoom={openMobileRoom}/>;
  if (!workspace.ready && !(accountSession.account && !accountSession.account.active && location === "/subscription")) return <div className="workspace-loading"><Radio size={20}/><span>Loading your private workspace…</span></div>;
  const handleLogout = async () => {
    if (user) {
      await signOut();
      return;
    }
    workspace.logout();
  };
  return <><Routed workspace={workspace} account={accountSession.account} plans={accountSession.plans} onSelectPlan={accountSession.selectPlan} firebaseUser={user} profilePhoto={profilePhoto} onProfilePhotoChange={handleProfilePhotoChange} onSaveProfile={accountSession.saveProfile} onSavePhone={accountSession.savePhone} onLogout={handleLogout}/>{accountSession.account && profileGateId === accountSession.account.id && <AccountCompletionDialog account={accountSession.account} onSave={accountSession.saveProfile} onClose={() => setProfileGateId(null)} />}</>;
}

export default function RootApp() {
  return <TooltipProvider><WouterRouter base={basePath}><QueryClientProvider client={queryClient}><App/></QueryClientProvider></WouterRouter><Toaster/></TooltipProvider>;
}