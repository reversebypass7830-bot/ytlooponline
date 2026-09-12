import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

const mobileSessionCookie = "rlb_mobile_session";
const firebaseSessionCookie = "streamly_firebase_session";
const mobileSessionTtlSeconds = 30 * 24 * 60 * 60;
const firebaseSessionTtlSeconds = 30 * 24 * 60 * 60;

export type FirebaseSessionIdentity = {
  userId: string;
  email: string;
  name: string;
};

export function clerkUserId(req: Request): string | null {
  return getAuth(req).userId || null;
}

function sessionSecret(): string {
  const value = process.env.SESSION_SECRET?.trim();
  if (!value) throw new Error("SESSION_SECRET is required for mobile sessions.");
  return value;
}

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.cookie || "";
  const match = raw.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function signMobilePayload(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createMobileSession(accountId: string): { value: string; maxAge: number } {
  const payload = Buffer.from(JSON.stringify({
    sub: accountId,
    exp: Math.floor(Date.now() / 1000) + mobileSessionTtlSeconds,
    kind: "mobile",
  })).toString("base64url");
  return { value: `${payload}.${signMobilePayload(payload)}`, maxAge: mobileSessionTtlSeconds };
}

export function mobileSessionAccountId(req: Request): string | null {
  const value = readCookie(req, mobileSessionCookie);
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = signMobilePayload(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number; kind?: string };
    return parsed.kind === "mobile" && typeof parsed.sub === "string" && Number(parsed.exp) > Math.floor(Date.now() / 1000) ? parsed.sub : null;
  } catch {
    return null;
  }
}

export function firebaseSessionIdentity(req: Request): FirebaseSessionIdentity | null {
  const value = readCookie(req, firebaseSessionCookie);
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = signMobilePayload(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      email?: string;
      name?: string;
      exp?: number;
      kind?: string;
    };
    if (parsed.kind !== "firebase" || typeof parsed.sub !== "string" || Number(parsed.exp) <= Math.floor(Date.now() / 1000)) return null;
    return { userId: parsed.sub, email: typeof parsed.email === "string" ? parsed.email : "", name: typeof parsed.name === "string" ? parsed.name : "" };
  } catch {
    return null;
  }
}

export function setFirebaseSession(res: Response, identity: FirebaseSessionIdentity): void {
  const payload = Buffer.from(JSON.stringify({
    sub: identity.userId,
    email: identity.email,
    name: identity.name,
    exp: Math.floor(Date.now() / 1000) + firebaseSessionTtlSeconds,
    kind: "firebase",
  })).toString("base64url");
  const value = `${payload}.${signMobilePayload(payload)}`;
  res.setHeader("Set-Cookie", `${firebaseSessionCookie}=${encodeURIComponent(value)}; Max-Age=${firebaseSessionTtlSeconds}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}

export function clearFirebaseSession(res: Response): void {
  res.setHeader("Set-Cookie", `${firebaseSessionCookie}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}

export function accountIdentity(req: Request): FirebaseSessionIdentity | null {
  const clerkId = clerkUserId(req);
  if (clerkId) {
    const claims = clerkSessionClaims(req);
    return {
      userId: clerkId,
      email: typeof claims.email === "string" ? claims.email : typeof claims.email_address === "string" ? claims.email_address : "",
      name: typeof claims.name === "string" ? claims.name : [claims.first_name, claims.last_name].filter((value): value is string => typeof value === "string" && Boolean(value)).join(" "),
    };
  }
  const firebase = firebaseSessionIdentity(req);
  if (firebase) return firebase;
  const mobileId = mobileSessionAccountId(req);
  return mobileId ? { userId: mobileId, email: "", name: "" } : null;
}

export function accountUserId(req: Request): string | null {
  return accountIdentity(req)?.userId || null;
}

export function setMobileSession(res: Response, accountId: string): void {
  const session = createMobileSession(accountId);
  res.setHeader("Set-Cookie", `${mobileSessionCookie}=${encodeURIComponent(session.value)}; Max-Age=${session.maxAge}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}

export function clearMobileSession(res: Response): void {
  res.setHeader("Set-Cookie", `${mobileSessionCookie}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
}

export function clerkSessionClaims(req: Request): Record<string, unknown> {
  return (getAuth(req).sessionClaims || {}) as Record<string, unknown>;
}

export function requireClerkAuth(req: Request, res: Response, next: NextFunction): void {
  if (!clerkUserId(req)) {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }
  next();
}

export function requireAccountAuth(req: Request, res: Response, next: NextFunction): void {
  if (!accountUserId(req)) {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }
  next();
}