---
name: Access onboarding architecture
description: Durable decisions for mobile and Google account onboarding in the access gate.
---

Unlinked mobile numbers and newly created Google accounts complete onboarding through the existing API account system rather than a second client-side identity flow. Mobile OTP verification returns only a short-lived onboarding token; the server uses it to validate the profile submission, create the account, trial license, workspace, and session, then returns the generated license key for the UI reveal.

**Why:** Keeping provider verification and account creation on the server prevents provider tokens from reaching the browser and keeps Firebase workspace records, licenses, and sessions consistent.

**How to apply:** Preserve the distinction between authentication and profile completion. Existing linked mobile accounts should enter directly, while incomplete new accounts should remain in the access/profile UI until the generated license is revealed and the user opens the workspace.