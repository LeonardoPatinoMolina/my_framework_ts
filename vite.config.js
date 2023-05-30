import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base:'./',
  resolve: {
    alias: {
      '@my_framework': path.resolve(__dirname, './src/lib/my_framework'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'public',
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server:{
    host: true
  }
});