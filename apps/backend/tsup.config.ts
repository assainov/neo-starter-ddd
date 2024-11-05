import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entryPoints: [ 'src/__server/entry.ts', '!src/**/__tests__/**', '!src/**/*.test.*' ],
  splitting: false,
  clean: true,
  sourcemap: true,
  ...options,
}));