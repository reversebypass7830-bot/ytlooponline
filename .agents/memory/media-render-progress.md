---
name: Media render progress
description: Long editor renders must stream actual FFmpeg progress and keep overlay duration bounded by the main composition.
---

Long media composition requests use newline-delimited progress events derived from FFmpeg encoded time. Video overlays are looped at input level and the final output is bounded by the repeated main playlist duration, so a short face-cam or animation does not end the render early.

**Why:** A client-side progress timer falsely stopping at 88% made a healthy long render look hung, while an unbounded loop input can otherwise keep FFmpeg running indefinitely.

**How to apply:** Keep the non-streaming JSON response compatible for existing callers, request the progress stream from the editor, and retain an explicit output duration bound whenever overlay inputs are looped.