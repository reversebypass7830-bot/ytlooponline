---
name: Cashfree owner credentials
description: Security boundary and key-rotation consequences for Cashfree API secrets entered in payment settings.
---

Cashfree App ID/Secret pairs entered in the owner panel are encrypted with AES-256-GCM before they are written to Firebase. The encryption key is derived from `SESSION_SECRET`; each environment has its own record. Never return decrypted credentials to the browser or write them to logs. Owner-panel values take precedence over matching `CASHFREE_*` environment values, which remain a fallback when no owner-managed pair exists.

**Why:** Firebase Realtime Database rules in this project may allow broad read access, so raw payment-provider credentials must not be stored there.

**How to apply:** Keep `SESSION_SECRET` stable across deployments. Rotating it makes existing encrypted Cashfree records unreadable; replace affected App ID/Secret pairs in the owner panel rather than silently falling back to another credential source.