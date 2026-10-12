---
label: Quick Start
description: Create a working scrollspy with a nav, section IDs, and an active class.
order: 2
tags: [ "quick-start", "usage", "tutorial" ]
---

# Quick Start

## 1. Markup

Each nav link points to a section `id` with a hash fragment.

```html
<nav id="toc">
  <ul>
    <li><a href="#intro">Intro</a></li>
    <li><a href="#install">Install</a></li>
    <li><a href="#usage">Usage</a></li>
  </ul>
</nav>

<main>
  <h2 id="intro">Intro</h2>
  <p>...</p>
  <h2 id="install">Install</h2>
  <p>...</p>
  <h2 id="usage">Usage</h2>
  <p>...</p>
</main>
```

## 2. Create an instance

```ts
import ScrollSpy from '@fsegurai/scrollspy';

const spy = new ScrollSpy('#toc');
```

The constructor runs `init()` immediately: it finds `#toc`, maps every `a[href*="#"]` to the element with the matching
`id`, detects the current section, and starts listening to `scroll`.

## 3. Style the active item

ScrollSpy adds the class `active` to the closest `<li>` of the matching link (or to the link itself when it has no
`<li>` ancestor).

```css
#toc li.active > a {
  font-weight: 600;
  color: rebeccapurple;
}
```

## 4. Clean up

Call `destroy()` when the page or component goes away.

```ts
spy.destroy();
```

## Next steps

- Fixed header? See [Scroll offset](../features/scroll-offset.md).
- Nested TOC? See [Nested navigation](../features/nested-navigation.md).
- Full option list: [Options](../api/options.md).
