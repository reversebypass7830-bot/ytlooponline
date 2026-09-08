---
name: YouTube downloader clients
description: Compatibility behavior for YouTube downloads in the local media downloader
---

YouTube downloads use the Arroxy-managed yt-dlp runtime; the server merges MP4 output into the local license/folder media directory.

**Why:** The app should not depend on a paid provider for its primary downloader, while Arroxy already owns the yt-dlp runtime strategy and YouTube client fallback.

**How to apply:** Resolve the Arroxy-managed yt-dlp binary, pass the requested quality and optional private cookie file, retry with `youtube:player_client=default,-web,-web_safari` when YouTube blocks the default client, and keep all output local.