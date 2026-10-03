import { Readable } from "node:stream";
import { Router, type IRouter, type Request, type Response } from "express";
import { CreateAccountPaymentProofUploadUrlBody } from "@workspace/api-zod";
import { accountUserId, requireAccountAuth } from "../middlewares/requireClerkAuth";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { requireAccountOwner } from "./accounts";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const maxProfileImageBytes = 5 * 1024 * 1024;
const profileImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);
const paymentImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxPaymentImageBytes = 5 * 1024 * 1024;

async function preparePaymentAssetUpload(
  req: Request,
  res: Response,
  kind: "proof" | "qr",
  ownerId: string,
): Promise<void> {
  const parsed = CreateAccountPaymentProofUploadUrlBody.safeParse(req.body);
  const contentType = parsed.success ? parsed.data.contentType.toLowerCase() : "";
  const extension = paymentImageTypes.get(contentType);
  const size = parsed.success ? parsed.data.size : 0;
  if (!parsed.success || !extension || !Number.isFinite(size) || size <= 0 || size > maxPaymentImageBytes) {
    res.status(400).json({ error: "Choose a JPG, PNG, or WebP image up to 5 MB." });
    return;
  }
  try {
    const result = await objectStorageService.getPaymentAssetUploadURL(ownerId, kind, extension);
    res.json({ ...result, contentType, maxBytes: maxPaymentImageBytes });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Payment image upload URL failed");
    res.status(502).json({ error: "Could not prepare payment image storage." });
  }
}

router.post("/account/payment-proof/upload-url", requireAccountAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = accountUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Sign in is required." });
    return;
  }
  await preparePaymentAssetUpload(req, res, "proof", userId);
});

router.post("/owner/payment-qr/upload-url", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAccountOwner(req, res))) return;
  await preparePaymentAssetUpload(req, res, "qr", accountUserId(req) || "owner");
});

router.post("/account/profile-image/upload-url", requireAccountAuth, async (req: Request, res: Response): Promise<void> => {
  const userId = accountUserId(req);
  const contentType = typeof req.body?.contentType === "string" ? req.body.contentType.toLowerCase() : "";
  const size = Number(req.body?.size);
  const extension = profileImageTypes.get(contentType);
  if (!userId || !extension || !Number.isFinite(size) || size <= 0 || size > maxProfileImageBytes) {
    res.status(400).json({ error: "Choose a JPG, PNG, WebP, or GIF image up to 5 MB." });
    return;
  }
  try {
    const result = await objectStorageService.getProfileImageUploadURL(userId, extension);
    res.json({ ...result, contentType, maxBytes: maxProfileImageBytes });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Profile image upload URL failed");
    res.status(502).json({ error: "Could not prepare profile image storage." });
  }
});

router.get("/storage/objects/*path", requireAccountAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.params.path;
    const objectPath = `/objects/${Array.isArray(raw) ? raw.join("/") : raw}`;
    const userId = accountUserId(req);
    const ownProofPrefix = `/objects/payment-proof/${encodeURIComponent(userId || "")}/`;
    if (objectPath.startsWith("/objects/payment-proof/") && !objectPath.startsWith(ownProofPrefix)) {
      if (!(await requireAccountOwner(req, res))) return;
    }
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) Readable.fromWeb(response.body as ReadableStream<Uint8Array>).pipe(res);
    else res.end();
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Profile image not found." });
      return;
    }
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Profile image download failed");
    res.status(500).json({ error: "Could not load profile image." });
  }
});

export default router;