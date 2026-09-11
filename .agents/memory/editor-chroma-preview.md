---
name: Editor chroma preview
description: The editor’s green-screen preview must use browser canvas processing while the saved composition uses FFmpeg chromakey.
---

The editor keeps green-screen behavior consistent by processing only the selected face-cam or animation overlay in a transparent browser canvas for preview, while sending the same target, key color, similarity, and blend values to the server-side FFmpeg composition.

**Why:** CSS alone cannot turn matching pixels transparent, and the main video must remain visible beneath the keyed overlay before and after rendering.

**How to apply:** Keep the keyed canvas limited to the active overlay layer, preserve the layer wrapper’s transform and pointer target, and keep FFmpeg as the source of truth for exported MP4 output.