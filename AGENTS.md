# AGENTS.md

Custom changelog formatter and CLI for [`@changesets/cli`](https://github.com/changesets/changesets). Two entry points — a programmatic hook consumed by changesets, and a standalone CLI for post-processing `CHANGELOG.md`.

## Stack

- TypeScript (strict, ES2022)
- pnpm 10
- Node.js 22+
- Biome for lint and format
- Vitest for tests
- tsdown for build

## Import alias

`@/*` resolves to `src/*`. Use it for all internal imports.

## Commands

```bash
pnpm install              # install deps and set up .githooks
pnpm run check            # biome lint + format check
pnpm run check:fix        # biome auto-fix
pnpm run test             # vitest run
pnpm run test:coverage    # vitest run --coverage
pnpm run build            # tsdown build to dist/
```

CI order: `lint → test → build`.

## Layout

- `src/formatter/` — programmatic hook (`getReleaseLine`, `getDependencyReleaseLine`)
- `src/cli/` — standalone CLI (`cleanup` for `CHANGELOG.md` post-processing)
- `src/config/` — config loader (cosmiconfig)
- `schemas/` — JSON schema for the config file

## Conventions

### Code

- [TypeScript](.agents/conventions/typescript.md)
- [Imports](.agents/conventions/imports.md)
- [Naming](.agents/conventions/naming.md)
- [JSDoc](.agents/conventions/jsdoc.md)
- [Error handling](.agents/conventions/error-handling.md)

### Testing

- [Vitest patterns](.agents/testing/vitest-patterns.md)

### Workflow

- [Git hooks](.agents/workflow/git-hooks.md)
- [CI](.agents/workflow/ci.md)
- [Commit conventions](.agents/workflow/commit-conventions.md)

## Domain

See [CONTEXT.md](CONTEXT.md) for the glossary, and [docs/adr/](docs/adr/) for architectural decisions.

## Agent skills

### Issue tracker

GitHub Issues via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` at the repo root plus `docs/adr/`. See `docs/agents/domain.md`.
