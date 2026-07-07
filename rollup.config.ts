const rollupConfig = {
  output: {
    dir: 'dist',
    entryFileNames: 'js/[name].js',
    chunkFileNames: 'js/chunks/[name].[hash].js',
    assetFileNames: 'js/assets/[name].[hash].[ext]',
    format: 'esm'
  }
};

export default rollupConfig;
