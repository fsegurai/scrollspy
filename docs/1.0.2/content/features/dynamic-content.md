---
label: Dynamic Content
description: Keep ScrollSpy in sync when the nav or sections change after initialization.
order: 6
tags: [ "features", "dynamic", "mutation-observer", "refresh" ]
keywords: [ "observe", "reflow", "MutationObserver" ]
---

# Dynamic Content

ScrollSpy maps nav items to sections once during `init()`. When the DOM changes, choose one of three tools.

| Need | Use |
|------|-----|
| You control when content changes | Call `spy.refresh()` after the change |
| Content changes on its own | `observe: true` |
| Layout shifts on window resize | `reflow: true` |

## Manual refresh

```ts
renderMoreSections();
spy.refresh(); // rebuild the nav-to-section map and re-detect
```

## Automatic refresh with `observe`

```ts
new ScrollSpy('#toc', { observe: true });
```

A `MutationObserver` watches child-list changes (with subtree) on the nav element and on the parent element of each
section mapped at `init()` time, and calls `refresh()` on every mutation.

## Re-detect on resize with `reflow`

`reflow: true` adds a `resize` listener that re-runs detection (throttled with `requestAnimationFrame`).

## Related

- [Lifecycle guide](../guides/lifecycle.md)
