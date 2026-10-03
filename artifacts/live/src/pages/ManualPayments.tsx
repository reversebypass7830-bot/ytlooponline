import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, Check, CheckCircle2, ChevronUp, CircleDollarSign, Copy,
  Download, FileText, Filter, ImagePlus, LoaderCircle, Minus, RefreshCw, Save,
  ShieldCheck, Smartphone, Upload, X, XCircle, Plus,
} from "lucide-react";
import {
  getGetOwnerPaymentSettingsQueryKey, getListAccountPaymentRequestsQueryKey,
  getListBillingPlansQueryKey, getListOwnerPaymentRequestsQueryKey,
  useCreateAccountPaymentProofUploadUrl, useCreateAccountPaymentRequest,
  useCreateOwnerPaymentQrUploadUrl, useGetOwnerPaymentSettings,
  useListAccountPaymentRequests, useListBillingPlans, useListOwnerPaymentRequests,
  useQuoteAccountPayment, useReviewOwnerPaymentRequest, useUpdateBillingPlan,
  useUpdateOwnerPaymentSettings,
} from "@workspace/api-client-react";
import type {
  AccountPaymentQuote, AccountPaymentQuoteInputPackType, BillingPlan, BillingPlanUpdate,
  PaymentRequest,
} from "@workspace/api-client-react";
import streamsArt from "@assets/image_1790995151848.png";
import downloadsArt from "@assets/image_1790995164239.png";
import durationArt from "@assets/image_1790995177450.png";
import qrArt from "@assets/image_1790995187836.png";

type Account = {
  id: string; email: string; displayName: string; licenseKey: string; streamLimit: number;
  activePlan: { name: string } | null; activePlanId: string; active: boolean; accessEndsAt: string;
  streamsPerDay: number; streamsStartedToday: number; downloadsUsedToday?: number; downloadsPerDay?: number;
  history: Array<{ id: string; type: "purchase" | "grant" | string; message: string; at: string; planId?: string; days?: number; streamLimit?: number; streamsPerDay?: number; downloadsPerDay?: number; amountPaise?: number; utr?: string }>;
};

const money = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorText = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;
const customSubscriptionPlan = (plans: BillingPlan[]) => {
  const eligible = plans.filter((plan) => !plan.isTrial);
  const explicit = eligible.find((plan) => `${plan.id} ${plan.name} ${plan.description}`.toLowerCase().includes("custom"));
  return explicit ?? (eligible.length === 1 ? eligible[0] : undefined);
};
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type ImageMime = typeof allowedImageTypes[number];

async function uploadImage(file: File, getUrl: (data: { contentType: ImageMime; size: number }) => Promise<{ uploadURL: string; objectPath: string }>) {
  if (!allowedImageTypes.includes(file.type as ImageMime)) throw new Error("Choose a PNG, JPG, or WebP image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller.");
  const signed = await getUrl({ contentType: file.type as ImageMime, size: file.size });
  const response = await fetch(signed.uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!response.ok) throw new Error("Image upload failed. Please try again.");
  return signed.objectPath;
}

export function ManualSubscriptionPage({ account, onRefresh }: { account: Account; onRefresh?: () => void }) {
  const queryClient = useQueryClient();
  const plansQuery = useListBillingPlans();
  const requestsQuery = useListAccountPaymentRequests({ query: { queryKey: getListAccountPaymentRequestsQueryKey(), refetchInterval: 20000 } });
  const quoteMutation = useQuoteAccountPayment();
  const createRequest = useCreateAccountPaymentRequest();
  const createProofUrl = useCreateAccountPaymentProofUploadUrl();
  const [packType, setPackType] = useState<AccountPaymentQuoteInputPackType>("Days");
  const [durationDays, setDurationDays] = useState(1);
  const [streams, setStreams] = useState(5);
  const [downloads, setDownloads] = useState(20);
  const [quote, setQuote] = useState<AccountPaymentQuote | null>(null);
  const [step, setStep] = useState<"configure" | "payment" | "pending">("configure");
  const [utr, setUtr] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [historyType, setHistoryType] = useState<"all" | "purchase" | "grant">("all");
  const [range, setRange] = useState("all");
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;
  const refreshedApproval = useRef("");
  const plan = customSubscriptionPlan(plansQuery.data?.plans.filter((item) => item.active) ?? []);
  const requests = requestsQuery.data?.requests ?? [];

  useEffect(() => {
    const approval = requests.find((request) => request.status === "approved" && refreshedApproval.current !== request.id);
    if (approval) {
      refreshedApproval.current = approval.id;
      void refreshRef.current?.();
    }
  }, [requests]);
  const history = useMemo(() => {
    const items = account.history.filter((item) => item.type === "purchase" || item.type === "grant").map((item) => ({ ...item }));
    for (const approved of requests.filter((request) => request.status === "approved")) {
      const match = items.find((item) => item.type === "purchase" && item.planId === approved.planId && Math.abs(new Date(item.at).getTime() - new Date(approved.createdAt).getTime()) < 3 * 86400000);
      if (match) { match.amountPaise ??= approved.amountPaise; match.utr ??= approved.utr; }
      else items.unshift({ id: approved.id, type: "purchase", message: `${approved.planName} approved`, at: approved.reviewedAt || approved.createdAt, planId: approved.planId, days: approved.durationDays, streamLimit: approved.streamLimit, streamsPerDay: approved.streamsPerDay, downloadsPerDay: approved.downloadsPerDay, amountPaise: approved.amountPaise, utr: approved.utr });
    }
    return items;
  }, [account.history, requests]);
  const filteredHistory = history.filter((item) => {
    const text = `${item.message} ${item.planId ?? ""} ${item.id} ${item.utr ?? ""}`.toLowerCase();
    const inRange = range === "all" || Date.now() - new Date(item.at).getTime() <= Number(range) * 86400000;
    return (historyType === "all" || item.type === historyType) && (!search.trim() || `${text} ${item.amountPaise ? money(item.amountPaise) : ""}`.toLowerCase().includes(search.trim().toLowerCase())) && inRange;
  });
  const reset = () => { setQuote(null); setStep("configure"); setUtr(""); setProofFile(null); setError(""); };
  const changePack = (next: AccountPaymentQuoteInputPackType) => {
    setPackType(next);
    setDurationDays(next === "Days" ? Math.min(durationDays, 30) : next === "Monthly" ? 30 : 365);
    reset();
  };
  const setDayCount = (value: number) => {
    if (value > 30) {
      setPackType("Monthly"); setDurationDays(30); reset();
      setNotice("30+ days is available in Monthly plan");
      return;
    }
    setDurationDays(Math.min(30, Math.max(1, value || 1))); setQuote(null);
  };
  const requestQuote = async () => {
    if (!plan) return;
    setError(""); setNotice("");
    try {
      const quoteResult = await quoteMutation.mutateAsync({ data: {
        planId: plan.id, packType, durationDays: packType === "Days" ? durationDays : packType === "Monthly" ? 30 : 365,
        streamsPerDay: streams, downloadsPerDay: downloads,
      } });
      setQuote(quoteResult); setStep("payment");
    } catch (reason) { setError(errorText(reason, "Could not calculate the price. Please try again.")); }
  };
  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quote || !/^[A-Za-z0-9]{6,32}$/.test(utr.trim())) return;
    setError(""); setNotice("");
    try {
      const screenshotPath = proofFile ? await uploadImage(proofFile, async (data) => {
        const signed = await createProofUrl.mutateAsync({ data });
        return { uploadURL: signed.uploadURL, objectPath: signed.objectPath };
      }) : undefined;
      const created = await createRequest.mutateAsync({ data: {
        planId: quote.planId, packType: quote.packType, durationDays: quote.durationDays,
        streamsPerDay: quote.streamsPerDay, downloadsPerDay: quote.downloadsPerDay,
        utr: utr.trim(), ...(screenshotPath ? { screenshotPath } : {}),
      } });
      await queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() });
      setNotice(`Payment submitted. Request ${created.request.id.slice(0, 8)} is waiting for owner review.`);
      setStep("pending"); setUtr(""); setProofFile(null); onRefresh?.();
    } catch (reason) { setError(errorText(reason, "Could not submit this payment for review.")); }
  };
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setNotice("Copied to clipboard."); } catch { setNotice("Select and copy the value manually."); } };
  const makeInvoice = (item: Account["history"][number]) => {
    const text = ["LIVE CONTROL ROOM · PURCHASE RECORD", `Reference: ${item.id}`, `Date: ${new Date(item.at).toLocaleString()}`, `Account: ${account.displayName || account.email}`, `Email: ${account.email}`, `Plan: ${item.planId || item.message}`, `Duration: ${item.days || 0} days`, item.streamsPerDay ? `Broadcast starts per day: ${item.streamsPerDay}` : "", item.streamLimit ? `Concurrent broadcast cap: ${item.streamLimit}` : "", item.downloadsPerDay ? `Downloads per day: ${item.downloadsPerDay}` : "", item.amountPaise ? `Approved amount: ${money(item.amountPaise)}` : "", item.utr ? `UPI reference: ${item.utr}` : ""].filter(Boolean).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `lcr-invoice-${item.id}.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  const pending = requests.filter((request) => request.status === "pending");
  if (plansQuery.isLoading) return <div className="page subscription-page"><div className="pay-skeleton"/><div className="pay-skeleton"/></div>;
  if (plansQuery.isError) return <div className="page subscription-page"><div className="pay-alert error" role="alert"><XCircle size={18}/><span>Pricing could not be loaded. {errorText(plansQuery.error, "Try again.")}</span><button className="button secondary small" onClick={() => void plansQuery.refetch()} data-testid="button-retry-plans">Retry</button></div></div>;

  return <div className="page subscription-page manual-payment-page">
    <header className="page-head subscription-heading">
      <div><p className="eyebrow">Workspace / Access</p><h1>Subscription</h1><p className="subtle">Set daily broadcast starts and download allowance. Every payment is checked by your workspace owner.</p></div>
      <div className={`subscription-status ${account.active ? "active" : "expired"}`} data-testid="status-current-access"><span className="status-dot"/>{account.active ? `${account.activePlan?.name || "Plan"} · active` : "Access needs renewal"}</div>
    </header>
    {notice && <div className="pay-alert success" role="status" data-testid="status-payment-notice"><CheckCircle2 size={17}/><span>{notice}</span><button className="pay-alert-close" onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-payment-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <section className="pay-access-strip card">
      <div><span className="metric-kicker">Current access</span><strong>{account.activePlan?.name || "No active plan"}</strong><small>{account.active ? `Valid until ${new Date(account.accessEndsAt).toLocaleDateString()}` : "Choose a pack to continue broadcasting."}</small><small>Broadcast starts today: {Math.min(account.streamsStartedToday, account.streamsPerDay)} / {account.streamsPerDay}</small></div>
      <div><span className="metric-kicker">Concurrent broadcast cap</span><strong>{account.streamLimit}</strong><small>Separate from daily stream starts</small></div>
      <div><span className="metric-kicker">Workspace key</span><strong className="mono">{account.licenseKey}</strong><small>Your existing key stays unchanged</small></div>
      <div className="pay-usage"><span className="metric-kicker">Downloads today</span><strong>{typeof account.downloadsUsedToday === "number" && typeof account.downloadsPerDay === "number" ? `${account.downloadsUsedToday.toLocaleString("en-IN")} / ${account.downloadsPerDay.toLocaleString("en-IN")}` : "Usage not reported"}</strong><small>Daily allowance is enforced server-side</small></div>
    </section>

    {step === "pending" ? <section className="card pay-pending-state" data-testid="status-pending-review">
      <span className="pending-dot"/><h2>Waiting for owner approval</h2><p>Your payment request is in the review queue. Access and allowance change only after it is approved.</p>
      <button className="button pay-quote-button" type="button" onClick={reset}>Start another request</button>
    </section> : step === "payment" && quote ? <section className="pay-checkout card">
      <button type="button" className="pay-back-link pay-back-button" onClick={() => setStep("configure")} data-testid="button-back-to-pack"><ArrowLeft size={18}/> Back to pack</button>
      <div className="pay-checkout-grid">
        <div className="pay-checkout-summary">
          <span className="metric-kicker">Your selection</span><h2>Review & pay</h2>
          <div className="pay-total-panel"><small>Total to pay</small><strong>{money(quote.amountPaise)}</strong><span>{quote.packType} · {quote.durationDays} days</span></div>
          <dl className="pay-breakdown">
            <div><dt>Broadcast starts each IST day</dt><dd>{quote.streamsPerDay}</dd></div>
            <div><dt>Downloads each day</dt><dd>{quote.downloadsPerDay.toLocaleString("en-IN")}</dd></div>
            <div><dt>Total download allowance</dt><dd>{quote.totalDownloads.toLocaleString("en-IN")}</dd></div>
            <div><dt>Existing concurrent broadcast cap</dt><dd>{quote.streamLimit}</dd></div>
          </dl>
        </div>
        <div className="pay-qr-side">
          <img className="pay-clay-small" src={qrArt} alt="" />
          <div className="pay-qr-frame">
            {quote.qrImageUrl ? <img src={quote.qrImageUrl} alt="Owner's UPI payment QR code" /> : <QRCodeSVG value={`upi://pay?${new URLSearchParams({ pa: quote.upiId, pn: quote.payeeName, am: quote.amountRupees.toFixed(2), cu: "INR", tn: `LCR ${quote.planName}` })}`} size={188} level="M" includeMargin bgColor="#ffffff" fgColor="#17191d"/>}
          </div>
          <strong className="pay-scan-heading">Please pay {money(quote.amountPaise)}</strong><span className="pay-scan-copy">Scan the QR with your UPI app. Confirm the payee and amount before sending.</span>
          <div className="payee-details"><span>Payee</span><strong>{quote.payeeName}</strong><span>UPI ID</span><div><strong className="mono">{quote.upiId}</strong><button type="button" className="icon-button" aria-label="Copy UPI ID" onClick={() => void copy(quote.upiId)} data-testid="button-copy-upi"><Copy size={14}/></button></div></div>
          <form onSubmit={(event) => void submitPayment(event)} className="pay-utr-form">
            <label htmlFor="utr-input">Enter your UTR number</label>
            <input id="utr-input" data-testid="input-payment-utr" value={utr} onChange={(event) => setUtr(event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 32))} placeholder="6–32 character bank reference" minLength={6} maxLength={32} required pattern="[A-Za-z0-9]{6,32}" autoComplete="off" />
            <small>Found in your UPI payment receipt. Letters and numbers only.</small>
            <label className="proof-upload" htmlFor="proof-file"><Upload size={16}/><span>{proofFile ? proofFile.name : "Upload payment screenshot"} <small>Optional · PNG, JPG or WebP, up to 5 MB</small></span><input id="proof-file" data-testid="input-payment-proof" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event: ChangeEvent<HTMLInputElement>) => setProofFile(event.target.files?.[0] ?? null)}/></label>
            <button className="button pay-quote-button" type="submit" disabled={createRequest.isPending || createProofUrl.isPending || !/^[A-Za-z0-9]{6,32}$/.test(utr.trim())} data-testid="button-submit-payment">
              {createRequest.isPending || createProofUrl.isPending ? "Submitting for review…" : "Verify your payment"}{createRequest.isPending || createProofUrl.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <Check size={16}/>}
            </button>
          </form>
        </div>
      </div>
    </section> : <section className="card pay-config pay-pack-card">
      <div className="pay-pack-top">
        <div><span className="metric-kicker">Broadcast subscription</span><h2>Select your pack</h2><p>Choose daily starts, download volume and time. Starts are counted per IST day, not as simultaneous broadcasts.</p></div>
        <div className="pay-pack-switch" role="tablist" aria-label="Pack duration">
          {(["Days", "Monthly", "Yearly"] as const).map((kind) => <button type="button" key={kind} role="tab" aria-selected={packType === kind} className={packType === kind ? "selected" : ""} onClick={() => changePack(kind)} data-testid={`tab-pack-${kind.toLowerCase()}`}>{kind}</button>)}
        </div>
      </div>
      {!plan ? <div className="pay-empty"><CircleDollarSign size={25}/><strong>No custom subscription is available</strong><span>Ask your workspace owner to enable pricing.</span></div> : <>
        <div className="pay-feature-ribbon">
          <div className="pay-feature"><img src={streamsArt} alt="" /><span><strong>Server-side live</strong><small>Continuous broadcast setup</small></span></div>
          <div className="pay-feature"><img src={downloadsArt} alt="" /><span><strong>Bulk downloads</strong><small>Daily allowance included</small></span></div>
          <div className="pay-feature"><img src={durationArt} alt="" /><span><strong>Flexible duration</strong><small>Access for your schedule</small></span></div>
        </div>
        <div className="pay-included-features" aria-label="Included features">
          {(plan.features.length ? plan.features : ["Stream as live", "Premium quality", "20GB storage"]).map((feature) => <span key={feature}><Check size={13}/>{feature}</span>)}
        </div>
        <div className="pay-config-controls">
          <section className="pay-control-block">
            <div className="pay-control-label"><img src={streamsArt} alt="" /><div><strong>How many streams per day?</strong><small>Each is a broadcast start during an IST day.</small></div></div>
            <div className="pay-stepper pay-stream-counter"><button type="button" aria-label="Decrease streams per day" onClick={() => setStreams((value) => Math.max(1, value - 1))} disabled={streams <= 1} data-testid="button-streams-decrease"><Minus size={16}/></button><strong data-testid="text-streams-per-day">{streams}</strong><button type="button" aria-label="Increase streams per day" onClick={() => setStreams((value) => Math.min(100, value + 1))} disabled={streams >= 100} data-testid="button-streams-increase"><Plus size={16}/></button></div>
            <div className="pay-quick-choices" aria-label="Quick stream quantities">{[1, 5, 10, 20].map((count) => <button key={count} type="button" className={streams === count ? "active" : ""} onClick={() => setStreams(count)} data-testid={`button-streams-${count}`}>{count}</button>)}</div>
          </section>
          <section className="pay-control-block">
            <div className="pay-control-label"><img src={downloadsArt} alt="" /><div><strong>YouTube bulk downloads</strong><small>How many videos to allow each day?</small></div></div>
            <div className="pay-download-options">{[10, 20, 30, 40, 50].map((count) => <button type="button" key={count} className={downloads === count ? "active" : ""} onClick={() => setDownloads(count)} data-testid={`button-downloads-${count}`}>{count}</button>)}</div>
            <label className="pay-custom-download"><span>Custom amount</span><input type="number" min="1" max="1000000" value={downloads} onChange={(event) => setDownloads(Math.min(1000000, Math.max(1, Number(event.target.value) || 1)))} data-testid="input-downloads-per-day"/></label>
          </section>
          <section className="pay-control-block">
            <div className="pay-control-label"><img src={durationArt} alt="" /><div><strong>Duration</strong><small>{packType === "Days" ? "Choose from 1 to 30 days." : `${packType === "Monthly" ? "Monthly" : "Yearly"} pack duration.`}</small></div></div>
            {packType === "Days" ? <>
              <div className="pay-duration-entry"><input aria-label="Duration in days" type="number" min="1" max="30" value={durationDays} onChange={(event) => setDayCount(Number(event.target.value))} data-testid="input-duration-days"/><span>days</span><b className="duration-badge">{durationDays} days</b></div>
              <input className="pay-duration-slider" type="range" min="1" max="30" value={durationDays} aria-label="Select duration from 1 to 30 days" onChange={(event) => setDayCount(Number(event.target.value))} data-testid="slider-duration-days"/>
              <div className="pay-duration-ticks"><span>1 day</span><span>30 days</span></div>
            </> : <div className="pay-duration-fixed"><strong>{packType === "Monthly" ? "30" : "365"} days</strong><span>One {packType.toLowerCase()} pack</span></div>}
          </section>
        </div>
        <div className="pay-live-total">
          <div><span>Estimated total</span><strong data-testid="text-live-total">{money(((streams * plan.pricePerStreamDayPaise) + (downloads * plan.pricePerDownloadPaise)) * (packType === "Days" ? durationDays : packType === "Monthly" ? 30 : 365))}</strong></div>
          <small>{streams} starts × {money(plan.pricePerStreamDayPaise)} + {downloads.toLocaleString("en-IN")} downloads × {money(plan.pricePerDownloadPaise)}, per day<br/>multiplied by {(packType === "Days" ? durationDays : packType === "Monthly" ? 30 : 365)} days. Final amount is confirmed by the server.</small>
        </div>
        <button className="button pay-quote-button" type="button" onClick={() => void requestQuote()} disabled={quoteMutation.isPending} data-testid="button-confirm-purchase"><span>{quoteMutation.isPending ? "Calculating your total…" : "Confirm to purchase"}</span>{quoteMutation.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/>}</button>
      </>}
      <div className="pay-trust-note"><ShieldCheck size={15}/><span>Your concurrent broadcast cap is separate and is not changed by this purchase. Access updates only after owner approval.</span></div>
    </section>}

    <section className="card pay-request-history">
      <div className="pay-section-title"><div><span className="metric-kicker">Review tracking</span><h2>Payment requests</h2><p>Submitted references stay pending until an owner explicitly approves them.</p></div><button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching} data-testid="button-refresh-account-requests"><RefreshCw size={13} className={requestsQuery.isFetching ? "pay-spin" : ""}/> Refresh</button></div>
      {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={21}/><strong>Requests unavailable</strong><button className="button secondary small" onClick={() => void requestsQuery.refetch()}>Try again</button></div> : requests.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No payment requests yet</strong><span>Your UTR and optional screenshot appear here after submission.</span></div> : <div className="pay-request-list">{requests.map((request) => <div className="pay-request-row" key={request.id} data-testid={`row-account-payment-${request.id}`}><div className={`pay-status-mark ${request.status}`}><StatusGlyph status={request.status}/></div><div className="pay-request-main"><strong>{request.planName} · {money(request.amountPaise)}</strong><span>{request.packType} · {request.durationDays} days · {request.streamsPerDay} starts/day · {request.downloadsPerDay.toLocaleString("en-IN")} downloads/day · UTR <b className="mono">{request.utr}</b></span><small>{new Date(request.createdAt).toLocaleString()}</small>{request.reviewNote && <p className="pay-review-note">{request.reviewNote}</p>}</div><span className={`pay-status-tag ${request.status}`}>{request.status === "pending" ? "Pending review" : request.status}</span></div>)}</div>}
    </section>
    <section className="card pay-request-history">
      <div className="pay-section-title"><div><span className="metric-kicker">Account record</span><h2>Purchase & grant history</h2><p>Approved purchases and owner-granted access remain available for your records.</p></div><span className="pay-history-count">{filteredHistory.length} / {history.length}</span></div>
      <div className="pay-history-toolbar"><label><Filter size={14}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plan, invoice or UTR" data-testid="input-history-search"/></label><select value={historyType} onChange={(event) => setHistoryType(event.target.value as typeof historyType)} aria-label="Filter transaction type" data-testid="select-history-type"><option value="all">All records</option><option value="purchase">Purchases</option><option value="grant">Owner grants</option></select><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date" data-testid="select-history-date"><option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option></select></div>
      {!history.length ? <div className="pay-empty"><FileText size={23}/><strong>No completed purchases yet</strong><span>Approved payment history and owner grants appear here.</span></div> : !filteredHistory.length ? <div className="pay-empty"><Filter size={22}/><strong>No matching records</strong><button className="button secondary small" onClick={() => { setSearch(""); setHistoryType("all"); setRange("all"); }}>Clear filters</button></div> : <div className="pay-history-list">{filteredHistory.map((item) => <div className="pay-history-row" key={item.id} data-testid={`row-history-${item.id}`}><div><strong>{item.message}</strong><span>{item.days || 0} days{item.streamsPerDay ? ` · ${item.streamsPerDay} starts/day` : ""}{item.streamLimit ? ` · ${item.streamLimit} concurrent cap` : ""}{item.downloadsPerDay ? ` · ${item.downloadsPerDay} downloads/day` : ""}{item.amountPaise ? ` · ${money(item.amountPaise)}` : ""}{item.utr ? ` · UTR ${item.utr}` : ""}</span><small>{new Date(item.at).toLocaleString()} · Ref {item.id.slice(0, 8)}</small></div><button className="button secondary small" onClick={() => makeInvoice(item)} data-testid={`button-invoice-${item.id}`}><FileText size={13}/> Invoice</button></div>)}</div>}
    </section>
  </div>;
}

function StatusGlyph({ status }: { status: PaymentRequest["status"] }) {
  return status === "approved" ? <CheckCircle2 size={17}/> : status === "rejected" ? <XCircle size={17}/> : <LoaderCircle size={17}/>;
}

type PlanDraft = { name: string; description: string; pricePerStreamDayRupees: string; pricePerDownloadRupees: string; downloadsPerDay: string; features: string; active: boolean };
const toDraft = (plan: BillingPlan): PlanDraft => ({ name: plan.name, description: plan.description, pricePerStreamDayRupees: String(plan.pricePerStreamDayPaise / 100), pricePerDownloadRupees: String(plan.pricePerDownloadPaise / 100), downloadsPerDay: String(plan.downloadsPerDay), features: plan.features.join("\n"), active: plan.active });

export function OwnerPaymentPanel({ ownerPassword }: { ownerPassword: string }) {
  const queryClient = useQueryClient();
  const requestOpts = { headers: { "X-Owner-Password": ownerPassword } };
  const plansQuery = useListBillingPlans({ request: requestOpts });
  const settingsQuery = useGetOwnerPaymentSettings({ request: requestOpts });
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const requestsQuery = useListOwnerPaymentRequests(status ? { status } : {}, { request: requestOpts });
  const updatePlan = useUpdateBillingPlan({ request: requestOpts });
  const updateSettings = useUpdateOwnerPaymentSettings({ request: requestOpts });
  const createQrUrl = useCreateOwnerPaymentQrUploadUrl({ request: requestOpts });
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [qrPath, setQrPath] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const requests = requestsQuery.data?.requests ?? [];
  const activePlan = customSubscriptionPlan(plansQuery.data?.plans ?? []) ?? null;
  const currentDraft = draft ?? (activePlan ? toDraft(activePlan) : null);
  const initialized = useRef(false);
  useEffect(() => {
    if (settingsQuery.data && !initialized.current) {
      initialized.current = true; setUpiId(settingsQuery.data.upiId); setPayeeName(settingsQuery.data.payeeName);
      setQrPath(settingsQuery.data.qrImagePath); setQrPreview(settingsQuery.data.qrImageUrl);
    }
  }, [settingsQuery.data]);
  const refreshOwnerLists = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: getListBillingPlansQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetOwnerPaymentSettingsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListOwnerPaymentRequestsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() }),
  ]);
  const parsePlan = (value: PlanDraft): BillingPlanUpdate => ({
    name: value.name.trim(), description: value.description.trim(), durationDays: 1,
    price: `₹${(Number(value.pricePerStreamDayRupees) || 0).toFixed(2)} / stream start / day`,
    pricePerStreamDayPaise: Math.max(0, Math.round((Number(value.pricePerStreamDayRupees) || 0) * 100)),
    pricePerDownloadPaise: Math.max(0, Math.round((Number(value.pricePerDownloadRupees) || 0) * 100)),
    downloadsPerDay: Math.max(1, Number(value.downloadsPerDay) || 1),
    features: value.features.split("\n").map((feature) => feature.trim()).filter(Boolean).slice(0, 30), active: value.active,
  });
  const persistPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!activePlan || !currentDraft) return;
    setError(""); setFeedback("");
    try {
      await updatePlan.mutateAsync({ planId: activePlan.id, data: parsePlan(currentDraft) });
      setFeedback("Custom subscription pricing saved."); setDraft(null); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save pricing.")); }
  };
  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    try {
      await updateSettings.mutateAsync({ data: { upiId: upiId.trim(), payeeName: payeeName.trim(), qrImagePath: qrPath } });
      setFeedback("UPI destination and QR saved."); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save payment details.")); }
  };
  const changeQr = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setError(""); setFeedback("");
    try {
      const path = await uploadImage(file, async (data) => {
        const signed = await createQrUrl.mutateAsync({ data });
        return { uploadURL: signed.uploadURL, objectPath: signed.objectPath };
      });
      setQrPath(path); setQrPreview(URL.createObjectURL(file)); setFeedback("QR image uploaded. Save payment details to publish it to checkout.");
    } catch (reason) { setError(errorText(reason, "Could not upload the QR image.")); }
    event.target.value = "";
  };
  const review = async (requestId: string, action: "approve" | "reject") => {
    setError(""); setFeedback("");
    try {
      await reviewRequest.mutateAsync({ requestId, data: { action, note: reviewNotes[requestId]?.trim() || undefined } });
      setFeedback(action === "approve" ? "Payment approved. Account access has been updated." : "Payment request rejected.");
      setReviewNotes((previous) => ({ ...previous, [requestId]: "" })); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not review this payment request.")); }
  };
  const reviewRequest = useReviewOwnerPaymentRequest({ request: requestOpts });
  const changeDraft = (key: keyof PlanDraft, value: string | boolean) => setDraft((old) => ({ ...(old ?? (activePlan ? toDraft(activePlan) : { name: "", description: "", pricePerStreamDayRupees: "0", pricePerDownloadRupees: "0", downloadsPerDay: "1", features: "", active: true })), [key]: value }));
  return <main className="owner-content owner-payment-content">
    <div className="page-head owner-page-heading"><div><p className="eyebrow">Commerce / Manual UPI</p><h1>Payments</h1><p className="subtle">Set your custom-subscription rates, publish a UPI QR, and review customer payments.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Owner review</div></div>
    {feedback && <div className="pay-alert success" role="status" data-testid="status-owner-feedback"><CheckCircle2 size={17}/><span>{feedback}</span><button className="pay-alert-close" onClick={() => setFeedback("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-owner-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <div className="owner-payment-columns">
      <section className="card owner-pay-card">
        <div className="pay-section-title"><div><span className="metric-kicker">Custom subscription</span><h2>Daily pricing</h2><p>Rates are multiplied by each pack's duration and per-day allowance.</p></div><span className="pay-icon"><CircleDollarSign size={19}/></span></div>
        {plansQuery.isLoading ? <div className="pay-loading-line"/> : plansQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load pricing</strong><button className="button secondary small" onClick={() => void plansQuery.refetch()}>Retry</button></div> : !activePlan || !currentDraft ? <div className="pay-empty"><CircleDollarSign size={24}/><strong>Custom subscription plan missing</strong><span>Create or enable the custom-subscription billing plan in the owner configuration.</span></div> : <form className="owner-plan-editor owner-custom-pricing" onSubmit={(event) => void persistPlan(event)}>
          <div className="owner-plan-editor-head"><div><span className="metric-kicker">One shared pricing plan</span><strong>{currentDraft.name || activePlan.name}</strong></div><label className="pay-active-toggle"><input type="checkbox" checked={currentDraft.active} onChange={(event) => changeDraft("active", event.target.checked)} data-testid="input-plan-enabled"/><span>{currentDraft.active ? "Enabled" : "Disabled"}</span></label></div>
          <div className="owner-plan-fields">
            <label className="field"><span>Plan name</span><input value={currentDraft.name} onChange={(event) => changeDraft("name", event.target.value)} required data-testid="input-custom-plan-name"/></label>
            <label className="field"><span>Price per stream start / day · ₹</span><input type="number" min="0" step="0.01" value={currentDraft.pricePerStreamDayRupees} onChange={(event) => changeDraft("pricePerStreamDayRupees", event.target.value)} required data-testid="input-price-per-stream"/></label>
            <label className="field"><span>Price per YouTube download · ₹</span><input type="number" min="0" step="0.01" value={currentDraft.pricePerDownloadRupees} onChange={(event) => changeDraft("pricePerDownloadRupees", event.target.value)} required data-testid="input-price-per-download"/></label>
            <label className="field"><span>Default downloads per day</span><input type="number" min="1" step="1" value={currentDraft.downloadsPerDay} onChange={(event) => changeDraft("downloadsPerDay", event.target.value)} data-testid="input-default-downloads"/></label>
            <label className="field full"><span>Description</span><input value={currentDraft.description} onChange={(event) => changeDraft("description", event.target.value)} data-testid="input-plan-description"/></label>
            <label className="field full"><span>Included features · one per line</span><textarea rows={3} value={currentDraft.features} onChange={(event) => changeDraft("features", event.target.value)} data-testid="input-plan-features"/></label>
          </div>
          <div className="owner-plan-editor-foot"><small>Customers see this one custom plan.</small><button className="button small" type="submit" disabled={updatePlan.isPending} data-testid="button-save-pricing"><Save size={13}/>{updatePlan.isPending ? "Saving…" : "Save pricing"}</button></div>
        </form>}
      </section>
      <section className="card owner-pay-card owner-upi-card">
        <div className="pay-section-title"><div><span className="metric-kicker">Payment destination</span><h2>UPI & QR</h2><p>Your saved QR and UPI details appear on the customer payment step.</p></div><span className="pay-icon pay-icon-warm"><Smartphone size={19}/></span></div>
        {settingsQuery.isLoading ? <div className="pay-loading-line"/> : settingsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Payment details unavailable</strong><button className="button secondary small" onClick={() => void settingsQuery.refetch()}>Retry</button></div> : <form className="owner-upi-form" onSubmit={(event) => void saveSettings(event)}>
          <label className="field"><span>UPI ID</span><input required minLength={3} maxLength={100} value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="name@bank" data-testid="input-owner-upi"/></label>
          <label className="field"><span>Payee name</span><input required minLength={1} maxLength={100} value={payeeName} onChange={(event) => setPayeeName(event.target.value)} placeholder="Account holder" data-testid="input-owner-payee"/></label>
          <div className="owner-qr-upload">
            <div className="owner-qr-preview">{qrPreview ? <img src={qrPreview} alt="Current payment QR preview"/> : <img src={qrArt} alt="QR illustration"/>}</div>
            <label className="owner-qr-file"><ImagePlus size={16}/><span>{createQrUrl.isPending ? "Uploading QR…" : qrPath ? "Replace payment QR" : "Upload payment QR"}<small>PNG, JPG or WebP · up to 5 MB</small></span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void changeQr(event)} disabled={createQrUrl.isPending} data-testid="input-owner-qr"/></label>
            {qrPath && <button type="button" className="button secondary small" onClick={() => { setQrPath(null); setQrPreview(null); }} data-testid="button-remove-owner-qr">Remove QR</button>}
          </div>
          <button className="button" type="submit" disabled={updateSettings.isPending || !upiId.trim() || !payeeName.trim()} data-testid="button-save-payment-settings"><Save size={14}/>{updateSettings.isPending ? "Saving…" : "Save payment details"}</button>
          {settingsQuery.data?.updatedAt && <small>Last updated {new Date(settingsQuery.data.updatedAt).toLocaleString()}</small>}
        </form>}
      </section>
    </div>
    <section className="card owner-pay-card owner-review-card"><div className="pay-section-title"><div><span className="metric-kicker">Manual verification</span><h2>Payment review queue</h2><p>Match amount, requested usage, UTR and optional proof before approving.</p></div><button className="button secondary small" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching} data-testid="button-refresh-owner-requests"><RefreshCw size={13} className={requestsQuery.isFetching ? "pay-spin" : ""}/> Refresh</button></div>
      <div className="owner-review-tabs" role="tablist" aria-label="Filter payment requests">{([["pending","Pending"],["approved","Approved"],["rejected","Rejected"],["","All requests"]] as const).map(([value,label]) => <button type="button" role="tab" aria-selected={status === (value || undefined)} key={label} className={status === (value || undefined) ? "active" : ""} onClick={() => setStatus(value || undefined)} data-testid={`tab-owner-${value || "all"}`}>{label}</button>)}</div>
      {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load payment requests</strong><button className="button secondary small" onClick={() => void requestsQuery.refetch()}>Retry</button></div> : requests.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No {status || ""} requests</strong><span>New customer submissions will appear in this queue.</span></div> : <div className="owner-review-list">{requests.map((request) => <OwnerPaymentRequestCard key={request.id} request={request} note={reviewNotes[request.id] ?? ""} onNote={(value) => setReviewNotes((current) => ({ ...current, [request.id]: value }))} onReview={(action) => void review(request.id, action)} busy={reviewRequest.isPending}/>)}</div>}
    </section>
  </main>;
}

function OwnerPaymentRequestCard({ request, note, onNote, onReview, busy }: { request: PaymentRequest; note: string; onNote: (value: string) => void; onReview: (action: "approve" | "reject") => void; busy: boolean }) {
  return <article className="owner-review-item" data-testid={`card-owner-request-${request.id}`}>
    <div className="owner-review-item-main"><div className={`pay-status-mark ${request.status}`}><StatusGlyph status={request.status}/></div><div className="owner-review-identity"><strong>{request.accountName || "Account"}</strong><span>{request.accountEmail}</span><small>{new Date(request.createdAt).toLocaleString()} · {request.id.slice(0, 8)}</small></div><span className={`pay-status-tag ${request.status}`}>{request.status === "pending" ? "Pending review" : request.status}</span></div>
    <div className="owner-review-facts"><div><span>Plan / pack</span><strong>{request.planName} · {request.packType}</strong></div><div><span>Paid amount</span><strong>{money(request.amountPaise)}</strong></div><div><span>Duration</span><strong>{request.durationDays} days</strong></div><div><span>Broadcast starts / day</span><strong>{request.streamsPerDay}</strong></div><div><span>Downloads / day</span><strong>{request.downloadsPerDay.toLocaleString("en-IN")}</strong></div><div><span>Existing concurrent cap</span><strong>{request.streamLimit}</strong></div><div className="owner-utr"><span>UTR / bank reference</span><strong className="mono">{request.utr}</strong></div></div>
    {request.screenshotUrl && <a className="owner-proof-link" href={request.screenshotUrl} target="_blank" rel="noreferrer" data-testid={`link-payment-proof-${request.id}`}><Download size={15}/> View payment proof</a>}
    {request.status === "pending" ? <div className="owner-review-actions"><label className="field"><span>Review note · optional</span><input value={note} maxLength={500} onChange={(event) => onNote(event.target.value)} placeholder="Add a note for the customer" data-testid={`input-review-note-${request.id}`}/></label><div><button className="button secondary small" type="button" onClick={() => onReview("reject")} disabled={busy} data-testid={`button-reject-${request.id}`}><XCircle size={14}/> Reject</button><button className="button small" type="button" onClick={() => onReview("approve")} disabled={busy} data-testid={`button-approve-${request.id}`}><Check size={14}/> Approve & activate</button></div></div> : request.reviewNote && <p className="pay-review-note">Review note: {request.reviewNote}</p>}
  </article>;
}