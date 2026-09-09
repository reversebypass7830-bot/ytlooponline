---
name: YouTube proxy download
description: The API downloader uses the workspace proxy list and must handle artifact working directories and cross-device media moves.
---

The YouTube downloader should load the root-level proxy list even when the API workflow runs from its artifact directory, rotate through valid HTTP/SOCKS entries, and copy media when a temporary download and media directory are on different filesystems.

**Why:** The managed API workflow runs with an artifact-scoped working directory, while downloads use `/tmp`; assuming either path or same-filesystem rename makes otherwise valid downloads fail.

**How to apply:** Keep proxy selection and retry behavior in the server downloader, and make final media placement resilient to `EXDEV` by falling back from rename to copy-and-cleanup.

Long-running downloads must be exposed to the browser as an asynchronous job with short status polling requests, rather than holding one HTTP request open until yt-dlp finishes.

**Why:** The Replit preview proxy can terminate long requests around two minutes with a 502 even while the server-side download is still progressing.

**How to apply:** Return a job ID immediately, keep the yt-dlp work server-side, and let the UI poll for completed or failed status.