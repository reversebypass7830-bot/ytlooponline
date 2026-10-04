import { Router, type IRouter } from "express";
import { addVidKrakenToken, deleteVidKrakenToken, listVidKrakenTokens } from "../lib/vidkraken";
import { requireOwner } from "../lib/owner-auth";

const router: IRouter = Router();

router.get("/owner/vidkraken-keys", async (req, res): Promise<void> => {
  if (!requireOwner(req, res)) return;
  try {
    const tokens = await listVidKrakenTokens();
    res.json({ count: tokens.length, tokens });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "VidKraken token list failed");
    res.status(500).json({ error: "Could not read the VidKraken token pool." });
  }
});

router.post("/owner/vidkraken-keys", async (req, res): Promise<void> => {
  if (!requireOwner(req, res)) return;
  const value = typeof req.body?.token === "string" ? req.body.token : "";
  try {
    const key = await addVidKrakenToken(value);
    res.status(201).json({ key, added: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add the VidKraken token.";
    res.status(400).json({ error: message });
  }
});

router.delete("/owner/vidkraken-keys/:tokenKey", async (req, res): Promise<void> => {
  if (!requireOwner(req, res)) return;
  try {
    await deleteVidKrakenToken(req.params.tokenKey);
    res.json({ key: req.params.tokenKey, deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete the VidKraken token.";
    res.status(400).json({ error: message });
  }
});

export default router;