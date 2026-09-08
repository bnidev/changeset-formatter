# Releases

Manual, two-workflow release pipeline for `changeset-formatter`. Nothing publishes automatically: merges to `main` do nothing, and every release is driven by a human running two `workflow_dispatch` actions.

The rest of this doc assumes you are already on a clean `main`.

## How a release works

```
merge feature PRs → run "Create Release PR" → review/merge "Version Packages" → run "Publish to npm"
```

## 1. Merge feature work

Each PR that ships a user-facing change carries a changeset file under `.changeset/` (see [Changesets](#changesets)). Feature PRs merge freely; they never publish anything on their own. The set of pending changesets is what a release picks up.

## 2. Run "Create Release PR"

Trigger `release-create.yml`, which runs `release:version` (`changeset version && node dist/cli/index.cjs`):

- `changeset version` bumps `package.json` to the next version, writes `CHANGELOG.md` via the formatter hook, and deletes the consumed changesets
- `node dist/cli/index.cjs` post-processes the changelog (category grouping, semver-heading and date handling)
- `changesets/action` pushes a `changeset-release/main` branch and opens (or updates) the **Version Packages** PR

### Why `release:version` is a single script

`version` runs the command **without a shell** (splits on whitespace). Putting `&&` in the workflow input fails with `CACError: Unused args`. The combined command lives in `package.json` and the workflow passes just `pnpm run release:version`.

### Quirks

- **The Version Packages PR needs one CI approval.** It is created by `github-actions[bot]`, so GitHub requires a one-click "Approve and run" on its `pull_request` CI run — unlike human PRs which auto-run. Same every release.
- **Build precedes version.** `dist/` is gitignored, but `release:version` needs the built CLI and the formatter hook, so the workflow builds before versioning. A missing/changed build would silently skip the cleanup step.
- **PR title is `Version Packages`** — `changesets/action`'s default. Keep it, or add a `title:` input to the workflow.

## 3. Merge the Version Packages PR

Review the generated changelog and version bump, then merge. The release branch is force-pushed (regenerated) on future runs, so there's no cleanup to do manually.

## 4. Run "Publish to npm"

Trigger `release-publish.yml`, which publishes via **npm Trusted Publishing** (OIDC — no `NPM_TOKEN` needed):

- `pnpm changeset publish` publishes the package
- The action intends to create a `v1.0.0`-style git tag and GitHub release automatically

### Known gap

As of the `v1.0.0` release, the action printed "Created git tags" but **did not** push the tag or create the GitHub release (the `CHANGESETS_OUTPUT` events were empty). The npm side still published fine. Fallback if the tag/release is missing:

```bash
gh release create v1.0.0 --target main --title "v1.0.0" --notes "<changelog entry>"
```

## Changesets

A changeset is a Markdown file under `.changeset/` with frontmatter and a body:

```md
---
"changeset-formatter": patch
---

fix: load formatter config from `.changesetformatterrc.json`
```

- **Frontmatter** — `"<pkg>": "<bump>"` where bump is `major` | `minor` | `patch`. For the first stable release the breaking changes used `major` with `!`-style summaries.
- **Body** — one or more lines in Conventional-Commit style, `type!: message`. A `!` routes the entry to the `breaking` category regardless of type. Unknown types fall under `uncategorized`.
- **Naming** — no required convention; use a short `kebab-case` slug describing the change.

The summary body becomes the changelog line (final formatting handled by the formatter hook + CLI), so write it as the changelog entry you want readers to see — not a full document.

## Category vocabulary

Categorization is off by default (`categorize: false` in the defaults) but enabled for this repo via `.changesetformatterrc.json`. Categories are configured there; the `breaking` category is built into the formatter's defaults. Full glossary in `CONTEXT.md`.
