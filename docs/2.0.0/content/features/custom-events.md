---
label: Custom Events
description: React to section changes with the gumshoeactivate event.
order: 5
tags: [ "features", "events" ]
keywords: [ "gumshoeactivate", "CustomEvent" ]
---

# Custom Events

When the active section changes, ScrollSpy dispatches a `gumshoeactivate` `CustomEvent` on `document`, after the new
nav item is marked.

```ts
document.addEventListener('gumshoeactivate', (event) => {
  const { target, nav } = event.detail;
  console.log('Active section:', target.id, nav);
});
```

`detail` has `target`, `content` (alias of `target`), and `nav` (the element that received `active`: the closest
`<li>` or the link). TypeScript knows the event type through a `DocumentEventMap` augmentation.

Disable events with `events: false`; classes are still applied.

## No deactivate event in 2.0.0

The type augmentation declares `gumshoedeactivate`, but 2.0.0 never dispatches it. To react to the section that was
left, remember the previous `target` in your `gumshoeactivate` listener.

```ts
let previous: Element | null = null;

document.addEventListener('gumshoeactivate', (event) => {
  if (previous) console.log('Left:', previous.id);
  previous = event.detail.target;
});
```

## Related

- [Events reference](../api/events.md)
