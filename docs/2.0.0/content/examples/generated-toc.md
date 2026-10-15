---
label: Generated TOC
description: Build a table of contents from headings and attach ScrollSpy, following the repository demo.
order: 2
tags: [ "examples", "toc", "demo" ]
keywords: [ "generateTOC", "data-gumshoe", "headings" ]
---

# Generated TOC

The repository demo (`demo/scripts/utils/toc.ts`) builds the TOC from headings, then creates ScrollSpy.
This is a simplified flat version of that flow.

```ts
import ScrollSpy from '@fsegurai/scrollspy';

const slug = (text: string) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

function buildToc(content: HTMLElement, nav: HTMLElement): void {
  const ul = document.createElement('ul');

  content.querySelectorAll('h2, h3').forEach((heading) => {
    if (!heading.id) heading.id = slug(heading.textContent ?? '');
    heading.setAttribute('data-gumshoe', '');

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.querySelector('ul')?.remove();
  nav.appendChild(ul);
}

let spy: ScrollSpy | undefined;

export function render(content: HTMLElement): void {
  buildToc(content, document.getElementById('tableOfContents') as HTMLElement);

  spy?.destroy();
  spy = new ScrollSpy('#tableOfContents', {
    offset: 120,
    bottomThreshold: 10,
    reflow: true,
    events: true,
  });
}
```

The `data-gumshoe` attribute matches the default `content` option and is useful for styling, but ScrollSpy finds
sections through the link fragments.
