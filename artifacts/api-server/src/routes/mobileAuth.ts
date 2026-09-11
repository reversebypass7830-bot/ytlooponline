import { randomBytes, randomUUID } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import { firebaseGet } from "../lib/firebase-rest";
import { clearMobileSession, setMobileSession } from "../middlewares/requireClerkAuth";

const router: IRouter = Router();
const providerBaseUrl = (process.env.MOBILE_OTP_API_BASE_URL || "https://rozgarapinew.teachx.in").replace(/\/+$/, "");
const providerOrigin = process.env.MOBILE_OTP_ORIGIN || "https://rojgarwithankit.co.in";
const providerAuthKey = process.env.MOBILE_OTP_AUTH_KEY || "appxapi";
const providerClientService = process.env.MOBILE_OTP_CLIENT_SERVICE || "Appx";
const challengeTtlMs = 5 * 60 * 1000;
const maxAttempts = 5;

type AccountRecord = { id: string; phone?: string; displayName: string; email: string; role: "owner" | "user"; licenseId: string; licenseKey: string; trialStartedAt: string; trialEndsAt: string; activePlanId: string; accessEndsAt: string; createdAt: string; lastLoginAt: string; history: Array<{ id: string; type: string; message: string; at: string; planId?: string; days?: number }> };
type AccountMap = Record<string, AccountRecord>;
type Challenge = { phone: string; deviceId: string; expiresAt: number; attempts: number };
type ProviderResponse = { status?: number; message?: string; user?: { phone?: string } };

const challenges = new Map<string, Challenge>();

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 && digits.endsWith(digits.slice(-10)) ? digits.slice(-10) : digits;
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
    challenges.set(requestId, { phone, deviceId, expiresAt: Date.now() + challengeTtlMs, attempts: 0 });
    res.json({ requestId, message: providerMessage(payload), expiresInSeconds: challengeTtlMs / 1000 });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile OTP send failed");
    res.status(502).json({ error: "Could not send the OTP. Please try again." });
  }
});

router.post("/mobile-auth/verify-otp", async (req: Request, res: Response): Promise<void> => {
  const requestId = typeof req.body?.requestId === "string" ? req.body.requestId : "";
  const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
  const challenge = challenges.get(requestId);
  if (!challenge || challenge.expiresAt < Date.now()) {
    challenges.delete(requestId);
    res.status(400).json({ error: "This OTP has expired. Request a new one." });
    return;
  }
  if (!/^\d{4}$/.test(otp)) {
    res.status(400).json({ error: "Enter the 4-digit OTP." });
    return;
  }
  if (challenge.attempts >= maxAttempts) {
    challenges.delete(requestId);
    res.status(429).json({ error: "Too many incorrect attempts. Request a new OTP." });
    return;
  }
  challenge.attempts += 1;
  try {
    const payload = await callProvider("/get/otpverify", {
      useremail: challenge.phone,
      otp,
      device_id: challenge.deviceId,
      mydeviceid: "",
      mydeviceid2: "",
    });
    if (!providerSucceeded(payload)) {
      const remaining = maxAttempts - challenge.attempts;
      res.status(401).json({ error: providerMessage(payload), attemptsRemaining: remaining });
      return;
    }
    const account = await findAccountByPhone(challenge.phone);
    challenges.delete(requestId);
    if (!account) {
      res.status(404).json({ code: "PHONE_NOT_LINKED", error: "OTP verified, but this number is not linked to an account. Sign in with Google first and add this number to your profile." });
      return;
    }
    setMobileSession(res, account.id);
    res.json({ message: "OTP verified.", account: { id: account.id, displayName: account.displayName, email: account.email, phone: account.phone, role: account.role } });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Mobile OTP verification failed");
    res.status(502).json({ error: "Could not verify the OTP. Please try again." });
  }
});

router.post("/mobile-auth/logout", (req, res): void => {
  clearMobileSession(res);
  res.json({ ok: true });
});

export default router;