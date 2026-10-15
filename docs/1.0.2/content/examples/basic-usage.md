---
label: Basic Usage
description: A static table of contents with nested items, offset, and an activation listener.
order: 1
tags: [ "examples", "basic", "javascript" ]
---

# Basic Usage

```html
<nav id="toc">
  <ul>
    <li><a href="#intro">Intro</a></li>
    <li><a href="#install">Install</a></li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#basic">Basic</a></li>
        <li><a href="#advanced">Advanced</a></li>
      </ul>
    </li>
  </ul>
</nav>

<main>
  <h2 id="intro">Intro</h2>
  <h2 id="install">Install</h2>
  <h2 id="usage">Usage</h2>
  <h3 id="basic">Basic</h3>
  <h3 id="advanced">Advanced</h3>
</main>
```

```js
import ScrollSpy from '@fsegurai/scrollspy';

const spy = new ScrollSpy('#toc', {
  offset: 80,
  nested: true,
  nestedClass: 'parent-active',
  reflow: true,
  events: true,
  observe: true,
});

document.addEventListener('gumshoeactivate', (event) => {
  console.log('Activated:', event.detail.target.id);
});
```

```css
#toc li.active > a,
#toc li.parent-active > a {
  font-weight: 600;
}
```
