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