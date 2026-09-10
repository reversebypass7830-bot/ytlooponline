---
name: Media library recovery
description: Durable relationship between server video files and per-license workspace metadata
---

Server media files and per-license workspace JSON can drift apart: a file may exist in live-media while its workspace entry or folder membership is missing.

**Why:** Browser/license workspace data is metadata, while the actual video bytes live on the server. Treating either one as the sole source of truth makes files disappear from the library or makes folders show zero videos after a restart or migration.

**How to apply:** Keep a server-side media index with license/folder/title metadata, list and rehydrate missing files into the current workspace, and repair folder membership from each video's group identifier when loading old workspace data. Treat stored folder names as slash-separated paths and rebuild every missing ancestor, rather than creating one flat group from the full path.