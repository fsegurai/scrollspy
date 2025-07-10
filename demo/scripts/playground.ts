import { mdRender } from './utils/markdown';
import mdSample from './utils/markdown.example';
import { debounce } from './utils/debounce';
import { generateTOC, initScrollspy, setupMobileToggle, setupSmoothScroll } from "./utils/toc";

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