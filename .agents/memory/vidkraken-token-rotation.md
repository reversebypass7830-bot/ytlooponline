---
name: VidKraken token rotation
description: Owner-managed VidKraken API token pools, quota cooldowns, and environment-file behavior.
---

VidKraken token pools should select available tokens round-robin, mark a token unavailable for three hours after a quota/rate-limit response, and persist cooldown timestamps so a server restart does not reset the window.

**Why:** A single provider token can be rate-limited while other configured tokens remain usable; reusing the limited token immediately causes otherwise valid downloads to fail.

**How to apply:** Keep token values server-side, expose only token keys and status to the owner UI, and when an environment file is present treat it as the source of truth so deleted entries are not resurrected from startup environment variables.