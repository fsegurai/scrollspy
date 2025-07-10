import { m as mdRender } from './markdown-0nNLAyVa.js';

const mdSample = `
# 🎢 ScrollSpy Playground Sample

Welcome to the playground! Scroll around and watch the navigation glow like a disco floor on a Saturday night. 💃🕺

---

# Introduction

Hey there! This playground is designed to push ScrollSpy to its limits.  
Scroll through the sections, nested content, and funny notes, and see how the TOC stays perfectly in sync — no matter how wild the ride!

---

# Chapter 1 - The Basics

## Section 1.1 - Hello World

Let’s start simple: scrollspy tracks the section currently in view and highlights the corresponding nav link.

Did you know?  
*Scrolling* is like teleportation — but slower.

---

## Section 1.2 - Why ScrollSpy?

Because no one likes to get lost on a page!  
ScrollSpy keeps your navigation alive and kicking.

---

# Chapter 2 - Advanced Techniques

Welcome to the deeper end of the pool. 🏊‍♀️

---

## Section 2.1 - Nested Navigation

This section shows nested navigation support:

- Parent item gets highlighted when any child is active.
- Smooth behavior for complex TOCs.

Scroll down slowly to watch the magic.

---

## Section 2.2 - Dynamic Offset

Adjust the scroll offset to handle fixed headers or sticky navbars.

---

## Section 2.3 - Edge Cases

What if two sections overlap or the page ends?

ScrollSpy handles those gracefully (we hope).

---

# Chapter 3 - Fun with ScrollSpy

## Section 3.1 - Easter Eggs

If you spot any bugs, they're *undocumented features*. 😎

---

## Section 3.2 - Party Mode

Imagine if scrollspy triggered confetti every time you reach a new section. 🎉

(Pssst… maybe you should add that yourself!)

---

# Chapter 4 - The Final Frontier

Last chapter, but not least.

Keep scrolling — you’re almost there!

---

# Conclusion

Thanks for visiting the ScrollSpy playground!

Now go forth and build amazing docs, blogs, or websites —  
and never let your users get lost in the scroll abyss again.

---

# Appendix: Bonus Content

Just because we can…

- Item 1: Lorem ipsum dolor sit amet.
- Item 2: Consectetur adipiscing elit.
- Item 3: ScrollSpy rules! 🚀

---

# Huge Section for Scroll Testing

The Tale of ScrollSpy: The Navigator's Best Friend

Once upon a time, in the vast lands of the Internet, users wandered through endless pages, lost in the wilderness of long content and sprawling documents. They clicked and scrolled, but their navigation menus lay silent, never telling them where they were or where to go next.

Enter ScrollSpy, the vigilant guardian of the navigation realm. Born from the need to keep explorers oriented, ScrollSpy watched the user’s scroll position like a lighthouse keeper watches the sea. With every flick of the wheel or swipe of the finger, ScrollSpy lit up the correct path in the navigation, guiding travelers safely through nested forests of headings and vast deserts of paragraphs.

No longer did users stumble or get confused. With ScrollSpy’s watchful eye, the active section was always highlighted — a friendly beacon shining bright — making the journey smooth, intuitive, and delightful.

And so, ScrollSpy became the navigator’s best friend, silently working behind the scenes, ensuring no one ever got lost again in the endless scroll.

---

# Thanks for scrolling! 👏 

Huge shoutout to all the wonderful folks who make the web a better place every day:

- 🚀 Developers who tirelessly build open source projects that inspire and empower us all.
- 📚 Writers and educators who share knowledge generously, helping us learn and grow.
- 🎨 Designers crafting beautiful, intuitive interfaces that make our digital journeys delightful.
- 🐞 Bug reporters who help us squash those pesky issues before they multiply.
- ☕ Coffee and tea — the real MVPs fueling late-night coding marathons.
- 🐱‍💻 Everyone who’s ever tried, tested, debugged, and pushed the boundaries of what’s possible on the web.

And a special thanks to:

- The creators of the scrolling libraries that paved the way.
- The browsers that faithfully render our code with every update.
- The internet itself — a wild, wonderful place where ideas meet reality.
- Your cat, dog, or pet of choice, who patiently tolerates your coding sessions.
- The cosmic forces that align to keep our bits flowing and bytes buzzing.

Without you, this project would be just a bunch of code lines. Instead, it’s a little beacon of navigation joy!

---

Feel free to take a moment and appreciate the magic of scrolling — it’s a simple act that connects us all.

Keep scrolling, keep exploring, and keep being awesome! 🚀✨


---

### Notes

- Nested sections show how parent highlighting works.
- Long sections test offset and bottom-of-page logic.
`;

class scrollspy {
  constructor(selector, options = {}) {
    this.settings = {
      nav: selector,
      content: '[data-gumshoe]',
      nested: false,
      nestedClass: 'active-parent',
      offset: 0,
      bottomThreshold: 100,
      reflow: false,
      events: true,
      observe: false, // *  watch for dynamic changes
      ...options,
    };

    this.nav = null;
    this.contents = [];
    this.current = [];
    this.navMap = new Map(); // Cache of content.id => nav anchor element
    this._observer = null; // MutationObserver reference

    this.init();
  }

  /**
   * Initializes the navigation system by selecting the navigation element
   * based on the provided settings, verifying its existence, and then
   * invoking helper methods to perform the necessary operations: retrieving content,
   * detecting changes, and setting up event listeners.
   *
   * @return {void} Does not return a value. This is an initialization method
   *                 that prepares the component for operation.
   */
  init() {
    this.nav = document.querySelector(this.settings.nav);
    if (!this.nav) return;

    this.getContents();
    this.detect();
    this.setupListeners();

    if (this.settings.observe) this.observeChanges();
  }

  /**
   * Retrieves and stores DOM elements referenced by anchor tags within the navigation.
   * Identifies links containing hash fragments and resolves the corresponding DOM objects.
   * Filters out any invalid or null references.
   * Updates the `contents` property with an array of resolved DOM elements.
   *
   * @return {void} This method does not return a value.
   */
  getContents() {
    const navItems = this.nav?.querySelectorAll('a[href*="#"]') || [];
    this.contents = [];
    this.navMap.clear();

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (target && target.id) {
        this.contents.push(target);
        this.navMap.set(target.id, item);
      }
    });
  }

  /**
   * Detects the current active position based on viewport and updates the active state if necessary.
   * The method determines the list of positions and identifies the current viewport position.
   * It checks for any changes in the active state and updates the status accordingly by deactivating all and activating the new active position.
   *
   * @return {void} This method does not return a value.
   */
  detect() {
    const positions = this.getPositions();
    const position = this.getViewportPosition();
    const active = this.getCurrentActive(positions, position);

    if (this.isNewActive(active)) {
      this.deactivateAll();
      this.activate(active);
    }
  }

  /**
   * Retrieves an array of positions for the content elements.
   * Each position includes the content element and its vertical offset.
   *
   * @return {Array<{content: HTMLElement, offset: number}>} An array of objects containing the content element and its corresponding top offset.
   */
  getPositions() {
    return this.contents.map(content => ({
      content,
      offset: this.getOffsetTop(content),
    }));
  }

  /**
   * Computes the total offset top value of a given DOM element relative to its offset parent chain.
   *
   * @param {HTMLElement} element - The DOM element for which to calculate the offset top value.
   * @return {number} The total offset top in pixels relative to the document.
   */
  getOffsetTop(element) {
    let offset = 0;
    let current = element;

    while (current && current.offsetParent) {
      offset += current.offsetTop;
      current = current.offsetParent;
    }

    return offset;
  }

  /**
   * Calculates and returns the current viewport position, taking into account the scroll position
   * and a dynamic offset based on proximity to the bottom of the document.
   *
   * @return {number} The calculated viewport position.
   */
  getViewportPosition() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const nearBottom = (scrollTop + windowHeight) >= (documentHeight - 50);
    const dynamicOffset = nearBottom ? this.settings.offset - 100 : this.settings.offset;

    return scrollTop + dynamicOffset;
  }

  /**
   * Determines the currently active sections based on the provided positions and the current scroll position.
   *
   * @param {Array} positions - An array of objects representing sections, each including an `offset` for its position and `content` for its HTML element.
   * @param {number} position - The current scroll position or offset of the viewport.
   * @return {Array} An array of HTML elements representing the currently active sections. If near the bottom, includes the most visible section.
   */
  getCurrentActive(positions, position) {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const nearBottom = (scrollTop + windowHeight) >= (documentHeight - this.settings.bottomThreshold);

    if (nearBottom && this.settings.bottomThreshold > 0) {
      return [positions[positions.length - 1].content];
    }

    for (let i = positions.length - 1; i >= 0; i--) {
      if (position >= positions[i].offset) {
        return [positions[i].content];
      }
    }

    return [];
  }

  /**
   * Compares the provided active object with the current object to determine if the active object represents a new state.
   *
   * @param {Object} active - The active object to compare with the current object.
   * @return {boolean} Returns true if the active object is different from the current object, otherwise false.
   */
  isNewActive(active) {
    return active[0] !== this.current[0];
  }

  /**
   * Deactivates all elements marked as active within the navigation element.
   * Removes the 'active' class from all elements. If nested settings are enabled,
   * it also removes the specified nested class from those elements.
   *
   * @return {void} This method does not return a value.
   */
  deactivateAll() {
    this.nav?.querySelectorAll('.active').forEach(item => {
      item.classList.remove('active');
      if (this.settings.nested) {
        item.classList.remove(this.settings.nestedClass);
      }
    });
  }

  /**
   * Activates the provided content items by adding an 'active' class to corresponding navigation items,
   * handling nested navigation, and emitting an 'activate' event.
   *
   * @param {Array} active - An array of elements to be activated. Each element represents a piece of
   * content that corresponds to a navigation item.
   * @return {void}
   */
  activate(active) {
    active.forEach(content => {
      const navItem = this.getNavItem(content);
      if (navItem) {
        navItem.classList.add('active');
        this.addNestedNavigation(navItem);
        this.emitEvent('activate', content, navItem);
      }
    });

    this.current = active;
  }

  /**
   * Retrieves the navigation list item (`li`) containing the anchor element that references the provided content's ID
   * within the navigation.
   *
   * @param {Object} content - The content object, which should contain an `id` property used to locate the corresponding navigation item.
   * @return {HTMLElement|null} The closest list item (`li`) containing the matching anchor, or the anchor element itself if no list item is found. Returns null if no matching element is found.
   */
  getNavItem(content) {
    const anchor = this.navMap.get(content.id);
    return anchor?.closest('li') || anchor;
  }

  /**
   * Adds nested navigation functionality by applying a specified class to parent list items.
   * This method ensures that parent `<li>` elements of the provided item are assigned a nested class
   * if the `nested` setting is enabled.
   *
   * @param {HTMLElement} item - The navigation item for which parent hierarchy should be processed for adding nested classes.
   * @return {void} This method does not return any value.
   */
  addNestedNavigation(item) {
    if (!this.settings.nested) return;

    let parent = item.parentElement;
    while (parent && parent !== this.nav) {
      if (parent.tagName.toLowerCase() === 'li') {
        parent.classList.add(this.settings.nestedClass);
      }
      parent = parent.parentElement;
    }
  }

  /**
   * Emits a custom event with the specified type, content, and navigation details.
   *
   * @param {string} type - The type of the event to be emitted.
   * @param {Object} content - The content associated with the event.
   * @param {Object} nav - The navigation-related details to be included in the event.
   * @return {void} The method does not return a value.
   */
  emitEvent(type, content, nav) {
    if (!this.settings.events) return;

    const event = new CustomEvent(`gumshoe${ type }`, {
      bubbles: true,
      detail: { target: content, content, nav },
    });

    document.dispatchEvent(event);
  }

  /**
   * Sets up event listeners for scroll and, optionally, resize events.
   * These events trigger the detect method after debouncing via requestAnimationFrame.
   *
   * @return {void} Does not return a value.
   */
  setupListeners() {
    let timeout = null;
    const onScrollOrResize = () => {
      if (timeout) cancelAnimationFrame(timeout);
      timeout = requestAnimationFrame(() => this.detect());
    };

    window.addEventListener('scroll', onScrollOrResize, false);
    if (this.settings.reflow) window.addEventListener('resize', onScrollOrResize, false);
  }


  /**
   * Initializes and configures the necessary parts for the system setup.
   * This method orchestrates the process of gathering the content and detecting required system elements.
   *
   * @return {void} Does not return a value.
   */
  setup() {
    this.getContents();
    this.detect();
  }

  /**
   * Refreshes the current state by retrieving the latest contents and performing necessary updates.
   *
   * @return {void} This method does not return a value.
   */
  refresh() {
    this.getContents();
    this.detect();
  }

  /**
   * Observes changes in the DOM structure, such as the addition or removal of child elements,
   * within specific target elements and triggers a refresh when mutations occur.
   *
   * @return {void} Does not return a value.
   */
  observeChanges() {
    const observer = new MutationObserver(() => this.refresh());
    const config = { childList: true, subtree: true };

    if (this.nav) observer.observe(this.nav, config);

    this.contents.forEach(content => {
      const parent = content.parentElement;
      if (parent) observer.observe(parent, config);
    });

    this._observer = observer;
  }

  /**
   * Cleans up and removes any active event listeners or data associated with the instance.
   * Resets the current state and deactivates all active components or tasks.
   *
   * @return {void} This method does not return a value.
   */
  destroy() {
    this.current = [];
    this.deactivateAll();

    document.removeEventListener('scroll', () => this.detect(), false);
    document.removeEventListener('resize', () => this.detect(), false);

    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}

/**
 * Creates and returns a debounced version of the provided function. The debounced
 * function delays the invocation of the original function until after the specified
 * delay has elapsed since the last time the debounced function was called.
 *
 * @param func - The original function to debounce.
 * @param delay - Delay time in milliseconds (default: 300).
 * @returns A debounced version of the original function.
 */
function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

let spy;
// Function to generate TOC from rendered content
function generateTOC(content) {
    const tocNav = document.getElementById('tableOfContents');
    if (!tocNav)
        return;
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
    let currentParent = tocUl;
    const levelStack = [tocUl];
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
            }
            else {
                currentParent.appendChild(nestedUl);
            }
            currentParent = nestedUl;
            levelStack.push(nestedUl);
        }
        else if (level < currentLevel) {
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
        a.href = `#${heading.id}`;
        a.textContent = text;
        li.appendChild(a);
        currentParent.appendChild(li);
    });
    // Append the generated TOC to the nav
    tocNav.appendChild(tocUl);
}
// Initialize scrollspy
function initScrollspy() {
    // Destroy an existing instance
    if (spy)
        spy.destroy();
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
const setupMobileToggle = () => {
    const tocToggle = document.getElementById('tocToggle');
    const toc = document.getElementById('tableOfContents');
    tocToggle === null || tocToggle === void 0 ? void 0 : tocToggle.addEventListener('click', () => {
        toc === null || toc === void 0 ? void 0 : toc.classList.toggle('mobile-visible');
        toc === null || toc === void 0 ? void 0 : toc.classList.toggle('mobile-hidden');
    });
};
// Smooth scroll functionality
const setupSmoothScroll = () => {
    // Use event delegation since TOC is generated dynamically
    const toc = document.getElementById('tableOfContents');
    toc === null || toc === void 0 ? void 0 : toc.addEventListener('click', (e) => {
        var _a, _b;
        const target = e.target;
        if (target.tagName === 'A' && ((_a = target.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.startsWith('#'))) {
            e.preventDefault();
            const targetId = (_b = target.getAttribute('href')) === null || _b === void 0 ? void 0 : _b.substring(1);
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
                tocNav === null || tocNav === void 0 ? void 0 : tocNav.classList.remove('mobile-visible');
                tocNav === null || tocNav === void 0 ? void 0 : tocNav.classList.add('mobile-hidden');
            }
        }
    });
};
// Debug event listener
document.addEventListener('gumshoeactivate', (event) => {
    console.log('Scrollspy activated section:', event.detail.target.id);
    console.log('Nav item:', event.detail.nav);
});
const mdBody = document.querySelector('.md-body');
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
    const value = mdEditor.value || '';
    mdRender(value, mdBody);
    generateTOC(mdBody);
    initScrollspy();
}, 250);
// Initialize the Markdown editor and render the initial content
document.addEventListener('DOMContentLoaded', () => {
    if (mdEditor && mdBody) {
        // Render Markdown content
        mdEditor.value = mdSample;
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
