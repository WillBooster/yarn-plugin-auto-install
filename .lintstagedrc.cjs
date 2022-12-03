const micromatch = require('micromatch');

module.exports = {
  './{__tests__,scripts,src}/**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}': ['eslint --fix', 'prettier --cache --write'],
  './**/*.{cjs,css,cts,htm,html,js,json,json5,jsx,md,mjs,mts,scss,ts,tsx,vue,yaml,yml}': (files) => {
    files = micromatch.not(files, './{__tests__,scripts,src}/**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}');
    const filteredFiles = files.filter((file) => !file.includes('/test-fixtures/') && !file.includes('/packages/'));
    if (filteredFiles.length === 0) return [];
    const commands = [`prettier --cache --write ${filteredFiles.join(' ')}`];
    if (filteredFiles.some((file) => file.endsWith('package.json'))) {
      commands.push('yarn sort-package-json');
    }
    return commands;
  },
};
