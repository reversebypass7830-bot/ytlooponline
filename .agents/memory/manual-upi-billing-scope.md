---
name: Manual UPI billing scope
description: Product boundary and approval rule for the manual UPI purchase flow.
---

Manual UPI billing belongs to the Live Control Room, not Arroxy. A customer submits a UTR to create a pending request; submission alone must never activate access. Only explicit owner approval can apply the purchased access.

**Why:** The user scoped this billing flow to the Live Control Room and required owner review before access changes.

**How to apply:** Keep future billing changes within the Live Control Room and preserve the pending-until-approved rule across API, UI, and tests.