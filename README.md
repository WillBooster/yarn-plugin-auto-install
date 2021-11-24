# yarn-plugin-auto-install

:strawberry: A yarn (berry) plugin for running `yarn install` automatically.

## What is this

This plugin intends to be an alternative of [Zero-Installs](https://yarnpkg.com/features/zero-installs).
It automatically invokes `yarn install` when any script is invoked with changes in `package.json` or `yarn.lock`.

## How to Install

```sh
yarn plugin import https://raw.githubusercontent.com/WillBooster/yarn-plugin-auto-install/main/dist/index.cjs
```
