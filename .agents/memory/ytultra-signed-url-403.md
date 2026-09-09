---
name: YT Ultra signed URL access
description: YT Ultra can resolve metadata while its returned Googlevideo URLs are rejected from the server egress.
---

The YT Ultra download endpoint may return valid-looking, IP-bound Googlevideo URLs that consistently respond with HTTP 403 when fetched from the app server. This can affect every quality, including audio, even when the metadata request succeeds.

**Why:** A successful metadata response does not prove that the app's server egress is authorized to stream the returned media URL; retrying headers, redirects, cookies, or FFmpeg does not repair an upstream signed-URL mismatch.

**How to apply:** Treat this as an upstream/provider access failure, surface a specific error, and verify the exact returned media URL before claiming a download works. Do not silently reintroduce yt-dlp as a fallback when the product requirement is YT Ultra-only.