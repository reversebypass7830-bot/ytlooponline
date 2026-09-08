---
name: YouTube downloader clients
description: Compatibility behavior for YouTube downloads in the local media downloader
---

YouTube downloads use the official cloned yt-dlp runtime; the server merges MP4 output into the local license/folder media directory.

**Why:** The app should not depend on a paid provider or a desktop-only downloader for its primary server flow; yt-dlp is the directly runnable upstream downloader.

**How to apply:** Prefer the checked-out yt-dlp Python source, pass the requested quality and optional private cookie file, retry with `youtube:player_client=default,-web,-web_safari` when YouTube blocks the default client, and keep all output local. Tyrrrz/YoutubeDownloader is a .NET desktop app and should remain a reference unless a dedicated .NET service is intentionally introduced.