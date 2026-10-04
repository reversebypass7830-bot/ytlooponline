import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowSquareOut, YoutubeLogo } from "@phosphor-icons/react";
import { getListPublicFeedbackQueryKey, useListPublicFeedback } from "@workspace/api-client-react";
import type { PublicFeedback } from "@workspace/api-client-react";
import "./FeedbackShowcase.css";

const feedbackQueryOptions = {
  query: {
    queryKey: getListPublicFeedbackQueryKey(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  },
  request: { cache: "no-store" as const },
};

type FeedbackChannelStats = {
  views: string;
  joined: string;
};

type FeedbackEntry = PublicFeedback & {
  avatarUrl?: string;
  channelStats?: FeedbackChannelStats;
};

const feedbackAvatarById: Record<string, string> = {
  "demo-kai-asmr": "/images/feedback-demo/kai-asmr-avatar.webp",
  "seed-kai-asmr": "/images/feedback-demo/kai-asmr-avatar.webp",
  "demo-dambiesyt": "/images/feedback-demo/dambiesyt-avatar.webp",
  "seed-dambiesyt": "/images/feedback-demo/dambiesyt-avatar.webp",
  "demo-tang-tien": "/images/feedback-demo/tang-tien-avatar.webp",
  "seed-tang-tien": "/images/feedback-demo/tang-tien-avatar.webp",
  "demo-candy-talks": "/images/feedback-demo/candy-talks-avatar.webp",
  "seed-candy-talks": "/images/feedback-demo/candy-talks-avatar.webp",
  "31415552-e831-4eda-8af8-6e22a8f70589": "/images/feedback-avatars/31415552-e831-4eda-8af8-6e22a8f70589.webp",
  "dd3b8193-6dfb-4b56-a76d-1adaf1ffbb1c": "/images/feedback-avatars/dd3b8193-6dfb-4b56-a76d-1adaf1ffbb1c.webp",
  "a98fab58-329e-4b85-a6b2-10d480dad7ab": "/images/feedback-avatars/a98fab58-329e-4b85-a6b2-10d480dad7ab.webp",
  "e26aa36a-10ea-4963-8f7a-3e47c43ee18f": "/images/feedback-avatars/e26aa36a-10ea-4963-8f7a-3e47c43ee18f.webp",
  "eb69ef52-ea0c-4584-9cd2-c560fcf45592": "/images/feedback-avatars/eb69ef52-ea0c-4584-9cd2-c560fcf45592.webp",
  "b21e64b2-1c55-46f3-b5f5-4a496be44b03": "/images/feedback-avatars/b21e64b2-1c55-46f3-b5f5-4a496be44b03.webp",
  "b350e8ed-06f3-4d17-9524-6c9ffcb7420e": "/images/feedback-avatars/b350e8ed-06f3-4d17-9524-6c9ffcb7420e.webp",
  "01aaf439-0fc2-4bf6-8188-b71b4ef6cc3f": "/images/feedback-avatars/01aaf439-0fc2-4bf6-8188-b71b4ef6cc3f.webp",
  "76b21c50-282c-4cfa-8989-d7c5c1d67fae": "/images/feedback-avatars/76b21c50-282c-4cfa-8989-d7c5c1d67fae.webp",
};

const feedbackChannelStatsById: Record<string, FeedbackChannelStats> = {
  "demo-kai-asmr": { views: "871,184,265", joined: "18 Sept 2018" },
  "seed-kai-asmr": { views: "871,184,265", joined: "18 Sept 2018" },
  "demo-dambiesyt": { views: "350,244,301", joined: "2 Oct 2018" },
  "seed-dambiesyt": { views: "350,244,301", joined: "2 Oct 2018" },
  "demo-tang-tien": { views: "285,397,416", joined: "9 Nov 2014" },
  "seed-tang-tien": { views: "285,397,416", joined: "9 Nov 2014" },
  "demo-candy-talks": { views: "8,609,866", joined: "25 Oct 2025" },
  "seed-candy-talks": { views: "8,609,866", joined: "25 Oct 2025" },
};

const demoFeedbackEntries: FeedbackEntry[] = [
  {
    id: "demo-kai-asmr",
    title: "Live stream and channel page",
    channelName: "Kai ASMR",
    channelUrl: "https://youtube.com/@kaiasmr4real",
    imageUrl: "/images/feedback-demo/kai-asmr-live.webp",
    imageUrls: [
      "/images/feedback-demo/kai-asmr-live.webp",
      "/images/feedback-demo/kai-asmr-about.webp",
    ],
    pinned: true,
    avatarUrl: "/images/feedback-demo/kai-asmr-avatar.webp",
    createdAt: "2026-10-03T00:00:00.000Z",
  },
  {
    id: "demo-dambiesyt",
    title: "WWE 2K live channel",
    channelName: "Dambiesyt",
    channelUrl: "https://youtube.com/@dambiesyt",
    imageUrl: "/images/feedback-demo/dambiesyt-live.webp",
    imageUrls: [
      "/images/feedback-demo/dambiesyt-live.webp",
      "/images/feedback-demo/dambiesyt-about.webp",
    ],
    pinned: true,
    avatarUrl: "/images/feedback-demo/dambiesyt-avatar.webp",
    createdAt: "2026-10-03T00:00:00.000Z",
  },
  {
    id: "demo-tang-tien",
    title: "Raw egg peeling ASMR live",
    channelName: "Tăng Tiến Official",
    channelUrl: "https://youtube.com/@tangtienofficial2050",
    imageUrl: "/images/feedback-demo/tang-tien-live.webp",
    imageUrls: [
      "/images/feedback-demo/tang-tien-live.webp",
      "/images/feedback-demo/tang-tien-about.webp",
    ],
    pinned: true,
    avatarUrl: "/images/feedback-demo/tang-tien-avatar.webp",
    createdAt: "2026-10-03T00:00:00.000Z",
  },
  {
    id: "demo-candy-talks",
    title: "Satisfying candy ASMR live",
    channelName: "CANDY TALKS",
    channelUrl: "https://youtube.com/@candytalks-z9b",
    imageUrl: "/images/feedback-demo/candy-talks-live.webp",
    imageUrls: [
      "/images/feedback-demo/candy-talks-live.webp",
      "/images/feedback-demo/candy-talks-about.webp",
    ],
    pinned: true,
    avatarUrl: "/images/feedback-demo/candy-talks-avatar.webp",
    createdAt: "2026-10-03T00:00:00.000Z",
  },
];

function getDisplayEntries(entries: PublicFeedback[], limit?: number): FeedbackEntry[] {
  const source = entries.length > 0 ? entries : import.meta.env.DEV ? demoFeedbackEntries : [];
  const visibleEntries = limit === undefined ? source : source.slice(0, limit);
  return visibleEntries.map((entry) => ({
    ...entry,
    avatarUrl: (entry as FeedbackEntry).avatarUrl ?? feedbackAvatarById[entry.id],
  }));
}

function getLandingEntries(entries: PublicFeedback[]): FeedbackEntry[] {
  const source: PublicFeedback[] = entries.length === 0
    ? import.meta.env.DEV ? demoFeedbackEntries.slice(0, 4) : []
    : entries.filter((entry) => entry.pinned).slice(0, 4);
  return source.map((entry) => ({
    ...entry,
    avatarUrl: (entry as FeedbackEntry).avatarUrl ?? feedbackAvatarById[entry.id],
    channelStats: feedbackChannelStatsById[entry.id],
  }));
}

function getEntryImages(entry: FeedbackEntry): string[] {
  return entry.imageUrls?.length ? entry.imageUrls : [entry.imageUrl];
}

const feedbackImagePreloadQueue: string[] = [];
const queuedFeedbackImageUrls = new Set<string>();
let activeFeedbackImagePreloads = 0;
const maxFeedbackImagePreloads = 3;

function preloadFeedbackImages(imageUrls: string[]) {
  for (const imageUrl of imageUrls) {
    if (!imageUrl || queuedFeedbackImageUrls.has(imageUrl)) continue;
    queuedFeedbackImageUrls.add(imageUrl);
    feedbackImagePreloadQueue.push(imageUrl);
  }
  processFeedbackImagePreloadQueue();
}

function processFeedbackImagePreloadQueue() {
  while (activeFeedbackImagePreloads < maxFeedbackImagePreloads && feedbackImagePreloadQueue.length > 0) {
    const imageUrl = feedbackImagePreloadQueue.shift();
    if (!imageUrl) continue;

    activeFeedbackImagePreloads += 1;
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    let finished = false;
    const finish = (loaded: boolean) => {
      if (finished) return;
      finished = true;
      if (!loaded) queuedFeedbackImageUrls.delete(imageUrl);
      activeFeedbackImagePreloads -= 1;
      processFeedbackImagePreloadQueue();
    };
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.src = imageUrl;
    if (image.complete) finish(image.naturalWidth > 0);
  }
}

function getChannelInitials(channelName: string): string {
  return channelName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function isDemoEntry(entry: FeedbackEntry): boolean {
  return entry.id.startsWith("demo-");
}

function FeedbackPreviewNote() {
  return (
    <p className="feedback-preview-note">
      <strong>Design preview</strong> — reference screenshots only, not published testimonials.
    </p>
  );
}

export function LandingFeedbackSection() {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const [selected, setSelected] = useState<FeedbackEntry | null>(null);
  const entries = getLandingEntries(data?.feedback ?? []);
  const showingDemoEntries = entries.some(isDemoEntry);
  const closeModal = useCallback(() => setSelected(null), []);
  const openEntry = (entry: FeedbackEntry) => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      window.location.assign(`/feedback/${encodeURIComponent(entry.id)}`);
      return;
    }
    setSelected(entry);
  };

  return (
    <section className="feedback-landing-section" aria-labelledby="feedback-landing-title">
      <div className="feedback-landing-heading">
        <div>
          <p className="feedback-eyebrow">CREATOR FEEDBACK</p>
          <h3 id="feedback-landing-title">Channel feedback</h3>
          <p>Browse channel snapshots and open each creator’s YouTube page.</p>
          {showingDemoEntries && <FeedbackPreviewNote />}
        </div>
        <a href="/feedback" className="feedback-landing-link" data-testid="link-view-creator-feedback">
          <span>View all feedback</span>
          <span className="feedback-link-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
      {isLoading ? (
        <div className="feedback-landing-grid" aria-label="Loading creator feedback">
          {Array.from({ length: 4 }, (_, index) => <div className="feedback-skeleton" key={index} aria-hidden="true"><div className="feedback-skeleton-image" /><div className="feedback-skeleton-lines"><i /><i /></div></div>)}
        </div>
      ) : isError ? (
        <FeedbackError onRetry={() => { void refetch(); }} />
      ) : entries.length === 0 ? (
        <div className="feedback-landing-empty">Channel feedback added by the owner will appear here.</div>
      ) : (
        <div className="feedback-landing-grid" aria-label="Featured creator channels">
          {entries.map((entry) => <FeedbackCard key={entry.id} entry={entry} onOpen={openEntry} />)}
        </div>
      )}
      {selected && <FeedbackModal entry={selected} onClose={closeModal} />}
    </section>
  );
}

function FeedbackLoading() {
  return (
    <div className="feedback-grid" aria-label="Loading creator feedback">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="feedback-skeleton" key={index} aria-hidden="true">
          <div className="feedback-skeleton-image" />
          <div className="feedback-skeleton-lines"><i /><i /></div>
        </div>
      ))}
    </div>
  );
}

function FeedbackError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="feedback-state feedback-error" role="alert">
      <span className="feedback-state-mark" aria-hidden="true">!</span>
      <h2>We couldn’t load channel feedback</h2>
      <p>There was a problem reaching the public channel gallery. Give it another try.</p>
      <button className="feedback-button feedback-button-secondary" type="button" onClick={onRetry} data-testid="button-retry-feedback">
        Try again
      </button>
    </div>
  );
}

function FeedbackEmpty() {
  return (
    <div className="feedback-state feedback-empty">
      <span className="feedback-empty-mark" aria-hidden="true"><i /><i /><i /></span>
      <h2>No channels featured yet</h2>
      <p>Channel examples added by the owner will appear here.</p>
    </div>
  );
}

function FeedbackCard({ entry, onOpen }: { entry: FeedbackEntry; onOpen: (entry: FeedbackEntry) => void }) {
  const images = getEntryImages(entry);
  const imageCount = images.length;

  return (
    <article className="feedback-card" data-testid={`card-feedback-${entry.id}`}>
      <a className="feedback-card-channel-link" href={entry.channelUrl} target="_blank" rel="noreferrer" aria-label={`Open ${entry.channelName} on YouTube`}>
        {entry.avatarUrl ? (
          <img className="feedback-card-avatar" src={entry.avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className="feedback-card-avatar feedback-avatar-fallback" aria-hidden="true">{getChannelInitials(entry.channelName)}</span>
        )}
        <span className="feedback-card-channel">{entry.channelName}</span>
        <span className="feedback-card-channel-icons" aria-hidden="true">
          <YoutubeLogo className="feedback-card-youtube-icon" size={16} weight="fill" />
          <ArrowSquareOut className="feedback-card-external-icon" size={15} weight="bold" />
        </span>
      </a>
      <button
        className="feedback-card-preview"
        type="button"
        onClick={() => onOpen(entry)}
        onPointerEnter={() => preloadFeedbackImages(images.slice(1, 2))}
        onPointerDown={() => preloadFeedbackImages(images.slice(1))}
        onFocus={() => preloadFeedbackImages(images)}
        aria-label={`View ${imageCount} feedback ${imageCount === 1 ? "image" : "images"} from ${entry.channelName}`}
      >
        <span className="feedback-card-image">
          <img src={entry.imageUrl} alt={`Channel preview for ${entry.channelName}`} loading="lazy" />
          <span className="feedback-card-open" aria-hidden="true">{imageCount} {imageCount === 1 ? "image" : "images"} ↗</span>
        </span>
        <span className="feedback-card-copy">
          <span className="feedback-card-title">{entry.title}</span>
          {entry.channelStats && (
            <span className="feedback-card-details">
              <span className="feedback-card-view-count">
                <span>{entry.channelStats.views} views</span>
              </span>
              <span className="feedback-card-joined">Joined {entry.channelStats.joined}</span>
            </span>
          )}
        </span>
      </button>
    </article>
  );
}

function ChannelActions({ entry }: { entry: FeedbackEntry }) {
  return (
    <div className="feedback-channel-actions">
      <a className="feedback-channel-direct" href={entry.channelUrl} target="_blank" rel="noreferrer" aria-label={`Open ${entry.channelName} channel in a new tab`}>
        <span className="feedback-channel-url">{entry.channelUrl}</span>
        <span className="feedback-external-mark" aria-hidden="true">↗</span>
      </a>
      <a className="feedback-button feedback-button-primary" href={entry.channelUrl} target="_blank" rel="noreferrer" data-testid={`link-view-channel-${entry.id}`}>
        View channel <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

function FeedbackImageGallery({ entry }: { entry: FeedbackEntry }) {
  const images = useMemo(() => getEntryImages(entry), [entry.imageUrl, entry.imageUrls]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const activeImage = images[activeIndex];

  useEffect(() => {
    preloadFeedbackImages(images);
  }, [images]);

  return (
    <div className="feedback-image-gallery">
      <div className="feedback-image-stage" aria-busy={!loadedImages.has(activeImage) && !failedImages.has(activeImage)}>
        <img
          key={activeImage}
          src={activeImage}
          alt={`${entry.channelName} channel screenshot ${activeIndex + 1} of ${images.length}`}
          decoding="async"
          fetchPriority="high"
          onLoad={() => {
            setLoadedImages((loaded) => new Set(loaded).add(activeImage));
            setFailedImages((failed) => {
              if (!failed.has(activeImage)) return failed;
              const next = new Set(failed);
              next.delete(activeImage);
              return next;
            });
          }}
          onError={() => setFailedImages((failed) => new Set(failed).add(activeImage))}
        />
        {!loadedImages.has(activeImage) && (
          <span className={failedImages.has(activeImage) ? "feedback-image-error" : "feedback-image-loading"} role={failedImages.has(activeImage) ? "alert" : "status"}>
            {failedImages.has(activeImage) ? "Image couldn’t load. Check your connection." : (
              <>
                <span className="feedback-image-spinner" aria-hidden="true" />
                Loading image…
              </>
            )}
          </span>
        )}
        {images.length > 1 && (
          <>
            <button
              className="feedback-image-step feedback-image-step-previous"
              type="button"
              onClick={() => setActiveIndex((index) => (index - 1 + images.length) % images.length)}
              aria-label="Show previous screenshot"
            >
              ‹
            </button>
            <button
              className="feedback-image-step feedback-image-step-next"
              type="button"
              onClick={() => setActiveIndex((index) => (index + 1) % images.length)}
              aria-label="Show next screenshot"
            >
              ›
            </button>
            <span className="feedback-image-count">{activeIndex + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="feedback-image-thumbnails" aria-label="Choose a channel screenshot">
          {images.map((image, index) => (
            <button
              className={`feedback-image-thumbnail${activeIndex === index ? " is-active" : ""}`}
              type="button"
              key={image}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show screenshot ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <img src={image} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackModal({ entry, onClose }: { entry: FeedbackEntry; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="feedback-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="feedback-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="feedback-modal-title" data-testid="dialog-feedback-detail">
        <button className="feedback-modal-close" type="button" onClick={onClose} ref={closeRef} aria-label="Close feedback detail" data-testid="button-close-feedback">
          <span aria-hidden="true">×</span>
        </button>
        <FeedbackImageGallery entry={entry} />
        <div className="feedback-modal-info">
          <p className="feedback-eyebrow">CHANNEL FEEDBACK</p>
          <h2 id="feedback-modal-title">{entry.channelName}</h2>
          <p className="feedback-modal-channel">{entry.title}</p>
          {isDemoEntry(entry) && <FeedbackPreviewNote />}
          <ChannelActions entry={entry} />
        </div>
      </section>
    </div>
  );
}

export function FeedbackGalleryPage() {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<FeedbackEntry | null>(null);
  const entries = getDisplayEntries(data?.feedback ?? []);
  const showingDemoEntries = entries.some(isDemoEntry);
  const closeModal = useCallback(() => setSelected(null), []);

  const openEntry = (entry: FeedbackEntry) => {
    if (window.matchMedia("(max-width: 720px)").matches) {
      setLocation(`/feedback/${encodeURIComponent(entry.id)}`);
      return;
    }
    setSelected(entry);
  };

  return (
    <main className="feedback-page">
      <div className="feedback-page-inner">
        <div className="feedback-page-topbar">
          <a href="/" className="feedback-top-back-link" aria-label="Back to YT Loop homepage">
            <span aria-hidden="true">←</span> Back to YT Loop
          </a>
          <span className="feedback-brand-link" aria-label="Loop Stream">
          <span className="feedback-brand-orbit" aria-hidden="true"><i /></span>
          <span>LOOP <b>STREAM</b></span>
          </span>
        </div>
        <header className="feedback-page-heading">
          <p className="feedback-eyebrow">CHANNEL FEEDBACK</p>
          <h1>Feedback from live channels.</h1>
          <p className="feedback-intro">Browse channel screenshots, explore creator profiles, and open each channel on YouTube.</p>
          {showingDemoEntries && <FeedbackPreviewNote />}
        </header>
        <div className="feedback-gallery-topline">
          <span>All channels</span>
          <span className="feedback-gallery-count">{isLoading ? "Updating" : `${entries.length} ${entries.length === 1 ? "channel" : "channels"}`}</span>
        </div>
        {isLoading ? <FeedbackLoading /> : isError ? <FeedbackError onRetry={() => { void refetch(); }} /> : entries.length === 0 ? <FeedbackEmpty /> : (
          <section className="feedback-grid" aria-label="All creator feedback">
            {entries.map((entry) => <FeedbackCard key={entry.id} entry={entry} onOpen={openEntry} />)}
          </section>
        )}
        <footer className="feedback-page-footer">
          <span>{showingDemoEntries ? "Development preview only." : "Channel images shown as shared."}</span>
        </footer>
      </div>
      {selected && <FeedbackModal entry={selected} onClose={closeModal} />}
    </main>
  );
}

export function FeedbackDetailPage({ feedbackId }: { feedbackId: string }) {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const entries = getDisplayEntries(data?.feedback ?? []);
  const entry = entries.find((item) => item.id === feedbackId);
  const showingDemoEntry = entry ? isDemoEntry(entry) : false;

  return (
    <main className="feedback-page feedback-detail-page">
      <div className="feedback-page-inner">
        <div className="feedback-page-topbar">
          <Link href="/feedback" className="feedback-top-back-link"><span aria-hidden="true">←</span> All feedback</Link>
          <a href="/" className="feedback-brand-link" aria-label="Back to YT Loop homepage">
            <span className="feedback-brand-orbit" aria-hidden="true"><i /></span>
            <span>LOOP <b>STREAM</b></span>
          </a>
        </div>
        {isLoading ? (
          <div className="feedback-detail-loading" aria-label="Loading feedback detail">
            <div className="feedback-detail-skeleton" />
            <div className="feedback-skeleton-lines"><i /><i /></div>
          </div>
        ) : isError ? (
          <FeedbackError onRetry={() => { void refetch(); }} />
        ) : !entry ? (
          <div className="feedback-state feedback-not-found">
            <span className="feedback-state-mark" aria-hidden="true">?</span>
            <h1>This example isn’t available</h1>
            <p>It may have been removed from the public gallery.</p>
            <Link href="/feedback" className="feedback-button feedback-button-primary">Back to the gallery</Link>
          </div>
        ) : (
          <article className="feedback-detail">
            <p className="feedback-eyebrow">CHANNEL FEEDBACK</p>
            <h1>{entry.channelName}</h1>
            <p className="feedback-detail-channel">{entry.title}</p>
            {showingDemoEntry && <FeedbackPreviewNote />}
            <FeedbackImageGallery entry={entry} />
            <ChannelActions entry={entry} />
          </article>
        )}
      </div>
    </main>
  );
}