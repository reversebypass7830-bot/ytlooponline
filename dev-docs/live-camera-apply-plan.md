# Live camera and microphone apply plan

## Goal

When a live channel is already on air, enabling the browser webcam and
microphone must keep both sources in the encoded stream. Applying an overlay
or another composition change must update the live output without stopping the
publisher or losing the browser media bridge. The encoded preview must show
the same result that is sent to the destination.

## Current risk

- Browser camera and microphone uploads are managed by React effects tied to
  the selected channel and device controls.
- Composition updates rebuild only the FFmpeg renderer, but the update request
  does not explicitly carry the current browser-media state.
- Rapid edits can overlap with a renderer handoff. A newer update must be
  queued rather than starting a second handoff.
- The UI needs to distinguish a renderer handoff from a stopped stream so an
  accepted update does not look like an outage.

## Implementation

1. Treat the browser camera/microphone bridge as live-session state:
   preserve it across composition updates and reattach it when the selected
   channel changes without stopping the publisher.
2. Make live composition apply atomic:
   send the latest channel composition, playlist, and device placement in one
   update; keep the server-side publisher and existing media queues alive while
   FFmpeg warms the replacement renderer.
3. Make the preview truthful:
   keep the local camera layer in the live control preview, use the encoded HLS
   preview as the source of truth, and show an explicit “applying” state rather
   than treating a short renderer handoff as stream termination.
4. Add defensive server behavior:
   retain live webcam and voice state when updates arrive, avoid tearing down
   input bridges during queued handoffs, and keep the old renderer available
   until the replacement emits its first packet.

## Acceptance checks

- With a running stream, turn on webcam and microphone and confirm the HLS
  preview contains the camera and voice.
- Apply/remove an overlay while both devices are active; the publisher stays
  running and the next HLS segments contain the new composition.
- Move or resize the browser webcam while applying an overlay; the newest
  update wins without a second stream start.
- Disable either device; the other device and the main stream continue.
- Starting a new channel without browser devices still works.