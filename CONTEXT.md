# Context

The domain model for the `changeset-formatter` project.

## Glossary

### Changeset

A unit of change tracked by `@changesets/cli`. It consists of a `summary` (markdown text describing the change), a `commit` hash, a `releases` array (which packages are affected), and an `id` (the changeset filename, e.g., `cool-places-hug`).

Defined by `@changesets/types` as `NewChangesetWithCommit`.

### Release Line

A single formatted string produced by `getReleaseLine` for one changeset. This is what gets written into `CHANGELOG.md` under a version heading.

Example: `- Add new login flow (abc1234)`

### Conventional Commit Type

The prefix parsed from a changeset summary line (e.g., `feat`, `fix`, `docs`, `test`, `ci`, `chore`). This maps to a category in the config's `categories` object.

Parsed via regex: `/^(\w+)(?:\([^)]+\))?:\s*(.+)$/`

### Categorization

Grouping release lines by their conventional-commit type into section blocks (e.g., `### ✨ Features`, `### 🛠️ Fixes`). Controlled by the `categorize` config flag. When enabled, the formatter replaces the flat list of changes with a categorized layout.

### Config

The user-overridable settings for the formatter, loaded via cosmiconfig. Defined in `.changesetformatterrc.json`, `changesetformatter.config.js`, or `package.json#changesetFormatter`.

Key properties: `categories`, `useEmojis`, `linePrefix`, `showCommitHash`, `commitHashPosition`, `capitalizeMessage`, `categorize`, `removeTypes`, `addReleaseDate`, `pathToChangelog`.

### Hook

The entry point contract between this project and `@changesets/cli`. The `changelog` option in `.changeset/config.json` points to the exported `getReleaseLine` and `getDependencyReleaseLine` functions.

This project implements this contract via `src/index.ts` which re-exports from `src/formatter/index.ts`.

### Cleanup

The CLI's markdown post-processing pass. After `@changesets/cli` writes the `CHANGELOG.md`, this project reads it, applies categorization (grouping under the latest version), removes semver headings (`### Patch Changes`), and adds release dates to version headers.

### Two-Phase Workflow

This tool operates in two phases as a paired workflow:

1. **Phase 1 (programmatic hook)**: `@changesets/cli` calls `getReleaseLine` for each changeset during `version`. Produces the raw changelog content.
2. **Phase 2 (CLI post-processing)**: `changeset-formatter` CLI reads the generated `CHANGELOG.md`, applies formatting (categorization, date-stamping, semver cleanup), and writes it back.

This two-phase design exists because `@changesets/cli` does not support customizing section headers natively. The programmatic hook produces per-release content; the CLI polishes the final markdown file.
