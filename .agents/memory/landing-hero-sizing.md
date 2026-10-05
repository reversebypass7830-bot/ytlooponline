---
name: Landing hero sizing
description: User says the original landing hero artwork looked right on desktop and mobile.
---

Keep the existing responsive size and aspect ratio for the landing hero artwork unless the user explicitly asks to change it. A narrower parent alone can make the image render as a tall crop when HTML width and height hints are present; diagnose image height behavior before changing dimensions.

**Why:** The user said the original desktop and mobile layout was correct after assistant-added mobile overrides made the artwork look wrong.

**How to apply:** When asked to undo this adjustment, remove only the mobile-specific hero overrides and preserve unrelated landing-page SEO and performance work.
