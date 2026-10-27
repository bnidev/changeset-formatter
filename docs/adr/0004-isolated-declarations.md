# ADR-0004: Enable `isolatedDeclarations`

## Status

Accepted

## Context

`pnpm build` runs `tsdown`, which emits `.d.ts` files through `rolldown-plugin-dts`. tsdown 0.23.2 pulls `rolldown-plugin-dts@0.29.0-beta.2`, which no longer supports the classic TypeScript compiler API. TypeScript 7, installed here, removed that API, so the build fails with:

```
TypeScript 7.0.2 does not provide the classic TypeScript API required by tsc.
Please use TypeScript 6.0 or below, or enable `isolatedDeclarations` in your
`tsconfig.json` to use Oxc instead.
```

The alternatives were downgrading TypeScript, pinning tsdown to `~0.23.1`, or moving declaration emit to the Oxc generator.

## Decision

Set `"isolatedDeclarations": true` in `tsconfig.json`. The plugin then selects its Oxc generator, which needs no TypeScript compiler API.

This requires every exported declaration to carry an explicit type, so two annotations were added:

- `src/changelog.ts`: the default export is typed as `ChangelogFunctions` from `@changesets/types`.
- `src/config/index.ts`: `loadFormatterConfig` declares `Promise<Config>`.

Both spell out types that were previously inferred, so the published `.d.ts` surface is unchanged.

## Alternatives Considered

- **Downgrade TypeScript to 6.x**: rejected. TypeScript 7 is used repo-wide and works with every other tool; one devDependency's beta plugin should not pin the compiler.
- **Pin `tsdown` to `~0.23.1`**: rejected as a deferral. It keeps the repo on a plugin that will be removed upstream, and the same failure returns on the next bump.
- **Bundle declarations by hand or emit with `tsc` separately**: rejected as unnecessary complexity for a three-entry-point package.

## Consequences

- Exported declarations must stay explicitly annotated; `tsc --noEmit` enforces it, and violations are compile errors (`TS9007`, `TS9016`).
- Declaration emit is faster because Oxc generates it, and the build no longer depends on the TypeScript compiler API.
- If `isolatedDeclarations` ever needs to be reverted, `tsdown.config.ts` can pass a `generator` option instead, but the build would again require a TypeScript version that exposes the classic API.
