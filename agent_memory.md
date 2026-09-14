# Project Memory

> This file is a human-readable project-context snapshot created on September 14, 2026.
> It is intentionally sanitized: it does not contain passwords, API keys, cookies, tokens,
> private ingest URLs, private stream keys, credentials, or other sensitive values.
> It is a context document, not the source of truth for implementation. Before changing
> code, verify the current behavior against the source files and the latest user request.

## 1. Exact current task

The current user request is:

> Create a file named `agent_memory.md` in the root directory. Inside this file, write down
> everything learned about this project so far, including the current logic, the user's
> preferences, the project's rules, and the exact context of what we are doing.

This file is the requested deliverable. No feature implementation was requested in this
turn.

Current session context:

- Date in the provided project snapshot: Monday, September 14, 2026.
- User timezone: Asia/Calcutta.
- The project is being worked on through Replit.
- The project snapshot may be outdated; the latest conversation and current source files
  take precedence.
- The user's private profile is empty. No durable personal preferences have been saved.
- The user has not stated a preferred response language, level of detail, coding style, or
  UI preference in this conversation.
- The user explicitly requested a comprehensive project memory file, so this document
  records project facts, conventions, architecture, known behavior, and unresolved
  cautions.
- Existing unrelated working-tree state must be preserved. At the time this file was
  created, `cloudflare.txt` was already modified according to `git status`; that change
  was not made by this task and should not be discarded without user instruction.

## 2. What this project is

The workspace contains a live-streaming product called **R Loop Bypass**, exposed to users
through the **Live Control Room**. It is not a generic video player, one-time renderer, or
static dashboard. Its central purpose is to keep one or more channels continuously on air
by turning an ordered media-library playlist into a server-side live signal.

The product lets a user:

1. Upload or download videos into a protected media library.
2. Organize videos into categories or folders.
3. Create live destinations such as YouTube HLS or custom RTMP/RTMPS endpoints.
4. Select an ordered playlist for each destination.
5. Start a real server-side FFmpeg broadcast that loops the selected videos.
6. Preview the composition before going live.
7. Watch the actual encoded output while the stream is running.
8. Add overlays, edited layers, animation, a face/webcam layer, and microphone voice-over.
9. Change the playlist or live composition while a channel is already on air.
10. Monitor active channels, status, viewers, media counts, and recent activity.

There is also a separate substantial codebase under `Arroxy/`. Arroxy is a free,
open-source Electron desktop downloader for YouTube and many other sites. It is a related
media/download project in the same root checkout, but it is not the same product as the
R Loop Bypass Live Control Room. Treat the two product domains separately unless the user
explicitly asks for cross-product work.

## 3. Registered artifacts and workflows

The current registered artifacts are:

### API Server

- Artifact directory: `artifacts/api-server`
- Artifact kind: API
- Managed workflow: `artifacts/api-server: API Server`
- API base path: `/api`
- Package: `@workspace/api-server`
- Main role: Express server, database-backed application API, media handling, streaming
  routes, FFmpeg orchestration, live status, HLS preview, webcam input, and voice input.

### Live Control Room

- Artifact directory: `artifacts/live`
- Artifact kind: web
- Managed workflow: `artifacts/live: web`
- Preview path: `/`
- Package: `@workspace/live`
- Main role: browser UI for dashboard, media library, channel setup, live preview,
  streaming controls, editor, and settings.

### Canvas / Component Preview Server

- Artifact directory: `artifacts/mockup-sandbox`
- Artifact kind: design
- Managed workflow: `artifacts/mockup-sandbox: Component Preview Server`
- Preview path: `/__mockup`
- Package: `@workspace/mockup-sandbox`
- Main role: isolated component previews and design/canvas work. It is not the main
  product UI and should not be used as a substitute for the main app.

The snapshot reports all three workflows as running. When managing an artifact workflow,
use the exact existing managed workflow name. Do not create a duplicate workflow for the
same service and do not start a root-level `pnpm dev`.

## 4. Main user-facing routes

The documented Live Control Room product surface includes:

- `/dashboard` — overview of active channels, library videos, categories, viewer/activity
  information, and summary counts.
- `/live` — create, edit, start, stop, delete, and monitor live destinations/channels.
- `/live-preview` — inspect actual encoded live output and control camera, microphone, and
  live animation inputs.
- `/videos` — manage the workspace media library and categories.
- `/editor` — create edited compositions and rendered media.
- `/settings` — workspace and stream-related settings.

The live broadcasting workflow is the core product workflow. Do not add unrelated
downloader behavior or generic SaaS-dashboard decoration to the Live Control Room.

## 5. Core live-stream logic

### Playlist loop

The selected playlist is a finite ordered list of server-ready video files. FFmpeg consumes
the list through a generated concat input:

```text
video 1 -> video 2 -> video 3 -> ... -> last video -> video 1 -> ...
```

The loop continues until the configured duration is reached, the user stops the channel,
the process fails, or the playlist becomes empty or invalid.

Playlist order is meaningful. If the user selects videos in a particular order, the
broadcast must use that order. Do not alphabetize the list, silently replace it with every
video in a folder, or use an unrelated default.

If `playlistVideoIds` exists, use those IDs in that order. If there is no explicit
selection, use valid videos in the channel's category/folder. Every selected source must
resolve to a server-side `serverSource` before the stream can start.

An empty playlist is a real stop condition. Never resurrect an old playlist, bundled demo
file, or fallback media. If the last source is removed while live, stop the stream and
show that state to the user.

### Duration and automatic restart

A channel can have a configured duration, such as 30 minutes, one hour, or 24 hours.

- With auto-restart disabled, the stream stops at the duration boundary.
- With auto-restart enabled, the renderer/publisher cycle is restarted after a short
  handoff and the channel continues using current configuration.
- Playlist looping is different from auto-restart. Looping happens inside the current
  renderer; auto-restart starts a new renderer/publisher cycle after the configured
  duration.

### Start validation

Before calling the start API, the frontend should validate:

- A stream URL exists.
- A stream key or credential is available when the destination requires one.
- A category is selected.
- At least one playlist video is selected.
- Every selected main video is server-ready.
- Every selected face or overlay source is server-ready.

The frontend creates a workspace-scoped stream ID in the form:

```text
clientId:channelId
```

The start request includes destination URL, playlist sources, composition settings,
quality, aspect ratio, duration, overlays, webcam settings, and voice-audio settings.

### Renderer and publisher

The backend creates two coordinated FFmpeg processes:

1. **Renderer** — reads the playlist, applies crop/scale and composition, adds face video,
   webcam, animation, logo, chroma key, and audio mixing, and outputs MPEG-TS.
2. **Publisher** — reads the renderer's MPEG-TS output and sends it to the configured
   destination.

The renderer output is tee'd to both the publisher and a local short HLS preview buffer.
The browser is not the broadcast engine. The API server and FFmpeg produce the actual
signal.

### Destinations

Supported destination behavior includes:

- RTMP/RTMPS destinations published as FLV.
- YouTube-style HLS upload destinations published as MPEG-TS HLS files.

For HLS ingest, the destination is a URL template with a `file` query parameter. FFmpeg
must PUT one concrete playlist file and individually named segment files through that
parameter. This is not the same as a normal HLS playback URL and must not be replaced by
an RTMP command.

Never log or expose a full ingest URL because it can contain a private stream credential.

### Live updates

The frontend periodically checks:

```text
GET /api/stream/status/:streamId
```

When the ordered playlist, face sources, animation, or composition changes, it calls:

```text
POST /api/stream/update
```

The intended update sequence is:

1. Keep the publisher and destination connection alive.
2. Preserve the current stream state and browser media queues.
3. Update the renderer input configuration.
4. Stop only the current renderer.
5. Start a new renderer with the new playlist or composition.
6. Continue sending the new renderer output through the existing publisher.

The API may return an accepted/running response while the handoff is in progress. The UI
should show that the live update is underway without pretending that a new channel was
created.

Do not implement an update by creating a second publisher, dropping the destination
connection unnecessarily, silently retaining the old playlist, falling back to a default
video, or rendering a complete replacement copy first.

## 6. Preview model

There are two different previews and they must remain distinct.

### Local composition preview

This browser-side preview uses HTML video elements and is useful for checking aspect ratio,
main video selection, face placement/size, animation placement/size, and selected layer
composition. It is only a visual approximation. It does not prove that FFmpeg encoded or
delivered the stream successfully.

### Actual encoded-output preview

Once a channel is running, the API exposes a short HLS preview buffer at:

```text
/api/stream/preview/:streamId/signal.m3u8
```

`LiveOutputPreview` uses native HLS playback where supported and `hls.js` where needed.
This preview comes from the same encoded renderer output sent to the destination and
therefore includes the current playlist, composition, webcam, animation, and voice-over.

The live buffer is intentionally several seconds behind the source. That delay is
expected. Do not replace it with a local browser composition and label it as live output.

The UI should clearly label the local setup view as composition/live preview and the
running encoded signal as actual live output.

## 7. Webcam, microphone, and composition

### Webcam

Browser permissions alone cannot expose a camera to the server. When webcam input is
enabled:

1. The browser obtains a `MediaStream` through `getUserMedia`.
2. Frames are drawn to a canvas.
3. PNG frames are length-prefixed and sent to:

   ```text
   POST /api/stream/webcam/:streamId
   ```

4. The server splits the byte stream and feeds the frames to FFmpeg's image pipe.
5. FFmpeg composites the webcam into the renderer output.

Webcam capture is approximately 10 frames per second in the documented implementation.
When the webcam is enabled, disabled, moved, or resized, the renderer may restart while
the publisher stays alive. A browser disconnect is a normal lifecycle event and must not
crash the API process.

### Microphone

When microphone input is enabled:

1. The browser obtains an audio `MediaStream`.
2. Audio is converted to 48 kHz mono signed 16-bit PCM.
3. PCM chunks are sent to:

   ```text
   POST /api/stream/voice/:streamId
   ```

4. The server queues the chunks for the active renderer.
5. FFmpeg mixes voice with base video audio.

The documented implementation uses a bounded coordinated broadcast buffer so browser
input and encoded live output remain aligned. This is not a zero-latency video call.
When there is no usable base audio track, the renderer supplies silence so the voice path
and MPEG-TS output remain stable.

### Composition data

Composition may include:

- Main-layer translation and scale.
- Fit or crop mode.
- Face/webcam source and transform.
- Animation source and transform.
- Logo source, position, and scale.
- Brightness, contrast, saturation, and hue.
- Chroma-key settings.
- Aspect ratio and output quality.

Preview coordinates and server-render coordinates must remain aligned. Use normalized
layer positions consistently; do not create a preview-only coordinate convention.

## 8. Media library and access logic

The media library stores videos and categories/folders. The documented product behavior
includes:

- Create and delete video categories.
- Open a category to view its videos.
- Upload a video directly into a category.
- Delete videos.
- Store video title, selected category, and duration.
- Select a category for a channel.
- Download a YouTube video into a selected category.
- Use server-ready media in the live FFmpeg stream and face/overlay composition.

Older project notes describe a Firebase Realtime Database workspace model:

- Videos, categories, channels, and activity are scoped under a license workspace.
- A browser/client ID stored in local storage distinguishes browser workspaces.
- Refreshing in the same browser restores that browser's workspace.
- License key convenience state may be stored locally.

Those notes also explicitly warn that publicly readable/writable Firebase rules are not
production-grade security. Treat the current source and deployment configuration as the
authority if this behavior has since migrated.

Media recovery is important: server media should have an index and workspace rehydration
so existing files and folder counts survive browser or license workspace drift.

Live playlist membership must be derived from each video's current `groupId`, not only
from cached folder arrays.

Clean checkouts must not depend on ignored local media statically imported by the frontend.
Runtime uploads and API-served media are the safe path for public or clean deployments.

## 9. Authentication and licensing notes

The current API package includes Clerk-related dependencies, so authentication changes
must follow the project's Clerk integration guidance rather than introducing local
passport, bcrypt, or ad-hoc JWT authentication.

Older product notes describe a separate license-access flow:

- The main website first requests a license key.
- An owner console can create, renew, and delete licenses.
- The owner supplies a customer/workspace name and validity period.
- An expired license may be renewed for a limited period.
- Deleting a license also removes access and associated workspace data.
- Owner secrets belong in the hosting environment and must never be committed.

The documented onboarding architecture for linked accounts is server-side:

- Provider OTP or Google verification is completed through the provider.
- The browser should not receive provider credentials/tokens for account creation.
- Unlinked mobile numbers receive a short-lived onboarding token.
- The server validates the profile, creates account/trial license/workspace/session, and
  returns only the data needed for the UI.
- Existing linked accounts should enter directly.

The exact authentication system currently active must be verified in source before editing.
Do not combine the older public Firebase license model with new auth behavior without
checking data ownership, session handling, and security rules.

## 10. YouTube and download behavior

The broader workspace contains several documented download paths:

- The Live Control Room downloads YouTube media into the media library.
- The Arroxy desktop project uses a yt-dlp bridge and FFmpeg.
- Some public YouTube videos fail yt-dlp's default client with an “not available on this
  app” style error. The Android player-client fallback is retained for those cases.
- A long-running download should be an asynchronous server job with a short status-polling
  API. Do not hold one HTTP request open through the full yt-dlp operation because the
  preview proxy can terminate long requests.
- Browser polling should recover once if an in-memory download job disappears after an API
  restart by re-queuing the same download; the recovery must be bounded to avoid duplicate
  or infinite downloads.
- Server-side downloads may need the root proxy list even when the API workflow's current
  working directory is inside `artifacts/api-server`.
- Temporary downloads and final media may be on different filesystems. Handle cross-device
  moves by falling back from rename to copy-and-cleanup.
- YTSave is a fallback for a YouTube bot challenge. Its short-lived browser challenge
  token and signed URLs must stay server-side.
- YT Ultra-style metadata can resolve while every returned Googlevideo URL is rejected
  with HTTP 403 from server egress. A successful metadata request is not proof that media
  transfer will work; surface a specific provider failure rather than endlessly retrying
  incompatible signed URLs.

Do not expose signed URLs, cookies, tokens, or private provider credentials in UI text,
logs, source control, or this file.

## 11. Main source-of-truth locations

For the R Loop Bypass Live Control Room:

- `artifacts/live/src/App.tsx` — frontend routes, channel setup, playlist selection, live
  preview, webcam/microphone bridge, and API calls.
- `artifacts/live/src/index.css` — Live Control Room styling.
- `artifacts/api-server/src/routes/streaming.ts` — start, stop, update, status, HLS
  preview, webcam, and voice endpoints.
- `artifacts/api-server/src/lib/stream-runner.ts` — FFmpeg processes, concat inputs,
  renderer/publisher handoff, HLS preview, and input pipes.
- `lib/api-spec/openapi.yaml` — API contract source of truth.
- `lib/api-client-react` — generated React API hooks.
- `lib/api-zod` — generated request/response validation types.
- `lib/db` or `artifacts/api-server` database-facing code — verify the current schema
  location before editing because the workspace has evolved over time.

For the Arroxy desktop downloader:

- `Arroxy/src/` — Electron main, preload, renderer, and shared code.
- `Arroxy/packages/yt-dlp-bridge/` — workflow planning, argv generation, process
  execution, and output parsing.
- `Arroxy/packages/ytdlp-errors/` — structured yt-dlp error taxonomy.
- `Arroxy/CONTEXT.md` — canonical domain glossary.
- `Arroxy/DESIGN.md` — visual design system.
- `Arroxy/docs/adr/` — architecture decision records.
- `Arroxy/AGENTS.md` — detailed project-specific engineering and testing rules.

## 12. API and workspace rules

The repository is a pnpm workspace with TypeScript packages and generated API clients.
The documented stack includes:

- pnpm workspaces.
- Node.js 24.
- TypeScript 5.9.
- Express 5.
- PostgreSQL and Drizzle ORM.
- Zod and drizzle-zod.
- Orval-generated API hooks and schemas.
- esbuild for the API bundle.
- React, Vite, TanStack React Query, Firebase, and `hls.js` in the Live Control Room.
- FFmpeg and media-related Node packages in the API server.

Rules:

1. Define backend contracts in OpenAPI first.
2. Run API code generation after every OpenAPI request/response change.
3. Use generated React hooks and generated schemas instead of inventing duplicate
   contracts.
4. Use relative or artifact-aware paths in browser code. Do not hardcode localhost or
   the development domain into application code.
5. Access services through the shared proxy for ad-hoc checks, not directly through
   service ports.
6. Services bind to the workflow-provided `PORT` and `BASE_PATH`.
7. Do not configure duplicate workflows for artifact services.
8. Do not add leaf artifacts to the root TypeScript solution references.
9. Each workspace package declares its own dependencies.
10. Server code should use the request logger or the shared logger, not `console.log`.
11. Validate untrusted input from IPC, persistence, processes, network, environment, and
    browser APIs at trust boundaries.
12. Prefer mature libraries over bespoke plumbing.
13. Preserve strict typing. Avoid `any`; use `unknown` and narrow it.
14. Keep concerns separated and dependencies pointing inward.
15. When uncertain, inspect source or official documentation instead of guessing.
16. If the same error appears three times, research multiple possible fixes before
    continuing to repeat the same attempt.
17. Preserve unrelated changes in the working tree.

Important command patterns from the current docs:

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

For a leaf artifact, the documented verification command is:

```bash
pnpm --filter @workspace/<package> run typecheck
```

The root `replit.md` is still a template in places. Its heading, product description,
repo map, architecture decisions, product section, preferences, and gotchas should be
updated only when the user asks for that separate documentation task or when a code
change makes the update necessary.

## 13. Visual and interaction rules for the Live Control Room

The Live Control Room should feel like a calm, reliable broadcast room rather than a
generic admin panel. Keep the UI focused on broadcasting operations and make live,
stopped, error, and updating states obvious.

Use:

- Clear live/stopped/error state communication.
- Deliberate, memorable color choices.
- Accessible status text and icons, not color alone.
- Smooth but restrained interaction feedback.
- Thoughtful loading, empty, error, and disconnected states.
- The existing product language and visual system.
- No emojis anywhere in application UI.

The Arroxy visual system is separate but documented in detail:

- “The Aurora Console” identity.
- Dark aurora-navy and light cool-blue skies.
- Electric blue as the single brand signal.
- Status colors for done, paused, and error.
- Poppins for UI text and JetBrains Mono for technical/live numeric values.
- Glass panels over a solid aurora-lit canvas.
- Avoid generic gray SaaS styling, sketchy downloader styling, unnecessary modal stacks,
  stacked backdrop blurs, warm beige light mode, gradient text, colored side stripes,
  all-caps body copy, extra UI font families, and em dashes in UI copy.

The two products should not be visually conflated without an explicit request.

## 14. Arroxy product context

Arroxy is a separate Electron desktop downloader for YouTube and approximately 2000
supported sites. Its core vocabulary is intentionally standardized:

- A single download attempt is a **Job**.
- A step within a job is a **Phase**.
- Parallel parts of one video are **Download connections**.
- Simultaneous queue items are **Downloads at once**.
- A transient automatic retry is **Automatic retry**.
- A usable-but-incomplete result is a **Soft failure**.
- A fatal unusable result is a **Hard failure**.
- Saved restart state is **Resume context**.
- A produced file is an **Artifact**.
- The ordered persistent set is the **Queue**.
- A single persistent entry is a **Queue item**.
- The assigned output folder is the **Output target**.
- The management surface is the **Downloads view**.
- A scheduling tier is a **Lane**.
- A pre-start pause is a **Held pause**.
- A post-start pause is an **Active pause**.
- The guided URL-to-confirmation flow is a **Wizard**.
- URL inspection is a **Probe**.
- A named quality choice is a **Preset**.
- A saved reusable set of settings is a **Download profile**.
- Directly starting from one is **Quick download**.
- Separate subtitle files are **Sidecar subtitles**.
- Muxed selectable tracks are **Embedded subtitles**.
- External programs are **Dependencies**.
- The versioned dependency list is the **Binary manifest**.
- App-managed dependencies are **Managed binaries**.
- Startup readiness checking is **Warmup**.
- The working part of the product is the **Core**.
- A presentation/integration boundary is a **Shell**.
- A capability required by core is a **Port**.
- A shell implementation of a port is an **Adapter**.
- The single wiring location is the **Composition root**.

Use `Arroxy/CONTEXT.md` as the canonical glossary when working in Arroxy. Do not use
these terms as if they were automatically the terminology of the Live Control Room.

## 15. Durable implementation lessons already recorded

The project memory index under `.agents/memory/MEMORY.md` contains deeper notes. The
following is a concise index of the known lessons:

- Railway web-terminal HTTP proxy and SSH TCP proxy use different service ports.
- Railway frozen pnpm installs can reject lockfiles generated by another pnpm major/version.
- YouTube HLS upload requires a playlist PUT and individually named media-segment PUTs.
- Some public videos require an Android yt-dlp player-client fallback.
- YTSave requires a short-lived challenge token and size-safe quality selection.
- The current channel extractor can return video anchors as HTML from its AJAX endpoint.
- Playlist edits during a broadcast require an FFmpeg renderer restart while preserving the
  publisher.
- Public Firebase Realtime Database rules are not sufficient protection for owner
  passwords or production licensing.
- Ignored local media must not be statically imported by a frontend in a clean checkout.
- Existing server media needs an index and workspace rehydration.
- Playlist membership must use each video's `groupId`, not only cached folder arrays.
- The bgutil proof-of-origin provider must be compiled separately and passed to yt-dlp via
  its parent plugin directory.
- Provider metadata success does not prove server-side signed media URLs are fetchable.
- Root proxy lists and cross-filesystem media moves need explicit handling.
- Generated Zod code in this workspace may reject `zod.int()`; use compatible numeric
  OpenAPI schemas when codegen requires an integer.
- Owner-managed tokens must rotate after quota errors and keep cooldown outside the process.
- Browser download polling needs one bounded recovery if an in-memory job disappears.
- Editor translation must stay normalized so preview and FFmpeg output align.
- Chroma-key preview should use a transparent canvas and match FFmpeg chromakey settings.
- FFmpeg progress should be streamed and looping overlays should be bounded to composition
  duration.
- Browser camera/mic preview needs a real-time bridge before entering server FFmpeg.
- In-memory stream sessions need a credential-safe durable store for process restart recovery.
- Dynamic FFmpeg input indices must be mapped from the complete input order.
- HLS preview paths must survive renderer handoffs so a healthy publisher does not look stopped.
- Mobile OTP should be verified by the provider, then bound to an already-linked Firebase
  account before creating a local session.
- New mobile/Google onboarding should keep profile, trial license, workspace, and session
  creation server-side.
- Firebase Google ID tokens should exchange for a server-signed session.
- Firebase Vite browser configuration may need explicit injection from non-`VITE_` variables.
- Large local runtime media may bypass normal gitignore during publishing; use deployment
  ignore rules for deployment-only exclusions.
- Cloudflare quick tunnels are optional; local live preview should survive tunnel failure.

For the full rationale and application guidance, open the corresponding topic file rather
than expanding this summary with secrets or implementation logs.

## 16. Security and privacy rules

Never place any of the following in this file, source control, logs, UI copy, or chat:

- Passwords.
- API keys.
- Session secrets.
- OAuth tokens or JWTs.
- Cookies.
- Private stream keys.
- Full private HLS ingest URLs.
- Signed media URLs.
- Connection strings containing credentials.
- User personal information.

Environment secrets must be managed through the platform's secrets mechanism. If a secret
is required, request or access it through the approved secrets workflow; never ask the
user to paste it into chat and never print its value.

Stream IDs should remain workspace-scoped. Media and channel access must remain scoped to
the correct license/workspace/account. Do not leak one workspace's data into another.

## 17. Work style and response preferences currently known

The user has not supplied explicit cross-project personal preferences yet. The currently
observed request implies:

- They value a durable, comprehensive written project context.
- They want the exact current task preserved for future agents.
- They want project rules and current logic documented together.
- They did not ask for a feature change in this turn.

These are task-level observations, not permanent personal preferences. Do not treat them
as a standing instruction for unrelated projects unless the user explicitly asks to
remember them.

## 18. What is unresolved or must be verified before future changes

- The snapshot contains both the newer pnpm artifact workspace and older product notes.
  Confirm the current implementation before relying on historical notes.
- The exact current auth/licensing path must be verified in source because Clerk-related
  dependencies and older Firebase license documentation coexist.
- The current database schema and persistence strategy must be inspected before migrations.
- The current API contract must be changed before server/client request-shape changes.
- The exact current media files and server-ready media inventory must be checked before
  promising that a stream can start.
- External YouTube/provider behavior is subject to upstream changes and should be tested
  through the current configured fallback path.
- The contents of sensitive local files were intentionally not copied into this document.
- A clean deployment must be checked for missing ignored media instead of assuming local
  assets exist.

## 19. Short mental model

```text
Media library
      |
      v
Ordered channel playlist
      |
      v
Server-side FFmpeg renderer
      |-- composition, overlays, camera, voice
      |-- short HLS actual-output preview
      `-- MPEG-TS output
                |
                v
        Persistent publisher
                |
                v
        YouTube HLS or RTMP/RTMPS

The browser controls and observes this pipeline.
It is not the broadcast engine.
```

## 20. Future-agent checklist

Before editing:

1. Read the latest user request.
2. Check current source and git status.
3. Identify whether the task belongs to R Loop Bypass, Arroxy, or a different artifact.
4. Read the relevant artifact and integration/auth/database skill instructions.
5. Preserve ordered playlists, workspace scoping, actual-output preview semantics, and
   credential privacy.
6. If the API shape changes, edit OpenAPI and run codegen first.
7. Keep browser code artifact-path-aware.
8. Avoid demo or fallback media that masks empty or invalid real data.
9. Preserve unrelated working-tree changes.
10. Verify the whole requested change with the cheapest appropriate checks, without
    claiming that an unverified path works.
