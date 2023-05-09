import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@my_framework': path.resolve(__dirname, './src/lib/my_framework'),
    }
  }
});
