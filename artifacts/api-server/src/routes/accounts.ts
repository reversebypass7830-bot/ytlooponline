import { randomBytes, randomUUID } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { firebaseGet, firebasePut } from "../lib/firebase-rest";
import { accountUserId, clerkSessionClaims, requireAccountAuth, requireClerkAuth } from "../middlewares/requireClerkAuth";
import { clerkOwnerAuthorized, ownerAuthorized } from "./licenses";

const router: IRouter = Router();
const dayMs = 24 * 60 * 60 * 1000;
const accountPath = (id: string) => `accounts/${encodeURIComponent(id)}`;
const licensePath = (id: string) => `licenses/${encodeURIComponent(id)}`;
const planPath = (id: string) => `plans/${encodeURIComponent(id)}`;

type PlanRecord = {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  price: string;
  isTrial?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type AccountHistoryItem = {
  id: string;
  type: "trial_started" | "purchase" | "grant" | "login";
  message: string;
  at: string;
  planId?: string;
  days?: number;
};

type AccountRecord = {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  profileCompleted?: boolean;
  role: "owner" | "user";
  licenseId: string;
  licenseKey: string;
  trialStartedAt: string;
  trialEndsAt: string;
  activePlanId: string;
  accessEndsAt: string;
  createdAt: string;
  lastLoginAt: string;
  history: AccountHistoryItem[];
};

type AccountMap = Record<string, AccountRecord>;
type PlanMap = Record<string, PlanRecord>;

const defaultPlans: PlanRecord[] = [
  {
    id: "trial-1-day",
    name: "Free trial",
    description: "Full workspace access for one day.",
    durationDays: 1,
    price: "FREE",
    isTrial: true,
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "monthly",
    name: "1 month",
    description: "Full broadcast toolkit for one month.",
    durationDays: 30,
    price: "₹799",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "quarterly",
    name: "3 months",
    description: "Creator access window for three months.",
    durationDays: 90,
    price: "Contact us",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "half-year",
    name: "6 months",
    description: "A longer growth window for active channels.",
    durationDays: 180,
    price: "Contact us",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "annual",
    name: "1 year",
    description: "Best-value annual broadcast access.",
    durationDays: 365,
    price: "₹7,999",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

function isActive(account: AccountRecord): boolean {
  return new Date(account.accessEndsAt).getTime() > Date.now();
}

function ownerIds(): Set<string> {
  return new Set(
    (process.env.OWNER_CLERK_USER_IDS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

async function loadPlans(): Promise<PlanMap> {
  const existing = (await firebaseGet<PlanMap | null>("plans")) ?? {};
  if (Object.keys(existing).length) return existing;
  const seeded = Object.fromEntries(defaultPlans.map((plan) => [plan.id, plan]));
  await Promise.all(Object.values(seeded).map((plan) => firebasePut(planPath(plan.id), plan)));
  return seeded;
}

async function loadAccount(userId: string): Promise<AccountRecord | null> {
  return firebaseGet<AccountRecord | null>(accountPath(userId));
}

function publicAccount(account: AccountRecord, plans: PlanMap) {
  const plan = plans[account.activePlanId] || null;
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
    phone: account.phone,
    profileCompleted: account.profileCompleted ?? true,
    role: account.role,
    licenseId: account.licenseId,
    licenseKey: account.licenseKey,
    trialStartedAt: account.trialStartedAt,
    trialEndsAt: account.trialEndsAt,
    activePlanId: account.activePlanId,
    activePlan: plan,
    accessEndsAt: account.accessEndsAt,
    active: isActive(account),
    createdAt: account.createdAt,
    history: account.history,
  };
}

async function ensureAccount(req: Request): Promise<{ account: AccountRecord; plans: PlanMap }> {
  const userId = accountUserId(req);
  if (!userId) throw new Error("Sign in is required.");
  const claims = clerkSessionClaims(req);
  const claimEmail = typeof claims.email === "string" ? claims.email : typeof claims.email_address === "string" ? claims.email_address : "";
  const claimName = typeof claims.name === "string" ? claims.name : [claims.first_name, claims.last_name].filter((value): value is string => typeof value === "string" && Boolean(value)).join(" ");
  const plans = await loadPlans();
  const existing = await loadAccount(userId);
  const now = new Date();
  if (existing) {
    const next = {
      ...existing,
      displayName: existing.displayName.startsWith("Workspace ") && claimName ? claimName : existing.displayName,
      email: existing.email || claimEmail,
      profileCompleted: existing.profileCompleted ?? true,
      role: ownerIds().has(userId) ? "owner" as const : existing.role,
      lastLoginAt: now.toISOString(),
      history: [
        { id: randomUUID(), type: "login" as const, message: "Signed in", at: now.toISOString() },
        ...(existing.history || []),
      ].slice(0, 50),
    };
    await firebasePut(accountPath(userId), next);
    return { account: next, plans };
  }

  const trial = plans["trial-1-day"] || defaultPlans[0];
  const trialEndsAt = new Date(now.getTime() + trial.durationDays * dayMs).toISOString();
  const licenseId = `acct-${randomUUID()}`;
  const licenseKey = `ACCT-${randomBytes(6).toString("hex").toUpperCase()}`;
  const account: AccountRecord = {
    id: userId,
    displayName: claimName || `Workspace ${userId.slice(-6)}`,
    email: claimEmail,
    profileCompleted: false,
    role: ownerIds().has(userId) ? "owner" : "user",
    licenseId,
    licenseKey,
    trialStartedAt: now.toISOString(),
    trialEndsAt,
    activePlanId: trial.id,
    accessEndsAt: trialEndsAt,
    createdAt: now.toISOString(),
    lastLoginAt: now.toISOString(),
    history: [
      { id: randomUUID(), type: "trial_started", message: `${trial.name} started`, at: now.toISOString(), planId: trial.id, days: trial.durationDays },
    ],
  };
  await Promise.all([
    firebasePut(accountPath(userId), account),
    firebasePut(licensePath(licenseId), {
      key: licenseKey,
      name: account.displayName,
      createdAt: account.createdAt,
      expiresAt: account.accessEndsAt,
      active: true,
      accountId: userId,
    }),
  ]);
  return { account, plans };
}

export async function createMobileAccount(input: {
  phone: string;
  email: string;
  displayName: string;
}): Promise<{ account: AccountRecord; plans: PlanMap }> {
  const plans = await loadPlans();
  const trial = plans["trial-1-day"] || defaultPlans[0];
  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + trial.durationDays * dayMs).toISOString();
  const userId = `mobile-${randomUUID()}`;
  const licenseId = `acct-${randomUUID()}`;
  const licenseKey = `ACCT-${randomBytes(6).toString("hex").toUpperCase()}`;
  const account: AccountRecord = {
    id: userId,
    displayName: input.displayName.trim(),
    email: input.email.trim(),
    phone: input.phone,
    profileCompleted: true,
    role: "user",
    licenseId,
    licenseKey,
    trialStartedAt: now.toISOString(),
    trialEndsAt,
    activePlanId: trial.id,
    accessEndsAt: trialEndsAt,
    createdAt: now.toISOString(),
    lastLoginAt: now.toISOString(),
    history: [
      { id: randomUUID(), type: "trial_started", message: `${trial.name} started`, at: now.toISOString(), planId: trial.id, days: trial.durationDays },
    ],
  };
  await Promise.all([
    firebasePut(accountPath(userId), account),
    firebasePut(licensePath(licenseId), {
      key: licenseKey,
      name: account.displayName,
      createdAt: account.createdAt,
      expiresAt: account.accessEndsAt,
      active: true,
      accountId: userId,
    }),
  ]);
  return { account, plans };
}

async function accountOwnerAuthorized(req: Request): Promise<boolean> {
  if (ownerAuthorized(req) || clerkOwnerAuthorized(req)) return true;
  const userId = accountUserId(req);
  if (!userId) return false;
  const account = await loadAccount(userId);
  return account?.role === "owner";
}

async function requireAccountOwner(req: Request, res: Response): Promise<boolean> {
  if (await accountOwnerAuthorized(req)) return true;
  res.status(401).json({ error: "Owner access is required." });
  return false;
}

function daysValue(value: unknown, fallback = 1): number {
  const days = Number(value);
  return Number.isInteger(days) && days >= 1 && days <= 3650 ? days : fallback;
}

function sendError(req: Request, res: Response, error: unknown, message: string): void {
  req.log.error({ error: error instanceof Error ? error.message : "unknown" }, message);
  res.status(502).json({ error: message });
}

router.get("/account", requireAccountAuth, async (req, res): Promise<void> => {
  try {
    const { account, plans } = await ensureAccount(req);
    res.json({ account: publicAccount(account, plans), plans: Object.values(plans).filter((plan) => plan.active) });
  } catch (error) {
    sendError(req, res, error, "Could not load your account.");
  }
});

router.put("/account/profile", requireAccountAuth, async (req, res): Promise<void> => {
  try {
    const { account, plans } = await ensureAccount(req);
    const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim() : account.displayName;
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : account.email;
    const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
    if (!displayName || displayName.length < 2) {
      res.status(400).json({ error: "Enter your name to complete your profile." });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Enter a valid email address." });
      return;
    }
    const normalizedPhoneDigits = phone.replace(/\D/g, "");
    if (phone && (!/^\+?[0-9 ()-]{10,24}$/.test(phone) || normalizedPhoneDigits.length < 10)) {
      res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
      return;
    }
    if (phone) {
      const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
      const normalizedPhone = normalizedPhoneDigits.slice(-10);
      const alreadyLinked = Object.values(accounts).some((candidate) => candidate.id !== account.id && candidate.phone && candidate.phone.replace(/\D/g, "").slice(-10) === normalizedPhone);
      if (alreadyLinked) {
        res.status(409).json({ error: "This mobile number is already linked to another account." });
        return;
      }
    }
    const next = { ...account, displayName, email, phone: phone || account.phone, profileCompleted: true };
    await firebasePut(accountPath(account.id), next);
    res.json({ account: publicAccount(next, plans), plans: Object.values(plans).filter((plan) => plan.active) });
  } catch (error) {
    sendError(req, res, error, "Could not save your profile.");
  }
});

router.post("/account/claim-owner", requireClerkAuth, async (req, res): Promise<void> => {
  if (!ownerAuthorized(req)) {
    res.status(401).json({ error: "Enter the owner password once to link this Google account." });
    return;
  }
  try {
    const { account, plans } = await ensureAccount(req);
    const next = { ...account, role: "owner" as const };
    await firebasePut(accountPath(account.id), next);
    res.json({ account: publicAccount(next, plans), plans: Object.values(plans).filter((plan) => plan.active) });
  } catch (error) {
    sendError(req, res, error, "Could not link this account as owner.");
  }
});

router.get("/owner/users", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
    res.json({
      users: Object.values(accounts)
        .map((account) => ({ ...publicAccount(account, {}), history: account.history || [] }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    });
  } catch (error) {
    sendError(req, res, error, "Could not load users.");
  }
});

router.post("/owner/users/:userId/grant", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const userId = req.params.userId;
    const account = await loadAccount(userId);
    if (!account) {
      res.status(404).json({ error: "User account not found." });
      return;
    }
    const plans = await loadPlans();
    const planId = typeof req.body?.planId === "string" && plans[req.body.planId] ? req.body.planId : account.activePlanId;
    const days = daysValue(req.body?.days, plans[planId]?.durationDays || 1);
    const start = Math.max(Date.now(), new Date(account.accessEndsAt).getTime());
    const accessEndsAt = new Date(start + days * dayMs).toISOString();
    const next: AccountRecord = {
      ...account,
      activePlanId: planId,
      accessEndsAt,
      history: [
        { id: randomUUID(), type: "grant" as const, message: `Owner granted ${days} days`, at: new Date().toISOString(), planId, days },
        ...(account.history || []),
      ].slice(0, 50),
    };
    await Promise.all([
      firebasePut(accountPath(userId), next),
      firebasePut(licensePath(account.licenseId), {
        key: account.licenseKey,
        name: account.displayName,
        createdAt: account.createdAt,
        expiresAt: accessEndsAt,
        active: true,
        accountId: userId,
      }),
    ]);
    res.json({ user: publicAccount(next, plans) });
  } catch (error) {
    sendError(req, res, error, "Could not grant access.");
  }
});

router.get("/owner/plans", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const plans = await loadPlans();
    res.json({ plans: Object.values(plans) });
  } catch (error) {
    sendError(req, res, error, "Could not load plans.");
  }
});

router.post("/owner/plans", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "Plan name is required." });
    return;
  }
  try {
    const now = new Date().toISOString();
    const plan: PlanRecord = {
      id: `plan-${randomUUID()}`,
      name,
      description: typeof req.body?.description === "string" ? req.body.description.trim() : "",
      durationDays: daysValue(req.body?.durationDays, 1),
      price: typeof req.body?.price === "string" ? req.body.price.trim() : "Contact us",
      active: req.body?.active !== false,
      createdAt: now,
      updatedAt: now,
    };
    await firebasePut(planPath(plan.id), plan);
    res.status(201).json({ plan });
  } catch (error) {
    sendError(req, res, error, "Could not create plan.");
  }
});

router.put("/owner/plans/:planId", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    const plans = await loadPlans();
    const current = plans[req.params.planId];
    if (!current) {
      res.status(404).json({ error: "Plan not found." });
      return;
    }
    const plan: PlanRecord = {
      ...current,
      name: typeof req.body?.name === "string" && req.body.name.trim() ? req.body.name.trim() : current.name,
      description: typeof req.body?.description === "string" ? req.body.description.trim() : current.description,
      durationDays: req.body?.durationDays === undefined ? current.durationDays : daysValue(req.body.durationDays, current.durationDays),
      price: typeof req.body?.price === "string" && req.body.price.trim() ? req.body.price.trim() : current.price,
      active: req.body?.active === undefined ? current.active : Boolean(req.body.active),
      updatedAt: new Date().toISOString(),
    };
    await firebasePut(planPath(plan.id), plan);
    res.json({ plan });
  } catch (error) {
    sendError(req, res, error, "Could not update plan.");
  }
});

export default router;