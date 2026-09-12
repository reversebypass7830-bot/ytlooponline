import { Readable } from "node:stream";
import { Router, type IRouter, type Request, type Response } from "express";
import { accountUserId, requireAccountAuth } from "../middlewares/requireClerkAuth";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const maxProfileImageBytes = 5 * 1024 * 1024;
const profileImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

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