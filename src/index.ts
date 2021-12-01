/* eslint-disable @typescript-eslint/no-var-requires */

import type { Hooks, Project } from '@yarnpkg/core';

module.exports = {
  name: 'plugin-auto-install',
  factory: () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const child_process = require('child_process');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');

    function calcPackageHash(project: Project): string | void {
      try {
        const packageAndLockFiles: string[] = [path.join(project.cwd, 'yarn.lock')];
        for (const workspace of project.workspaces) {
          packageAndLockFiles.push(path.join(workspace.cwd, 'package.json'));
        }
        packageAndLockFiles.sort();

        const hash = crypto.createHash('sha256');
        for (const file of packageAndLockFiles) {
          const stat = fs.statSync(file, { throwIfNoEntry: false });
          if (!stat) continue;
          hash.update(stat.mtimeMs.toString());
        }
        return hash.digest('hex');
      } catch (_) {
        // do nothing
      }
    }

    function readPackageHash(project: Project): string {
      const hashDir = getHashDirPath(project);
      return fs.readFileSync(path.join(hashDir, 'hash'), 'utf-8');
    }

    function writePackageHash(hash: string, project: Project): void {
      const hashDir = getHashDirPath(project);
      fs.mkdirSync(hashDir, { recursive: true });
      fs.writeFileSync(path.join(hashDir, 'hash'), hash);
      fs.writeFileSync(path.join(hashDir, '.gitignore'), 'hash');
      console.info(`plugin-auto-install updated hash: ${hash}`);
    }

    function getHashDirPath(project: Project): string {
      return path.join(project.cwd, '.yarn', 'plugins', 'plugin-auto-install');
    }

    const hooks: Hooks = {
      afterAllInstalled(project) {
        try {
          const hash = calcPackageHash(project);
          if (hash) writePackageHash(hash, project);
        } catch (_) {
          // do nothing
        }
      },
      async wrapScriptExecution(executor, project): Promise<() => Promise<number>> {
        try {
          const hash = calcPackageHash(project);
          try {
            if (hash && hash === readPackageHash(project)) return executor;
          } catch (_) {
            // do nothing
          }
          console.info('plugin-auto-install detects changes in package.json and/or yarn.lock.');
          if (hash) writePackageHash(hash, project);
          child_process.spawnSync('yarn', ['install'], { env: process.env, stdio: 'inherit' });
        } catch (_) {
          // do nothing
        }
        return executor;
      },
    };
    return { hooks };
  },
};
