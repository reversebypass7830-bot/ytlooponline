import { Router, type IRouter } from "express";
import { firebaseDelete, firebaseGet, firebasePut } from "../lib/firebase-rest";
import { accountUserId, requireAccountAuth } from "../middlewares/requireClerkAuth";

const router: IRouter = Router();
const firebaseKeyPrefix = "__signal_desk_key__";

type AccountWorkspaceRecord = {
  id?: string;
  workspaceId?: string;
  // Existing accounts use this value as their workspace namespace; it is migrated on read.
  licenseId?: string;
  licenseKey?: string;
};

function validClientId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,128}$/.test(value);
}

function encodeFirebaseKey(key: string): string {
  if (!/[.$#[\]/]/.test(key)) return key;
  return `${firebaseKeyPrefix}${Buffer.from(key, "utf8").toString("base64url")}`;
}

function decodeFirebaseKey(key: string): string {
  if (!key.startsWith(firebaseKeyPrefix)) return key;
  try {
    return Buffer.from(key.slice(firebaseKeyPrefix.length), "base64url").toString("utf8");
  } catch {
    return key;
  }
}

function encodeFirebaseValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(encodeFirebaseValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [encodeFirebaseKey(key), encodeFirebaseValue(nested)]),
  );
}

function decodeFirebaseValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decodeFirebaseValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [decodeFirebaseKey(key), decodeFirebaseValue(nested)]),
  );
}

async function resolveWorkspaceId(userId: string): Promise<string | null> {
  const accountPath = `accounts/${encodeURIComponent(userId)}`;
  const stored = await firebaseGet<AccountWorkspaceRecord | null>(accountPath);
  if (!stored) return null;
  const workspaceId = stored.workspaceId || stored.licenseId || stored.id || userId;
  if (stored.workspaceId !== workspaceId || stored.licenseId || stored.licenseKey) {
    const { licenseId, licenseKey, ...account } = stored;
    await firebasePut(accountPath, { ...account, workspaceId });
    if (licenseId) {
      await firebaseDelete(`licenses/${encodeURIComponent(licenseId)}`);
    }
  }
  return workspaceId;
}

router.post("/account/workspace/get", requireAccountAuth, async (req, res): Promise<void> => {
  const userId = accountUserId(req);
  const clientId = req.body?.clientId;
  if (!userId) {
    res.status(401).json({ error: "Sign in is required to load this workspace." });
    return;
  }
  if (!validClientId(clientId)) {
    res.status(400).json({ error: "A browser id is required." });
    return;
  }
  try {
    const workspaceId = await resolveWorkspaceId(userId);
    if (!workspaceId) {
      res.status(404).json({ error: "Your account workspace could not be found." });
      return;
    }
    const data = await firebaseGet<unknown>(`workspaces/${encodeURIComponent(workspaceId)}/${encodeURIComponent(clientId)}`);
    res.json({ data: decodeFirebaseValue(data ?? null) });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Account workspace load failed");
    res.status(502).json({ error: "Could not load your workspace." });
  }
});

router.put("/account/workspace", requireAccountAuth, async (req, res): Promise<void> => {
  const userId = accountUserId(req);
  const clientId = req.body?.clientId;
  if (!userId) {
    res.status(401).json({ error: "Sign in is required to save this workspace." });
    return;
  }
  if (!validClientId(clientId) || !req.body?.data || typeof req.body.data !== "object" || Array.isArray(req.body.data)) {
    res.status(400).json({ error: "A browser id and workspace data are required." });
    return;
  }
  try {
    const workspaceId = await resolveWorkspaceId(userId);
    if (!workspaceId) {
      res.status(404).json({ error: "Your account workspace could not be found." });
      return;
    }
    await firebasePut(
      `workspaces/${encodeURIComponent(workspaceId)}/${encodeURIComponent(clientId)}`,
      encodeFirebaseValue(req.body.data),
    );
    res.json({ saved: true });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Account workspace save failed");
    res.status(502).json({ error: "Could not save your workspace." });
  }
});

export default router;