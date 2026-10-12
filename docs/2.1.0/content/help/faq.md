---
label: FAQ
description: Frequently asked questions about @fsegurai/scrollspy.
order: 1
tags: [ "help", "faq" ]
---

# FAQ

**Does it have dependencies?**
No. The package has no runtime dependencies.

**Can more than one section be active?**
No. One section is active at a time.

**Can I change the `active` class name?**
No. `active` is fixed. Only the nested parent class is configurable (`nestedClass`).

**Does ScrollSpy scroll the page when I click a link?**
No. It only tracks position. Use native anchor behavior, CSS `scroll-behavior: smooth`, or your own handler.

**What does the `content` option do?**
It is declared with a default of `'[data-gumshoe]'`, but sections are resolved from nav fragments, not from that
selector.

**Is it compatible with Gumshoe?**
Event names (`gumshoeactivate`, `gumshoedeactivate`) and the `data-gumshoe` convention follow Gumshoe naming. The API
is its own; check the [API reference](../api/README.md).

**What changed in 2.x?**
2.0.0 migrated the library to TypeScript and ships ESM, CommonJS, UMD, and declaration files. 2.1.0 contains tooling,
build, and documentation changes. See the [changelog](https://github.com/fsegurai/scrollspy/blob/main/CHANGELOG.md).

**Which browsers are supported?**
Current Chrome, Firefox, Safari, and Edge. IE11 is not supported.
