import { RollupOptions } from 'rollup';

import path from 'path';

import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

const rollupConfig: RollupOptions = {
  input: {
    main: path.resolve(__dirname, 'index.html'),
    notFound: path.resolve(__dirname, 'index.html'),
  },
  output: {
    dir: 'dist',
    entryFileNames: 'js/index.js',
    chunkFileNames: 'js/chunks/[name].[hash].js',
    assetFileNames: 'js/assets/[name].[hash].[ext]',
    format: 'esm',
    manualChunks: {
      vendor: ['react', 'react-dom', 'react-router-dom'],
    },
  },
  plugins: [resolve(), typescript({ tsconfig: './tsconfig.json' })],
};

export default rollupConfig;
