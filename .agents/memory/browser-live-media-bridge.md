---
name: Browser live media bridge
description: Constraint separating local browser camera/microphone preview from the server-side FFmpeg broadcast.
---

The Live Stream Preview can show browser camera locally, while microphone audio is captured as 48 kHz mono PCM and streamed to the selected server-side broadcast process. The server keeps a PCM input ready and mixes it into the outgoing live audio.

**Why:** Browser permissions alone do not expose a server-readable media source; a small PCM upload bridge is enough for voice-over without adding a WebRTC stack, and the browser camera still remains local-only.

**How to apply:** Keep camera copy explicit about being local-only, send microphone frames only for the selected stream ID, and retain the publisher process while renderer or voice input settings change.