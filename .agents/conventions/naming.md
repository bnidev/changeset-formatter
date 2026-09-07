# Naming Conventions

## Files

- **kebab-case** for all source and test files: `formatter.test.ts`, `cleanup.ts`
- Test files live next to the code they test, with the `.test.ts` suffix
- One file per top-level concept; a module is a directory with an `index.ts`

## Functions and variables

- **camelCase** for functions, methods, variables, and parameters
- **SCREAMING_SNAKE_CASE** for module-level constants (e.g., `defaultConfig`)
- **Booleans prefix with `is`, `has`, `should`, or `can`**: `isLoaded`, `hasCommit`, `shouldCategorize`, `canRead`

## Types and interfaces

- **PascalCase** for types, interfaces, and enums
- **No `I` prefix** for interfaces — just the name (`Config`, not `IConfig`)
- **No `T` prefix** for types — the name carries the meaning (`Changeset`, not `TChangeset`)

## Examples

```ts
const defaultConfig: Config = { /* ... */ }

export function loadFormatterConfig(): Promise<Config> { /* ... */ }

function isEmptyLine(line: string): boolean {
  return line.trim() === ''
}

type CategoryMap = Record<string, { title: string; emoji: string }>
```
