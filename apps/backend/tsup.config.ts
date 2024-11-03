import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts", "!src/**/__tests__/**", "!src/**/*.test.*"],
  splitting: false,
  clean: true,
  sourcemap: true,
  ...options,
}));