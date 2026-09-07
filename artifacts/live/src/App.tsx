import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode, type SyntheticEvent } from "react";
import { Link, Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import {
  Activity as ActivityIcon, ArrowRight, BookOpen, Check, CircleHelp, Clipboard,
  Download, FileVideo, FolderOpen, Gauge, LayoutDashboard,
  Link2, Menu, MonitorPlay, Pencil, Play, Plus, Radio, Scissors, Search, Settings,
  ShieldCheck, Square, Trash2, Upload, Video, X,
} from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { deleteMediaFile, downloadDirectVideo, downloadYoutubeVideo, extractYoutubeChannelLinks, getStreamStatus, startStream, stopStream, trimMediaFile, updateStream } from "@workspace/api-client-react";
import logoImage from "@assets/image_1788788255512.png";

type LiveStatus = "live" | "scheduled" | "stopped";
type VideoStatus = "published" | "draft" | "archived";
type DownloadQuality = "best" | "2160p" | "1440p" | "1080p" | "720p" | "480p";
type AspectRatio = "shorts" | "full" | "square";
type StreamQuality = "4k" | "1080p";
type FacePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
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
type VideoGroup = { id: string; name: string; description: string; videoIds: string[]; createdAt: string };
type Activity = { id: string; type: string; message: string; time: string };
type DataState = { channels: LiveChannel[]; videos: VideoItem[]; groups: VideoGroup[]; activities: Activity[] };
type LicenseSession = { licenseId: string; key: string; name: string; expiresAt: string; active: boolean; clientId?: string };
type MediaFileRecord = {
  fileId: string; filename: string; sourcePath: string; playbackUrl: string; title: string; duration: string;
  licenseId: string; licenseName: string; folderName: string; quality: string; createdAt: string; sizeBytes: number;
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
  if (!response.ok) throw new Error(payload.error || "The request could not be completed.");
  return payload;
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
  videos: [
    {
      id: "vid-gtv5-face",
      title: "WhatsApp Video 2026-09-04 at 11.30.43 PM",
      duration: "00:00",
      status: "published",
      groupId: "gtv5face",
      sourceUrl: gtv5FaceVideoUrl,
      serverSource: "__asset:gtv5face",
      thumbnailColor: "#9a6591",
      views: 0,
      createdAt: now(),
    },
  ],
  groups: [
    { id: "gta", name: "GTA", description: "Add videos here to build the GTA playlist.", videoIds: [], createdAt: now() },
    { id: "gtv5face", name: "GTV 5 face", description: "Face recording overlay video.", videoIds: ["vid-gtv5-face"], createdAt: now() },
  ],
  activities: [
    { id: "a-gtv5-face", type: "video", message: "GTV 5 face video is ready", time: "Just now" },
  ],
};

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
  if (!value || typeof value !== "object") return seed;
  const candidate = value as Partial<DataState>;
  const groups: VideoGroup[] = (Array.isArray(candidate.groups) ? candidate.groups : [])
    .filter((group): group is VideoGroup => Boolean(group && typeof group === "object"))
    .map((group, index) => ({
      id: typeof group.id === "string" && group.id ? group.id : `group-${index + 1}`,
      name: typeof group.name === "string" && group.name.trim() ? group.name : "Untitled folder",
      description: typeof group.description === "string" ? group.description : "",
      videoIds: Array.isArray(group.videoIds) ? group.videoIds.filter((id): id is string => typeof id === "string") : [],
      createdAt: typeof group.createdAt === "string" ? group.createdAt : now(),
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
  const repairedGroups = rebuildGroupMembership(groups, videos);
  return ensureBundledFaceVideo(removeBundledGtaVideo({
    channels: Array.isArray(candidate.channels) ? candidate.channels : [],
    videos,
    groups: repairedGroups,
    activities,
  }));
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
      const base = normalizeWorkspace(workspaceResult.data);
      const availableMediaIds = new Set(mediaResult.files.map((file) => file.fileId));
      const existingVideos = base.videos.filter((video) => {
        const mediaFileId = getMediaFileId(video);
        return !mediaFileId || availableMediaIds.has(mediaFileId);
      });
      const workspaceBase = existingVideos.length === base.videos.length
        ? base
        : normalizeWorkspace({ ...base, videos: existingVideos });
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
        let group = folderName ? groups.find((item) => item.name.trim().toLowerCase() === folderName.toLowerCase()) : undefined;
        if (folderName && !group) {
          group = { id: `media-${uid("group")}`, name: folderName, description: "Recovered from server media.", videoIds: [], createdAt: file.createdAt };
          groups = [...groups, group];
        }
        const video: VideoItem = {
          id: `media-${file.fileId}`,
          title: file.title || file.filename,
          duration: file.duration || "00:00",
          status: "published",
          groupId: group?.id || "",
          sourceUrl: file.playbackUrl,
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
  const logout = () => { clearLicense(); };
  return { clientId: license?.clientId || "", licenseId: license?.licenseId || "", data, user, toast, ready, update, logout, setToast };
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

function AppShell({ children, title, workspace }: { children:ReactNode; title:string; workspace:ReturnType<typeof useWorkspace> }) {
  const [path] = useLocation();
  const [menu, setMenu] = useState(false);
  return <div className="shell"><Sidebar path={path} open={menu} onClose={()=>setMenu(false)} user={workspace.user} onLogout={workspace.logout} data={workspace.data}/><main className="main"><Header title={title} onMenu={()=>setMenu(true)}/>{children}</main>{workspace.toast && <div className="toast" data-testid="status-toast"><Check size={14} style={{verticalAlign:"-2px", marginRight:7}}/>{workspace.toast}</div>}</div>;
}

function LicenseGate({ license, busy, error, onActivate, onRenew }: { license:LicenseSession|null; busy:boolean; error:string; onActivate:(key:string)=>Promise<void>; onRenew:()=>Promise<void> }) {
  const [key, setKey] = useState(license?.key || "");
  useEffect(() => { setKey(license?.key || ""); }, [license?.key]);
  const expired = Boolean(license && !isLicenseActive(license));
  const submit = (event:FormEvent) => {
    event.preventDefault();
    if (key.trim()) void onActivate(key).catch(() => undefined);
  };
  return <div className="login-page license-page">
    <section className="login-visual">
      <div className="login-logo"><div className="brand-mark"><img src={logoImage} alt="Reverse Bypass logo" /></div><div><div className="brand-name">Reverse Bypass</div><div className="brand-note">reverse access console</div></div></div>
      <div className="login-copy"><div className="signal-line"><span/>REVERSE BYPASS · READY</div><h1>Bring your<br/><em>room on air.</em></h1><p>Enter your license key to open your private Reverse Bypass workspace. Your channels, videos, and settings stay separate from every other license.</p></div>
      <div className="signal-line"><span/>ONE LICENSE · ONE PRIVATE WORKSPACE</div>
    </section>
    <section className="login-panel"><div className="login-card">
      <p className="eyebrow">{expired ? "License expired" : "Enter your license"}</p>
      <h2>{expired ? "Renew your key." : "Unlock the room."}</h2>
      <p className="subtle">{expired ? "Your workspace is waiting. Renew this same key for 30 more days, or enter a different active key." : "Use the license key provided by the owner to continue."}</p>
      {error && <div className="error-note" data-testid="status-license-error">{error}</div>}
      <form className="login-form" onSubmit={submit}>
        <div className="field"><label htmlFor="license-key">License key</label><input id="license-key" value={key} onChange={e=>setKey(e.target.value)} placeholder="SD-XXXXXXXXXXXX" autoComplete="off" data-testid="input-license-key"/></div>
        <button className="button login-submit" type="submit" disabled={busy || !key.trim()} data-testid="button-activate-license">{busy ? "Checking…" : "Open workspace"} <ArrowRight size={16}/></button>
      </form>
      {expired && <button className="button secondary license-renew" onClick={()=>void onRenew()} disabled={busy} data-testid="button-renew-license">{busy ? "Renewing…" : "Renew your key · 30 days"} <Check size={14}/></button>}
      {license && <div className="license-status"><strong>{license.name}</strong><span>Key: <span className="mono">{license.key}</span></span><span>Expired {new Date(license.expiresAt).toLocaleDateString()}</span></div>}
    </div></section>
  </div>;
}

function OwnerPage() {
  const [password, setPassword] = useState("");
  const [authorizedPassword, setAuthorizedPassword] = useState("");
  const [licenses, setLicenses] = useState<LicenseSession[]>([]);
  const [name, setName] = useState("");
  const [days, setDays] = useState("30");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = async (ownerPassword: string) => {
    const result = await apiJson<{ licenses: LicenseSession[] }>("/api/licenses", { headers: { "X-Owner-Password": ownerPassword } });
    setLicenses(result.licenses);
  };
  const signIn = async (event:FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try { await load(password); setAuthorizedPassword(password); } catch (reason) { setError(reason instanceof Error ? reason.message : "Owner access was denied."); } finally { setBusy(false); }
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
  return <div className="owner-page"><header className="owner-topbar"><Brand/><a href="/" className="button secondary">Open license gate <ArrowRight size={14}/></a></header><main className="owner-content"><div className="page-head"><div><p className="eyebrow">Owner console</p><h1>License keys</h1><p className="subtle">Create access keys and keep each customer workspace separate.</p></div><div className="status live"><span className="status-dot"/>Firebase connected</div></div>{error&&<div className="error-note">{error}</div>}<section className="card section-card owner-create"><div className="section-head"><div><h2 className="section-title">Create license</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>The generated key can be used by more than one browser; each browser gets its own workspace.</p></div><Plus size={17} color="#6c8b83"/></div><form className="owner-create-form" onSubmit={create}><div className="field"><label>Customer / workspace name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Studio A" data-testid="input-license-name"/></div><div className="field"><label>Valid for days</label><input type="number" min="1" max="3650" value={days} onChange={e=>setDays(e.target.value)} data-testid="input-license-days"/></div><button className="button" type="submit" disabled={busy||!name.trim()} data-testid="button-create-license"><Plus size={15}/> Create license</button></form></section><section className="card section-card owner-list"><div className="section-head"><div><h2 className="section-title">{licenses.length} license{licenses.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Existing access keys and renewal controls.</p></div><Clipboard size={17} color="#6c8b83"/></div>{licenses.length===0?<EmptyState icon={<ShieldCheck size={21}/>} title="No licenses yet" copy="Create the first key above to give a workspace access."/>:<div className="license-list">{licenses.map(license=>{const active=isLicenseActive(license);return <div className="license-row" key={license.licenseId}><div className="license-row-main"><div className="license-key-badge"><ShieldCheck size={15}/></div><div><strong>{license.name}</strong><span className="mono">{license.key}</span></div></div><div className={`status ${active?"live":"stopped"}`}><span className="status-dot"/>{active?"Active":"Expired"} · {new Date(license.expiresAt).toLocaleDateString()}</div><div className="actions"><button className="button secondary small" onClick={()=>void renew(license.licenseId)} disabled={busy}>Renew 30 days</button><button className="icon-button" onClick={()=>void remove(license)} disabled={busy} title="Delete license" data-testid={`button-delete-license-${license.licenseId}`}><Trash2 size={13}/></button></div></div>})}</div>}</section></main></div>;
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
         <span className="field-hint">Tick the first video, then the second, third, and so on. The live stream follows this queue exactly and repeats from video 1 after the last one.</span>
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
  return <AppShell title="Live channels" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Broadcast operations</p><h1>Live channels</h1><p className="subtle">Prepare your destinations, then take the room live with confidence.</p></div><button className="button" onClick={()=>{setEditing(undefined);setShowForm(true)}} data-testid="button-add-channel"><Plus size={16}/> Add channel</button></div>
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
         const folderName=groups.find(group=>group.id===form.groupId)?.name||"";
         const response=await fetch("/api/media/upload",{method:"POST",headers:{"Content-Type":file.type||"application/octet-stream","X-File-Name":file.name,"X-License-Id":licenseId,"X-License-Name":licenseName,"X-Folder-Name":folderName},body:file});
        const payload=await response.json() as {sourcePath?:string;playbackUrl?:string;error?:string};
        if(!response.ok || !payload.sourcePath || !payload.playbackUrl) throw new Error(payload.error||"Video upload failed.");
        serverSource=payload.sourcePath; sourceUrl=payload.playbackUrl;
      }catch(error){setUploadError(error instanceof Error?error.message:"Video upload failed.");setUploading(false);return;}
      setUploading(false);
    }
    onSave({id:video?.id||uid("vid"),title:form.title.trim(),duration:form.duration||"00:00",status:form.status as VideoStatus,groupId:form.groupId,sourceUrl,serverSource,thumbnailColor:form.thumbnailColor,views:video?.views||0,createdAt:video?.createdAt||now()});
  };
  return <Modal title={video?"Edit video":"Add video"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-video">Cancel</button><button className="button" type="submit" form="video-form" disabled={uploading} data-testid="button-save-video">{uploading ? "Uploading…" : video ? "Save changes" : "Add video"} {!uploading&&<Check size={14}/>}</button></>}><form id="video-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>{video?"Replace video file (optional)":"Choose video file"}</label><input autoFocus required={!form.sourceUrl} type="file" accept="video/*" onChange={e=>{const next=e.target.files?.[0];if(!next)return;setFile(next);setFileName(next.name);setForm(f=>({...f,title:f.title||next.name.replace(/\.[^.]+$/,""),sourceUrl:URL.createObjectURL(next)}))}} data-testid="input-video-file"/>{fileName&&<span className="file-picked"><Check size={13}/> {fileName} · server-ready upload</span>}{uploadError&&<div className="error-note">{uploadError}</div>}</div><div className="field full"><label>Video title</label><input required value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Title for this video" data-testid="input-video-title"/></div><div className="field"><label>Video category</label><select required value={form.groupId} onChange={e=>set("groupId",e.target.value)} data-testid="select-video-group"><option value="">Select a category</option>{groups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></div><div className="field"><label>Duration</label><input value={form.duration} onChange={e=>set("duration",e.target.value)} placeholder="24:18" data-testid="input-video-duration"/></div></div><div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Videos in a category play in their saved order and loop back to the first video after the last one.</div></form></Modal>;
}

function TrimModal({video,onCreate,onClose}:{video:VideoItem;onCreate:(clip:VideoItem)=>void;onClose:()=>void}) {
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
      const result=await trimMediaFile(fileId,{startSeconds,endSeconds});
      onCreate({id:uid("vid"),title:title.trim()||`${video.title} · clip`,duration:result.duration,status:"published",groupId:video.groupId,sourceUrl:result.playbackUrl,serverSource:result.sourcePath,thumbnailColor:video.thumbnailColor,views:0,createdAt:now()});
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
     <div className="form-note"><Scissors size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Use HH:MM:SS or MM:SS; milliseconds are optional. The original video stays unchanged. {duration>0&&<span>Source length: {formatTimecode(duration)}.</span>}</div>
    {error&&<div className="error-note">{error}</div>}
  </form></Modal>;
}

function YoutubeDownloadModal({groups,defaultGroupId="",licenseId="",licenseName="",onSaveMany,onClose}:{groups:VideoGroup[];defaultGroupId?:string;licenseId?:string;licenseName?:string;onSaveMany:(videos:VideoItem[])=>void;onClose:()=>void}) {
  const [urls,setUrls]=useState(""); const [groupId,setGroupId]=useState(defaultGroupId); const [quality,setQuality]=useState<DownloadQuality>("best"); const [availableQualities,setAvailableQualities]=useState<string[]>(["best","2160p","1440p","1080p","720p","480p"]); const [checkingQuality,setCheckingQuality]=useState(false);
  const [channelUrl,setChannelUrl]=useState(""); const [linkLimit,setLinkLimit]=useState<"all"|"5"|"10">("all"); const [extracting,setExtracting]=useState(false); const [downloading,setDownloading]=useState(false); const [directDownloading,setDirectDownloading]=useState(false); const [directUrl,setDirectUrl]=useState(""); const [progress,setProgress]=useState(0); const [error,setError]=useState(""); const [extractedCount,setExtractedCount]=useState(0);
  const entries=urls.split(/\r?\n|,/).map(value=>value.trim()).filter(Boolean);
  const folderName=groups.find(group=>group.id===groupId)?.name||"";
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
  const submit=async(e:FormEvent)=>{
    e.preventDefault();
     if(!entries.length||!groupId||downloading||directDownloading||extracting||checkingQuality)return;
    setDownloading(true);setError("");setProgress(0);
    const videos:VideoItem[]=[]; const failures:string[]=[];
    for(let index=0;index<entries.length;index+=1){
      const url=entries[index];
      try{
         const result=await downloadYoutubeVideo({url,quality,licenseId,licenseName,folderName});
         videos.push({id:uid("vid"),title:result.title,duration:result.duration,status:"published",groupId,sourceUrl:result.playbackUrl,serverSource:result.sourcePath,thumbnailColor:colors[index%colors.length],views:0,createdAt:now(),licenseId,licenseName,folderName,quality:result.quality});
      }catch(reason){failures.push(`${index+1}. ${reason instanceof Error?reason.message:"Download failed."}`);}
      setProgress(index+1);
    }
    if(videos.length)onSaveMany(videos);
    setDownloading(false);
    setError(failures.length?`${videos.length} downloaded, ${failures.length} failed.\n${failures.join("\n")}`:`${videos.length} video${videos.length===1?"":"s"} downloaded and added in order.`);
  };
  const downloadDirect=async()=>{
    if(!directUrl.trim()||!groupId||downloading||directDownloading)return;
    setDirectDownloading(true);setError("");
    try{
      const result=await downloadDirectVideo({url:directUrl.trim(),licenseId,licenseName,folderName});
      onSaveMany([{id:uid("vid"),title:result.title,duration:result.duration,status:"published",groupId,sourceUrl:result.playbackUrl,serverSource:result.sourcePath,thumbnailColor:colors[0],views:0,createdAt:now(),licenseId,licenseName,folderName,quality:result.quality}]);
      setDirectUrl("");
      setError("Direct video downloaded and added to the selected folder.");
    }catch(reason){setError(reason instanceof Error?reason.message:"Direct video download failed.");}
    finally{setDirectDownloading(false);}
  };
   return <Modal title="YouTube bulk downloader" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={downloading||directDownloading||extracting||checkingQuality} data-testid="button-cancel-youtube-download">Close</button><button className="button" type="submit" form="youtube-download-form" disabled={downloading||directDownloading||extracting||checkingQuality||!entries.length} data-testid="button-start-youtube-download">{downloading?`Downloading ${progress}/${entries.length}…`:"Download all videos"} {!downloading&&<Download size={14}/>}</button></>}><form id="youtube-download-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>Auto-fill from YouTube channel</label><div className="input-action-row"><input value={channelUrl} onChange={e=>setChannelUrl(e.target.value)} placeholder="https://www.youtube.com/@channel" data-testid="input-youtube-channel-url"/><button type="button" className="button secondary small" onClick={extractChannel} disabled={extracting||downloading||directDownloading||!channelUrl.trim()} data-testid="button-extract-channel-links">{extracting?"Extracting…":"Extract links"} {!extracting&&<Link2 size={13}/>}</button></div><span className="field-hint">Enter a public channel URL, choose how many links to add, then extract them.</span></div><div className="field"><label>Links to add</label><select value={linkLimit} onChange={e=>setLinkLimit(e.target.value as "all"|"5"|"10")} disabled={extracting||downloading||directDownloading} data-testid="select-youtube-link-limit"><option value="all">All links</option><option value="5">First 5 links</option><option value="10">First 10 links</option></select></div><div className="field"><label>Save in category / folder</label><select required value={groupId} onChange={e=>setGroupId(e.target.value)} disabled={downloading||directDownloading} data-testid="select-youtube-group"><option value="">Select a category</option>{groups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></div><div className="field"><label>Download quality</label><select value={quality} onChange={e=>setQuality(e.target.value as DownloadQuality)} disabled={checkingQuality||downloading||directDownloading} data-testid="select-youtube-quality">{availableQualities.map(item=><option value={item} key={item}>{item==="best"?"Best available":item}</option>)}</select><span className="field-hint">Choose quality for every queued video.</span></div><div className="field"><label>Check this link's qualities</label><button type="button" className="button secondary small" onClick={checkQuality} disabled={checkingQuality||downloading||directDownloading||!entries.length} data-testid="button-check-youtube-quality">{checkingQuality?"Checking…":"Show available quality"} <Gauge size={13}/></button></div><div className="field full"><label>Video links queue</label><textarea autoFocus required value={urls} onChange={e=>setUrls(e.target.value)} placeholder={"Paste one URL per line\nhttps://www.youtube.com/watch?v=…\nhttps://youtu.be/…"} rows={6} data-testid="input-youtube-urls"/><span className="field-hint">{extractedCount ? `${extractedCount} new link${extractedCount===1?"":"s"} added to the queue.` : entries.length ? `${entries.length} URL${entries.length===1?"":"s"} queued · downloads run one by one in this order.` : "Paste multiple links manually, or auto-fill them from a channel above."}</span></div><div className="field full"><label>Direct video URL</label><div className="input-action-row"><input value={directUrl} onChange={e=>setDirectUrl(e.target.value)} placeholder="https://files.ytcontent.com/…"/><button type="button" className="button secondary small" onClick={()=>void downloadDirect()} disabled={directDownloading||downloading||!directUrl.trim()||!groupId} data-testid="button-download-direct-video">{directDownloading?"Downloading…":"Download direct URL"} <Download size={13}/></button></div><span className="field-hint">Paste a direct video file link such as files.ytcontent.com. It will be saved in the selected category.</span></div></div>{error&&<div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><Download size={14} style={{verticalAlign:"-3px",marginRight:6}}/>YouTube links use the selected quality. Direct file links are downloaded as-is, saved with the license and folder, and become available to live playlists.</div></form></Modal>;
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
         const folderName=groups.find(group=>group.id===groupId)?.name||"";
         const response=await fetch("/api/media/upload",{method:"POST",headers:{"Content-Type":file.type||"application/octet-stream","X-File-Name":file.name,"X-License-Id":licenseId,"X-License-Name":licenseName,"X-Folder-Name":folderName},body:file});
        const payload=await response.json() as {sourcePath?:string;playbackUrl?:string;error?:string};
        if(!response.ok||!payload.sourcePath||!payload.playbackUrl)throw new Error(payload.error||"Upload failed.");
         videos.push({id:uid("vid"),title:file.name.replace(/\.[^.]+$/,""),duration:"00:00",status:"published",groupId,sourceUrl:payload.playbackUrl,serverSource:payload.sourcePath,thumbnailColor:colors[index%colors.length],views:0,createdAt:now(),licenseId,licenseName,folderName:groups.find(group=>group.id===groupId)?.name||"",quality:"uploaded"});
      }catch(reason){failures.push(`${index+1}. ${file.name}: ${reason instanceof Error?reason.message:"Upload failed."}`);}
      setProgress(index+1);
    }
    if(videos.length)onSaveMany(videos);
    setUploading(false);
    setError(failures.length?`${videos.length} uploaded, ${failures.length} failed.\n${failures.join("\n")}`:`${videos.length} video${videos.length===1?"":"s"} uploaded and added in folder order.`);
  };
  return <Modal title="Add a video folder" onClose={onClose} footer={<><button className="button ghost" onClick={onClose} disabled={uploading} data-testid="button-cancel-folder-upload">Close</button><button className="button" type="submit" form="folder-upload-form" disabled={uploading||!files.length} data-testid="button-start-folder-upload">{uploading?`Uploading ${progress}/${files.length}…`:"Upload folder"} {!uploading&&<Upload size={14}/>}</button></>}><form id="folder-upload-form" onSubmit={submit}><div className="form-grid"><div className="field full"><label>Choose a folder</label><input ref={inputRef} autoFocus type="file" multiple accept="video/*" onChange={e=>chooseFiles(e.target.files)} data-testid="input-video-folder"/><span className="field-hint">{files.length?`${files.length} video${files.length===1?"":"s"} selected · browser folder order will be used.`:"Select a folder with videos 1, 2, 3…10."}</span></div><div className="field full"><label>Save in category / folder</label><select required value={groupId} onChange={e=>setGroupId(e.target.value)} data-testid="select-folder-group"><option value="">Select a category</option>{groups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></div></div>{error&&<div className="error-note" style={{whiteSpace:"pre-line"}}>{error}</div>}<div className="form-note"><Upload size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Videos are uploaded one by one and appended to the category playlist. When you start live, the playlist runs 1 → 2 → 3 and loops back to 1 automatically.</div></form></Modal>;
}

function GroupModal({group,onSave,onClose}:{group?:VideoGroup;onSave:(g:VideoGroup)=>void;onClose:()=>void}) {
  const [name,setName]=useState(group?.name||"");const [description,setDescription]=useState(group?.description||"");
  return <Modal title={group?"Edit group":"New group"} onClose={onClose} footer={<><button className="button ghost" onClick={onClose} data-testid="button-cancel-group">Cancel</button><button className="button" onClick={()=>name.trim()&&onSave({id:group?.id||uid("grp"),name:name.trim(),description,videoIds:group?.videoIds||[],createdAt:group?.createdAt||now()})} data-testid="button-save-group">Save group <Check size={14}/></button></>}><div className="form-grid"><div className="field full"><label>Group name</label><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="GD5" data-testid="input-group-name"/></div><div className="field full"><label>Description</label><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="What belongs in this collection?" data-testid="input-group-description"/></div></div></Modal>;
}

function VideosPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const {data,update}=workspace;
  const [search,setSearch]=useState(""); const [status,setStatus]=useState("all"); const [group,setGroup]=useState("all");
  const [tab,setTab]=useState<"library"|"groups">("groups"); const [videoModal,setVideoModal]=useState(false); const [youtubeModal,setYoutubeModal]=useState(false); const [folderModal,setFolderModal]=useState(false);
  const [videoGroupId,setVideoGroupId]=useState(""); const [groupModal,setGroupModal]=useState(false);
  const [editingGroup,setEditingGroup]=useState<VideoGroup|undefined>(); const [editingVideo,setEditingVideo]=useState<VideoItem|undefined>(); const [trimVideo,setTrimVideo]=useState<VideoItem|undefined>(); const [deleting,setDeleting]=useState<{kind:"video"|"group";id:string;name:string}|undefined>();
  const filtered=useMemo(()=>data.videos.filter(v=>(!search||v.title.toLowerCase().includes(search.toLowerCase()))&&(status==="all"||v.status===status)&&(group==="all"||v.groupId===group)),[data.videos,search,status,group]);
  const openAddVideo=(groupId="")=>{setVideoGroupId(groupId);setVideoModal(true);};
  const openGroup=(groupId:string)=>{setGroup(groupId);setTab("library");};
   const saveVideos=(items:VideoItem[])=>{if(!items.length)return;const byId=new Map(data.videos.map(video=>[video.id,video]));for(const item of items)byId.set(item.id,item);const videos=Array.from(byId.values());const groups=rebuildGroupMembership(data.groups,videos);update({videos,groups},{message:items.length===1?`${items[0].title} was added to the library`:`${items.length} videos were added in playlist order`,type:"video"});};
  const saveVideo=(v:VideoItem)=>{saveVideos([v]);setVideoModal(false);setVideoGroupId("");setEditingVideo(undefined);};
  const openEditVideo=(video:VideoItem)=>{setEditingVideo(video);setVideoGroupId(video.groupId);setVideoModal(true);};
  const saveGroup=(g:VideoGroup)=>{const exists=data.groups.some(x=>x.id===g.id);update({groups:exists?data.groups.map(x=>x.id===g.id?g:x):[...data.groups,g]},{message:exists?`${g.name} was updated`:`${g.name} was created`,type:"group"});setGroupModal(false);setEditingGroup(undefined);};
  const remove=async()=>{if(!deleting)return;if(deleting.kind==="video"){const video=data.videos.find(item=>item.id===deleting.id);const fileId=getMediaFileId(video);if(fileId){try{await deleteMediaFile(fileId);}catch(reason){workspace.setToast(reason instanceof Error?reason.message:"The stored video file could not be deleted.");return;}}update({videos:data.videos.filter(v=>v.id!==deleting.id),groups:data.groups.map(g=>({...g,videoIds:g.videoIds.filter(id=>id!==deleting.id)}))},{message:`${deleting.name} and its stored file were deleted`,type:"video"});}else update({groups:data.groups.filter(g=>g.id!==deleting.id),videos:data.videos.map(v=>v.groupId===deleting.id?{...v,groupId:""}:v)},{message:`${deleting.name} was deleted`,type:"group"});setDeleting(undefined);};
   const library=<div className="card section-card"><div className="section-head"><div><h2 className="section-title">{filtered.length} video{filtered.length===1?"":"s"}</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>{search||status!=="all"||group!=="all"?"Filtered library":"Your server media index · files recovered from live-media appear here automatically"}</p></div></div>{filtered.length===0?<EmptyState icon={<Search size={21}/>} title="No videos found" copy="Try a different search, or add a new piece to your library." action="Add video" onClick={()=>openAddVideo(group!=="all"?group:"")}/>:<div className="table-wrap"><table className="data-table"><thead><tr><th>Video</th><th>Status</th><th>Category</th><th>Quality</th><th>Source</th><th/></tr></thead><tbody>{filtered.map(v=><tr key={v.id} data-testid={`row-video-${v.id}`}><td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="thumb" style={{background:v.thumbnailColor,width:52,height:34}}><Video size={14}/><span style={{fontSize:9,marginLeft:-3}}>{v.duration}</span></div><div><div className="table-title">{v.title}</div><div className="table-sub">Added {new Date(v.createdAt).toLocaleDateString()}{v.licenseName?` · ${v.licenseName}`:""}</div></div></div></td><td><span className={`status ${v.status==="published"?"live":v.status==="draft"?"scheduled":"stopped"}`}><span className="status-dot"/>{v.status}</span></td><td><span className="table-sub">{data.groups.find(g=>g.id===v.groupId)?.name||v.folderName||"Unassigned"}</span></td><td><span className="table-sub">{v.quality&&v.quality!=="best"?v.quality:v.quality==="best"?"Best":"—"}</span></td><td>{v.sourceUrl?<a href={v.sourceUrl} target="_blank" rel="noreferrer" className="section-link" data-testid={`link-source-${v.id}`}><Link2 size={12} style={{verticalAlign:"-2px"}}/> {v.serverSource?"Server-ready":"Preview only"}</a>:<span className="table-sub">Not attached</span>}</td><td><div className="actions">{v.serverSource&&<button className="icon-button" style={{width:30,height:30}} onClick={()=>setTrimVideo(v)} title="Trim clip" data-testid={`button-trim-video-${v.id}`}><Scissors size={13}/></button>}<button className="icon-button" style={{width:30,height:30}} onClick={()=>openEditVideo(v)} title="Edit video" data-testid={`button-edit-video-${v.id}`}><Pencil size={13}/></button><button className="icon-button" style={{width:30,height:30}} onClick={()=>setDeleting({kind:"video",id:v.id,name:v.title})} title="Delete video" data-testid={`button-delete-video-${v.id}`}><Trash2 size={13}/></button></div></td></tr>)}</tbody></table></div>}</div>;
  const groups=<div>{data.groups.length===0?<div className="card"><EmptyState icon={<FolderOpen size={21}/>} title="No categories yet" copy="Create a category to organize videos into a series or collection." action="Create category" onClick={()=>setGroupModal(true)}/></div>:<div className="group-grid">{data.groups.map(g=><div className="card group-card" key={g.id} data-testid={`card-group-${g.id}`}><button className="group-open" onClick={()=>openGroup(g.id)} data-testid={`button-open-group-${g.id}`}><h3>{g.name}</h3><p>{g.description||"No description yet."}</p><span className="group-open-label">Open category <ArrowRight size={12}/></span></button><div className="group-foot"><span>{g.videoIds.length} video{g.videoIds.length===1?"":"s"}</span><button onClick={()=>setDeleting({kind:"group",id:g.id,name:g.name})} className="section-link" style={{color:"#a05b45"}} data-testid={`button-delete-group-${g.id}`}>Delete</button></div></div>)}</div>}</div>;
    return <AppShell title="Video library" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Archive & distribution</p><h1>Video library</h1><p className="subtle">Start with a category, then open it to manage the videos inside.</p></div><div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>{tab==="groups"&&<button className="button secondary" onClick={()=>setGroupModal(true)} data-testid="button-add-group"><Plus size={15}/> New category</button>}<button className="button secondary" onClick={()=>setFolderModal(true)} data-testid="button-folder-upload"><FolderOpen size={15}/> Add folder</button><button className="button secondary" onClick={()=>setYoutubeModal(true)} data-testid="button-youtube-downloader"><Download size={15}/> Bulk YouTube download</button><button className="button" onClick={()=>openAddVideo(group!=="all"?group:"")} data-testid="button-add-video"><Plus size={15}/> Add video</button></div></div><div className="toolbar"><div className="filter-row"><button className={`button small ${tab==="library"?"":"ghost"}`} onClick={()=>setTab("library")} data-testid="button-tab-library"><FileVideo size={13}/> Videos</button><button className={`button small ${tab==="groups"?"":"ghost"}`} onClick={()=>setTab("groups")} data-testid="button-tab-groups"><FolderOpen size={13}/> Categories</button></div>{tab==="library"&&<div className="filter-row"><div className="input-wrap"><Search size={14} color="#899791"/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search videos…" data-testid="input-search-videos"/></div><select value={status} onChange={e=>setStatus(e.target.value)} data-testid="select-filter-status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select><select value={group} onChange={e=>setGroup(e.target.value)} data-testid="select-filter-group"><option value="all">All categories</option>{data.groups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></div>}</div>{tab==="library"?library:groups}</div>{videoModal&&<VideoModal video={editingVideo} groups={data.groups} defaultGroupId={videoGroupId} licenseId={workspace.licenseId} licenseName={workspace.user} onSave={saveVideo} onClose={()=>{setVideoModal(false);setVideoGroupId("");setEditingVideo(undefined)}}/>}{trimVideo&&<TrimModal video={trimVideo} onCreate={clip=>{saveVideos([clip]);setTrimVideo(undefined)}} onClose={()=>setTrimVideo(undefined)}/>} {youtubeModal&&<YoutubeDownloadModal groups={data.groups} defaultGroupId={group!=="all"?group:""} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setYoutubeModal(false)}/>} {folderModal&&<BulkUploadModal groups={data.groups} defaultGroupId={group!=="all"?group:""} licenseId={workspace.licenseId} licenseName={workspace.user} onSaveMany={saveVideos} onClose={()=>setFolderModal(false)}/>} {groupModal&&<GroupModal group={editingGroup} onSave={saveGroup} onClose={()=>{setGroupModal(false);setEditingGroup(undefined)}}/>}{deleting&&<ConfirmModal title={`Delete this ${deleting.kind}?`} copy={`“${deleting.name}” will be removed from the ${deleting.kind==="video"?"library":"workspace"}.${deleting.kind==="video"?" Its stored video file will also be deleted from Replit.":deleting.kind==="group"?" Videos inside it will remain in your library.":""}`} onClose={()=>setDeleting(undefined)} onConfirm={()=>void remove()}/>}</AppShell>;
}

function SettingsPage({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  const [autoSave,setAutoSave]=useState(()=>localStorage.getItem("signal-desk-autosave")!=="off");const [compact,setCompact]=useState(()=>localStorage.getItem("signal-desk-compact")==="on");const toggle=(key:string,value:boolean,setter:(v:boolean)=>void)=>{setter(value);localStorage.setItem(key,value?"on":"off");workspace.setToast(value?"Preference enabled":"Preference disabled")};
  return <AppShell title="Settings" workspace={workspace}><div className="page"><div className="page-head"><div><p className="eyebrow">Workspace preferences</p><h1>Settings</h1><p className="subtle">Tune Reverse Bypass to match how you work. Everything here stays local.</p></div></div><div className="settings-grid"><section className="card setting-section"><div className="section-head"><div><h2 className="section-title">Workspace</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Simple controls for a focused desk.</p></div><Settings size={17} color="#6c8b83"/></div><div className="setting-row"><div><h3>Save changes automatically</h3><p>Keep channel and library edits in local storage as you make them.</p></div><button className={`toggle ${autoSave?"on":""}`} onClick={()=>toggle("signal-desk-autosave",!autoSave,setAutoSave)} data-testid="toggle-autosave"><span/></button></div><div className="setting-row"><div><h3>Compact data tables</h3><p>Use a denser row height when the library gets busy.</p></div><button className={`toggle ${compact?"on":""}`} onClick={()=>toggle("signal-desk-compact",!compact,setCompact)} data-testid="toggle-compact"><span/></button></div><div className="setting-row"><div><h3>Storage status</h3><p>Your data is persisted in this browser only.</p></div><span className="status live"><span className="status-dot"/>Local only</span></div></section><section className="card setting-section"><div className="section-head"><div><h2 className="section-title">Stream tools</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Useful links for getting your workspace ready.</p></div><Download size={17} color="#6c8b83"/></div><div className="download-list"><a className="download" href="https://obsproject.com/download" target="_blank" rel="noreferrer" data-testid="link-download-obs"><div className="download-icon"><Download size={15}/></div><div className="download-copy"><strong>OBS Studio</strong><span>Open source broadcast software</span></div><ArrowRight size={14} color="#80908a"/></a><a className="download" href="https://vdo.ninja/" target="_blank" rel="noreferrer" data-testid="link-open-vdo"><div className="download-icon"><Link2 size={15}/></div><div className="download-copy"><strong>VDO.Ninja</strong><span>Browser guests and remote feeds</span></div><ArrowRight size={14} color="#80908a"/></a><a className="download" href="https://support.google.com/youtube/answer/2907883" target="_blank" rel="noreferrer" data-testid="link-stream-guide"><div className="download-icon"><Download size={15}/></div><div className="download-copy"><strong>Streaming guide</strong><span>Platform setup reference</span></div><ArrowRight size={14} color="#80908a"/></a></div><div className="form-note" style={{marginTop:17}}><ShieldCheck size={14} style={{verticalAlign:"-3px",marginRight:6}}/>Keep private live URLs out of public chat.</div></section></div><section className="card setting-section" style={{marginTop:18}}><div className="section-head"><div><h2 className="section-title">About this demo</h2><p className="subtle" style={{margin:"5px 0 0",fontSize:11}}>Reverse Bypass runs entirely on your device.</p></div><Gauge size={17} color="#6c8b83"/></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:22}}><div><div className="metric-kicker">Environment</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>Local demo</div></div><div><div className="metric-kicker">Data layer</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>Browser storage</div></div><div><div className="metric-kicker">Workspace owner</div><div style={{fontWeight:800,fontSize:13,marginTop:8}}>{workspace.user}</div></div></div></section></div></AppShell>;
}

function Routed({workspace}:{workspace:ReturnType<typeof useWorkspace>}) {
  return <Switch><Route path="/dashboard"><Dashboard workspace={workspace}/></Route><Route path="/live"><LivePage workspace={workspace}/></Route><Route path="/videos"><VideosPage workspace={workspace}/></Route><Route path="/settings"><SettingsPage workspace={workspace}/></Route><Route><NotFound/></Route></Switch>;
}

function App() {
  const license = useLicense();
  const workspace=useWorkspace(license.license, license.clear); const [location,setLocation]=useLocation();
  useEffect(() => { if (isLicenseActive(license.license) && location === "/") setLocation("/dashboard"); }, [license.license, location, setLocation]);
  if (location === "/owner") return <OwnerPage/>;
  if (!license.license || !isLicenseActive(license.license)) return <LicenseGate license={license.license} busy={license.busy} error={license.error} onActivate={license.activate} onRenew={license.renew}/>;
  if (!workspace.ready) return <div className="workspace-loading"><Radio size={20}/><span>Loading your private workspace…</span></div>;
  return <Routed workspace={workspace}/>;
}

export default function RootApp() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,"")}><App/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}