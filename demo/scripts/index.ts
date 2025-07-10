import { mdRender } from './utils/markdown';
import { generateTOC, initScrollspy, setupMobileToggle, setupSmoothScroll } from './utils/toc';

const mdBody = document.querySelector('.md-body') as HTMLElement;
const readmeURL =
  'https://raw.githubusercontent.com/fsegurai/scrollspy/refs/heads/main/README.md';

const fetchReadme = async() => {
  try {
    const response = await fetch(readmeURL);
    const text = await response.text();
    mdRender(text, mdBody);
  } catch (error) {
    mdBody.innerHTML = `
        <p>Failed to load README.md</p>
        
        <p>${ error }</p>
        `;
  }
};

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

document.addEventListener('DOMContentLoaded', async() => {
  if (mdBody) {
    await fetchReadme().then(() => {
      // Hide the TOC for the README.md
      stripContent();

      // Generate TOC from rendered content
      generateTOC(mdBody);

      // Setup functionality
      setupMobileToggle();
      setupSmoothScroll();

      // Initialize scrollspy after TOC is generated
      initScrollspy(); // Start with the progressive mode
    }).catch(error => {
      mdBody.innerHTML = `
          <p>Failed to load README.md</p>
          
          <p>${ error }</p>
          `;
    });
  }
});
