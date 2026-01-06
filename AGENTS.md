## Project Information

- Name: yarn-plugin-auto-install
- Description: A yarn (berry) plugin for running `yarn install` automatically.
- Package Manager: yarn on zsh

## Development Workflow

When changing code, complete these steps before responding to the user.

1. If the current branch is `main`, create a new branch.
   - Include unexpected changes since they are mine.
2. Make code changes as needed.
3. If possible, write e2e tests for your changes.
4. Fix your changes until `yarn check-all-for-ai` (running all tests, taking 30 mins) or `yarn check-for-ai` (only type checking and linting) passes.
   - If you are confident your changes will not break any tests, you may use `check-for-ai`.
5. Commit your changes to the current branch and push.
   - Follow conventional commits, i.e., your commit message should start with `feat:`, `fix:`, `test:`, etc.
   - Make sure to add a new line at the end of your commit message with: `Co-authored-by: WillBooster (Codex CLI) <agent@willbooster.com>`.
   - When pre-commit hooks prevent your changes, fix your code, then re-commit and re-push.
6. Create a pull request using `gh`.
   - The pull request title should match your commit message.
7. Repeat the following steps until the test workflow passes:
   1. Monitor the CI results using the following command until the test workflow completes (timeout should be 30 mins).
      - `while :; do gh run list -b "$(git branch --show-current)" --json status,conclusion | jq -e '.[] | select(.conclusion=="failure")' && exit 1; gh run list -b "$(git branch --show-current)" --json status | jq -e '.[] | select(.status=="completed" | not)' || exit 0; sleep 1m; done`
   2. If tests fail, identify the root causes by gathering debug information through logging and screenshots, then fix the code and/or tests.
   3. Fetch unresolved review comments from the pull request using the following command. Address them and then mark them as resolved.
      - `gh api graphql -f query="{ repository(owner: \"WillBooster\", name: \"yarn-plugin-auto-install\") { pullRequest(number: $(gh pr view --json number -q .number)) { reviewThreads(first: 100) { nodes { isResolved comments(first: 100) { nodes { body author { login } path line } } } } } } }" | jq '.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved | not)'`
   4. Commit your changes and push.
   5. Write `/gemini review` in the pull request.

## Coding Style

- Write comments that explain "why" rather than "what". Avoid explanations that can be understood from the code itself.
- Use stderr for logging debug messages temporarily since stdout output is sometimes omitted.
- When adding new functions or classes, define them below any functions or classes that call them to maintain clear call order.
- Prefer `undefined` over `null` unless explicitly dealing with APIs or libraries that require `null`.
