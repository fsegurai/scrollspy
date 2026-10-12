---
label: Fixed Headers
description: Activate sections at the right moment when a fixed or sticky header covers the top of the page.
order: 1
tags: [ "guides", "offset", "fixed-header" ]
---

# Fixed Headers

## Quick path

1. Measure the header height.
2. Pass it as a numeric `offset` (1.0.x does not call offset functions).
3. Match your smooth-scroll target to the same offset so clicks land where detection expects.

```js
const header = document.querySelector('header');
const headerOffset = () => (header?.offsetHeight ?? 0) + 16;

let spy = new ScrollSpy('#toc', { offset: headerOffset() });
```

## When the header height changes

The offset is a fixed number stored at construction. Re-create the instance when the header resizes:

```js
window.addEventListener('resize', () => {
  spy.destroy();
  spy = new ScrollSpy('#toc', { offset: headerOffset() });
});
```

## Align click scrolling

ScrollSpy does not scroll the page. If you implement smooth scrolling, use the same offset:

```js
document.querySelector('#toc')?.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  const id = link?.getAttribute('href')?.split('#')[1];
  const target = id ? document.getElementById(id) : null;
  if (!target) return;

  e.preventDefault();
  window.scrollTo({ top: target.offsetTop - headerOffset(), behavior: 'smooth' });
});
```

## Checklist

- [ ] The clicked section's link becomes `active` after scrolling stops.
- [ ] The last section activates at the bottom of the page (adjust `bottomThreshold` if not).
