---
label: Methods
description: Public methods and instance fields of the 1.0.x ScrollSpy class.
order: 2
tags: [ "api", "methods", "reference" ]
keywords: [ "init", "refresh", "destroy", "detect", "setup" ]
---

# Methods

## Constructor

```ts
constructor(selector: string, options?: ScrollspyOptions)
```

Merges `options` over the defaults and calls `init()`.

## Common methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `init` | `init(): void` | Queries the nav; if found, maps contents, detects, attaches listeners, and starts the observer when `observe` is `true`. Returns early if the nav is missing. |
| `refresh` | `refresh(): void` | Rebuilds the nav-to-section map and re-detects. Use after DOM updates. |
| `setup` | `setup(): void` | Same as `refresh()`. |
| `detect` | `detect(): void` | Recomputes the active section and updates classes and events if it changed. |
| `destroy` | `destroy(): void` | Clears the current state and `active` classes, removes listeners, disconnects the observer. |

## Lower-level methods

These are public and used internally. Prefer the common methods above.

| Method | Signature | Description |
|--------|-----------|-------------|
| `getContents` | `getContents(): void` | Rebuilds the internal list of sections and the nav map. |
| `getPositions` | `getPositions(): { content: Element; offset: number }[]` | Returns each section with its top offset. |
| `getOffsetTop` | `getOffsetTop(element: Element): number` | Sums `offsetTop` along the `offsetParent` chain. |
| `getViewportPosition` | `getViewportPosition(): number` | Scroll position plus the effective offset. |
| `getCurrentActive` | `getCurrentActive(positions, position: number): Element[]` | Returns the active section (zero or one element). |
| `isNewActive` | `isNewActive(active: Element[]): boolean` | `true` when the first element differs from the current one. |
| `deactivateAll` | `deactivateAll(): void` | Removes `active` (and `nestedClass` on those items when nested) inside the nav. |
| `activate` | `activate(active: Element[]): void` | Marks the nav item of each given section and emits `activate` for it. |
| `getNavItem` | `getNavItem(content: Element): Element \| null` | Returns the closest `<li>` of the mapped link, or the link itself. |
| `addNestedNavigation` | `addNestedNavigation(item: Element): void` | Adds `nestedClass` to ancestor `<li>` elements when `nested` is `true`. |
| `emitEvent` | `emitEvent(type: string, content: Element, nav: Element): void` | Dispatches `gumshoe${type}` on `document` when `events` is `true`. |
| `setupListeners` | `setupListeners(): void` | Adds the throttled `scroll` (and `resize` with `reflow`) listeners. |
| `destroyListeners` | `destroyListeners(): void` | Removes listeners added by `setupListeners()`. Exists at runtime but is **not declared** in `index.d.ts`. |
| `observeChanges` | `observeChanges(): void` | Starts the `MutationObserver` used by `observe`. |

## Instance fields

In 1.0.x the instance state is plain public JavaScript properties: `settings`, `nav`, `contents`, `current`, and
`navMap`. None of them are declared in `index.d.ts`, so TypeScript code cannot read them without a cast. 2.0.0 made
them private and added a typed `nav` getter.
