# yarn-plugin-auto-install

[![Test](https://github.com/WillBooster/yarn-plugin-auto-install/actions/workflows/test.yml/badge.svg)](https://github.com/WillBooster/yarn-plugin-auto-install/actions/workflows/test.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

:strawberry: A yarn (berry) plugin for running `yarn install` automatically.

## What is This

This plugin invokes `yarn install` when any script is invoked with changes in `package.json` or `yarn.lock`.
It saves running `yarn install` manually after `git pull`, `git switch another-branch`, `vim package.json` and so on.
It could be an alternative of [Zero-Installs](https://yarnpkg.com/features/zero-installs).

## How to Install

```sh
yarn dlx yarn-plugin-auto-install
```
