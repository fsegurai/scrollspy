---
label: Types
description: TypeScript declarations shipped with @fsegurai/scrollspy 1.0.x in src/index.d.ts.
order: 4
tags: [ "api", "types", "typescript" ]
keywords: [ "ScrollspyOptions", "ScrollspyEvent", "DocumentEventMap", "index.d.ts" ]
---

# Types

```ts
import type { ScrollspyOptions, ScrollspyEvent } from '@fsegurai/scrollspy';
```

The declarations are hand-written in `src/index.d.ts`. They describe intent, and in two places they differ from the
runtime (see the notes below).

## `ScrollspyOptions`

```ts
interface ScrollspyOptions {
  nav?: string;
  content?: string;
  nested?: boolean;
  nestedClass?: string;
  offset?: number | (() => number);
  bottomThreshold?: number;
  reflow?: boolean;
  events?: boolean;
  observe?: boolean;
  fragmentAttribute?: string | ((item: Element) => string | null);
  navItemSelector?: string;
}
```

See [Options](options.md) for defaults.

## `ScrollspyEvent`

```ts
interface ScrollspyEvent {
  target: Element;
  content: Element;
  nav: Element;
}
```

## `DocumentEventMap` augmentation

```ts
declare global {
  interface DocumentEventMap {
    'gumshoeactivate': CustomEvent<ScrollspyEvent>;
  }
}
```

## Declaration vs runtime

| Declared | Runtime in 1.0.x |
|----------|------------------|
| `offset` accepts `() => number` | Only numbers work; functions are not called |
| `destroyListeners()` not declared | Method exists and is public |
| No instance fields declared | `settings`, `nav`, `contents`, `current`, `navMap` exist as public properties |

There is no `ContentPosition` type in 1.0.x; `getPositions()` is typed inline as `{ content: Element; offset: number }[]`.
