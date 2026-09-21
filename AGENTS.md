# AGENTS Guide for `scrollspy`

## Read first
- Start with `packages/scrollspy/src/index.ts` (core behavior), then `packages/scrollspy/spec/index.test.ts` (expected edge cases), then `demo/scripts/utils/toc.ts` (real integration pattern).
- Types live separately in `packages/scrollspy/src/types.ts` (options, event payload, `DocumentEventMap` augmentation).
- Only `README.md` at repo root exists as public docs; there is no per-package README anymore.

## Big picture architecture
- This is a Bun workspace monorepo (`package.json` -> `workspaces: ["packages/*"]`) with one publishable package: `packages/scrollspy`.
- Core library is a single class (`ScrollSpy`) that owns lifecycle (`init` -> `getContents` -> `detect` -> listeners -> optional observer).
- Primary data flow in `ScrollSpy`: nav anchors -> fragment extraction (`href` or `fragmentAttribute`) -> `document.getElementById()` -> `contents[]` + `navMap`.
- Activation flow: `detect()` computes active section from offsets + viewport, `deactivateAll()` clears classes, `activate()` emits `gumshoedeactivate` for the previously active content, updates classes for the new active content, and emits `gumshoeactivate`.
- Demo flow (`demo/scripts/index.ts` / `playground.ts`): render markdown -> generate TOC/headings with `data-gumshoe` -> initialize ScrollSpy.

## Developer workflows (actual commands)
- Install: `bun install`
- Build everything: `bun run build` (builds each package via `vite build`, builds the demo via `vite build`, and copies `README.md`/`LICENSE` into `demo/dist/`)
- Dev server for demo: `bun run start` (Vite dev server); `bun run start:prod` previews the production build
- Tests (workspace package tests): `bun run test` (runs `bun test` per package); `bun run test:coverage` for coverage
- Coverage defaults are enforced by Bun config (`bunfig.toml`): threshold `0.9`, output `coverage/`.
- Lint/format: Biome-driven, not ESLint — `bun run lint` (packages + demo), `bun run lint:check` (`biome check`, no fixes), `bun run lint:fix` / `bun run format` (`biome check --write`).
- Security scan helpers live in `Makefile` (`make trivy`, `make trivy-full`, `make trivy-ci`).

## Project-specific conventions
- Style is Biome-driven (`biome.json`), not ESLint — single quotes, semicolons, 2-space indent, trailing commas where Biome's defaults apply.
- Source is TypeScript for the library (`packages/scrollspy/src/index.ts`) with types split into `packages/scrollspy/src/types.ts`; update both when the public API changes.
- Event contract is `gumshoeactivate` / `gumshoedeactivate` via `CustomEvent` with `detail: { target, content, nav }`. Both events are dispatched at runtime (see `activate()`), not just declared in types.
- Integration expects headings marked as `data-gumshoe` (demo sets this in `generateTOC()`), unless consumers override `content` option. Note: the `content` selector is metadata only — core matching always resolves targets via `getElementById()` from nav `href`/`fragmentAttribute`, not by querying `content`.
- Fragment mapping supports SPA-style URLs and custom attributes via `fragmentAttribute` + `navItemSelector`; preserve this behavior when changing parsing logic.

## Testing and regression hotspots
- Tests rely on JSDOM + mocked layout metrics (`offsetTop`, `offsetParent`, `pageYOffset`), so scroll logic changes should add/adjust mocks in `packages/scrollspy/spec/index.test.ts`.
- High-risk logic: bottom-of-page activation (`bottomThreshold`), dynamic offset in `getViewportPosition()` (both derive from the same `bottomThreshold` setting — keep them in sync if you touch either), and listener/observer cleanup in `destroy()`.
- `getContents()` has many edge-case tests (missing href, route fragments, null selectors, missing targets); keep new behavior compatible with these cases.

## Build and env integration points
- Demo build/dev both go through root `vite.config.ts` (Vite, not Rollup); env values (`NODE_ENV`, `HOST_URL`) come from `.env` (see `env.example`) and are exposed via `import.meta.env` in demo code.
- `demo/scripts/const/const-env-reference.ts` uses string placeholders (`'NODE_ENV'`, `'HOST_URL'`) resolved at build time.
- The package itself also builds with `vite build` (`packages/scrollspy/vite.config.ts`), producing `dist/index.esm.js` (ESM), `dist/index.cjs` (CJS), `dist/index.umd.js` (UMD/browser), and `dist/types/index.d.ts`, per the `exports` map in `packages/scrollspy/package.json`.

## Practical agent tips
- For feature work in scroll behavior, update in this order: `src/index.ts` -> `src/types.ts` -> `spec/index.test.ts` -> relevant README options/events docs.
- For demo-only UI changes, stay in `demo/scripts/*` and `demo/styles/*`; avoid package API edits unless explicitly requested.
- If adding options, validate defaults in constructor settings and add at least one test covering interaction with `detect()` or `getContents()`.
