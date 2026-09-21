Review in English based on the following coding standards.

## Coding Style

- Use camelCase file names for JavaScript/TypeScript (PascalCase for React components).
- Simplify code as much as possible to eliminate redundancy.
- Design modules and directories with high cohesion and low coupling; split large modules when needed.
- Place calling functions above the functions they call (top-down order); place variable and type declarations above their usage.
- Comments and JSDoc: every reader has the source, so never restate what the code, its names, or its types already say (e.g., `@param name The name`). Write one only when a plausible edit would break something without that knowledge and no type check, lint rule, or test would catch it; first encode the knowledge in code (a name, a type, an `assert`, a test) and comment only what cannot be encoded: an odd-looking workaround, a dependency on a fact outside the repository, or a rejected alternative and why. Put a contract of the declared symbol in JSDoc and line-specific knowledge in an inline comment. Delete comments that fail this test in files you touch. Exception: the exported API of a package published to npm may carry JSDoc describing what it does and how to call it, because its users read it without the source.
- Never explain how WillBooster's in-house tools (e.g., `wb`, `wbfy`) work in code comments or documents outside the tool's own package, except in instructions for AI agents (e.g., do not note that `PORT` is unset because `wb` picks a free port).
- If lint errors or warnings cannot be fixed, use ignore comments with reasons (e.g., `// oxlint-disable-next-line <rule> -- <reason>`).
- Prefer `undefined` over `null` unless required by APIs or libraries.
- Validate JavaScript objects (e.g., parsed JSON, API responses) with `zod` whenever possible instead of hand-written checks or type assertions.
- Build prompts as a single template literal instead of `join()` on a pre-computable array of strings.
- Assume all environment variables are defined; if validation is needed, `assert` them at startup to fail fast.
- Assume local tools such as `git`, `gh`, and `ghq` are installed and authenticated.
