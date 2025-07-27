# 📦 Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## [Unreleased]

---

## [1.0.0] - 2025-07-09

### 🚀 Added

- **Zero dependencies** — lightweight, pure vanilla JS with ES6+ support.
- **Dynamic navigation detection** — automatically maps navigation anchors to content sections.
- **Customizable selector support** — configure navigation and content selectors (`nav`, `content`).
- **Nested navigation support** — highlight parent navigation items with `nested` and `nestedClass` options.
- **Offset support** — adjust scroll position offsets for fixed headers or UI elements.
- **Bottom detection** — intelligently detects when the last section is active based on scroll position and the distance
  from the bottom of the page (`bottomThreshold`).
- **Reflow on resize** — optionally recalculates positions on window resize (`reflow`).
- **Observe DOM mutations** — automatically refreshes navigation targets when content changes (`observe`).
- **Smooth scroll tracking** — updates active navigation items as you scroll with requestAnimationFrame debouncing.
- **Manual control methods** — `setup()`, `refresh()`, `detect()`, and `destroy()` for fine control.
- **Custom events** — emits `gumshoeactivate` events on active section changes for integration.
- **Performance-optimized** — caches lookups with a `Map` for quick DOM access.
- **Intelligent bottom detection** — adjusts behavior near the bottom of the page to ensure last section activation.
- **Flexible activation logic** — supports multiple active sections and custom offset calculation.
- **Clean API** — class-based usage with simple initialization and teardown.
- **SPA support** — works seamlessly with single-page applications (SPA) and dynamic content using the `fragmentAttribute` option.

### 🛠 Changed

- Debounced `scroll` and `resize` handlers using `requestAnimationFrame`.
- Improved internal caching via `Map` for faster DOM lookup.
- Scroll tracking logic improved for edge cases (e.g. last item not being activated).
- Internal method names and structure are reorganized for clarity.
- Support for both hash and full URLs in `href` for navigation anchors.
- Defensive checks in `getContents` to avoid errors with missing fragments or targets.
- `fragmentAttribute` now accepts a function for advanced mapping scenarios.
- Added `destroyListeners` method for proper cleanup of scroll/resize listeners.
- Added `navItemSelector` option to customize which anchors are considered navigation items.
- Improved documentation for SPA/Angular scenarios and advanced usage in README.

---

## 📦 Dependencies

### Runtime

- No external dependencies (zero dependency library).
- Native browser features (ES6+, `CustomEvent`, `MutationObserver`, etc.).

### Development

- [`bun`](https://bun.sh/) — JS runtime and package manager
- [`typescript`](https://www.typescriptlang.org/) — static type checking
- [`eslint`](https://eslint.org/) — code linting and formatting
- [`jest`](https://jestjs.io/) — testing framework

---

## 🔁 Migration Guide

### From 0.x → 1.0.0

- This is the first stable release of the `scrollspy` library.
- ✅ No migration needed.

---

## 💥 Breaking Changes

- N/A — initial release

---

## ✅ Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ ES6+ support required
- ⚠️ IE is **not supported**

---

[unreleased]: https://github.com/fsegurai/scrollspy/compare/v1.0.0...HEAD

[1.0.0]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.0
