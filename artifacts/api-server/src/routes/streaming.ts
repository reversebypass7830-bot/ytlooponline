import { PassThrough } from "node:stream";
import { Router, type IRouter } from "express";
import {
  GetStreamStatusParams,
  GetStreamStatusResponse,
  StartStreamBody,
  StartStreamResponse,
  StopStreamBody,
  StopStreamResponse,
} from "@workspace/api-zod";
import { accountIdentity, requireAccountAuth } from "../middlewares/requireClerkAuth";
import { getAccountStreamAccess, startAccountStreamWithQuota } from "./accounts";
import {
  getStreamStatus,
  getStreamPreviewFile,
  appendVoiceAudio,
  attachLiveWebcam,
  detachLiveWebcam,
  startStream,
  stopStream,
  updateStream,
} from "../lib/stream-runner";

const router: IRouter = Router();
const accountStreamOwners = new Map<string, string>();

router.post("/stream/start", requireAccountAuth, async (req, res): Promise<void> => {
  const parsed = StartStreamBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid stream start request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const identity = accountIdentity(req);
    if (!identity) {
      res.status(401).json({ error: "Sign in is required to start a stream." });
      return;
    }
    const access = await getAccountStreamAccess(identity.userId);
    if (!access.active) {
      res.status(403).json({ error: "Your access has ended. Please upgrade your plan." });
      return;
    }
    let ownedActiveCount = 0;
    for (const [streamId, ownerId] of accountStreamOwners) {
      if (getStreamStatus(streamId).status !== "running") {
        accountStreamOwners.delete(streamId);
      } else if (ownerId === identity.userId) {
        ownedActiveCount += 1;
      }
    }
    const isAlreadyCounted = accountStreamOwners.get(parsed.data.streamId) === identity.userId;
    if (!isAlreadyCounted && ownedActiveCount >= access.streamLimit) {
      res.status(429).json({ error: `Your plan allows up to ${access.streamLimit} simultaneous streams. Please upgrade your plan.` });
      return;
    }
    const start = () => StartStreamResponse.parse(startStream({
      streamId: parsed.data.streamId,
      ingestUrl: parsed.data.ingestUrl,
      category: parsed.data.category,
      videoSource: parsed.data.videoSource,
      videoSources: parsed.data.videoSources,
      faceCategory: parsed.data.faceCategory,
      faceSource: parsed.data.faceSource,
      faceSources: parsed.data.faceSources,
      playbackSpeed: parsed.data.playbackSpeed,
      quality: parsed.data.quality,
      aspectRatio: parsed.data.aspectRatio,
      facePosition: parsed.data.facePosition,
      faceScale: parsed.data.faceScale,
      durationMinutes: parsed.data.durationMinutes,
      autoRestart: parsed.data.autoRestart,
      voiceAudio: parsed.data.voiceAudio,
      liveAnimationSource: parsed.data.liveAnimationSource,
      liveAnimationX: parsed.data.liveAnimationX,
      liveAnimationY: parsed.data.liveAnimationY,
      liveAnimationScale: parsed.data.liveAnimationScale,
      composition: parsed.data.composition,
    }));
    let result: ReturnType<typeof start>;
    if (isAlreadyCounted) {
      result = start();
    } else {
      const reservation = await startAccountStreamWithQuota(identity.userId, start);
      if (!reservation.ok) {
        res.status(reservation.status).json({ error: reservation.error });
        return;
      }
      result = reservation.result;
    }
    accountStreamOwners.set(parsed.data.streamId, identity.userId);
    res.status(202).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start stream.";
    const status = message.includes("already streaming") ? 409 : 400;
    req.log.warn({ streamId: parsed.data.streamId, status }, "Stream start rejected");
    res.status(status).json({ error: message });
  }
});

router.post("/stream/stop", (req, res): void => {
  const parsed = StopStreamBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid stream stop request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = stopStream(parsed.data.streamId);
  if (!result) {
    res.status(404).json({ error: "This channel is not currently streaming." });
    return;
  }
  res.json(StopStreamResponse.parse(result));
});

router.post("/stream/update", (req, res): void => {
  const parsed = StartStreamBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid stream update request");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const result = updateStream({
      streamId: parsed.data.streamId,
      ingestUrl: parsed.data.ingestUrl,
      category: parsed.data.category,
      videoSource: parsed.data.videoSource,
      videoSources: parsed.data.videoSources,
      faceCategory: parsed.data.faceCategory,
      faceSource: parsed.data.faceSource,
      faceSources: parsed.data.faceSources,
      playbackSpeed: parsed.data.playbackSpeed,
      quality: parsed.data.quality,
      aspectRatio: parsed.data.aspectRatio,
      facePosition: parsed.data.facePosition,
      faceScale: parsed.data.faceScale,
      durationMinutes: parsed.data.durationMinutes,
      autoRestart: parsed.data.autoRestart,
      voiceAudio: parsed.data.voiceAudio,
      liveAnimationSource: parsed.data.liveAnimationSource,
      liveAnimationX: parsed.data.liveAnimationX,
      liveAnimationY: parsed.data.liveAnimationY,
      liveAnimationScale: parsed.data.liveAnimationScale,
      composition: parsed.data.composition,
    });
    res.status(202).json(StartStreamResponse.parse(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update stream playlist.";
    const status = message.includes("not currently streaming") ? 404 : 400;
    req.log.warn({ streamId: parsed.data.streamId, status }, "Stream update rejected");
    res.status(status).json({ error: message });
  }
});

router.post("/stream/voice/:streamId", (req, res): void => {
  const streamId = typeof req.params.streamId === "string" ? req.params.streamId : "";
  if (!streamId) {
    res.status(400).json({ error: "A stream id is required." });
    return;
  }
  let finished = false;
  const finish = (status: number) => {
    if (finished || res.headersSent || res.writableEnded) return;
    finished = true;
    res.status(status).end();
  };
  // A browser MediaStream upload can end abruptly when the user toggles the
  // microphone or navigates away. Consume socket errors so that a normal
  // client disconnect cannot crash the API process.
  req.socket?.on("error", () => undefined);
  req.on("data", (chunk: Buffer) => appendVoiceAudio(streamId, chunk));
  req.on("end", () => finish(204));
  req.on("aborted", () => finish(499));
  req.on("close", () => {
    if (!req.complete) finish(499);
  });
  req.on("error", () => finish(499));
});

router.post("/stream/webcam/:streamId", (req, res): void => {
  const streamId = typeof req.params.streamId === "string" ? req.params.streamId : "";
  if (!streamId) {
    res.status(400).json({ error: "A stream id is required." });
    return;
  }
  const allowedPositions = new Set(["top-left", "top-right", "bottom-left", "bottom-right", "center"]);
  const requestedPosition = typeof req.query.position === "string" ? req.query.position : "bottom-right";
  const position = allowedPositions.has(requestedPosition)
    ? requestedPosition as "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    : "bottom-right";
  const parsedScale = Number(req.query.scale);
  const scale = Number.isFinite(parsedScale) ? Math.min(0.8, Math.max(0.1, parsedScale)) : 0.25;
  const webcamInput = new PassThrough();
  let detached = false;
  const detach = () => {
    if (detached) return;
    detached = true;
    req.unpipe(webcamInput);
    detachLiveWebcam(streamId, webcamInput);
    if (!res.headersSent && !res.writableEnded && !req.destroyed) res.status(204).end();
  };
  webcamInput.on("error", () => undefined);
  req.socket?.on("error", detach);
  req.on("aborted", detach);
  req.on("close", () => {
    if (!req.complete) detach();
  });
  req.on("error", detach);
  req.on("end", detach);
  try {
    attachLiveWebcam(streamId, webcamInput, { position, scale });
    req.pipe(webcamInput);
  } catch (error) {
    webcamInput.destroy();
    res.status(409).json({ error: error instanceof Error ? error.message : "The live webcam could not be attached." });
  }
});

router.get("/stream/status/:streamId", (req, res): void => {
  const parsed = GetStreamStatusParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(GetStreamStatusResponse.parse(getStreamStatus(parsed.data.streamId)));
});

router.get("/stream/preview/:streamId/:filename", (req, res): void => {
  const streamId = typeof req.params.streamId === "string" ? req.params.streamId : "";
  const filename = typeof req.params.filename === "string" ? req.params.filename : "";
  const filePath = getStreamPreviewFile(streamId, filename);
  if (!filePath) {
    res.status(404).end();
    return;
  }
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.sendFile(filePath);
});

export default router;