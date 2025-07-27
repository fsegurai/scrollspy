import ScrollSpy from '@fsegurai/scrollspy';

let spy: ScrollSpy;

/**
 * Generates a table of contents (TOC) dynamically based on the headings within a provided HTML content element.
 * It creates links to each heading and appends the TOC to an element with the ID `tableOfContents`.
 *
 * @param {HTMLElement} content - The HTML element containing the headings to be included in the TOC.
 * @return {void} This function does not return a value. It modifies the DOM by creating and appending a TOC structure.
 */
export const generateTOC = (content: HTMLElement): void => {
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
};

/**
 * Initializes the mobile toggle functionality for the table of contents (TOC).
 *
 * This function sets up an event listener on the toggle button that controls
 * the visibility of the TOC on mobile devices. When the button is clicked, the
 * corresponding classes are added or removed to handle the visibility state
 * of the TOC.
 *
 * Classes toggled:
 * - `mobile-visible`: Indicates the TOC is visible on mobile devices.
 * - `mobile-hidden`: Indicates the TOC is hidden on mobile devices.
 *
 * Elements involved:
 * - `#tocToggle`: The toggle button element.
 * - `#tableOfContents`: The TOC element to show or hide.
 *
 * This function assumes the relevant elements exist in the DOM.
 */
export const setupMobileToggle = (): void => {
  const tocToggle = document.getElementById('tocToggle');
  const toc = document.getElementById('tableOfContents');

  tocToggle?.addEventListener('click', () => {
    toc?.classList.toggle('mobile-visible');
    toc?.classList.toggle('mobile-hidden');
  });
};

/**
 * Initializes smooth scrolling functionality for the Table of Contents (TOC).
 * This function uses event delegation to handle click events on the dynamically
 * generated TOC links. Smoothly scrolls to the linked section and adjusts for
 * a predefined offset to account for any fixed headers or spacing. Also manages
 * TOC visibility on mobile devices by toggling corresponding CSS classes.
 *
 * The target TOC element must have the ID `tableOfContents` and contain anchor tags (`<a>`)
 * with `href` attributes referencing valid section IDs (e.g., `#sectionId`).
 *
 * Behavior:
 * - Prevents default browser action for TOC link clicks.
 * - Scrolls smoothly to the section referenced by the link.
 * - Hides the mobile TOC navigation menu after selecting a link, if the viewport width
 *   is 768px or less.
 *
 * Note:
 * - Sections being linked to by the TOC must have corresponding IDs matching the `href` values.
 * - Assumes the global `window.innerWidth` to determine the current viewport size.
 */
export const setupSmoothScroll = (): void => {
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

/**
 * Initializes the scrollspy instance for the element with the ID 'tableOfContents'.
 * If a scrollspy instance already exists, it is destroyed before creating a new one.
 *
 * The scrollspy is configured with the following options:
 * - offset: Sets the offset value for observing elements.
 * - bottomThreshold: Defines the threshold from the bottom where the scrollspy is triggered.
 * - nested: Indicates whether nested scrolling is enabled (false by default).
 * - nestedClass: Specifies a class name for nested elements (empty by default).
 * - reflow: Ensures the scrollspy recalculates positions (enabled by default).
 * - events: Enables or disables event dispatching (enabled by default).
 *
 * @return {void} This method does not return a value.
 */
export const initScrollspy = (): void => {
  // Destroy an existing instance
  if (spy) spy.destroy();

  spy = new ScrollSpy('#tableOfContents', {
    content: '[data-gumshoe]',
    offset: 120,
    bottomThreshold: 10,
    nested: false,
    nestedClass: '',
    reflow: true,
    events: true,
  });
};