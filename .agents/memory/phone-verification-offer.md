---
name: Phone verification for the one-time offer
description: Product rules for the Profile phone field and 24-hour offer eligibility.
---

Phone verification for the one-time offer is India-only: the form starts on India (+91), accepts a 10-digit mobile number, and a verified number is permanently bound to the account. The Google account email stays visible but read-only in Profile. Phone verification is not required to sign in with Google.

The OTP entry should visually match the user's reference: four clearly separated, generously sized outlined boxes with visible gaps, not a narrow row that reads like one segmented line.

**Why:** The user explicitly confirmed the India-only scope, permanent phone lock, and read-only Google email while clarifying the offer flow, and corrected the OTP box styling to match their reference.

**How to apply:** Keep the country fixed to India (+91), reject any attempt to replace an account's verified phone, never make phone verification a prerequisite for Google sign-in, and preserve the reference's separate-box OTP treatment across screen sizes.