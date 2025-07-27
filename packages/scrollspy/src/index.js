'use strict';

export default class ScrollSpy {
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
      fragmentAttribute: null,
      navItemSelector: 'a[href*="#"]',
      ...options,
    };

    this.nav = null;
    this.contents = [];
    this.current = [];
    this.navMap = new Map(); // Cache of content.id => nav anchor element
    this._observer = null; // MutationObserver reference
    this._listeners = [];

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
   * Retrieves the elements specified by anchor tags in the navigation
   * and maps them to corresponding target elements within the document based on their ID.
   * Populates the `contents` and `navMap` properties with the targets and their references.
   * This method uses the `fragmentAttribute` setting to determine how to find the target elements.
   *
   * @return {void} This method does not return a value. Updates internal properties `contents` and `navMap`.
   */
  getContents() {
    let navItems;
    const { fragmentAttribute, navItemSelector } = this.settings;
    if (fragmentAttribute) {
      navItems = this.nav?.querySelectorAll(navItemSelector || 'a') || [];
    } else {
      navItems = this.nav?.querySelectorAll(navItemSelector || 'a[href*="#"]') || [];
    }
    this.contents = [];
    this.navMap.clear();

    navItems.forEach(item => {
      let fragment = null;
      if (typeof fragmentAttribute === 'function') {
        fragment = fragmentAttribute(item);
      } else if (typeof fragmentAttribute === 'string' && fragmentAttribute) {
        fragment = item.getAttribute(fragmentAttribute);
      } else {
        const href = item.getAttribute('href');
        if (!href) return;
        // Support both #fragment and /route#fragment
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;
        fragment = href.slice(hashIndex + 1);
      }
      if (!fragment) return;
      const target = document.getElementById(fragment);
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
    this._listeners.push(['scroll', onScrollOrResize]);
    if (this.settings.reflow) {
      window.addEventListener('resize', onScrollOrResize, false);
      this._listeners.push(['resize', onScrollOrResize]);
    }
  }

  destroyListeners() {
    if (this._listeners) {
      this._listeners.forEach(([event, handler]) => {
        window.removeEventListener(event, handler, false);
      });
      this._listeners = [];
    }
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
    this.destroyListeners();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}