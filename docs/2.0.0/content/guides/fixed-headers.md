---
label: Fixed Headers
description: Activate sections at the right moment when a fixed or sticky header covers the top of the page.
order: 1
tags: [ "guides", "offset", "fixed-header" ]
---

# Fixed Headers

## Quick path

1. Measure the header height.
2. Pass it as `offset` (a number or a function).
3. Match your smooth-scroll target to the same offset so clicks land where detection expects.

```ts
const header = document.querySelector<HTMLElement>('header');

const spy = new ScrollSpy('#toc', {
  offset: () => (header?.offsetHeight ?? 0) + 16,
  reflow: true, // re-detect when the header height changes on resize
});
```

## Align click scrolling

ScrollSpy does not scroll the page. If you implement smooth scrolling, use the same offset:

```ts
document.querySelector('#toc')?.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a');
  const id = link?.getAttribute('href')?.split('#')[1];
  const target = id ? document.getElementById(id) : null;
  if (!target) return;

  e.preventDefault();
  window.scrollTo({ top: target.offsetTop - ((header?.offsetHeight ?? 0) + 16), behavior: 'smooth' });
});
```

## Checklist

- [ ] The clicked section's link becomes `active` after scrolling stops.
- [ ] The last section activates at the bottom of the page (adjust `bottomThreshold` if not).
