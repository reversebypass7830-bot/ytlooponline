---
name: Async download job recovery
description: Recovery behavior for browser polling when an asynchronous download job is lost during an API restart.
---

Asynchronous download job IDs are process-local, so a browser can retain an old ID after the API restarts. The client should detect a missing job and requeue the same download once rather than surfacing a raw not-found error.

**Why:** The media file can still be downloaded correctly, but the in-memory job record is gone after a server restart or reload.

**How to apply:** Keep the retry bounded to one requeue per download attempt to avoid duplicate downloads or infinite polling loops.