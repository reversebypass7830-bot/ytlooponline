---
name: YTSave fallback flow
description: The public YTSave fallback needs a minted browser challenge token and quality selection before polling its signed file URL.
---

Use YTSave only as a fallback when yt-dlp is blocked by a YouTube bot challenge. Its current flow is: load the downloader page, HMAC the public `data-ch` challenge, mint a short-lived `dt`, submit the YouTube URL, poll the selected media URL, then stream the signed file URL to local storage.

**Why:** Direct server-side yt-dlp requests can be rejected even for a watchable public video, while the browser-style YTSave flow can prepare the same media.

**How to apply:** Preserve the short-lived token/cookie flow, never expose signed URLs or tokens to users, and choose the highest returned quality within the app's file-size limit before polling.