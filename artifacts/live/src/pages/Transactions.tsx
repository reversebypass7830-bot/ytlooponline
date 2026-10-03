import { useMemo, useState } from "react";
import { CheckCircle2, FileText, Filter, LoaderCircle, RefreshCw, XCircle } from "lucide-react";
import {
  getListAccountPaymentRequestsQueryKey,
  useListAccountPaymentRequests,
} from "@workspace/api-client-react";
import type { PaymentRequest } from "@workspace/api-client-react";
import "./ManualPayments.css";

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

export function TransactionsPage({ account }: { account: TransactionAccount }) {
  const requestsQuery = useListAccountPaymentRequests({
    query: { queryKey: getListAccountPaymentRequestsQueryKey(), refetchInterval: 20000 },
  });
  const requests = requestsQuery.data?.requests ?? [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "purchase" | "grant" | "request">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentRequest["status"]>("all");
  const [range, setRange] = useState("all");

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