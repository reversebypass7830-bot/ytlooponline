---
name: Static landing and SPA routes
description: The live artifact serves a static homepage separately from the React control-room app.
---

The live artifact's root `index.html` is a static marketing landing page, separate from the authenticated React control room. Deep-link refreshes must serve the React app entry instead of falling back to the marketing page.

**Why:** Direct navigation or refresh on routes such as `/dashboard` and `/live` can return the static homepage even though the React router contains those screens. That makes a still-valid session look like a logout.

**How to apply:** In development and production, route every React app path to the `sign-in.html` entry, with `/owner` using `owner.html`; include both entries in the production build. Keep `/` as the public landing page, but redirect a valid `/api/account` session from there to the dashboard or owner console.