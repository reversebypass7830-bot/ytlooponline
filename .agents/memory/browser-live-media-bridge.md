---
name: Browser live media bridge
description: Constraint separating local browser camera/microphone preview from the server-side FFmpeg broadcast.
---

The Live Stream Preview sends browser camera as length-prefixed PNG frames and microphone audio as 48 kHz mono PCM to the selected server-side broadcast process. FFmpeg overlays the camera and mixes the voice while the publisher process stays alive; both inputs are delayed together by about 10 seconds.

**Why:** Browser permissions alone do not expose a server-readable media source. Separate camera and PCM upload pipes avoid a WebRTC stack while keeping camera, voice, and the main publisher coordinated; abrupt client disconnects must not crash Node.

**How to apply:** Only open media upload pipes for a running stream, detach them safely on browser errors or toggles, keep a transparent PNG fallback feeding the always-on FFmpeg camera input, preserve queues across renderer handoffs, and provide silence when the main video has no audio track.