const { build } = require('esbuild');

const define = {};
const varNames = ['VERSION'];
for (const name of varNames) {
  define[`process.env.${name}`] = JSON.stringify(process.env[name]);
}

build({
  bundle: true,
  define,
  entryPoints: ['src/index.ts'],
  format: 'cjs',
  minify: true,
  outfile: 'dist/index.cjs',
  platform: 'node',
  sourcemap: true,
  target: 'node14',
}).catch(() => process.exit(1));
