/* eslint-disable @typescript-eslint/no-var-requires */

import child_process from 'child_process';
import fs from 'fs';
import path from 'path';

import type { Hooks } from '@yarnpkg/core';

module.exports = {
  name: 'plugin-auto-install',
  factory: () => {
    const child_process = require('child_process');
    const crypto = require('crypto');
    const fs = require('fs');
    const path = require('path');
    const { sync } = require('fast-glob');

    function calcPackageHash(): string | void {
      try {
        const packageJsonText = fs.readFileSync('package.json', 'utf-8');
        const packageJson = JSON.parse(packageJsonText);

        let workspaces = packageJson.workspaces || [];
        if (typeof workspaces === 'string') {
          workspaces = [workspaces];
        }
        if (!Array.isArray(workspaces)) return;

        const packageAndLockFiles = ['package.json', 'yarn.lock'];
        for (const workspace of workspaces) {
          packageAndLockFiles.push(...sync(path.join(workspace, 'package.json')));
        }
        packageAndLockFiles.sort();

        const hash = crypto.createHash('sha256');
        for (const file of packageAndLockFiles) {
          const stat = fs.statSync(file, { throwIfNoEntry: false });
          if (!stat) continue;
          hash.update(file);
          hash.update(stat.mtimeMs.toString());
        }
        return hash.digest('hex');
      } catch (_) {
        // do nothing
      }
    }

    function writePackageHash(hash: string): void {
      const hashDir = path.join('.yarn', 'plugins', 'plugin-auto-install');
      fs.mkdirSync(hashDir, { recursive: true });
      fs.writeFileSync(path.join(hashDir, 'hash'), hash);
    }

    return {
      hooks: {
        afterAllInstalled() {
          try {
            const hash = calcPackageHash();
            if (hash) writePackageHash(hash);
          } catch (_) {
            // do nothing
          }
        },
        async wrapScriptExecution(executor): Promise<() => Promise<number>> {
          try {
            const hash = calcPackageHash();
            try {
              const hashDir = path.join('.yarn', 'plugins', 'plugin-auto-install');
              const storedHash = fs.readFileSync(path.join(hashDir, 'hash'), 'utf-8');
              if (storedHash && storedHash === hash) return executor;
            } catch (_) {
              // do nothing
            }
            console.info('plugin-auto-install detects changes in package.json and/or yarn.lock.');
            if (hash) writePackageHash(hash);
            child_process.spawnSync('yarn', ['install'], { env: process.env, stdio: 'inherit' });
          } catch (_) {
            // do nothing
          }
          return executor;
        },
      } as Hooks,
    };
  },
};
