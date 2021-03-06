/* eslint-disable @typescript-eslint/no-var-requires */

import type { Hooks, Project } from '@yarnpkg/core';

module.exports = {
  name: 'plugin-auto-install',
  factory: (require: any) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const child_process = require('child_process');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');

    const prefix = `plugin-auto-install v${process.env.VERSION}`;
    let installing = false;
    let lastHash = '';

    const hooks: Hooks = {
      validateProject(project: Project) {
        installing = true;
        const hash = calcPackageHash(project);
        if (hash && hash === readPackageHash(project)) return;

        writePackageHash(hash, project);
      },
      afterAllInstalled(project) {
        installing = false;
        const hash = calcPackageHash(project);
        if (hash && hash === readPackageHash(project)) return;

        writePackageHash(hash, project);
      },
      async wrapScriptExecution(executor, project, locator, scriptName, extra): Promise<() => Promise<number>> {
        if (installing) return executor;

        try {
          const hash = calcPackageHash(project);
          if (hash && hash === readPackageHash(project)) return executor;

          // Update hash to avoid a infinite loop
          if (!writePackageHash(hash, project)) return executor;
          console.info(`${prefix} is running 'yarn install' due to dependency changes.`);
          child_process.spawnSync('yarn', ['install'], { cwd: extra.cwd, env: extra.env });
          console.info(`${prefix} finished 'yarn install'.`);
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

    function readPackageHash(project: Project): string | undefined {
      try {
        const hashDir = getHashDirPath(project);
        return fs.readFileSync(path.join(hashDir, 'hash'), 'utf-8');
      } catch (_) {
        // do nothing
      }
    }

    function writePackageHash(hash: string | undefined, project: Project): boolean {
      if (!hash || hash === lastHash) return false;

      try {
        const hashDir = getHashDirPath(project);
        fs.mkdirSync(hashDir, { recursive: true });
        fs.writeFileSync(path.join(hashDir, 'hash'), hash);
        fs.writeFileSync(path.join(hashDir, '.gitignore'), '.gitignore\nhash');
        console.info(`${prefix} updated dependency hash: ${hash}`);
        lastHash = hash;
      } catch (_) {
        // do nothing
      }
      return true;
    }

    function getHashDirPath(project: Project): string {
      return path.join(project.cwd, '.yarn', 'plugins', 'plugin-auto-install');
    }
    return { hooks };
  },
};
