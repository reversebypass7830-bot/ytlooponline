import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  Gift,
  LoaderCircle,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

type DemoStatus = "pending" | "approved" | "rejected";
type TransactionType = "purchase" | "grant" | "request";

type AccountHistoryEntry = {
  id: string;
  type: string;
  message: string;
  at: string;
  planId?: string;
  days?: number;
  streamLimit?: number;
  streamsPerDay?: number;
  downloadsPerDay?: number;
  amountPaise?: number;
  utr?: string;
  paymentRequestId?: string;
};

type DemoRequest = {
  id: string;
  status: DemoStatus;
  planId: string;
  planName: string;
  packType: string;
  createdAt: string;
  reviewedAt?: string;
  durationDays: number;
  streamLimit: number;
  streamsPerDay: number;
  downloadsPerDay: number;
  amountPaise: number;
  utr: string;
  reviewNote?: string | null;
};

type TransactionRow = {
  id: string;
  requestId?: string;
  type: TransactionType;
  status: DemoStatus;
  message: string;
  at: string;
  planId?: string;
  paymentRequestId?: string;
  packType?: string;
  days?: number;
  streamLimit?: number;
  streamsPerDay?: number;
  downloadsPerDay?: number;
  amountPaise?: number;
  utr?: string;
  reviewNote?: string | null;
};

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const demoAccount = {
  displayName: "Anaya Rao",
  email: "anaya@example.com",
  history: [
    {
      id: "purchase-8842",
      paymentRequestId: "request-approved-8842",
      type: "purchase",
      message: "Creator plan",
      at: daysAgo(12),
      planId: "creator",
      days: 30,
      streamsPerDay: 3,
      amountPaise: 149900,
      utr: "421839205671",
    },
    {
      id: "grant-1739",
      type: "grant",
      message: "Broadcast access",
      at: daysAgo(34),
      planId: "broadcast",
      days: 7,
      streamLimit: 1,
    },
  ] satisfies AccountHistoryEntry[],
};

const demoRequests: DemoRequest[] = [
  {
    id: "request-approved-8842",
    status: "approved",
    planId: "creator",
    planName: "Creator plan",
    packType: "Live",
    createdAt: daysAgo(12),
    reviewedAt: daysAgo(11),
    durationDays: 30,
    streamLimit: 2,
    streamsPerDay: 3,
    downloadsPerDay: 75,
    amountPaise: 149900,
    utr: "421839205671",
  },
  {
    id: "request-pending-5290",
    status: "pending",
    planId: "studio",
    planName: "Studio plan",
    packType: "Live",
    createdAt: daysAgo(2),
    durationDays: 30,
    streamLimit: 4,
    streamsPerDay: 6,
    downloadsPerDay: 150,
    amountPaise: 349900,
    utr: "840271395620",
  },
  {
    id: "request-rejected-3017",
    status: "rejected",
    planId: "download",
    planName: "Download plan",
    packType: "Downloads",
    createdAt: daysAgo(24),
    durationDays: 30,
    streamLimit: 1,
    streamsPerDay: 1,
    downloadsPerDay: 100,
    amountPaise: 49900,
    utr: "913750284166",
    reviewNote: "Please check the UTR and submit the correct reference.",
  },
];

const money = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function statusLabel(status: DemoStatus) {
  if (status === "approved") return "Completed";
  if (status === "rejected") return "Rejected";
  return "Pending review";
}

export function TransactionsPreview({ layout = "current" }: { layout?: "current" | "refined" }) {
  const requests = demoRequests;
  const requestsQuery = { isLoading: false, isError: false, isFetching: false, refetch: async () => undefined };
  const account = demoAccount;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DemoStatus>("all");
  const [range, setRange] = useState("all");
  const [isMockRefreshing, setIsMockRefreshing] = useState(false);

  const transactions = useMemo(() => {
    const rows: TransactionRow[] = account.history
      .filter((item) => item.type === "purchase" || item.type === "grant")
      .map((item) => ({
        ...item,
        type: item.type as "purchase" | "grant",
        status: "approved",
      }));

    for (const request of requests) {
      const match = request.status === "approved"
        ? rows.find((item) => item.type === "purchase" && (
          item.paymentRequestId === request.id
          || (item.planId === request.planId && Math.abs(new Date(item.at).getTime() - new Date(request.createdAt).getTime()) < 3 * 86400000)
        ))
        : undefined;
      if (match) {
        match.requestId = request.id;
        match.amountPaise ??= request.amountPaise;
        match.utr ??= request.utr;
        match.planId ??= request.planId;
        match.days ??= request.durationDays;
        match.streamLimit ??= request.streamLimit;
        match.streamsPerDay ??= request.streamsPerDay;
        match.downloadsPerDay ??= request.downloadsPerDay;
      } else {
        rows.push({
          id: request.id,
          requestId: request.id,
          type: request.status === "approved" ? "purchase" : "request",
          status: request.status,
          message: `${request.planName} · ${request.packType}`,
          at: request.status === "approved" ? request.reviewedAt || request.createdAt : request.createdAt,
          planId: request.planId,
          packType: request.packType,
          days: request.durationDays,
          streamLimit: request.streamLimit,
          streamsPerDay: request.streamsPerDay,
          downloadsPerDay: request.downloadsPerDay,
          amountPaise: request.amountPaise,
          utr: request.utr,
          reviewNote: request.reviewNote,
        });
      }
    }

    return rows.sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime());
  }, [account.history, requests]);

  const filteredTransactions = transactions.filter((item) => {
    const searchable = `${item.message} ${item.planId ?? ""} ${item.id} ${item.utr ?? ""} ${item.amountPaise ? money(item.amountPaise) : ""}`.toLowerCase();
    const matchesSearch = !search.trim() || searchable.includes(search.trim().toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const ageDays = (Date.now() - new Date(item.at).getTime()) / 86400000;
    const matchesRange = range === "all" || (Number.isFinite(ageDays) && ageDays >= 0 && ageDays <= Number(range));
    return matchesSearch && matchesType && matchesStatus && matchesRange;
  });

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
    setRange("all");
  };

  const hasActiveFilters = Boolean(search.trim()) || typeFilter !== "all" || statusFilter !== "all" || range !== "all";

  const refreshPreview = () => {
    setIsMockRefreshing(true);
    void requestsQuery.refetch().finally(() => {
      window.setTimeout(() => setIsMockRefreshing(false), 600);
    });
  };

  const downloadInvoice = (item: TransactionRow) => {
    const content = [
      "YT LOOP · TRANSACTION RECORD",
      `Reference: ${item.requestId || item.id}`,
      `Date: ${new Date(item.at).toLocaleString()}`,
      `Account: ${account.displayName || account.email}`,
      `Email: ${account.email}`,
      `Plan: ${item.planId || item.message}`,
      `Status: ${statusLabel(item.status)}`,
      `Duration: ${item.days || 0} days`,
      item.streamsPerDay ? `Broadcast starts per day: ${item.streamsPerDay}` : "",
      item.streamLimit ? `Concurrent broadcast cap: ${item.streamLimit}` : "",
      item.downloadsPerDay ? `Downloads per day: ${item.downloadsPerDay}` : "",
      typeof item.amountPaise === "number" ? `Amount: ${money(item.amountPaise)}` : "",
      item.utr ? `UPI reference: ${item.utr}` : "",
    ].filter(Boolean).join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `yt-loop-transaction-${item.requestId || item.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (layout === "refined") {
    return <div className="page subscription-page manual-payment-page transactions-page transactions-refined">
      <header className="page-head subscription-heading">
        <div><p className="eyebrow">Account / Billing</p><h1>Transactions</h1><p className="subtle">Filter UPI requests, approved purchases, and owner-granted access.</p></div>
      </header>
      <section className="card pay-request-history transaction-history-card">
        <div className="transaction-card-header">
          <div className="transaction-heading-copy">
            <span className="metric-kicker">Account record</span>
            <h2>Transaction history</h2>
            <p>Payment requests stay pending until the owner approves them.</p>
          </div>
          <div className="transaction-heading-actions">
            <div className="transaction-count" aria-live="polite"><strong>{filteredTransactions.length}</strong><span>of {transactions.length} records</span></div>
            <button className="button secondary transaction-refresh" type="button" onClick={refreshPreview} disabled={isMockRefreshing} aria-label="Refresh transaction history and payment requests" data-testid="button-refresh-account-requests">
              <RefreshCw size={15} className={isMockRefreshing ? "pay-spin" : ""}/><span>{isMockRefreshing ? "Refreshing" : "Refresh"}</span>
            </button>
          </div>
        </div>
        <div className="transaction-refresh-status" role="status" aria-live="polite">
          {isMockRefreshing ? <><LoaderCircle size={14} className="pay-spin"/> Updating transaction records…</> : <><CheckCircle2 size={14}/> Payment request statuses update every 20 seconds.</>}
        </div>
        <div className="pay-history-toolbar transaction-toolbar" role="search" aria-label="Filter transaction history">
          <label className="transaction-search-field" htmlFor="preview-transaction-search">
            <Search size={16} aria-hidden="true"/>
            <input id="preview-transaction-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plan, UTR, or amount" aria-label="Search transactions" data-testid="input-history-search"/>
          </label>
          <div className="transaction-filters">
            <label className="transaction-filter-control" htmlFor="preview-transaction-type">
              <span>Type</span>
              <select id="preview-transaction-type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)} aria-label="Filter transaction type" data-testid="select-history-type">
                <option value="all">All types</option><option value="purchase">Purchases</option><option value="grant">Owner grants</option><option value="request">Payment requests</option>
              </select>
            </label>
            <label className="transaction-filter-control" htmlFor="preview-transaction-status">
              <span>Status</span>
              <select id="preview-transaction-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} aria-label="Filter transaction status" data-testid="select-history-status">
                <option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Completed</option><option value="rejected">Rejected</option>
              </select>
            </label>
            <label className="transaction-filter-control" htmlFor="preview-transaction-range">
              <span>Date range</span>
              <select id="preview-transaction-range" value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date" data-testid="select-history-date">
                <option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option>
              </select>
            </label>
          </div>
          {hasActiveFilters && <button className="button ghost small transaction-clear-filters" type="button" onClick={clearFilters}>Clear filters</button>}
        </div>
        {filteredTransactions.length === 0
          ? <div className="pay-empty transaction-empty"><Filter size={22}/><strong>No matching transactions</strong><span>Change your search or filters to see more records.</span><button className="button secondary small" type="button" onClick={clearFilters}>Clear filters</button></div>
          : <div className="pay-history-list transaction-list" aria-busy={isMockRefreshing}>
            {filteredTransactions.map((item) => <article className="pay-history-row transaction-row" key={`${item.type}-${item.id}`} data-testid={`row-transaction-${item.id}`}>
              <div className={`transaction-kind-icon ${item.type} ${item.status}`} aria-hidden="true">
                {item.type === "grant" ? <Gift size={17}/> : item.type === "request" ? <Clock3 size={17}/> : <CreditCard size={17}/>}
              </div>
              <div className="transaction-copy">
                <div className="transaction-title"><strong>{item.message}</strong><span className={`pay-status-tag ${item.status}`}>{statusLabel(item.status)}</span></div>
                <div className="transaction-summary">
                  <span className={`transaction-type-label ${item.type}`}>{item.type === "grant" ? "Owner grant" : item.type === "request" ? "Payment request" : "Purchase"}</span>
                  {item.packType && <span>{item.packType}</span>}
                  {item.days && <span>{item.days} days</span>}
                  {item.streamsPerDay && <span>{item.streamsPerDay} starts/day</span>}
                  {item.streamLimit && <span>{item.streamLimit} concurrent</span>}
                  {item.downloadsPerDay && <span>{item.downloadsPerDay.toLocaleString("en-IN")} downloads/day</span>}
                </div>
                <div className="transaction-meta-line">
                  <span><CalendarDays size={13}/>{new Date(item.at).toLocaleString()}</span>
                  <span className="transaction-reference">Ref {(item.requestId || item.id).slice(0, 8)}</span>
                  {item.utr && <span className="transaction-utr">UTR {item.utr}</span>}
                </div>
                {item.reviewNote && <p className="pay-review-note">{item.reviewNote}</p>}
              </div>
              <div className="transaction-row-actions">
                {typeof item.amountPaise === "number" && <strong className="transaction-amount">{money(item.amountPaise)}</strong>}
                {item.status === "approved" && <button className="button ghost small transaction-record-button" type="button" onClick={() => downloadInvoice(item)} data-testid={`button-invoice-${item.id}`}><FileText size={14}/><span>Record</span></button>}
              </div>
            </article>)}
          </div>}
      </section>
    </div>;
  }

  return <div className="page subscription-page manual-payment-page transactions-page">
    <header className="page-head subscription-heading">
      <div><p className="eyebrow">Account / Billing</p><h1>Transactions</h1><p className="subtle">Filter UPI requests, approved purchases, and owner-granted access.</p></div>
    </header>
    <section className="card pay-request-history transaction-history-card">
      <div className="pay-section-title">
        <div><span className="metric-kicker">Account record</span><h2>Transaction history</h2><p>Payment requests remain pending until the owner reviews them.</p></div>
        <div className="transaction-count"><strong>{filteredTransactions.length}</strong><span>of {transactions.length}</span></div>
      </div>
      <div className="pay-history-toolbar transaction-toolbar">
        <label><Filter size={14}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plan, UTR, or amount" aria-label="Search transactions" data-testid="input-history-search"/></label>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)} aria-label="Filter transaction type" data-testid="select-history-type">
          <option value="all">All types</option><option value="purchase">Purchases</option><option value="grant">Owner grants</option><option value="request">Payment requests</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} aria-label="Filter transaction status" data-testid="select-history-status">
          <option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Completed</option><option value="rejected">Rejected</option>
        </select>
        <select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date" data-testid="select-history-date">
          <option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option>
        </select>
      </div>
      {requestsQuery.isLoading ? <div className="pay-loading-line"/> : requestsQuery.isError ? <div className="pay-empty"><XCircle size={21}/><strong>Transactions unavailable</strong><button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()}>Try again</button></div> : transactions.length === 0 ? <div className="pay-empty"><FileText size={23}/><strong>No transactions yet</strong><span>Payment requests, purchases, and owner grants will appear here.</span></div> : filteredTransactions.length === 0 ? <div className="pay-empty"><Filter size={22}/><strong>No matching transactions</strong><button className="button secondary small" type="button" onClick={clearFilters}>Clear filters</button></div> : <div className="pay-history-list transaction-list">
        {filteredTransactions.map((item) => <article className="pay-history-row transaction-row" key={`${item.type}-${item.id}`} data-testid={`row-transaction-${item.id}`}>
          <div className="transaction-copy">
            <div className="transaction-title"><strong>{item.message}</strong><span className={`pay-status-tag ${item.status}`}>{statusLabel(item.status)}</span></div>
            <span>{item.type === "grant" ? "Owner grant" : item.type === "request" ? "Payment request" : "Purchase"}{item.packType ? ` · ${item.packType}` : ""}{item.days ? ` · ${item.days} days` : ""}{item.streamsPerDay ? ` · ${item.streamsPerDay} starts/day` : ""}{item.streamLimit ? ` · ${item.streamLimit} concurrent cap` : ""}{item.downloadsPerDay ? ` · ${item.downloadsPerDay.toLocaleString("en-IN")} downloads/day` : ""}{typeof item.amountPaise === "number" ? ` · ${money(item.amountPaise)}` : ""}{item.utr ? ` · UTR ${item.utr}` : ""}</span>
            <small>{new Date(item.at).toLocaleString()} · Ref {(item.requestId || item.id).slice(0, 8)}</small>
            {item.reviewNote && <p className="pay-review-note">{item.reviewNote}</p>}
          </div>
          {item.status === "approved" && <button className="button secondary small" type="button" onClick={() => downloadInvoice(item)} data-testid={`button-invoice-${item.id}`}><FileText size={13}/> Record</button>}
        </article>)}
      </div>}
      <div className="transaction-history-footer">
        <button className="button secondary small" type="button" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching} data-testid="button-refresh-account-requests"><RefreshCw size={13} className={requestsQuery.isFetching ? "pay-spin" : ""}/> Refresh</button>
        <span>{requestsQuery.isFetching ? <><LoaderCircle size={13} className="pay-spin"/> Updating…</> : <><CheckCircle2 size={13}/> Status refreshes automatically</>}</span>
      </div>
    </section>
  </div>;
}