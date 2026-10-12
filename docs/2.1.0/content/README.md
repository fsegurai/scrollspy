---
label: Documentation Home
description: Documentation for @fsegurai/scrollspy 2.1.0, a dependency-free scrollspy for navigation and tables of contents.
order: 0
tags: [ "documentation", "overview", "scrollspy" ]
keywords: [ "table of contents", "toc", "navigation", "typescript" ]
breadcrumbTitle: Home
---

# @fsegurai/scrollspy Docs

`@fsegurai/scrollspy` highlights navigation links based on the scroll position of the page. It has no runtime
dependencies, is written in TypeScript, and ships ESM, CommonJS, UMD, and type declaration builds.

## Quick start

1. Install the package: `npm install @fsegurai/scrollspy`.
2. Give each section an `id` and link to it from your nav (`<a href="#intro">`).
3. Create an instance: `new ScrollSpy('#toc')`.
4. Style the `.active` class in your nav.

```ts
import ScrollSpy from '@fsegurai/scrollspy';

const spy = new ScrollSpy('#toc', { offset: 80 });
```

## What it does

| Capability | Where to read |
|------------|---------------|
| Marks the nav item of the current section with `active` | [Active section detection](features/active-section-detection.md) |
| Marks parent `<li>` items in nested TOCs | [Nested navigation](features/nested-navigation.md) |
| Compensates for fixed headers | [Scroll offset](features/scroll-offset.md) |
| Maps nav items by attribute or function instead of `href` | [Fragment mapping](features/fragment-mapping.md) |
| Dispatches `gumshoeactivate` / `gumshoedeactivate` | [Custom events](features/custom-events.md) |
| Re-maps sections when the DOM changes | [Dynamic content](features/dynamic-content.md) |

## Sections

- [Getting Started](getting-started/README.md) - install and first instance
- [Features](features/README.md) - what the library does, one page per feature
- [Guides](guides/README.md) - task-oriented walkthroughs
- [API](api/README.md) - options, methods, events, and types
- [Examples](examples/README.md) - copy-paste setups
- [Help](help/README.md) - FAQ and troubleshooting
