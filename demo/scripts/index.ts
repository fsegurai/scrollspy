import { mdRender } from './utils/markdown';
import { generateTOC, initScrollspy, setupMobileToggle, setupSmoothScroll } from './utils/toc';

const mdBody = document.querySelector('.markdown-body') as HTMLElement;
const loadingSpinner = document.querySelector('#loadingSpinner') as HTMLElement;
const readmeURL =
  'https://raw.githubusercontent.com/fsegurai/scrollspy/refs/heads/main/README.md';

const stripContent = () => {
  // Remove the "Table of Contents" heading and the next sibling (the list)
  const tocHeading = Array.from(mdBody.querySelectorAll('h2')).find(
    (h) => h.textContent?.trim().toLowerCase().includes('table of contents'),
  );

  if (tocHeading) {
    const tocList = tocHeading.nextElementSibling;
    tocHeading.remove();
    if (tocList && tocList.tagName.toLowerCase() === 'ul') tocList.remove();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (mdBody) {
    fetch(readmeURL)
      .then(response => response.text())
      .then(text => {
        mdRender(text, mdBody);

        // Hide the TOC for the README.md
        stripContent();

        // Generate TOC from rendered content
        generateTOC(mdBody);

        // Setup functionality
        setupMobileToggle();
        setupSmoothScroll();

        // Initialize scrollspy after TOC is generated
        initScrollspy(); // Start with the progressive mode

        // Hide loading spinner after content is rendered
        setTimeout(() => {
          if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
            setTimeout(() => {
              loadingSpinner.style.display = 'none';
            }, 300);
          }
        }, 500);
      })
      .catch(error => {
        mdBody.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <h2 style="color: var(--md-sys-color-error);">Failed to load README.md</h2>
            <p style="color: var(--md-sys-color-on-surface);">${ error }</p>
          </div>
        `;

        // Hide loading spinner on error too
        if (loadingSpinner) {
          loadingSpinner.classList.add('hidden');
          setTimeout(() => {
            loadingSpinner.style.display = 'none';
          }, 300);
        }
      });
  }
});