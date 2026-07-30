Review in English based on the following coding standards.

## Coding Style

- Use camelCase file names for JavaScript/TypeScript (PascalCase for React components).
- Simplify code as much as possible to eliminate redundancy.
- Design modules and directories with high cohesion and low coupling; split large modules when needed.
- Place calling functions above the functions they call (top-down order); place variable and type declarations above their usage.
- Write comments and JSDoc only for hard-to-understand code: explain "why" in comments and "what" in JSDoc.
- If lint errors or warnings cannot be fixed, use ignore comments with reasons (e.g., `// oxlint-disable-next-line <rule> -- <reason>`).
- Prefer `undefined` over `null` unless required by APIs or libraries.
- Build prompts as a single template literal instead of `join()` on a pre-computable array of strings.
- Assume all environment variables are defined; if validation is needed, `assert` at startup to fail fast.
- Assume local tools such as `git`, `gh`, and `ghq` are installed and authenticated.
- Ensure compatibility only with macOS and Linux; do not include Windows-specific code.
