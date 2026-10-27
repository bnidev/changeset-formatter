# TypeScript Conventions

## Compiler settings

Defined in `tsconfig.json`. Do not change without an ADR.

- `strict: true` — no `any`, no implicit `any`
- `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`
- `esModuleInterop: true`, `resolveJsonModule: true`
- `isolatedDeclarations: true` — required by tsdown's Oxc declaration emitter; every export needs an explicit type (see [ADR-0004](../../docs/adr/0004-isolated-declarations.md))

## Rules

- **No `any` types.** Use `unknown` and narrow with type guards, or define a proper type.
- **Explicit return types on all exported functions.** Private (non-exported) helpers may rely on inference.
- **Co-locate types with the function that uses them.** Promote to a shared file only when reused.
- **Use `import type` for type-only imports** — keeps the runtime bundle smaller and makes intent obvious.
- **Use `node:` prefix for built-in modules** — `import fs from 'node:fs'`, not `'fs'`.

## Verifying types

```bash
pnpm exec tsc --noEmit
```

(Not a script in `package.json` — run ad-hoc. CI runs `pnpm run build` which compiles via tsup.)
