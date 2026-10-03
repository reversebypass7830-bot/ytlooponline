---
name: Feedback image hosting
description: The project's required image host and serving behavior for feedback-gallery screenshots.
---

Feedback-gallery screenshots must be hosted on ImgBB and loaded from ImgBB URLs. Use ImgBB's original `data.url`, not `display_url` or `medium.url`, which can be thumbnail-sized. Warm original URLs in the browser cache when a gallery is selected instead of lowering image quality to speed up navigation. Keep the ImgBB API key server-side.

**Why:** The user explicitly asked to upload all current feedback screenshots to ImgBB and have the gallery load them from there, with no loss of clarity. `display_url` and `medium.url` were experimentally confirmed to return a 295×639 derivative for a 1080×2340 original. Original URLs provide long-lived browser caching, so preloading preserves quality while making image switches fast.

**How to apply:** Use the original URL for new feedback screenshots and re-upload existing images from their original source if a derivative was stored. Preload only the active feedback entry's originals, with bounded concurrency, so other entries are not downloaded unnecessarily. Keep existing gallery image URLs migrated when changing feedback storage or gallery loading. Channel avatars are separate from gallery screenshots.