---
name: Orval generated drift
description: Caution about unrelated generated API behavior changes during localized OpenAPI edits.
---

Orval can refresh stale generated schemas for unrelated API fields when codegen runs. Review the full generated diff after a localized contract change; keep unrelated behavior changes out unless they are explicitly intended.

**Why:** A localized media-query contract edit regenerated a previously stale default for a separate live-composition field, changing its runtime schema from optional to defaulted.

**How to apply:** After codegen, separate the intended parameter/response changes from unrelated generated updates before accepting the generated files.