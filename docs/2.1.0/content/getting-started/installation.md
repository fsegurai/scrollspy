---
label: Installation
description: Install @fsegurai/scrollspy from npm and choose ESM, CommonJS, or UMD.
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

## Build formats

The published `dist/` folder contains one build per module system:

| Format | File | Resolved by |
|--------|------|-------------|
| ES module | `dist/index.esm.js` | `import` (`exports["."].import`, `module`) |
| CommonJS | `dist/index.cjs` | `require` (`exports["."].require`, `main`) |
| UMD | `dist/index.umd.js` | `browser` field, `<script>` tags |
| Types | `dist/types/index.d.ts` | `types` |

## Import

```ts
// ES modules / TypeScript
import ScrollSpy from '@fsegurai/scrollspy';
```

```js
// CommonJS
const ScrollSpy = require('@fsegurai/scrollspy').default;
```

The class is the **default export**. The UMD build exposes it under the global name `Scrollspy` with named exports,
so the class is available as `Scrollspy.default`.

## Next step

Continue with the [Quick Start](quick-start.md).
