import { createHash, randomUUID } from "node:crypto";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  SendAccountPhoneOtpBody,
  SendAccountPhoneOtpResponse,
  VerifyAccountPhoneOtpBody,
  VerifyAccountPhoneOtpResponse,
} from "@workspace/api-zod";
import { firebaseDelete, firebaseGet, firebaseGetWithEtag, firebasePut, firebasePutIfMatch } from "../lib/firebase-rest";
import { accountUserId, clearMobileSession, requireAccountAuth, setMobileSession } from "../middlewares/requireClerkAuth";
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
type AccountPhoneChallenge = Challenge & { accountId: string };
type VerifiedMobileChallenge = { phone: string; expiresAt: number };
type ProviderResponse = { status?: number; message?: string; user?: { phone?: string } };
type AccountSummary = Pick<AccountRecord, "id" | "displayName" | "email" | "phone" | "role">;
type CompletedMobileChallenge =
  | { kind: "profile"; phone: string; onboardingToken: string; expiresAt: number }
  | { kind: "account"; phone: string; account: AccountSummary; expiresAt: number };

const verifiedChallenges = new Map<string, VerifiedMobileChallenge>();
const completedChallenges = new Map<string, CompletedMobileChallenge>();

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length > 10 && digits.endsWith(digits.slice(-10)) ? digits.slice(-10) : digits;
}

function challengePath(phone: string): string {
  const phoneHash = createHash("sha256").update(normalizePhone(phone)).digest("hex");
  return `otpChallenges/${phoneHash}`;
}

function accountPhoneChallengePath(accountId: string, phone: string): string {
  const accountHash = createHash("sha256").update(accountId).digest("hex");
  const phoneHash = createHash("sha256").update(normalizePhone(phone)).digest("hex");
  return `otpChallenges/account-phone/${accountHash}/${phoneHash}`;
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

function respondWithCompletedChallenge(req: Request, res: Response, completed: CompletedMobileChallenge): void {
  if (completed.kind === "profile") {
    res.json({
      code: "PROFILE_REQUIRED",
      onboardingToken: completed.onboardingToken,
      phone: completed.phone,
      message: "Mobile number verified. Complete your profile to create your workspace.",
    });
    return;
  }

  setMobileSession(req, res, completed.account.id);
  res.json({
    message: "OTP verified.",
    account: completed.account,
  });
}

async function findAccountByPhone(phone: string): Promise<AccountRecord | null> {
  const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
  const normalized = normalizePhone(phone);
  return Object.values(accounts).find((account) => account.phone && normalizePhone(account.phone) === normalized) || null;
}

function findAccountInMap(accounts: AccountMap, accountId: string): AccountRecord | null {
  return accounts[accountId] || Object.values(accounts).find((account) => account.id === accountId) || null;
}

function phoneLinkedToAnotherAccount(accounts: AccountMap, phone: string, accountId: string): boolean {
  const normalized = normalizePhone(phone);
  return Object.values(accounts).some((account) =>
    account.id !== accountId && account.phone && normalizePhone(account.phone) === normalized);
}

router.post("/account/phone/send-otp", requireAccountAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = SendAccountPhoneOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
    return;
  }
  const accountId = accountUserId(req);
  const phone = normalizePhone(parsed.data.phone);
  if (!accountId || !validPhone(phone)) {
    res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
    return;
  }

  try {
    const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
    const account = findAccountInMap(accounts, accountId);
    if (!account) {
      res.status(404).json({ error: "Your account could not be found." });
      return;
    }
    if (account.phone) {
      const message = normalizePhone(account.phone) === phone
        ? "This mobile number is already linked to your account."
        : "Your verified mobile number is locked and cannot be changed.";
      res.status(409).json({ error: message });
      return;
    }
    if (phoneLinkedToAnotherAccount(accounts, phone, account.id)) {
      res.status(409).json({ error: "This mobile number is already linked to another account." });
      return;
    }

    const requestedDeviceId = parsed.data.deviceId?.trim() || "";
    const deviceId = /^[A-Za-z0-9._:-]{8,80}$/.test(requestedDeviceId)
      ? requestedDeviceId
      : `WebBrowser-${createHash("sha256").update(`${account.id}:${phone}`).digest("hex").slice(0, 24)}`;
    const payload = await callProvider("/get/sendotp", { phone });
    if (!providerSucceeded(payload)) {
      res.status(502).json({ error: providerMessage(payload), providerStatus: payload.status ?? 0 });
      return;
    }
    const requestId = randomUUID();
    const issuedAtMs = Date.now();
    const challenge: AccountPhoneChallenge = {
      requestId,
      phone,
      deviceId,
      accountId: account.id,
      issuedAt: new Date(issuedAtMs).toISOString(),
      expiresAt: new Date(issuedAtMs + challengeTtlMs).toISOString(),
      attempts: 0,
    };
    await firebasePut(accountPhoneChallengePath(account.id, phone), challenge);
    res.json(SendAccountPhoneOtpResponse.parse({
      requestId,
      expiresAt: challenge.expiresAt,
      expiresInSeconds: challengeTtlSeconds,
    }));
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Account phone OTP send failed");
    res.status(502).json({ error: "Could not send the verification code. Please try again." });
  }
});

router.post("/account/phone/verify-otp", requireAccountAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = VerifyAccountPhoneOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter the valid mobile number and 4-digit OTP." });
    return;
  }
  const accountId = accountUserId(req);
  const phone = normalizePhone(parsed.data.phone);
  if (!accountId || !validPhone(phone)) {
    res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
    return;
  }

  const path = accountPhoneChallengePath(accountId, phone);
  try {
    const accounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
    const account = findAccountInMap(accounts, accountId);
    if (!account) {
      res.status(404).json({ error: "Your account could not be found." });
      return;
    }
    if (account.phone) {
      if (normalizePhone(account.phone) === phone) {
        res.json(VerifyAccountPhoneOtpResponse.parse({
          phone: account.phone,
          message: "This mobile number is already verified on your account.",
        }));
        return;
      }
      res.status(409).json({ error: "Your verified mobile number is locked and cannot be changed." });
      return;
    }
    if (phoneLinkedToAnotherAccount(accounts, phone, account.id)) {
      res.status(409).json({ error: "This mobile number is already linked to another account." });
      return;
    }

    const challenge = await firebaseGet<AccountPhoneChallenge | null>(path);
    if (!challenge || challenge.requestId !== parsed.data.requestId || challenge.phone !== phone || challenge.accountId !== account.id) {
      staleOtpError(res);
      return;
    }
    if (isChallengeExpired(challenge)) {
      await firebaseDelete(path);
      res.status(400).json({ error: "This OTP has expired. Request a new one." });
      return;
    }
    if (challenge.attempts >= maxAttempts) {
      await firebaseDelete(path);
      res.status(429).json({ error: "Too many incorrect attempts. Request a new OTP." });
      return;
    }

    const attempt = { ...challenge, attempts: challenge.attempts + 1 };
    await firebasePut(path, attempt);
    const payload = await callProvider("/get/otpverify", {
      useremail: phone,
      otp: parsed.data.otp,
      device_id: attempt.deviceId,
      mydeviceid: "",
      mydeviceid2: "",
    });
    if (!providerOtpSucceeded(payload)) {
      res.status(401).json({
        error: providerMessage(payload),
        attemptsRemaining: maxAttempts - attempt.attempts,
      });
      return;
    }

    const latest = await firebaseGet<AccountPhoneChallenge | null>(path);
    if (!latest || latest.requestId !== parsed.data.requestId || latest.phone !== phone || latest.accountId !== account.id) {
      staleOtpError(res);
      return;
    }
    if (isChallengeExpired(latest)) {
      await firebaseDelete(path);
      res.status(400).json({ error: "This OTP has expired. Request a new one." });
      return;
    }

    const latestAccounts = (await firebaseGet<AccountMap | null>("accounts")) ?? {};
    const latestAccount = findAccountInMap(latestAccounts, account.id);
    if (!latestAccount) {
      res.status(404).json({ error: "Your account could not be found." });
      return;
    }
    if (latestAccount.phone) {
      if (normalizePhone(latestAccount.phone) === phone) {
        await firebaseDelete(path);
        res.json(VerifyAccountPhoneOtpResponse.parse({
          phone: latestAccount.phone,
          message: "This mobile number is already verified on your account.",
        }));
        return;
      }
      await firebaseDelete(path);
      res.status(409).json({ error: "Your verified mobile number is locked and cannot be changed." });
      return;
    }
    if (phoneLinkedToAnotherAccount(latestAccounts, phone, latestAccount.id)) {
      res.status(409).json({ error: "This mobile number is already linked to another account." });
      return;
    }

    const verifiedPhone = `+91${phone}`;
    const accountPath = `accounts/${encodeURIComponent(latestAccount.id)}`;
    let phoneSaved = false;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const snapshot = await firebaseGetWithEtag<AccountRecord | null>(accountPath);
      const currentAccount = snapshot.value;
      if (!currentAccount) {
        await firebaseDelete(path);
        res.status(404).json({ error: "Your account could not be found." });
        return;
      }
      if (currentAccount.phone) {
        await firebaseDelete(path);
        if (normalizePhone(currentAccount.phone) === phone) {
          res.json(VerifyAccountPhoneOtpResponse.parse({
            phone: currentAccount.phone,
            message: "This mobile number is already verified on your account.",
          }));
        } else {
          res.status(409).json({ error: "Your verified mobile number is locked and cannot be changed." });
        }
        return;
      }
      if (await firebasePutIfMatch(accountPath, { ...currentAccount, phone: verifiedPhone }, snapshot.etag)) {
        phoneSaved = true;
        break;
      }
    }
    if (!phoneSaved) {
      await firebaseDelete(path);
      res.status(409).json({ error: "Your account changed during verification. Request a new code and try again." });
      return;
    }
    await firebaseDelete(path);
    res.json(VerifyAccountPhoneOtpResponse.parse({
      phone: verifiedPhone,
      message: "Mobile number verified and saved.",
    }));
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Account phone OTP verification failed");
    res.status(502).json({ error: "Could not verify the code. Please try again." });
  }
});

router.post("/mobile-auth/send-otp", async (req: Request, res: Response): Promise<void> => {
  const phone = typeof req.body?.phone === "string" ? normalizePhone(req.body.phone) : "";
  if (!validPhone(phone)) {
    res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
    return;
  }
  const requestedDeviceId = typeof req.body?.deviceId === "string" ? req.body.deviceId.trim() : "";
  const deviceId = /^[A-Za-z0-9._:-]{8,80}$/.test(requestedDeviceId)
    ? requestedDeviceId
    : `WebBrowser-${createHash("sha256").update(phone).digest("hex").slice(0, 24)}`;
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
    const completed = completedChallenges.get(requestId);
    if (completed) {
      if (completed.phone === phone && completed.expiresAt > Date.now()) {
        respondWithCompletedChallenge(req, res, completed);
        return;
      }
      completedChallenges.delete(requestId);
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
      const completedAt = Date.now() + challengeTtlMs;
      if (!account) {
        const onboardingToken = randomUUID();
        verifiedChallenges.set(onboardingToken, { phone, expiresAt: completedAt });
        const completedChallenge: CompletedMobileChallenge = {
          kind: "profile",
          phone,
          onboardingToken,
          expiresAt: completedAt,
        };
        completedChallenges.set(requestId, completedChallenge);
        await firebaseDelete(path);
        respondWithCompletedChallenge(req, res, completedChallenge);
        return;
      }

      const accountSummary: AccountSummary = {
        id: account.id,
        displayName: account.displayName,
        email: account.email,
        phone: account.phone,
        role: account.role,
      };
      const completedChallenge: CompletedMobileChallenge = {
        kind: "account",
        phone,
        account: accountSummary,
        expiresAt: completedAt,
      };
      completedChallenges.set(requestId, completedChallenge);
      await firebaseDelete(path);
      respondWithCompletedChallenge(req, res, completedChallenge);
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
    setMobileSession(req, res, account.id);
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
  clearMobileSession(req, res);
  res.json({ ok: true });
});

export default router;