import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [ '**/node_modules/**', '**/index.ts' ],
    },
    globals: true,
    restoreMocks: true,
    setupFiles: [ 'dotenv/config' ], // Load .env file
    hookTimeout: 30000, // For db container wait period
  },
  plugins: [ tsconfigPaths() ],
});
