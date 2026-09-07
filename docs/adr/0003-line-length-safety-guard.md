# ADR-0003: 1000-Character Line-Length Safety Guard

## Status

Accepted

## Context

`getReleaseLine` parses changeset summary lines using a regex:

```ts
/^(\w+)(?:\([^)]+\))?:\s*(.+)$/
```

The summary content is untrusted (any contributor can write a changeset file). A pathological input — for example, a line repeated to millions of characters — could trigger catastrophic backtracking or excessive memory use during regex matching.

The cost of this risk is small in practice (changeset summaries are short, human-written prose), but the cost of a guard is also small.

## Decision

Throw `Error('Line too long to safely parse')` when any summary line exceeds 1000 characters. The check is enforced in both the flat and categorized code paths in `src/formatter/index.ts`.

1000 characters is comfortably above any legitimate changeset message (which are typically 50-150 characters) and well below the threshold where regex parsing becomes a concern.

## Alternatives Considered

- **No guard, trust the input**: rejected — defense in depth is cheap, and changesets are public-facing.
- **Lower threshold (e.g., 500)**: rejected — risks rejecting legitimate long-form descriptions.
- **No regex at all — tokenize by hand**: rejected — the regex is simple and the current performance is fine for inputs within the guard threshold.
- **Throw an `Error` vs. return a fallback string**: rejected fallback because a malformed summary is a hard failure, not something to silently paper over.

## Consequences

- Legitimate changesets are unaffected (1000 chars is very generous).
- Pathological input is rejected with a clear, actionable error message.
- The check is duplicated in both branches of `categorizeSummary` (flat and categorized) — if a future refactor merges them, deduplicate the guard.
- A test in `formatter.test.ts` exercises this guard with a 1001-character line.

## Date

2025
