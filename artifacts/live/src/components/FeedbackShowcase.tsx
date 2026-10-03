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

export function LandingFeedbackSection() {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const [selected, setSelected] = useState<PublicFeedback | null>(null);
  const entries = (data?.feedback ?? []).slice(0, 5);
  const closeModal = useCallback(() => setSelected(null), []);
  const openEntry = (entry: PublicFeedback) => {
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
          <h3 id="feedback-landing-title">Real channels. Real examples.</h3>
          <p>See channel feedback shared by Loop Stream creators.</p>
        </div>
        <a href="/feedback" className="feedback-landing-link" data-testid="link-view-creator-feedback">
          <span>View creator feedback</span>
          <span className="feedback-link-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
      {isLoading ? (
        <div className="feedback-landing-grid" aria-label="Loading creator feedback">
          {Array.from({ length: 5 }, (_, index) => <div className="feedback-skeleton" key={index} aria-hidden="true"><div className="feedback-skeleton-image" /><div className="feedback-skeleton-lines"><i /><i /></div></div>)}
        </div>
      ) : isError ? (
        <FeedbackError onRetry={() => { void refetch(); }} />
      ) : entries.length === 0 ? (
        <div className="feedback-landing-empty">
          <span className="feedback-empty-mark" aria-hidden="true"><i /><i /><i /></span>
          <p>Creator feedback will appear here as entries are published.</p>
        </div>
      ) : (
        <div className="feedback-landing-grid" aria-label="Latest public creator feedback">
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
      <h2>We couldn’t load the gallery</h2>
      <p>There was a problem reaching the public feedback feed. Give it another try.</p>
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
      <h2>The gallery is just getting started</h2>
      <p>When creators share their channel examples, they’ll appear here. No reviews have been published yet.</p>
    </div>
  );
}

function FeedbackCard({ entry, onOpen }: { entry: PublicFeedback; onOpen: (entry: PublicFeedback) => void }) {
  return (
    <button
      className="feedback-card"
      type="button"
      onClick={() => onOpen(entry)}
      aria-label={`View feedback from ${entry.channelName}: ${entry.title}`}
      data-testid={`card-feedback-${entry.id}`}
    >
      <span className="feedback-card-image">
        <img src={entry.imageUrl} alt={`Feedback image for ${entry.channelName}: ${entry.title}`} loading="lazy" />
        <span className="feedback-card-open" aria-hidden="true">Open ↗</span>
      </span>
      <span className="feedback-card-copy">
        <span className="feedback-card-channel">{entry.channelName}</span>
        <span className="feedback-card-title">{entry.title}</span>
      </span>
    </button>
  );
}

function ChannelActions({ entry }: { entry: PublicFeedback }) {
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

function FeedbackModal({ entry, onClose }: { entry: PublicFeedback; onClose: () => void }) {
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
        <div className="feedback-modal-image-scroll">
          <img src={entry.imageUrl} alt={`Feedback image for ${entry.channelName}: ${entry.title}`} />
        </div>
        <div className="feedback-modal-info">
          <p className="feedback-eyebrow">Creator channel · public example</p>
          <h2 id="feedback-modal-title">{entry.title}</h2>
          <p className="feedback-modal-channel">{entry.channelName}</p>
          <ChannelActions entry={entry} />
        </div>
      </section>
    </div>
  );
}

export function FeedbackGalleryPage() {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<PublicFeedback | null>(null);
  const entries = (data?.feedback ?? []).slice(0, 5);
  const closeModal = useCallback(() => setSelected(null), []);

  const openEntry = (entry: PublicFeedback) => {
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
          <p className="feedback-eyebrow">Real channels. Real examples.</p>
          <h1>Proof from the stream.</h1>
          <p className="feedback-intro">A public look at channel feedback shared by creators using Loop Stream. Explore the examples and decide for yourself.</p>
        </header>
        <div className="feedback-gallery-topline">
          <span>Creator gallery</span>
          <span className="feedback-gallery-count">{isLoading ? "Updating" : `${entries.length} ${entries.length === 1 ? "example" : "examples"}`}</span>
        </div>
        {isLoading ? <FeedbackLoading /> : isError ? <FeedbackError onRetry={() => { void refetch(); }} /> : entries.length === 0 ? <FeedbackEmpty /> : (
          <section className="feedback-grid" aria-label="Latest public creator feedback">
            {entries.map((entry, index) => <div className={`feedback-grid-item feedback-grid-item-${index + 1}`} key={entry.id}><FeedbackCard entry={entry} onOpen={openEntry} /></div>)}
          </section>
        )}
        <footer className="feedback-page-footer">
          <span>Shared by creators, shown as submitted.</span>
          <Link href="/" className="feedback-footer-home">Back to Loop Stream <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
      {selected && <FeedbackModal entry={selected} onClose={closeModal} />}
    </main>
  );
}

export function FeedbackDetailPage({ feedbackId }: { feedbackId: string }) {
  const { data, isLoading, isError, refetch } = useListPublicFeedback(feedbackQueryOptions);
  const entries = data?.feedback ?? [];
  const entry = entries.find((item) => item.id === feedbackId);

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
            <p className="feedback-eyebrow">Creator channel · public example</p>
            <h1>{entry.title}</h1>
            <p className="feedback-detail-channel">{entry.channelName}</p>
            <div className="feedback-detail-image-scroll">
              <img src={entry.imageUrl} alt={`Feedback image for ${entry.channelName}: ${entry.title}`} />
            </div>
            <ChannelActions entry={entry} />
          </article>
        )}
      </div>
    </main>
  );
}