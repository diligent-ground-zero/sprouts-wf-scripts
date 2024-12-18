import { defineConfig } from 'vite';
import esLintPlugin from 'vite-plugin-eslint';
import { resolve } from 'path';

export default defineConfig({
  plugins: [esLintPlugin({ cache: false })],
  server: {
    host: '0.0.0.0',
    cors: '*',
    port: '3000',
    strictPort: true,
  },
  build: {
    minify: true,
    manifest: false,
    assetsDir: '',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/scripts/main.js'),
      },
      preserveEntrySignatures: 'exports-only',
      external: ['jquery'],
    },
  },
  publicDir: 'src/assets',
});
