---
name: Firebase Vite configuration
description: Environment handling for Firebase web configuration in this workspace's Vite workflow.
---

The workflow exposes the existing Firebase project values as regular FIREBASE_* environment variables, while browser code needs VITE_FIREBASE_* values. Vite must explicitly define the public Firebase fields with a fallback from FIREBASE_*.

**Why:** Adding only VITE-prefixed variables did not reach the running artifact workflow reliably; the browser module loaded with an empty config until the Vite define fallback was added.

**How to apply:** Keep Firebase web config values non-secret, prefer VITE_FIREBASE_* when present, and inject FIREBASE_* fallbacks through vite.config.ts. Never put server-only credentials in the client bundle.