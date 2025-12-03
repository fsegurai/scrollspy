# 📦 Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## [Unreleased]

### 🔐 Security

- **Removed dependencies** — removed unused dependencies.
    - Dev Dependencies
        - Removed `ts-node` dependency.
        - Removed `tsd` dependency.

---

## [1.0.3] - 2025-11-20

### 🐛 Fixed

- For rollup configuration file, fixed `process` import reference to point to `node:process` directly.

### 🔧 Changed

- Refactored the local storage theme keyword to a more accurate one based on the project.
- Improved keywords declared in the `package.json` files.

### 🔐 Security

- Improved test coverage to %90 +.
- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Dependencies
        - `@material/web` from `2.4.0` to `2.4.1`
        - `marked` from `16.4.0` to `17.0.0`
        - `marked-highlight` from `2.2.2` to `2.2.3`
    - Dev Dependencies
        - `@babel/core` from `7.28.4` to `7.28.5`
        - `@babel/preset-env` from `7.28.3` to `7.28.5`
        - `@eslint/js` from `9.37.0` to `9.39.1`
        - `@rollup/plugin-commonjs` from `28.0.8` to `29.0.0`
        - `@rollup/plugin-replace` from `6.0.2` to `6.0.3`
        - `@rollup/plugin-typescript` from `12.1.4` to `12.3.0`
        - `@types/node` from `24.8.1` to `24.10.1`
        - `@typescript-eslint/eslint-plugin` from `8.46.1` to `8.46.4`
        - `@typescript-eslint/parser` from `8.46.1` to `8.46.4`
        - `eslint` from `9.37.0` to `9.39.1`
        - `globals` from `16.4.0` to `16.5.0`
        - `rimraf` from `6.0.1` to `6.1.0`
        - `rollup` from `4.52.4` to `4.53.2`
        - `typescript-eslint` from `8.46.1` to `8.46.4`

## [1.0.2] - 2025-10-16

### 🔐 Security

- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Dev Dependencies
        - `@rollup/plugin-commonjs` from `28.0.6` to `28.0.8`
        - `@types/node` from `24.7.2` to `24.8.1`

---

## [1.0.1] - 2025-10-13

### 🔐 Security

- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Dependencies
        - `marked` from `16.3.0` to `16.4.0`
    - Dev Dependencies
        - `@eslint/js` from `9.36.0` to `9.37.0`
        - `@rollup/plugin-node-resolve` from `16.0.1` to `16.0.3`
        - `@types/node` from `24.5.2` to `24.7.2`
        - `@typescript-eslint/eslint-plugin` from `8.44.0` to `8.46.1`
        - `@typescript-eslint/parser` from `8.44.0` to `8.46.1`
        - `babel-jest` from `30.1.2` to `30.2.0`
        - `dotenv` from `17.2.2` to `17.2.3`
        - `eslint` from `9.36.0` to `9.37.0`
        - `jest` from `30.1.3` to `30.2.0`
        - `jest-cli` from `30.1.3` to `30.2.0`
        - `jest-environment-jsdom` from `30.1.2` to `30.2.0`
        - `rollup` from `4.52.0` to `4.52.4`
        - `typescript` from `5.9.2` to `5.9.3`
        - `typescript-eslint` from `8.44.0` to `8.46.1`

### 🛠 Changed

- Implemented new dev dependency for `eslint.config.js` configuration file.
    - `globals` --> `16.4.0`

---

## [1.0.0] - 2025-09-20

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
- **SPA support** — works seamlessly with single-page applications (SPA) and dynamic content using the
  `fragmentAttribute` option.

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

### From 1.0.1 -> 1.0.2

- This release includes only dependency updates and no breaking changes.
- ✅ Migration recommended but not required.

### From 1.0.0 -> 1.0.1

- This release includes only dependency updates and no breaking changes.
- ✅ Migration recommended but not required.

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
- ⚠️ IE is **not supported**

---

[unreleased]: https://github.com/fsegurai/scrollspy/compare/v1.0.3...HEAD

[1.0.3]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.3

[1.0.2]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.2

[1.0.1]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.1

[1.0.0]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.0
