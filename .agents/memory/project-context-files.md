---
name: Project context files
description: The user's instruction to consult the root project memory and hosting notes before project work.
---

Before starting project work, read the root `agent_memory.md` and check whether a root `host.md` exists before reading it. Use available notes to retain prior project context, product boundaries, and hosting constraints, but treat them as contextual notes rather than the source of truth for current implementation. The current user request and source code take precedence when details may have changed.

**Why:** The user asked that these files be read so project context is not lost between versions or conversations, and noted that new durable context can be recorded as it is learned.

**How to apply:** At the start of future work in this project, consult `agent_memory.md` and any existing root `host.md` before changing code or configuration. Add only durable, non-secret context to project memory when it cannot be recovered cheaply from current code.