import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { logger } from "./logger";

const DEFAULT_PORT = 4416;
let providerProcess: ChildProcess | undefined;

export const bgutilPotPort = Number(process.env.BGUTIL_POT_PORT || DEFAULT_PORT);

export function bgutilPotBaseUrl(): string {
  return `http://127.0.0.1:${bgutilPotPort}`;
}

export function bgutilPluginDir(): string | undefined {
  const candidates = [
    path.resolve(process.cwd(), "artifacts/api-server/vendor"),
    path.resolve(process.cwd(), "vendor"),
    path.resolve(import.meta.dirname, "../vendor"),
  ];
  return candidates.find((candidate) =>
    existsSync(path.join(candidate, "bgutil-ytdlp-plugin", "yt_dlp_plugins")),
  );
}

function providerEntry(): string | undefined {
  const candidates = [
    path.resolve(import.meta.dirname, "bgutil-pot-provider/main.js"),
    path.resolve(process.cwd(), "artifacts/api-server/dist/bgutil-pot-provider/main.js"),
  ];
  return candidates.find((candidate) => existsSync(candidate));
}

export function startBgutilPotProvider(): void {
  if (process.env.BGUTIL_POT_PROVIDER === "off" || providerProcess) return;

  const entry = providerEntry();
  if (!entry) {
    logger.warn("BgUtils POT provider build was not found; continuing without PO-token support");
    return;
  }

  providerProcess = spawn(
    process.execPath,
    [entry, "--port", String(bgutilPotPort), "--host", "127.0.0.1"],
    {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  providerProcess.stdout?.on("data", (chunk: Buffer) => {
    const message = chunk.toString().trim();
    if (message) logger.info({ component: "bgutil-pot-provider" }, message);
  });
  providerProcess.stderr?.on("data", (chunk: Buffer) => {
    const message = chunk.toString().trim();
    if (message) logger.warn({ component: "bgutil-pot-provider" }, message);
  });
  providerProcess.once("error", (error) => {
    logger.warn({ err: error }, "BgUtils POT provider could not start; yt-dlp will continue without it");
    providerProcess = undefined;
  });
  providerProcess.once("exit", (code, signal) => {
    if (code !== 0 && signal !== "SIGTERM") {
      logger.warn({ code, signal }, "BgUtils POT provider stopped; yt-dlp will continue without it");
    }
    providerProcess = undefined;
  });

  const stop = () => {
    providerProcess?.kill("SIGTERM");
    providerProcess = undefined;
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  process.once("exit", stop);
}