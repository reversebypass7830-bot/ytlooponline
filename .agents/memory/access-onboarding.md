---
name: Access onboarding architecture
description: Durable decisions for mobile and Google account onboarding in the access gate.
---

Unlinked mobile numbers and newly created Google accounts complete onboarding through the existing API account system rather than a second client-side identity flow. Mobile OTP verification returns only a short-lived onboarding token; the server uses it to validate the profile submission, create the account, trial license, workspace, and session, then returns the generated license key for the UI reveal.

**Why:** Keeping provider verification and account creation on the server prevents provider tokens from reaching the browser and keeps Firebase workspace records, licenses, and sessions consistent.

**How to apply:** Preserve the distinction between authentication and profile completion. Existing linked mobile accounts should enter directly, while incomplete new accounts should remain in the access/profile UI until the generated license is revealed and the user opens the workspace.

After mobile profile completion creates the server session, reload the account session before opening the workspace route.

**Why:** The new cookie can be valid while the client account state is still empty; routing immediately then falls through to the login gate again.

**How to apply:** Complete the profile request, refresh `/api/account`, then allow the “open room” action to navigate to the dashboard.

Authentication and entitlement are separate states: an OTP-authenticated account without active access should remain signed in and be routed to pricing, never back to the login gate.

**Why:** Routing inactive accounts through the login gate makes a valid OTP session look like a failed login and causes a repeat-login loop.

**How to apply:** Let the server session authorize `/api/account` and pricing; enforce active access only when entering workspace routes.