# Commit Conventions

This repo follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec. Convention only — no tooling enforces it, no commit hook, no CI check.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

The first line is the **header** and is the only required part. The subject is what shows up in `git log --oneline` and `gh pr list`.

## Types

All types from the spec are allowed. Pick the one that best describes the change.

| Type       | When to use                                                |
| ---------- | ---------------------------------------------------------- |
| `feat`     | New feature                                                |
| `fix`      | Bug fix                                                    |
| `docs`     | Documentation only                                         |
| `style`    | Formatting, whitespace, missing semi-colons (no code change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature    |
| `perf`     | Performance improvement                                    |
| `test`     | Adding or correcting tests                                 |
| `build`    | Build system, external dependencies                        |
| `ci`       | CI configuration files and scripts                         |
| `chore`    | Tooling, dependencies, misc maintenance                    |
| `revert`   | Reverts a previous commit                                  |

## Scope

**Free-form.** Use whatever conveys the area of the codebase affected. Common scopes in this repo:

- `deps` — runtime dependency changes
- `deps-dev` — dev dependency changes
- `formatter` — `src/formatter/`
- `cli` — `src/cli/`
- `config` — `src/config/`
- `ci` — `.github/workflows/`
- `docs` — documentation files

Scope is optional. Omit it when the change is project-wide or doesn't fit one area.

## Subject

- **Lowercase** — no capital first letter
- **Imperative mood** — `add`, not `added` or `adds`
- **No trailing period**
- **≤72 characters**
- **Specific** — say what changed, not just "update" or "fix"

## Body (optional)

- Wrap at 72 characters
- Blank line between subject and body
- Explain **why**, not what. The diff shows what.

## Footer (optional)

- **Breaking changes**: `BREAKING CHANGE: <description>` on its own line
- **Issue refs**: `Refs: #123`, `Closes: #456`
- **PR refs**: `(#57)` style (matches this repo's history for bot-driven dependency PRs)

## Examples from this repo's history

```
chore(deps-dev): bump @types/node from 25.6.0 to 25.8.0 (#57)
fix(deps): update @changesets/cli to 2.30.0 and add vite 8
chore: add .nvmrc for Node v24.14.0
```

## Breaking changes

Append `!` after the type/scope and add a `BREAKING CHANGE:` footer:

```
feat(cli)!: drop support for Node 16

BREAKING CHANGE: minimum supported Node version is now 18.
```

## What this doc is not

- Not a checklist to memorize — read it when you write a commit
- Not enforced by tooling — review the message before committing
- Not a substitute for code review — clear commit messages help reviewers, not replace them
