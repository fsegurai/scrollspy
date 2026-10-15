---
label: Types
description: TypeScript types exported by @fsegurai/scrollspy.
order: 4
tags: [ "api", "types", "typescript" ]
keywords: [ "ScrollSpyOptions", "ScrollSpyEvent", "ContentPosition", "DocumentEventMap" ]
---

# Types

```ts
import type { ScrollSpyOptions, ScrollSpyEvent, ContentPosition } from '@fsegurai/scrollspy';
```

## `ScrollSpyOptions`

```ts
interface ScrollSpyOptions {
  nav?: string;
  content?: string;
  nested?: boolean;
  nestedClass?: string;
  offset?: number | (() => number);
  bottomThreshold?: number;
  reflow?: boolean;
  events?: boolean;
  observe?: boolean;
  fragmentAttribute?: string | null | ((item: Element) => string | null);
  navItemSelector?: string;
}
```

See [Options](options.md) for defaults.

## `ScrollSpyEvent`

```ts
interface ScrollSpyEvent {
  target: Element;
  content: Element;
  nav: Element;
}
```

## `ContentPosition`

Returned by `getPositions()`.

```ts
interface ContentPosition {
  content: Element;
  offset: number;
}
```

## `DocumentEventMap` augmentation

```ts
declare global {
  interface DocumentEventMap {
    gumshoeactivate: CustomEvent<ScrollSpyEvent>;
    gumshoedeactivate: CustomEvent<ScrollSpyEvent>;
  }
}
```
