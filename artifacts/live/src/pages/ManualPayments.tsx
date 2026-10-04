import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import "./ManualPayments.css";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft, Check, CheckCircle2, ChevronUp, CircleDollarSign, Copy,
  Download, FileText, Filter, LoaderCircle, Minus, RefreshCw, Save,
  ShieldCheck, Smartphone, Upload, X, XCircle, Plus,
} from "lucide-react";
import {
  getGetOwnerPaymentSettingsQueryKey, getListAccountPaymentRequestsQueryKey,
  getListBillingPlansQueryKey, getListOwnerPaymentRequestsQueryKey,
  useCreateAccountPaymentProofUploadUrl, useCreateAccountPaymentRequest,
  useCreateCashfreeOrder,
  useGetOwnerPaymentSettings,
  useListAccountPaymentRequests, useListBillingPlans, useListOwnerPaymentRequests,
  useQuoteAccountPayment, useReviewOwnerPaymentRequest, useUpdateBillingPlan,
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
  id: string; email: string; displayName: string; licenseKey: string; streamLimit: number;
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
        setNotice("Payment verified. Your subscription access has been activated.");
        setCashfreeReturnOrderId("");
        setStep("select");
        await queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() });
        void refreshRef.current?.();
        const url = new URL(window.location.href);
        url.searchParams.delete("cashfree_order_id");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      } else if (result?.status === "failed") {
        setError("Cashfree did not confirm a successful payment. No access was activated.");
        setNotice("");
        setCashfreeReturnOrderId("");
        const url = new URL(window.location.href);
        url.searchParams.delete("cashfree_order_id");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      } else {
        setNotice("Payment is still being confirmed. Check the status again in a moment.");
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
          <div><p className="eyebrow">Duplo Access</p><h1>Duplo Access</h1><p className="subtle">Choose your access term and set your daily allowances.</p></div>
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
          <DialogDescription>{quote.paymentMode === "cashfree" ? "Continue to Cashfree’s hosted checkout. Your access activates only after the server verifies payment." : "Scan the QR, confirm the payee and amount in your UPI app, then submit the UTR for owner review."}</DialogDescription>
        </DialogHeader>
        <section className="pay-checkout card">
      <button type="button" className="pay-back-link pay-back-button" onClick={() => setStep("configure")} data-testid="button-back-to-config"><ArrowLeft size={18}/> Back to configuration</button>
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
            <div className="pay-stepper pay-stream-counter"><button type="button" aria-label="Decrease streams per day" onClick={() => setStreams((value) => Math.max(1, value - 1))} disabled={streams <= 1} data-testid="button-streams-decrease"><Minus size={16}/></button><strong data-testid="text-streams-per-day">{streams}</strong><button type="button" aria-label="Increase streams per day" onClick={() => setStreams((value) => Math.min(100, value + 1))} disabled={streams >= 100} data-testid="button-streams-increase"><Plus size={16}/></button></div>
           <div className="pay-quick-choices" aria-label="Quick stream quantities">{[1, 5, 10, 20].map((count) => <button key={count} type="button" aria-pressed={streams === count} className={streams === count ? "active" : ""} onClick={() => setStreams(count)} data-testid={`button-streams-${count}`}>{count}</button>)}</div>
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
           <div><span>Estimated total</span><strong data-testid="text-live-total">{money(((streams * plan.pricePerStreamDayPaise) + (downloads * plan.pricePerDownloadPaise)) * estimatedDurationDays)}</strong></div>
           <small>{streams} starts × {money(plan.pricePerStreamDayPaise)} + {downloads.toLocaleString("en-IN")} downloads × {money(plan.pricePerDownloadPaise)}, per day<br/>multiplied by {estimatedDurationDays} days. Final amount is confirmed by the server.</small>
        </div>
        <button className="button pay-quote-button" type="button" onClick={() => void requestQuote()} disabled={quoteMutation.isPending} data-testid="button-confirm-purchase"><span>{quoteMutation.isPending ? "Calculating your total…" : "Confirm to purchase"}</span>{quoteMutation.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/>}</button>
      </>}
       <div className="pay-trust-note"><ShieldCheck size={15}/><span>Your concurrent broadcast cap is separate and is not changed by this purchase. Cashfree access starts after server verification; UPI access starts after owner approval.</span></div>
     </section>
    </div>}

  </div>;
}

function StatusGlyph({ status }: { status: PaymentRequest["status"] }) {
  return status === "approved" ? <CheckCircle2 size={17}/> : status === "rejected" ? <XCircle size={17}/> : <LoaderCircle size={17}/>;
}

type PlanDraft = { pricePerStreamDayRupees: string; pricePerDownloadRupees: string };
const toDraft = (plan: BillingPlan): PlanDraft => ({ pricePerStreamDayRupees: String(plan.pricePerStreamDayPaise / 100), pricePerDownloadRupees: String(plan.pricePerDownloadPaise / 100) });

export function OwnerPaymentPanel({ ownerPassword }: { ownerPassword: string }) {
  const queryClient = useQueryClient();
  const requestOpts = { headers: { "X-Owner-Password": ownerPassword } };
  const plansQuery = useListBillingPlans({ request: requestOpts });
  const settingsQuery = useGetOwnerPaymentSettings({ request: requestOpts });
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const requestsQuery = useListOwnerPaymentRequests(status ? { status } : {}, { request: requestOpts });
  const updatePlan = useUpdateBillingPlan({ request: requestOpts });
  const updateSettings = useUpdateOwnerPaymentSettings({ request: requestOpts });
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [paymentMode, setPaymentMode] = useState<"manual" | "cashfree">("manual");
  const [cashfreeEnvironment, setCashfreeEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const requests = requestsQuery.data?.requests ?? [];
  const activePlan = ownerCustomPricingPlan(plansQuery.data?.plans ?? []) ?? null;
  const currentDraft = draft ?? (activePlan ? toDraft(activePlan) : null);
  const initialized = useRef(false);
  useEffect(() => {
    if (settingsQuery.data && !initialized.current) {
      initialized.current = true;
      setUpiId(settingsQuery.data.upiId);
      setPayeeName(settingsQuery.data.payeeName);
      setPaymentMode(settingsQuery.data.paymentMode);
      setCashfreeEnvironment(settingsQuery.data.cashfreeEnvironment);
    }
  }, [settingsQuery.data]);
  const refreshOwnerLists = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: getListBillingPlansQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetOwnerPaymentSettingsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListOwnerPaymentRequestsQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() }),
  ]);
  const parsePlan = (value: PlanDraft): BillingPlanUpdate => ({
    price: `₹${(Number(value.pricePerStreamDayRupees) || 0).toFixed(2)} / stream start / day`,
    pricePerStreamDayPaise: Math.max(0, Math.round((Number(value.pricePerStreamDayRupees) || 0) * 100)),
    pricePerDownloadPaise: Math.max(0, Math.round((Number(value.pricePerDownloadRupees) || 0) * 100)),
    active: true,
  });
  const persistPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!activePlan || !currentDraft) return;
    setError(""); setFeedback("");
    if ((Number(currentDraft.pricePerStreamDayRupees) || 0) <= 0 && (Number(currentDraft.pricePerDownloadRupees) || 0) <= 0) {
      setError("Set a positive price for a live-stream start or a video download.");
      return;
    }
    try {
      await updatePlan.mutateAsync({ planId: activePlan.id, data: parsePlan(currentDraft) });
      setFeedback("Custom subscription pricing saved."); setDraft(null); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save pricing.")); }
  };
  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    if (paymentMode === "manual" && (!upiId.trim() || !payeeName.trim())) {
      setError("Manual UPI mode needs a UPI ID and payee name.");
      return;
    }
    try {
      await updateSettings.mutateAsync({ data: {
        paymentMode,
        cashfreeEnvironment,
        ...(upiId.trim() ? { upiId: upiId.trim() } : {}),
        ...(payeeName.trim() ? { payeeName: payeeName.trim() } : {}),
      } });
      setFeedback(paymentMode === "cashfree" ? "Cashfree checkout settings saved." : "Manual UPI settings saved.");
      await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save payment details.")); }
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
  const changeDraft = (key: keyof PlanDraft, value: string) => setDraft((old) => ({ ...(old ?? (activePlan ? toDraft(activePlan) : { pricePerStreamDayRupees: "0", pricePerDownloadRupees: "0" })), [key]: value }));
  const ownerQrValue = upiId.trim() && payeeName.trim()
    ? `upi://pay?${new URLSearchParams({ pa: upiId.trim(), pn: payeeName.trim(), cu: "INR" })}`
    : "";
  const selectedCashfreeConfigured = cashfreeEnvironment === "sandbox"
    ? settingsQuery.data?.cashfreeSandboxConfigured
    : settingsQuery.data?.cashfreeProductionConfigured;
  return <main className="owner-content owner-payment-content">
    <div className="page-head owner-page-heading"><div><p className="eyebrow">Commerce / Manual UPI</p><h1>Payments</h1><p className="subtle">Set your custom-subscription rates, add your UPI destination, and review customer payments.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Owner review</div></div>
    {feedback && <div className="pay-alert success" role="status" data-testid="status-owner-feedback"><CheckCircle2 size={17}/><span>{feedback}</span><button className="pay-alert-close" onClick={() => setFeedback("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert" data-testid="status-owner-error"><XCircle size={17}/><span>{error}</span><button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <div className="owner-payment-columns">
      <section className="card owner-pay-card">
        <div className="pay-section-title"><div><span className="metric-kicker">Duplo Access</span><h2>Daily pricing</h2><p>Set the rate for one live-stream start per day and for one video download.</p></div><span className="pay-icon"><CircleDollarSign size={19}/></span></div>
        {plansQuery.isLoading ? <div className="pay-loading-line"/> : plansQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load pricing</strong><button className="button secondary small" onClick={() => void plansQuery.refetch()}>Retry</button></div> : !activePlan || !currentDraft ? <div className="pay-empty"><CircleDollarSign size={24}/><strong>Custom subscription plan missing</strong><span>Create or enable the custom-subscription billing plan in the owner configuration.</span></div> : <form className="owner-plan-editor owner-custom-pricing" onSubmit={(event) => void persistPlan(event)}>
          <div className="owner-plan-editor-head"><div><span className="metric-kicker">Set just two rates</span><strong>Daily pricing</strong></div></div>
          <div className="owner-plan-fields">
            <label className="field"><span>One live-stream start · per day (₹)</span><input type="number" min="0" step="0.01" value={currentDraft.pricePerStreamDayRupees} onChange={(event) => changeDraft("pricePerStreamDayRupees", event.target.value)} required data-testid="input-price-per-stream"/></label>
            <label className="field"><span>One video download (₹)</span><input type="number" min="0" step="0.01" value={currentDraft.pricePerDownloadRupees} onChange={(event) => changeDraft("pricePerDownloadRupees", event.target.value)} required data-testid="input-price-per-download"/></label>
          </div>
          <div className="owner-plan-editor-foot"><small>Total = selected daily quantities × these rates × term length.</small><button className="button small" type="submit" disabled={updatePlan.isPending} data-testid="button-save-pricing"><Save size={13}/>{updatePlan.isPending ? "Saving…" : "Save pricing"}</button></div>
        </form>}
      </section>
       <section className="card owner-pay-card owner-upi-card">
         <div className="pay-section-title"><div><span className="metric-kicker">Checkout settings</span><h2>Payment method</h2><p>Choose how customers pay. Cashfree credentials stay in Replit Secrets; they are never stored in this panel.</p></div><span className="pay-icon pay-icon-warm"><Smartphone size={19}/></span></div>
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
           </> : <div className={`cashfree-config-status ${selectedCashfreeConfigured ? "configured" : "missing"}`} role="status">
             <strong>{selectedCashfreeConfigured ? `Cashfree ${cashfreeEnvironment} credentials detected` : `Cashfree ${cashfreeEnvironment} credentials not configured`}</strong>
             <span>{selectedCashfreeConfigured
               ? "Checkout credentials are stored server-side in Replit Secrets."
               : cashfreeEnvironment === "sandbox"
                 ? "Add CASHFREE_SANDBOX_CLIENT_ID and CASHFREE_SANDBOX_CLIENT_SECRET in Replit Secrets."
                 : "Add CASHFREE_PRODUCTION_CLIENT_ID and CASHFREE_PRODUCTION_CLIENT_SECRET in Replit Secrets."}</span>
             <small>Cashfree must also whitelist ytloop.online for hosted checkout and webhook delivery.</small>
           </div>}
           <button className="button" type="submit" disabled={updateSettings.isPending || (paymentMode === "manual" && (!upiId.trim() || !payeeName.trim()))} data-testid="button-save-payment-settings"><Save size={14}/>{updateSettings.isPending ? "Saving…" : "Save payment settings"}</button>
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
     <div className="owner-review-facts"><div><span>Plan / pack</span><strong>{request.planName} · {request.packType}</strong></div><div><span>Payment method</span><strong>{request.paymentMethod === "cashfree" ? "Cashfree" : "Manual UPI"}</strong></div><div><span>Paid amount</span><strong>{money(request.amountPaise)}</strong></div><div><span>Duration</span><strong>{request.durationDays} days</strong></div><div><span>Broadcast starts / day</span><strong>{request.streamsPerDay}</strong></div><div><span>Downloads / day</span><strong>{request.downloadsPerDay.toLocaleString("en-IN")}</strong></div><div><span>Existing concurrent cap</span><strong>{request.streamLimit}</strong></div><div className="owner-utr"><span>{request.paymentMethod === "cashfree" ? "Cashfree payment ID / order ID" : "UTR / bank reference"}</span><strong className="mono">{request.paymentMethod === "cashfree" ? request.cashfreePaymentId || request.cashfreeOrderId || "—" : request.utr || "—"}</strong></div></div>
    {request.screenshotUrl && <a className="owner-proof-link" href={request.screenshotUrl} target="_blank" rel="noreferrer" data-testid={`link-payment-proof-${request.id}`}><Download size={15}/> View payment proof</a>}
    {request.status === "pending" ? <div className="owner-review-actions"><label className="field"><span>Review note · optional</span><input value={note} maxLength={500} onChange={(event) => onNote(event.target.value)} placeholder="Add a note for the customer" data-testid={`input-review-note-${request.id}`}/></label><div><button className="button secondary small" type="button" onClick={() => onReview("reject")} disabled={busy} data-testid={`button-reject-${request.id}`}><XCircle size={14}/> Reject</button><button className="button small" type="button" onClick={() => onReview("approve")} disabled={busy} data-testid={`button-approve-${request.id}`}><Check size={14}/> Approve & activate</button></div></div> : request.reviewNote && <p className="pay-review-note">Review note: {request.reviewNote}</p>}
  </article>;
}