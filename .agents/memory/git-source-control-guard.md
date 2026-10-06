---
name: Git source-control guard
description: Workspace-specific guard behavior for authorized remote Git operations.
---

In this workspace, Git commands that mutate `.git` or push to a remote may be blocked unless the command is prefixed with `DANGEROUSLY_ALLOW_GIT=1`. Use it only for a Git action the user explicitly requested or approved; do not force-push unless separately authorized.

**Why:** The workspace applies an additional guard to Git state changes because these operations can affect the user's source-control setup.

**How to apply:** After confirming the target remote and intended branch, use the prefix for the requested Git mutation, then verify the remote ref matches the intended local commit.
