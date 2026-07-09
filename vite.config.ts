import { defineConfig, PluginOption, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import Restart from 'vite-plugin-restart';

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

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const env = loadEnv(mode, process.cwd(), '');

  let packages: string[] = [];
  let localPackages: Record<string, string> = {};

  if (isDev) {
    console.log("Running in Development Mode.....")
    const isDockerContainer = process.env.RUNNING_IN_DOCKER;

    let packagesRoot = null;

    if (isDockerContainer) {
      console.log("Running inside Docker container.....")
      packagesRoot = './Packages';
    } else {
      console.log("Running outside Docker container.....")
      packagesRoot = env.PACKAGES_DIR || null;
    }

    if (!packagesRoot) {
      console.warn('PACKAGES_DIR environment variable is not set. Local packages will not be resolved.');
    }

    const uiux = packagesRoot ? path.resolve(packagesRoot, 'ui-ux/src/index.ts') : null;
    const communications = packagesRoot ? path.resolve(packagesRoot, 'communications/src/index.ts') : null;
    const gateway = packagesRoot ? path.resolve(packagesRoot, 'gateway/src/index.ts') : null;
    const gitport = packagesRoot ? path.resolve(packagesRoot, 'portfolio/src/index.ts') : null;
    const types = packagesRoot ? path.resolve(packagesRoot, 'types/src/index.ts') : null;

    packages = [uiux, communications, gateway, gitport, types].filter(Boolean) as string[];

    localPackages = {
      ...(uiux && { '@the7ofdiamonds/ui-ux': uiux }),
      ...(communications && { '@the7ofdiamonds/communications': communications }),
      ...(gateway && { '@the7ofdiamonds/gateway': gateway }),
      ...(gitport && { '@the7ofdiamonds/portfolio': gitport }),
    };
  }

  return {
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        ...(isDev ? localPackages : {}),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      preserveSymlinks: true,
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    plugins: [
      react(),
      gulp(),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'jamelclyons.dev',
        'dev-founder.jclyonsenterprises.com',
        'staging-founder.jclyonsenterprises.com'
      ],
      cors: true,
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
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/chunks/[name].[hash].js',
          assetFileNames: 'js/assets/[name].[hash].[ext]',
        },
      }
    }
  }
});
