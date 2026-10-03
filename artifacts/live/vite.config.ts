import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);
const apiPort = Number(process.env.API_PORT || 8080);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

const controlRoomEntries = new Map([
  ['/feedback', '/sign-in.html'],
  ['/dashboard', '/sign-in.html'],
  ['/analytics', '/sign-in.html'],
  ['/aesthetics', '/sign-in.html'],
  ['/live', '/sign-in.html'],
  ['/live-preview', '/sign-in.html'],
  ['/videos', '/sign-in.html'],
  ['/editor', '/sign-in.html'],
  ['/subscription', '/sign-in.html'],
  ['/profile', '/sign-in.html'],
  ['/settings', '/sign-in.html'],
  ['/sign-in', '/sign-in.html'],
  ['/sign-up', '/sign-in.html'],
  ['/pricing', '/sign-in.html'],
  ['/gateway', '/sign-in.html'],
  ['/access', '/sign-in.html'],
  ['/owner', '/owner.html'],
]);

const controlRoomRouteFallback: Plugin = {
  name: 'control-room-route-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
        next();
        return;
      }

      const queryIndex = req.url.indexOf('?');
      const pathname = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
      const entry = controlRoomEntries.get(pathname)
        ?? (pathname.startsWith('/feedback/') ? '/sign-in.html' : undefined);
      if (entry) {
        const query = queryIndex === -1 ? '' : req.url.slice(queryIndex);
        req.url = `${entry}${query}`;
      }

      next();
    });
  },
};

const firebasePublicConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
};

export default defineConfig({
  base: basePath,
  define: {
    "import.meta.env.VITE_FIREBASE_API_KEY": JSON.stringify(firebasePublicConfig.apiKey),
    "import.meta.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(firebasePublicConfig.authDomain),
    "import.meta.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(firebasePublicConfig.projectId),
    "import.meta.env.VITE_FIREBASE_APP_ID": JSON.stringify(firebasePublicConfig.appId),
  },
  plugins: [
    controlRoomRouteFallback,
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
      'styled-components': path.resolve(
        import.meta.dirname,
        'src',
        'shims',
        'styled-components.tsx',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        landing: path.resolve(import.meta.dirname, 'index.html'),
        app: path.resolve(import.meta.dirname, 'sign-in.html'),
        owner: path.resolve(import.meta.dirname, 'owner.html'),
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
