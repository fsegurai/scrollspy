---
label: TypeScript
description: Typed options, typed event listeners, and typed instance handling.
order: 3
tags: [ "examples", "typescript" ]
---

# TypeScript

```ts
import ScrollSpy, { type ScrollSpyEvent, type ScrollSpyOptions } from '@fsegurai/scrollspy';

const options: ScrollSpyOptions = {
  offset: () => document.querySelector('header')?.clientHeight ?? 0,
  nested: true,
  reflow: true,
};

const spy = new ScrollSpy('#toc', options);

// `event` is CustomEvent<ScrollSpyEvent> through the DocumentEventMap augmentation
document.addEventListener('gumshoeactivate', (event) => {
  const { target, nav }: ScrollSpyEvent = event.detail;
  history.replaceState(null, '', `#${target.id}`);
  nav.scrollIntoView({ block: 'nearest' });
});

if (!spy.nav) {
  console.warn('ScrollSpy: nav element not found');
}
```
