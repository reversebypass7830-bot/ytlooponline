import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { firebaseDelete, firebaseGet, firebasePut } from "../lib/firebase-rest";
import { clearMobileSession, setMobileSession } from "../middlewares/requireClerkAuth";
import { createMobileAccount } from "./accounts";

const router: IRouter = Router();
const providerBaseUrl = (process.env.MOBILE_OTP_API_BASE_URL || "https://rozgarapinew.teachx.in").replace(/\/+$/, "");
const providerOrigin = process.env.MOBILE_OTP_ORIGIN || "https://rojgarwithankit.co.in";
const providerAuthKey = process.env.MOBILE_OTP_AUTH_KEY || "appxapi";
const providerClientService = process.env.MOBILE_OTP_CLIENT_SERVICE || "Appx";
const challengeTtlMs = 5 * 60 * 1000;
const challengeTtlSeconds = challengeTtlMs / 1000;
const maxAttempts = 5;

type AccountRecord = { id: string; phone?: string; displayName: string; email: string; role: "owner" | "user"; licenseId: string; licenseKey: string; trialStartedAt: string; trialEndsAt: string; activePlanId: string; accessEndsAt: string; createdAt: string; lastLoginAt: string; history: Array<{ id: string; type: string; message: string; at: string; planId?: string; days?: number }> };
type AccountMap = Record<string, AccountRecord>;
type Challenge = { requestId: string; phone: string; deviceId: string; issuedAt: string; expiresAt: string; attempts: number };
type VerifiedMobileChallenge = { phone: string; expiresAt: number };
type ProviderResponse = { status?: number; message?: string; user?: { phone?: string } };

const verifiedChallenges = new Map<string, VerifiedMobileChallenge>();

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 && digits.endsWith(digits.slice(-10)) ? digits.slice(-10) : digits;
}

function challengePath(phone: string): string {
  const phoneHash = createHash("sha256").update(normalizePhone(phone)).digest("hex");
  return `otpChallenges/${phoneHash}`;
}

function isChallengeExpired(challenge: Challenge, nowMs = Date.now()): boolean {
  const expiryMs = Date.parse(challenge.expiresAt);
  return !Number.isFinite(expiryMs) || expiryMs <= nowMs;
}

function staleOtpError(res: Response): void {
  res.status(400).json({ error: "This OTP is no longer current. Request the latest OTP." });
}

function validPhone(value: string): boolean {
  return /^\d{10}$/.test(normalizePhone(value));
}

function providerHeaders(): Record<string, string> {
  return {
    accept: "*/*",
    "auth-key": providerAuthKey,
    "client-service": providerClientService,
    "device-type": "WebBrowser",
    "is-safari": "0",
    origin: providerOrigin,
    referer: `${providerOrigin}/`,
    source: "website",
  };
}

async function callProvider(path: string, query: Record<string, string>): Promise<ProviderResponse> {
  const url = new URL(`${providerBaseUrl}${path}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, { headers: providerHeaders(), signal: AbortSignal.timeout(15_000) });
  const payload = await response.json().catch(() => ({})) as ProviderResponse;
  if (!response.ok) throw new Error(`OTP provider returned HTTP ${response.status}.`);
  return payload;
}

function providerSucceeded(payload: ProviderResponse): boolean {
  return payload.status === 200 || /sent|success|valid/i.test(payload.message || "");
}

function providerOtpSucceeded(payload: ProviderResponse): boolean {
  const message = payload.message || "";
  if (/invalid|incorrect|wrong|expired|not\s+valid|failed|failure|error|mismatch|does\s+not\s+match|rejected/i.test(message)) {
    return false;
  }
  return payload.status === 200 || /verified|success|valid|authenticated/i.test(message);
}

function providerMessage(payload: ProviderResponse): string {
  return payload.message || "The OTP provider rejected the request.";
}

async function findAccountByPhone(phone: string): Promise<AccountRecord | null> {
  const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
  const normalized = normalizePhone(phone);
  return Object.values(accounts).find((account) => account.phone && normalizePhone(account.phone) === normalized) || null;
}

router.post("/mobile-auth/send-otp", async (req: Request, res: Response): Promise<void> => {
  const phone = typeof req.body?.phone === "string" ? normalizePhone(req.body.phone) : "";
  if (!validPhone(phone)) {
    res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
    return;
  }
  const deviceId = `WebBrowser${Date.now()}${randomBytes(6).toString("hex")}`;
  try {
    const payload = await callProvider("/get/sendotp", { phone });
    if (!providerSucceeded(payload)) {
      res.status(502).json({ error: providerMessage(payload), providerStatus: payload.status ?? 0 });
      return;
    }
    const requestId = randomUUID();
    const issuedAtMs = Date.now();
    const challenge: Challenge = {
      requestId,
      phone,
      deviceId,
      issuedAt: new Date(issuedAtMs).toISOString(),
      expiresAt: new Date(issuedAtMs + challengeTtlMs).toISOString(),
      attempts: 0,
    };
    // This single record is keyed by the normalized phone, so a new OTP
    // atomically replaces the previous request id and expiry.
    await firebasePut(challengePath(phone), challenge);
    res.json({ requestId, message: providerMessage(payload), expiresAt: challenge.expiresAt, expiresInSeconds: challengeTtlSeconds });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile OTP send failed");
    res.status(502).json({ error: "Could not send the OTP. Please try again." });
  }
});

router.post("/mobile-auth/verify-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = typeof req.body?.requestId === "string" ? req.body.requestId : "";
    const phone = typeof req.body?.phone === "string" ? normalizePhone(req.body.phone) : "";
    const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
    if (!validPhone(phone) || !requestId) {
      staleOtpError(res);
      return;
    }
    const path = challengePath(phone);
    const challenge = await firebaseGet<Challenge | null>(path);
    if (!challenge || challenge.requestId !== requestId || challenge.phone !== phone) {
      staleOtpError(res);
      return;
    }
    if (isChallengeExpired(challenge)) {
      await firebaseDelete(path);
      res.status(400).json({ error: "This OTP has expired. Request a new one." });
      return;
    }
    if (!/^\d{4}$/.test(otp)) {
      res.status(400).json({ error: "Enter the 4-digit OTP." });
      return;
    }
    if (challenge.attempts >= maxAttempts) {
      await firebaseDelete(path);
      res.status(429).json({ error: "Too many incorrect attempts. Request a new OTP." });
      return;
    }
    const attempt = { ...challenge, attempts: challenge.attempts + 1 };
    await firebasePut(path, attempt);
    try {
      const payload = await callProvider("/get/otpverify", {
        useremail: phone,
        otp,
        device_id: attempt.deviceId,
        mydeviceid: "",
        mydeviceid2: "",
      });
      if (!providerOtpSucceeded(payload)) {
        const remaining = maxAttempts - attempt.attempts;
        res.status(401).json({ error: providerMessage(payload), attemptsRemaining: remaining });
        return;
      }
      // A resend may have replaced this request while the provider call was
      // in flight. Read the current record again before granting access.
      const latest = await firebaseGet<Challenge | null>(path);
      if (!latest || latest.requestId !== requestId || latest.phone !== phone) {
        staleOtpError(res);
        return;
      }
      if (isChallengeExpired(latest)) {
        await firebaseDelete(path);
        res.status(400).json({ error: "This OTP has expired. Request a new one." });
        return;
      }
      const account = await findAccountByPhone(phone);
      await firebaseDelete(path);
      if (!account) {
        const onboardingToken = randomUUID();
        verifiedChallenges.set(onboardingToken, { phone, expiresAt: Date.now() + challengeTtlMs });
        res.json({ code: "PROFILE_REQUIRED", onboardingToken, phone, message: "Mobile number verified. Complete your profile to create your workspace." });
        return;
      }
      setMobileSession(res, account.id);
      res.json({ message: "OTP verified.", account: { id: account.id, displayName: account.displayName, email: account.email, phone: account.phone, role: account.role } });
    } catch (error) {
      req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile OTP verification failed");
      res.status(502).json({ error: "Could not verify the OTP. Please try again." });
    }
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile OTP challenge lookup failed");
    if (!res.headersSent) res.status(502).json({ error: "Could not verify the OTP. Please try again." });
  }
});

router.post("/mobile-auth/complete-profile", async (req: Request, res: Response): Promise<void> => {
  const onboardingToken = typeof req.body?.onboardingToken === "string" ? req.body.onboardingToken : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim() : "";
  const verified = verifiedChallenges.get(onboardingToken);
  if (!verified || verified.expiresAt < Date.now()) {
    verifiedChallenges.delete(onboardingToken);
    res.status(400).json({ error: "Your mobile verification has expired. Request a new OTP." });
    return;
  }
  if (!displayName || displayName.length < 2) {
    res.status(400).json({ error: "Enter your name to continue." });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  try {
    const { account } = await createMobileAccount({ phone: verified.phone, email, displayName });
    verifiedChallenges.delete(onboardingToken);
    setMobileSession(res, account.id);
    res.status(201).json({
      message: "Your workspace is ready.",
      account: {
        id: account.id,
        displayName: account.displayName,
        email: account.email,
        phone: account.phone,
        licenseKey: account.licenseKey,
        accessEndsAt: account.accessEndsAt,
      },
    });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile profile completion failed");
    res.status(502).json({ error: "Could not create your workspace. Please try again." });
  }
});

router.post("/mobile-auth/logout", (req, res): void => {
  clearMobileSession(res);
  res.json({ ok: true });
});

export default router;