---
name: YouTube HLS ingest
description: Non-obvious requirements for sending prerecorded video to YouTube HLS ingestion.
---

YouTube HLS ingestion URLs are templates ending in an empty `file=` query parameter. The encoder must use the same endpoint with a concrete playlist filename and concrete segment filenames, sending each playlist and segment with HTTP PUT. Use a rolling media playlist with no more than five outstanding segments, update the playlist for every segment, and keep segment filenames unique across stream restarts. Segments should be 1–4 seconds and must not exceed 5 seconds. Media must be muxed in M2TS with H.264 or HEVC video and AAC audio.

**Why:** YouTube rejects playlists that violate its rolling-window and segment naming requirements; FFmpeg's `event` playlist type overrides `hls_list_size`, so the apparent five-segment limit is not applied.

**How to apply:** When changing the stream runner, preserve per-file `file=` URL construction, use rolling playlists and session-unique segment names, and never log the full ingest URL because it contains the stream credential. See [YouTube's HLS ingestion requirements](https://developers.google.com/youtube/v3/live/guides/hls-ingestion).

Publisher diagnostic: `RTMP_ReadPacket` beside `[hls] Failed to open file` points to segment I/O using RTMP transport (or a redirect to it), rather than a normal HTTPS HLS upload. Check the parsed scheme without logging the full credential-bearing URL.