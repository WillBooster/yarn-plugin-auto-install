## Project Information

- Name: `yarn-plugin-auto-install`
- Description: A yarn (berry) plugin for running `yarn install` automatically.
- Package Manager: yarn

## General Instructions

- Create a new branch if the current branch is `main`.
- Run any `git` commands sequentially.
- Write tests ONLY if explicitly requested. If requested, follow these rules:
  - Continue modifying tests and/or code until all tests pass.
  - Ensure tests are idempotent and independent (e.g., reset persistent data) so they can run repeatedly or in parallel.
  - Prefer actual API calls over mocks, unless actual calls are impractical, have unintended side effects, or mocks are explicitly requested.
  - Always investigate the root cause of a test failure before fixing it.
  - Avoid adding wait functions in E2E tests unless strictly necessary.
- When fixing issues, follow these rules:
  - Investigate the root cause first (e.g., by gathering debug logs, taking screenshots, etc.).
  - Fix the actual root cause instead of applying workarounds.
- After making code changes, run `yarn verify-full` to execute all tests (takes up to 1 hour), or `yarn verify` for only type checking and linting (takes up to 10 minutes).
  - If you are confident that your changes will not break any tests, you may use `verify`.
  - Use `oxlint` ignore comments with reasons (e.g., `// oxlint-disable-next-line <rule> -- <reason>`) if lint errors or warnings cannot be fixed.
- Once you have verified your changes, commit and push them to the current (non-main) branch, then create a PR via `gh`.
  - Follow the conventional commits; your commit message should start with `feat:`, `fix:`, etc.
  - If not specified, make sure to add a new line at the end of your commit message with: `Co-authored-by: WillBooster (Gemini CLI) <agent@willbooster.com>`.
  - Always create new commits. Avoid using `--amend`.
- Always use heredoc syntax when passing multi-line content to any command.

## Coding Style

- Use camelCase for JavaScript and TypeScript files (or PascalCase for React components).
- Simplify code as much as possible to eliminate redundancy.
- Design each module with high cohesion, grouping related functionality together.
  - Refactor existing large modules into smaller, focused modules when necessary.
  - Create well-organized directory structures with low coupling and high cohesion.
- Place calling functions above the functions they call to maintain a clear top-down order.
  - e.g., `function caller() { callee(); } function callee() { ... }`
  - Unlike functions, place variable and type declarations ABOVE their usage.
- Write comments and JSDoc for complex or hard-to-understand code.
  - Explain "why" in comments and "what" in JSDoc.
  - Avoid stating what can be easily understood from the code itself.
- Prefer `undefined` over `null` unless explicitly required by APIs or libraries.
- Prefer using a single template literal for prompts instead of `join()` with a pre-computable array literal of strings.
- Assume that all environment variables are properly defined.
  - If validation is required, use `assert` to fail fast (e.g., during startup).
