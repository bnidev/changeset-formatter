import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli/index.ts', 'src/changelog.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  clean: true,
  dts: true,
  exports: 'named',
  deps: {
    neverBundle: ['cosmiconfig', '@changesets/types']
  }
})
