---
"changeset-formatter": major
---

## 1.0.0

First stable release with an explicit API stability commitment.

### Breaking changes

- Require Node ^24.11.0 (previously no engines floor was declared)
- Bump @changesets/cli peer from ^2.30.0 to ^3.0.0
- Replace tsup with tsdown as the bundler

### Security

- Prevent ReDoS by rejecting summary lines above 1000 characters

### Chores

- Upgrade TypeScript to 7
- Upgrade Biome to 2.5.x
- Upgrade cosmiconfig to 10.0.1 (fixes js-yaml security vulnerabilities)
- Align CI build job with .nvmrc (Node 24)
