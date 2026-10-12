---
label: Events
description: Reference for the gumshoeactivate custom event in 1.0.x.
order: 3
tags: [ "api", "events", "reference" ]
keywords: [ "gumshoeactivate", "ScrollspyEvent", "DocumentEventMap" ]
---

# Events

1.0.x dispatches one event, `gumshoeactivate`. It is a `CustomEvent` dispatched on `document` with `bubbles: true`,
only when `events` is `true` (default).

| Event | Dispatched |
|-------|-----------|
| `gumshoeactivate` | For the newly active section, after its nav item gets `active` |

> The 1.0.x README also documents `gumshoedeactivate`. The code never dispatches it.

## `detail`

| Field | Type | Description |
|-------|------|-------------|
| `target` | `Element` | The section element |
| `content` | `Element` | Alias of `target` |
| `nav` | `Element` | The element that received `active`: the closest `<li>` of the link, or the link |

## Typed listeners

`index.d.ts` augments `DocumentEventMap` with `gumshoeactivate: CustomEvent<ScrollspyEvent>`:

```ts
document.addEventListener('gumshoeactivate', (event) => {
  console.log(event.detail.target.id);
});
```
