---
name: YouTube downloader clients
description: Compatibility behavior for YouTube downloads in the local media downloader
---

YouTube downloads use the connected Apify YouTube Video Downloader Actor; the server copies its temporary storage result into the local license/folder media directory.

**Why:** YouTube playback clients were inconsistent across videos and the local bridge, yt-dlp, and YTSave could all be blocked for the same URL.

**How to apply:** Call Apify through the Replit connector, request MP4 with the selected quality, require an Apify-hosted result URL, copy it locally immediately, and never expose provider credentials or signed URLs.