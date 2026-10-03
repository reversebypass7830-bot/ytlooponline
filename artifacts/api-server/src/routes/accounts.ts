import { randomBytes, randomUUID } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  CreateAccountPaymentRequestBody,
  CreateAccountPaymentProofUploadUrlBody,
  CreateBillingPlanBody,
  QuoteAccountPaymentBody,
  ReviewOwnerPaymentRequestBody,
  UpdateBillingPlanBody,
  UpdateOwnerPaymentSettingsBody,
} from "@workspace/api-zod";
import { firebaseGet, firebasePut } from "../lib/firebase-rest";
import { ObjectStorageService } from "../lib/objectStorage";
import { accountIdentity, accountUserId, clerkSessionClaims, requireAccountAuth, requireClerkAuth } from "../middlewares/requireClerkAuth";
import { clerkOwnerAuthorized, ownerAuthorized } from "./licenses";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const dayMs = 24 * 60 * 60 * 1000;
const accountPath = (id: string) => `accounts/${encodeURIComponent(id)}`;
const licensePath = (id: string) => `licenses/${encodeURIComponent(id)}`;
const planPath = (id: string) => `plans/${encodeURIComponent(id)}`;
const paymentSettingsPath = "billing/paymentSettings";
const paymentRequestsPath = "paymentRequests";

type PlanRecord = {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  price: string;
  pricePerStreamDayPaise?: number;
  pricePerDownloadPaise?: number;
  downloadsPerDay?: number;
  streamLimit?: number;
  features?: string[];
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
  streamLimit?: number;
  streamsPerDay?: number;
  downloadsPerDay?: number;
  totalDownloads?: number;
  amountPaise?: number;
  utr?: string;
  features?: string[];
  paymentRequestId?: string;
};

type AccountRecord = {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  profileImagePath?: string;
  profileCompleted?: boolean;
  role: "owner" | "user";
  licenseId: string;
  licenseKey: string;
  trialStartedAt: string;
  trialEndsAt: string;
  activePlanId: string;
  accessEndsAt: string;
  streamLimit?: number;
  streamsPerDay?: number;
  downloadsPerDay?: number;
  activeFeatures?: string[];
  streamUsageDate?: string;
  streamsStartedToday?: number;
  downloadUsageDate?: string;
  downloadsUsedToday?: number;
  createdAt: string;
  lastLoginAt: string;
  history: AccountHistoryItem[];
};

type AccountMap = Record<string, AccountRecord>;
type PlanMap = Record<string, PlanRecord>;
type PaymentStatus = "pending" | "approved" | "rejected";
type PaymentSettingsRecord = {
  upiId: string;
  payeeName: string;
  qrImagePath: string | null;
  qrImageUrl: string | null;
  updatedAt: string | null;
};
type PaymentRequestRecord = {
  id: string;
  accountId: string;
  accountName: string;
  accountEmail: string;
  planId: string;
  planName: string;
  packType: "Days" | "Monthly" | "Yearly";
  durationDays: number;
  streamLimit: number;
  streamsPerDay: number;
  downloadsPerDay: number;
  totalDownloads: number;
  amountPaise: number;
  amountRupees: number;
  pricePerStreamDayPaise: number;
  pricePerDownloadPaise: number;
  features: string[];
  utr: string;
  status: PaymentStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  reviewedBy?: string;
  screenshotPath: string | null;
  screenshotUrl: string | null;
};
type PaymentQuote = {
  planId: string;
  planName: string;
  packType: "Days" | "Monthly" | "Yearly";
  durationDays: number;
  streamLimit: number;
  streamsPerDay: number;
  downloadsPerDay: number;
  totalDownloads: number;
  amountPaise: number;
  amountRupees: number;
  pricePerStreamDayPaise: number;
  pricePerDownloadPaise: number;
  upiId: string;
  payeeName: string;
  qrImagePath: string | null;
  qrImageUrl: string | null;
  features: string[];
};

const defaultPlans: PlanRecord[] = [
  {
    id: "trial-1-day",
    name: "Free trial",
    description: "Full workspace access for one day.",
    durationDays: 1,
    price: "FREE",
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 1,
    features: ["Live streaming", "Playlist management", "50 video downloads per day"],
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
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 9,
    features: [],
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
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 9,
    features: [],
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
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 9,
    features: [],
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
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 9,
    features: [],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "day-standard",
    name: "1080p Standard",
    description: "Standard broadcast quality for a focused day.",
    durationDays: 1,
    price: "₹35 / stream",
    pricePerStreamDayPaise: 3500,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: ["1080p standard streaming", "Live playlist controls", "50 YouTube downloads per day"],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "day-premium",
    name: "1080p Premium",
    description: "Professional quality and control for a focused day.",
    durationDays: 1,
    price: "₹51 / stream",
    pricePerStreamDayPaise: 5100,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: ["1080p premium streaming", "Live playlist controls", "50 YouTube downloads per day"],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "monthly-standard",
    name: "1080p Standard Monthly",
    description: "Standard broadcast quality for a month.",
    durationDays: 30,
    price: "₹899 / stream",
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: [],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "monthly-premium",
    name: "1080p Premium Monthly",
    description: "Professional broadcast quality for a month.",
    durationDays: 30,
    price: "₹1,299 / stream",
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: [],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "annual-standard",
    name: "1080p Standard Annual",
    description: "Standard broadcast quality for a year.",
    durationDays: 365,
    price: "₹8,999 / stream",
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: [],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "annual-premium",
    name: "1080p Premium Annual",
    description: "Professional broadcast quality for a year.",
    durationDays: 365,
    price: "₹12,999 / stream",
    pricePerStreamDayPaise: 0,
    downloadsPerDay: 50,
    streamLimit: 10,
    features: [],
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "custom-subscription",
    name: "Custom subscription",
    description: "Choose daily broadcast starts, downloads, and an access term.",
    durationDays: 1,
    price: "₹10 / stream start / day",
    pricePerStreamDayPaise: 1000,
    pricePerDownloadPaise: 200,
    downloadsPerDay: 50,
    streamLimit: 1,
    features: ["Daily broadcast-start allowance", "Daily download allowance", "Flexible access term"],
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
  const seeded = Object.fromEntries(defaultPlans.map((plan) => [plan.id, plan]));
  const rawPlans = { ...seeded, ...existing };
  const merged: PlanMap = Object.fromEntries(Object.entries(rawPlans).map(([id, rawPlan]) => {
    const fallback = seeded[id] as PlanRecord | undefined;
    return [id, {
      ...fallback,
      ...rawPlan,
      id: rawPlan.id || id,
      pricePerStreamDayPaise: Number.isSafeInteger(rawPlan.pricePerStreamDayPaise) && (rawPlan.pricePerStreamDayPaise ?? -1) >= 0
        ? rawPlan.pricePerStreamDayPaise
        : fallback?.pricePerStreamDayPaise ?? 0,
      pricePerDownloadPaise: Number.isSafeInteger(rawPlan.pricePerDownloadPaise) && (rawPlan.pricePerDownloadPaise ?? -1) >= 0
        ? rawPlan.pricePerDownloadPaise
        : fallback?.pricePerDownloadPaise ?? 0,
      downloadsPerDay: Number.isSafeInteger(rawPlan.downloadsPerDay) && (rawPlan.downloadsPerDay ?? 0) > 0
        ? rawPlan.downloadsPerDay
        : fallback?.downloadsPerDay ?? 50,
      streamLimit: Number.isSafeInteger(rawPlan.streamLimit) && (rawPlan.streamLimit ?? 0) > 0
        ? rawPlan.streamLimit
        : fallback?.streamLimit ?? 1,
      features: Array.isArray(rawPlan.features)
        ? rawPlan.features.filter((feature): feature is string => typeof feature === "string").slice(0, 30)
        : fallback?.features ?? [],
    }];
  }));
  const missing = Object.values(seeded).filter((plan) => !existing[plan.id]);
  if (missing.length) await Promise.all(missing.map((plan) => firebasePut(planPath(plan.id), plan)));
  return merged;
}

async function loadAccount(userId: string): Promise<AccountRecord | null> {
  return firebaseGet<AccountRecord | null>(accountPath(userId));
}

function publicAccount(account: AccountRecord, plans: PlanMap) {
  const plan = plans[account.activePlanId] || null;
  const streamLimit = account.streamLimit || plan?.streamLimit || 1;
  const streamsPerDay = Number.isSafeInteger(account.streamsPerDay) && (account.streamsPerDay ?? 0) > 0
    ? account.streamsPerDay
    : plan?.isTrial ? 1 : 100;
  const streamsStartedToday = account.streamUsageDate === currentUsageDayKey()
    ? Math.max(0, account.streamsStartedToday || 0)
    : 0;
  const downloadsPerDay = account.downloadsPerDay || plan?.downloadsPerDay || 50;
  const downloadsUsedToday = account.downloadUsageDate === currentUsageDayKey()
    ? Math.max(0, account.downloadsUsedToday || 0)
    : 0;
  return {
    id: account.id,
    displayName: account.displayName,
    email: account.email,
    phone: account.phone,
    profileImagePath: account.profileImagePath,
    profileCompleted: account.profileCompleted ?? true,
    role: account.role,
    licenseId: account.licenseId,
    licenseKey: account.licenseKey,
    trialStartedAt: account.trialStartedAt,
    trialEndsAt: account.trialEndsAt,
    activePlanId: account.activePlanId,
    activePlan: plan,
    accessEndsAt: account.accessEndsAt,
    streamLimit,
    streamsPerDay,
    streamsStartedToday,
    downloadsPerDay,
    downloadsUsedToday,
    downloadsRemainingToday: Math.max(0, downloadsPerDay - downloadsUsedToday),
    activeFeatures: account.activeFeatures || plan?.features || [],
    active: isActive(account),
    createdAt: account.createdAt,
    history: account.history,
  };
}

async function ensureAccount(req: Request): Promise<{ account: AccountRecord; plans: PlanMap }> {
  const identity = accountIdentity(req);
  if (!identity) throw new Error("Sign in is required.");
  const userId = identity.userId;
  const claimEmail = identity.email;
  const claimName = identity.name;
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
      streamLimit: existing.streamLimit || plans[existing.activePlanId]?.streamLimit || 1,
      streamsPerDay: Number.isSafeInteger(existing.streamsPerDay) && (existing.streamsPerDay ?? 0) > 0
        ? existing.streamsPerDay
        : plans[existing.activePlanId]?.isTrial ? 1 : 100,
      streamUsageDate: existing.streamUsageDate || currentUsageDayKey(),
      streamsStartedToday: Number.isSafeInteger(existing.streamsStartedToday) && (existing.streamsStartedToday ?? -1) >= 0
        ? existing.streamsStartedToday
        : 0,
      downloadsPerDay: existing.downloadsPerDay || plans[existing.activePlanId]?.downloadsPerDay || 50,
      activeFeatures: existing.activeFeatures || plans[existing.activePlanId]?.features || [],
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
    streamLimit: trial.streamLimit || 1,
    streamsPerDay: trial.isTrial ? 1 : 100,
    streamUsageDate: currentUsageDayKey(),
    streamsStartedToday: 0,
    downloadsPerDay: trial.downloadsPerDay || 50,
    activeFeatures: trial.features || [],
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

export async function ensureFirebaseAccount(identity: { userId: string; email: string; name: string }): Promise<{ account: AccountRecord; plans: PlanMap }> {
  const plans = await loadPlans();
  const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
  const firebaseUserId = `firebase-${identity.userId}`;
  const existing = accounts[firebaseUserId]
    || (identity.email ? Object.values(accounts).find((candidate) => candidate.email.trim().toLowerCase() === identity.email.trim().toLowerCase()) : undefined);
  const now = new Date();

  if (existing) {
    const next: AccountRecord = {
      ...existing,
      displayName: existing.displayName.startsWith("Workspace ") && identity.name ? identity.name : existing.displayName,
      email: existing.email || identity.email,
      profileCompleted: existing.profileCompleted ?? true,
      lastLoginAt: now.toISOString(),
      history: [
        { id: randomUUID(), type: "login" as const, message: "Signed in with Google", at: now.toISOString() },
        ...(existing.history || []),
      ].slice(0, 50),
      streamLimit: existing.streamLimit || plans[existing.activePlanId]?.streamLimit || 1,
      streamsPerDay: Number.isSafeInteger(existing.streamsPerDay) && (existing.streamsPerDay ?? 0) > 0
        ? existing.streamsPerDay
        : plans[existing.activePlanId]?.isTrial ? 1 : 100,
      streamUsageDate: existing.streamUsageDate || currentUsageDayKey(),
      streamsStartedToday: Number.isSafeInteger(existing.streamsStartedToday) && (existing.streamsStartedToday ?? -1) >= 0
        ? existing.streamsStartedToday
        : 0,
      downloadsPerDay: existing.downloadsPerDay || plans[existing.activePlanId]?.downloadsPerDay || 50,
      activeFeatures: existing.activeFeatures || plans[existing.activePlanId]?.features || [],
    };
    await firebasePut(accountPath(existing.id), next);
    return { account: next, plans };
  }

  const trial = plans["trial-1-day"] || defaultPlans[0];
  const trialEndsAt = new Date(now.getTime() + trial.durationDays * dayMs).toISOString();
  const licenseId = `acct-${randomUUID()}`;
  const licenseKey = `ACCT-${randomBytes(6).toString("hex").toUpperCase()}`;
  const account: AccountRecord = {
    id: firebaseUserId,
    displayName: identity.name || `Workspace ${identity.userId.slice(-6)}`,
    email: identity.email,
    profileCompleted: false,
    role: ownerIds().has(identity.userId) ? "owner" : "user",
    licenseId,
    licenseKey,
    trialStartedAt: now.toISOString(),
    trialEndsAt,
    activePlanId: trial.id,
    accessEndsAt: trialEndsAt,
    streamLimit: trial.streamLimit || 1,
    streamsPerDay: trial.isTrial ? 1 : 100,
    streamUsageDate: currentUsageDayKey(),
    streamsStartedToday: 0,
    downloadsPerDay: trial.downloadsPerDay || 50,
    activeFeatures: trial.features || [],
    createdAt: now.toISOString(),
    lastLoginAt: now.toISOString(),
    history: [
      { id: randomUUID(), type: "trial_started", message: `${trial.name} started`, at: now.toISOString(), planId: trial.id, days: trial.durationDays },
    ],
  };
  await Promise.all([
    firebasePut(accountPath(account.id), account),
    firebasePut(licensePath(licenseId), {
      key: licenseKey,
      name: account.displayName,
      createdAt: account.createdAt,
      expiresAt: account.accessEndsAt,
      active: true,
      accountId: account.id,
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
    streamLimit: trial.streamLimit || 1,
    streamsPerDay: trial.isTrial ? 1 : 100,
    streamUsageDate: currentUsageDayKey(),
    streamsStartedToday: 0,
    downloadsPerDay: trial.downloadsPerDay || 50,
    activeFeatures: trial.features || [],
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

export async function requireAccountOwner(req: Request, res: Response): Promise<boolean> {
  if (await accountOwnerAuthorized(req)) return true;
  res.status(401).json({ error: "Owner access is required." });
  return false;
}

function daysValue(value: unknown, fallback = 1): number {
  const days = Number(value);
  return Number.isInteger(days) && days >= 1 && days <= 3650 ? days : fallback;
}

function currentUsageDayKey(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function formatDailyPrice(pricePaise: number): string {
  return `₹${(pricePaise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })} / stream start / day`;
}

function isValidUpiId(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}@[A-Za-z0-9][A-Za-z0-9.-]{1,50}$/.test(value.trim());
}

const billingLocks = new Map<string, Promise<void>>();

async function withBillingLock<T>(key: string, action: () => Promise<T>): Promise<T> {
  const previous = billingLocks.get(key) || Promise.resolve();
  let release: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => gate);
  billingLocks.set(key, queued);
  await previous;
  try {
    return await action();
  } finally {
    release();
    if (billingLocks.get(key) === queued) billingLocks.delete(key);
  }
}

async function loadPaymentSettings(): Promise<PaymentSettingsRecord> {
  const stored = await firebaseGet<Partial<PaymentSettingsRecord> | null>(paymentSettingsPath);
  if (!stored) return {
    upiId: "",
    payeeName: "",
    qrImagePath: null,
    qrImageUrl: null,
    updatedAt: null,
  };
  const qrImagePath = typeof stored.qrImagePath === "string" && stored.qrImagePath.startsWith("/objects/payment-qr/")
    ? stored.qrImagePath
    : null;
  return {
    upiId: typeof stored.upiId === "string" ? stored.upiId : "",
    payeeName: typeof stored.payeeName === "string" ? stored.payeeName : "",
    qrImagePath,
    qrImageUrl: null,
    updatedAt: typeof stored.updatedAt === "string" ? stored.updatedAt : null,
  };
}

async function paymentSettingsResponse(settings: PaymentSettingsRecord): Promise<PaymentSettingsRecord> {
  return { ...settings, qrImagePath: null, qrImageUrl: null };
}

async function loadPaymentRequests(): Promise<Record<string, PaymentRequestRecord>> {
  const stored = (await firebaseGet<Record<string, Partial<PaymentRequestRecord>> | null>(paymentRequestsPath)) || {};
  return Object.fromEntries(Object.entries(stored).map(([id, raw]) => {
    const durationDays = Number.isInteger(raw.durationDays) && (raw.durationDays ?? 0) > 0 ? raw.durationDays! : 1;
    const packType = raw.packType === "Days" || raw.packType === "Monthly" || raw.packType === "Yearly"
      ? raw.packType
      : durationDays > 360 ? "Yearly" : durationDays > 30 ? "Monthly" : "Days";
    const amountPaise = Number.isSafeInteger(raw.amountPaise) && (raw.amountPaise ?? -1) >= 0 ? raw.amountPaise! : 0;
    return [id, {
      ...raw,
      id: typeof raw.id === "string" ? raw.id : id,
      accountId: typeof raw.accountId === "string" ? raw.accountId : "",
      accountName: typeof raw.accountName === "string" ? raw.accountName : "",
      accountEmail: typeof raw.accountEmail === "string" ? raw.accountEmail : "",
      planId: typeof raw.planId === "string" ? raw.planId : "custom-subscription",
      planName: typeof raw.planName === "string" ? raw.planName : "Custom subscription",
      packType,
      durationDays,
      streamLimit: Number.isSafeInteger(raw.streamLimit) && (raw.streamLimit ?? 0) > 0 ? raw.streamLimit! : 1,
      streamsPerDay: Number.isSafeInteger(raw.streamsPerDay) && (raw.streamsPerDay ?? 0) > 0 ? raw.streamsPerDay! : 1,
      downloadsPerDay: Number.isSafeInteger(raw.downloadsPerDay) && (raw.downloadsPerDay ?? 0) > 0 ? raw.downloadsPerDay! : 1,
      totalDownloads: Number.isSafeInteger(raw.totalDownloads) && (raw.totalDownloads ?? 0) >= 0 ? raw.totalDownloads! : 0,
      amountPaise,
      amountRupees: Number.isFinite(raw.amountRupees) ? raw.amountRupees! : amountPaise / 100,
      pricePerStreamDayPaise: Number.isSafeInteger(raw.pricePerStreamDayPaise) && (raw.pricePerStreamDayPaise ?? 0) >= 0 ? raw.pricePerStreamDayPaise! : 0,
      pricePerDownloadPaise: Number.isSafeInteger(raw.pricePerDownloadPaise) && (raw.pricePerDownloadPaise ?? 0) >= 0 ? raw.pricePerDownloadPaise! : 0,
      features: Array.isArray(raw.features) ? raw.features.filter((feature): feature is string => typeof feature === "string") : [],
      utr: typeof raw.utr === "string" ? raw.utr : "",
      status: raw.status === "approved" || raw.status === "rejected" ? raw.status : "pending",
      createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date(0).toISOString(),
      reviewedAt: typeof raw.reviewedAt === "string" ? raw.reviewedAt : null,
      reviewNote: typeof raw.reviewNote === "string" ? raw.reviewNote : null,
      screenshotPath: typeof raw.screenshotPath === "string" && raw.screenshotPath.startsWith("/objects/payment-proof/") ? raw.screenshotPath : null,
      screenshotUrl: null,
    } as PaymentRequestRecord];
  }));
}

function validPackDuration(packType: "Days" | "Monthly" | "Yearly", durationDays: number): boolean {
  if (!Number.isInteger(durationDays)) return false;
  if (packType === "Days") return durationDays >= 1 && durationDays <= 30;
  if (packType === "Monthly") return durationDays >= 30 && durationDays <= 360 && durationDays % 30 === 0;
  return durationDays >= 365 && durationDays <= 5475 && durationDays % 365 === 0;
}

async function paymentQuote(
  plans: PlanMap,
  settings: PaymentSettingsRecord,
  input: {
    planId: string;
    packType: "Days" | "Monthly" | "Yearly";
    durationDays: number;
    streamsPerDay: number;
    downloadsPerDay: number;
  },
  currentStreamLimit: number,
): Promise<PaymentQuote | null> {
  const plan = plans[input.planId];
  if (!plan || plan.id !== "custom-subscription" || !plan.active || plan.isTrial) return null;
  const pricePerStreamDayPaise = plan.pricePerStreamDayPaise ?? 0;
  const pricePerDownloadPaise = plan.pricePerDownloadPaise ?? 0;
  if (!Number.isSafeInteger(pricePerStreamDayPaise) || pricePerStreamDayPaise < 0
    || !Number.isSafeInteger(pricePerDownloadPaise) || pricePerDownloadPaise < 0
    || (pricePerStreamDayPaise === 0 && pricePerDownloadPaise === 0)) return null;
  if (!validPackDuration(input.packType, input.durationDays)) return null;
  if (!Number.isInteger(input.streamsPerDay) || input.streamsPerDay < 1 || input.streamsPerDay > 100) return null;
  if (!Number.isInteger(input.downloadsPerDay) || input.downloadsPerDay < 1 || input.downloadsPerDay > 1_000_000) return null;
  if (!Number.isInteger(currentStreamLimit) || currentStreamLimit < 1) return null;
  if (!isValidUpiId(settings.upiId) || !settings.payeeName.trim()) return null;

  const perDayPaise = BigInt(pricePerStreamDayPaise) * BigInt(input.streamsPerDay)
    + BigInt(pricePerDownloadPaise) * BigInt(input.downloadsPerDay);
  const amountPaise = Number(perDayPaise * BigInt(input.durationDays));
  const totalDownloads = input.durationDays * input.downloadsPerDay;
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 1 || amountPaise > 100_000_000_000 || !Number.isSafeInteger(totalDownloads)) return null;
  return {
    planId: plan.id,
    planName: plan.name,
    packType: input.packType,
    durationDays: input.durationDays,
    streamLimit: currentStreamLimit,
    streamsPerDay: input.streamsPerDay,
    downloadsPerDay: input.downloadsPerDay,
    totalDownloads,
    amountPaise,
    amountRupees: amountPaise / 100,
    pricePerStreamDayPaise,
    pricePerDownloadPaise,
    upiId: settings.upiId.trim(),
    payeeName: settings.payeeName.trim(),
    qrImagePath: null,
    qrImageUrl: null,
    features: plan.features || [],
  };
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
    const profileImagePath = typeof req.body?.profileImagePath === "string" ? req.body.profileImagePath.trim() : account.profileImagePath;
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
    if (profileImagePath && !profileImagePath.startsWith(`/objects/profile-images/${encodeURIComponent(account.id)}/`)) {
      res.status(400).json({ error: "That profile image reference is not valid for this account." });
      return;
    }
    const next = { ...account, displayName, email, phone: phone || account.phone, profileImagePath, profileCompleted: true };
    await firebasePut(accountPath(account.id), next);
    res.json({ account: publicAccount(next, plans), plans: Object.values(plans).filter((plan) => plan.active) });
  } catch (error) {
    sendError(req, res, error, "Could not save your profile.");
  }
});

router.post("/account/payment-quote", requireAccountAuth, async (req, res): Promise<void> => {
  const parsed = QuoteAccountPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Choose a valid plan, duration, stream count, and daily download quota." });
    return;
  }
  try {
    const { account, plans } = await ensureAccount(req);
    const settings = await loadPaymentSettings();
    if (!isValidUpiId(settings.upiId) || !settings.payeeName.trim()) {
      res.status(409).json({ error: "UPI payment is not configured yet. Please try again later." });
      return;
    }
    const quote = await paymentQuote(
      plans,
      settings,
      parsed.data,
      account.streamLimit || plans[account.activePlanId]?.streamLimit || 1,
    );
    if (!quote) {
      res.status(400).json({ error: "This plan or selection is unavailable. Check the duration, daily stream starts, download quota, and configured prices." });
      return;
    }
    res.json(quote);
  } catch (error) {
    sendError(req, res, error, "Could not calculate the payment amount.");
  }
});

router.get("/account/payment-requests", requireAccountAuth, async (req, res): Promise<void> => {
  try {
    const { account } = await ensureAccount(req);
    const requests = Object.values(await loadPaymentRequests())
      .filter((request) => request.accountId === account.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    res.json({ requests });
  } catch (error) {
    sendError(req, res, error, "Could not load payment history.");
  }
});

router.post("/account/payment-requests", requireAccountAuth, async (req, res): Promise<void> => {
  const parsed = CreateAccountPaymentRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid UTR and payment selection." });
    return;
  }
  const utr = parsed.data.utr.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,32}$/.test(utr)) {
    res.status(400).json({ error: "Enter a valid UTR containing 6–32 letters or numbers." });
    return;
  }
  try {
    const { account, plans } = await ensureAccount(req);
    const settings = await loadPaymentSettings();
    if (!isValidUpiId(settings.upiId) || !settings.payeeName.trim()) {
      res.status(409).json({ error: "UPI payment is not configured yet. Refresh and try again later." });
      return;
    }
    const quote = await paymentQuote(
      plans,
      settings,
      parsed.data,
      account.streamLimit || plans[account.activePlanId]?.streamLimit || 1,
    );
    if (!quote) {
      res.status(400).json({ error: "The plan or payment settings changed. Refresh the quote before submitting your UTR." });
      return;
    }
    const screenshotPath = typeof parsed.data.screenshotPath === "string" ? parsed.data.screenshotPath : null;
    if (screenshotPath) {
      const ownProofPrefix = `/objects/payment-proof/${encodeURIComponent(account.id)}/`;
      if (!screenshotPath.startsWith(ownProofPrefix)) {
        res.status(400).json({ error: "Upload a payment screenshot using this account's secure upload link." });
        return;
      }
      try {
        await objectStorageService.getObjectEntityFile(screenshotPath);
      } catch {
        res.status(400).json({ error: "The payment screenshot could not be verified. Upload it again." });
        return;
      }
    }
    await withBillingLock("payment-submissions", async () => {
      const existing = Object.values(await loadPaymentRequests());
      if (existing.some((request) => request.accountId === account.id && request.status === "pending")) {
        res.status(409).json({ error: "You already have a payment request awaiting review." });
        return;
      }
      if (existing.some((request) => request.utr.toUpperCase() === utr)) {
        res.status(409).json({ error: "This UTR has already been submitted." });
        return;
      }
      const paymentRequest: PaymentRequestRecord = {
        id: randomUUID(),
        accountId: account.id,
        accountName: account.displayName,
        accountEmail: account.email,
        planId: quote.planId,
        planName: quote.planName,
        packType: quote.packType,
        durationDays: quote.durationDays,
        streamLimit: quote.streamLimit,
        streamsPerDay: quote.streamsPerDay,
        downloadsPerDay: quote.downloadsPerDay,
        totalDownloads: quote.totalDownloads,
        amountPaise: quote.amountPaise,
        amountRupees: quote.amountRupees,
        pricePerStreamDayPaise: quote.pricePerStreamDayPaise,
        pricePerDownloadPaise: quote.pricePerDownloadPaise,
        features: quote.features,
        utr,
        status: "pending",
        createdAt: new Date().toISOString(),
        reviewedAt: null,
        reviewNote: null,
        screenshotPath,
        screenshotUrl: null,
      };
      await firebasePut(`${paymentRequestsPath}/${encodeURIComponent(paymentRequest.id)}`, paymentRequest);
      res.status(201).json({ request: paymentRequest });
    });
  } catch (error) {
    sendError(req, res, error, "Could not submit your payment request.");
  }
});

router.post("/account/subscription/select", requireAccountAuth, (_req, res): void => {
  res.status(410).json({ error: "Paid plans activate only after you submit a UPI payment request and the owner approves it." });
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
    const plans = await loadPlans();
    res.json({
      users: Object.values(accounts)
        .map((account) => ({ ...publicAccount(account, plans), history: account.history || [] }))
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
    const plan = plans[planId];
    const days = daysValue(req.body?.days, plan?.durationDays || 1);
    const start = Math.max(Date.now(), new Date(account.accessEndsAt).getTime() || Date.now());
    const accessEndsAt = new Date(start + days * dayMs).toISOString();
    const streamLimit = plan?.streamLimit || account.streamLimit || 1;
    const next: AccountRecord = {
      ...account,
      activePlanId: planId,
      accessEndsAt,
      streamLimit,
      downloadsPerDay: plan?.downloadsPerDay || account.downloadsPerDay || 50,
      activeFeatures: plan?.features || account.activeFeatures || [],
      history: [
        { id: randomUUID(), type: "grant" as const, message: `Owner granted ${days} days`, at: new Date().toISOString(), planId, days, streamLimit, downloadsPerDay: plan?.downloadsPerDay || account.downloadsPerDay || 50 },
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
  try {
    const plans = await loadPlans();
    res.json({ plans: Object.values(plans) });
  } catch (error) {
    sendError(req, res, error, "Could not load plans.");
  }
});

router.post("/owner/plans", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = CreateBillingPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Complete the plan name, daily price, limits, and features." });
    return;
  }
  const values = parsed.data;
  if (!Number.isInteger(values.durationDays) || !Number.isInteger(values.pricePerStreamDayPaise)
    || (values.pricePerDownloadPaise !== undefined && !Number.isInteger(values.pricePerDownloadPaise))
    || !Number.isInteger(values.downloadsPerDay) || !Number.isInteger(values.streamLimit)) {
    res.status(400).json({ error: "Plan duration, price, stream limit, and download limit must be whole numbers." });
    return;
  }
  try {
    const now = new Date().toISOString();
    const plan: PlanRecord = {
      id: `plan-${randomUUID()}`,
      name: values.name.trim(),
      description: values.description.trim(),
      durationDays: daysValue(values.durationDays, 1),
      price: values.price.trim() || formatDailyPrice(values.pricePerStreamDayPaise),
      pricePerStreamDayPaise: values.pricePerStreamDayPaise,
      pricePerDownloadPaise: values.pricePerDownloadPaise ?? 0,
      downloadsPerDay: values.downloadsPerDay,
      streamLimit: values.streamLimit,
      features: values.features.map((feature) => feature.trim()).filter(Boolean),
      active: values.active !== false,
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
  const parsed = UpdateBillingPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Plan updates must use valid daily pricing, limits, and features." });
    return;
  }
  const patch = parsed.data;
  if ((patch.durationDays !== undefined && !Number.isInteger(patch.durationDays))
    || (patch.pricePerStreamDayPaise !== undefined && !Number.isInteger(patch.pricePerStreamDayPaise))
    || (patch.pricePerDownloadPaise !== undefined && !Number.isInteger(patch.pricePerDownloadPaise))
    || (patch.downloadsPerDay !== undefined && !Number.isInteger(patch.downloadsPerDay))
    || (patch.streamLimit !== undefined && !Number.isInteger(patch.streamLimit))) {
    res.status(400).json({ error: "Plan duration, price, stream limit, and download limit must be whole numbers." });
    return;
  }
  try {
    const plans = await loadPlans();
    const current = plans[req.params.planId];
    if (!current) {
      res.status(404).json({ error: "Plan not found." });
      return;
    }
    const plan: PlanRecord = {
      ...current,
      name: patch.name?.trim() || current.name,
      description: patch.description === undefined ? current.description : patch.description.trim(),
      durationDays: patch.durationDays === undefined ? current.durationDays : daysValue(patch.durationDays, current.durationDays),
      price: patch.price?.trim() || (patch.pricePerStreamDayPaise === undefined
        ? current.price
        : formatDailyPrice(patch.pricePerStreamDayPaise)),
      pricePerStreamDayPaise: patch.pricePerStreamDayPaise ?? current.pricePerStreamDayPaise ?? 0,
      pricePerDownloadPaise: patch.pricePerDownloadPaise ?? current.pricePerDownloadPaise ?? 0,
      downloadsPerDay: patch.downloadsPerDay ?? current.downloadsPerDay ?? 50,
      streamLimit: patch.streamLimit ?? current.streamLimit ?? 1,
      features: patch.features === undefined ? current.features || [] : patch.features.map((feature) => feature.trim()).filter(Boolean),
      active: patch.active ?? current.active,
      updatedAt: new Date().toISOString(),
    };
    await firebasePut(planPath(plan.id), plan);
    res.json({ plan });
  } catch (error) {
    sendError(req, res, error, "Could not update plan.");
  }
});

router.get("/owner/payment-settings", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  try {
    res.json(await paymentSettingsResponse(await loadPaymentSettings()));
  } catch (error) {
    sendError(req, res, error, "Could not load UPI payment settings.");
  }
});

router.put("/owner/payment-settings", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = UpdateOwnerPaymentSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid UPI ID and payee name." });
    return;
  }
  const upiId = parsed.data.upiId.trim();
  const payeeName = parsed.data.payeeName.trim();
  if (!isValidUpiId(upiId) || !payeeName) {
    res.status(400).json({ error: "Enter a valid UPI ID and payee name." });
    return;
  }
  try {
    const settings: PaymentSettingsRecord = {
      upiId,
      payeeName,
      qrImagePath: null,
      qrImageUrl: null,
      updatedAt: new Date().toISOString(),
    };
    await firebasePut(paymentSettingsPath, settings);
    res.json(await paymentSettingsResponse(settings));
  } catch (error) {
    sendError(req, res, error, "Could not save UPI payment settings.");
  }
});

router.get("/owner/payment-requests", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const status = typeof req.query.status === "string" ? req.query.status : "";
  if (status && !["pending", "approved", "rejected"].includes(status)) {
    res.status(400).json({ error: "Choose a valid payment request status." });
    return;
  }
  try {
    const requests = Object.values(await loadPaymentRequests())
      .filter((request) => !status || request.status === status)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    const requestsWithImages = await Promise.all(requests.map(async (request) => {
      if (!request.screenshotPath) return { ...request, screenshotUrl: null };
      try {
        return { ...request, screenshotUrl: await objectStorageService.getSignedDownloadURL(request.screenshotPath) };
      } catch (error) {
        req.log.warn({ requestId: request.id, error: error instanceof Error ? error.message : "unknown" }, "Payment proof image is unavailable");
        return { ...request, screenshotUrl: null };
      }
    }));
    res.json({ requests: requestsWithImages });
  } catch (error) {
    sendError(req, res, error, "Could not load payment requests.");
  }
});

router.post("/owner/payment-requests/:requestId/review", async (req, res): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  const parsed = ReviewOwnerPaymentRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Choose approve or reject and provide a valid review note." });
    return;
  }
  const requestId = req.params.requestId;
  const reviewedBy = accountUserId(req) || "owner";
  const reviewNote = parsed.data.note?.trim() || null;
  try {
    await withBillingLock(`payment-review:${requestId}`, async () => {
      const request = (await loadPaymentRequests())[requestId];
      if (!request) {
        res.status(404).json({ error: "Payment request not found." });
        return;
      }
      if (request.status !== "pending") {
        res.status(409).json({ error: "This payment request has already been reviewed." });
        return;
      }
      if (parsed.data.action === "reject") {
        const rejected: PaymentRequestRecord = {
          ...request,
          status: "rejected",
          reviewedAt: new Date().toISOString(),
          reviewedBy,
          reviewNote,
        };
        await firebasePut(`${paymentRequestsPath}/${encodeURIComponent(requestId)}`, rejected);
        res.json({ request: rejected });
        return;
      }

      await withBillingLock(`billing-account:${request.accountId}`, async () => {
        const latestRequest = (await loadPaymentRequests())[requestId];
        if (!latestRequest || latestRequest.status !== "pending") {
          res.status(409).json({ error: "This payment request has already been reviewed." });
          return;
        }
        const account = await loadAccount(latestRequest.accountId);
        if (!account) {
          res.status(404).json({ error: "The account for this payment request no longer exists." });
          return;
        }
        const plans = await loadPlans();
        const now = Date.now();
        const alreadyApplied = (account.history || []).some((item) => item.paymentRequestId === requestId);
        const previousEnd = Date.parse(account.accessEndsAt);
        const startsAt = Math.max(now, Number.isFinite(previousEnd) ? previousEnd : now);
        const accessEndsAt = alreadyApplied
          ? account.accessEndsAt
          : new Date(startsAt + latestRequest.durationDays * dayMs).toISOString();
        const purchase: AccountHistoryItem = {
          id: requestId,
          type: "purchase",
          message: `${latestRequest.planName} payment approved`,
          at: new Date(now).toISOString(),
          planId: latestRequest.planId,
          days: latestRequest.durationDays,
          streamLimit: latestRequest.streamLimit,
          streamsPerDay: latestRequest.streamsPerDay,
          downloadsPerDay: latestRequest.downloadsPerDay,
          totalDownloads: latestRequest.totalDownloads,
          amountPaise: latestRequest.amountPaise,
          utr: latestRequest.utr,
          features: latestRequest.features,
          paymentRequestId: requestId,
        };
        const nextAccount: AccountRecord = alreadyApplied ? account : {
          ...account,
          activePlanId: latestRequest.planId,
          accessEndsAt,
          streamLimit: account.streamLimit || plans[account.activePlanId]?.streamLimit || 1,
          streamsPerDay: latestRequest.streamsPerDay,
          downloadsPerDay: latestRequest.downloadsPerDay,
          activeFeatures: latestRequest.features,
          history: [purchase, ...(account.history || [])].slice(0, 50),
        };
        const approved: PaymentRequestRecord = {
          ...latestRequest,
          status: "approved",
          reviewedAt: new Date(now).toISOString(),
          reviewedBy,
          reviewNote,
        };
        await Promise.all([
          firebasePut(accountPath(account.id), nextAccount),
          firebasePut(licensePath(account.licenseId), {
            key: account.licenseKey,
            name: nextAccount.displayName,
            createdAt: nextAccount.createdAt,
            expiresAt: accessEndsAt,
            active: true,
            accountId: account.id,
          }),
          firebasePut(`${paymentRequestsPath}/${encodeURIComponent(requestId)}`, approved),
        ]);
        res.json({ request: approved });
      });
    });
  } catch (error) {
    sendError(req, res, error, "Could not review this payment request.");
  }
});

export async function accountLicenseExists(licenseId: string): Promise<boolean> {
  const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
  return Object.values(accounts).some((account) => account.licenseId === licenseId);
}

export async function getAccountStreamAccess(userId: string): Promise<{
  active: boolean;
  streamLimit: number;
  streamsPerDay: number;
  streamsStartedToday: number;
}> {
  const account = await loadAccount(userId);
  if (!account) return { active: false, streamLimit: 0, streamsPerDay: 0, streamsStartedToday: 0 };
  const plans = await loadPlans();
  const streamsPerDay = typeof account.streamsPerDay === "number" && Number.isSafeInteger(account.streamsPerDay) && account.streamsPerDay > 0
    ? account.streamsPerDay
    : plans[account.activePlanId]?.isTrial ? 1 : 100;
  const dayKey = currentUsageDayKey();
  return {
    active: isActive(account),
    streamLimit: account.streamLimit || plans[account.activePlanId]?.streamLimit || 1,
    streamsPerDay,
    streamsStartedToday: account.streamUsageDate === dayKey ? Math.max(0, account.streamsStartedToday || 0) : 0,
  };
}

export type StreamStartQuotaReservation<T> =
  | { ok: true; result: T; streamsPerDay: number; streamsStartedToday: number }
  | { ok: false; status: number; error: string };

export async function startAccountStreamWithQuota<T>(
  userId: string,
  start: () => Promise<T> | T,
): Promise<StreamStartQuotaReservation<T>> {
  return withBillingLock(`billing-account:${userId}`, async () => {
    const account = await loadAccount(userId);
    if (!account) return { ok: false, status: 403, error: "This signed-in account does not have a workspace." };
    if (!isActive(account)) return { ok: false, status: 403, error: "Your access has ended. Please upgrade your plan." };
    const plans = await loadPlans();
    const streamsPerDay = typeof account.streamsPerDay === "number" && Number.isSafeInteger(account.streamsPerDay) && account.streamsPerDay > 0
      ? account.streamsPerDay
      : plans[account.activePlanId]?.isTrial ? 1 : 100;
    const dayKey = currentUsageDayKey();
    const used = account.streamUsageDate === dayKey ? Math.max(0, account.streamsStartedToday || 0) : 0;
    if (used >= streamsPerDay) {
      return {
        ok: false,
        status: 429,
        error: `Your plan allows ${streamsPerDay} new stream${streamsPerDay === 1 ? "" : "s"} per day. You have used them all today.`,
      };
    }
    const updated: AccountRecord = {
      ...account,
      streamsPerDay,
      streamUsageDate: dayKey,
      streamsStartedToday: used + 1,
    };
    await firebasePut(accountPath(userId), updated);
    try {
      const result = await start();
      return { ok: true, result, streamsPerDay, streamsStartedToday: used + 1 };
    } catch (error) {
      await firebasePut(accountPath(userId), account);
      throw error;
    }
  });
}

export type DownloadQuotaReservation =
  | { ok: true; accountId: string; dayKey: string }
  | { ok: false; status: number; error: string };

export async function reserveAccountDownload(userId: string, licenseId: string): Promise<DownloadQuotaReservation> {
  const initial = await loadAccount(userId);
  if (!initial || initial.licenseId !== licenseId) {
    return { ok: false, status: 403, error: "This license does not belong to the signed-in account." };
  }
  return withBillingLock(`billing-account:${userId}`, async () => {
    const account = await loadAccount(userId);
    if (!account || account.licenseId !== licenseId) {
      return { ok: false, status: 403, error: "This license does not belong to the signed-in account." };
    }
    if (!isActive(account)) {
      return { ok: false, status: 403, error: "Your access has ended. Please upgrade your plan." };
    }
    const plans = await loadPlans();
    const downloadsPerDay = account.downloadsPerDay || plans[account.activePlanId]?.downloadsPerDay || 50;
    const dayKey = currentUsageDayKey();
    const used = account.downloadUsageDate === dayKey ? Math.max(0, account.downloadsUsedToday || 0) : 0;
    if (used >= downloadsPerDay) {
      return { ok: false, status: 429, error: "Your limit is now reached. Please upgrade your plan." };
    }
    await firebasePut(accountPath(userId), {
      ...account,
      downloadsPerDay,
      downloadUsageDate: dayKey,
      downloadsUsedToday: used + 1,
    });
    return { ok: true, accountId: userId, dayKey };
  });
}

export async function releaseAccountDownload(accountId: string, dayKey: string): Promise<void> {
  await withBillingLock(`billing-account:${accountId}`, async () => {
    const account = await loadAccount(accountId);
    if (!account || account.downloadUsageDate !== dayKey || !account.downloadsUsedToday) return;
    await firebasePut(accountPath(accountId), {
      ...account,
      downloadsUsedToday: Math.max(0, account.downloadsUsedToday - 1),
    });
  });
}

export default router;