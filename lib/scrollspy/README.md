# @fsegurai/scrollspy

A dependency-free, lightweight scrollspy library that highlights navigation links based on scroll position. Perfect for
documentation sites, blogs, and landing pages with sticky tables of contents.

---

## 🚀 Features

- ⚡️ Lightweight (no dependencies)
- 🔍 Intelligent scroll-based section detection
- 🧩 Nested navigation support
- 🧭 Works with dynamic or static content
- 🎯 Scroll offset for fixed headers
- 🔄 Automatic DOM mutation observer (optional)
- 🎉 Emits custom activation events
- 🧼 Clean API with setup/destroy

---

## 📦 Installation

### NPM

```bash
npm install @fsegurai/scrollspy
```

### CDN / HTML

```html

<script type="module" src="path/to/scrollspy.esm.js"></script>
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

### JavaScript/TypeScript Example

```js
import scrollspy from '@fsegurai/scrollspy';

const spy = new scrollspy('#toc', {
    offset: 80,
    nested: true,
    nestedClass: 'parent-active',
    reflow: true,
    events: true,
    observe: true
});
```

---

## ⚙️ Options

All available options for customizing behavior:

| Option            | Type                     | Default           | Description                                                                                                                                                                                                                                               |
|-------------------|--------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `nav`             | `string`                 | —                 | **(Required)** Selector for the navigation container. Specifies where to find the navigation links (usually your Table of Contents or sidebar).                                                                                                           |
| `content`         | `string`                 | `[data-gumshoe]`  | Selector for scrollable content sections (matched by ID from nav href). Used for observing DOM mutations (if observe: true) and for internal mapping. <br/>**You don’t usually need to change this unless your content isn’t identified by IDs directly** |
| `nested`          | `boolean`                | `false`           | Add a class to parent `<li>` items in nested TOC structures                                                                                                                                                                                               |
| `nestedClass`     | `string`                 | `'active-parent'` | Class name for parent `<li>` elements when nested is `true`                                                                                                                                                                                               |
| `offset`          | `number \| () => number` | `0`               | Scroll offset in pixels or a function returning an offset (e.g. fixed headers)                                                                                                                                                                            |
| `bottomThreshold` | `number`                 | `100`             | Distance (in px) from bottom of page where last section is auto-activated.                                                                                                                                                                                |
| `reflow`          | `boolean`                | `false`           | If `true`, recomputes layout on window resize                                                                                                                                                                                                             |
| `events`          | `boolean`                | `true`            | Emits custom DOM events (`gumshoeactivate`, `gumshoedeactivate`)                                                                                                                                                                                          |
| `observe`         | `boolean`                | `false`           | Enables a `MutationObserver` to track DOM changes and refresh content                                                                                                                                                                                     |

> If you're using `observe: true`, make sure your headings or section wrappers have a consistent structure, and set a
> data-gumshoe attribute if you change the default selector.

---

## 📡 Events

These custom events are fired on the document when scrollspy updates:

### `gumshoeactivate`

Triggered when a new section becomes active.

```js
document.addEventListener('gumshoeactivate', (e) => {
    console.log('Activated:', e.detail.target.id);
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

## ✅ Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅       |
| Firefox | ✅       |
| Safari  | ✅       |
| Edge    | ✅       |
| IE11    | ❌       |

⚠️ Requires `IntersectionObserver` and `CustomEvent`. You may need polyfills for legacy environments.

---

## 🧼 License

Licensed under [MIT](https://opensource.org/licenses/MIT).