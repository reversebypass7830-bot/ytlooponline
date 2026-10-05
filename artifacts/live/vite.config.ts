import path from 'path';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
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
  ['/transactions', '/sign-in.html'],
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

function readImageDimensions(mime: string, data: Buffer): { width: number; height: number } | undefined {
  if (mime === 'webp' && data.toString('ascii', 12, 16) === 'VP8X' && data.length >= 30) {
    return { width: data.readUIntLE(24, 3) + 1, height: data.readUIntLE(27, 3) + 1 };
  }
  if (mime === 'webp' && data.toString('ascii', 12, 16) === 'VP8L' && data.length >= 25) {
    return {
      width: 1 + data[21] + ((data[22] & 0x3f) << 8),
      height: 1 + ((data[22] >> 6) & 0x03) + (data[23] << 2) + ((data[24] & 0x0f) << 10),
    };
  }
  if (mime === 'webp' && data.length >= 30) {
    const frameStart = data.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (frameStart >= 0 && frameStart + 7 < data.length) {
      return {
        width: data.readUInt16LE(frameStart + 3) & 0x3fff,
        height: data.readUInt16LE(frameStart + 5) & 0x3fff,
      };
    }
  }
  if (mime === 'jpeg') {
    const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    let offset = 2;
    while (offset + 8 < data.length) {
      if (data[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = data[offset + 1];
      offset += 2;
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > data.length) break;
      const segmentLength = data.readUInt16BE(offset);
      if (segmentLength < 2 || offset + segmentLength > data.length) break;
      if (startOfFrameMarkers.has(marker) && segmentLength >= 7) {
        return { height: data.readUInt16BE(offset + 3), width: data.readUInt16BE(offset + 5) };
      }
      offset += segmentLength;
    }
  }
  return undefined;
}

function externalizeLandingImages(): Plugin {
  let root = '';
  let publicDir = '';
  let base = '/';
  const imageSources = new Map<string, { fileName: string; contents: Buffer; dimensions?: { width: number; height: number } }>();

  return {
    name: 'externalize-landing-images',
    async configResolved(config) {
      root = config.root;
      publicDir = config.publicDir;
      base = config.base.endsWith('/') ? config.base : `${config.base}/`;

      const html = await readFile(path.resolve(root, 'index.html'), 'utf8');
      const imagePattern = /data:image\/(jpeg|webp);base64,([A-Za-z0-9+/=]+)/g;
      for (const match of html.matchAll(imagePattern)) {
        const extension = match[1] === 'jpeg' ? 'jpg' : 'webp';
        const contents = Buffer.from(match[2], 'base64');
        const fileName = `${createHash('sha256').update(contents).digest('hex').slice(0, 16)}.${extension}`;
        imageSources.set(match[0], { fileName, contents, dimensions: readImageDimensions(match[1], contents) });
      }

      const imageDir = path.resolve(publicDir, 'landing-media');
      await mkdir(imageDir, { recursive: true });
      await Promise.all([...imageSources.values()].map(async ({ fileName, contents }) => {
        const filePath = path.resolve(imageDir, fileName);
        try {
          await access(filePath);
        } catch {
          await writeFile(filePath, contents);
        }
      }));
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        if (path.resolve(context.filename) !== path.resolve(root, 'index.html')) return html;
        return html.replace(
          /(<img\b[^>]*?)src="data:image\/(jpeg|webp);base64,([A-Za-z0-9+/=]+)"([^>]*>)/g,
          (_tag, before: string, mime: string, payload: string, after: string) => {
            const contents = Buffer.from(payload, 'base64');
            const extension = mime === 'jpeg' ? 'jpg' : 'webp';
            const fileName = `${createHash('sha256').update(contents).digest('hex').slice(0, 16)}.${extension}`;
            const source = `${base}landing-media/${fileName}`;
            const sourceData = imageSources.get(`data:image/${mime};base64,${payload}`);
            const dimensions = sourceData?.dimensions ?? readImageDimensions(mime, contents);
            let attributes = after;
            if (!/\sloading=/.test(attributes)) attributes = ` loading="lazy"${attributes}`;
            if (!/\sdecoding=/.test(attributes)) attributes = ` decoding="async"${attributes}`;
            const sizeAttributes = dimensions && !/\swidth=/.test(attributes) && !/\sheight=/.test(attributes)
              ? ` width="${dimensions.width}" height="${dimensions.height}"`
              : '';
            return `${before}src="${source}"${sizeAttributes}${attributes}`;
          },
        );
      },
    },
  };
}

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
    externalizeLandingImages(),
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
