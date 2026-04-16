<p align="center" class="intro">
  <img alt="ScrollSpy Logo" src="https://raw.githubusercontent.com/fsegurai/scrollspy/main/demo/public/scrollspy.svg">
</p>

<p align="center" class="intro">
  <a href="https://github.com/fsegurai/scrollspy">
      <img src="https://img.shields.io/azure-devops/build/fsegurai/93779823-473d-4fb3-a5b1-27aaa1a88ea2/26/main?label=Build%20Status&"
          alt="Build Main Status">
  </a>
  <a href="https://github.com/fsegurai/scrollspy/releases/latest">
      <img src="https://img.shields.io/github/v/release/fsegurai/scrollspy"
          alt="Latest Release">
  </a>
  <br>
  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/fsegurai/scrollspy">
  <img alt="Dependency status for repo" src="https://img.shields.io/librariesio/github/fsegurai/scrollspy">
  <a href="https://opensource.org/licenses/MIT">
    <img alt="GitHub License" src="https://img.shields.io/github/license/fsegurai/scrollspy">
  </a>
  <br>
  <img alt="Stars" src="https://img.shields.io/github/stars/fsegurai/scrollspy?style=square&labelColor=343b41"/> 
  <img alt="Forks" src="https://img.shields.io/github/forks/fsegurai/scrollspy?style=square&labelColor=343b41"/>
</p>

**A library for scrollspy functionality**

`@fsegurai/scrollspy` is a dependency-free, lightweight scrollspy library that highlights navigation links based on
scroll position. Perfect for documentation sites, blogs, and landing pages with sticky tables of contents.

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [📦 Installation](#-installation)
    - [NPM](#npm)
    - [CDN / HTML](#cdn--html)
- [🧠 Usage](#-usage)
    - [HTML Example](#html-example)
    - [JavaScript Example](#javascript-example)
    - [TypeScript Example](#typescript-example)
- [🧪 Demo Integration](#-demo-integration)
- [⚙️ Options](#️-options)
- [📡 Events](#-events)
    - [`gumshoeactivate`](#gumshoeactivate)
    - [`gumshoedeactivate`](#gumshoedeactivate)
    - [Type-Safe Event Listeners](#type-safe-event-listeners)
- [🔁 Dynamic Content Support](#-dynamic-content-support)
- [📘 API](#-api)
- [🎯 TypeScript Support](#-typescript-support)
- [✅ Browser Support](#-browser-support)
- [🧼 License](#-license)

---

## 🚀 Features

- ⚡️ Lightweight (no dependencies)
- 📘 **100% TypeScript** with full type definitions
- 🔍 Intelligent scroll-based section detection
- 🧩 Nested navigation support
- 🧭 Works with dynamic or static content
- 🎯 Scroll offset for fixed headers
- 🔄 Automatic DOM mutation observer (optional)
- 🎉 Type-safe custom activation events
- 🧼 Clean API with init/refresh/destroy

---

## 📦 Installation

### NPM

```bash
npm install @fsegurai/scrollspy
```

### CDN / HTML

```html

<script type="module">
    import ScrollSpy from '@fsegurai/scrollspy';

    const spy = new ScrollSpy('#toc');
</script>
```

---

## 🧠 Usage

### HTML Example

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
    <p>...</p>
    <h2 id="install">Install</h2>
    <p>...</p>
    <h2 id="usage">Usage</h2>
    <h3 id="basic">Basic</h3>
    <p>...</p>
    <h3 id="advanced">Advanced</h3>
    <p>...</p>
</main>
```

### JavaScript Example

```js
import ScrollSpy from '@fsegurai/scrollspy';

const spy = new ScrollSpy('#toc', {
    offset: 80,
    nested: true,
    nestedClass: 'parent-active',
    reflow: true,
    events: true,
    observe: true
});

// Listen for activation events
document.addEventListener('gumshoeactivate', (event) => {
    console.log('Activated:', event.detail.target.id);
});
```

### TypeScript Example

```ts
import ScrollSpy, {type ScrollSpyEvent, type ScrollSpyOptions} from '@fsegurai/scrollspy';

const options: ScrollSpyOptions = {
    offset: 80,
    nested: true,
    nestedClass: 'parent-active',
    reflow: true,
    events: true,
    observe: true
};

const spy = new ScrollSpy('#toc', options);

// Fully typed event listener
document.addEventListener('gumshoeactivate', (event: Event) => {
    const customEvent = event as CustomEvent<ScrollSpyEvent>;
    console.log('Activated:', customEvent.detail.target.id);
    console.log('Nav item:', customEvent.detail.nav);
});
```

---

## 🧪 Demo Integration

The demo in `demo/scripts/utils/toc.ts` builds a nested table of contents from headings, marks each heading with
`data-gumshoe`, and then initializes ScrollSpy against `#tableOfContents`.

```ts
import {
    generateTOC,
    initScrollspy,
    setupMobileToggle,
    setupSmoothScroll,
} from './utils/toc';

const content = document.querySelector('#content') as HTMLElement;

generateTOC(content);
setupMobileToggle();
setupSmoothScroll();
initScrollspy();
```

In that demo flow, the generated headings look like this:

```html
<h2 id="intro" data-gumshoe>Intro</h2>
```

`initScrollspy()` configures the instance with `content: '[data-gumshoe]'`, `offset: 120`, `bottomThreshold: 10`,
`reflow: true`, and `events: true`.

---

## ⚙️ Options

All available options for customizing behavior:

| Option              | Type                                          | Default           | Description                                                                                                                                                                    |
|---------------------|-----------------------------------------------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nav`               | `string`                                      | —                 | **(Required)** Selector for the navigation container. This is the element ScrollSpy scans for links.                                                                           |
| `content`           | `string`                                      | `[data-gumshoe]`  | Default selector used by the demo and dynamic-content workflows. The core lookup still resolves targets from nav fragments and `fragmentAttribute`.                            |
| `nested`            | `boolean`                                     | `false`           | Adds a class to parent `<li>` items in nested TOC structures.                                                                                                                  |
| `nestedClass`       | `string`                                      | `'active-parent'` | Class name for parent `<li>` elements when `nested` is `true`.                                                                                                                 |
| `offset`            | `number \| () => number`                      | `0`               | Scroll offset in pixels or a function returning an offset, useful for fixed headers.                                                                                           |
| `bottomThreshold`   | `number`                                      | `100`             | Distance in pixels from the bottom of the page where the last section is auto-activated.                                                                                       |
| `reflow`            | `boolean`                                     | `false`           | If `true`, ScrollSpy also re-detects on window resize.                                                                                                                         |
| `events`            | `boolean`                                     | `true`            | Emits `gumshoeactivate` when the active section changes. `gumshoedeactivate` is part of the typings, but the current runtime does not dispatch it.                             |
| `observe`           | `boolean`                                     | `false`           | Enables a `MutationObserver` that calls `refresh()` when observed DOM nodes change.                                                                                            |
| `fragmentAttribute` | `string \| (item: Element) => string \| null` | `null`            | Attribute or function used to map nav items to content sections instead of relying on `href`. Supports full URLs like `/route#fragment` through the default hash parsing path. |
| `navItemSelector`   | `string`                                      | `'a[href*="#"]'`  | Selector for nav items (anchors or other elements) that should be considered by ScrollSpy.                                                                                     |

> If you're using `observe: true`, make sure your headings or section wrappers have a consistent structure. The
> `data-gumshoe` attribute is used by the demo and matches the default `content` selector, but section matching still
> starts from the nav fragments themselves.

---

### Advanced Fragment Mapping (SPA/Angular)

If you need to support full URLs in `href` (e.g. `/route#fragment`) or use a custom attribute (e.g.
`data-scrollspy-fragment`), use the `fragmentAttribute` option:

```js
// Use a custom attribute
const spy = new ScrollSpy('#toc', {
    fragmentAttribute: 'data-scrollspy-fragment',
});

// Or use a function for advanced mapping
const spy = new ScrollSpy('#toc', {
    fragmentAttribute: (item) => item.getAttribute('data-scrollspy-fragment') || null,
});
```

- The library will now match anchors using the custom attribute or function, not just `href`.
- This is useful for Angular/SPA scenarios where you want the user to see the full URL in the browser, but scrollspy to
  map by fragment only.

---

## 📡 Events

These custom events are available on `document` when ScrollSpy updates the active section.

### `gumshoeactivate`

Triggered when a new section becomes active.

```js
document.addEventListener('gumshoeactivate', (e) => {
    console.log('Activated:', e.detail.target.id);
    console.log('Content:', e.detail.content);
    console.log('Nav item:', e.detail.nav);
});
```

### About `gumshoedeactivate`

`gumshoedeactivate` is included in the type definitions, but the current implementation does not dispatch it. If you
need deactivation hooks, listen for `gumshoeactivate` and compare the previous active section yourself.

Event `detail` includes:

- `target`: The content section element
- `content`: Alias of `target`
- `nav`: Corresponding anchor tag from the TOC

### Type-Safe Event Listeners

The library includes full TypeScript type definitions for the custom events that ship with the package. The
`DocumentEventMap` is augmented to include both `gumshoeactivate` and `gumshoedeactivate`, even though only
`gumshoeactivate` is emitted by the current runtime:

```ts
import type {ScrollSpyEvent} from '@fsegurai/scrollspy';

// TypeScript knows about these custom events automatically
document.addEventListener('gumshoeactivate', (event: Event) => {
    const customEvent = event as CustomEvent<ScrollSpyEvent>;
    // Full intellisense support for event.detail.target, content, nav
    console.log(customEvent.detail.target.id);
});
```

- `target`: The content section element
- `content`: Alias of `target`
- `nav`: Corresponding anchor tag from the TOC

---

## 🔁 Dynamic Content Support

If you update the TOC or headings dynamically, call:

```js
spy.refresh();
```

Or initialize with `observe: true` to let ScrollSpy refresh itself using a `MutationObserver`.

---

## 📘 API

| Method          | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `init()`        | Performs the initial DOM lookup, content mapping, detection, and listeners. |
| `getContents()` | Rebuilds the internal nav-to-target map from the current DOM.               |
| `getNavItem()`  | Resolves the nav element associated with a content section.                 |
| `detect()`      | Re-runs detection logic based on current scroll position.                   |
| `setup()`       | Rebuilds contents and runs detection again.                                 |
| `refresh()`     | Same rebuild/detect cycle as `setup()`; use this after dynamic updates.     |
| `destroy()`     | Removes listeners, clears active classes, and disconnects the observer.     |

> `setup()` and `refresh()` currently perform the same rebuild/detect pass.

---

## 🎯 TypeScript Support

The library is built entirely in **TypeScript** and exports complete type definitions:

```ts
import ScrollSpy, {
    type ScrollSpyOptions,
    type ScrollSpyEvent,
    type ContentPosition
} from '@fsegurai/scrollspy';

// Full type safety for all options
const options: ScrollSpyOptions = {
    offset: 80,
    nested: true,
};

// Constructor is fully typed
const spy = new ScrollSpy('#toc', options);

// Event detail is typed
document.addEventListener('gumshoeactivate', (event: Event) => {
    const e = event as CustomEvent<ScrollSpyEvent>;
    const target: Element = e.detail.target;
    const nav: Element = e.detail.nav;
});
```

`ScrollSpyOptions` includes the navigation selector, offset controls, nested-navigation classes, fragment mapping, and
the optional MutationObserver toggle. `ScrollSpyEvent` is the shared detail payload for the activation event.

---

## ✅ Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅       |
| Firefox | ✅       |
| Safari  | ✅       |
| Edge    | ✅       |
| IE11    | ❌       |

⚠️ Requires `CustomEvent` support. You may need polyfills for legacy environments.

---

## 🧼 License

Licensed under [MIT](https://opensource.org/licenses/MIT).