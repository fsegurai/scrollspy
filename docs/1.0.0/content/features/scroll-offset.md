---
label: Scroll Offset
description: Shift the activation point with a numeric offset to account for fixed headers.
order: 3
tags: [ "features", "offset", "fixed-header" ]
keywords: [ "sticky header", "numeric offset" ]
---

# Scroll Offset

`offset` moves the activation line down from the top of the viewport. A section becomes active once its top is within
`offset` pixels of the viewport top.

```js
new ScrollSpy('#toc', { offset: 80 });
```

## Numbers only

Pass a number. The declaration file types `offset` as `number | (() => number)`, but the 1.0.x runtime never calls a
function: it adds `offset` directly to the scroll position, so a function produces a broken position and nothing
activates correctly. Function offsets work from 2.0.0.

If the header height changes, destroy the instance and create a new one with the new number.

## Behavior near the bottom

Two separate rules apply near the bottom of the page:

| Rule | Distance from document bottom | Effect |
|------|-------------------------------|--------|
| Viewport position | within a fixed `50` px | Effective offset becomes `offset - 100` |
| Last section | within `bottomThreshold` (default `100`) | The last section is activated |

The `50` and `100` values are fixed in 1.0.x.

## Related

- [Fixed headers guide](../guides/fixed-headers.md)
