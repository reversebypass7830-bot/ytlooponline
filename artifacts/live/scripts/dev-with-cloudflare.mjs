import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const workspaceDirectory = path.resolve(projectDirectory, '..', '..');
const linkFile = path.join(workspaceDirectory, 'cloudflare.txt');
const port = Number(process.env.PORT || 26180);
const basePath = process.env.BASE_PATH || '/';
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const environment = {
  ...process.env,
  PORT: String(port),
  BASE_PATH: basePath,
};

let shuttingDown = false;

async function writeLinkFile(contents) {
  await fs.writeFile(linkFile, `${contents.trim()}\n`, 'utf8');
}

function stopProcesses(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  tunnel.kill('SIGTERM');
  vite.kill('SIGTERM');
  setTimeout(() => process.exit(exitCode), 300);
}

await writeLinkFile(
  'Cloudflare Tunnel is starting. The public URL will appear here shortly.',
);

const vite = spawn(
  command,
  ['exec', 'vite', '--config', 'vite.config.ts', '--host', '0.0.0.0'],
  {
    cwd: projectDirectory,
    env: environment,
    stdio: 'inherit',
  },
);

const tunnel = spawn(
  'cloudflared',
  [
    'tunnel',
    '--url',
    `http://127.0.0.1:${port}`,
    '--no-autoupdate',
  ],
  {
    cwd: projectDirectory,
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

function handleTunnelOutput(chunk) {
  const output = chunk.toString();
  process.stdout.write(`[cloudflare] ${output}`);

  const url = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i)?.[0];
  if (url) {
    writeLinkFile(url).catch((error) => {
      console.error(`Could not write ${linkFile}:`, error);
    });
    console.log(`Cloudflare Tunnel URL saved to ${linkFile}: ${url}`);
  }
}

tunnel.stdout.on('data', handleTunnelOutput);
tunnel.stderr.on('data', handleTunnelOutput);

tunnel.on('error', async (error) => {
  await writeLinkFile(
    `Cloudflare Tunnel could not start: ${error.message}. Make sure cloudflared is installed.`,
  );
  console.error('Cloudflare Tunnel could not start:', error);
  stopProcesses(1);
});

vite.on('error', (error) => {
  console.error('Vite could not start:', error);
  stopProcesses(1);
});

vite.on('exit', (code) => {
  if (!shuttingDown) {
    console.error(`Vite stopped unexpectedly with exit code ${code ?? 1}.`);
    stopProcesses(code ?? 1);
  }
});

tunnel.on('exit', async (code) => {
  if (!shuttingDown) {
    await writeLinkFile(
      `Cloudflare Tunnel stopped unexpectedly (exit code ${code ?? 1}).`,
    );
    console.error(
      `Cloudflare Tunnel stopped unexpectedly with exit code ${code ?? 1}.`,
    );
    stopProcesses(code ?? 1);
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stopProcesses(0));
}