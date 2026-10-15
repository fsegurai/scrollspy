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

```js
document.addEventListener('gumshoeactivate', (event) => {
  const { target, nav } = event.detail;
  console.log('Active section:', target.id, nav);
});
```

`detail` has `target`, `content` (alias of `target`), and `nav` (the element that received `active`: the closest
`<li>` or the link). The declaration file augments `DocumentEventMap` with `gumshoeactivate`, so TypeScript types
`event.detail`.

Disable events with `events: false`; classes are still applied.

## No deactivate event

The 1.0.x README lists a `gumshoedeactivate` event, but the code never dispatches it and the types do not declare it.
To react to the section that was left, remember the previous `target`:

```js
let previous = null;

document.addEventListener('gumshoeactivate', (event) => {
  if (previous) console.log('Left:', previous.id);
  previous = event.detail.target;
});
```

## Related

- [Events reference](../api/events.md)
