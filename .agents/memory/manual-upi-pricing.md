---
name: Manual UPI pricing assumption
description: The currently implemented formula for quoting custom duration, stream count, and daily download quotas.
---

Use the owner-entered rate for one live-stream start per day and the owner-entered rate for one video download. Calculate the quote as `(streams per day × stream-start rate + downloads per day × video-download rate) × duration days`. UI months count as 30 days and years as 365 days. Do not scale the download rate against the plan's included download count.

**Why:** The owner confirmed the two-rate formula; it supersedes the earlier proportional-download assumption.

**How to apply:** Keep the server quote, customer estimate, and owner pricing editor aligned with these two rates. If the owner changes the formula, update the server calculation, quote display, and tests together.