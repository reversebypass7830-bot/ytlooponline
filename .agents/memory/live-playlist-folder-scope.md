---
name: Live playlist folder scope
description: Preventing one live channel from consuming another folder's videos
---

A live channel's playlist must be scoped by the channel's selected folder and each video's groupId. Cached folder video ID arrays are only ordering metadata and may be stale after workspace recovery.

**Why:** Using a stale folder array can make a channel stream videos that belong to another folder, especially when old browser workspace data and server media are rehydrated together.

**How to apply:** Resolve the selected folder's videos by groupId first, preserve any valid cached IDs for order, append missing matching videos, and update a running stream when that scoped signature changes.