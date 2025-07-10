import { mdRender } from './utils/markdown';
import mdSample from './utils/markdown.example';
import scrollspy from '@fsegurai/scrollspy';
import { debounce } from './utils/debounce';

let spy: scrollspy;

// Function to generate TOC from rendered content
function generateTOC(content: HTMLElement): void {
  const tocNav = document.getElementById('tableOfContents');
  if (!tocNav) return;

  // Find all headings in the content
  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');

  // Clear existing TOC content except the header
  const existingUl = tocNav.querySelector('ul');
  if (existingUl) {
    existingUl.remove();
  }

  // Create a new TOC structure
  const tocUl = document.createElement('ul');
  let currentLevel = 0;
  let currentParent: HTMLElement = tocUl;
  const levelStack: HTMLElement[] = [tocUl];

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent || '';

    // Generate ID if not exists
    if (!heading.id) {
      heading.id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }

    // Add data-gumshoe attribute for scrollspy
    heading.setAttribute('data-gumshoe', '');
    heading.classList.add('demo-section');

    // Adjust nesting based on heading level
    if (level > currentLevel) {
      // Going deeper - create nested ul
      const nestedUl = document.createElement('ul');
      nestedUl.classList.add('nested');

      const lastLi = currentParent.lastElementChild;
      if (lastLi) {
        lastLi.appendChild(nestedUl);
      } else {
        currentParent.appendChild(nestedUl);
      }

      currentParent = nestedUl;
      levelStack.push(nestedUl);
    } else if (level < currentLevel) {
      // Going up - pop from stack
      const levelDiff = currentLevel - level;
      for (let i = 0; i < levelDiff; i++) {
        levelStack.pop();
      }
      currentParent = levelStack[levelStack.length - 1];
    }

    currentLevel = level;

    // Create a TOC item
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${ heading.id }`;
    a.textContent = text;

    li.appendChild(a);
    currentParent.appendChild(li);
  });

  // Append the generated TOC to the nav
  tocNav.appendChild(tocUl);
}

// Initialize scrollspy
function initScrollspy(): void {
  // Destroy an existing instance
  if (spy) spy.destroy();

  spy = new scrollspy('#tableOfContents', {
    // content: '[data-test]',
    offset: 120,
    bottomThreshold: 10,
    nested: false,
    nestedClass: '',
    reflow: true,
    events: true,
  });
}

// Mobile toggle functionality
const setupMobileToggle = (): void => {
  const tocToggle = document.getElementById('tocToggle');
  const toc = document.getElementById('tableOfContents');

  tocToggle?.addEventListener('click', () => {
    toc?.classList.toggle('mobile-visible');
    toc?.classList.toggle('mobile-hidden');
  });
};

// Smooth scroll functionality
const setupSmoothScroll = (): void => {
  // Use event delegation since TOC is generated dynamically
  const toc = document.getElementById('tableOfContents');

  toc?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();

      const targetId = target.getAttribute('href')?.substring(1);
      const targetElement = targetId ? document.getElementById(targetId) : null;

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }

      // Hide mobile TOC after click
      if (window.innerWidth <= 768) {
        const tocNav = document.getElementById('tableOfContents');
        tocNav?.classList.remove('mobile-visible');
        tocNav?.classList.add('mobile-hidden');
      }
    }
  });
};

// Debug event listener
document.addEventListener('gumshoeactivate', (event: CustomEvent) => {
  console.log('Scrollspy activated section:', event.detail.target.id);
  console.log('Nav item:', event.detail.nav);
});

const mdBody = document.querySelector('.md-body') as HTMLElement;
const mdEditor = document.querySelector('.md-editor');

/**
 * Handles changes in the Markdown editor with a debounced function.
 *
 * This function retrieves the current value of the Markdown editor, processes it
 * to render the Markdown content, generates a table of contents (TOC),
 * and initializes the scrollspy functionality. It is debounced to delay invocation
 * by 300 milliseconds to optimize performance and reduce unnecessary executions
 * during rapid input changes.
 */
const handleEditorChange = debounce(() => {
  const value = (mdEditor as HTMLTextAreaElement).value || '';
  mdRender(value, mdBody);

  generateTOC(mdBody);
  initScrollspy();
}, 250);

// Initialize the Markdown editor and render the initial content
document.addEventListener('DOMContentLoaded', () => {
  if (mdEditor && mdBody) {
    // Render Markdown content
    (mdEditor as HTMLTextAreaElement).value = mdSample;
    mdRender(mdSample, mdBody);

    // Watch the textarea for changes
    mdEditor.addEventListener('input', handleEditorChange);

    // Generate TOC from rendered content
    generateTOC(mdBody);

    // Setup functionality
    setupMobileToggle();
    setupSmoothScroll();

    // Initialize scrollspy after TOC is generated
    initScrollspy(); // Start with the progressive mode
  }
});

export { spy };