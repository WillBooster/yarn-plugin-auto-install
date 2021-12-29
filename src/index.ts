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
        const hash = crypto.createHash('sha256');
        const stat = fs.statSync(path.join(project.cwd, 'yarn.lock'), { throwIfNoEntry: false });
        if (stat) {
          hash.update(stat.mtimeMs.toString());
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
      async wrapScriptExecution(executor, project, locator, scriptName, extra): Promise<() => Promise<number>> {
        try {
          const hash = calcPackageHash(project);
          try {
            if (hash && hash === readPackageHash(project)) return executor;
          } catch (_) {
            // do nothing
          }
          console.info('plugin-auto-install detects changes in package.json and/or yarn.lock.');
          // Update hash to avoid a infinite loop
          if (hash) writePackageHash(hash, project);
          child_process.spawnSync('yarn', ['install'], { cwd: extra.cwd, env: extra.env });
          const ret = child_process.spawnSync('yarn', [scriptName, extra.args], {
            cwd: extra.cwd,
            env: extra.env,
            stdio: 'inherit',
            shell: 'true', // Required to avoid the tsc error (TS6231)
          });
          return () => ret.status || 0;
        } catch (_) {
          // do nothing
        }
        return executor;
      },
    };
    return { hooks };
  },
};
