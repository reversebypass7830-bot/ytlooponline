---
name: Static landing and SPA routes
description: The live artifact serves a static homepage separately from the React control-room app.
---

The live artifact's root `index.html` is a static marketing landing page. React routes such as the owner console must have an explicit HTML entry point that mounts `src/main.tsx`; otherwise a direct route request can fall back to the marketing page instead of the intended React screen.

**Why:** Direct navigation to `/owner` was returning the static homepage even though the React router contained an owner-login component.

**How to apply:** When adding a standalone direct URL under the live artifact, add or update its HTML entry and ensure the React app recognizes both the canonical route and the entry filename if the dev server exposes both forms.