---
label: Nested Navigation
description: Mark parent list items of the active link in multi-level tables of contents.
order: 2
tags: [ "features", "nested", "toc" ]
keywords: [ "nestedClass", "active-parent" ]
---

# Nested Navigation

With `nested: true`, every ancestor `<li>` of the active item (up to the nav element) receives `nestedClass`
(default `active-parent`).

```ts
const spy = new ScrollSpy('#toc', {
  nested: true,
  nestedClass: 'active-parent',
});
```

```html
<nav id="toc">
  <ul>
    <li class="active-parent">          <!-- ancestor gets nestedClass -->
      <a href="#usage">Usage</a>
      <ul>
        <li class="active"><a href="#basic">Basic</a></li>  <!-- active item -->
      </ul>
    </li>
  </ul>
</nav>
```

```css
#toc li.active-parent > a { font-weight: 600; }
```

## Notes

- `nestedClass` is applied to ancestors; the active item itself gets `active`.
- When deactivating, ScrollSpy removes `nestedClass` only from elements that also have `active`. See
  [Troubleshooting](../help/troubleshooting.md) if a parent keeps its class.
