---
name: YouTube downloader clients
description: Compatibility behavior for YouTube downloads in the local media downloader
---

Some publicly watchable YouTube videos can be rejected by yt-dlp's default player client with an “not available on this app” error, while the Android player client still exposes downloadable formats.

**Why:** YouTube client availability and playback responses vary by video; relying only on the default client made an otherwise valid video fail.

**How to apply:** Keep the downloader's Android player-client extractor fallback enabled, and treat private, age-restricted, region-restricted, or newly blocked videos as expected failure cases.

Server-side YouTube bot challenges can reject every public player client for one video or IP; retries and alternate clients cannot guarantee a bypass without an authorized session or cookie. When a cookie secret is used, accept both Netscape cookies.txt and common browser-export JSON by converting JSON to Netscape format in a private temporary file. Downloader child-process promises must be explicitly handled so a failed extraction returns a request error instead of crashing the API workflow.

The server should keep the maintained yt-dlp executable as a second downloader attempt before the browser-style YTSave fallback; the older .NET bridge alone is not enough for changing YouTube playback responses.

**Why:** A public video can work with one extractor and fail with another without any change to the URL.

**How to apply:** Try the local bridge, then yt-dlp with ffmpeg and optional cookies, then YTSave; preserve the final user-facing error and never expose temporary tokens or signed URLs.