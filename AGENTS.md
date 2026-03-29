# AGENTS Guide for `scrollspy`

## Read first
- Start with `packages/scrollspy/src/index.js` (core behavior), then `packages/scrollspy/spec/index.test.js` (expected edge cases), then `demo/scripts/utils/toc.ts` (real integration pattern).
- `README.md` and `packages/scrollspy/README.md` are effectively the same public docs; treat root as canonical for repo-level work.

## Big picture architecture
- This is a Bun workspace monorepo (`package.json` -> `workspaces: ["packages/*"]`) with one publishable package: `packages/scrollspy`.
- Core library is a single class (`ScrollSpy`) that owns lifecycle (`init` -> `getContents` -> `detect` -> listeners -> optional observer).
- Primary data flow in `ScrollSpy`: nav anchors -> fragment extraction (`href` or `fragmentAttribute`) -> `document.getElementById()` -> `contents[]` + `navMap`.
- Activation flow: `detect()` computes active section from offsets + viewport, `deactivateAll()` clears classes, `activate()` updates classes and emits events.
- Demo flow (`demo/scripts/index.ts` / `playground.ts`): render markdown -> generate TOC/headings with `data-gumshoe` -> initialize ScrollSpy.

## Developer workflows (actual commands)
- Install: `bun install`
- Build everything: `bun run build` (build package + demo + copy `README.md`/`LICENSE` into `demo/`)
- Dev server for demo: `bun run dev` (Rollup + `rollup-plugin-dev` at `localhost:8000` from `rollup.config.js`)
- Tests (workspace package tests): `bun run test`
- Coverage defaults are enforced by Bun config (`bunfig.toml`): threshold `0.9`, output `coverage/`.
- Lint: `bun run lint`; strict check mode: `bun run lint:check`.
- Security scan helpers live in `Makefile` (`make trivy`, `make trivy-full`, `make trivy-ci`).

## Project-specific conventions
- Style is ESLint-driven with strict formatting (`eslint.config.js`): single quotes, semicolons, 2-space indent, trailing commas (multiline).
- Source is plain JS for library (`packages/scrollspy/src/index.js`) with a hand-maintained `.d.ts` (`packages/scrollspy/src/index.d.ts`); update both when API changes.
- Event contract is `gumshoeactivate` / `gumshoedeactivate` via `CustomEvent` with `detail: { target, content, nav }`.
- Integration expects headings marked as `data-gumshoe` (demo sets this in `generateTOC()`), unless consumers override `content` option.
- Fragment mapping supports SPA-style URLs and custom attributes via `fragmentAttribute` + `navItemSelector`; preserve this behavior when changing parsing logic.

## Testing and regression hotspots
- Tests rely on JSDOM + mocked layout metrics (`offsetTop`, `offsetParent`, `pageYOffset`), so scroll logic changes should add/adjust mocks in `packages/scrollspy/spec/index.test.js`.
- High-risk logic: bottom-of-page activation (`bottomThreshold`), dynamic offset in `getViewportPosition()`, and listener/observer cleanup in `destroy()`.
- `getContents()` has many edge-case tests (missing href, route fragments, null selectors, missing targets); keep new behavior compatible with these cases.

## Build and env integration points
- Root `rollup.config.js` injects `HOST_URL` and `NODE_ENV` via `@rollup/plugin-replace`; values come from `.env` (see `env.example`).
- `demo/scripts/const/const-env-reference.ts` uses string placeholders (`'NODE_ENV'`, `'HOST_URL'`) that are replaced at bundle time.
- Package bundles are generated in `packages/scrollspy/rollup.config.js` as UMD (`dist/index.umd.js`) and CJS (`dist/index.cjs`); ESM export points to `src/index.js`.

## Practical agent tips
- For feature work in scroll behavior, update in this order: `src/index.js` -> `src/index.d.ts` -> `spec/index.test.js` -> relevant README options/events docs.
- For demo-only UI changes, stay in `demo/scripts/*` and `demo/styles/*`; avoid package API edits unless explicitly requested.
- If adding options, validate defaults in constructor settings and add at least one test covering interaction with `detect()` or `getContents()`.
