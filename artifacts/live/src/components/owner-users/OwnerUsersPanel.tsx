import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListOwnerUsersQueryKey,
  useBulkDeleteOwnerUsers,
  useDeleteOwnerUser,
  useListOwnerUsers,
  useUpdateOwnerUserServicePause,
  useUpdateOwnerUserSuspension,
  type OwnerUser,
} from "@workspace/api-client-react";
import { AlertTriangle, ChevronDown, ChevronUp, Search, Shield, Users, X } from "lucide-react";
import "./owner-users.css";

type UserFilter = "all" | "active" | "paused" | "suspended" | "trial" | "expired";

const date = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const dateTime = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const accessIsActive = (user: OwnerUser) => user.active && !user.servicePausedAt && (!user.accessEndsAt || new Date(user.accessEndsAt).getTime() > Date.now());
const displayName = (user: OwnerUser) => user.displayName?.trim() || user.email || "Unnamed account";
const errorText = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export interface OwnerUsersPanelProps {
  ownerPassword: string;
}

export function OwnerUsersPanel({ ownerPassword }: OwnerUsersPanelProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UserFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const request = useMemo(() => ({ headers: { "X-Owner-Password": ownerPassword } }), [ownerPassword]);
  const usersQuery = useListOwnerUsers({ request });
  const refreshUsers = () => queryClient.invalidateQueries({ queryKey: getListOwnerUsersQueryKey() });

  const suspension = useUpdateOwnerUserSuspension({
    request,
    mutation: {
      onSuccess: async (_result, variables) => {
        await refreshUsers();
        setFeedback({ kind: "success", text: variables.data.suspended ? "Account suspended." : "Account access restored." });
      },
      onError: (error) => setFeedback({ kind: "error", text: errorText(error, "Could not update account access.") }),
    },
  });
  const servicePause = useUpdateOwnerUserServicePause({
    request,
    mutation: {
      onSuccess: async (_result, variables) => {
        await refreshUsers();
        setFeedback({
          kind: "success",
          text: variables.data.paused
            ? "Service paused. Sign-in remains available and the remaining access time is frozen."
            : "Service resumed. The paused time has been added to the access end date.",
        });
      },
      onError: (error) => setFeedback({ kind: "error", text: errorText(error, "Could not update the service pause.") }),
    },
  });
  const deleteUser = useDeleteOwnerUser({
    request,
    mutation: {
      onSuccess: async () => {
        await refreshUsers();
        setFeedback({ kind: "success", text: "Account deleted." });
      },
      onError: (error) => setFeedback({ kind: "error", text: errorText(error, "Could not delete account.") }),
    },
  });
  const bulkDelete = useBulkDeleteOwnerUsers({
    request,
    mutation: {
      onSuccess: async (result) => {
        await refreshUsers();
        setSelected([]);
        setFeedback(result.failedUserIds.length
          ? { kind: "error", text: `${result.deletedUserIds.length} deleted; ${result.failedUserIds.length} could not be deleted.` }
          : { kind: "success", text: `${result.deletedUserIds.length} accounts deleted.` });
      },
      onError: (error) => setFeedback({ kind: "error", text: errorText(error, "Could not delete selected accounts.") }),
    },
  });

  const users = usersQuery.data?.users ?? [];
  const visibleUsers = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return users.filter((user) => {
      const matchesSearch = !needle || [user.displayName, user.email, user.phone, user.id, user.activePlan?.name, user.activePlanId]
        .some((value) => value?.toLocaleLowerCase().includes(needle));
      const active = accessIsActive(user);
      const matchesFilter = filter === "all"
        || (filter === "active" && active && !user.suspended && !user.servicePausedAt)
        || (filter === "paused" && !!user.servicePausedAt)
        || (filter === "suspended" && user.suspended)
        || (filter === "trial" && !!user.trialStartedAt && !!user.trialEndsAt)
        || (filter === "expired" && !active && !user.suspended && !user.servicePausedAt);
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);
  const deletableVisible = visibleUsers.filter((user) => user.role !== "owner");
  const selectedVisible = deletableVisible.filter((user) => selected.includes(user.id));
  const selectedAllVisible = deletableVisible.length > 0 && selectedVisible.length === deletableVisible.length;
  const busy = suspension.isPending || servicePause.isPending || deleteUser.isPending || bulkDelete.isPending;
  const counts = {
    all: users.length,
    active: users.filter((user) => accessIsActive(user) && !user.suspended).length,
    paused: users.filter((user) => !!user.servicePausedAt).length,
    suspended: users.filter((user) => user.suspended).length,
  };

  const toggleSelected = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleVisible = () => {
    const visibleIds = deletableVisible.map((user) => user.id);
    setSelected((current) => selectedAllVisible ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])]);
  };
  const confirmDelete = (user: OwnerUser) => {
    if (window.confirm(`Delete ${displayName(user)} and their workspace data? This cannot be undone.`)) {
      setFeedback(null);
      deleteUser.mutate({ userId: user.id });
    }
  };
  const confirmBulkDelete = () => {
    if (!selected.length) return;
    if (window.confirm(`Permanently delete ${selected.length} selected account${selected.length === 1 ? "" : "s"} and their workspace data? This cannot be undone.`)) {
      setFeedback(null);
      bulkDelete.mutate({ data: { userIds: selected } });
    }
  };

  return <section className="owner-users-panel" aria-labelledby="owner-users-heading" data-testid="owner-users-panel">
    <div className="owner-users-heading">
      <div>
        <div className="ou-kicker"><Users size={14} aria-hidden="true"/> ACCESS DIRECTORY</div>
        <h2 id="owner-users-heading">Users</h2>
        <p>Review account access, billing history and live activity without touching an active broadcast.</p>
      </div>
      <div className="ou-total" aria-label={`${users.length} total accounts`}><strong>{users.length}</strong><span>accounts</span></div>
    </div>

    {feedback && <div className={`ou-feedback ${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"} data-testid="owner-users-feedback">
      {feedback.kind === "error" && <AlertTriangle size={15} aria-hidden="true"/>}<span>{feedback.text}</span>
      <button type="button" aria-label="Dismiss message" onClick={() => setFeedback(null)} data-testid="dismiss-owner-users-feedback"><X size={14}/></button>
    </div>}
    {usersQuery.isError && <div className="ou-load-error" role="alert">
      <div><strong>Couldn’t load the user directory</strong><span>{errorText(usersQuery.error, "Check your connection and try again.")}</span></div>
      <button className="ou-button quiet" type="button" onClick={() => void usersQuery.refetch()} data-testid="retry-owner-users">Try again</button>
    </div>}

    <div className="ou-toolbar">
      <label className="ou-search">
        <Search size={16} aria-hidden="true"/>
        <span className="ou-sr-only">Search users</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone or plan" type="search" data-testid="owner-users-search"/>
        {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={14}/></button>}
      </label>
      <div className="ou-filters" role="group" aria-label="Filter users">
        {(["all", "active", "paused", "suspended", "trial", "expired"] as UserFilter[]).map((key) =>
          <button type="button" className={filter === key ? "selected" : ""} aria-pressed={filter === key} key={key} onClick={() => setFilter(key)} data-testid={`owner-users-filter-${key}`}>
            {key === "all" ? "All" : key === "active" ? "Active" : key === "paused" ? "Paused" : key === "trial" ? "Trial" : key === "expired" ? "Expired" : "Suspended"}
            {key === "all" && <span>{counts.all}</span>}{key === "active" && <span>{counts.active}</span>}{key === "paused" && <span>{counts.paused}</span>}{key === "suspended" && <span>{counts.suspended}</span>}
          </button>)}
      </div>
    </div>

    {selected.length > 0 && <div className="ou-bulk-bar" role="status" data-testid="owner-users-bulk-toolbar">
      <span><strong>{selected.length}</strong> selected</span>
      <button type="button" className="ou-button danger" onClick={confirmBulkDelete} disabled={busy} data-testid="owner-users-bulk-delete">
        {bulkDelete.isPending ? "Deleting…" : `Delete selected`}
      </button>
      <button className="ou-icon-button" type="button" aria-label="Clear selection" onClick={() => setSelected([])} data-testid="owner-users-clear-selection"><X size={15}/></button>
    </div>}

    <div className="ou-table-frame">
      {usersQuery.isPending ? <div className="ou-skeleton-list" aria-label="Loading users" data-testid="owner-users-loading">
        {[0, 1, 2, 3, 4].map((item) => <div className="ou-skeleton-row" key={item}><i/><span/><span/><span/><b/></div>)}
      </div> : usersQuery.isError ? null : visibleUsers.length === 0 ? <div className="ou-empty" data-testid="owner-users-empty">
        <div className="ou-empty-mark"><Users size={20}/></div>
        <strong>{users.length ? "No accounts match these filters" : "No accounts yet"}</strong>
        <span>{users.length ? "Try a different search or clear the selected filter." : "New registrations will appear here."}</span>
        {users.length > 0 && (search || filter !== "all") && <button type="button" className="ou-button quiet" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>}
      </div> : <div className="ou-table-scroll">
        <table className="ou-table">
          <thead><tr>
            <th className="ou-check-col"><input type="checkbox" aria-label="Select all visible user accounts" checked={selectedAllVisible} onChange={toggleVisible} data-testid="owner-users-select-all"/></th>
            <th>Account</th><th>Registered</th><th>Plan / access</th><th>Trial window</th><th>Live starts</th><th><span className="ou-sr-only">Actions</span></th>
          </tr></thead>
          <tbody>{visibleUsers.map((user) => {
            const isExpanded = expanded === user.id;
            const isActive = accessIsActive(user);
            const planName = user.activePlan?.name || (user.activePlanId ? user.activePlanId : "No plan");
            return <UserRows key={user.id} user={user} isExpanded={isExpanded} isActive={isActive} planName={planName}
              selected={selected.includes(user.id)} busy={busy}
              onSelect={() => toggleSelected(user.id)}
              onExpand={() => setExpanded(isExpanded ? null : user.id)}
              onSuspension={() => { setFeedback(null); suspension.mutate({ userId: user.id, data: { suspended: !user.suspended } }); }}
               onServicePause={() => { setFeedback(null); servicePause.mutate({ userId: user.id, data: { paused: !user.servicePausedAt } }); }}
              onDelete={() => confirmDelete(user)}/>;
          })}</tbody>
        </table>
      </div>}
    </div>
    <div className="ou-table-foot"><span>Showing <strong>{visibleUsers.length}</strong> of <strong>{users.length}</strong> accounts</span><span><i/> Owner accounts are protected from bulk actions</span></div>
  </section>;
}

function UserRows({ user, isExpanded, isActive, planName, selected, busy, onSelect, onExpand, onSuspension, onServicePause, onDelete }: {
  user: OwnerUser; isExpanded: boolean; isActive: boolean; planName: string; selected: boolean; busy: boolean;
  onSelect: () => void; onExpand: () => void; onSuspension: () => void; onServicePause: () => void; onDelete: () => void;
}) {
  const protectedOwner = user.role === "owner";
  const detailId = `owner-user-history-${user.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return <>
    <tr className={user.suspended ? "ou-user-suspended" : user.servicePausedAt ? "ou-user-paused" : ""} data-testid={`owner-user-row-${user.id}`}>
      <td className="ou-check-col">{!protectedOwner && <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${displayName(user)}`} data-testid={`owner-user-select-${user.id}`}/>}</td>
      <td><div className="ou-account-cell">
        <div className={`ou-avatar ${user.suspended ? "suspended" : ""}`}>{(displayName(user)[0] || "U").toLocaleUpperCase()}</div>
        <div className="ou-account-copy"><strong title={displayName(user)}>{displayName(user)}</strong><span title={user.email}>{user.email || user.id}</span>
          <div className="ou-account-tags">{protectedOwner && <span className="ou-role">Owner</span>}{user.phone && <span>{user.phone}</span>}</div>
        </div>
      </div></td>
      <td><span className="ou-date">{date(user.createdAt)}</span></td>
      <td><div className="ou-plan-cell"><strong>{planName}</strong><span className={`ou-status ${user.suspended ? "suspended" : user.servicePausedAt ? "paused" : isActive ? "active" : "expired"}`}><i/>{user.suspended ? "Suspended" : user.servicePausedAt ? "Paused" : isActive ? "Active" : "Expired"}</span>
        <small>{user.servicePausedAt ? `Frozen · resumes with ${date(user.accessEndsAt)}` : `Access to ${date(user.accessEndsAt)}`}</small></div></td>
      <td><div className="ou-trial-cell"><strong>{user.trialStartedAt || user.trialEndsAt ? "Trial" : "—"}</strong><span>{user.trialStartedAt ? date(user.trialStartedAt) : "Not started"}</span><small>{user.trialEndsAt ? `Ends ${date(user.trialEndsAt)}` : "No trial end"}</small></div></td>
      <td><span className="ou-live-count">{user.lifetimeLiveStarts.toLocaleString()}</span><small className="ou-live-caption">lifetime</small></td>
      <td><div className="ou-row-actions">
        <button className="ou-icon-button details-button" type="button" aria-expanded={isExpanded} aria-controls={detailId} aria-label={`${isExpanded ? "Hide" : "View"} history for ${displayName(user)}`} onClick={onExpand} data-testid={`owner-user-history-toggle-${user.id}`}>{isExpanded ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}</button>
        <button type="button" className={`ou-button ${user.suspended ? "restore" : "quiet"}`} disabled={busy || protectedOwner} onClick={onSuspension} title={protectedOwner ? "Owner access cannot be changed here" : undefined} data-testid={`owner-user-suspension-${user.id}`}>{user.suspended ? "Restore" : "Suspend"}</button>
         <button type="button" className={`ou-button ${user.servicePausedAt ? "restore" : "quiet"}`} disabled={busy || protectedOwner || (!user.servicePausedAt && !user.active)} onClick={onServicePause} title={protectedOwner ? "Owner service cannot be paused here" : user.servicePausedAt ? "Resume service and restore the frozen access time" : "Pause service without blocking sign-in"} data-testid={`owner-user-service-pause-${user.id}`}>{user.servicePausedAt ? "Resume service" : "Pause service"}</button>
        <button type="button" className="ou-icon-button delete-button" disabled={busy || protectedOwner} aria-label={`Delete ${displayName(user)}`} title={protectedOwner ? "Owner accounts are protected" : "Delete account"} onClick={onDelete} data-testid={`owner-user-delete-${user.id}`}><X size={15}/></button>
      </div></td>
    </tr>
    {isExpanded && <tr className="ou-detail-row"><td colSpan={7}><div id={detailId} className="ou-detail-panel">
       <div className="ou-detail-top"><div><span className="ou-detail-label">ACCOUNT DETAILS</span><strong>{displayName(user)}</strong></div><div className="ou-detail-metrics"><span><b>{user.streamsPerDay}</b> starts/day</span><span><b>{user.downloadsPerDay.toLocaleString()}</b> downloads/day</span><span><b>{user.streamLimit}</b> concurrent stream limit</span></div></div>
      <div className="ou-detail-grid">
        <div><small>Phone</small><strong>{user.phone || "Not provided"}</strong></div>
        <div><small>Current plan</small><strong>{user.activePlan?.name || user.activePlanId || "No active plan"}</strong></div>
         <div><small>Current service</small><strong>{user.suspended ? "Suspended" : user.servicePausedAt ? "Paused" : isActive ? "Active" : "Expired"}</strong></div>
         <div><small>Daily stream starts</small><strong>{user.streamsPerDay}</strong></div>
         <div><small>Daily downloads</small><strong>{user.downloadsPerDay.toLocaleString()}</strong></div>
        <div><small>Trial started</small><strong>{date(user.trialStartedAt)}</strong></div>
        <div><small>Trial ends</small><strong>{date(user.trialEndsAt)}</strong></div>
        <div><small>Access ends</small><strong>{date(user.accessEndsAt)}</strong></div>
        <div><small>Service pause</small><strong>{user.servicePausedAt ? `Paused ${dateTime(user.servicePausedAt)}` : "Not paused"}</strong></div>
        <div><small>Registration date</small><strong>{dateTime(user.createdAt)}</strong></div>
      </div>
      <div className="ou-history-heading"><div><span className="ou-detail-label">SUBSCRIPTION HISTORY</span><strong>{user.history?.length ?? 0} events</strong></div><span>Newest activity first</span></div>
      {!user.history?.length ? <p className="ou-no-history">No subscription activity recorded.</p> : <ol className="ou-history-list">
        {[...user.history].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).map((item) => <li key={item.id}>
          <span className={`ou-history-dot ${item.type === "purchase" ? "purchase" : ""}`}/>
           <div className="ou-history-copy"><strong>{item.message}</strong><span>{item.planName || item.planId || item.type}{item.days ? ` · ${item.days} days` : item.durationHours ? ` · ${item.durationHours} hours` : ""}{item.amountPaise != null ? ` · ${(item.amountPaise / 100).toLocaleString(undefined, { style: "currency", currency: "INR" })}` : ""}</span></div>
          <time dateTime={item.at}>{dateTime(item.at)}</time>
        </li>)}
      </ol>}
    </div></td></tr>}
  </>;
}
