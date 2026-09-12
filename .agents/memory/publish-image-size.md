---
name: Publish image size
description: Deployment image sizing for this workspace's artifact publishing flow.
---

Publishing uses the workspace deployment context, not only the files tracked by git. Large generated media under the API server can therefore push the image past the 8 GiB limit even when the app build succeeds.

**Why:** A Streamly publish built successfully but failed while pushing the Repl layer because local live-media videos made the image exceed the platform limit.

**How to apply:** Put deployment-only exclusions in the root `.replitignore`. Exclude caches, unrelated source trees, and generated/test media there without deleting local files. Keep the small included-animation assets that the published app actually needs; move persistent user media to object storage as a separate reliability improvement.