import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

const filename = !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`;

dotenv.config({
  path: path.resolve(__dirname, `./${filename}`)
});

export default defineConfig({
  test: {
    include: [ 'tests/**/*.test.ts', 'tests/**/*.spec.ts' ],
    exclude: [ '**/node_modules/**', '**/index.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts', ],
    globals: true,
    restoreMocks: true,
    env: process.env,
    fileParallelism: false,
    hookTimeout: 60000, // For db container wait period
  },
  plugins: [ tsconfigPaths() ],
});
