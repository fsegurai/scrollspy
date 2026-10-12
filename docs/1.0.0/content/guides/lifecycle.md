---
label: Lifecycle
description: Create, refresh, and destroy ScrollSpy instances safely.
order: 3
tags: [ "guides", "lifecycle", "destroy", "refresh" ]
---

# Lifecycle

| Stage | Call | Effect |
|-------|------|--------|
| Create | `new ScrollSpy(selector, options)` | Runs `init()` |
| Update content | `refresh()` (or `setup()`) | Rebuilds the nav-to-section map and re-detects |
| Re-detect only | `detect()` | Recomputes the active section without remapping |
| Tear down | `destroy()` | Clears `active`, removes listeners, disconnects the observer |

## Re-creating on re-render

The demo destroys the previous instance before creating a new one each time the content re-renders:

```ts
let spy: ScrollSpy | undefined;

export const initScrollspy = (): void => {
  if (spy) spy.destroy();
  spy = new ScrollSpy('#tableOfContents', { offset: 120, bottomThreshold: 10, reflow: true });
};
```

## Notes

- `destroy()` does not remove the nav element or your markup.
- Calling `init()` on the same instance after `destroy()` re-attaches listeners.
- Calling `init()` twice without `destroy()` attaches duplicate listeners.
