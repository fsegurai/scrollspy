---
label: Scroll Offset
description: Shift the activation point to account for fixed headers, statically or dynamically.
order: 3
tags: [ "features", "offset", "fixed-header" ]
keywords: [ "sticky header", "function offset" ]
---

# Scroll Offset

`offset` moves the activation line down from the top of the viewport. A section becomes active once its top is within
`offset` pixels of the viewport top.

## Fixed number

```ts
new ScrollSpy('#toc', { offset: 80 });
```

## Function

Pass a function when the header height can change (responsive layouts, collapsing headers). It is called on every
detection pass.

```ts
new ScrollSpy('#toc', {
  offset: () => document.querySelector('header')?.getBoundingClientRect().height ?? 0,
});
```

## Interaction with `bottomThreshold`

Two separate rules apply near the bottom of the page in 2.0.0:

| Rule | Distance from document bottom | Effect |
|------|-------------------------------|--------|
| Viewport position | within a fixed `50` px | Effective offset becomes `offset - 100` |
| Last section | within `bottomThreshold` (default `100`) | The last section is activated |

The `50` and `100` values are fixed in 2.0.0. 2.1.0 ties both to `bottomThreshold`.

## Related

- [Fixed headers guide](../guides/fixed-headers.md)
