---
label: FAQ
description: Frequently asked questions about @fsegurai/scrollspy.
order: 2
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
The event name `gumshoeactivate` and the `data-gumshoe` convention follow Gumshoe naming. The API
is its own; check the [API reference](../api/README.md).

**Is there a deactivate event?**
No. The 1.0.x README mentions `gumshoedeactivate`, but only `gumshoeactivate` is dispatched. See
[Custom events](../features/custom-events.md).

**Can `offset` be a function?**
Not at runtime in 1.0.x, even though the types allow it. Pass a number. Function offsets work from 2.0.0.

**Is 1.0.x written in TypeScript?**
No. The runtime is JavaScript (`src/index.js`) with a hand-written `src/index.d.ts`. The TypeScript rewrite shipped in
2.0.0.

**What changed in this version?**
See [What's new in 1.0.0](whats-new.md).

**Which browsers are supported?**
Current Chrome, Firefox, Safari, and Edge. IE11 is not supported.
