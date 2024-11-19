import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

const getFilename = () => {
  const env = process.env.NODE_ENV;

  if (!env || env === 'development') {
    return '.env';
  }

  return `.env.${env}`;
};

dotenv.config({
  path: path.resolve(__dirname, `./${getFilename()}`)
});

export default defineConfig({
  test: {
    coverage: {
      exclude: [ '**/node_modules/**', '**/index.ts' ],
    },
    globals: true,
    restoreMocks: true,
    env: process.env,
    hookTimeout: 60000, // For db container wait period
  },
  plugins: [ tsconfigPaths() ],
});
