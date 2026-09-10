---
name: Browser live media bridge
description: Constraint separating local browser camera/microphone preview from the server-side FFmpeg broadcast.
---

The Live Stream Preview can show browser camera and microphone permissions locally, but those MediaStream tracks are not part of the server FFmpeg broadcast without a dedicated real-time media bridge.

**Why:** The current broadcast process reads server-side files and sends them to the ingest destination; browser permissions do not expose a server-readable media source.

**How to apply:** Keep preview copy explicit about local-only device controls until a WebRTC, WHIP, or equivalent ingest path is implemented end to end.