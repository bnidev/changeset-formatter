# Error Handling

**Rule: always try/catch in async functions and around I/O.** No unhandled rejections, no raw stack traces from file operations.

## Three patterns this codebase uses

### 1. Throw on invalid input

When the caller passed something that cannot be processed, throw a descriptive `Error`. Let it propagate — the caller decides what to do.

```ts
// In src/formatter/index.ts
if (line.length > 1000) {
  throw new Error('Line too long to safely parse')
}
```

`@changesets/cli` catches this and surfaces it to the user.

### 2. Catch and fall back to defaults

When the failure is recoverable (config file missing or broken, plugin failed to load), catch and return a sensible default. Log so the user knows something went wrong.

```ts
// In src/config/index.ts
try {
  const result = await explorer.search()
  if (result?.config && typeof result.config === 'object') {
    return mergeConfig(result.config, defaultConfig)
  }
  return defaultConfig
} catch (err) {
  console.error('Error loading config:', err)
  return defaultConfig
}
```

### 3. Catch and exit with a friendly message

When the operation is critical to the program's purpose (reading the changelog file, writing the output), catch and exit. Don't dump a stack trace to the user.

```ts
// In src/cli/index.ts
try {
  content = fs.readFileSync(absPath, 'utf-8')
} catch (err) {
  console.error(
    `[changeset-formatter] Could not read "${changelogPath}": ${
      err instanceof Error ? err.message : String(err)
    }`
  )
  process.exit(1)
}
```

## Don't

- Don't swallow errors silently (`catch {}`)
- Don't rethrow without adding context
- Don't use `console.error` for recoverable warnings — use `console.warn`
- Don't `process.exit(1)` from library code — only from CLI entry points
