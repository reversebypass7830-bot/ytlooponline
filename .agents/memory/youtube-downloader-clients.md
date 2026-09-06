---
name: YouTube downloader clients
description: Compatibility behavior for YouTube downloads in the local media downloader
---

Some publicly watchable YouTube videos can be rejected by yt-dlp's default player client with an “not available on this app” error, while the Android player client still exposes downloadable formats.

**Why:** YouTube client availability and playback responses vary by video; relying only on the default client made an otherwise valid video fail.

**How to apply:** Keep the downloader's Android player-client extractor fallback enabled, and treat private, age-restricted, region-restricted, or newly blocked videos as expected failure cases.

Server-side YouTube bot challenges can reject every public player client for one video or IP; retries and alternate clients cannot guarantee a bypass without an authorized session or cookie. Downloader child-process promises must be explicitly handled so a failed extraction returns a request error instead of crashing the API workflow.