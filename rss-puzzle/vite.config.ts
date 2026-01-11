import { defineConfig } from 'vite';

// eslint-disable-next-line import-x/no-default-export
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/RSS-PUZZLE/' : '/',
  build: {
    outDir: 'dist',
  },
}));