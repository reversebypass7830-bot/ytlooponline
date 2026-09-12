---
name: Firebase Google auth bridge
description: The authentication boundary between Firebase Google sign-in and the existing server account/workspace model.
---

Firebase Google sign-in should be handled in the browser, then exchanged once at the API boundary for a signed HttpOnly session cookie. The existing Firebase account and workspace records remain the source of account and trial state; mobile OTP continues using its separate session flow.

**Why:** The app already stores account, license, and workspace data in Firebase, while the previous visible Google flow was owned by Clerk. A server-side token exchange removes Clerk from the user-facing Google path without exposing Firebase tokens to every API request or rewriting workspace semantics.

**How to apply:** Validate the Firebase ID token with Firebase's Identity Toolkit lookup endpoint, map the Firebase UID (or matching verified email) to the existing account, then sign the resolved account ID into the session cookie. Keep the legacy Clerk middleware only where backward compatibility requires it.