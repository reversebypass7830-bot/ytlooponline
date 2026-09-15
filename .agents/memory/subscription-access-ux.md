---
name: Subscription access UX
description: Durable product decisions for subscription navigation, visual treatment, and inactive-account access.
---

Subscription management belongs in the existing dark Live Control Room visual language. Pricing and current-access surfaces should use high-contrast light text on dark forest/green surfaces, with clear distinctions between trial, standard, and premium states. Transaction history should support search, purchase/grant filtering, date filtering, visible references, and local invoice downloads.

Inactive or expired accounts must not be forced into the subscription page. Users should retain access to Dashboard, Profile, and workspace routes, while subscription pages continue to explain current access and offer plan renewal or upgrade.

**Why:** Subscription is an account-management feature, not an access gate. Forcing expired users away from the workspace creates a dead end, and low-contrast pricing cards make plan selection difficult.

**How to apply:** Preserve the existing account, license, workspace, and subscription APIs when extending this area. Renew the existing license/workspace rather than creating duplicate keys, workspaces, or folders. Keep payment-provider integration separate from local subscription history until explicitly enabled.