---
label: What's New in 1.0.0
description: Release notes for @fsegurai/scrollspy 1.0.0, the first stable release.
order: 1
tags: [ "help", "changelog", "release-notes" ]
keywords: [ "1.0.0", "first release", "stable" ]
---

# What's New in 1.0.0

Released 2025-09-20. First stable release of `@fsegurai/scrollspy`.

## What ships

| Capability | Option or method |
|------------|------------------|
| Zero runtime dependencies, vanilla ES module | - |
| Nav-to-section mapping from `href` hashes, including `/route#fragment` | default |
| Custom mapping by attribute or function | `fragmentAttribute`, `navItemSelector` |
| Nested navigation parent class | `nested`, `nestedClass` |
| Fixed-header offset (numeric) | `offset` |
| Last-section activation near the page bottom | `bottomThreshold` |
| Re-detect on resize | `reflow` |
| Auto-refresh on DOM mutations | `observe` |
| `requestAnimationFrame`-throttled scroll handling | - |
| `gumshoeactivate` custom event | `events` |
| Manual control | `setup()`, `refresh()`, `detect()`, `destroy()`, `destroyListeners()` |
| `Map` cache of section id to nav link | - |

## Changelog claims vs code

The 1.0.0 changelog and README describe a few things the code does not do. These docs follow the code:

| Claim | Actual 1.0.0 behavior |
|-------|-----------------------|
| `gumshoedeactivate` event | Not dispatched |
| Custom offset calculation (function offset) | `offset` must be a number |
| Multiple active sections | One section is active at a time |

The full entry is in the [changelog](https://github.com/fsegurai/scrollspy/blob/main/CHANGELOG.md).
