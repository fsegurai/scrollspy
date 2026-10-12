---
label: SPA Integration
description: Use ScrollSpy with client-side routing, route-prefixed links, and framework components.
order: 2
tags: [ "guides", "spa", "angular", "react", "routing" ]
keywords: [ "fragmentAttribute", "navItemSelector", "router" ]
---

# SPA Integration

## Route-prefixed links

Links such as `/guide#install` work with the default settings: the fragment is read from the text after `#`.

## Links without a hash

If the visible `href` has no `#`, store the section id in an attribute and widen `navItemSelector`:

```ts
const spy = new ScrollSpy('#toc', {
  navItemSelector: 'a[data-scrollspy-fragment]',
  fragmentAttribute: 'data-scrollspy-fragment',
});
```

## Framework lifecycle

Create the instance after the nav and sections are in the DOM, and destroy it on unmount.

```ts
// Generic component hooks
let spy: ScrollSpy | null = null;

function onMounted() {
  spy = new ScrollSpy('#toc', { offset: 80, observe: true });
}

function onUnmounted() {
  spy?.destroy();
  spy = null;
}
```

If the nav element does not exist when the constructor runs, `init()` returns without attaching listeners. Call
`spy.init()` once the element exists, or create the instance later.

## Route changes

When a route change replaces the content but keeps the component, call `spy.refresh()` after rendering, or destroy
and recreate the instance.
