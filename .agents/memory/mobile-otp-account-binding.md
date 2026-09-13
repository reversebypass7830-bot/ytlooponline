---
name: Mobile OTP account binding
description: Security boundary for the external mobile OTP login flow
---

The external OTP provider is used only to verify possession of the phone number. Its returned provider token must not be stored or exposed to the browser; after successful verification, the app creates its own short-lived signed session only when Firebase already contains an account linked to the normalized phone number.

**Why:** The provider response contains a bearer token and provider identity fields, while this app owns account access and plan state. Binding locally prevents an OTP-verified number from silently creating an unlinked account.

**How to apply:** Keep provider calls server-side, normalize phone numbers consistently for lookup and uniqueness, and return a clear “OTP verified but number not linked” response that directs the user through the existing account-linking flow.

The client must not submit the same OTP challenge twice, and the server should make a just-completed verification idempotent for a short window: auto-submit on the final digit and the visible verify button can race, and a successful provider verification consumes the challenge so the second request appears expired.

**Why:** Users can enter the correct code and still see an expiry error when the duplicate request arrives after the first request has already deleted the challenge.

**How to apply:** Guard client verify triggers with an in-flight ref and cache a successful request result briefly so a duplicate returns the same login or profile result instead of an expiry error.

After mobile OTP creates a server session, refresh the client account state before navigating because cookie-based mobile auth does not change Firebase's client auth state.

**Why:** Navigating immediately can render the login gate again when the account session hook still has its pre-login null value.

**How to apply:** Reload the account/session query after a successful linked-account OTP response, then navigate to the workspace.