import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { clerkUserId } from "../middlewares/requireClerkAuth";

const defaultOwnerPassword = "traderp1wer";
const ownerSessionCookieName = "ytloop_owner_session";
const ownerSessionDurationMs = 12 * 60 * 60 * 1000;
const rememberedOwnerSessionDurationMs = 30 * 24 * 60 * 60 * 1000;

function configuredOwnerPassword(): string {
  return process.env.OWNER_PASSWORD?.trim() || defaultOwnerPassword;
}

function configuredSessionSecret(): string {
  return process.env.SESSION_SECRET?.trim() || "";
}

function configuredOwnerIds(): Set<string> {
  return new Set(
    (process.env.OWNER_CLERK_USER_IDS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function ownerSessionIsConfigured(): boolean {
  return Boolean(configuredSessionSecret());
}

export function ownerPasswordMatches(password: unknown): boolean {
  if (typeof password !== "string") return false;
  const expected = Buffer.from(configuredOwnerPassword());
  const received = Buffer.from(password);
  return expected.length > 0 && expected.length === received.length && timingSafeEqual(expected, received);
}

function sessionCookieValue(req: Request): string {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== ownerSessionCookieName) continue;
    return part.slice(separator + 1).trim();
  }
  return "";
}

function cookieOptions(req: Request) {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  return {
    httpOnly: true,
    secure: req.secure || forwardedProto === "https",
    sameSite: "lax" as const,
    path: "/api",
  };
}

export function setOwnerSessionCookie(req: Request, res: Response, rememberMe: boolean): void {
  const secret = configuredSessionSecret();
  if (!secret) throw new Error("Owner sessions require SESSION_SECRET to be configured.");

  const durationMs = rememberMe ? rememberedOwnerSessionDurationMs : ownerSessionDurationMs;
  const payload = Buffer.from(JSON.stringify({
    version: 1,
    expiresAt: Date.now() + durationMs,
    nonce: randomUUID(),
  })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  res.cookie(ownerSessionCookieName, `${payload}.${signature}`, {
    ...cookieOptions(req),
    ...(rememberMe ? { maxAge: durationMs } : {}),
  });
}

export function clearOwnerSessionCookie(req: Request, res: Response): void {
  res.clearCookie(ownerSessionCookieName, cookieOptions(req));
}

export function ownerSessionAuthorized(req: Request): boolean {
  const secret = configuredSessionSecret();
  const token = sessionCookieValue(req);
  if (!secret || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const payload = token.slice(0, separator);
  const providedSignature = Buffer.from(token.slice(separator + 1), "base64url");
  const expectedSignature = Buffer.from(createHmac("sha256", secret).update(payload).digest("base64url"), "base64url");
  if (providedSignature.length !== expectedSignature.length || !timingSafeEqual(providedSignature, expectedSignature)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      version?: unknown;
      expiresAt?: unknown;
      nonce?: unknown;
    };
    return session.version === 1
      && typeof session.expiresAt === "number"
      && Number.isFinite(session.expiresAt)
      && session.expiresAt > Date.now()
      && typeof session.nonce === "string"
      && session.nonce.length > 0;
  } catch {
    return false;
  }
}

export function ownerAuthorized(req: Request): boolean {
  return ownerPasswordMatches(req.header("x-owner-password")) || ownerSessionAuthorized(req);
}

export function clerkOwnerAuthorized(req: Request): boolean {
  const userId = clerkUserId(req);
  return Boolean(userId && configuredOwnerIds().has(userId));
}

export function requireOwner(req: Request, res: Response): boolean {
  if (ownerAuthorized(req) || clerkOwnerAuthorized(req)) return true;
  res.status(401).json({ error: "Owner password is incorrect." });
  return false;
}