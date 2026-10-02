import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const workspaceDirectory = path.resolve(projectDirectory, '..', '..');
const linkFile = path.join(workspaceDirectory, 'cloudflare.txt');
const botTokenFile = path.join(workspaceDirectory, 'bottoken.txt');
const tunnelToken = process.env.CLOUDFLARE_TUNNEL_TOKEN?.trim() || '';
const tunnelHostname = process.env.CLOUDFLARE_TUNNEL_HOSTNAME?.trim() || '';
const tunnelPublicUrl = tunnelHostname ? `https://${tunnelHostname}` : '';
const tunnelTokenFile = path.join(
  os.tmpdir(),
  `replit-cloudflare-tunnel-${process.pid}.token`,
);
const port = Number(process.env.PORT || 26180);
const basePath = process.env.BASE_PATH || '/';
const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const environment = {
  ...process.env,
  PORT: String(port),
  BASE_PATH: basePath,
};
delete environment.CLOUDFLARE_TUNNEL_TOKEN;

let shuttingDown = false;
let restarting = false;
let resetInProgress = false;
let tunnelTokenFileReady = false;
let tunnelTokenFileError = '';
let activeUrl = '';
let botToken = '';
let botOffset = 0;
let botPolling = false;
let botAbortController = null;
let vite;
let tunnel;
let tunnelUnavailable = false;
const subscribedChatIds = new Set();
const tunnelUrlWaiters = new Set();

async function writeLinkFile(contents) {
  await fs.writeFile(linkFile, `${contents.trim()}\n`, 'utf8');
}

const botKeyboard = {
  inline_keyboard: [[
    { text: 'Get Link', callback_data: 'get_link' },
    { text: 'Reset', callback_data: 'reset' },
  ]],
};

function currentBotMessage() {
  return [
    'Reverse Bypass by Reverse Bypass',
    '',
    `Active link (realtime): ${activeUrl || (tunnelUnavailable ? 'unavailable' : 'starting...')}`,
    '',
    'Use Get Link to receive the current URL or Reset to restart local host and Cloudflare.',
  ].join('\n');
}

async function telegramRequest(method, body = {}) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: botAbortController?.signal,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok !== true) {
    throw new Error(payload.description || `Telegram ${method} failed.`);
  }
  return payload.result;
}

async function sendCurrentLink(chatId) {
  await telegramRequest('sendMessage', {
    chat_id: chatId,
    text: currentBotMessage(),
    reply_markup: botKeyboard,
    disable_web_page_preview: true,
  });
}

async function publishActiveUrl(url) {
  activeUrl = url;
  tunnelUnavailable = false;
  await writeLinkFile(url);
  console.log(`Cloudflare Tunnel URL saved to ${linkFile}: ${url}`);

  for (const chatId of subscribedChatIds) {
    try {
      await sendCurrentLink(chatId);
    } catch {
      console.log('[bot] Could not update one of the subscribed chats.');
    }
  }

  for (const waiter of tunnelUrlWaiters) {
    waiter.resolve(url);
  }
  tunnelUrlWaiters.clear();
}

async function notifyBotStatus(chatId, text) {
  try {
    await telegramRequest('sendMessage', {
      chat_id: chatId,
      text: `Reverse Bypass by Reverse Bypass\n\n${text}`,
      reply_markup: botKeyboard,
      disable_web_page_preview: true,
    });
  } catch {
    console.log('[bot] Could not send a status update to the bot chat.');
  }
}

function waitForNextTunnelUrl(timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    let timer;
    const waiter = {
      resolve(url) {
        clearTimeout(timer);
        tunnelUrlWaiters.delete(waiter);
        resolve(url);
      },
      reject(error) {
        clearTimeout(timer);
        tunnelUrlWaiters.delete(waiter);
        reject(error);
      },
    };
    timer = setTimeout(
      () => waiter.reject(new Error('Cloudflare Tunnel did not connect in time.')),
      timeoutMs,
    );
    tunnelUrlWaiters.add(waiter);
  });
}

async function restartServices() {
  if (resetInProgress) {
    return activeUrl;
  }

  resetInProgress = true;
  restarting = true;
  activeUrl = '';
  await writeLinkFile('Local host and Cloudflare Tunnel are restarting.');

  const oldTunnel = tunnel;
  const oldVite = vite;
  await Promise.all([stopChild(oldTunnel), stopChild(oldVite)]);
  tunnel = undefined;
  vite = undefined;
  restarting = false;

  const nextUrl = tunnelTokenFileReady && tunnelHostname
    ? waitForNextTunnelUrl()
    : Promise.resolve('');
  startServices();
  try {
    return await nextUrl;
  } finally {
    resetInProgress = false;
  }
}

async function handleBotUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;
  const chatId = message?.chat?.id ?? callback?.message?.chat?.id;
  if (chatId === undefined || chatId === null) return;
  subscribedChatIds.add(chatId);

  if (message) {
    const commandText = message.text?.split(/\s+/)[0]?.toLowerCase().split('@')[0];
    if (commandText === '/start' || commandText === '/getlink' || commandText === '/link') {
      await sendCurrentLink(chatId);
      return;
    }
    if (commandText === '/reset') {
      await notifyBotStatus(chatId, 'Reset requested. Restarting local host and Cloudflare...');
      if (!resetInProgress) {
        try {
          await restartServices();
        } catch {
          await notifyBotStatus(chatId, 'Reset failed. Please try again.');
        }
      }
    }
    return;
  }

  if (callback) {
    try {
      await telegramRequest('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: callback.data === 'reset' ? 'Resetting...' : 'Sending current link...',
      });
    } catch {
      // The original button action can still continue if the acknowledgement expires.
    }

    if (callback.data === 'get_link') {
      await sendCurrentLink(chatId);
      return;
    }
    if (callback.data === 'reset') {
      if (resetInProgress) {
        await notifyBotStatus(chatId, 'A reset is already in progress.');
        return;
      }
      await notifyBotStatus(chatId, 'Reset requested. Restarting local host and Cloudflare...');
      try {
        await restartServices();
      } catch {
        await notifyBotStatus(chatId, 'Reset failed. Please try again.');
      }
    }
  }
}

async function pollBot() {
  if (botPolling) return;
  botPolling = true;
  while (!shuttingDown) {
    try {
      const updates = await telegramRequest('getUpdates', {
        offset: botOffset,
        timeout: 20,
        allowed_updates: ['message', 'callback_query'],
      });
      for (const update of updates || []) {
        botOffset = Math.max(botOffset, update.update_id + 1);
        await handleBotUpdate(update);
      }
    } catch (error) {
      if (!shuttingDown) {
        console.log(`[bot] Polling paused: ${error instanceof Error ? error.message : 'unknown error'}`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
  botPolling = false;
}

async function startBot() {
  try {
    botToken = (await fs.readFile(botTokenFile, 'utf8')).trim();
  } catch {
    console.log('[bot] bottoken.txt was not found; bot controls are disabled.');
    return;
  }

  if (!botToken) {
    console.log('[bot] bottoken.txt is empty; bot controls are disabled.');
    return;
  }

  try {
    botAbortController = new AbortController();
    await telegramRequest('setMyCommands', {
      commands: [
        { command: 'start', description: 'Show the active link' },
        { command: 'getlink', description: 'Get the active link' },
        { command: 'reset', description: 'Restart local host and Cloudflare' },
      ],
    });
    console.log('[bot] Reverse Bypass bot controls are running.');
    void pollBot();
  } catch {
    console.log('[bot] Could not start bot controls; check bottoken.txt.');
  }
}

function stopChild(child) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, 1500);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
    child.kill('SIGTERM');
  });
}

function stopProcesses(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  botAbortController?.abort();
  Promise.all([stopChild(tunnel), stopChild(vite)]).finally(async () => {
    if (tunnelTokenFileReady) {
      await fs.rm(tunnelTokenFile, { force: true }).catch(() => {});
      tunnelTokenFileReady = false;
    }
    process.exit(exitCode);
  });
}

function handleTunnelOutput(chunk) {
  const output = chunk.toString();
  process.stdout.write(`[cloudflare] ${output}`);

  if (
    tunnelPublicUrl &&
    /registered tunnel connection/i.test(output) &&
    tunnelPublicUrl !== activeUrl
  ) {
    publishActiveUrl(tunnelPublicUrl).catch((error) => {
      console.error(`Could not write ${linkFile}:`, error);
    });
  }
}

async function markTunnelUnavailable(message) {
  tunnelUnavailable = true;
  activeUrl = '';
  await writeLinkFile(message);
  for (const waiter of tunnelUrlWaiters) {
    waiter.reject(new Error(message));
  }
  tunnelUrlWaiters.clear();
  console.error(message);
}

function attachProcessHandlers() {
  if (tunnel) {
    tunnel.stdout.on('data', handleTunnelOutput);
    tunnel.stderr.on('data', handleTunnelOutput);

    tunnel.on('error', async (error) => {
      await markTunnelUnavailable(
        `Cloudflare Tunnel could not start: ${error.message}. The local preview remains available.`,
      );
    });

    tunnel.on('exit', async (code) => {
      if (!shuttingDown && !restarting) {
        await markTunnelUnavailable(
          `Cloudflare Tunnel stopped unexpectedly with exit code ${code ?? 1}. The local preview remains available.`,
        );
      }
    });
  }

  vite.on('error', (error) => {
    console.error('Vite could not start:', error);
    if (!restarting) stopProcesses(1);
  });

  vite.on('exit', (code) => {
    if (!shuttingDown && !restarting) {
      console.error(`Vite stopped unexpectedly with exit code ${code ?? 1}.`);
      stopProcesses(code ?? 1);
    }
  });
}

function startServices() {
  vite = spawn(
    command,
    ['exec', 'vite', '--config', 'vite.config.ts', '--host', '0.0.0.0'],
    {
      cwd: projectDirectory,
      env: environment,
      stdio: 'inherit',
    },
  );

  tunnel = undefined;
  if (!tunnelHostname) {
    void markTunnelUnavailable(
      'CLOUDFLARE_TUNNEL_HOSTNAME is not configured. The local preview remains available.',
    );
  } else if (!tunnelToken) {
    void markTunnelUnavailable(
      `CLOUDFLARE_TUNNEL_TOKEN is not configured in Replit Secrets. The local preview remains available; the permanent link will be https://${tunnelHostname}.`,
    );
  } else if (!tunnelTokenFileReady) {
    void markTunnelUnavailable(
      `Cloudflare Tunnel token could not be prepared${tunnelTokenFileError ? `: ${tunnelTokenFileError}` : '.'} The local preview remains available.`,
    );
  } else {
    tunnel = spawn(
      'cloudflared',
      [
        'tunnel',
        '--no-autoupdate',
        'run',
        '--token-file',
        tunnelTokenFile,
      ],
      {
        cwd: projectDirectory,
        env: environment,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    tunnelUnavailable = false;
  }
  attachProcessHandlers();
}

if (tunnelToken) {
  try {
    await fs.writeFile(tunnelTokenFile, `${tunnelToken}\n`, { mode: 0o600 });
    await fs.chmod(tunnelTokenFile, 0o600);
    tunnelTokenFileReady = true;
  } catch (error) {
    tunnelTokenFileError = error instanceof Error ? error.message : 'unknown file error';
  }
}

await writeLinkFile(
  tunnelTokenFileReady && tunnelHostname
    ? `Starting the local host and named Cloudflare Tunnel for ${tunnelHostname}.`
    : 'Starting the local host. The local preview remains available while the named Cloudflare Tunnel is configured.',
);
await startBot();
startServices();

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stopProcesses(0));
}