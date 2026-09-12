import { Router, type IRouter, type Request, type Response } from "express";
import { clearFirebaseSession, setFirebaseSession } from "../middlewares/requireClerkAuth";
import { ensureFirebaseAccount } from "./accounts";

const router: IRouter = Router();

type FirebaseLookupUser = {
  localId?: string;
  email?: string;
  displayName?: string;
};

type FirebaseLookupResponse = {
  users?: FirebaseLookupUser[];
  error?: { message?: string };
};

async function lookupFirebaseToken(idToken: string): Promise<{ userId: string; email: string; name: string }> {
  const apiKey = process.env.FIREBASE_API_KEY?.trim();
  if (!apiKey) throw new Error("FIREBASE_API_KEY is not configured.");
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = await response.json().catch(() => ({})) as FirebaseLookupResponse;
  const user = payload.users?.[0];
  if (!response.ok || !user?.localId) {
    throw new Error(payload.error?.message || "Firebase did not accept this Google sign-in.");
  }
  return {
    userId: user.localId,
    email: user.email || "",
    name: user.displayName || "",
  };
}

router.post("/firebase-auth/session", async (req: Request, res: Response): Promise<void> => {
  const idToken = typeof req.body?.idToken === "string" ? req.body.idToken.trim() : "";
  if (!idToken) {
    res.status(400).json({ error: "Firebase sign-in token is required." });
    return;
  }
  try {
    const identity = await lookupFirebaseToken(idToken);
    const { account, plans } = await ensureFirebaseAccount(identity);
    setFirebaseSession(res, { ...identity, userId: account.id });
    res.json({ account, plans: Object.values(plans).filter((plan) => plan.active) });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Firebase sign-in failed");
    res.status(401).json({ error: error instanceof Error ? error.message : "Could not sign in with Google." });
  }
});

router.post("/firebase-auth/logout", (_req, res): void => {
  clearFirebaseSession(res);
  res.json({ ok: true });
});

export default router;