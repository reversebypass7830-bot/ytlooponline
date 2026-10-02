import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  Check, CheckCircle2, ChevronDown, ChevronUp, CircleDollarSign, Copy, CreditCard,
  FileText, Filter, LoaderCircle, RefreshCw, Save, ShieldCheck, Smartphone,
  X, XCircle,
} from "lucide-react";
import {
  getGetOwnerPaymentSettingsQueryKey, getListAccountPaymentRequestsQueryKey,
  getListBillingPlansQueryKey, getListOwnerPaymentRequestsQueryKey,
  useCreateAccountPaymentRequest, useCreateBillingPlan, useGetOwnerPaymentSettings,
  useListAccountPaymentRequests, useListBillingPlans, useListOwnerPaymentRequests,
  useQuoteAccountPayment, useReviewOwnerPaymentRequest, useUpdateBillingPlan,
  useUpdateOwnerPaymentSettings,
} from "@workspace/api-client-react";
import type {
  AccountPaymentQuote, BillingPlan, BillingPlanInput, BillingPlanUpdate,
  PaymentRequest,
} from "@workspace/api-client-react";

type Account = {
  id: string; email: string; displayName: string; licenseKey: string; streamLimit: number;
  activePlan: { name: string } | null; activePlanId: string; active: boolean; accessEndsAt: string;
  downloadsUsedToday?: number; downloadsPerDay?: number;
  history: Array<{ id: string; type: "purchase" | "grant" | string; message: string; at: string; planId?: string; days?: number; streamLimit?: number; amountPaise?: number; utr?: string }>;
};

const money = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorText = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export function ManualSubscriptionPage({ account, onRefresh }: { account: Account; onRefresh?: () => void }) {
  const queryClient = useQueryClient();
  const plansQuery = useListBillingPlans();
  const requestsQuery = useListAccountPaymentRequests({ query: { queryKey: getListAccountPaymentRequestsQueryKey(), refetchInterval: 20000 } });
  const quoteMutation = useQuoteAccountPayment();
  const createRequest = useCreateAccountPaymentRequest();
  const [planId, setPlanId] = useState("");
  const [durationUnit, setDurationUnit] = useState<"days" | "months" | "years">("days");
  const [durationCount, setDurationCount] = useState(1);
  const [streams, setStreams] = useState(1);
  const [downloads, setDownloads] = useState(0);
  const [quote, setQuote] = useState<AccountPaymentQuote | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [utr, setUtr] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [historyType, setHistoryType] = useState<"all" | "purchase" | "grant">("all");
  const [range, setRange] = useState("all");
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;
  const refreshedApproval = useRef("");
  const plans = plansQuery.data?.plans?.filter((plan) => plan.active && !plan.isTrial) ?? [];
  const selectedPlan = plans.find((plan) => plan.id === planId) ?? plans[0];
  const selectedDownloads = downloads || selectedPlan?.downloadsPerDay || 1;
  const durationDays = durationCount * (durationUnit === "days" ? 1 : durationUnit === "months" ? 30 : 365);
  const pendingRequests = requestsQuery.data?.requests ?? [];
  useEffect(() => {
    const newlyApproved = pendingRequests.find((request) => request.status === "approved");
    if (newlyApproved && refreshedApproval.current !== newlyApproved.id) {
      refreshedApproval.current = newlyApproved.id;
      void refreshRef.current?.();
    }
  }, [pendingRequests]);
  const history = useMemo(() => {
    const items = account.history.filter((item) => item.type === "purchase" || item.type === "grant").map((item) => ({ ...item }));
    for (const approved of pendingRequests.filter((request) => request.status === "approved")) {
      const matching = items.find((item) => item.type === "purchase" && item.planId === approved.planId && Math.abs(new Date(item.at).getTime() - new Date(approved.createdAt).getTime()) < 3 * 86400000);
      if (matching) {
        matching.amountPaise ??= approved.amountPaise;
        matching.utr ??= approved.utr;
      } else {
        items.unshift({ id: approved.id, type: "purchase", message: `${approved.planName} approved`, at: approved.reviewedAt || approved.createdAt, planId: approved.planId, days: approved.durationDays, streamLimit: approved.streamLimit, amountPaise: approved.amountPaise, utr: approved.utr });
      }
    }
    return items;
  }, [account.history, pendingRequests]);
  const filteredHistory = history.filter((item) => {
    const text = `${item.message} ${item.planId ?? ""} ${item.id} ${item.utr ?? ""}`.toLowerCase();
    const matchesDate = range === "all" || Date.now() - new Date(item.at).getTime() <= Number(range) * 86400000;
    return (historyType === "all" || item.type === historyType) && (!search.trim() || `${text} ${item.amountPaise ? money(item.amountPaise) : ""}`.toLowerCase().includes(search.trim().toLowerCase())) && matchesDate;
  });
  const resetQuote = () => { setQuote(null); setConfirmed(false); setUtr(""); setError(""); };
  const requestQuote = async () => {
    if (!selectedPlan) return;
    setError(""); setNotice(""); setQuote(null); setConfirmed(false);
    try {
      const result = await quoteMutation.mutateAsync({ data: { planId: selectedPlan.id, durationDays, streamLimit: streams, downloadsPerDay: selectedDownloads } });
      setQuote(result);
    } catch (reason) { setError(errorText(reason, "Could not calculate your quote. Please try again.")); }
  };
  const submitUtr = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quote || !/^[A-Za-z0-9]{6,32}$/.test(utr.trim())) return;
    setError(""); setNotice("");
    try {
      const result = await createRequest.mutateAsync({ data: { planId: quote.planId, durationDays: quote.durationDays, streamLimit: quote.streamLimit, downloadsPerDay: quote.downloadsPerDay, utr: utr.trim() } });
      await queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() });
      setNotice(`Payment reference submitted. Request ${result.request.id.slice(0, 8)} is ${result.request.status}. Access will not change until an owner approves it.`);
      setQuote(null); setConfirmed(false); setUtr("");
      onRefresh?.();
    } catch (reason) { setError(errorText(reason, "Could not submit this payment reference.")); }
  };
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setNotice("Copied to clipboard."); } catch { setNotice("Select and copy the value manually."); } };
  const makeInvoice = (item: Account["history"][number]) => {
    const text = ["LIVE CONTROL ROOM · PURCHASE RECORD", `Reference: ${item.id}`, `Date: ${new Date(item.at).toLocaleString()}`, `Account: ${account.displayName || account.email}`, `Email: ${account.email}`, `Plan: ${item.planId || item.message}`, `Duration: ${item.days || 0} days`, `Streams: ${item.streamLimit || account.streamLimit}`, item.amountPaise ? `Approved amount: ${money(item.amountPaise)}` : "", item.utr ? `UPI reference: ${item.utr}` : ""].filter(Boolean).join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `lcr-invoice-${item.id}.txt`; anchor.click(); URL.revokeObjectURL(url);
  };
  const upiUri = quote ? `upi://pay?${new URLSearchParams({ pa: quote.upiId, pn: quote.payeeName, am: quote.amountRupees.toFixed(2), cu: "INR", tn: `LCR ${quote.planName}` })}` : "";

  if (plansQuery.isLoading) return <div className="page subscription-page"><div className="pay-skeleton"/><div className="pay-skeleton"/></div>;
  if (plansQuery.isError) return <div className="page subscription-page"><div className="pay-alert error"><XCircle size={18}/><span>Plans could not be loaded. {errorText(plansQuery.error, "Try again.")}</span><button className="button secondary small" onClick={() => void plansQuery.refetch()}>Retry</button></div></div>;
  return <div className="page subscription-page manual-payment-page">
    <header className="page-head subscription-heading"><div><p className="eyebrow">Workspace / Access</p><h1>Subscription</h1><p className="subtle">Choose the capacity your broadcast needs. Payments are reviewed manually before access is updated.</p></div><div className={`subscription-status ${account.active ? "active" : "expired"}`}><span className="status-dot"/>{account.active ? `${account.activePlan?.name || "Plan"} · ${account.streamLimit} streams` : "Access needs renewal"}</div></header>
    {notice && <div className="pay-alert success" role="status"><CheckCircle2 size={17}/>{notice}<button className="pay-alert-close" onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error" role="alert"><XCircle size={17}/>{error}<button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <section className="pay-access-strip card">
      <div><span className="metric-kicker">Current access</span><strong>{account.activePlan?.name || "No active plan"}</strong><small>{account.active ? `Valid until ${new Date(account.accessEndsAt).toLocaleDateString()}` : "Choose a plan to continue broadcasting."}</small></div>
      <div><span className="metric-kicker">Concurrent streams</span><strong>{account.streamLimit}</strong><small>Server-side broadcasts at once</small></div>
      <div><span className="metric-kicker">Workspace key</span><strong className="mono">{account.licenseKey}</strong><small>Your existing key stays unchanged</small></div>
      <div className="pay-usage"><span className="metric-kicker">Downloads today</span><strong>{typeof account.downloadsUsedToday === "number" && typeof account.downloadsPerDay === "number" ? `${account.downloadsUsedToday.toLocaleString("en-IN")} / ${account.downloadsPerDay.toLocaleString("en-IN")}` : "Usage not reported"}</strong><small>{typeof account.downloadsUsedToday === "number" && typeof account.downloadsPerDay === "number" && account.downloadsUsedToday >= account.downloadsPerDay ? "Your limit is now reached. Please upgrade your plan." : "Daily allowance is enforced by the server"}</small></div>
    </section>
    <div className="pay-layout">
      <section className="card pay-config">
        <div className="pay-section-title"><div><span className="metric-kicker">01 / Configure access</span><h2>Build your plan</h2><p>Each plan is a one-day template. The final total comes from the server.</p></div><span className="pay-icon"><CreditCard size={19}/></span></div>
        {!plans.length ? <div className="pay-empty"><CircleDollarSign size={25}/><strong>No paid plans are available</strong><span>Check back with your workspace owner.</span></div> : <>
          <div className="pay-plan-picker">{plans.map((plan) => <button key={plan.id} className={`pay-plan-choice ${selectedPlan?.id === plan.id ? "selected" : ""}`} onClick={() => { setPlanId(plan.id); setStreams(1); setDownloads(plan.downloadsPerDay); resetQuote(); }} type="button" data-testid={`button-plan-${plan.id}`}><span><strong>{plan.name}</strong><small>{plan.description || `${plan.downloadsPerDay} downloads each day`}</small></span><span className="pay-plan-marker">{selectedPlan?.id === plan.id ? <Check size={16}/> : ""}</span></button>)}</div>
          {selectedPlan && <div className="pay-controls">
            <label className="field"><span>Billing period</span><select value={durationUnit} onChange={(event) => { setDurationUnit(event.target.value as typeof durationUnit); resetQuote(); }}><option value="days">Days</option><option value="months">Months · 30 days each</option><option value="years">Years · 365 days each</option></select></label>
            <label className="field"><span>Number of {durationUnit}</span><input type="number" min="1" max={durationUnit === "years" ? 10 : 30} value={durationCount} onChange={(event) => { setDurationCount(Math.max(1, Number(event.target.value) || 1)); resetQuote(); }}/></label>
            <div className="pay-stepper"><span>Concurrent streams<small>Up to {selectedPlan.streamLimit}</small></span><div><button type="button" aria-label="Decrease stream count" onClick={() => { setStreams(Math.max(1, streams - 1)); resetQuote(); }} disabled={streams <= 1}><ChevronDown size={16}/></button><strong>{streams}</strong><button type="button" aria-label="Increase stream count" onClick={() => { setStreams(Math.min(selectedPlan.streamLimit, streams + 1)); resetQuote(); }} disabled={streams >= selectedPlan.streamLimit}><ChevronUp size={16}/></button></div></div>
            <label className="field pay-download-field"><span>Downloads per day</span><input type="number" min="1" max="1000000" value={selectedDownloads} onChange={(event) => { setDownloads(Math.max(1, Number(event.target.value) || 1)); resetQuote(); }}/><small>Included template: {selectedPlan.downloadsPerDay}/day</small></label>
          </div>}
          <div className="pay-plan-includes"><span className="metric-kicker">Included with {selectedPlan?.name}</span><div className="pay-feature-list">{selectedPlan?.features.map((feature) => <span key={feature}><Check size={13}/>{feature}</span>)}</div></div>
          <button className="button pay-quote-button" onClick={() => void requestQuote()} disabled={!selectedPlan || quoteMutation.isPending}><span>{quoteMutation.isPending ? "Calculating server quote…" : "Review server quote"}</span>{quoteMutation.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/>}</button>
        </>}
      </section>
      <section className="pay-instructions card">
        <div className="pay-section-title"><div><span className="metric-kicker">02 / Manual UPI</span><h2>Payment instructions</h2><p>Payment starts only after you confirm the quoted amount.</p></div><span className="pay-icon pay-icon-warm"><Smartphone size={19}/></span></div>
        {!quote ? <div className="pay-waiting"><div className="pay-step-number">02</div><strong>Your payment details appear here</strong><span>Configure a plan and review the server quote first.</span><div className="pay-steps"><span><i>1</i> Choose access</span><span><i>2</i> Confirm amount</span><span><i>3</i> Submit UTR</span></div></div> : !confirmed ? <div className="pay-quote-card">
          <div className="pay-quote-total"><span>Server-calculated total</span><strong>{money(quote.amountPaise)}</strong><small>INR · {quote.durationDays} days · {quote.streamLimit} streams</small></div>
          <div className="pay-quote-summary"><span>{quote.planName}<b>{quote.downloadsPerDay.toLocaleString("en-IN")} downloads/day</b></span><span>Total download allowance<b>{quote.totalDownloads.toLocaleString("en-IN")}</b></span></div>
          <div className="pay-confirm-check"><input id="confirm-payment" type="checkbox" onChange={(event) => setConfirmed(event.target.checked)}/><label htmlFor="confirm-payment">I’ve reviewed this amount and want to see the UPI payment instructions.</label></div>
          <button className="button pay-quote-button" disabled={!confirmed} onClick={() => setConfirmed(true)}>Confirm and show QR <Check size={16}/></button>
        </div> : <div className="pay-qr-flow">
          <div className="pay-qr-frame"><QRCodeSVG value={upiUri} size={184} level="M" includeMargin bgColor="#f8f7f0" fgColor="#174640"/></div>
          <div className="pay-qr-title"><strong>Scan with any UPI app</strong><span>Verify the amount before sending</span></div>
          <div className="payee-details"><span>Payee</span><strong>{quote.payeeName}</strong><span>UPI ID</span><div><strong className="mono">{quote.upiId}</strong><button type="button" className="icon-button" aria-label="Copy UPI ID" onClick={() => void copy(quote.upiId)}><Copy size={14}/></button></div></div>
          <div className="pay-amount-line"><span>Send exactly</span><strong>{money(quote.amountPaise)}</strong></div>
          <form onSubmit={(event) => void submitUtr(event)} className="pay-utr-form"><label htmlFor="utr-input">UPI transaction reference (UTR)</label><input id="utr-input" value={utr} onChange={(event) => setUtr(event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 32))} placeholder="12-character bank reference" minLength={6} maxLength={32} required pattern="[A-Za-z0-9]{6,32}" autoComplete="off"/><small>Enter the reference shown in your UPI payment receipt.</small><button className="button pay-quote-button" type="submit" disabled={createRequest.isPending || !/^[A-Za-z0-9]{6,32}$/.test(utr)}>{createRequest.isPending ? "Submitting for review…" : "Submit payment for review"}{createRequest.isPending ? <LoaderCircle className="pay-spin" size={16}/> : <ChevronUp size={17} style={{ transform: "rotate(90deg)" }}/>}</button></form>
          <button type="button" className="pay-back-link" onClick={resetQuote}>Change plan or amount</button>
        </div>}
        <div className="pay-trust-note"><ShieldCheck size={15}/><span>Your plan is not activated by this request. An owner reviews the UTR and confirms access.</span></div>
      </section>
    </div>
    <section className="card pay-request-history">
      <div className="pay-section-title"><div><span className="metric-kicker">Review tracking</span><h2>Payment requests</h2><p>Submitted requests are independent of your completed purchase history.</p></div><button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching}><RefreshCw size={13} className={requestsQuery.isFetching ? "pay-spin" : ""}/> Refresh</button></div>
      {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={21}/><strong>Requests unavailable</strong><button className="button secondary small" onClick={() => void requestsQuery.refetch()}>Try again</button></div> : pendingRequests.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No payment requests yet</strong><span>Submitted UPI references will be listed here for review.</span></div> : <div className="pay-request-list">{pendingRequests.map((request) => <div className="pay-request-row" key={request.id}><div className={`pay-status-mark ${request.status}`}><StatusGlyph status={request.status}/></div><div className="pay-request-main"><strong>{request.planName} · {money(request.amountPaise)}</strong><span>{request.durationDays} days · {request.streamLimit} streams · UTR <b className="mono">{request.utr}</b></span><small>{new Date(request.createdAt).toLocaleString()}</small>{request.reviewNote && <p className="pay-review-note">{request.reviewNote}</p>}</div><span className={`pay-status-tag ${request.status}`}>{request.status}</span></div>)}</div>}
    </section>
    <section className="card pay-request-history">
      <div className="pay-section-title"><div><span className="metric-kicker">Account record</span><h2>Purchase & grant history</h2><p>Approved purchases and owner-granted access remain available for your records.</p></div><span className="pay-history-count">{filteredHistory.length} / {history.length}</span></div>
      <div className="pay-history-toolbar"><label><Filter size={14}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plan, invoice or UTR"/></label><select value={historyType} onChange={(event) => setHistoryType(event.target.value as typeof historyType)} aria-label="Filter transaction type"><option value="all">All records</option><option value="purchase">Purchases</option><option value="grant">Owner grants</option></select><select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date"><option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option></select></div>
      {!history.length ? <div className="pay-empty"><FileText size={23}/><strong>No completed purchases yet</strong><span>Approved payment history and owner grants appear here.</span></div> : !filteredHistory.length ? <div className="pay-empty"><Filter size={22}/><strong>No matching records</strong><button className="button secondary small" onClick={() => { setSearch(""); setHistoryType("all"); setRange("all"); }}>Clear filters</button></div> : <div className="pay-history-list">{filteredHistory.map((item) => <div className="pay-history-row" key={item.id}><div><strong>{item.message}</strong><span>{item.days || 0} days · {item.streamLimit || account.streamLimit} streams{item.amountPaise ? ` · ${money(item.amountPaise)}` : ""}{item.utr ? ` · UTR ${item.utr}` : ""}</span><small>{new Date(item.at).toLocaleString()} · Ref {item.id.slice(0, 8)}</small></div><button className="button secondary small" onClick={() => makeInvoice(item)}><FileText size={13}/> Invoice</button></div>)}</div>}
    </section>
  </div>;
}

function StatusGlyph({ status }: { status: PaymentRequest["status"] }) {
  return status === "approved" ? <CheckCircle2 size={17}/> : status === "rejected" ? <XCircle size={17}/> : <LoaderCircle size={17}/>;
}

type PlanDraft = { name: string; description: string; pricePerStreamDayPaise: string; downloadsPerDay: string; streamLimit: string; features: string; active: boolean };
const toDraft = (plan: BillingPlan): PlanDraft => ({ name: plan.name, description: plan.description, pricePerStreamDayPaise: String(plan.pricePerStreamDayPaise), downloadsPerDay: String(plan.downloadsPerDay), streamLimit: String(plan.streamLimit), features: plan.features.join("\n"), active: plan.active });
const newDraft = (): PlanDraft => ({ name: "", description: "", pricePerStreamDayPaise: "0", downloadsPerDay: "10", streamLimit: "1", features: "", active: true });

export function OwnerPaymentPanel({ ownerPassword }: { ownerPassword: string }) {
  const queryClient = useQueryClient();
  const requestOpts = { headers: { "X-Owner-Password": ownerPassword } };
  const plansQuery = useListBillingPlans({ request: requestOpts });
  const settingsQuery = useGetOwnerPaymentSettings({ request: requestOpts });
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const requestsQuery = useListOwnerPaymentRequests(status ? { status } : {}, { request: requestOpts });
  const createPlan = useCreateBillingPlan({ request: requestOpts });
  const updatePlan = useUpdateBillingPlan({ request: requestOpts });
  const updateSettings = useUpdateOwnerPaymentSettings({ request: requestOpts });
  const reviewRequest = useReviewOwnerPaymentRequest({ request: requestOpts });
  const [drafts, setDrafts] = useState<Record<string, PlanDraft>>({});
  const [adding, setAdding] = useState(false);
  const [createDraft, setCreateDraft] = useState<PlanDraft>(newDraft());
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [settingsInitialized, setSettingsInitialized] = useState(false);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const plans = plansQuery.data?.plans ?? [];
  const requests = requestsQuery.data?.requests ?? [];
  const refreshOwnerLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getListBillingPlansQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetOwnerPaymentSettingsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListOwnerPaymentRequestsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListAccountPaymentRequestsQueryKey() }),
    ]);
  };
  useEffect(() => {
    if (settingsQuery.data && !settingsInitialized) {
      setUpiId(settingsQuery.data.upiId); setPayeeName(settingsQuery.data.payeeName); setSettingsInitialized(true);
    }
  }, [settingsQuery.data, settingsInitialized]);
  const parsePlan = (draft: PlanDraft) => ({
    name: draft.name.trim(), description: draft.description.trim(), durationDays: 1,
    price: `₹${(Number(draft.pricePerStreamDayPaise) / 100).toFixed(2)} / stream / day`,
    pricePerStreamDayPaise: Math.max(0, Math.round(Number(draft.pricePerStreamDayPaise) || 0)),
    downloadsPerDay: Math.max(1, Number(draft.downloadsPerDay) || 1),
    streamLimit: Math.max(1, Number(draft.streamLimit) || 1),
    features: draft.features.split("\n").map((feature) => feature.trim()).filter(Boolean).slice(0, 30),
    active: draft.active,
  });
  const persistPlan = async (id: string, draft: PlanDraft) => {
    setError(""); setFeedback("");
    try {
      await updatePlan.mutateAsync({ planId: id, data: parsePlan(draft) as BillingPlanUpdate });
      setFeedback("Plan template updated."); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not update the plan.")); }
  };
  const addPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    try {
      await createPlan.mutateAsync({ data: parsePlan(createDraft) as BillingPlanInput });
      setCreateDraft(newDraft()); setAdding(false); setFeedback("New plan template created."); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not create the plan.")); }
  };
  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setFeedback("");
    try {
      await updateSettings.mutateAsync({ data: { upiId: upiId.trim(), payeeName: payeeName.trim() } });
      setFeedback("UPI payment details saved."); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not save UPI details.")); }
  };
  const review = async (requestId: string, action: "approve" | "reject") => {
    setError(""); setFeedback("");
    try {
      await reviewRequest.mutateAsync({ requestId, data: { action, note: reviewNotes[requestId]?.trim() || undefined } });
      setFeedback(action === "approve" ? "Payment approved. Account access has been updated." : "Payment request rejected.");
      setReviewNotes((previous) => ({ ...previous, [requestId]: "" })); await refreshOwnerLists();
    } catch (reason) { setError(errorText(reason, "Could not review this payment request.")); }
  };
  return <main className="owner-content owner-payment-content">
    <div className="page-head owner-page-heading"><div><p className="eyebrow">Commerce / Manual UPI</p><h1>Payments</h1><p className="subtle">Set plan economics, keep UPI details current, and review submitted transaction references.</p></div><div className="owner-page-badge"><ShieldCheck size={16}/> Owner review</div></div>
    {feedback && <div className="pay-alert success"><CheckCircle2 size={17}/>{feedback}<button className="pay-alert-close" onClick={() => setFeedback("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {error && <div className="pay-alert error"><XCircle size={17}/>{error}<button className="pay-alert-close" onClick={() => setError("")} aria-label="Dismiss error"><X size={15}/></button></div>}
    <div className="owner-payment-columns">
      <section className="card owner-pay-card">
        <div className="pay-section-title"><div><span className="metric-kicker">Pricing templates</span><h2>Access plans</h2><p>Daily base price is for one stream. Plan duration stays one day.</p></div><button className="button secondary small" onClick={() => setAdding((value) => !value)}><span>{adding ? "Cancel" : "Add plan"}</span></button></div>
        {plansQuery.isLoading ? <div className="pay-loading-line"/> : plansQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load plans</strong><button className="button secondary small" onClick={() => void plansQuery.refetch()}>Retry</button></div> : <div className="owner-plan-list">{plans.filter((plan) => !plan.isTrial).map((plan) => {
          const value = drafts[plan.id] ?? toDraft(plan);
          const change = (key: keyof PlanDraft, next: string | boolean) => setDrafts((current) => ({ ...current, [plan.id]: { ...(current[plan.id] ?? toDraft(plan)), [key]: next } }));
          return <article className="owner-plan-editor" key={plan.id}><div className="owner-plan-editor-head"><div><span className="metric-kicker">Template · {plan.durationDays} day</span><strong>{value.name || plan.name}</strong></div><label className="pay-active-toggle"><input type="checkbox" checked={value.active} onChange={(event) => change("active", event.target.checked)}/><span>{value.active ? "Enabled" : "Disabled"}</span></label></div>
            <div className="owner-plan-fields"><label className="field"><span>Plan name</span><input value={value.name} onChange={(event) => change("name", event.target.value)}/></label><label className="field"><span>Daily base · paise</span><input type="number" min="0" value={value.pricePerStreamDayPaise} onChange={(event) => change("pricePerStreamDayPaise", event.target.value)}/></label><label className="field"><span>Included downloads/day</span><input type="number" min="1" value={value.downloadsPerDay} onChange={(event) => change("downloadsPerDay", event.target.value)}/></label><label className="field"><span>Concurrent stream cap</span><input type="number" min="1" max="100" value={value.streamLimit} onChange={(event) => change("streamLimit", event.target.value)}/></label><label className="field full"><span>Description</span><input value={value.description} onChange={(event) => change("description", event.target.value)}/></label><label className="field full"><span>Features · one per line</span><textarea rows={3} value={value.features} onChange={(event) => change("features", event.target.value)}/></label></div>
            <div className="owner-plan-editor-foot"><small>Current price label: {plan.price}</small><button className="button small" onClick={() => void persistPlan(plan.id, value)} disabled={updatePlan.isPending}><Save size={13}/> Save template</button></div>
          </article>;
        })}</div>}
        {adding && <form className="owner-plan-editor owner-add-plan" onSubmit={(event) => void addPlan(event)}><div className="owner-plan-editor-head"><strong>New one-day template</strong><label className="pay-active-toggle"><input type="checkbox" checked={createDraft.active} onChange={(event) => setCreateDraft((draft) => ({ ...draft, active: event.target.checked }))}/><span>Enabled</span></label></div><div className="owner-plan-fields"><label className="field"><span>Name</span><input required value={createDraft.name} onChange={(event) => setCreateDraft((draft) => ({ ...draft, name: event.target.value }))}/></label><label className="field"><span>Daily base · paise</span><input type="number" min="0" value={createDraft.pricePerStreamDayPaise} onChange={(event) => setCreateDraft((draft) => ({ ...draft, pricePerStreamDayPaise: event.target.value }))}/></label><label className="field"><span>Downloads/day</span><input type="number" min="1" value={createDraft.downloadsPerDay} onChange={(event) => setCreateDraft((draft) => ({ ...draft, downloadsPerDay: event.target.value }))}/></label><label className="field"><span>Concurrent streams</span><input type="number" min="1" max="100" value={createDraft.streamLimit} onChange={(event) => setCreateDraft((draft) => ({ ...draft, streamLimit: event.target.value }))}/></label><label className="field full"><span>Description</span><input value={createDraft.description} onChange={(event) => setCreateDraft((draft) => ({ ...draft, description: event.target.value }))}/></label><label className="field full"><span>Features · one per line</span><textarea rows={3} value={createDraft.features} onChange={(event) => setCreateDraft((draft) => ({ ...draft, features: event.target.value }))}/></label></div><button className="button small" type="submit" disabled={createPlan.isPending}>{createPlan.isPending ? "Creating…" : "Create plan"}</button></form>}
      </section>
      <section className="card owner-pay-card owner-upi-card"><div className="pay-section-title"><div><span className="metric-kicker">Payment destination</span><h2>UPI details</h2><p>These are shown to customers alongside the quote and QR.</p></div><span className="pay-icon pay-icon-warm"><Smartphone size={19}/></span></div>
        {settingsQuery.isLoading ? <div className="pay-loading-line"/> : settingsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>UPI details unavailable</strong><button className="button secondary small" onClick={() => void settingsQuery.refetch()}>Retry</button></div> : <form className="owner-upi-form" onSubmit={(event) => void saveSettings(event)}><label className="field"><span>UPI ID</span><input required minLength={3} maxLength={100} value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="name@bank"/></label><label className="field"><span>Payee name</span><input required minLength={1} maxLength={100} value={payeeName} onChange={(event) => setPayeeName(event.target.value)} placeholder="Account holder"/></label><button className="button" type="submit" disabled={updateSettings.isPending || !upiId.trim() || !payeeName.trim()}><Save size={14}/>{updateSettings.isPending ? "Saving…" : "Save UPI details"}</button>{settingsQuery.data?.updatedAt && <small>Last updated {new Date(settingsQuery.data.updatedAt).toLocaleString()}</small>}</form>}
      </section>
    </div>
    <section className="card owner-pay-card owner-review-card"><div className="pay-section-title"><div><span className="metric-kicker">Manual verification</span><h2>Payment review queue</h2><p>Verify the amount and UTR against your UPI statement before approving.</p></div><button className="button secondary small" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching}><RefreshCw size={13}/> Refresh</button></div>
      <div className="owner-review-tabs">{([["pending","Pending"],["approved","Approved"],["rejected","Rejected"],["","All requests"]] as const).map(([value,label]) => <button key={label} className={status === value ? "active" : ""} onClick={() => setStatus(value || undefined)}>{label}</button>)}</div>
      {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={20}/><strong>Could not load payment requests</strong><button className="button secondary small" onClick={() => void requestsQuery.refetch()}>Retry</button></div> : requests.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No {status || ""} requests</strong><span>New customer submissions will appear in this queue.</span></div> : <div className="owner-review-list">{requests.map((request) => <OwnerPaymentRequestCard key={request.id} request={request} note={reviewNotes[request.id] ?? ""} onNote={(value) => setReviewNotes((current) => ({ ...current, [request.id]: value }))} onReview={(action) => void review(request.id, action)} busy={reviewRequest.isPending}/>)}</div>}
    </section>
  </main>;
}

function OwnerPaymentRequestCard({ request, note, onNote, onReview, busy }: { request: PaymentRequest; note: string; onNote: (value: string) => void; onReview: (action: "approve" | "reject") => void; busy: boolean }) {
  return <article className="owner-review-item"><div className="owner-review-item-main"><div className={`pay-status-mark ${request.status}`}><StatusGlyph status={request.status}/></div><div className="owner-review-identity"><strong>{request.accountName || "Account"}</strong><span>{request.accountEmail}</span><small>{new Date(request.createdAt).toLocaleString()} · {request.id.slice(0, 8)}</small></div><span className={`pay-status-tag ${request.status}`}>{request.status}</span></div>
    <div className="owner-review-facts"><div><span>Plan</span><strong>{request.planName}</strong></div><div><span>Paid amount</span><strong>{money(request.amountPaise)}</strong></div><div><span>Term & capacity</span><strong>{request.durationDays} days · {request.streamLimit} streams</strong></div><div><span>Downloads/day</span><strong>{request.downloadsPerDay.toLocaleString("en-IN")}</strong></div><div className="owner-utr"><span>UTR / bank reference</span><strong className="mono">{request.utr}</strong></div></div>
    {request.status === "pending" ? <div className="owner-review-actions"><label className="field"><span>Review note · optional</span><input value={note} maxLength={500} onChange={(event) => onNote(event.target.value)} placeholder="Add a note for the customer"/></label><div><button className="button secondary small" onClick={() => onReview("reject")} disabled={busy}><XCircle size={14}/> Reject</button><button className="button small" onClick={() => onReview("approve")} disabled={busy}><Check size={14}/> Approve & activate</button></div></div> : request.reviewNote && <p className="pay-review-note">Review note: {request.reviewNote}</p>}
  </article>;
}