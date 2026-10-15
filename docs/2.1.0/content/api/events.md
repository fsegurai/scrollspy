---
label: Events
description: Reference for gumshoeactivate and gumshoedeactivate custom events.
order: 3
tags: [ "api", "events", "reference" ]
keywords: [ "gumshoeactivate", "gumshoedeactivate", "ScrollSpyEvent" ]
---

# Events

Both events are `CustomEvent<ScrollSpyEvent>` instances dispatched on `document` with `bubbles: true`. They are only
dispatched when `events` is `true` (default).

| Event | Dispatched |
|-------|-----------|
| `gumshoedeactivate` | For the previously active section, before the new section is marked |
| `gumshoeactivate` | For the newly active section, after its nav item gets `active` |

## `detail`

| Field | Type | Description |
|-------|------|-------------|
| `target` | `Element` | The section element |
| `content` | `Element` | Alias of `target` |
| `nav` | `Element` | The element that received `active`: the closest `<li>` of the link, or the link |

## Typed listeners

The package augments `DocumentEventMap`, so `event.detail` is typed without casts:

```ts
document.addEventListener('gumshoeactivate', (event) => {
  console.log(event.detail.target.id);
});
```
