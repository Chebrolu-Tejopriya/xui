/**
 * Library build — produces the publishable package in dist/.
 *
 * Kept separate from vite.config.ts so the app/Storybook setup and the
 * distributable stay independent: neither can quietly break the other.
 *
 *   npm run build:lib
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Don't copy public/ into the package — favicon.svg and friends are the
  // demo app's, not the library's.
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    // One stylesheet for the whole system — tokens plus every component's
    // CSS module. Consumers import it once.
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'xui.js',
    },
    rollupOptions: {
      // React is the consumer's, never ours — two copies breaks hooks.
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: {
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'xui.css' : '[name][extname]'),
      },
    },
  },
});
