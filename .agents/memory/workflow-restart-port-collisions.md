---
name: Workflow restart port collisions
description: Artifact workflow restarts can fail when an earlier child server still owns the service port.
---

If an artifact workflow restart fails with `EADDRINUSE`, inspect the exact listener and workflow status before changing ports or restarting again. A prior child process may still be serving even though the workflow itself reports failure. Stop the managed workflow, confirm the port is free, then restart services one at a time.

**Why:** Restarting the web and API artifact workflows while their previous child processes were still alive produced duplicate port owners; blindly retrying reproduced the failure.

**How to apply:** For artifact port collisions, use `lsof` or an equivalent listener check, stop the exact managed workflow, verify the port released, then restart once. Do not kill unrelated processes or hardcode a replacement port.