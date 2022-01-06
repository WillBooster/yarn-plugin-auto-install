/* eslint-disable @typescript-eslint/no-var-requires */

import type { Hooks, Project } from '@yarnpkg/core';

let installing = false;
let lastHash = '';

module.exports = {
  name: 'plugin-auto-install',
  factory: (require: any) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const child_process = require('child_process');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');

    const hooks: Hooks = {
      validateProject() {
        installing = true;
      },
      afterAllInstalled(project) {
        installing = false;
        try {
          const hash = calcPackageHash(project);
          writePackageHash(hash, project);
        } catch (_) {
          // do nothing
        }
      },
      async wrapScriptExecution(executor, project, locator, scriptName, extra): Promise<() => Promise<number>> {
        if (installing) return executor;

        try {
          const hash = calcPackageHash(project);
          try {
            if (hash && hash === readPackageHash(project)) return executor;
          } catch (_) {
            // do nothing
          }
          // Update hash to avoid a infinite loop
          if (!writePackageHash(hash, project)) return executor;
          console.info(`plugin-auto-install is running 'yarn install' due to dependency changes.`);
          child_process.spawnSync('yarn', ['install'], { cwd: extra.cwd, env: extra.env });
          console.info(`plugin-auto-install finished 'yarn install'.`);
          const ret = child_process.spawnSync('yarn', [scriptName, ...extra.args], {
            cwd: extra.cwd,
            env: extra.env,
            stdio: 'inherit',
            shell: true, // Required to avoid the tsc error (TS6231)
          });
          return async () => ret.status || 0;
        } catch (_) {
          // do nothing
        }
        return executor;
      },
    };

    function calcPackageHash(project: Project): string | undefined {
      try {
        const hash = crypto.createHash('sha256');
        const yarnLockFile = path.join(project.cwd, 'yarn.lock');
        const stat = fs.statSync(yarnLockFile, { throwIfNoEntry: false });
        if (stat) {
          hash.update(fs.readFileSync(yarnLockFile, 'utf-8'));
        }

        for (const workspacePath of project.workspaces.map((w) => w.cwd).sort()) {
          const packageJsonFile = path.join(workspacePath, 'package.json');
          const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf-8'));
          const depsKeys = Object.keys(packageJson).filter((key) => key.endsWith('ependencies'));
          const deps: string[] = [];
          for (const key of depsKeys) {
            deps.push(...Object.entries(packageJson[key]).map(([name, ver]) => `${name}: ${ver}`));
          }
          hash.update(deps.sort().join(','));
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

    function writePackageHash(hash: string | undefined, project: Project): boolean {
      if (!hash || hash === lastHash) return false;

      const hashDir = getHashDirPath(project);
      fs.mkdirSync(hashDir, { recursive: true });
      fs.writeFileSync(path.join(hashDir, 'hash'), hash);
      fs.writeFileSync(path.join(hashDir, '.gitignore'), '.gitignore\nhash');
      console.info(`plugin-auto-install updated dependency hash: ${hash}`);
      lastHash = hash;
      return true;
    }

    function getHashDirPath(project: Project): string {
      return path.join(project.cwd, '.yarn', 'plugins', 'plugin-auto-install');
    }
    return { hooks };
  },
};
