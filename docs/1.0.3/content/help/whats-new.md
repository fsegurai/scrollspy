---
label: What's New in 1.0.3
description: Release notes for @fsegurai/scrollspy 1.0.3, a maintenance release with no library behavior changes.
order: 1
tags: [ "help", "changelog", "release-notes" ]
keywords: [ "1.0.3", "maintenance", "test coverage" ]
---

# What's New in 1.0.3

Released 2025-11-20. **No API or runtime changes**: `src/index.js` and `src/index.d.ts` are identical to 1.0.2.
Upgrading needs no code changes.

## Changes

| Area | Change |
|------|--------|
| Build | Rollup config imports `process` from `node:process` directly |
| Demo | Local-storage theme key renamed to a project-specific name |
| Package metadata | Keywords in `package.json` files reorganized and extended |
| Tests | Test suite (`spec/index.test.js`) added, coverage above 90% |
| Dependencies | Dev and demo dependencies updated (for example `marked` 16.4.0 to 17.0.0, `rollup` 4.52.4 to 4.53.2) |

> At the `v1.0.3` tag, the root `package.json` reads `1.0.3` while `packages/scrollspy/package.json` still reads
> `1.0.2`.

The full dependency list is in the
[1.0.3 changelog entry](https://github.com/fsegurai/scrollspy/blob/main/CHANGELOG.md).
