---
name: YouTube proxy download
description: The API downloader uses the workspace proxy list and must handle artifact working directories and cross-device media moves.
---

The YouTube downloader should load the root-level proxy list even when the API workflow runs from its artifact directory, rotate through valid HTTP/SOCKS entries, and copy media when a temporary download and media directory are on different filesystems.

**Why:** The managed API workflow runs with an artifact-scoped working directory, while downloads use `/tmp`; assuming either path or same-filesystem rename makes otherwise valid downloads fail.

**How to apply:** Keep proxy selection and retry behavior in the server downloader, and make final media placement resilient to `EXDEV` by falling back from rename to copy-and-cleanup.