import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import Restart from 'vite-plugin-restart';

import { exec } from 'child_process';
import path from 'path';

import rollupOptions from './rollup.config';

const gulp = (): PluginOption => {
  return {
    name: 'run-gulp-tasks',
    apply: 'serve',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        return new Promise<void>((resolve) => {
          console.log('Starting Gulp watch...');
          const gulpProcess = exec('gulp watch');

          gulpProcess.stdout?.on('data', (data) => {
            console.log(`[Gulp]: ${data}`);
          });

          gulpProcess.stderr?.on('data', (data) => {
            console.error(`[Gulp Error]: ${data}`);
          });

          gulpProcess.on('close', (code) => {
            if (code !== 0) {
              console.error(`Gulp watch process exited with code ${code}`);
            } else {
              console.log('Gulp watch process completed successfully.');
            }
            resolve();
          });
        });
      });
    },
  };
};

const isDockerContainer = process.env.RUNNING_IN_DOCKER;

if (isDockerContainer) {
  console.log("Running inside Docker container.....")
}

const isDev = process.env.NODE_ENV === 'development';

let packagesRoot = null;

if (isDev) {
  console.log("Running in Development Mode.....")
  packagesRoot = './Packages';
  console.log(`Packages Root: ${packagesRoot}`);
}

const uiux = packagesRoot ? path.resolve(packagesRoot, 'ui-ux/src/index.ts') : null;
const communications = packagesRoot ? path.resolve(packagesRoot, 'communications/src/index.ts') : null;
const gateway = packagesRoot ? path.resolve(packagesRoot, 'gateway/src/index.ts') : null;
const gitport = packagesRoot ? path.resolve(packagesRoot, 'portfolio/src/index.ts') : null;
const types = packagesRoot ? path.resolve(packagesRoot, 'types/src/index.ts') : null;

const packages = [uiux, communications, gateway, gitport, types].filter(Boolean) as string[];

const localPackages: Record<string, string> = {
  ...(uiux && { '@the7ofdiamonds/ui-ux': uiux }),
  ...(communications && { '@the7ofdiamonds/communications': communications }),
  ...(gateway && { '@the7ofdiamonds/gateway': gateway }),
  ...(gitport && { '@the7ofdiamonds/github-portfolio': gitport }),
};

/** @type {import('vite').UserConfig} */
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(isDev ? localPackages : {}),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    preserveSymlinks: true,
  },
  plugins: [
    react(),
    gulp(),
    ...(isDev
      ? [
        Restart({
          restart: Object.values(packages).map((dir) => `${dir}/dist/**`),
        }),
      ]
      : []),
    ,
  ],
  define: {
    'import.meta.env': process.env,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'jamelclyons.local'
    ],
    cors: true,
    open: true,
    fs: {
      allow: [__dirname, ...packages],
    },
    watch: {
      ignored: ['./src/services/firebase/functions'],
      usePolling: true,
      interval: 300,
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    emptyOutDir: false,
    rollupOptions: rollupOptions,
  },
  optimizeDeps: {
    exclude: ['@the7ofdiamonds/schedule']
  }
});
