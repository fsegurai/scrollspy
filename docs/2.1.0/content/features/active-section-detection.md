---
label: Active Section Detection
description: How ScrollSpy decides which section is active and which nav item gets the active class.
order: 1
tags: [ "features", "detection", "scroll", "active" ]
keywords: [ "bottomThreshold", "active class", "requestAnimationFrame" ]
---

# Active Section Detection

Exactly one section is active at a time. Its nav item receives the class `active`.

## How a section is chosen

1. ScrollSpy computes each section's top offset by walking its `offsetParent` chain.
2. It computes the viewport position: `window.pageYOffset + offset`.
3. The active section is the **last** section whose top offset is less than or equal to that position.
4. If no section qualifies (you are above the first one), nothing is active.

## Bottom of the page

Short final sections often never reach the top of the viewport. When the page is scrolled to within
`bottomThreshold` pixels (default `100`) of the document bottom, the **last** section is activated.

| `bottomThreshold` | Behavior |
|-------------------|----------|
| `100` (default) | Last section activates within 100px of the bottom |
| any positive number | Same rule with your distance |
| `0` | Bottom rule disabled; only the offset comparison applies |

## Which element gets `active`

The class goes on the closest `<li>` ancestor of the matching link. If the link is not inside an `<li>`, the link
itself receives the class. The class name `active` is fixed.

## When detection runs

- Once during `init()`.
- On every `scroll` event, throttled with `requestAnimationFrame`.
- On `resize` when `reflow: true`.
- On every `detect()`, `setup()`, or `refresh()` call.

When the active section changes, all `.active` items inside the nav are cleared before the new one is marked.

## Related

- [Scroll offset](scroll-offset.md)
- [Options reference](../api/options.md)
