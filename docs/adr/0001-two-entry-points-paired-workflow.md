# ADR-0001: Two Entry Points as a Paired Workflow

## Status

Accepted

## Context

`@changesets/cli` exposes a `changelog` config option that accepts a custom changelog generator (see `getReleaseLine` / `getDependencyReleaseLine`). However, it does not support customizing section headers — specifically, grouping changes into `### Features` / `### Fixes` sections, adding release dates, or removing the `### Patch Changes` / `### Minor Changes` / `### Major Changes` sub-headings.

This project was originally written as two separate components: a programmatic hook for changesets, and a CLI for post-processing the resulting `CHANGELOG.md`.

## Decision

Keep both entry points and document them as a **two-phase workflow**:

1. **Programmatic hook** (`src/index.ts` → `src/formatter/index.ts`): invoked by `@changesets/cli` during `changeset version` to produce per-release content.
2. **CLI** (`src/cli/index.ts` → `src/cli/cleanup.ts`): run after version generation, reads the resulting `CHANGELOG.md`, applies formatting passes (categorization, semver heading removal, date stamping), and writes it back.

The two phases share the `Config` type but operate on different inputs (a changeset object vs. raw markdown) and do not call each other.

## Alternatives Considered

- **Single entry point**: have the CLI call the programmatic hook. Rejected because the inputs are fundamentally different — the hook receives a `NewChangesetWithCommit`, the CLI receives a markdown string. Unifying would require either changing the hook's API or re-parsing the markdown, which is fragile.
- **Two separate packages**: split into `changeset-formatter-core` and `changeset-formatter-cli`. Rejected as over-engineering for a project of this size.
- **Wait for upstream changesets support**: rejected because we cannot predict if/when changesets will add native section header customization.

## Consequences

- The CLI and programmatic hook have duplicated logic for parsing conventional-commit types (the hook parses `summary` strings; the CLI parses markdown sections). This is acceptable because the parsing contexts are different.
- Users must configure both `.changeset/config.json` (for the hook) and add a `postversion` script (for the CLI) to get the full feature set. This is documented in the README.
- Future maintenance must touch both code paths if formatting rules change.

## Date

2025
