---
label: TypeScript
description: Typed options and typed event listeners with the 1.0.x declaration file.
order: 3
tags: [ "examples", "typescript" ]
keywords: [ "ScrollspyOptions", "ScrollspyEvent" ]
---

# TypeScript

1.0.x ships `src/index.d.ts`. Type names are `ScrollspyOptions` and `ScrollspyEvent` (lowercase `s` in `spy`).

```ts
import ScrollSpy, { type ScrollspyEvent, type ScrollspyOptions } from '@fsegurai/scrollspy';

const options: ScrollspyOptions = {
  offset: document.querySelector('header')?.clientHeight ?? 0, // numbers only in 1.0.x
  nested: true,
  reflow: true,
};

const spy = new ScrollSpy('#toc', options);

// `event` is CustomEvent<ScrollspyEvent> through the DocumentEventMap augmentation
document.addEventListener('gumshoeactivate', (event) => {
  const { target, nav }: ScrollspyEvent = event.detail;
  history.replaceState(null, '', `#${target.id}`);
  nav.scrollIntoView({ block: 'nearest' });
});

// Clean up when the page or component goes away
window.addEventListener('pagehide', () => spy.destroy());
```

`spy.nav` exists at runtime but is not declared in the types. To check whether the nav was found, query it yourself:
`document.querySelector('#toc') !== null`.
