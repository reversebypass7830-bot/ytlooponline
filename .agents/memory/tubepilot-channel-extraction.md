---
name: TubePilot channel extraction
description: External behavior of the public TubePilot YouTube channel-link extractor
---

The TubePilot channel-link endpoint currently accepts a form-encoded `video_links_extract` AJAX request and returns HTML containing YouTube video anchors rather than a JSON link list.

**Why:** The endpoint is undocumented and its response shape is easy to misread as JSON; parsing only YouTube watch, Shorts, and short-link targets keeps unrelated page links out of the download queue.

**How to apply:** Keep the call server-side, validate the user-provided channel URL before forwarding it, deduplicate normalized watch URLs, and treat an empty result or non-2xx response as an explicit user-facing error.