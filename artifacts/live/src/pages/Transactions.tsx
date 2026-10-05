import { useMemo, useState } from "react";
import {
  ArrowLeft,
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
import { Link } from "wouter";
import {
  getListAccountPaymentRequestsQueryKey,
  useListAccountPaymentRequests,
} from "@workspace/api-client-react";
import type { PaymentRequest } from "@workspace/api-client-react";
import "./ManualPayments.css";
import "./Transactions.css";

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

type TransactionAccount = {
  displayName: string;
  email: string;
  history: AccountHistoryEntry[];
};

type TransactionRow = {
  id: string;
  requestId?: string;
  type: "purchase" | "grant" | "request";
  status: PaymentRequest["status"];
  message: string;
  at: string;
  planId?: string;
  paymentRequestId?: string;
  packType?: PaymentRequest["packType"];
  days?: number;
  streamLimit?: number;
  streamsPerDay?: number;
  downloadsPerDay?: number;
  amountPaise?: number;
  utr?: string;
  reviewNote?: string | null;
};

const money = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function statusLabel(status: PaymentRequest["status"]) {
  if (status === "approved") return "Completed";
  if (status === "rejected") return "Rejected";
  return "Pending review";
}

export function TransactionsPage({
  account,
  onRefreshAccount,
}: {
  account: TransactionAccount;
  onRefreshAccount: () => Promise<void>;
}) {
  const requestsQuery = useListAccountPaymentRequests({
    query: { queryKey: getListAccountPaymentRequestsQueryKey(), refetchInterval: 20000 },
  });
  const requests = requestsQuery.data?.requests ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "purchase" | "grant" | "request">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentRequest["status"]>("all");
  const [range, setRange] = useState("all");
  const [isRefreshingAccount, setIsRefreshingAccount] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const isRefreshing = requestsQuery.isFetching || isRefreshingAccount;

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

  const handleRefresh = async () => {
    setRefreshError("");
    setIsRefreshingAccount(true);
    try {
      await Promise.all([requestsQuery.refetch(), onRefreshAccount()]);
    } catch {
      setRefreshError("We couldn't refresh your account history. Please try again.");
    } finally {
      setIsRefreshingAccount(false);
    }
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

  const hasActiveFilters = Boolean(search.trim()) || typeFilter !== "all" || statusFilter !== "all" || range !== "all";

  return <div className="page subscription-page manual-payment-page transactions-page">
    <header className="page-head subscription-heading">
      <div>
        <Link href="/dashboard" className="transactions-back-link" data-testid="button-transactions-back">
          <ArrowLeft size={16} aria-hidden="true"/>
          <span>Back to Dashboard</span>
        </Link>
        <p className="eyebrow">Account / Billing</p><h1>Transactions</h1><p className="subtle">Filter UPI requests, approved purchases, and owner-granted access.</p>
      </div>
    </header>
    <section className="card pay-request-history transaction-history-card">
      <div className="transaction-card-header">
        <div className="transaction-heading-copy">
          <span className="metric-kicker">Account record</span>
          <h2>Transaction history</h2>
          <p>Payment requests stay pending until the owner approves them.</p>
        </div>
        <div className="transaction-heading-actions">
          <div className="transaction-count" aria-live="polite">
            <strong>{filteredTransactions.length}</strong>
            <span>of {transactions.length} records</span>
          </div>
          <button
            className="button secondary transaction-refresh"
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
            aria-label="Refresh transaction history and payment requests"
            data-testid="button-refresh-account-requests"
          >
            <RefreshCw size={15} className={isRefreshing ? "pay-spin" : ""}/>
            <span>{isRefreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
      </div>
      <div className="transaction-refresh-status" role="status" aria-live="polite">
        {isRefreshing
          ? <><LoaderCircle size={14} className="pay-spin"/> Updating transaction records…</>
          : <><CheckCircle2 size={14}/> Payment request statuses update every 20 seconds.</>}
      </div>
      {(refreshError || (requestsQuery.isError && transactions.length > 0)) && <div className="transaction-inline-error" role="alert">
        <XCircle size={16}/>
        <span>{refreshError || "Payment request statuses couldn't be refreshed. Existing account records are still shown."}</span>
        <button className="button ghost small" type="button" onClick={() => void handleRefresh()} disabled={isRefreshing}>Try again</button>
      </div>}
      <div className="pay-history-toolbar transaction-toolbar" role="search" aria-label="Filter transaction history">
        <label className="transaction-search-field" htmlFor="transaction-search">
          <Search size={16} aria-hidden="true"/>
          <input
            id="transaction-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plan, UTR, or amount"
            aria-label="Search transactions"
            data-testid="input-history-search"
          />
        </label>
        <div className="transaction-filters">
          <label className="transaction-filter-control" htmlFor="transaction-type">
            <span>Type</span>
            <select id="transaction-type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)} aria-label="Filter transaction type" data-testid="select-history-type">
              <option value="all">All types</option><option value="purchase">Purchases</option><option value="grant">Owner grants</option><option value="request">Payment requests</option>
            </select>
          </label>
          <label className="transaction-filter-control" htmlFor="transaction-status">
            <span>Status</span>
            <select id="transaction-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} aria-label="Filter transaction status" data-testid="select-history-status">
              <option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Completed</option><option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="transaction-filter-control" htmlFor="transaction-date-range">
            <span>Date range</span>
            <select id="transaction-date-range" value={range} onChange={(event) => setRange(event.target.value)} aria-label="Filter by date" data-testid="select-history-date">
              <option value="all">Any time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option>
            </select>
          </label>
        </div>
        {hasActiveFilters && <button className="button ghost small transaction-clear-filters" type="button" onClick={clearFilters}>Clear filters</button>}
      </div>
      {requestsQuery.isLoading && transactions.length === 0
        ? <div className="transaction-loading-list" role="status" aria-label="Loading transactions">
            {[0, 1, 2].map((row) => <div className="transaction-skeleton-row" key={row} aria-hidden="true">
              <span className="transaction-skeleton-icon"/>
              <span className="transaction-skeleton-copy"><i/><i/><i/></span>
              <span className="transaction-skeleton-amount"><i/><i/></span>
            </div>)}
          </div>
        : requestsQuery.isError && transactions.length === 0
          ? <div className="pay-empty transaction-empty"><XCircle size={22}/><strong>Transactions unavailable</strong><span>We couldn't load your payment requests.</span><button className="button secondary small" type="button" onClick={() => void handleRefresh()} disabled={isRefreshing}>Try again</button></div>
          : transactions.length === 0
            ? <div className="pay-empty transaction-empty"><FileText size={23}/><strong>No transactions yet</strong><span>Payment requests, purchases, and owner grants will appear here.</span></div>
            : filteredTransactions.length === 0
              ? <div className="pay-empty transaction-empty"><Filter size={22}/><strong>No matching transactions</strong><span>Change your search or filters to see more records.</span><button className="button secondary small" type="button" onClick={clearFilters}>Clear filters</button></div>
              : <div className="pay-history-list transaction-list" aria-busy={isRefreshing}>
        {filteredTransactions.map((item) => <article className="pay-history-row transaction-row" key={`${item.type}-${item.id}`} data-testid={`row-transaction-${item.id}`}>
          <div className={`transaction-kind-icon ${item.type} ${item.status}`} aria-hidden="true">
            {item.type === "grant" ? <Gift size={17}/> : item.type === "request" ? <Clock3 size={17}/> : <CreditCard size={17}/>}
          </div>
          <div className="transaction-copy">
            <div className="transaction-title">
              <strong>{item.message}</strong>
              <span className={`pay-status-tag ${item.status}`}>{statusLabel(item.status)}</span>
            </div>
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