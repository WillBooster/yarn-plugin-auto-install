## Project Information

- Name: `yarn-plugin-auto-install`
- Description: A yarn (berry) plugin for running `yarn install` automatically.
- Package Manager: bun

## General Instructions

- If on `main`, create a new branch; otherwise work on the current branch.
- Run `git` commands one at a time to avoid `index.lock` conflicts.
- Write a test only when explicitly requested, or when a behavior is likely to regress and no existing automatic check (type checking, linting, an existing test or CI check) would catch the breakage. Never add a test that merely restates a mapping from conditions to constant outputs (it fails only on intentional edits) or that only confirms an external fact (a library's behavior, whether a version fixes an issue); verify those once manually.
- Test externally observable behavior (e.g., emitted files, CLI output, rendered results) at the system boundary, not implementation details: do not mirror production logic, assert that a branch is taken, or feed hand-assembled internal objects to internal functions.
- Prefer actual API calls over mocks, unless actual calls are impractical, have unintended side effects, or mocks are explicitly requested.
- Ensure tests are idempotent and independent (e.g., reset persistent data) so they can run repeatedly or in parallel.
- Avoid fixed waits in E2E tests; wait for conditions instead.
- When fixing issues (including test failures), investigate the root cause first (e.g., via debug logs or screenshots) and fix it instead of applying workarounds.
- After making changes, run `bun run verify` (type checking and linting; up to 10 minutes), or `bun run verify-full` (all tests; up to 1 hour) if you changed runtime behavior or tests. Fix errors and re-run until it passes.
  - Wait for it to finish without restarting it: prefer completion notifications, otherwise the longest permitted wait; no output does not mean it has stopped. If the displayed excerpt is insufficient, read the indicated log file before rerunning. If the environment kills long-running commands, run them detached with a saved log and exit status.
- Once verified, commit and push to the current (non-main) branch, and create a PR via `gh` if none exists for the branch.
  - Follow the Conventional Commits format (e.g., `feat:`, `fix:`).
  - End your commit message with a blank line followed by `Co-authored-by: WillBooster (Codex CLI) <agent@willbooster.com>`, the only AI attribution to add.
  - Always create new commits; avoid `--amend`.
  - Base the PR body on `.github/pull_request_template.md` when creating or updating a PR, even when a skill or workflow supplies its own skeleton: keep the template's headings in order, fill each section with what its placeholder comment asks for at a length fitting the change (a sentence for a small change, numbered subsections for a large one), and delete the placeholder comments and an empty Notes section. Without a template, use no fixed headings: state the scope, the motivation, and the verification concisely.
  - Start the body with `Close #<n>` only when the PR resolves an existing issue.
  - Requirements section: one line per requirement, taken from the requester's instructions as they were given (the issue, the conversation that asked for the change), each marked `required` (asked for, or an existing contract callers depend on) or `chosen` (your own decision, which a simpler design may replace). Never infer a requirement from the diff: when no issue, PR message, or conversation states the request, write `required: not recorded — ask the requester` as the only request-derived line (a `required` line for an existing contract callers depend on may still be listed) and say so in Notes.
  - Record rule: an existing Requirements section is a record, not a description of the diff. Keep its `required` lines as they are, rewriting them only when the requester's instructions changed (then from the updated instructions, dropping a line only when the requester removed it; with no instructions available, keep them unchanged); add a `chosen` line for a new decision, and replace or remove one when the decision it records changed. A section that merely describes the implementation, or holds only the template's placeholder or a `required: not recorded` line, is not a record: write it afresh by the rule above.
  - Place the section where the template puts it; when the template has no such heading, right after the issue-closing line, or at the top of the body when there is none.
  - Never drop or weaken a `required` line to fit what was implemented: when one cannot hold in the diff, keep it and say so in Notes.
- When creating an issue:
  - Follow the closest template under `.github/ISSUE_TEMPLATE/`: `bug.md` for wrong behavior, `change.md` for anything to build or alter; a question or note fitting neither, or a repository without templates, needs no template.
  - Title: a Conventional Commits prefix for the type that fits the change (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, ...); when it differs from the template's `title` prefix, replace the template's type label (`t: ...`) with the one matching the type.
  - The YAML front matter between the `---` lines is metadata, not body text: pass its `labels` via `--label` and submit only the content below the closing `---` as the body.
- In any explanatory text (commit messages, PR descriptions, documentation, code comments, etc.), describe only the current implementation: drop any statement naming an identifier, feature, or concept you cannot confirm exists in the final diff or the current codebase (e.g., one added and later removed or renamed along the way). Whenever documentation or comments no longer match the current implementation (removed options, deprecated usage, outdated behavior), delete or rewrite them, even in files you are not otherwise changing. Mention a past state only where it is needed to understand why the current design is as it is, or when explicitly asked; files that record history by design (e.g., a changelog) are exempt, and so is the PR body's Requirements section, which records what was asked for rather than what the code contains.
- Use heredoc for multi-line command input (e.g., `git commit -F -`, `gh pr create --body-file -`, `gh issue create --body-file -`).
- Put temporary files in `.tmp`; use `/tmp` only for files that must live outside the repo.
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/general.mdc`, and `.gemini/styleguide.md` are generated from `AGENTS_EXTRA.md` and overwritten on every `wbfy` run; to change agent instructions, edit only `AGENTS_EXTRA.md`.
- Tool versions (e.g., node) are pinned in `mise.toml`; run `mise install` after changing it and never install those tools globally instead.
- `bunfig.toml` uses Bun's isolated linker, so only declared dependencies resolve. If an import fails to resolve, declare that package in the `package.json` that imports it; never switch `linker` to `hoisted` or add to `publicHoistPattern` to work around it.
- Private repositories use self-hosted CI runners. Keep OS/size constraints in an explicit self-hosted label array; fix missing runner capabilities instead of switching to GitHub-hosted runners. The sole approved exception is the Windows desktop build in WillBooster/cheerlings.

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
