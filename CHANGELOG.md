# changeset-formatter

## 1.0.0 (2026-09-08)

### 🚨 Breaking Changes

- Bump `@changesets/cli` peer from `^2.30.0` to `^3.0.0` (1d08892)
- Require `Node` `^24.11.0` (previously no engines floor was declared) (1d08892)
- Replace `tsup` with `tsdown` as the bundler (1d08892)

### ✨ Features

- Recognize `!` as a breaking change marker in summaries (d3567eb)

### 🏡 Chores

- Upgrade `biome` to `2.5.x` (1d08892)
- Align CI build job with `.nvmrc` (Node 24) (1d08892)
- Upgrade `typescript` to `7` (1d08892)

### 🛠️ Fixes

- Load formatter config from `.changesetformatterrc.json` (ff25b00)

### 🛡️ Security

- Upgrade `cosmiconfig` to `10.0.1` (fixes `js-yaml` security vulnerabilities) (1d08892)
- Prevent ReDoS by rejecting summary lines above 1000 characters (1d08892)
