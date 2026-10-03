---
name: Feedback image hosting
description: The project's required image host and serving behavior for feedback-gallery screenshots.
---

Feedback-gallery screenshots must be hosted on ImgBB and loaded from ImgBB URLs. Use ImgBB's original `data.url`, not `display_url` or `medium.url`, which can be thumbnail-sized. Keep the ImgBB API key server-side.

**Why:** The user explicitly asked to upload all current feedback screenshots to ImgBB and have the gallery load them from there. `display_url` and `medium.url` were experimentally confirmed to return a 295×639 derivative for a 1080×2340 original.

**How to apply:** Use the original URL for new feedback screenshots and re-upload existing images from their original source if a derivative was stored. Keep existing gallery image URLs migrated when changing feedback storage or gallery loading. Channel avatars are separate from gallery screenshots.