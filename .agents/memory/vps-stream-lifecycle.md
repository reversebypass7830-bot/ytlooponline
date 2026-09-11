---
name: VPS stream lifecycle
description: The boundary between browser-independent stream execution and API process restart recovery.
---

The active publisher and renderer are independent of the browser HTTP request, so closing the control-room tab must not stop a live stream. The current runner registry is in memory and includes the destination input, so PM2 can restart the API but cannot safely recreate an active stream after an API process restart.

**Why:** Reconstructing a stream from an unencrypted file would persist destination keys in plaintext and could accidentally start an old destination after a deploy.

**How to apply:** Treat browser disconnect continuity and process-restart recovery as separate features. Add durable, access-controlled session metadata plus server-side credential lookup before promising automatic live-stream recovery after API restarts.

Renderer updates must attach the replacement FFmpeg output to the persistent publisher bridge before detaching and terminating the previous renderer; renderer exits must never end publisher stdin.

**Why:** Replacing the renderer is safe only when the destination connection remains owned by the publisher and stale renderer events cannot mark the new stream failed.

**How to apply:** Preserve the publisher `PassThrough` across composition, playlist, webcam, and animation updates, and detach old renderer outputs before cleanup.

Live webcam and microphone renderer inputs must be primed before the browser's first packet, and the old renderer should remain active until the replacement emits MPEG-TS.

**Why:** Browser media uploads can arrive after FFmpeg initialization; without priming or a first-output gate, the publisher can starve during a camera/microphone update.

**How to apply:** Use transparent PNG and silent PCM fallback data, keep pipe errors handled, and roll back a replacement that produces no output.

Rapid control-room updates should coalesce behind an active renderer handoff instead of returning a client-visible conflict; only the latest pending composition needs to run.

**Why:** Composition, playlist, and camera state can change several times while a 4K FFmpeg renderer warms up, and rejecting those normal edits surfaces misleading HTTP 400 errors.

**How to apply:** Keep the publisher protected, retain one pending latest update, and apply it after the current renderer emits its first output or rolls back.