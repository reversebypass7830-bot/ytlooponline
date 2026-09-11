---
name: Live preview handoff
description: Keep the encoded HLS preview continuous while replacing a live FFmpeg renderer.
---

During a live renderer handoff, keep the preview playlist directory and URL
stable while the new renderer warms up. Replacing the HLS directory creates a
temporary 404 that looks like the broadcast stopped even when the publisher
and ingest connection are still healthy.

**Why:** The publisher is intentionally kept alive across composition updates,
so the UI must not interpret a short preview-file gap as a stream outage.

**How to apply:** Preserve existing HLS files for renderer handoffs, let the
new preview process overwrite the same playlist, and make the browser player
recover from transient HLS network/media errors.