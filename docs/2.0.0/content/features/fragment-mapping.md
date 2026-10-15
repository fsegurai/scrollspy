---
label: Fragment Mapping
description: Map nav items to sections by href hash, custom attribute, or a function.
order: 4
tags: [ "features", "fragment", "spa", "routing" ]
keywords: [ "fragmentAttribute", "navItemSelector", "href" ]
---

# Fragment Mapping

ScrollSpy pairs each nav item with a section through a **fragment** - the `id` of the target element. Items whose
fragment does not match an element `id` in the document are ignored.

## Default: `href` hash

With `fragmentAttribute: null` (default), the fragment is everything after the first `#` in `href`. Both forms work:

```html
<a href="#install">Install</a>
<a href="/docs/guide#install">Install</a>
```

## Custom attribute

```ts
new ScrollSpy('#toc', {
  fragmentAttribute: 'data-scrollspy-fragment',
  navItemSelector: 'a[data-scrollspy-fragment]',
});
```

```html
<a href="/docs/guide" data-scrollspy-fragment="install">Install</a>
```

## Function

```ts
new ScrollSpy('#toc', {
  navItemSelector: 'a',
  fragmentAttribute: (item) => item.getAttribute('data-target') ?? null,
});
```

Return `null` (or an empty string) to skip an item.

## Choosing nav items

`navItemSelector` (default `a[href*="#"]`) decides which elements inside the nav are considered. It applies in every
mode, so when your links have no `#` in `href`, set `navItemSelector` too (for example `'a'`).

## Related

- [SPA integration guide](../guides/spa-integration.md)
