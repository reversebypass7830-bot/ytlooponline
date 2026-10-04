import type { Request, Response } from "express";
import { clerkUserId } from "../middlewares/requireClerkAuth";

const defaultOwnerPassword = "traderp1wer";

function configuredOwnerPassword(): string {
  return process.env.OWNER_PASSWORD?.trim() || defaultOwnerPassword;
}

function configuredOwnerIds(): Set<string> {
  return new Set(
    (process.env.OWNER_CLERK_USER_IDS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export function ownerAuthorized(req: Request): boolean {
  const expected = configuredOwnerPassword();
  return Boolean(expected && req.header("x-owner-password") === expected);
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