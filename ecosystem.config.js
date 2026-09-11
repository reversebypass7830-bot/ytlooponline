const path = require("node:path");

const projectRoot = process.env.R_LOOP_ROOT || __dirname;
const frontendDist =
  process.env.FRONTEND_DIST ||
  path.join(projectRoot, "artifacts", "live", "dist", "public");
const productionEnv = {
  NODE_ENV: "production",
  PORT: process.env.PORT || "8080",
  FRONTEND_DIST: frontendDist,
};

module.exports = {
  apps: [
    {
      name: "r-loop-api",
      cwd: projectRoot,
      script: "pnpm",
      args: "--filter @workspace/api-server run start",
      interpreter: "none",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 5000,
      exp_backoff_restart_delay: 100,
      min_uptime: "10s",
      max_restarts: 20,
      max_memory_restart: "2G",
      kill_timeout: 10000,
      listen_timeout: 10000,
      shutdown_with_message: true,
      time: true,
      merge_logs: true,
      env: productionEnv,
      env_production: productionEnv,
    },
  ],
};