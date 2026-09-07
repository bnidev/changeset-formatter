# ADR-0002: Cosmiconfig for Config Discovery

## Status

Accepted

## Context

The formatter needs to load user configuration from the consumer's project. Options for config discovery include:

- Hand-rolled: look in specific paths with a specific name
- cosmiconfig: a library that handles discovery, file extensions, and `package.json` lookup uniformly
- Environment variables only: explicit but inconvenient for projects with many options

## Decision

Use `cosmiconfig` with the module name `changesetFormatter`. This discovers:

- `.changesetformatterrc`
- `.changesetformatterrc.json`
- `.changesetformatterrc.yaml` / `.changesetformatterrc.yml`
- `.changesetformatterrc.js` / `.cjs` / `.mjs`
- `changesetformatter.config.js` / `.cjs` / `.mjs`
- `package.json` under the `changesetFormatter` key

A JSON schema for validation lives in `schemas/changeset-formatter.schema.json` but is not currently wired to cosmiconfig (a future ADR may add that).

## Alternatives Considered

- **Hand-rolled discovery**: rejected — cosmiconfig is tiny (~3KB) and handles edge cases (caching, parent-directory walking, format detection) that we would otherwise re-implement.
- **Only `package.json#changesetFormatter`**: rejected — users reasonably expect a separate config file for tooling.
- **Yargs/commander-style CLI flags for everything**: rejected — this is a tool meant to run automatically in CI, not interactively.

## Consequences

- One external runtime dependency (`cosmiconfig`).
- Users have a familiar mental model: the same shape as `.eslintrc`, `.prettierrc`, etc.
- Loading failures are silent — `loadFormatterConfig` catches any error and falls back to defaults. This is documented in the error-handling convention.
- The JSON schema in `schemas/` is currently unused at runtime. If we wire it to cosmiconfig, we get editor autocomplete for free, but it adds a dependency on `ajv`.

## Date

2025
