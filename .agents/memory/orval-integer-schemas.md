---
name: Orval integer schemas
description: Compatibility note for OpenAPI codegen and the workspace's installed Zod runtime.
---

OpenAPI integer fields can make Orval generate `zod.int()`, but the installed Zod runtime in this workspace may not expose that helper.

**Why:** Codegen can succeed while the generated library typecheck fails immediately afterward.

**How to apply:** When adding a small numeric control to the API contract, use a bounded numeric schema and validate integer semantics at the server boundary unless the workspace Zod/Orval versions are upgraded together.