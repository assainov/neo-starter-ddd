import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(__dirname, './.env.test')
});

export default defineConfig({
  test: {
    coverage: {
      exclude: [ '**/node_modules/**', '**/index.ts' ],
    },
    globals: true,
    restoreMocks: true,
    env: process.env
  },
  plugins: [ tsconfigPaths() ],
});
