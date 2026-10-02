---
name: Historical project context
description: How to use the root agent_memory.md when working across the Live Control Room and Arroxy.
---

`agent_memory.md` is the broad project-context snapshot from an earlier project version. The workspace contains two distinct products: R Loop Bypass, whose Live Control Room manages continuous server-side broadcasts, and Arroxy, a separate Electron downloader. Keep their product behavior and visual language separate unless the user explicitly asks for cross-product work.

For the Live Control Room, the browser controls and observes a broadcast produced by the API server and FFmpeg; it is not the broadcast engine. Keep the local composition preview distinct from the actual encoded-output preview, and preserve the running publisher when applying renderer or playlist updates. Detailed operational lessons are captured in the linked topic notes.

**Why:** The project has accumulated substantial context across multiple iterations, but the snapshot can become outdated as the implementation changes.

**How to apply:** Use this distinction to scope work to the correct product. Read the relevant parts before substantial work when historical context is needed. Treat the latest user request and current source as authoritative; verify implementation details and preserve unrelated working-tree changes.