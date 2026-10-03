import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { getListPublicFeedbackQueryKey, useListPublicFeedback } from "@workspace/api-client-react";
import type { PublicFeedback } from "@workspace/api-client-react";
import "./FeedbackShowcase.css";

const feedbackQueryOptions = {
  query: {
    queryKey: getListPublicFeedbackQueryKey(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  },
};

type FeedbackEntry = PublicFeedback & {
  avatarUrl?: string;
  imageUrls?: string[];
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
    avatarUrl: "/images/feedback-demo/candy-talks-avatar.webp",
    createdAt: "2026-10-03T00:00:00.000Z",
  },
];

function getDisplayEntries(entries: PublicFeedback[], limit = 5): FeedbackEntry[] {
  if (entries.length > 0) return entries.slice(0, limit);
  return import.meta.env.DEV ? demoFeedbackEntries.slice(0, limit) : [];
}

function getEntryImages(entry: FeedbackEntry): string[] {
  return entry.imageUrls?.length ? entry.imageUrls : [entry.imageUrl];
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
  const entries = getDisplayEntries(data?.feedback ?? [], 4);
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
          <p>{showingDemoEntries ? "Preview using the four channel screenshots you supplied." : "Browse channel snapshots and open each creator’s YouTube page."}</p>
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
  const imageCount = getEntryImages(entry).length;

  return (
    <article className="feedback-card" data-testid={`card-feedback-${entry.id}`}>
      <a className="feedback-card-channel-link" href={entry.channelUrl} target="_blank" rel="noreferrer" aria-label={`Open ${entry.channelName} on YouTube`}>
        {entry.avatarUrl ? (
          <img className="feedback-card-avatar" src={entry.avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className="feedback-card-avatar feedback-avatar-fallback" aria-hidden="true">{getChannelInitials(entry.channelName)}</span>
        )}
        <span className="feedback-card-channel">{entry.channelName}</span>
        <span className="feedback-card-channel-arrow" aria-hidden="true">↗</span>
      </a>
      <button
        className="feedback-card-preview"
        type="button"
        onClick={() => onOpen(entry)}
        aria-label={`View ${imageCount} feedback ${imageCount === 1 ? "image" : "images"} from ${entry.channelName}`}
      >
        <span className="feedback-card-image">
          <img src={entry.imageUrl} alt={`Channel preview for ${entry.channelName}`} loading="lazy" />
          <span className="feedback-card-open" aria-hidden="true">{imageCount} {imageCount === 1 ? "image" : "images"} ↗</span>
        </span>
        <span className="feedback-card-copy">
          <span className="feedback-card-title">{entry.title}</span>
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
  const images = getEntryImages(entry);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="feedback-image-gallery">
      <div className="feedback-image-stage">
        <img src={images[activeIndex]} alt={`${entry.channelName} channel screenshot ${activeIndex + 1} of ${images.length}`} />
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
        <Link href="/" className="feedback-brand-link" aria-label="Loop Stream home">
          <span className="feedback-brand-orbit" aria-hidden="true"><i /></span>
          <span>LOOP <b>STREAM</b></span>
        </Link>
        <header className="feedback-page-heading">
          <p className="feedback-eyebrow">CHANNEL FEEDBACK</p>
          <h1>Feedback from live channels.</h1>
          <p className="feedback-intro">{showingDemoEntries ? "Preview using the four channel screenshots you supplied." : "Browse channel screenshots, explore creator profiles, and open each channel on YouTube."}</p>
          {showingDemoEntries && <FeedbackPreviewNote />}
        </header>
        <div className="feedback-gallery-topline">
          <span>Featured channels</span>
          <span className="feedback-gallery-count">{isLoading ? "Updating" : `${entries.length} ${entries.length === 1 ? "channel" : "channels"}`}</span>
        </div>
        {isLoading ? <FeedbackLoading /> : isError ? <FeedbackError onRetry={() => { void refetch(); }} /> : entries.length === 0 ? <FeedbackEmpty /> : (
          <section className="feedback-grid" aria-label="Featured creator channels">
            {entries.map((entry) => <FeedbackCard key={entry.id} entry={entry} onOpen={openEntry} />)}
          </section>
        )}
        <footer className="feedback-page-footer">
          <span>{showingDemoEntries ? "Development preview only." : "Channel images shown as shared."}</span>
          <Link href="/" className="feedback-footer-home">Back to Loop Stream <span aria-hidden="true">↗</span></Link>
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
        <Link href="/feedback" className="feedback-back-link"><span aria-hidden="true">←</span> All creator feedback</Link>
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