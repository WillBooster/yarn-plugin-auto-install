## Project Information

- Name: `yarn-plugin-auto-install`
- Description: A yarn (berry) plugin for running `yarn install` automatically.
- Package Manager: bun

## General Instructions

- If on `main`, create a new branch; otherwise work on the current branch.
- Run `git` commands one at a time to avoid `index.lock` conflicts.
- Write a test only when explicitly requested, or when a behavior is likely to regress and no existing automatic check (type checking, linting, an existing test or CI check) would catch the breakage. Never add a test that merely restates a mapping from conditions to constant outputs (it fails only on intentional edits) or that only confirms an external fact (a library's behavior, whether a version fixes an issue); verify those once manually.
- When writing tests, follow these rules:
  - Test externally observable behavior (e.g., emitted files, CLI output, rendered results) at the system boundary, not implementation details: do not mirror production logic, assert that a branch is taken, or feed hand-assembled internal objects to internal functions.
  - Prefer actual API calls over mocks, unless actual calls are impractical, have unintended side effects, or mocks are explicitly requested.
  - Ensure tests are idempotent and independent (e.g., reset persistent data) so they can run repeatedly or in parallel.
  - Avoid fixed waits in E2E tests; wait for conditions instead.
  - Continue modifying tests and/or code until all tests pass.
- When fixing issues (including test failures), investigate the root cause first (e.g., via debug logs or screenshots) and fix it instead of applying workarounds.
- After making changes, run `bun run verify` (type checking and linting; up to 10 minutes), or `bun run verify-full` (all tests; up to 1 hour) if you changed runtime behavior or tests. Fix errors and re-run until it passes.
  - Agent shells may kill tracked commands (background ones included) after minutes, so run commands that can exceed your shell-call timeout (e.g., both verify scripts) detached via nohup from a call that returns immediately: `mkdir -p .tmp; rm -f .tmp/verify-full.exit; nohup sh -c 'bun run verify-full; echo $? > .tmp/verify-full.exit' > .tmp/verify-full.log 2>&1 &` (the redirects are required; an inherited stdout/stderr pipe keeps the call waiting). Poll from separate calls, each shorter than that timeout, until the exit file appears (its content is the exit code): `for i in 1 2 3; do test -f .tmp/verify-full.exit && break; sleep 20; done; cat .tmp/verify-full.exit 2>/dev/null || echo still running`; then read the log. If the exit file never appears and the log stops growing, the run died.
- Once verified, commit and push to the current (non-main) branch, and create a PR via `gh` if none exists for the branch.
  - Follow the Conventional Commits format (e.g., `feat:`, `fix:`).
  - End your commit message with a blank line followed by `Co-authored-by: WillBooster (Gemini CLI) <agent@willbooster.com>`.
  - Always create new commits; avoid `--amend`.
  - Base the PR body on `.github/pull_request_template.md` when creating or updating a PR, even when a skill or workflow supplies its own skeleton: keep the template's headings in order, fill each section with what its placeholder comment asks for at a length fitting the change (a sentence for a small change, numbered subsections for a large one), delete the placeholder comments and an empty Notes section, and keep `Close #<n>` only when the PR resolves an existing issue.
- When creating an issue, follow the closest template under `.github/ISSUE_TEMPLATE/`: `bug.md` for wrong behavior, `change.md` for anything to build or alter; a question or note fitting neither needs no template. The YAML front matter between the `---` lines is metadata, not body text: prefix the title as its `title` says, pass its `labels` via `--label`, and submit only the content below the closing `---` as the body. Always keep the first three sections of `change.md` and add the rest as the change grows; keep Problem and Proposal of `bug.md` and drop Evidence or Impact when they add nothing. Delete the placeholder comments.
- In any explanatory text (commit messages, PR descriptions, documentation, code comments, etc.), describe only the current implementation: never mention symbols or concepts that were added and later removed or renamed along the way, and drop any statement naming an identifier or feature you cannot confirm exists in the final diff or the current codebase. Whenever you notice documentation or comments that no longer match the current implementation (removed options, deprecated usage, outdated behavior), delete or rewrite them, even in files you are not otherwise changing. Mention a past state only where it is needed to understand why the current design is as it is, or when explicitly asked; files that record history by design (e.g., a changelog) are exempt.
- Use heredoc for multi-line command input (e.g., `git commit -F -`, `gh pr create --body-file -`, `gh issue create --body-file -`).
- Put temporary files in `.tmp`; use `/tmp` only for files that must live outside the repo.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/general.mdc`, and `.gemini/styleguide.md` are generated from `AGENTS_EXTRA.md` and overwritten on every `wbfy` run; to change agent instructions, edit only `AGENTS_EXTRA.md`.
- Tool versions (e.g., node) are pinned in `mise.toml`; run `mise install` after changing it and never install those tools globally instead.
- `bunfig.toml` uses Bun's isolated linker, so only declared dependencies resolve. If an import fails to resolve, declare that package in the `package.json` that imports it; never switch `linker` to `hoisted` or add to `publicHoistPattern` to work around it.

## Coding Style

- Use camelCase file names for JavaScript/TypeScript (PascalCase for React components).
- Simplify code as much as possible to eliminate redundancy.
- Design modules and directories with high cohesion and low coupling; split large modules when needed.
- Place calling functions above the functions they call (top-down order); place variable and type declarations above their usage.
- Write comments and JSDoc only for hard-to-understand code: explain "why" in comments and "what" in JSDoc.
- Never explain how WillBooster's in-house tools (e.g., `wb`, `wbfy`) work in code comments or documents outside the tool's own package, except in instructions for AI agents (e.g., do not note that `PORT` is unset because `wb` picks a free port).
- If lint errors or warnings cannot be fixed, use ignore comments with reasons (e.g., `// oxlint-disable-next-line <rule> -- <reason>`).
- Prefer `undefined` over `null` unless required by APIs or libraries.
- Validate JavaScript objects (e.g., parsed JSON, API responses) with `zod` whenever possible instead of hand-written checks or type assertions.
- Build prompts as a single template literal instead of `join()` on a pre-computable array of strings.
- Assume all environment variables are defined; if validation is needed, `assert` them at startup to fail fast.
- Assume local tools such as `git`, `gh`, and `ghq` are installed and authenticated.
