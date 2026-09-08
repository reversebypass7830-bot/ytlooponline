---
name: BgUtils POT provider integration
description: The local bgutil provider is compiled as a separate Node process and yt-dlp must receive the parent plugin directory.
---

The BgUtils provider is optional and runs on localhost beside the API. Its upstream TypeScript source needs to be compiled as separate ESM files so Node can resolve local imports while leaving native/runtime dependencies available. yt-dlp's `--plugin-dirs` value must be the directory containing the provider package folder, not the `yt_dlp_plugins` folder itself.

**Why:** yt-dlp's plugin finder scans each child of the configured directory for a `yt_dlp_plugins` namespace. Passing the namespace's parent package directly makes the provider load as absent.

**How to apply:** Keep the HTTP provider and Python plugin on the same major version, start the provider on loopback only, and preserve ordinary yt-dlp/cookie/direct-URL fallbacks when token generation or YouTube still rejects a request.