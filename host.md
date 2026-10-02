# `ytloop.online` Hosting Notes

This file records how the Live Control Room is currently exposed through Cloudflare and Replit. It contains no tunnel credentials.

## Request flow

```text
Visitor
  -> https://ytloop.online
  -> Cloudflare DNS/proxy
  -> named Cloudflare Tunnel
  -> cloudflared process in the Replit Live workflow
  -> Vite on 127.0.0.1:26180
  -> Live Control Room
```

The Vite development server proxies `/api/*` requests to the API server at `127.0.0.1:8080`. The API server is a separate Replit workflow, so it must also be running for account and streaming controls to work.

## Cloudflare configuration

- Cloudflare zone: `ytloop.online`.
- Named tunnel: `replit-live-control-room-ytloop`.
- Tunnel ingress hostname: `ytloop.online`.
- Tunnel origin: `http://127.0.0.1:26180`.
- The root DNS record was changed from two proxied A records to a proxied CNAME pointing to the named tunnel. Existing CAA records were left unchanged.
- The root hostname was the user's deliberate choice. Do not restore the old A records, change the hostname, or alter the tunnel route without the user's approval.

## Replit configuration

- Shared environment setting: `CLOUDFLARE_TUNNEL_HOSTNAME=ytloop.online`.
- Replit Secret: `CLOUDFLARE_TUNNEL_TOKEN`. The value must stay in Replit Secrets; never copy it into this file, source code, logs, or chat.
- The `artifacts/live: web` workflow runs `pnpm --filter @workspace/live run dev`.
- That command starts `artifacts/live/scripts/dev-with-cloudflare.mjs`, which starts Vite and runs `cloudflared tunnel run` using a temporary, permission-restricted token file. The token is removed from the environment passed to Vite.
- Vite uses port `26180`; the Replit port mapping exposes it as port `80`. Vite proxies `/api` to the API server on port `8080`.
- The `artifacts/api-server: API Server` workflow runs `pnpm --filter @workspace/api-server run dev`.
- The startup script updates the root `cloudflare.txt` file with tunnel startup/link status. This file is not the source of the secret.

## Start and verify

1. In Replit Workflows, start `artifacts/api-server: API Server`.
2. Start `artifacts/live: web`.
3. Check the Live workflow logs for Vite readiness and Cloudflare Tunnel connections/healthy status.
4. Check `https://ytloop.online/`; the landing page should return HTTP 200.
5. Without a signed-in session, `/api/account` may return HTTP 401. That is expected and confirms that the request reached the authenticated API.

If the tunnel does not connect, check that the secret exists in Replit Secrets and that the shared hostname setting is still `ytloop.online`. Do not print or request the secret value. If the page loads but API requests fail, check that the API workflow is running.

## Important availability limit

This is a development-workflow tunnel, not a published always-on deployment. If the Replit Live workflow is suspended, stopped, or its process exits, the tunnel disconnects. The DNS record remains, but `ytloop.online` will no longer reach the app. Keeping the user's PC on does not keep the Replit development workflow alive.

The project had no active Replit deployment when last checked. For service that stays available after the workspace closes, publish a separate production setup and route the hostname to it. Continuous FFmpeg streaming needs an always-on server; a process crash/restart can still interrupt a broadcast, and the current in-memory stream state does not automatically resume it. Confirm the desired hosting plan and any additional usage charges before changing production or DNS.