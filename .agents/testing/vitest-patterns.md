# Vitest Patterns

## File location

- Test files are **co-located** with the code they test
- Suffix: `*.test.ts`
- Example: `src/formatter/index.ts` → `src/formatter/formatter.test.ts`

## Imports

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as configModule from '@/config'
import { getReleaseLine } from './index'
```

Use `import * as moduleName` when you need to `vi.spyOn` the module — the spy replaces the function reference, which only works on namespace imports.

## Structure

```ts
describe('formatter/index', () => {
  beforeEach(() => {
    vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue(mockConfig)
  })

  it('formats a simple changeset summary', async () => {
    // arrange
    const changeset: NewChangesetWithCommit = { /* ... */ }

    // act
    const result = await getReleaseLine(changeset)

    // assert
    expect(result).toContain('feat: add new feature')
  })
})
```

## Mocking the config loader

The config loader (`loadFormatterConfig`) reads from disk via cosmiconfig. Tests **must mock it** to avoid filesystem dependency. Use `vi.spyOn` in `beforeEach` and override per-test as needed:

```ts
const mockConfig: Config = { /* minimal valid config */ }

beforeEach(() => {
  vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue(mockConfig)
})

it('does X when option is true', async () => {
  vi.spyOn(configModule, 'loadFormatterConfig').mockResolvedValue({
    ...mockConfig,
    option: true
  })
  // ...
})
```

## Running tests

```bash
pnpm run test                  # all tests, once
pnpm run test:watch            # watch mode
pnpm run test:coverage         # all tests + coverage
pnpm vitest run path/to/file   # single file
pnpm vitest run -t "test name"  # single test by name
```

## Rules

- Test both **success and failure cases**
- Use `beforeEach` to reset mocks, never `beforeAll` for mock state
- Prefer `toContain` / `not.toContain` over `toBe` when checking substring presence in formatted output
- For tests that should throw, use `await expect(promise).rejects.toThrow('message')`
