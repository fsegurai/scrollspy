# 📦 Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

---

## [Unreleased]

No changes have been made yet.

---

## [2.1.0] - 2026-09-21

### 🔧 Infrastructure

- **Linting migration: ESLint → Biome** — replaced `eslint`, `@eslint/js`, `globals`,
  `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, and `typescript-eslint` with a single
  `@biomejs/biome` dependency.
	- Added `biome.json` (formatter + linter, single quotes, trailing commas, 120-char line width, import sorting).
	- Removed `eslint.config.js`.
	- `lint:check`/`lint:fix`/`lint:packages`/`lint:demo` now run Biome; added `format`/`format:check` aliases.
	- Reformatted every `packages/*/src/{index,utils}.ts` file and the `demo/` scripts/styles with Biome — formatting
	  and import-order only, no palette, tag, or behavioral changes.
	- Renamed `postbuild:packages`/`postbuild:demo` to `build:packages:metadata`/`build:demo:metadata` and updated
	  `build`, `build:packages:doppler`, `build:demo:doppler` to match.
	- Fixed inverted `start`/`start:prod` scripts: `start` now runs the Vite dev server, `start:prod` serves the
	  production build.
	- `.github/workflows/dependency-audit.yml`: bumped `actions/github-script` to `v9` (Node 24 runtime) and added the
	  `issues: write` permission needed to file security-audit issues.
	- Aligned `.editorconfig` with Biome's formatting rules (2-space indent, 120-char line width) across
	  `.js`/`.ts`/`.json`/`.css`.

### 🔧 Changes

- **Removed `manualChunks` split configuration** — dropped the custom chunk split from the Vite config, added missing
  `<title>` elements to SVGs, and standardized `parseInt` radix usage across the codebase.
- **Migrated the Vite config to TypeScript** — replaced `vite.config.js` with `vite.config.ts` and refreshed environment
  typings (`vite-env.d.ts`, `demo/scripts/header.ts`).
- **Migrated to `node:` imports** — adopted `node:`-prefixed imports and arrow-function consistency, and improved
  TypeScript declaration generation with `vite-plugin-dts`.
- **Added Git hooks for quality gates** — Husky `pre-commit` and `pre-push` hooks run linting and format audits with Bun.
- **Updated engine requirements** — raised the minimum Node.js, Bun, and npm versions declared in `package.json`.
- **Cleaned package publishing metadata** — removed `.npmignore` and set `"sideEffects": false` on
  `@fsegurai/scrollspy` for better tree-shaking.
- **Improved the demo TOC utility** — fixed import path resolution and normalized formatting in the TOC script.
- **Enhanced Trivy integration** — expanded the `Makefile` with new scan targets, improved caching, and configurable
  scan options (skip dirs, vulnerability types, severities, CI severities).
- **Migrated the lockfile to version 2** — regenerated `bun.lock` with the v2 format during the dependency update.
- **Normalized configuration and formatting** —
	- Enforced newline consistency in `bunfig.toml`.
	- Normalized CSS across themes (indents and whitespace).
	- Simplified `.editorconfig` by removing redundant and unused rules.
- **Updated CI workflows** — adjusted the labeler and documentation workflows for TypeScript and formatting; aligned
  workflow references and paths with the scrollspy migration and fixed minor CI script formatting.

### 📝 Documentation

- Fixed `AGENTS.md`'s stale "rollup dev server" reference — the build system moved to Vite in an earlier release.
- Added a changelog page to the demo — implemented `demo/changelog.html` with its script, refreshed the demo HTML
  pages, and adjusted the library build configuration.
- Updated the contributing guide — refreshed `CONTRIBUTING.md` with updated tool versions, improved commands, and
  enhanced linting instructions.

### 🔐 Security

- Updated `trivy` to version `0.71.1` to address vulnerabilities in previous versions.
- **Added dependencies**.
	- Dev Dependencies
		- `@biomejs/biome` - `2.5.14` - needed for linting and formatting - replaces ESLint toolchain.
		- `husky` - `9.1.7` - needed for Git hooks to enforce code quality and pre-commit checks.
		- `vite-plugin-dts` - `5.1.1` - needed for generating TypeScript declaration files for the package.
- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
	- Dependencies
		- `@material/web` from `2.4.1` to `2.5.0`
		- `marked` from `18.0.0` to `18.0.13`
	- Dev Dependencies
		- `@types/jsdom` from `28.0.1` to `30.0.0`
		- `@types/node` from `25.6.0` to `26.6.2`
		- `bun-types` from `1.3.12` to `1.4.2`
		- `jsdom` from `29.0.2` to `30.1.10`
		- `portless` from `0.10.3` to `0.15.6`
		- `terser` from `5.46.1` to `5.51.2`
		- `typescript` from `6.0.2` to `7.0.2`
		- `vite` from `8.0.8` to `8.3.0`
	- Removed: `@eslint/js`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint`, `globals`,
	  `typescript-eslint`

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v2.1.0

---

## [2.0.0] - 2026-04-18

### ⚠️ BREAKING CHANGES ⚠️

- Migrated project from `Javascript` to `Typescript`. **(Note**: This change is not backward compatible.)
    - Supported declaration files:
        - `ESM`
        - `CommonJS`
        - `UMD`
        - `Typescript`

### 🚀 Features

- Added a dedicated interface extending the global Window type to safely expose Scrollspy without overwriting existing
  globals used by extensions or the demo playground.
- Introduced shared helper utilities to improve code reuse, readability, and long-term maintainability across the
  codebase.
- Package was migrated to `TypeScript`, improving type safety, tooling support, and maintainability.

### 🔧 Changes

- Refactored extensions tests to support the new `Typescript` project.
- Refactored tests to use `Bun test` instead of `Jest`
- Improved keywords declared in the `package.json` files.
- Improved README files structure and content.

### 🔐 Security

- **Added dependencies**.
    - Dev Dependencies
        - `@types/jsdom` - `28.0.1` - needed for testing purposes only.
        - `@types/prismjs` - `1.26.6` - needed for demo purposes only.
        - `bun-types` - `1.3.12` - needed for testing purposes only.
        - `jsdom` - `29.0.2` - needed for testing purposes only.
        - `portless` - `0.10.3` - needed for local development. Replace port numbers with stable names.
        - `terser` - `5.46.1` - needed for production builds as part of Vite.
        - `vite` - `8.0.8` - needed for development and build processes. Replacement of Rollup.
- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Dependencies
        - `marked` from `17.0.0` to `18.0.0`
        - `marked-highlight` from `2.2.3` to `2.2.4`
    - Dev Dependencies
        - `@eslint/js` from `9.39.1` to `10.0.1`
        - `@types/node` from `24.10.1` to `25.6.0`
        - `@typescript-eslint/eslint-plugin` from `8.47.0` to `8.58.2`
        - `@typescript-eslint/parser` from `8.47.0` to `8.58.2`
        - `eslint` from `9.39.1` to `10.2.0`
        - `globals` from `16.5.0` to `17.5.0`
        - `rimraf` from `6.1.0` to `6.1.3`
        - `typescript` from `5.9.3` to `6.0.2`
        - `typescript-eslint` from `8.47.0` to `8.58.2`
- **Removed dependencies** — removed unused dependencies.
    - Dev Dependencies
        - `@babel/core`
        - `@babel/preset-env`
        - `@rollup/plugin-commonjs`
        - `@rollup/plugin-node-resolve`
        - `@rollup/plugin-replace`
        - `@rollup/plugin-typescript`
        - `@types/jest`
        - `babel-jest`
        - `cpy-cli`
        - `dotenv`
        - `github-slugger`
        - `jest`
        - `jest-cli`
        - `jest-environment-jsdom`
        - `rollup`
        - `rollup-plugin-dev`
        - `ts-node`.
        - `tsd`.

### 🔧 Infrastructure

- **Build System Migration**: Migrated from Rollup to Vite
    - Replaced `rollup` + `rollup-plugin-dev` with `vite`
    - Removed all Rollup plugins (`@rollup/plugin-*`)
    - Added `vite.config.js` for cleaner configuration
    - Benefits:
        - Faster dev server with better HMR (Hot Module Replacement)
        - Built-in environment variable support (`.env` files)
        - Native TypeScript compilation
        - Better CSS/asset handling for future scalability
        - Simplified build configuration
    - Updated dev commands:
        - `bun run dev` now uses `vite serve` (was `rollup -w`)
        - `bun run build:demo` now uses `vite build` (was `rollup -c`)
    - Removed `rollup.config.js` (replaced by `vite.config.js`)
    - Removed build helper script `scripts/build-demo.mjs` (Vite handles env vars natively)

### 📝 Documentation

- Updated GitHub labeler configuration to track `vite.config.js` changes instead of `rollup.config.js`

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v2.0.0

---

## [1.0.3] - 2025-11-20

### 🐛 Fixed

- For the rollup configuration file, fixed `process` import reference to point to `node:process` directly.

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

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v1.0.3

---

## [1.0.2] - 2025-10-16

### 🔐 Security

- **Update dependencies** — address potential vulnerabilities and/or improvements in development dependencies.
    - Dev Dependencies
        - `@rollup/plugin-commonjs` from `28.0.6` to `28.0.8`
        - `@types/node` from `24.7.2` to `24.8.1`

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v1.0.2

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

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v1.0.1

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

**Full Changelog**: https://github.com/fsegurai/scrollspy/commits/v1.0.0

---

## ✅ Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE is **not supported**

---

[unreleased]: https://github.com/fsegurai/scrollspy/compare/v2.1.0...HEAD

[2.1.0]: https://github.com/fsegurai/scrollspy/compare/v2.0.0...v2.1.0

[2.0.0]: https://github.com/fsegurai/scrollspy/compare/v1.0.3...v2.0.0

[1.0.3]: https://github.com/fsegurai/scrollspy/compare/v1.0.2...v1.0.3

[1.0.2]: https://github.com/fsegurai/scrollspy/compare/v1.0.1...v1.0.2

[1.0.1]: https://github.com/fsegurai/scrollspy/compare/v1.0.0...v1.0.1

[1.0.0]: https://github.com/fsegurai/scrollspy/releases/tag/v1.0.0
