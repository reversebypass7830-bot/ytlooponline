# R Loop Bypass — Project Context Prompt

> इस file को किसी दूसरे coding/design agent को शुरुआत में दे सकते हैं।  
> यह project के purpose, live loop, preview pipeline और मुख्य engineering rules का
> copy-paste context है।

## Copy-paste prompt

You are working on **R Loop Bypass**, a browser-based live broadcasting control
room. Do not treat it as a normal video player, a one-time video renderer, or a
static dashboard.

The product lets a user:

1. Upload or download videos into a protected media library.
2. Organize videos into categories/folders.
3. Create one or more live destinations, such as YouTube HLS or a custom RTMP
   endpoint.
4. Select an ordered playlist for each destination.
5. Start a real server-side FFmpeg broadcast that continuously plays the
   selected videos.
6. Preview the composition before going live and watch the actual encoded output
   while the stream is running.
7. Add overlays, edited layers, animations, a face/webcam layer, and microphone
   voice-over.
8. Change the playlist or live composition while the channel is already on air.

The main user-facing application is the **Live Control Room** in
`artifacts/live`. The server-side streaming implementation is in
`artifacts/api-server`. The API is mounted under `/api`.

## Product identity

R Loop Bypass keeps a channel on air by turning a selected library playlist into
a continuous live signal. The user should feel that they are operating a calm,
reliable broadcast room: choose the videos, configure the destination, inspect
the preview, then start the signal with confidence.

The current product surface includes:

- `/dashboard` — overview of active channels, library videos and categories.
- `/live` — create, edit, start, stop and monitor live destinations.
- `/live-preview` — inspect the actual encoded live output and control camera,
  microphone and live animation inputs.
- `/videos` — manage the workspace media library and categories.
- `/editor` — create edited compositions and rendered media.
- `/settings` — workspace and stream-related settings.

Do not add unrelated downloader or generic SaaS-dashboard behavior. The live
broadcast workflow is the core of the product.

## The most important distinction: two kinds of preview

There are two different previews. They must never be described or implemented as
the same thing.

### 1. Local composition preview

The channel setup and live animation controls render a browser-side preview
using HTML `<video>` elements. It is useful for checking:

- aspect ratio;
- main video selection;
- face video placement and size;
- live animation placement and size;
- selected layer composition.

This preview is a visual approximation. It does not prove that FFmpeg has
encoded or delivered the stream successfully.

### 2. Actual live output preview

Once a channel is running, the API exposes a short HLS preview buffer at:

```text
/api/stream/preview/:streamId/signal.m3u8
```

The frontend component `LiveOutputPreview` uses native HLS playback where
available, and `hls.js` in browsers that need it. This preview is made from the
same encoded renderer output that is sent to the destination. It includes the
actual playlist, composition, webcam, animation and voice-over currently
feeding the broadcast.

Because it follows a live buffer, it is intentionally several seconds behind
the source. That delay is expected. Never “fix” this by replacing it with a
local browser composition and calling that the live output.

The UI should label these concepts clearly:

- local setup view: composition/live preview;
- running encoded signal: actual live output.

## How the real-time loop works

The selected playlist is a finite ordered list of server-ready video files.
FFmpeg consumes that list through a generated concat input and plays the videos
one after another:

```text
video 1 → video 2 → video 3 → ... → last video → video 1 → ...
```

The loop continues until one of these happens:

- the configured stream duration is reached;
- the user stops the channel;
- the process fails;
- the playlist becomes empty or invalid.

The playlist order is meaningful. If the user ticks videos in a particular
order, the broadcast must use that order. Do not sort the list alphabetically
or silently replace it with every video in the folder.

If `playlistVideoIds` is set, use those IDs in that order. If there is no
explicit selection, the valid videos in the channel's category/folder are used.
Every selected source must resolve to a server-side `serverSource` before a
stream can start.

An empty playlist is a real stop condition. Never fall back to an old playlist,
a bundled demo file, or an unrelated default video. If the last source is
removed while live, stop the stream and make that state visible to the user.

### Duration and auto-restart

The channel can have a configured duration, for example 30 minutes, 1 hour,
or 24 hours. When the duration ends:

- with auto-restart disabled, the stream stops;
- with auto-restart enabled, FFmpeg is restarted after a short handoff and the
  channel continues using the current configuration.

Auto-restart is different from playlist looping. Playlist looping happens inside
the active renderer. Auto-restart starts a new renderer/publisher cycle after
the configured duration.

## What happens when a stream starts

The frontend validates the channel before calling the API:

- stream URL exists;
- stream key is available when required;
- a category is selected;
- at least one playlist video is selected;
- every selected main video is server-ready;
- every selected face/overlay source is server-ready.

The frontend creates a workspace-scoped stream ID:

```text
clientId:channelId
```

It then calls the generated `startStream` API hook with the destination URL,
playlist sources, composition options, quality, aspect ratio, duration,
overlays, webcam settings and voice-audio setting.

The backend route is:

```text
POST /api/stream/start
```

The server-side stream runner then creates two coordinated FFmpeg processes:

1. **Renderer** — reads the media playlist, applies crop/scale/composition,
   face video, live webcam, animation, logo, chroma key and audio mixing. It
   outputs MPEG-TS.
2. **Publisher** — reads the renderer's MPEG-TS output and sends it to the
   configured destination.

The renderer output is tee'd to both:

- the publisher input, which delivers the live signal;
- the local short HLS preview buffer, which feeds the browser's actual-output
  preview.

This separation is important. The browser is not directly publishing the
playlist. The API server and FFmpeg are doing the actual broadcast work.

## Supported destination behavior

The stream runner supports:

- RTMP/RTMPS destinations, published as FLV;
- YouTube-style HLS upload destinations, published as MPEG-TS HLS files.

For HLS ingest, the destination is a URL template with a `file` query
parameter. FFmpeg must PUT:

- one concrete playlist file, such as `signal_desk.m3u8`;
- individually named segment files, such as `signal_desk_00001.ts`.

Do not replace this with a normal HLS playback URL or an RTMP command. Do not
log the full ingest URL because it can contain a private stream credential.

## What happens when a live stream is updated

The frontend monitors live channels and periodically checks:

```text
GET /api/stream/status/:streamId
```

When the ordered playlist, face sources, animation or composition changes, the
frontend calls:

```text
POST /api/stream/update
```

The update behavior is deliberately specific:

1. Keep the publisher process and destination connection alive.
2. Keep the current stream process state and browser media queues.
3. Update the renderer input configuration.
4. Stop only the current renderer.
5. Start a new renderer with the updated playlist/composition.
6. Continue sending the new renderer output to the existing publisher.

This avoids an unnecessary live outage. FFmpeg's concat input does not
reliably discover arbitrary file-list edits while it is already running, so a
renderer handoff is the correct way to apply a playlist update.

Never implement a live playlist update by:

- creating a second publisher;
- dropping the destination connection unnecessarily;
- silently continuing with the old playlist;
- falling back to a default video;
- generating a complete rendered copy before applying the change.

The API returns an accepted/running response while the renderer handoff is
being performed. The UI should show that the live update is in progress without
pretending that a new stream was created.

## Webcam and microphone behavior

Browser permissions alone cannot make the server see a camera or microphone.
The browser therefore sends the selected device data to the running stream.

### Webcam

When the user enables the webcam:

1. The browser obtains a `MediaStream` through `getUserMedia`.
2. Frames are drawn to a canvas.
3. Each PNG frame is sent over a streaming request to:

   ```text
   POST /api/stream/webcam/:streamId
   ```

4. Frames are length-prefixed so the server can split the byte stream.
5. The server feeds the frame data to FFmpeg's image pipe.

The current browser capture is approximately 10 frames per second. The
server-side webcam layer is composited into the renderer, not merely displayed
in a local preview.

When the webcam is enabled, disabled, moved or resized, the renderer may be
restarted while the publisher remains alive. A browser disconnect must detach
cleanly and must not crash the API process.

### Microphone

When the user enables the microphone:

1. The browser obtains an audio `MediaStream`.
2. Audio is converted to 48 kHz mono signed 16-bit PCM.
3. PCM chunks are sent to:

   ```text
   POST /api/stream/voice/:streamId
   ```

4. The server queues the chunks for the active renderer.
5. FFmpeg mixes the voice with the base video audio.

The voice and webcam inputs use a coordinated broadcast buffer of about
10 seconds. This is intentional: it keeps the browser input and the encoded
live signal aligned. Do not present this as a zero-latency video call.

When there is no usable base audio track, the renderer supplies silence so the
voice path and the MPEG-TS output remain stable.

## Live animation and composition

The live preview page can select an animation from server-ready media, drag it
on the preview, change its scale, and apply it directly to a running channel.

Applying an animation calls `/api/stream/update` with the new composition. It
does not create a permanent rendered video copy first.

Composition data can include:

- main layer translation and scale;
- fit or crop mode;
- face/webcam source and transform;
- animation source and transform;
- logo source, position and scale;
- brightness, contrast, saturation and hue;
- chroma-key settings;
- aspect ratio and output quality.

Preview coordinates and server render coordinates must remain aligned. If a
layer is moved in the browser, the same normalized position must be used by
FFmpeg. Do not introduce a separate coordinate convention for preview only.

## Main code locations

Use these locations as the starting point before editing:

- `artifacts/live/src/App.tsx` — frontend routes, channel setup, playlist
  selection, live preview, webcam/microphone bridge and API calls.
- `artifacts/live/src/index.css` — Live Control Room styling.
- `artifacts/api-server/src/routes/streaming.ts` — start, stop, update, status,
  HLS preview, webcam and voice endpoints.
- `artifacts/api-server/src/lib/stream-runner.ts` — FFmpeg processes, playlist
  concat files, renderer/publisher handoff, HLS preview and input pipes.
- `lib/api-spec/openapi.yaml` — API contract source of truth.
- `lib/api-client-react` — generated frontend API hooks.
- `lib/api-zod` — generated request/response validation types.

Before changing an API request or response:

1. Change the OpenAPI contract first.
2. Run code generation.
3. Update the server and frontend against the generated types.

## Engineering rules for future agents

- Preserve the distinction between local composition preview and actual HLS
  encoded-output preview.
- Preserve ordered playlist semantics.
- Preserve workspace/license scoping in stream IDs and media access.
- Do not expose stream keys or ingest credentials in UI text or logs.
- Do not use demo media or silent fallback media in a clean checkout.
- Do not replace a running publisher when only the renderer needs to change.
- Do not let an empty playlist resurrect an old or default source.
- Treat browser webcam/microphone disconnects as normal lifecycle events.
- Keep stream status visible and reconcile the UI with the API status.
- Use the existing generated API hooks where they exist instead of inventing
  duplicate fetch contracts.
- Keep the live UI focused on broadcasting operations, not generic admin
  decoration.
- Use the existing product language and visual system. The product has a calm
  broadcast-room feel, with clear live/stopped/error states.
- Never use emojis in the application UI.

## A concise mental model

```text
Library videos
      ↓
Ordered channel playlist
      ↓
Server-side FFmpeg renderer
      ├── composition / overlays / camera / voice
      ├── short HLS preview buffer
      └── MPEG-TS output
              ↓
       Persistent publisher
              ↓
       YouTube HLS or RTMP
```

The browser controls and observes this pipeline. It is not the broadcast
engine. The actual live signal is the server-rendered output, and changes to a
running channel should normally restart only the renderer while keeping the
publisher and destination alive.
