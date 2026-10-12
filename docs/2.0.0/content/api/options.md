---
label: Options
description: All ScrollSpyOptions fields with types, defaults, and behavior.
order: 1
tags: [ "api", "options", "configuration" ]
keywords: [ "ScrollSpyOptions", "offset", "nested", "observe", "fragmentAttribute" ]
---

# Options

Pass options as the second constructor argument. All fields are optional.

```ts
new ScrollSpy('#toc', { offset: 80, nested: true });
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nav` | `string` | the `selector` argument | Selector for the nav container. If set in options, it overrides the constructor `selector`. |
| `content` | `string` | `'[data-gumshoe]'` | Declared for compatibility. The core lookup does **not** use it; sections are resolved from nav fragments. |
| `nested` | `boolean` | `false` | Add `nestedClass` to ancestor `<li>` elements of the active item. |
| `nestedClass` | `string` | `'active-parent'` | Class used when `nested` is `true`. |
| `offset` | `number \| (() => number)` | `0` | Pixels from the viewport top where a section becomes active. Functions are called on each detection. |
| `bottomThreshold` | `number` | `100` | Within this many pixels of the document bottom, the last section is activated. `0` disables it. |
| `reflow` | `boolean` | `false` | Also re-detect on window `resize`. |
| `events` | `boolean` | `true` | Dispatch `gumshoeactivate` on `document`. |
| `observe` | `boolean` | `false` | Watch the nav and section parents with a `MutationObserver` and call `refresh()` on changes. |
| `fragmentAttribute` | `string \| null \| ((item: Element) => string \| null)` | `null` | Attribute name or function that returns the target `id` for a nav item. `null` reads the `href` hash. |
| `navItemSelector` | `string` | `'a[href*="#"]'` | Selector for nav items inside the nav container. |

## Related

- [Features](../features/README.md)
- [Types](types.md)
