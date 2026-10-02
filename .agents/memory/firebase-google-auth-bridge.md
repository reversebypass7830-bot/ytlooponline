---
name: Firebase Google auth bridge
description: The authentication boundary between Firebase Google sign-in and the existing server account/workspace model.
---

Firebase Google sign-in should be handled in the browser, then exchanged once at the API boundary for a signed HttpOnly session cookie. The existing Firebase account and workspace records remain the source of account and trial state; mobile OTP continues using its separate session flow.

**Why:** The app already stores account, license, and workspace data in Firebase, while the previous visible Google flow was owned by Clerk. A server-side token exchange removes Clerk from the user-facing Google path without exposing Firebase tokens to every API request or rewriting workspace semantics.

**How to apply:** Validate the Firebase ID token with Firebase's Identity Toolkit lookup endpoint, map the Firebase UID (or matching verified email) to the existing account, then sign the resolved account ID into the session cookie. Keep the legacy Clerk middleware only where backward compatibility requires it.

When Clerk is not configured, its global middleware must be skipped rather than installed with an empty secret. Clerk-dependent helpers should also fail closed as unauthenticated so Firebase and mobile auth routes can operate independently.

**Why:** A missing optional Clerk secret previously converted every Firebase/mobile request into a server-side 500 before those routes ran.

**How to apply:** Gate the app-level Clerk middleware on `CLERK_SECRET_KEY`; keep mobile/Firebase session cookies as the active auth boundary when Clerk is unavailable.

The browser's initial Firebase auth callback may report no Firebase user while a valid server-side mobile session exists; that callback must not clear the server Firebase cookie or act as an explicit logout.

**Why:** Treating initial auth hydration as logout creates a login loop after refresh and can erase a valid server session before account state finishes loading.

**How to apply:** Clear server auth cookies only from an explicit sign-out action, ignore stale account requests when Firebase/mobile auth state changes, and keep the current route in a loading state until `/api/account` finishes—even when Firebase initially reports no user. Show the login gate only after the server confirms there is no session.