Review in English based on the following coding standards.

## Coding Style

- Use camelCase for JavaScript and TypeScript files (or PascalCase for React components).
- Simplify code as much as possible to eliminate redundancy.
- Design each module with high cohesion, grouping related functionality together.
  - Refactor existing large modules into smaller, focused modules when necessary.
  - Create well-organized directory structures with low coupling and high cohesion.
- Place calling functions above the functions they call to maintain a clear top-down order.
  - e.g., `function caller() { callee(); } function callee() { ... }`
  - Unlike functions, place variable and type declarations ABOVE their usage.
- Write comments that explain "why" and use JSDoc to explain "what".
  - Avoid stating what can be easily understood from the code itself.
- Prefer `undefined` over `null` unless explicitly required by APIs or libraries.
- Prefer using a single template literal for prompts instead of `join()` with an array of strings.
