import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ExternalLink, ImagePlus, LoaderCircle, RefreshCw, Trash2, Upload } from "lucide-react";
import {
  useCreateOwnerFeedback,
  useCreateOwnerFeedbackUploadUrl,
  useDeleteOwnerFeedback,
  getListOwnerFeedbackQueryKey,
  useListOwnerFeedback,
} from "@workspace/api-client-react";
import type { FeedbackImageUploadInputContentType, OwnerFeedback } from "@workspace/api-client-react";
import "./FeedbackAdmin.css";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxImageSize = 5 * 1024 * 1024;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Recently added" : parsed.toLocaleDateString();
}

export function OwnerFeedbackPanel({ ownerPassword }: { ownerPassword: string }) {
  const request = useMemo(() => ({ headers: { "X-Owner-Password": ownerPassword } }), [ownerPassword]);
  const feedbackQuery = useListOwnerFeedback({ request, query: { queryKey: getListOwnerFeedbackQueryKey(), refetchInterval: 30_000 } });
  const uploadUrl = useCreateOwnerFeedbackUploadUrl({ request });
  const createFeedback = useCreateOwnerFeedback({ request });
  const deleteFeedback = useDeleteOwnerFeedback({ request });
  const imageInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const entries = feedbackQuery.data?.feedback ?? [];
  const busy = uploadUrl.isPending || createFeedback.isPending || deleteFeedback.isPending;

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const chooseImage = (file: File | undefined) => {
    setError("");
    setNotice("");
    if (!file) {
      setImage(null);
      return;
    }
    if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number])) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxImageSize) {
      setError("The image must be 5 MB or smaller.");
      return;
    }
    setImage(file);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!image || busy) return;
    setError("");
    setNotice("");
    try {
      const signed = await uploadUrl.mutateAsync({
        data: {
          contentType: image.type as FeedbackImageUploadInputContentType,
          size: image.size,
        },
      });
      const uploaded = await fetch(signed.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": signed.contentType },
        body: image,
      });
      if (!uploaded.ok) throw new Error("Image upload failed. Please try again.");
      await createFeedback.mutateAsync({
        data: {
          title: title.trim(),
          channelName: channelName.trim(),
          channelUrl: channelUrl.trim(),
          imagePath: signed.objectPath,
        },
      });
      await feedbackQuery.refetch();
      setTitle("");
      setChannelName("");
      setChannelUrl("");
      setImage(null);
      if (imageInput.current) imageInput.current.value = "";
      setNotice("Feedback added. It is now visible in the public gallery.");
    } catch (reason) {
      setError(errorMessage(reason, "Could not add this feedback entry."));
    }
  };

  const remove = async (entry: OwnerFeedback) => {
    if (!window.confirm(`Remove “${entry.title}” from the public feedback gallery? Its uploaded image will also be deleted.`)) return;
    setError("");
    setNotice("");
    try {
      await deleteFeedback.mutateAsync({ feedbackId: entry.id });
      await feedbackQuery.refetch();
      setNotice("Feedback removed from the public gallery.");
    } catch (reason) {
      setError(errorMessage(reason, "Could not remove this feedback entry."));
    }
  };

  return (
    <main className="owner-content owner-payment-content feedback-admin-content">
      <div className="page-head owner-page-heading">
        <div>
          <p className="eyebrow">Public landing page</p>
          <h1>Creator feedback</h1>
          <p className="subtle">Add channel examples with an image and a direct channel link. The newest five appear publicly.</p>
        </div>
        <div className="owner-page-badge"><ImagePlus size={16} /> {entries.length} {entries.length === 1 ? "entry" : "entries"}</div>
      </div>

      {notice && <div className="form-note feedback-admin-notice" role="status">{notice}</div>}
      {error && <div className="error-note feedback-admin-error" role="alert">{error}</div>}

      <section className="card owner-pay-card feedback-admin-form-card">
        <div className="pay-section-title">
          <div>
            <span className="metric-kicker">New showcase entry</span>
            <h2>Add creator feedback</h2>
            <p>Use a channel screenshot or feedback image. Only the channel name, image, and public link are shown to visitors.</p>
          </div>
          <ImagePlus size={19} aria-hidden="true" />
        </div>
        <form className="feedback-admin-form" onSubmit={(event) => void submit(event)}>
          <div className="feedback-admin-fields">
            <label className="field">
              <span>Feedback title</span>
              <input required minLength={2} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short channel result or comment" data-testid="input-feedback-title" />
            </label>
            <label className="field">
              <span>Channel name</span>
              <input required minLength={2} maxLength={80} value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="Public channel name" data-testid="input-feedback-channel-name" />
            </label>
            <label className="field feedback-admin-field-wide">
              <span>Direct channel link</span>
              <input required type="url" maxLength={500} value={channelUrl} onChange={(event) => setChannelUrl(event.target.value)} placeholder="https://www.youtube.com/@channel" data-testid="input-feedback-channel-url" />
            </label>
            <div className="field feedback-admin-field-wide">
              <span>Feedback image</span>
              <div className="feedback-admin-image-picker">
                <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0])} aria-label="Choose a creator feedback image" data-testid="input-feedback-image" />
                <div className="feedback-admin-image-preview">
                  {imagePreview ? <img src={imagePreview} alt={`Selected image: ${image?.name}`} /> : <ImagePlus size={24} aria-hidden="true" />}
                </div>
                <div className="feedback-admin-image-copy">
                  <strong>{image?.name || "Choose an image to upload"}</strong>
                  <small>JPG, PNG, or WebP · up to 5 MB</small>
                </div>
              </div>
            </div>
          </div>
          <div className="feedback-admin-form-foot">
            <p>Entries publish immediately and are ordered newest first.</p>
            <button className="button" type="submit" disabled={!image || busy} data-testid="button-save-feedback">
              {busy ? <LoaderCircle size={15} className="feedback-admin-spin" /> : <Upload size={15} />}
              {busy ? "Saving feedback…" : "Add feedback"}
            </button>
          </div>
        </form>
      </section>

      <section className="card owner-pay-card feedback-admin-list-card">
        <div className="pay-section-title">
          <div>
            <span className="metric-kicker">Published records</span>
            <h2>Feedback entries</h2>
            <p>All saved entries appear here; the landing page shows the newest five.</p>
          </div>
          <button className="button secondary small" type="button" onClick={() => void feedbackQuery.refetch()} disabled={feedbackQuery.isFetching} data-testid="button-refresh-feedback">
            <RefreshCw size={14} className={feedbackQuery.isFetching ? "feedback-admin-spin" : ""} /> Refresh
          </button>
        </div>
        {feedbackQuery.isLoading ? (
          <div className="feedback-admin-empty" role="status">Loading feedback entries…</div>
        ) : feedbackQuery.isError ? (
          <div className="feedback-admin-empty feedback-admin-load-error" role="alert">
            <strong>Feedback entries could not be loaded.</strong>
            <button className="button secondary small" type="button" onClick={() => void feedbackQuery.refetch()}>Try again</button>
          </div>
        ) : entries.length === 0 ? (
          <div className="feedback-admin-empty"><ImagePlus size={23} /><strong>No feedback entries yet</strong><span>Add the first creator example above. It will then appear in the public gallery.</span></div>
        ) : (
          <div className="feedback-admin-list">
            {entries.map((entry) => <article className="feedback-admin-item" key={entry.id} data-testid={`owner-feedback-${entry.id}`}>
              <img className="feedback-admin-thumb" src={entry.imageUrl} alt={`Feedback image for ${entry.channelName}`} loading="lazy" />
              <div className="feedback-admin-item-copy">
                <strong>{entry.title}</strong>
                <span>{entry.channelName}</span>
                <small>Added {formatDate(entry.createdAt)}</small>
              </div>
              <a className="button secondary small feedback-admin-link" href={entry.channelUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${entry.channelName} channel`}>
                View channel <ExternalLink size={13} />
              </a>
              <button className="icon-button feedback-admin-delete" type="button" onClick={() => void remove(entry)} disabled={busy} aria-label={`Delete feedback for ${entry.channelName}`} title="Delete feedback">
                <Trash2 size={15} />
              </button>
            </article>)}
          </div>
        )}
      </section>
    </main>
  );
}