---
label: Events
description: Reference for the gumshoeactivate custom event in 2.0.0.
order: 3
tags: [ "api", "events", "reference" ]
keywords: [ "gumshoeactivate", "ScrollSpyEvent", "DocumentEventMap" ]
---

# Events

2.0.0 dispatches one event, `gumshoeactivate`. It is a `CustomEvent<ScrollSpyEvent>` dispatched on `document` with
`bubbles: true`, only when `events` is `true` (default).

| Event | Dispatched |
|-------|-----------|
| `gumshoeactivate` | For the newly active section, after its nav item gets `active` |

> **Declared but not dispatched:** the `DocumentEventMap` augmentation also declares `gumshoedeactivate`, but 2.0.0
> never fires it. Dispatching started in 2.1.0.

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
