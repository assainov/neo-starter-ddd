import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: {
    '_server/entry': 'src/_server/entry.ts',
  },
  noExternal: [ /^@neo\// ], // bundle all neo packages inside the output
  splitting: false,
  clean: true,
  sourcemap: true,
  ...options,
}));