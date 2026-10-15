# Feature: versioned-docs

## Objective

Add real, versioned documentation for `@fsegurai/scrollspy` 2.1.0 under `docs/2.1.0/`, generated into
`manifest.json` and `search-index.json` with `@fsegurai/manifest-generator`.

## Problem / why

The only documentation is the root README. A versioned docs tree (mirroring the manifest-generator repo convention)
lets a docs site render navigation and search per release.

## Scope

- `docs/2.1.0/content/**` Markdown pages with supported frontmatter only.
- `docs/2.1.0/manifest.json`, `docs/2.1.0/search-index.json` (generated).
- Root `package.json`: dev dependency `@fsegurai/manifest-generator@^1.1.0` and `generate:manifest` script.
- `bun.lock` update.

Out of scope: source changes, other scripts, the unrelated staged `packages/scrollspy/src/events.d.ts`.

## Constraints

- Document only APIs present in `packages/scrollspy/src/**`.
- Frontmatter keys restricted to the 21 supported by manifest-generator.
- Branch: `development`. No commits or branches - user commits manually.

## Route

Delegated direct (one bounded writer). Trigger: writer trigger (20+ non-trivial new files).

## Checklist

- [x] T1 Docs content: overview, getting-started, features, guides, api, examples, help.
- [x] T2 Wiring + generation: dev dependency, `generate:manifest` script, generated JSON.
- [x] T3 Validation: `--validate` exits 0, generation produces both JSON files. No commits - user commits manually.
- [x] T4 Past-version snapshots: `docs/{1.0.0,1.0.1,1.0.2,1.0.3,2.0.0}/` with content, `manifest.json`, `search-index.json`.

## Acceptance criteria

- Every page has `label`, `description`, `order`, `tags`; section `README.md` files also have `breadcrumbTitle`.
- `bunx manifest-generator --validate --docs-root ./docs/2.1.0/content` exits 0.
- `bun run generate:manifest` writes `docs/2.1.0/manifest.json` and `docs/2.1.0/search-index.json`.

## Checks

- Validate command exit code.
- Generate command exit code and `jq length` of both outputs.
- `git status --porcelain` shows `events.d.ts` still only staged.

## Test-first exception

Passive documentation; no runnable RED test applies. Structural checks (validator + generator) are used instead.

## Progress / evidence

- T1: 27 Markdown pages under `docs/2.1.0/content/` (overview + 6 sections).
- T2: `@fsegurai/manifest-generator@1.1.0` installed as dev dependency; `generate:manifest` script added.
- T3 evidence:
  - `bunx manifest-generator --validate --docs-root ./docs/2.1.0/content`: exit 0, 27 valid, 0 invalid, 0 warnings.
  - Note: `--validate` ignores `--route` and scans `--docs-root` (default cwd); use `--docs-root` for scoped validation.
  - `bun run generate:manifest`: exit 0; `manifest.json` has 7 top-level sections, `search-index.json` has 27 entries.
- Commit: none. An earlier commit was undone at the user's request; all changes are uncommitted on `development`.

### T4 past-version snapshots

Route: delegated direct (one bounded writer; 140 new Markdown pages across 5 versions). Source read only via
`git show <rev>:<path>`; no mutating git. **No commits - user commits manually.**

| Version | Source rev | Pages | Key differences from the next version |
|---------|------------|-------|---------------------------------------|
| 2.0.0 | `faec553` (release commit, last source change before 2.1.0 work) | 28 | No `gumshoedeactivate` dispatch (type declared only); near-bottom offset uses fixed 50px / `offset - 100` |
| 1.0.3 | `1099707` (tag `v1.0.3`) | 28 | JS `src/index.js` + hand-written `index.d.ts`; `ScrollspyOptions`/`ScrollspyEvent`; no `ContentPosition`, no `nav` getter; numeric `offset` only; ESM entry `src/index.js`, CJS `module.exports`, UMD global `scrollspy` |
| 1.0.2 | `ffc953e` (Merged PR 186: Release v1.0.2) | 28 | Library source identical to 1.0.3; whats-new only |
| 1.0.1 | `49a01e6` (last main merge at 1.0.1; release merge `4cc5c71`) | 28 | Library source identical to 1.0.2; whats-new only |
| 1.0.0 | `c16292b` (Merged PR 85, contains `b957ba2 rel: 1.0.0`) | 28 | Library source identical to 1.0.1; whats-new only |

Each version adds `help/whats-new.md` (from its CHANGELOG entry) and `publishedAt` on the overview page.

T4 evidence (per version, all five identical):

- `bunx manifest-generator --validate --docs-root ./docs/<v>/content`: exit 0, 28 valid, 0 invalid, 0 warnings.
- `bunx manifest-generator --route ./docs/<v>/content --output ./docs/<v>`: exit 0; `manifest.json` length 7,
  `search-index.json` length 28.
- `git status --porcelain`: only pre-existing changes plus untracked `docs/` and `odd/`.
- Note: at tag `v1.0.3`, `packages/scrollspy/package.json` still reads `1.0.2` (root reads `1.0.3`).

## Next step

User decides on push/PR.
