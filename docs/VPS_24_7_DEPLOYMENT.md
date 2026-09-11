# R Loop Bypass: VPS 24/7 deployment

This runbook runs the API and its FFmpeg publisher/renderer on a remote VPS.
The browser is only a control surface. Closing the browser does not call
`/api/stream/stop`, so an already-running stream continues on the VPS.

## 1. VPS packages

The current project is tested with Node.js 24, pnpm 10.26.1, and an FFmpeg
build that provides `libx264`, native AAC, `image2pipe`, and MPEG-TS/FLV/HLS
muxers.

On Ubuntu/Debian:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git nginx ffmpeg

curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

corepack enable
corepack prepare pnpm@10.26.1 --activate
```

Verify the binary before starting the service:

```bash
node --version
pnpm --version
ffmpeg -hide_banner -version
ffmpeg -hide_banner -encoders | grep -E 'libx264|aac'
ffmpeg -hide_banner -formats | grep -E 'mpegts|flv|hls'
```

The application calls `ffmpeg` from `PATH`, so do not rely only on the
`ffmpeg-static` npm package being installed.

## 2. Build the frontend and API

Example deployment directory:

```bash
sudo mkdir -p /var/www/r-loop-bypass
sudo chown "$USER":"$USER" /var/www/r-loop-bypass
git clone <repository-url> /var/www/r-loop-bypass
cd /var/www/r-loop-bypass

pnpm install --frozen-lockfile
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/live run build
pnpm --filter @workspace/api-server run build
```

Create `/var/www/r-loop-bypass/.env` with the runtime values required by the
API. Keep this file owned by the service user and mode `600`; never commit
stream keys or database credentials.

The PM2 config sets `FRONTEND_DIST` to the built Vite output as a fallback for
direct API access. Nginx serves the compiled control room directly from
`artifacts/live/dist/public` and forwards `/api/*` to the API process.

## 3. Run with PM2

Install PM2 once on the VPS and start the checked-in ecosystem file:

```bash
sudo npm install --global pm2
cd /var/www/r-loop-bypass
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` as root, then verify:

```bash
pm2 status
pm2 logs r-loop-api --lines 100
curl -fsS http://127.0.0.1:8080/api/healthz
```

After a release:

```bash
cd /var/www/r-loop-bypass
git pull --ff-only
pnpm install --frozen-lockfile
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/live run build
pnpm --filter @workspace/api-server run build
pm2 reload ecosystem.config.js --update-env
```

## 4. Nginx

Copy `deploy/vps/nginx.conf` into the enabled-site configuration and replace
`your-domain.example`:

```bash
sudo cp deploy/vps/nginx.conf /etc/nginx/sites-available/r-loop-bypass
sudo ln -s /etc/nginx/sites-available/r-loop-bypass /etc/nginx/sites-enabled/r-loop-bypass
sudo nginx -t
sudo systemctl reload nginx
```

The `/api/` route deliberately disables request and response buffering. This
is required for the long-lived webcam PNG and microphone PCM uploads. Nginx
allows media uploads up to 1 GB, while the API applies its own upload
validation. The upgrade headers are included for a future WebSocket/SSE
endpoint.

The current repository does **not** expose a WebSocket or SSE route. Frontend
updates currently use the HTTP `POST /api/stream/update` endpoint, so the Nginx
upgrade headers are compatibility preparation rather than an active realtime
bus.

## 5. Renderer handoff behavior

`stream-runner.ts` owns the FFmpeg processes independently of the HTTP request:

1. The publisher starts once and receives MPEG-TS through a persistent
   `PassThrough`.
2. A playlist, overlay, coordinate, or live webcam update marks a renderer
   handoff.
3. A new renderer is started with the new inputs.
4. The new renderer output is piped to the existing publisher bridge.
5. The old renderer is terminated after its output is detached.
6. Publisher input is never ended by a renderer exit.

The ingest URL cannot be changed while a channel is live. Stop and start the
channel when changing the destination; otherwise the publisher connection is
kept intact.

## 6. Browser disconnect versus API restart

Closing the control-room browser does not stop the in-memory runner. PM2 keeps
the API process alive if it crashes, but PM2 alone cannot reconstruct an active
stream after the API process itself is restarted: the current runner registry
is intentionally in memory and contains the destination URL.

Do not add a plaintext stream-key recovery file. If process-restart recovery is
required, the next step must be a durable, access-controlled stream-session
store that references server-side credentials without exposing them to the
browser. Until that is implemented, use `pm2 reload` only during a planned
stop/restart window for active channels.

## 7. Operational checks

```bash
# Check the API and process manager
curl -fsS https://your-domain.example/api/healthz
pm2 status

# Check that the required encoders remain available after an OS update
ffmpeg -hide_banner -encoders | grep -E 'libx264|aac'

# Check Nginx and recent application output
sudo nginx -t
pm2 logs r-loop-api --lines 200
```