# yarn-plugin-auto-install

:strawberry: A yarn (berry) plugin for running `yarn install` automatically.

## What is This

This plugin invokes `yarn install` when any script is invoked with changes in `package.json` or `yarn.lock`.
It saves running `yarn install` manually after `git pull`, `git switch another-branch`, `vim package.json` and so on.
It could be an alternative of [Zero-Installs](https://yarnpkg.com/features/zero-installs).

## How to Install

```sh
yarn dlx yarn-plugin-auto-install
```
