# JSDoc Conventions

Use JSDoc for:

- All **exported** functions and types
- Functions with non-obvious parameters or return shapes
- Anything you'd want an AI agent to understand without reading the body

## Do not use JSDoc for

- Self-evident one-liners (`function add(a, b) { return a + b }`)
- Private helpers that are clearly named

## Template

```ts
/**
 * Formats a changeset summary into a release line.
 *
 * @param changeset - The changeset to format.
 * @returns A formatted release line based on the changeset summary.
 */
export async function getReleaseLine(
  changeset: NewChangesetWithCommit
): Promise<string> {
  // ...
}
```

## Style

- First line is a single-sentence summary, no period duplication (`Formats X.` not `Formats X.`)
- Use `@param` and `@returns` (not `@return`)
- Use `@throws` when the function can throw
- Keep it short — one sentence per tag is usually enough
