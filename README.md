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
- 🧼 Clean API with setup/destroy

---

## 📦 Installation

### NPM

```bash
npm install @fsegurai/scrollspy
```

### CDN / HTML

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@fsegurai/scrollspy/dist/index.umd.js"></script>
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

## ⚙️ Options

All available options for customizing behavior:

| Option              | Type                                          | Default           | Description                                                                                                                                                                                                                                               |
|---------------------|-----------------------------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nav`               | `string`                                      | —                 | **(Required)** Selector for the navigation container. Specifies where to find the navigation links (usually your Table of Contents or sidebar).                                                                                                           |
| `content`           | `string`                                      | `[data-gumshoe]`  | Selector for scrollable content sections (matched by ID from nav href). Used for observing DOM mutations (if observe: true) and for internal mapping. <br/>**You don’t usually need to change this unless your content isn’t identified by IDs directly** |
| `nested`            | `boolean`                                     | `false`           | Add a class to parent `<li>` items in nested TOC structures                                                                                                                                                                                               |
| `nestedClass`       | `string`                                      | `'active-parent'` | Class name for parent `<li>` elements when nested is `true`                                                                                                                                                                                               |
| `offset`            | `number \| () => number`                      | `0`               | Scroll offset in pixels or a function returning an offset (e.g. fixed headers)                                                                                                                                                                            |
| `bottomThreshold`   | `number`                                      | `100`             | Distance (in px) from bottom of page where last section is auto-activated.                                                                                                                                                                                |
| `reflow`            | `boolean`                                     | `false`           | If `true`, recomputes layout on window resize                                                                                                                                                                                                             |
| `events`            | `boolean`                                     | `true`            | Emits custom DOM events (`gumshoeactivate`, `gumshoedeactivate`) with full TypeScript support                                                                                                                                                             |                                                                                                                                                                                          |
| `observe`           | `boolean`                                     | `false`           | Enables a `MutationObserver` to track DOM changes and refresh content                                                                                                                                                                                     |
| `fragmentAttribute` | `string \| (item: Element) => string \| null` | `null`            | Attribute or function used to map nav items to content sections, instead of relying on the `href` attribute.                                                                                                                                              |
| `navItemSelector`   | `string`                                      | `'a[href*="#"]'`  | Selector for nav items (anchors). Use to further filter which anchors are considered navigation items.                                                                                                                                                    |

> If you're using `observe: true`, make sure your headings or section wrappers have a consistent structure, and set a
> data-gumshoe attribute if you change the default selector.

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

These custom events are fired on the document when scrollspy updates:

### `gumshoeactivate`

Triggered when a new section becomes active.

```js
document.addEventListener('gumshoeactivate', (e) => {
    console.log('Activated:', e.detail.target.id);
    console.log('Content:', e.detail.content);
    console.log('Nav item:', e.detail.nav);
});
```

### `gumshoedeactivate`

Triggered when a section is deactivated (not currently visible).

```js
document.addEventListener('gumshoedeactivate', (e) => {
    console.log('Deactivated:', e.detail.target.id);
});
```

Event `detail` includes:

- `target`: The content section element
- `content`: Alias of `target`
- `nav`: Corresponding anchor tag from the TOC

### Type-Safe Event Listeners

The library includes full TypeScript type definitions for all events. The `DocumentEventMap` is automatically augmented
to include `gumshoeactivate` and `gumshoedeactivate`:

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

Or initialize with `observe: true` to let it auto-refresh using a `MutationObserver`.

---

## 📘 API

| Method      | Description                                                         |
|-------------|---------------------------------------------------------------------|
| `setup()`   | Manually sets up the scrollspy instance again from scratch          |
| `detect()`  | Re-runs detection logic based on current scroll position            |
| `refresh()` | Rebuilds internal nav/content map (used after dynamic updates)      |
| `destroy()` | Tears down scrollspy instance, removes listeners and DOM references |

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

**All public APIs include JSDoc comments** for IDE autocomplete and inline documentation.

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