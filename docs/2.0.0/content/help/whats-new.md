---
label: What's New in 2.0.0
description: Release notes for @fsegurai/scrollspy 2.0.0 and what changes when upgrading from 1.0.x.
order: 1
tags: [ "help", "changelog", "release-notes" ]
keywords: [ "2.0.0", "breaking changes", "upgrade", "typescript migration" ]
---

# What's New in 2.0.0

Released 2026-04-18. The library was rewritten in TypeScript and the package now ships compiled builds only.
Runtime behavior is unchanged except where noted below.

## Breaking changes

| Area | 1.0.x | 2.0.0 |
|------|-------|-------|
| Source language | JavaScript + hand-written `index.d.ts` | TypeScript, declarations generated into `dist/types/` |
| ES module entry | `src/index.js` | `dist/index.esm.js` |
| CommonJS entry | `dist/index.cjs` (class is `module.exports`) | `dist/index.cjs` (class is `.default`) |
| UMD global | `scrollspy` (the class) | `Scrollspy` (named exports; class is `Scrollspy.default`) |
| Type names | `ScrollspyOptions`, `ScrollspyEvent` | `ScrollSpyOptions`, `ScrollSpyEvent`, plus `ContentPosition` |
| `files` in `package.json` | `lib/`, `src/` | `dist/` |

## New in the API

- `nav` is a typed read-only getter. Other internal state (`settings`, `contents`, `current`, `navMap`) is `private`.
- `offset` accepts a function `() => number`; it is called on every detection.
- `fragmentAttribute` explicitly accepts `null` in its type.
- `DocumentEventMap` declares both `gumshoeactivate` and `gumshoedeactivate` (only `gumshoeactivate` is dispatched).
- Near the bottom with no mapped sections, detection returns no active section instead of throwing.
- `observe` falls back to `globalThis.MutationObserver` when the global is not in scope.

## Upgrade checklist

- [ ] Rename type imports: `ScrollspyOptions` to `ScrollSpyOptions`, `ScrollspyEvent` to `ScrollSpyEvent`.
- [ ] CommonJS: change `require('@fsegurai/scrollspy')` to `require('@fsegurai/scrollspy').default`.
- [ ] UMD: change `new scrollspy(...)` to `new Scrollspy.default(...)`.
- [ ] Stop reading `settings`, `contents`, `current`, or `navMap` from TypeScript; they are private.

## Tooling (contributors)

- Rollup replaced by Vite; Jest replaced by `bun test`.
- Root `package.json` declares engines `node >=22`, `bun >=1.3.0`, `npm >=10`.
- Dependency updates are listed in the
  [2.0.0 changelog entry](https://github.com/fsegurai/scrollspy/blob/main/CHANGELOG.md).
