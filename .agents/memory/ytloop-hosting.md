---
name: ytloop.online hosting
description: The Live Control Room's chosen custom hostname and its Replit/Cloudflare Tunnel availability constraints.
---

The Live Control Room is exposed at `https://ytloop.online` through a named Cloudflare Tunnel started by the Live workflow. The API is a separate workflow and must also be running for account and streaming controls to work. The user deliberately chose the root hostname and the tunnel DNS route; do not change the hostname, restore old DNS records, or alter the tunnel route without approval.

The tunnel token belongs in Replit Secrets only. Never print or copy its value into files, logs, or chat.

This is a tunnel attached to a development workflow, not an always-on production deployment. If that workflow stops or is suspended, the hostname no longer reaches the app. A production hosting or DNS change requires confirming the hosting plan and any additional usage charges first. Continuous FFmpeg streaming also needs an always-on server, and in-memory stream state may not recover automatically after a process restart.

**Why:** The selected hostname and DNS setup are intentional, while the current tunnel has a real availability limit that could be mistaken for a production hosting guarantee.

**How to apply:** Before modifying hosting or DNS, check the current configuration because these notes may become stale. Preserve the user's hostname and routing choice unless they approve a change; distinguish development-tunnel availability from production uptime, and never expose the tunnel credential.