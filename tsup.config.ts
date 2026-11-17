import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/react/index.ts' },
  outDir: 'dist/react',
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react/jsx-runtime'],
  target: 'es2022',
});
