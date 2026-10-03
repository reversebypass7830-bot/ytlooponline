import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ExternalLink, ImagePlus, LoaderCircle, Pencil, Pin, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import {
  getListOwnerFeedbackQueryKey,
  getListPublicFeedbackQueryKey,
  useCreateOwnerFeedback,
  useCreateOwnerFeedbackUploadUrl,
  useDeleteOwnerFeedback,
  useListOwnerFeedback,
  useUpdateOwnerFeedback,
} from "@workspace/api-client-react";
import type { FeedbackImageUploadInputContentType, OwnerFeedback } from "@workspace/api-client-react";
import "./FeedbackAdmin.css";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxImageSize = 5 * 1024 * 1024;
const maxImages = 8;
const maxPinned = 4;

type StoredFeedbackImage = { id: string; path: string; url: string };
type PendingFeedbackImage = { id: string; file: File; previewUrl: string };

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Recently added" : parsed.toLocaleDateString();
}

export function OwnerFeedbackPanel({ ownerPassword }: { ownerPassword: string }) {
  const request = useMemo(() => ({ headers: { "X-Owner-Password": ownerPassword } }), [ownerPassword]);
  const queryClient = useQueryClient();
  const feedbackQuery = useListOwnerFeedback({
    request,
    query: { queryKey: getListOwnerFeedbackQueryKey(), refetchInterval: 30_000 },
  });
  const uploadUrl = useCreateOwnerFeedbackUploadUrl({ request });
  const createFeedback = useCreateOwnerFeedback({ request });
  const updateFeedback = useUpdateOwnerFeedback({ request });
  const deleteFeedback = useDeleteOwnerFeedback({ request });
  const imageInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLElement>(null);
  const [title, setTitle] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  const [storedImages, setStoredImages] = useState<StoredFeedbackImage[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingFeedbackImage[]>([]);
  const pendingImagesRef = useRef<PendingFeedbackImage[]>([]);
  const [coverId, setCoverId] = useState("");
  const [pinned, setPinned] = useState(false);
  const [editingEntry, setEditingEntry] = useState<OwnerFeedback | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const entries = feedbackQuery.data?.feedback ?? [];
  const pinnedCount = entries.filter((entry) => entry.pinned).length;
  const busy = uploadUrl.isPending || createFeedback.isPending || updateFeedback.isPending || deleteFeedback.isPending;

  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => () => {
    pendingImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, []);

  const clearDraft = () => {
    pendingImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setPendingImages([]);
    setStoredImages([]);
    setTitle("");
    setChannelName("");
    setChannelUrl("");
    setCoverId("");
    setPinned(false);
    setEditingEntry(null);
    setEditorOpen(false);
    if (imageInput.current) imageInput.current.value = "";
  };

  const imageChoices = [
    ...storedImages.map((image) => ({ id: image.id, url: image.url, kind: "stored" as const })),
    ...pendingImages.map((image) => ({ id: image.id, url: image.previewUrl, kind: "pending" as const })),
  ];
  const orderedImageChoices = coverId
    ? [...imageChoices.filter((image) => image.id === coverId), ...imageChoices.filter((image) => image.id !== coverId)]
    : imageChoices;

  const beginCreate = () => {
    clearDraft();
    setPinned(false);
    setError("");
    setNotice("");
    setEditorOpen(true);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const beginEdit = (entry: OwnerFeedback) => {
    clearDraft();
    const paths = entry.imagePaths?.length ? entry.imagePaths : [entry.imagePath];
    const images = paths.map((path, index) => ({
      id: path,
      path,
      url: entry.imageUrls[index] || entry.imageUrl,
    }));
    setTitle(entry.title);
    setChannelName(entry.channelName);
    setChannelUrl(entry.channelUrl);
    setStoredImages(images);
    setCoverId(images[0]?.id ?? "");
    setPinned(entry.pinned);
    setEditingEntry(entry);
    setError("");
    setNotice("");
    setEditorOpen(true);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const chooseImages = (files: FileList | null) => {
    setError("");
    setNotice("");
    const selected = Array.from(files ?? []);
    if (selected.length === 0) return;
    if (storedImages.length + pendingImages.length + selected.length > maxImages) {
      setError(`A feedback entry can have up to ${maxImages} images.`);
      return;
    }
    const invalidType = selected.find((file) => !allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number]));
    if (invalidType) {
      setError("Choose JPG, PNG, or WebP images.");
      return;
    }
    const oversized = selected.find((file) => file.size > maxImageSize);
    if (oversized) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }
    const added = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingImages((current) => [...current, ...added]);
    if (!coverId) setCoverId(storedImages[0]?.id ?? added[0]?.id ?? "");
  };

  const removeImage = (id: string) => {
    const removed = pendingImages.find((image) => image.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    const nextStored = storedImages.filter((image) => image.id !== id);
    const nextPending = pendingImages.filter((image) => image.id !== id);
    setStoredImages(nextStored);
    setPendingImages(nextPending);
    if (coverId === id) setCoverId(nextStored[0]?.id ?? nextPending[0]?.id ?? "");
  };

  const refreshFeedback = async () => {
    await feedbackQuery.refetch();
    await queryClient.invalidateQueries({ queryKey: getListPublicFeedbackQueryKey() });
  };

  const uploadPendingImages = async (): Promise<Map<string, string>> => {
    const uploadedPaths = new Map<string, string>();
    for (const image of pendingImages) {
      const signed = await uploadUrl.mutateAsync({
        data: {
          contentType: image.file.type as FeedbackImageUploadInputContentType,
          size: image.file.size,
        },
      });
      const result = await fetch(signed.uploadURL, {
        method: "PUT",
        headers: { "Content-Type": signed.contentType },
        body: image.file,
      });
      if (!result.ok) throw new Error(`Image upload failed for ${image.file.name}. Please try again.`);
      uploadedPaths.set(image.id, signed.objectPath);
    }
    return uploadedPaths;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || storedImages.length + pendingImages.length === 0) return;
    setError("");
    setNotice("");
    try {
      const uploadedPaths = await uploadPendingImages();
      const allImages = [
        ...storedImages.map((image) => ({ id: image.id, path: image.path })),
        ...pendingImages.map((image) => ({ id: image.id, path: uploadedPaths.get(image.id) ?? "" })),
      ].filter((image) => image.path);
      const coverIndex = allImages.findIndex((image) => image.id === coverId);
      const orderedImages = coverIndex > 0
        ? [allImages[coverIndex], ...allImages.filter((_, index) => index !== coverIndex)]
        : allImages;
      const data = {
        title: title.trim(),
        channelName: channelName.trim(),
        channelUrl: channelUrl.trim(),
        imagePaths: orderedImages.map((image) => image.path),
        pinned,
      };
      if (editingEntry) {
        await updateFeedback.mutateAsync({ feedbackId: editingEntry.id, data });
      } else {
        await createFeedback.mutateAsync({ data });
      }
      await refreshFeedback();
      clearDraft();
      setNotice(editingEntry ? "Feedback updated." : "Feedback added.");
    } catch (reason) {
      setError(errorMessage(reason, "Could not save this feedback entry."));
    }
  };

  const setEntryPinned = async (entry: OwnerFeedback, nextPinned: boolean) => {
    if (nextPinned && pinnedCount >= maxPinned) {
      setError("Only four entries can be pinned to the homepage. Unpin one first.");
      return;
    }
    setError("");
    setNotice("");
    try {
      await updateFeedback.mutateAsync({
        feedbackId: entry.id,
        data: {
          title: entry.title,
          channelName: entry.channelName,
          channelUrl: entry.channelUrl,
          imagePaths: entry.imagePaths?.length ? entry.imagePaths : [entry.imagePath],
          pinned: nextPinned,
        },
      });
      await refreshFeedback();
      setNotice(nextPinned ? `${entry.channelName} is pinned to the homepage.` : `${entry.channelName} was unpinned.`);
    } catch (reason) {
      setError(errorMessage(reason, "Could not update the homepage pin."));
    }
  };

  const remove = async (entry: OwnerFeedback) => {
    if (!window.confirm(`Remove “${entry.title}” from the public feedback page? Its uploaded images will also be deleted.`)) return;
    setError("");
    setNotice("");
    try {
      await deleteFeedback.mutateAsync({ feedbackId: entry.id });
      await refreshFeedback();
      setNotice("Feedback removed from the public page.");
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
          <p className="subtle">Manage every channel entry. Pin up to four to feature them on the homepage.</p>
        </div>
        <div className="feedback-admin-header-actions">
          <div className="owner-page-badge"><Pin size={15} /> {pinnedCount}/{maxPinned} pinned</div>
          <button className="button" type="button" onClick={beginCreate} data-testid="button-add-feedback">
            <Plus size={15} /> Add Feedback
          </button>
        </div>
      </div>

      {notice && <div className="form-note feedback-admin-notice" role="status">{notice}</div>}
      {error && <div className="error-note feedback-admin-error" role="alert">{error}</div>}

      {editorOpen && (
        <section className="card owner-pay-card feedback-admin-form-card" ref={editorRef} data-testid="feedback-editor">
          <div className="pay-section-title">
            <div>
              <span className="metric-kicker">{editingEntry ? "Update entry" : "New showcase entry"}</span>
              <h2>{editingEntry ? "Edit feedback" : "Add New Feedback"}</h2>
              <p>Add the channel name, YouTube link, display title, and screenshots. The first image is used as the card cover.</p>
            </div>
            <button className="icon-button" type="button" onClick={clearDraft} disabled={busy} aria-label="Close feedback form" data-testid="button-close-feedback-form">
              <X size={16} />
            </button>
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
                <span>Channel link</span>
                <input required type="url" maxLength={500} value={channelUrl} onChange={(event) => setChannelUrl(event.target.value)} placeholder="https://www.youtube.com/@channel" data-testid="input-feedback-channel-url" />
              </label>
              <div className="field feedback-admin-field-wide">
                <span>Channel screenshots</span>
                <div className="feedback-admin-image-picker">
                  <input
                    ref={imageInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => { chooseImages(event.target.files); event.currentTarget.value = ""; }}
                    aria-label="Choose channel feedback images"
                    data-testid="input-feedback-images"
                  />
                  <div className="feedback-admin-image-copy">
                    <strong>{storedImages.length + pendingImages.length} of {maxImages} images selected</strong>
                    <small>JPG, PNG, or WebP · up to 5 MB each</small>
                  </div>
                </div>
                {orderedImageChoices.length > 0 && (
                  <div className="feedback-admin-image-grid">
                    {orderedImageChoices.map((image, index) => (
                      <div className="feedback-admin-image-choice" key={image.id}>
                        <img src={image.url} alt={`Feedback screenshot ${index + 1}`} />
                        {index === 0 ? (
                          <span className="feedback-admin-cover-badge"><Check size={11} /> Cover</span>
                        ) : (
                          <button className="feedback-admin-make-cover" type="button" onClick={() => setCoverId(image.id)} data-testid={`button-feedback-cover-${index}`}>
                            Make cover
                          </button>
                        )}
                        <button className="feedback-admin-remove-image" type="button" onClick={() => removeImage(image.id)} aria-label={`Remove feedback image ${index + 1}`} data-testid={`button-remove-feedback-image-${index}`}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className={`feedback-admin-pin-option${pinnedCount >= maxPinned && !pinned ? " is-disabled" : ""}`}>
                <input type="checkbox" checked={pinned} disabled={pinnedCount >= maxPinned && !pinned} onChange={(event) => setPinned(event.target.checked)} data-testid="checkbox-feedback-pinned" />
                <span><strong>Pin to homepage</strong><small>{pinned ? "This channel will appear in the homepage feedback row." : `${maxPinned - pinnedCount} homepage ${maxPinned - pinnedCount === 1 ? "spot" : "spots"} available.`}</small></span>
              </label>
            </div>
            <div className="feedback-admin-form-foot">
              <p>Up to four pinned channels appear on the homepage. All saved entries remain on the feedback page.</p>
              <div>
                <button className="button secondary" type="button" onClick={clearDraft} disabled={busy} data-testid="button-cancel-feedback">
                  Cancel
                </button>
                <button className="button" type="submit" disabled={busy || storedImages.length + pendingImages.length === 0} data-testid="button-save-feedback">
                  {busy ? <LoaderCircle size={15} className="feedback-admin-spin" /> : <Upload size={15} />}
                  {busy ? "Saving feedback…" : editingEntry ? "Save Changes" : "Add New Feedback"}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className="card owner-pay-card feedback-admin-list-card">
        <div className="pay-section-title">
          <div>
            <span className="metric-kicker">Published records</span>
            <h2>Feedback entries</h2>
            <p>All saved entries appear here. Pinned entries show first and are featured on the homepage.</p>
          </div>
          <div className="feedback-admin-list-controls">
            <span className="feedback-admin-count">{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
            <button className="button secondary small" type="button" onClick={() => void feedbackQuery.refetch()} disabled={feedbackQuery.isFetching} data-testid="button-refresh-feedback">
              <RefreshCw size={14} className={feedbackQuery.isFetching ? "feedback-admin-spin" : ""} /> Refresh
            </button>
          </div>
        </div>
        {feedbackQuery.isLoading ? (
          <div className="feedback-admin-empty" role="status">Loading feedback entries…</div>
        ) : feedbackQuery.isError ? (
          <div className="feedback-admin-empty feedback-admin-load-error" role="alert">
            <strong>Feedback entries could not be loaded.</strong>
            <button className="button secondary small" type="button" onClick={() => void feedbackQuery.refetch()}>Try again</button>
          </div>
        ) : entries.length === 0 ? (
          <div className="feedback-admin-empty"><ImagePlus size={23} /><strong>No feedback entries yet</strong><span>Add the first creator channel. Pin up to four entries to show them on the homepage.</span></div>
        ) : (
          <div className="feedback-admin-list">
            {entries.map((entry) => <article className="feedback-admin-item" key={entry.id} data-testid={`owner-feedback-${entry.id}`}>
              <img className="feedback-admin-thumb" src={entry.imageUrl} alt={`Feedback image for ${entry.channelName}`} loading="lazy" />
              <div className="feedback-admin-item-copy">
                <strong>{entry.title}</strong>
                <span>{entry.channelName}</span>
                <small>Added {formatDate(entry.createdAt)}{entry.pinned ? " · Pinned on homepage" : ""}</small>
              </div>
              <div className="feedback-admin-item-actions">
                <button className="button secondary small" type="button" onClick={() => beginEdit(entry)} disabled={busy} data-testid={`button-edit-feedback-${entry.id}`}>
                  <Pencil size={13} /> Edit
                </button>
                <button className={`button secondary small feedback-admin-pin-button${entry.pinned ? " is-pinned" : ""}`} type="button" onClick={() => void setEntryPinned(entry, !entry.pinned)} disabled={busy || (!entry.pinned && pinnedCount >= maxPinned)} aria-label={entry.pinned ? `Unpin ${entry.channelName} from homepage` : `Pin ${entry.channelName} to homepage`} data-testid={`button-pin-feedback-${entry.id}`}>
                  <Pin size={13} /> {entry.pinned ? "Pinned" : "Pin"}
                </button>
                <a className="button secondary small feedback-admin-link" href={entry.channelUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${entry.channelName} channel`} data-testid={`link-feedback-channel-${entry.id}`}>
                  View <ExternalLink size={13} />
                </a>
                <button className="icon-button feedback-admin-delete" type="button" onClick={() => void remove(entry)} disabled={busy} aria-label={`Delete feedback for ${entry.channelName}`} title="Delete feedback" data-testid={`button-delete-feedback-${entry.id}`}>
                  <Trash2 size={15} />
                </button>
              </div>
            </article>)}
          </div>
        )}
      </section>
    </main>
  );
}