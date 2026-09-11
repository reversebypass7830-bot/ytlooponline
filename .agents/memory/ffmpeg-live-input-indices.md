---
name: FFmpeg live input indices
description: Dynamic renderer pipes must account for every preceding FFmpeg input before mapping webcam and microphone streams.
---

When a live renderer conditionally adds silence, webcam, or microphone inputs, calculate each pipe index from the complete input order: main media, optional layers, silence, webcam, then microphone. Do not derive pipe indices only from optional inputs.

**Why:** An off-by-one mapping can make FFmpeg read the main video as the webcam or the webcam as PCM audio. The renderer then produces no output and a protected handoff rolls back even though the publisher is healthy.

**How to apply:** Keep index calculation next to the input-argument construction, and exercise both base-media-with-audio and base-media-without-audio paths whenever live camera or voice inputs change.