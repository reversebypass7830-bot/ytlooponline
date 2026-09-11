---
name: Live playlist refresh
description: How ordered video changes are applied to an active broadcast
---

An active playlist is a finite ordered source list looped by FFmpeg. A channel may store a smaller ordered selection from its folder; that selection is the source list, while an unset selection means all valid folder videos. Updating that list restarts only the renderer behind a persistent publisher so the ingest connection stays live; deleting the last source stops the stream instead of silently falling back to a bundled video.

**Why:** FFmpeg's concat input does not reliably discover arbitrary file-list edits mid-process, while replacing the publisher causes an avoidable live outage and an empty category must never resurrect an old or default source.

**How to apply:** Keep the ordered category IDs as the source of truth, scope stream IDs per licensed browser workspace, and restart only the renderer; keep the ingest publisher and its output pipe alive across playlist, overlay, and composition updates.