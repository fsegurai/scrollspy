---
label: Custom Events
description: React to section changes with the gumshoeactivate and gumshoedeactivate events.
order: 5
tags: [ "features", "events" ]
keywords: [ "gumshoeactivate", "gumshoedeactivate", "CustomEvent" ]
---

# Custom Events

When the active section changes, ScrollSpy dispatches `CustomEvent`s on `document`.

| Event | When |
|-------|------|
| `gumshoedeactivate` | For the previously active section, first |
| `gumshoeactivate` | For the newly active section, after its nav item is marked |

```ts
document.addEventListener('gumshoeactivate', (event) => {
  const { target, nav } = event.detail;
  console.log('Active section:', target.id, nav);
});
```

`detail` has `target`, `content` (alias of `target`), and `nav` (the element that received `active`: the closest
`<li>` or the link). TypeScript knows the event types through a `DocumentEventMap` augmentation.

Disable events with `events: false`; classes are still applied.

## Related

- [Events reference](../api/events.md)
