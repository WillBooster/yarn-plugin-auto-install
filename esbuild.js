const { build } = require('esbuild');

build({
  bundle: true,
  entryPoints: ['src/index.ts'],
  format: 'cjs',
  minify: true,
  outfile: 'dist/index.cjs',
  platform: 'node',
  sourcemap: true,
}).catch(() => process.exit(1));
