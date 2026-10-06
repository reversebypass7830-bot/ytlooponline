# GitHub Repository Map

## Main repository

- **GitHub:** https://github.com/reversebypass7830-bot/ytlooponline
- **Branch:** `main`
- **Purpose:** Main workspace repository for the R Loop Bypass / Live Control Room project.

This is a monorepo: it contains the app, its API, shared libraries, website assets, and related tools.

### Main code areas

- `artifacts/live/` — Live Control Room web app for the media library, live channels, editor, and stream preview.
- `artifacts/api-server/` — API server for accounts, media, live-stream controls, and server-side processing.
- `lib/` — Shared database, API specification, generated schemas, and API client packages.
- `homepage/` — Project homepage source and assets.
- `Arroxy/` — Separate Electron desktop downloader project; related to media, but not part of the Live Control Room app.
- `artifacts/mockup-sandbox/` — Component preview and design workspace.
- `scripts/`, `docs/`, and `dev-docs/` — Project scripts and documentation.
- `loopstream.pro/`, `screenshots/`, and `attached_assets/` — Website snapshots, screenshots, and project assets.

## Other GitHub repository

- **Remote name:** `youtube-live`
- **GitHub:** https://github.com/instaboosterwesd/youtube-live
- **Branch:** `main`
- This is a separate repository with its own history and content. Its branch is not a synchronized copy of the main `ytlooponline` repository. Do not treat it as the current primary repo.

## Keeping credentials safe

Do not commit passwords, API keys, stream keys, or cookies. Keep secrets in Replit Secrets; local environment files should stay untracked.
