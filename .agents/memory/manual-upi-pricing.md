---
name: Manual UPI pricing assumption
description: The currently implemented formula for quoting custom duration, stream count, and daily download quotas.
---

Treat proportional custom-download pricing as an implementation assumption, not confirmed business policy. The current quote takes the owner-set daily price per stream, multiplies by duration days and selected streams, scales by selected downloads per day divided by the plan's included downloads per day, then rounds to the nearest paise. UI months count as 30 days and years as 365 days.

**Why:** The payment flow needed a server-calculated amount, but the user did not specify how custom download quotas should affect price.

**How to apply:** Preserve this formula unless the user supplies a different pricing rule. If they do, update server quote calculation, displayed quote details, and tests together.