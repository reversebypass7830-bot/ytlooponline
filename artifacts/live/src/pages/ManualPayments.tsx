import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import "./ManualPayments.css";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft, Check, CheckCircle2, ChevronUp, CircleDollarSign, Copy,
  Download, FileText, Filter, LoaderCircle, Minus, RefreshCw, Save,
  ShieldCheck, Smartphone, Upload, X, XCircle, Plus, Gift,
} from "lucide-react";
import {
  getGetOwnerPaymentSettingsQueryKey, getGetOwnerTrialSettingsQueryKey, getListAccountPaymentRequestsQueryKey,
  getListBillingPlansQueryKey, getListOwnerPaymentRequestsQueryKey,
  useCreateAccountPaymentProofUploadUrl, useCreateAccountPaymentRequest,
  useCreateCashfreeOrder,
  useGetOwnerPaymentSettings, useGetOwnerTrialSettings,
  useListAccountPaymentRequests, useListBillingPlans, useListOwnerPaymentRequests,
  useQuoteAccountPayment, useReviewOwnerPaymentRequest, useUpdateBillingPlan,
  useUpdateOwnerTrialSettings,
  useVerifyCashfreePayment,
  useUpdateOwnerPaymentSettings,
} from "@workspace/api-client-react";
import type {
  AccountPaymentQuote, AccountPaymentQuoteInputPackType, BillingPlan, BillingPlanUpdate,
  CashfreeOrderResponse, PaymentRequest,
} from "@workspace/api-client-react";
import streamsArt from "@assets/image_1790996852489.png";
import downloadsArt from "@assets/image_1790996859856.png";
import durationArt from "@assets/image_1790996866685.png";

type Account = {
  id: string; email: string; displayName: string; streamLimit: number;
  activePlan: { name: string } | null; activePlanId: string; active: boolean; accessEndsAt: string;
  streamsPerDay: number; streamsStartedToday: number; downloadsUsedToday?: number; downloadsPerDay?: number;
  history: Array<{ id: string; type: "purchase" | "grant" | string; message: string; at: string; planId?: string; days?: number; streamLimit?: number; streamsPerDay?: number; downloadsPerDay?: number; amountPaise?: number; utr?: string }>;
};

const money = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorText = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;
const customSubscriptionPlan = (plans: BillingPlan[]) =>
  plans.find((plan) => plan.id === "custom-subscription" && plan.active && !plan.isTrial);
const ownerCustomPricingPlan = (plans: BillingPlan[]) =>
  plans.find((plan) => plan.id === "custom-subscription" && !plan.isTrial);
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type ImageMime = typeof allowedImageTypes[number];
type CashfreeCheckoutResult = { error?: { message?: string } } | void;
type CashfreeClient = {
  checkout(options: { paymentSessionId: string; redirectTarget: "_self" }): Promise<CashfreeCheckoutResult>;
};
type CashfreeWindow = Window & {
  Cashfree?: (options: { mode: "sandbox" | "production" }) => CashfreeClient;
};
let cashfreeSdkPromise: Promise<void> | null = null;

function loadCashfreeSdk(): Promise<void> {
  if ((window as CashfreeWindow).Cashfree) return Promise.resolve();
  if (cashfreeSdkPromise) return cashfreeSdkPromise;
  cashfreeSdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.dataset.cashfreeSdk = "true";
    script.onload = () => (window as CashfreeWindow).Cashfree ? resolve() : reject(new Error("Cashfree checkout could not be initialized."));
    script.onerror = () => reject(new Error("Cashfree checkout could not be loaded. Check your connection and try again."));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    cashfreeSdkPromise = null;
    throw error;
  });
  return cashfreeSdkPromise;
}

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
  const createCashfreeOrder = useCreateCashfreeOrder();
  const verifyCashfreePayment = useVerifyCashfreePayment();
  const createProofUrl = useCreateAccountPaymentProofUploadUrl();
  const [packType, setPackType] = useState<AccountPaymentQuoteInputPackType>("Days");
  const [durationDays, setDurationDays] = useState(1);
  const [streams, setStreams] = useState(5);
  const [downloads, setDownloads] = useState(20);
  const [quote, setQuote] = useState<AccountPaymentQuote | null>(null);
  const [step, setStep] = useState<"select" | "configure" | "payment" | "pending">("select");
  const [utr, setUtr] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [cashfreeReturnOrderId, setCashfreeReturnOrderId] = useState("");
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;
  const refreshedApproval = useRef("");
  const cashfreeAttemptId = useRef("");
  const checkedReturnOrderId = useRef("");
  const plan = customSubscriptionPlan(plansQuery.data?.plans ?? []);
  const requests = requestsQuery.data?.requests ?? [];

  useEffect(() => {
    const approval = requests.find((request) => request.status === "approved" && refreshedApproval.current !== request.id);
    if (approval) {
      refreshedApproval.current = approval.id;
      void refreshRef.current?.();
    }
  }, [requests]);
  const reset = () => { setQuote(null); setStep("select"); setUtr(""); setProofFile(null); setPaymentConfirmed(false); setError(""); };
  const changePack = (next: AccountPaymentQuoteInputPackType) => {
    setPackType(next);
    setDurationDays(next === "Days" ? Math.min(durationDays, 30) : next === "Monthly" ? 30 : 365);
    setQuote(null); setUtr(""); setProofFile(null); setPaymentConfirmed(false); setError("");
  };
  const setDayCount = (value: number) => {
    if (value > 30) {
      setPackType("Monthly");
      setDurationDays(30);
      setQuote(null);
      setUtr("");
      setProofFile(null);
      setPaymentConfirmed(false);
      setError("");
      setNotice("30+ days is available in Monthly plan");
      return;
    }
    setDurationDays(Math.min(30, Math.max(1, value || 1))); setQuote(null);
  };
  const setMonthCount = (value: number) => {
    setDurationDays(Math.min(12, Math.max(1, Math.round(value || 1))) * 30);
    setQuote(null);
  };
  const setYearCount = (value: number) => {
    setDurationDays(Math.min(15, Math.max(1, Math.round(value || 1))) * 365);
    setQuote(null);
  };
  const requestQuote = async () => {
    if (!plan) return;
    setError(""); setNotice("");
    try {
      const quoteResult = await quoteMutation.mutateAsync({ data: {
         planId: plan.id, packType, durationDays,
        streamsPerDay: streams, downloadsPerDay: downloads,
      } });
      cashfreeAttemptId.current = quoteResult.paymentMode === "cashfree" ? window.crypto.randomUUID() : "";
      setQuote(quoteResult); setPaymentConfirmed(false); setStep("payment");
    } catch (reason) { setError(errorText(reason, "Could not calculate the price. Please try again.")); }
  };
  const verifyCashfreeStatus = async (orderId: string) => {
    setError("");
    setNotice("Checking your Cashfree payment status…");
    setCashfreeReturnOrderId(orderId);
    try {
      let result: Awaited<ReturnType<typeof verifyCashfreePayment.mutateAsync>> | undefined;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        result = await verifyCashfreePayment.mutateAsync({ data: { orderId } });
        if (result.status !== "pending" || attempt === 4) break;
        await new Promise((resolve) => window.setTimeout(resolve, 2000));
      }
      if (result?.status === "paid" && result.accessActivated) {
        setNotice(result.accessActivated
          ? "Payment verified. Your subscription access has been activated."
          : "Payment verified, but access is awaiting owner approval.");
        setCashfreeReturnOrderId("");
        setStep("select");
        await queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() });
        void refreshRef.current?.();
        const url = new URL(window.location.href);
        url.searchParams.delete("cashfree_order_id");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      } else if (result?.status === "failed") {
        setError(result.accessActivated
          ? "Your service is active by owner approval, but Cashfree did not confirm payment."
          : "This Cashfree order did not activate access. Contact the owner if you need a payment status update.");
        setNotice("");
        setCashfreeReturnOrderId("");
        const url = new URL(window.location.href);
        url.searchParams.delete("cashfree_order_id");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      } else {
        setNotice(result?.accessActivated
          ? "Your service is active by owner approval. Cashfree payment is still being confirmed."
          : "Payment is still being confirmed. Check the status again in a moment.");
      }
    } catch (reason) {
      setError(errorText(reason, "Could not verify the Cashfree payment. You can check again."));
      setNotice("Payment status could not be confirmed yet.");
    }
  };
  const startCashfreeCheckout = async () => {
    if (!quote || quote.paymentMode !== "cashfree") return;
    setError("");
    try {
      const attemptId = cashfreeAttemptId.current || window.crypto.randomUUID();
      cashfreeAttemptId.current = attemptId;
      const order: CashfreeOrderResponse = await createCashfreeOrder.mutateAsync({ data: {
        planId: quote.planId,
        packType: quote.packType,
        durationDays: quote.durationDays,
        streamsPerDay: quote.streamsPerDay,
        downloadsPerDay: quote.downloadsPerDay,
        attemptId,
      } });
      await loadCashfreeSdk();
      const cashfree = (window as CashfreeWindow).Cashfree;
      if (!cashfree) throw new Error("Cashfree checkout could not be initialized.");
      const result = await cashfree({ mode: order.environment }).checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_self",
      });
      if (result && "error" in result && result.error?.message) throw new Error(result.error.message);
    } catch (reason) {
      setError(errorText(reason, "Could not start Cashfree checkout."));
    }
  };
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("cashfree_order_id");
    if (!orderId || checkedReturnOrderId.current === orderId) return;
    checkedReturnOrderId.current = orderId;
    setCashfreeReturnOrderId(orderId);
    void verifyCashfreeStatus(orderId);
  }, []);
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
  const durationDaysLabel = (days: number) => packType === "Monthly"
    ? `${days / 30} month${days === 30 ? "" : "s"} · ${days} days`
    : packType === "Yearly"
      ? `${days / 365} year${days === 365 ? "" : "s"} · ${days} days`
      : `${days} days`;
  const estimatedDurationDays = durationDays;
  if (plansQuery.isLoading) return <div className="page subscription-page"><div className="pay-skeleton"/><div className="pay-skeleton"/></div>;
  if (plansQuery.isError) return <div className="page subscription-page"><div className="pay-alert error" role="alert"><XCircle size={18}/><span>Pricing could not be loaded. {errorText(plansQuery.error, "Try again.")}</span><button className="button secondary small" onClick={() => void plansQuery.refetch()} data-testid="button-retry-plans">Retry</button></div></div>;

  return <div className="page subscription-page manual-payment-page">
    <header className="page-head subscription-heading">
          <div>
            <Link href="/dashboard" className="subscription-back-link" data-testid="button-subscription-back">
              <ArrowLeft size={16} aria-hidden="true"/>
              <span>Back to Dashboard</span>
            </Link>
            <h1>Duplo Access</h1>
            <p className="subtle">Choose your access term and set your daily allowances.</p>
          </div>
    </header>
    {notice && <div className={`pay-alert ${cashfreeReturnOrderId ? "pending" : "success"}`} role="status" data-testid="status-payment-notice"><CheckCircle2 size={17}/><span>{notice}</span>{cashfreeReturnOrderId && <button className="button secondary small" type="button" onClick={() => void verifyCashfreeStatus(cashfreeReturnOrderId)} disabled={verifyCashfreePayment.isPending}>Check status</button>}<button className="pay-alert-close" onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-payment-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    {step === "select" ? <section className="pay-selection">
      <div className="pay-top-tabs" role="tablist" aria-label="Choose access term">
        {(["Days", "Monthly", "Yearly"] as const).map((kind) => <button type="button" role="tab" aria-selected={packType === kind} className={packType === kind ? "selected" : ""} key={kind} onClick={() => changePack(kind)} data-testid={`tab-select-pack-${kind.toLowerCase()}`}>{kind}</button>)}
      </div>
      <div className="card pay-select-card">
         <span className="metric-kicker">Duplo Access</span>
        <h2>Choose your access term</h2>
        <p className="pay-select-intro">Start with the term that fits your schedule. You’ll set broadcast starts and daily downloads next.</p>
        <div className="pay-selected-term" aria-live="polite"><strong>{packType}</strong><span>{packType === "Days" ? "Choose 1–30 days in the next step." : packType === "Monthly" ? "Choose 1–12 months in the next step." : "Choose 1–15 years in the next step."}</span></div>
        {!plan && <div className="pay-empty pay-plan-unavailable" role="status"><CircleDollarSign size={23}/><strong>No custom subscription is available</strong><span>Ask your workspace owner to enable the custom-subscription plan.</span></div>}
        <button className="button pay-quote-button pay-continue-button" type="button" disabled={!plan} onClick={() => { setError(""); setStep("configure"); }} data-testid="button-continue-to-config">Continue <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/></button>
      </div>
    </section> : step === "pending" ? <section className="card pay-pending-state" data-testid="status-pending-review">
      <span className="pending-dot"/><h2>Waiting for owner approval</h2><p>Your UPI payment and UTR are queued for a human owner to review. Access and allowances change only after the owner approves the request.</p>
      <button className="button pay-quote-button" type="button" onClick={reset}>Start another request</button>
    </section> : step === "payment" && quote ? <Dialog open onOpenChange={(open) => { if (!open) setStep("configure"); }}>
       <DialogContent className="pay-checkout-dialog manual-payment-page">
        <DialogHeader className="pay-checkout-dialog-header">
          <DialogTitle>{quote.paymentMode === "cashfree" ? "Complete your secure payment" : "Complete your UPI payment"}</DialogTitle>
           <DialogDescription>{quote.paymentMode === "cashfree" ? "Continue to Cashfree’s hosted checkout. Access activates after server verification or explicit owner approval." : "Scan the QR, confirm the payee and amount in your UPI app, then submit the UTR for owner review."}</DialogDescription>
        </DialogHeader>
        <section className="pay-checkout card">
      <button type="button" className="pay-back-link pay-back-button" onClick={() => setStep("configure")} data-testid="button-back-to-config"><ArrowLeft size={18}/> Back to configuration</button>
      <div className="pay-checkout-grid">
        <div className="pay-checkout-summary">
          <span className="metric-kicker">Your selection</span><h2>Review & pay</h2>
          <div className="pay-total-panel"><small>Total to pay</small><strong>{money(quote.amountPaise)}</strong><span>{quote.packType} · {quote.durationDays} days</span></div>
          <dl className="pay-breakdown">
            <div><dt>Stream starts · {quote.durationDays} days</dt><dd>{money(quote.pricePerStreamDayPaise * quote.streamsPerDay * quote.durationDays)}</dd></div>
            <div><dt>Downloads · {quote.durationDays} days</dt><dd>{money(quote.pricePerDownloadPaise * quote.downloadsPerDay * quote.durationDays)}</dd></div>
            <div><dt>Daily rent × {quote.durationDays} days</dt><dd>{money(quote.dailyRentPaise * quote.durationDays)}</dd></div>
            <div><dt>Broadcast starts each IST day</dt><dd>{quote.streamsPerDay}</dd></div>
            <div><dt>Downloads each day</dt><dd>{quote.downloadsPerDay.toLocaleString("en-IN")}</dd></div>
            <div><dt>Total download allowance</dt><dd>{quote.totalDownloads.toLocaleString("en-IN")}</dd></div>
            <div><dt>Existing concurrent broadcast cap</dt><dd>{quote.streamLimit}</dd></div>
          </dl>
        </div>
        {quote.paymentMode === "manual" ? <div className="pay-qr-side">
          <div className="pay-qr-frame">
             <QRCodeSVG value={`upi://pay?${new URLSearchParams({ pa: quote.upiId, pn: quote.payeeName, am: quote.amountRupees.toFixed(2), cu: "INR", tn: `YT Loop ${quote.planName}` })}`} size={220} level="M" includeMargin bgColor="#ffffff" fgColor="#17191d"/>
          </div>
          <strong className="pay-scan-heading">Please pay {money(quote.amountPaise)}</strong><span className="pay-scan-copy">Scan the QR with your UPI app. Confirm the payee and amount before sending.</span>
          <div className="payee-details"><span>Payee</span><strong>{quote.payeeName}</strong><span>UPI ID</span><div><strong className="mono">{quote.upiId}</strong><button type="button" className="icon-button" aria-label="Copy UPI ID" onClick={() => void copy(quote.upiId)} data-testid="button-copy-upi"><Copy size={14}/></button></div></div>
            {!paymentConfirmed ? <button type="button" className="button pay-quote-button pay-confirm-paid" onClick={() => setPaymentConfirmed(true)} data-testid="button-verify-payment"><Check size={16}/> I have paid</button> : <form onSubmit={(event) => void submitPayment(event)} className="pay-utr-form">
            <label htmlFor="utr-input">Enter your UTR number</label>
             <input id="utr-input" data-testid="input-payment-utr" value={utr} onChange={(event) => setUtr(event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 32))} placeholder="12-digit UTR number" minLength={6} maxLength={32} required pattern="[A-Za-z0-9]{6,32}" autoComplete="off" />
            <small>Found in your UPI payment receipt. Letters and numbers only.</small>
            <label className="proof-upload" htmlFor="proof-file"><Upload size={16}/><span>{proofFile ? proofFile.name : "Upload payment screenshot"} <small>Optional · PNG, JPG or WebP, up to 5 MB</small></span><input id="proof-file" data-testid="input-payment-proof" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event: ChangeEvent<HTMLInputElement>) => setProofFile(event.target.files?.[0] ?? null)}/></label>
            <button className="button pay-quote-button" type="submit" disabled={createRequest.isPending || createProofUrl.isPending || !/^[A-Za-z0-9]{6,32}$/.test(utr.trim())} data-testid="button-submit-payment">
              {createRequest.isPending || createProofUrl.isPending ? "Submitting for review…" : "Submit for review"}{createRequest.isPending || createProofUrl.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <Check size={16}/>}
            </button>
           </form>}
        </div> : <div className="pay-qr-side cashfree-checkout-panel">
          <div className="cashfree-wordmark"><span>Cashfree</span><small>PAYMENTS</small></div>
          <strong className="pay-scan-heading">Pay {money(quote.amountPaise)} securely</strong>
          <span className="pay-scan-copy">Cashfree will open its hosted payment page and show the methods enabled for this account.</span>
          <button className="button pay-quote-button" type="button" onClick={() => void startCashfreeCheckout()} disabled={createCashfreeOrder.isPending || verifyCashfreePayment.isPending} data-testid="button-start-cashfree-checkout">
            {createCashfreeOrder.isPending ? "Preparing secure checkout…" : "Continue to Cashfree"}{createCashfreeOrder.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }}/>}
          </button>
          <small className="cashfree-verification-note"><ShieldCheck size={14}/> Payment is verified before access is activated.</small>
        </div>}
      </div>
        </section>
      </DialogContent>
    </Dialog> : <div className="pay-config-flow">
      <header className="pay-config-sticky">
        <button type="button" className="pay-config-back" onClick={() => setStep("select")} data-testid="button-back-to-selection"><ArrowLeft size={17}/><span>Pack selection</span></button>
        <div className="pay-config-sticky-title">Configure access</div>
        <div className="pay-pack-switch" role="tablist" aria-label="Pack duration">
          {(["Days", "Monthly", "Yearly"] as const).map((kind) => <button type="button" key={kind} role="tab" aria-selected={packType === kind} className={packType === kind ? "selected" : ""} onClick={() => changePack(kind)} data-testid={`tab-config-pack-${kind.toLowerCase()}`}>{kind}</button>)}
        </div>
      </header>
      <section className="card pay-config pay-pack-card">
      {!plan ? <div className="pay-empty"><CircleDollarSign size={25}/><strong>No custom subscription is available</strong><span>Ask your workspace owner to enable pricing.</span></div> : <>
        <div className="pay-config-controls">
          <section className="pay-control-block">
            <div className="pay-control-label"><img src={streamsArt} alt="" /><div><strong>How many streams per day?</strong><small>Each is a broadcast start during an IST day.</small></div></div>
            <div className="pay-stepper pay-stream-counter"><button type="button" aria-label="Decrease streams per day" onClick={() => setStreams((value) => Math.max(0, value - 1))} disabled={streams <= 0} data-testid="button-streams-decrease"><Minus size={16}/></button><strong data-testid="text-streams-per-day">{streams}</strong><button type="button" aria-label="Increase streams per day" onClick={() => setStreams((value) => Math.min(100, value + 1))} disabled={streams >= 100} data-testid="button-streams-increase"><Plus size={16}/></button></div>
           <div className="pay-quick-choices" aria-label="Quick stream quantities">{[0, 1, 5, 10, 20].map((count) => <button key={count} type="button" aria-pressed={streams === count} className={streams === count ? "active" : ""} onClick={() => setStreams(count)} data-testid={`button-streams-${count}`}>{count}</button>)}</div>
           <small className="pay-zero-stream-note">Choose 0 for a download-only purchase.</small>
          </section>
          <section className="pay-control-block">
              <div className="pay-control-label"><img src={downloadsArt} alt="" /><div><strong>Video downloads</strong><small>How many videos do you want to download each day?</small></div></div>
             <div className="pay-download-options">{[10, 20, 30, 40, 50].map((count) => <button type="button" key={count} aria-pressed={downloads === count} className={downloads === count ? "active" : ""} onClick={() => setDownloads(count)} data-testid={`button-downloads-${count}`}>{count}</button>)}</div>
            <label className="pay-custom-download"><span>Custom amount</span><input type="number" min="1" max="1000000" value={downloads} onChange={(event) => setDownloads(Math.min(1000000, Math.max(1, Number(event.target.value) || 1)))} data-testid="input-downloads-per-day"/></label>
          </section>
          <section className="pay-control-block">
              <div className="pay-control-label"><img src={durationArt} alt="" /><div><strong>Duration</strong><small>{packType === "Days" ? "Choose from 1 to 30 days." : packType === "Monthly" ? "Choose from 1 to 12 months." : "Choose from 1 to 15 years."}</small></div></div>
             {packType === "Days" ? <>
              <div className="pay-duration-entry"><input aria-label="Duration in days" type="number" min="1" max="30" value={durationDays} onChange={(event) => setDayCount(Number(event.target.value))} data-testid="input-duration-days"/><span>days</span><b className="duration-badge">{durationDays} days</b></div>
              <input className="pay-duration-slider" type="range" min="1" max="30" value={durationDays} aria-label="Select duration from 1 to 30 days" onChange={(event) => setDayCount(Number(event.target.value))} data-testid="slider-duration-days"/>
              <div className="pay-duration-ticks"><span>1 day</span><span>30 days</span></div>
             </> : packType === "Monthly" ? <>
               <div className="pay-duration-entry"><input aria-label="Duration in months" type="number" min="1" max="12" step="1" value={durationDays / 30} onChange={(event) => setMonthCount(Number(event.target.value))} data-testid="input-duration-months"/><span>months</span><b className="duration-badge">{durationDaysLabel(durationDays)}</b></div>
               <input className="pay-duration-slider" type="range" min="1" max="12" step="1" value={durationDays / 30} aria-label="Select duration from 1 to 12 months" onChange={(event) => setMonthCount(Number(event.target.value))} data-testid="slider-duration-months"/>
               <div className="pay-duration-ticks"><span>1 month</span><span>12 months</span></div>
             </> : <>
               <div className="pay-duration-entry"><input aria-label="Duration in years" type="number" min="1" max="15" step="1" value={durationDays / 365} onChange={(event) => setYearCount(Number(event.target.value))} data-testid="input-duration-years"/><span>years</span><b className="duration-badge">{durationDaysLabel(durationDays)}</b></div>
               <input className="pay-duration-slider" type="range" min="1" max="15" step="1" value={durationDays / 365} aria-label="Select duration from 1 to 15 years" onChange={(event) => setYearCount(Number(event.target.value))} data-testid="slider-duration-years"/>
               <div className="pay-duration-ticks"><span>1 year</span><span>15 years</span></div>
              </>}
          </section>
        </div>
        <div className="pay-live-total">
          <div><span>Estimated total</span><strong data-testid="text-live-total">{money(((streams * (plan.pricePerStreamDayPaise || 0)) + (downloads * (plan.pricePerDownloadPaise || 0)) + (plan.dailyRentPaise || 0)) * estimatedDurationDays)}</strong></div>
             <small>({streams} starts × {money(plan.pricePerStreamDayPaise || 0)} + {downloads.toLocaleString("en-IN")} downloads × {money(plan.pricePerDownloadPaise || 0)} + {money(plan.dailyRentPaise || 0)} rent) × {estimatedDurationDays} days. Final amount is confirmed by the server.</small>
        </div>
        <button className="button pay-quote-button" type="button" onClick={() => void requestQuote()} disabled={quoteMutation.isPending} data-testid="button-confirm-purchase"><span>{quoteMutation.isPending ? "Calculating your total…" : "Confirm to purchase"}</span>{quoteMutation.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/>}</button>
      </>}
      <div className="pay-trust-note"><ShieldCheck size={15}/><span>Your concurrent broadcast cap is separate and is not changed by this purchase. Cashfree access starts after server verification or owner approval; UPI access starts after owner approval.</span></div>
     </section>
    </div>}

  </div>;
}

function StatusGlyph({ status }: { status: PaymentRequest["status"] }) {
  return status === "approved" ? <CheckCircle2 size={17}/> : status === "rejected" || status === "failed" ? <XCircle size={17}/> : <LoaderCircle size={17}/>;
}

type PlanDraft = { pricePerStreamDayRupees: string; pricePerDownloadRupees: string; dailyRentRupees: string };
const toDraft = (plan: BillingPlan): PlanDraft => ({
  pricePerStreamDayRupees: String(plan.pricePerStreamDayPaise / 100),
  pricePerDownloadRupees: String(plan.pricePerDownloadPaise / 100),
  dailyRentRupees: String((plan.dailyRentPaise || 0) / 100),
});

export function OwnerPaymentPanel({ ownerPassword, view = "settings" }: {
  ownerPassword: string;
  view?: "settings" | "requests";
}) {
  const queryClient = useQueryClient();
  const requestOpts = { headers: { "X-Owner-Password": ownerPassword } };
  const plansQuery = useListBillingPlans({
    request: requestOpts,
    query: { queryKey: getListBillingPlansQueryKey(), enabled: view === "settings" },
  });
  const settingsQuery = useGetOwnerPaymentSettings({
    request: requestOpts,
    query: { queryKey: getGetOwnerPaymentSettingsQueryKey(), enabled: view === "settings" },
  });
  const trialSettingsQuery = useGetOwnerTrialSettings({
    request: requestOpts,
    query: { queryKey: getGetOwnerTrialSettingsQueryKey(), enabled: view === "settings" },
  });
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "failed" | undefined>("pending");
  const requestsQuery = useListOwnerPaymentRequests(status ? { status } : {}, {
    request: requestOpts,
    query: {
      queryKey: getListOwnerPaymentRequestsQueryKey(status ? { status } : {}),
      refetchInterval: 20000,
      enabled: view === "requests",
    },
  });
  const updatePlan = useUpdateBillingPlan({ request: requestOpts });
  const updateSettings = useUpdateOwnerPaymentSettings({ request: requestOpts });
  const updateTrialSettings = useUpdateOwnerTrialSettings({ request: requestOpts });
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [trialDurationHours, setTrialDurationHours] = useState<1 | 2 | 6 | 24>(24);
  const [trialStreamsPerDay, setTrialStreamsPerDay] = useState(1);
  const [trialDownloadsPerDay, setTrialDownloadsPerDay] = useState(50);
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [paymentMode, setPaymentMode] = useState<"manual" | "cashfree">("manual");
  const [cashfreeEnvironment, setCashfreeEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [cashfreeCredentials, setCashfreeCredentials] = useState({
    sandbox: { clientId: "", clientSecret: "" },
    production: { clientId: "", clientSecret: "" },
  });
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const requests = requestsQuery.data?.requests ?? [];
  const activePlan = ownerCustomPricingPlan(plansQuery.data?.plans ?? []) ?? null;
  const currentDraft = draft ?? (activePlan ? toDraft(activePlan) : null);
  const initialized = useRef(false);
  const trialSettingsInitialized = useRef(false);
  useEffect(() => {
    if (settingsQuery.data && !initialized.current) {
      initialized.current = true;
      setUpiId(settingsQuery.data.upiId);
      setPayeeName(settingsQuery.data.payeeName);
      setPaymentMode(settingsQuery.data.paymentMode);
      setCashfreeEnvironment(settingsQuery.data.cashfreeEnvironment);
    }
  }, [settingsQuery.data]);
  useEffect(() => {
    if (trialSettingsQuery.data && !trialSettingsInitialized.current) {
      trialSettingsInitialized.current = true;
      setTrialDurationHours(trialSettingsQuery.data.durationHours);
      setTrialStreamsPerDay(trialSettingsQuery.data.streamsPerDay);
      setTrialDownloadsPerDay(trialSettingsQuery.data.downloadsPerDay);
    }
  }, [trialSettingsQuery.data]);
  const refreshOwnerLists = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: getListBillingPlansQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetOwnerPaymentSettingsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetOwnerTrialSettingsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListOwnerPaymentRequestsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() }),
  ]);
  const parsePlan = (value: PlanDraft): BillingPlanUpdate => ({
    price: `${money(Math.round((Number(value.pricePerStreamDayRupees) || 0) * 100))} / stream + ${money(Math.round((Number(value.pricePerDownloadRupees) || 0) * 100))} / download + ${money(Math.round((Number(value.dailyRentRupees) || 0) * 100))} / day rent`,
    pricePerStreamDayPaise: Math.max(0, Math.round((Number(value.pricePerStreamDayRupees) || 0) * 100)),
    pricePerDownloadPaise: Math.max(0, Math.round((Number(value.pricePerDownloadRupees) || 0) * 100)),
    dailyRentPaise: Math.max(0, Math.round((Number(value.dailyRentRupees) || 0) * 100)),
    active: true,
  });
  const persistPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!activePlan || !currentDraft) return;
    setError(""); setFeedback("");
    if ((Number(currentDraft.pricePerStreamDayRupees) || 0) <= 0
      && (Number(currentDraft.pricePerDownloadRupees) || 0) <= 0
      && (Number(currentDraft.dailyRentRupees) || 0) <= 0) {
      setError("Set a positive stream-start rate, download rate, or daily rent.");
      return;
    }
    try {
      await updatePlan.mutateAsync({ planId: activePlan.id, data: parsePlan(currentDraft) });
      setFeedback("Custom subscription pricing saved."); setDraft(null); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save pricing.")); }
  };
  const saveTrialSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    if (![1, 2, 6, 24].includes(trialDurationHours)
      || !Number.isInteger(trialStreamsPerDay) || trialStreamsPerDay < 0 || trialStreamsPerDay > 100
      || !Number.isInteger(trialDownloadsPerDay) || trialDownloadsPerDay < 0 || trialDownloadsPerDay > 1_000_000) {
      setError("Choose 1, 2, 6, or 24 hours and valid whole-number daily quotas.");
      return;
    }
    try {
      const saved = await updateTrialSettings.mutateAsync({ data: {
        durationHours: trialDurationHours,
        streamsPerDay: trialStreamsPerDay,
        downloadsPerDay: trialDownloadsPerDay,
      } });
      setTrialDurationHours(saved.durationHours);
      setTrialStreamsPerDay(saved.streamsPerDay);
      setTrialDownloadsPerDay(saved.downloadsPerDay);
      setFeedback("Trial duration and quotas saved. New trials will use these settings.");
      await queryClient.invalidateQueries({ queryKey: getGetOwnerTrialSettingsQueryKey() });
    } catch (reason) { setError(errorText(reason, "Could not save trial settings.")); }
  };
  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    if (paymentMode === "manual" && (!upiId.trim() || !payeeName.trim())) {
      setError("Manual UPI mode needs a UPI ID and payee name.");
      return;
    }
    const sandboxClientId = cashfreeCredentials.sandbox.clientId.trim();
    const sandboxClientSecret = cashfreeCredentials.sandbox.clientSecret.trim();
    const productionClientId = cashfreeCredentials.production.clientId.trim();
    const productionClientSecret = cashfreeCredentials.production.clientSecret.trim();
    if (Boolean(sandboxClientId) !== Boolean(sandboxClientSecret)
      || Boolean(productionClientId) !== Boolean(productionClientSecret)) {
      setError("Enter both the App ID and Secret for each Cashfree environment you want to configure.");
      return;
    }
    const selectedCredentialsConfigured = cashfreeEnvironment === "sandbox"
      ? settingsQuery.data?.cashfreeSandboxConfigured
      : settingsQuery.data?.cashfreeProductionConfigured;
    const selectedCredentialsDrafted = cashfreeEnvironment === "sandbox"
      ? Boolean(sandboxClientId && sandboxClientSecret)
      : Boolean(productionClientId && productionClientSecret);
    if (paymentMode === "cashfree" && !selectedCredentialsConfigured && !selectedCredentialsDrafted) {
      setError(`Enter both Cashfree ${cashfreeEnvironment} credentials before enabling checkout.`);
      return;
    }
    try {
      await updateSettings.mutateAsync({ data: {
        paymentMode,
        cashfreeEnvironment,
        ...(upiId.trim() ? { upiId: upiId.trim() } : {}),
        ...(payeeName.trim() ? { payeeName: payeeName.trim() } : {}),
        ...(sandboxClientId ? {
          cashfreeSandboxClientId: sandboxClientId,
          cashfreeSandboxClientSecret: sandboxClientSecret,
        } : {}),
        ...(productionClientId ? {
          cashfreeProductionClientId: productionClientId,
          cashfreeProductionClientSecret: productionClientSecret,
        } : {}),
      } });
      setCashfreeCredentials({
        sandbox: { clientId: "", clientSecret: "" },
        production: { clientId: "", clientSecret: "" },
      });
      setFeedback(paymentMode === "cashfree"
        ? "Cashfree checkout settings saved."
        : sandboxClientId || productionClientId
          ? "Cashfree credentials and Manual UPI settings saved."
          : "Manual UPI settings saved.");
      await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save payment details.")); }
  };
  const review = async (requestId: string, action: "approve" | "reject") => {
    setError(""); setFeedback("");
    try {
      const target = requests.find((request) => request.id === requestId);
      if (action === "approve" && target?.paymentMethod === "cashfree"
        && !window.confirm("This Cashfree payment has not been verified. Approving it will activate the user's service now, even if they have not paid. Continue?")) return;
      await reviewRequest.mutateAsync({ requestId, data: { action, note: reviewNotes[requestId]?.trim() || undefined } });
      setFeedback(action === "approve"
        ? target?.paymentMethod === "cashfree" && !target.cashfreePaymentId
          ? "Cashfree request manually approved. The user's service is active; payment is not verified."
          : "Payment approved. Account access has been updated."
        : "Payment request rejected.");
      setReviewNotes((previous) => ({ ...previous, [requestId]: "" })); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not review this payment request.")); }
  };
  const reviewRequest = useReviewOwnerPaymentRequest({ request: requestOpts });
  const changeDraft = (key: keyof PlanDraft, value: string) => setDraft((old) => ({ ...(old ?? (activePlan ? toDraft(activePlan) : { pricePerStreamDayRupees: "0", pricePerDownloadRupees: "0", dailyRentRupees: "0" })), [key]: value }));
  const ownerQrValue = upiId.trim() && payeeName.trim()
    ? `upi://pay?${new URLSearchParams({ pa: upiId.trim(), pn: payeeName.trim(), cu: "INR" })}`
    : "";
  const selectedCashfreeConfigured = cashfreeEnvironment === "sandbox"
    ? settingsQuery.data?.cashfreeSandboxConfigured
    : settingsQuery.data?.cashfreeProductionConfigured;
  const selectedCashfreeReentryRequired = cashfreeEnvironment === "sandbox"
    ? settingsQuery.data?.cashfreeSandboxReentryRequired
    : settingsQuery.data?.cashfreeProductionReentryRequired;
  const requestsSection = <section className="card owner-pay-card owner-review-card">
    <div className="pay-section-title">
      <div><span className="metric-kicker">Orders and review</span><h2>Payment requests</h2><p>Cashfree orders appear here while payment is pending. Verified payments activate automatically; owner approval can activate either payment method.</p></div>
      <button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching} data-testid="button-refresh-owner-requests"><RefreshCw size={13} className={requestsQuery.isFetching ? "pay-spin" : ""}/> Refresh</button>
    </div>
    <div className="owner-review-tabs" role="tablist" aria-label="Filter payment requests">{([["pending","Pending"],["approved","Paid / approved"],["rejected","Rejected"],["failed","Failed"],["","All requests"]] as const).map(([value,label]) => <button type="button" role="tab" aria-selected={status === (value || undefined)} key={label} className={status === (value || undefined) ? "active" : ""} onClick={() => setStatus(value || undefined)} data-testid={`tab-owner-${value || "all"}`}>{label}</button>)}</div>
    {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load payment requests</strong><button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()}>Retry</button></div> : requests.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No {status || ""} requests</strong><span>New customer submissions will appear in this queue.</span></div> : <div className="owner-review-list">{requests.map((request) => <OwnerPaymentRequestCard key={request.id} request={request} note={reviewNotes[request.id] ?? ""} onNote={(value) => setReviewNotes((current) => ({ ...current, [request.id]: value }))} onReview={(action) => void review(request.id, action)} busy={reviewRequest.isPending}/>)}</div>}
  </section>;
  if (view === "requests") return <main className="owner-content owner-payment-content">
    <div className="page-head owner-page-heading"><div><p className="eyebrow">Admin / Payments</p><h1>Payment Request</h1><p className="subtle">Review UPI submissions and Cashfree orders, then approve or reject requests.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Owner review</div></div>
    {feedback && <div className="pay-alert success" role="status" data-testid="status-owner-feedback"><CheckCircle2 size={17}/><span>{feedback}</span><button className="pay-alert-close" type="button" onClick={() => setFeedback("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-owner-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" type="button" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    {requestsSection}
  </main>;
  return <main className="owner-content owner-payment-content">
    <div className="page-head owner-page-heading"><div><p className="eyebrow">Commerce / Billing</p><h1>Payments</h1><p className="subtle">Set usage rates and rent, configure checkout, and manage trial access.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Billing settings</div></div>
    {feedback && <div className="pay-alert success" role="status" data-testid="status-owner-feedback"><CheckCircle2 size={17}/><span>{feedback}</span><button className="pay-alert-close" onClick={() => setFeedback("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-owner-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <div className="owner-payment-columns">
      <section className="card owner-pay-card">
         <div className="pay-section-title"><div><span className="metric-kicker">Duplo Access</span><h2>Usage rates and daily rent</h2><p>Charge the selected stream starts and downloads each day, plus rent for every access day.</p></div><span className="pay-icon"><CircleDollarSign size={19}/></span></div>
        {plansQuery.isLoading ? <div className="pay-loading-line"/> : plansQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load pricing</strong><button className="button secondary small" onClick={() => void plansQuery.refetch()}>Retry</button></div> : !activePlan || !currentDraft ? <div className="pay-empty"><CircleDollarSign size={24}/><strong>Custom subscription plan missing</strong><span>Create or enable the custom-subscription billing plan in the owner configuration.</span></div> : <form className="owner-plan-editor owner-custom-pricing" onSubmit={(event) => void persistPlan(event)}>
          <div className="owner-plan-editor-head"><div><span className="metric-kicker">Custom subscription</span><strong>Order pricing</strong></div></div>
          <div className="owner-plan-fields">
             <label className="field"><span>One live-stream start per day (₹)</span><input type="number" min="0" max="1000000" step="0.01" value={currentDraft.pricePerStreamDayRupees} onChange={(event) => changeDraft("pricePerStreamDayRupees", event.target.value)} required data-testid="input-price-per-stream"/></label>
             <label className="field"><span>One video download per day (₹)</span><input type="number" min="0" max="1000000" step="0.01" value={currentDraft.pricePerDownloadRupees} onChange={(event) => changeDraft("pricePerDownloadRupees", event.target.value)} required data-testid="input-price-per-download"/></label>
             <label className="field"><span>Daily rent per access day (₹)</span><input type="number" min="0" max="1000000" step="0.01" value={currentDraft.dailyRentRupees} onChange={(event) => changeDraft("dailyRentRupees", event.target.value)} required data-testid="input-daily-rent"/></label>
          </div>
          <div className="owner-plan-editor-foot"><small>Total = (stream rate × starts/day + download rate × downloads/day + daily rent) × term days.</small><button className="button small" type="submit" disabled={updatePlan.isPending} data-testid="button-save-pricing"><Save size={13}/>{updatePlan.isPending ? "Saving…" : "Save pricing"}</button></div>
        </form>}
      </section>
       <section className="card owner-pay-card owner-upi-card">
          <div className="pay-section-title"><div><span className="metric-kicker">Checkout settings</span><h2>Payment method</h2><p>Choose Cashfree hosted checkout or Manual UPI. You can switch between them at any time.</p></div><span className="pay-icon pay-icon-warm"><Smartphone size={19}/></span></div>
        {settingsQuery.isLoading ? <div className="pay-loading-line"/> : settingsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Payment details unavailable</strong><button className="button secondary small" onClick={() => void settingsQuery.refetch()}>Retry</button></div> : <form className="owner-upi-form" onSubmit={(event) => void saveSettings(event)}>
           <div className="owner-gateway-controls">
             <label className="field"><span>Payment gateway</span><select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value as "manual" | "cashfree")} data-testid="select-payment-mode"><option value="manual">Manual UPI</option><option value="cashfree">Cashfree hosted checkout</option></select></label>
             <label className="field"><span>Cashfree environment</span><select value={cashfreeEnvironment} onChange={(event) => setCashfreeEnvironment(event.target.value as "sandbox" | "production")} disabled={paymentMode !== "cashfree"} data-testid="select-cashfree-environment"><option value="sandbox">Sandbox</option><option value="production">Production</option></select></label>
           </div>
           {paymentMode === "manual" ? <>
             <div className="owner-upi-fields">
               <label className="field"><span>UPI ID</span><input required minLength={3} maxLength={100} value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="name@bank" data-testid="input-owner-upi"/></label>
               <label className="field"><span>Payee name</span><input required minLength={1} maxLength={100} value={payeeName} onChange={(event) => setPayeeName(event.target.value)} placeholder="Account holder" data-testid="input-owner-payee"/></label>
             </div>
             <div className="owner-qr-preview-wrap">
               <div className="owner-qr-preview">{ownerQrValue ? <QRCodeSVG value={ownerQrValue} size={164} level="M" includeMargin bgColor="#ffffff" fgColor="#17191d"/> : <span className="owner-qr-empty">Enter a UPI ID and payee name to preview the QR.</span>}</div>
               <p className="owner-qr-generated-note">This preview has no amount. Each customer checkout QR will include the server-calculated amount.</p>
             </div>
            </> : <>
              <div className="owner-cashfree-credentials">
                {(["sandbox", "production"] as const).map((environment) => {
                  const configured = environment === "sandbox"
                    ? settingsQuery.data?.cashfreeSandboxConfigured
                    : settingsQuery.data?.cashfreeProductionConfigured;
                  const reentryRequired = environment === "sandbox"
                    ? settingsQuery.data?.cashfreeSandboxReentryRequired
                    : settingsQuery.data?.cashfreeProductionReentryRequired;
                  const credentialDraft = cashfreeCredentials[environment];
                  return <div className="owner-cashfree-environment" key={environment}>
                    <div className="owner-cashfree-env-head">
                      <strong>{environment === "sandbox" ? "Sandbox" : "Production"} credentials</strong>
                      <span className={`cashfree-config-status ${configured ? "configured" : "missing"}`} role="status">
                        {configured ? "Configured" : reentryRequired ? "Re-enter required" : "Not configured"}
                      </span>
                    </div>
                    <div className="owner-cashfree-env-fields">
                      <label className="field"><span>App ID</span><input type="text" autoComplete="off" maxLength={256} value={credentialDraft.clientId} onChange={(event) => setCashfreeCredentials((current) => ({ ...current, [environment]: { ...current[environment], clientId: event.target.value } }))} placeholder={configured ? "Saved · leave blank to keep" : "Cashfree App ID"} data-testid={`input-cashfree-${environment}-client-id`}/></label>
                      <label className="field"><span>Secret Key</span><input type="password" autoComplete="new-password" maxLength={4096} value={credentialDraft.clientSecret} onChange={(event) => setCashfreeCredentials((current) => ({ ...current, [environment]: { ...current[environment], clientSecret: event.target.value } }))} placeholder={configured ? "Saved · leave blank to keep" : "Cashfree Secret Key"} data-testid={`input-cashfree-${environment}-client-secret`}/></label>
                    </div>
                  </div>;
                })}
              </div>
              <div className={`cashfree-config-status ${selectedCashfreeConfigured ? "configured" : "missing"}`} role="status">
                <strong>{selectedCashfreeConfigured
                  ? `Cashfree ${cashfreeEnvironment} checkout is ready`
                  : selectedCashfreeReentryRequired
                    ? `Cashfree ${cashfreeEnvironment} credentials must be entered again`
                    : `Cashfree ${cashfreeEnvironment} credentials are required`}</strong>
                <span>{selectedCashfreeReentryRequired
                  ? "These saved credentials can no longer be unlocked. Re-enter both values below to replace them. Secret values remain encrypted on the server and are never returned to this page."
                  : "Enter both values for an environment to save or replace its credentials. Saved keys are encrypted on the server and are never sent back to this page. Owner-panel credentials take precedence over matching Replit Secrets."}</span>
                <small>Cashfree must whitelist ytloop.online for hosted checkout before you go live.</small>
              </div>
            </>}
           <button className="button" type="submit" disabled={updateSettings.isPending || (paymentMode === "manual" && (!upiId.trim() || !payeeName.trim()))} data-testid="button-save-payment-settings"><Save size={14}/>{updateSettings.isPending ? "Saving…" : "Save payment settings"}</button>
          {settingsQuery.data?.updatedAt && <small>Last updated {new Date(settingsQuery.data.updatedAt).toLocaleString()}</small>}
        </form>}
      </section>
    </div>
    <section className="card owner-pay-card owner-trial-settings">
      <div className="pay-section-title"><div><span className="metric-kicker">Free access</span><h2>Trial duration and quotas</h2><p>These settings apply to both signup trials and the phone-verified Profile offer.</p></div><span className="pay-icon pay-icon-warm"><Gift size={19}/></span></div>
      {trialSettingsQuery.isLoading ? <div className="pay-loading-line"/> : trialSettingsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Trial settings unavailable</strong><button className="button secondary small" type="button" onClick={() => void trialSettingsQuery.refetch()}>Retry</button></div> : <form className="owner-trial-form" onSubmit={(event) => void saveTrialSettings(event)}>
        <div className="owner-plan-fields owner-trial-fields">
           <label className="field"><span>Trial duration</span><select value={trialDurationHours} onChange={(event) => setTrialDurationHours(Number(event.target.value) as 1 | 2 | 6 | 24)} data-testid="select-trial-duration"><option value={1}>1 hour</option><option value={2}>2 hours</option><option value={6}>6 hours</option><option value={24}>24 hours</option></select></label>
          <label className="field"><span>Stream starts per IST day</span><input type="number" min="0" max="100" step="1" value={trialStreamsPerDay} onChange={(event) => setTrialStreamsPerDay(Number(event.target.value))} required data-testid="input-trial-streams"/></label>
          <label className="field"><span>Downloads per IST day</span><input type="number" min="0" max="1000000" step="1" value={trialDownloadsPerDay} onChange={(event) => setTrialDownloadsPerDay(Number(event.target.value))} required data-testid="input-trial-downloads"/></label>
        </div>
        <div className="owner-plan-editor-foot"><small>Changing these values affects new trials only. Existing access periods keep their current end time.</small><button className="button small" type="submit" disabled={updateTrialSettings.isPending} data-testid="button-save-trial-settings"><Save size={13}/>{updateTrialSettings.isPending ? "Saving…" : "Save trial settings"}</button></div>
        {trialSettingsQuery.data?.updatedAt && <small className="owner-trial-updated">Last updated {new Date(trialSettingsQuery.data.updatedAt).toLocaleString()}</small>}
      </form>}
    </section>
  </main>;
}

export function OwnerPaymentRequestsPanel({ ownerPassword }: { ownerPassword: string }) {
  return <OwnerPaymentPanel ownerPassword={ownerPassword} view="requests"/>;
}

function OwnerPaymentRequestCard({ request, note, onNote, onReview, busy }: { request: PaymentRequest; note: string; onNote: (value: string) => void; onReview: (action: "approve" | "reject") => void; busy: boolean }) {
  return <article className="owner-review-item" data-testid={`card-owner-request-${request.id}`}>
     <div className="owner-review-item-main"><div className={`pay-status-mark ${request.status}`}><StatusGlyph status={request.status}/></div><div className="owner-review-identity"><strong>{request.accountName || "Account"}</strong><span>{request.accountEmail}</span><small>{new Date(request.createdAt).toLocaleString()} · {request.id.slice(0, 8)}</small></div><span className={`pay-status-tag ${request.status}`}>{request.paymentMethod === "cashfree" && request.status === "approved" ? request.cashfreePaymentId ? "Paid · active" : "Owner-approved · active" : request.paymentMethod === "cashfree" && request.status === "pending" ? "Awaiting payment · reviewable" : request.status === "pending" ? "Pending owner review" : request.status}</span></div>
      <div className="owner-review-facts"><div><span>Plan / pack</span><strong>{request.planName} · {request.packType}</strong></div><div><span>Payment method</span><strong>{request.paymentMethod === "cashfree" ? "Cashfree" : "Manual UPI"}</strong></div><div><span>Order amount</span><strong>{money(request.amountPaise)}</strong></div><div><span>Duration</span><strong>{request.durationDays} days</strong></div><div><span>Stream starts / day × duration</span><strong>{request.streamsPerDay} × {money(request.pricePerStreamDayPaise)} × {request.durationDays}</strong></div><div><span>Downloads / day × duration</span><strong>{request.downloadsPerDay.toLocaleString("en-IN")} × {money(request.pricePerDownloadPaise)} × {request.durationDays}</strong></div><div><span>Daily rent × duration</span><strong>{money(request.dailyRentPaise)} × {request.durationDays} days</strong></div><div><span>Existing concurrent cap</span><strong>{request.streamLimit}</strong></div><div className="owner-utr"><span>{request.paymentMethod === "cashfree" ? "Cashfree payment ID / order ID" : "UTR / bank reference"}</span><strong className="mono">{request.paymentMethod === "cashfree" ? request.cashfreePaymentId || request.cashfreeOrderId || "—" : request.utr || "—"}</strong></div></div>
    {request.screenshotUrl && <a className="owner-proof-link" href={request.screenshotUrl} target="_blank" rel="noreferrer" data-testid={`link-payment-proof-${request.id}`}><Download size={15}/> View payment proof</a>}
     {request.paymentMethod === "cashfree" && request.status !== "pending" && <p className="pay-review-note">{request.status === "approved"
       ? request.cashfreePaymentId ? "Cashfree payment verified. Access is active." : "Access was activated by owner approval; Cashfree payment is not verified."
       : request.status === "rejected" ? "This Cashfree request was rejected by the owner. Access was not activated." : "Cashfree payment failed or expired. No access was activated."}</p>}
     {request.status === "pending"
       ? <><p className="pay-review-note">{request.paymentMethod === "cashfree"
         ? "Awaiting Cashfree payment confirmation. Owner approval will activate service immediately, even if payment is unverified."
         : "UPI payment is pending owner review. Access remains inactive until approval."}</p>
         <div className="owner-review-actions"><label className="field"><span>Review note · optional</span><input value={note} maxLength={500} onChange={(event) => onNote(event.target.value)} placeholder="Add a note for the customer" data-testid={`input-review-note-${request.id}`}/></label><div><button className="button secondary small" type="button" onClick={() => onReview("reject")} disabled={busy} data-testid={`button-reject-${request.id}`}><XCircle size={14}/> Reject</button><button className="button small" type="button" onClick={() => onReview("approve")} disabled={busy} data-testid={`button-approve-${request.id}`}><Check size={14}/> Approve & activate</button></div></div></>
       : request.paymentMethod !== "cashfree" && request.reviewNote && <p className="pay-review-note">Review note: {request.reviewNote}</p>}
  </article>;
}