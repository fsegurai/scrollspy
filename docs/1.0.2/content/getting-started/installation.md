---
label: Installation
description: Install @fsegurai/scrollspy 1.0.x from npm and pick the ES module, CommonJS, or UMD entry point.
order: 1
tags: [ "installation", "npm", "setup" ]
keywords: [ "bun", "esm", "cjs", "umd" ]
---

# Installation

## Install the package

```bash
npm install @fsegurai/scrollspy
# or
bun add @fsegurai/scrollspy
```

The package has no runtime dependencies.

## Entry points

The 1.0.x `package.json` points each module system at a different file:

| Format | File | Resolved by |
|--------|------|-------------|
| ES module | `src/index.js` (unbundled source) | `import` (`exports["."].import`, `module`) |
| CommonJS | `dist/index.cjs` (Rollup build) | `require` (`exports["."].require`, `main`) |
| UMD | `dist/index.umd.js` (Rollup build) | `browser` field, `<script>` tags |
| Types | `src/index.d.ts` (hand-written) | `types` |

## Import

```js
// ES modules / TypeScript
import ScrollSpy from '@fsegurai/scrollspy';
```

```js
// CommonJS: the class is module.exports itself
const ScrollSpy = require('@fsegurai/scrollspy');
```

The class is the **only** export (default export). The UMD build exposes it directly as the global `scrollspy`
(lowercase):

```html
<script src="dist/index.umd.js"></script>
<script>
  const spy = new scrollspy('#toc');
</script>
```

## Next step

Continue with the [Quick Start](quick-start.md).
