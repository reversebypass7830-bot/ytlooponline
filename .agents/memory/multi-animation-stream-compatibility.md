---
name: Multi-animation stream compatibility
description: Compatibility semantics for animation overlays in saved and live stream compositions.
---

Treat a present `animationLayers` array as authoritative, including an empty array that explicitly means no animation overlays. Use the legacy single-animation source only when the array is absent.

**Why:** New editor compositions need an unambiguous way to clear stale overlay data, while existing saved compositions with one animation must keep working.

**How to apply:** When changing the stream composition contract or start/update routing, preserve the distinction between an absent array and an empty array, and cover both legacy and current formats.