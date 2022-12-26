const cp = require('child_process');
const version = cp.execSync('npm show yarn-plugin-auto-install version').toString().trim();
const command = `yarn plugin import https://github.com/WillBooster/yarn-plugin-auto-install/releases/download/v${version}/index.min.cjs`;
console.info(`$ ${command}`);
cp.spawnSync(command, { shell: true, stdio: 'inherit' });
