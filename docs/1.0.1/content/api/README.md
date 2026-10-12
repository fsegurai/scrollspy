---
label: API
description: Reference for the 1.0.x ScrollSpy class, its options, methods, events, and declared types.
order: 4
tags: [ "api", "reference", "typescript" ]
breadcrumbTitle: API
---

# API

```ts
import ScrollSpy, { type ScrollspyOptions, type ScrollspyEvent } from '@fsegurai/scrollspy';

new ScrollSpy(selector: string, options?: ScrollspyOptions);
```

The runtime is `src/index.js`; types come from the hand-written `src/index.d.ts`. Note the type names use a lowercase
`s` in `Scrollspy`.

| Page | Contents |
|------|----------|
| [Options](options.md) | Every `ScrollspyOptions` field with type and default |
| [Methods](methods.md) | Public methods and instance fields |
| [Events](events.md) | `gumshoeactivate` and its `detail` |
| [Types](types.md) | `ScrollspyOptions`, `ScrollspyEvent`, `DocumentEventMap` |
