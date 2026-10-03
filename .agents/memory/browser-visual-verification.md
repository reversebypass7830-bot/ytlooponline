---
name: Browser visual verification
description: Fallback for interactive screenshots when the browser automation wrappers are unavailable.
---

If the Browser Use CLI is missing and Python Playwright cannot load its native dependencies, the provided Chromium can still be controlled through Chrome DevTools Protocol from Node. This supports scrolling to below-the-fold content, inspecting rendered state, and capturing viewport screenshots without changing app code.

**Why:** This environment lacked the Browser Use executable and Python Playwright failed to load because `libstdc++` was unavailable, while direct Node CDP control through Chromium worked.

**How to apply:** Use this fallback only when a normal app-preview screenshot cannot reach the section or state that needs visual verification; keep the browser session temporary and save captures under `/tmp`.