---
name: Cloudflare preview fallback
description: The local live preview must remain available when an account-less Cloudflare quick tunnel fails or is unavailable.
---

The Cloudflare quick tunnel is an optional public-link helper, not a prerequisite for the local live control room.

**Why:** Cloudflare's account-less quick tunnel endpoint can fail transiently with network errors such as unexpected EOF even while the local Vite server starts normally.

**How to apply:** Keep tunnel startup and exit failures non-fatal; surface the unavailable-link state through the existing link file and continue serving the local preview. Treat a saved `trycloudflare.com` hostname as stale until DNS and HTTP are checked; restart the managed live workflow when the hostname no longer resolves. A healthy public tunnel can return `200` for `/` and `401` for `/api/account` without a browser session—the latter confirms API routing and means authentication is required, not that the tunnel is broken.