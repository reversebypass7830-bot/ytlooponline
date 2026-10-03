---
name: Feedback image hosting
description: The project's required image host and serving behavior for feedback-gallery screenshots.
---

Feedback-gallery screenshots must be hosted on ImgBB and loaded from ImgBB URLs. Keep the ImgBB API key server-side.

**Why:** The user explicitly asked to upload all current feedback screenshots to ImgBB and have the gallery load them from there.

**How to apply:** Use ImgBB for new feedback screenshots and keep existing gallery image URLs migrated when changing feedback storage or gallery loading. Channel avatars are separate from gallery screenshots.