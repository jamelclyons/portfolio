import { defineConfig, PluginOption, loadEnv } from 'vite';

import react from '@vitejs/plugin-react';

import path from 'path';

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
    const locations = packagesRoot ? path.resolve(packagesRoot, 'locations/src/index.ts') : null;
    const schedule = packagesRoot ? path.resolve(packagesRoot, 'schedule/src/index.ts') : null;

    packages = [uiux, communications, gateway, gitport, types, locations, schedule].filter(Boolean) as string[];

    localPackages = {
      ...(uiux && { '@the7ofdiamonds/ui-ux': uiux }),
      ...(communications && { '@the7ofdiamonds/communications': communications }),
      ...(gateway && { '@the7ofdiamonds/gateway': gateway }),
      ...(gitport && { '@the7ofdiamonds/portfolio': gitport }),
      ...(locations && { '@the7ofdiamonds/locations': locations }),
      ...(schedule && { '@the7ofdiamonds/schedule': schedule }),
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
