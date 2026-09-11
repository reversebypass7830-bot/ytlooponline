type WorkerStartMessage = {
  type: "start";
  track: MediaStreamTrack;
  uploadUrl: string;
  maxWidth?: number;
  frameIntervalMs?: number;
  jpegQuality?: number;
};

type WorkerStopMessage = { type: "stop" };

type WorkerFrame = {
  codedWidth?: number;
  codedHeight?: number;
  displayWidth?: number;
  displayHeight?: number;
  close: () => void;
};

type WorkerTrackProcessor = {
  readable: ReadableStream<WorkerFrame>;
};

type WorkerTrackProcessorConstructor = new (options: { track: MediaStreamTrack }) => WorkerTrackProcessor;

type WorkerScope = {
  onmessage: ((event: MessageEvent<WorkerStartMessage | WorkerStopMessage>) => void) | null;
  postMessage: (message: unknown) => void;
  MediaStreamTrackProcessor?: WorkerTrackProcessorConstructor;
};

const workerScope = self as unknown as WorkerScope;
let activeAbortController: AbortController | null = null;
let activeTrack: MediaStreamTrack | null = null;
let stopRequested = false;

function post(message: unknown): void {
  workerScope.postMessage(message);
}

async function runCapture(message: WorkerStartMessage): Promise<void> {
  const Processor = workerScope.MediaStreamTrackProcessor;
  if (!Processor || typeof OffscreenCanvas === "undefined") {
    throw new Error("This browser cannot process webcam frames off the main thread.");
  }

  const abortController = new AbortController();
  activeAbortController = abortController;
  activeTrack = message.track;
  stopRequested = false;

  const uploadState: {
    controller: ReadableStreamDefaultController<Uint8Array> | null;
    closed: boolean;
  } = { controller: null, closed: false };
  const uploadBody = new ReadableStream<Uint8Array>({
    start(controller) {
      uploadState.controller = controller;
    },
    cancel() {
      uploadState.closed = true;
    },
  }, { highWaterMark: 1, size: () => 1 });

  const upload = fetch(message.uploadUrl, {
    method: "POST",
    headers: { "content-type": "application/x-live-webcam-frames" },
    body: uploadBody,
    signal: abortController.signal,
    duplex: "half",
  } as RequestInit & { duplex: "half" }).catch((error: unknown) => {
    if (!abortController.signal.aborted) {
      post({ type: "error", message: error instanceof Error ? error.message : "Webcam upload failed." });
      stopRequested = true;
      abortController.abort();
    }
  });

  const processor = new Processor({ track: message.track });
  const reader = processor.readable.getReader();
  const maxWidth = Math.max(240, Math.min(640, message.maxWidth ?? 512));
  const frameIntervalMs = Math.max(80, message.frameIntervalMs ?? 100);
  const jpegQuality = Math.max(0.45, Math.min(0.9, message.jpegQuality ?? 0.72));
  let canvas: OffscreenCanvas | null = null;
  let context: OffscreenCanvasRenderingContext2D | null = null;
  let lastEncodedAt = 0;

  try {
    post({ type: "ready" });
    while (!stopRequested && !abortController.signal.aborted) {
      const result = await reader.read();
      if (result.done || !result.value) break;

      const frame = result.value;
      try {
        const now = performance.now();
        const controller = uploadState.controller;
        if (
          now - lastEncodedAt < frameIntervalMs
          || uploadState.closed
          || !controller
          || controller.desiredSize === null
          || controller.desiredSize <= 0
        ) {
          continue;
        }

        const sourceWidth = frame.displayWidth || frame.codedWidth || 640;
        const sourceHeight = frame.displayHeight || frame.codedHeight || 480;
        const width = Math.min(sourceWidth, maxWidth);
        const height = Math.max(1, Math.round(sourceHeight * (width / sourceWidth)));
        if (!canvas || canvas.width !== width || canvas.height !== height) {
          canvas = new OffscreenCanvas(width, height);
          context = canvas.getContext("2d", { alpha: false });
        }
        if (!context) continue;

        context.drawImage(frame as unknown as CanvasImageSource, 0, 0, width, height);
        const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: jpegQuality });
        const nextController = uploadState.controller;
        if (uploadState.closed || !nextController || nextController.desiredSize === null || nextController.desiredSize <= 0) {
          continue;
        }

        const bytes = new Uint8Array(await blob.arrayBuffer());
        const packet = new Uint8Array(4 + bytes.length);
        new DataView(packet.buffer).setUint32(0, bytes.length);
        packet.set(bytes, 4);
        try {
          nextController.enqueue(packet);
          lastEncodedAt = now;
        } catch {
          uploadState.closed = true;
          uploadState.controller = null;
        }
      } finally {
        frame.close();
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // The track may already be closed by the browser.
    }
    reader.releaseLock();
    uploadState.closed = true;
    const controller = uploadState.controller;
    uploadState.controller = null;
    try {
      controller?.close();
    } catch {
      // The fetch body may already be closed.
    }
    activeTrack?.stop();
    activeTrack = null;
    if (activeAbortController === abortController) activeAbortController = null;
    await upload;
  }
}

function stopCapture(): void {
  stopRequested = true;
  activeAbortController?.abort();
  activeTrack?.stop();
}

workerScope.onmessage = (event) => {
  if (event.data.type === "stop") {
    stopCapture();
    return;
  }
  stopCapture();
  void runCapture(event.data).catch((error: unknown) => {
    post({ type: "error", message: error instanceof Error ? error.message : "Webcam worker stopped unexpectedly." });
  });
};