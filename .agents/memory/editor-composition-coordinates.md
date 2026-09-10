---
name: Editor composition coordinates
description: Coordinate convention for interactive video editor layers
---

The editor stores layer translation as percentages relative to the composition canvas and scale as a normalized multiplier. The browser preview and FFmpeg renderer must consume the same values.

**Why:** Pixel coordinates drift across desktop, mobile, aspect-ratio changes, and fullscreen preview; a shared normalized contract keeps manual edits reproducible in the saved MP4.

**How to apply:** Keep layer bounds normalized at the API boundary, clamp them server-side, and add new editor interactions to both the canvas preview and the compose filter.