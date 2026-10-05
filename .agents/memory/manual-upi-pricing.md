---
name: Daily custom-access pricing
description: The quote rule for per-day stream starts, downloads, and access rent.
---

Calculate the quote as `(streams per day × stream-start rate + downloads per day × video-download rate + daily rent) × duration days`. Store rupee rates in paise, rounding to the nearest paisa. UI months count as 30 days and years as 365 days. Do not scale the download rate against the plan's included download count. A paid download-only order uses zero stream starts and at least one download per day.

**Why:** The user confirmed that stream starts, downloads, and daily rent are all charged for every access day; e.g. ₹5 + ₹1 + ₹5 for two days totals ₹22.

**How to apply:** Keep the server quote, customer estimate, owner pricing editor, and owner order breakdown aligned. If the formula changes, update all four and their tests together.