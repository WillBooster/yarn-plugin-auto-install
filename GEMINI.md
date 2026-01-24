## Project Information

- Name: yarn-plugin-auto-install
- Description: A yarn (berry) plugin for running `yarn install` automatically.
- Package Manager: yarn on zsh

## General Instructions

- Create a new branch if the current branch is `main`.
- Do not write tests unless explicitly requested.
- When fixing tests, gather debug information through logging and screenshots before modifying the code.
- After making code changes, run `yarn check-all-for-ai` to execute all tests (takes up to 1 hour), or run `yarn check-for-ai` for type checking and linting only (takes up to 10 minutes).
  - If you are confident your changes will not break any tests, you may use `check-for-ai`.
- Once you have verified your changes, commit them to a non-main branch using the `--no-verify` option and push to the current branch.
  - Follow conventional commits; your commit message should start with `feat:`, `fix:`, etc.
  - If not specified, make sure to add a new line at the end of your commit message with: `Co-authored-by: WillBooster (Gemini CLI) <agent@willbooster.com>`.
  - Always create new commits. Avoid using `--amend`.

## Coding Style

- Simplify code as much as possible to eliminate redundancy.
- Design each module with high cohesion, grouping related functionality together.
  - Refactor existing large modules into smaller, focused modules when necessary.
  - Create well-organized directory structures with low coupling and high cohesion.
- When adding new functions or classes, define them below any functions or classes that call them to maintain a clear top-down call order.
- Write comments that explain "why" rather than "what". Avoid stating what can be understood from the code itself.
- Prefer `undefined` over `null` unless explicitly required by APIs or libraries.
