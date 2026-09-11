import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";

export function clerkUserId(req: Request): string | null {
  return getAuth(req).userId || null;
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