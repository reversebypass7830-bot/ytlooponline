---
name: Billing approval rules
description: Payment activation rules for Manual UPI and Cashfree purchases in the Live Control Room.
---

Billing belongs to the Live Control Room, not Arroxy. Manual UPI requests stay pending until explicit owner approval. Cashfree orders activate automatically only after server verification, but they must also appear in the owner queue; an owner may explicitly approve a pending Cashfree order and activate service before payment is verified.

**Why:** The user requires verified Cashfree payments to activate automatically while preserving owner review and an explicit manual override for gateway orders.

**How to apply:** Keep billing changes in the Live Control Room, keep auto-verification for paid Cashfree orders, and preserve the owner-approval path and its unverified-payment warning. Do not double-apply access when Cashfree confirms after an owner approval.