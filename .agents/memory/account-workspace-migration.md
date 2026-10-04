---
name: Account workspace migration
description: Preservation rule for moving Live Control Room accounts away from license-key access.
---

When removing license-key access, reuse each existing account's legacy workspace identifier as its `workspaceId`. Remove credential fields without moving or deleting the workspace data.

**Why:** The user requires existing playlists, folders, media references, and editor settings to remain attached to each account through the access migration.

**How to apply:** Before changing account or workspace identity logic, check how legacy IDs map to persisted workspace and media paths. Preserve that namespace for existing accounts; generate a new workspace ID only for accounts with no legacy workspace.