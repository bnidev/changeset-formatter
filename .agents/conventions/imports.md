# Import Conventions

## Order

Three groups, in this order, separated by blank lines. Biome enforces this via `organizeImports`.

1. **Built-in** — `node:*` modules
2. **External** — packages from `node_modules`
3. **Internal** — code under `src/`, using the `@/*` alias

```ts
// Built-in
import fs from 'node:fs'
import path from 'node:path'

// External
import type { NewChangesetWithCommit } from '@changesets/types'
import { cosmiconfig } from 'cosmiconfig'

// Internal
import { type Config, loadFormatterConfig } from '@/config'
import { cleanup } from './cleanup'
```

## Rules

- **Use the `@/*` alias for internal imports**, not relative `../`. It maps to `src/*` via `tsconfig.json` and `vitest.config.ts`.
- **Use `import type`** for type-only imports. Biome will auto-fix this where it can.
- **Use named imports where possible.** Default imports only when the module's contract is a single object (e.g., `import pkg from '../../package.json'`).
- **No barrel files** unless shared across three or more modules. Each `import { foo } from '@/barrel'` hides the real source.
