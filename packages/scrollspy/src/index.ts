import type {
  ContentPosition,
  EventListener,
  ScrollSpyEvent,
  ScrollSpyOptions,
} from './types';

/**
 * ScrollSpy - A framework-agnostic scrollspy implementation
 *
 * Automatically activates navigation items based on scroll position,
 * with support for nested navigation, custom fragments, and dynamic content.
 */
export default class ScrollSpy {
  private readonly settings: Required<ScrollSpyOptions>;
  private _nav: HTMLElement | null;
  private contents: Element[];
  private current: Element[];
  private navMap: Map<string, Element>;
  private _observer: MutationObserver | null;
  private _listeners: EventListener[];

  /**
   * Creates a new ScrollSpy instance
   *
   * @param selector - The selector for the navigation container
   * @param options - Configuration options for the ScrollSpy instance
   */
  constructor(selector: string, options: ScrollSpyOptions = {}) {
    this.settings = {
      nav: selector,
      content: '[data-gumshoe]',
      nested: false,
      nestedClass: 'active-parent',
      offset: 0,
      bottomThreshold: 100,
      reflow: false,
      events: true,
      observe: false,
      fragmentAttribute: null,
      navItemSelector: 'a[href*="#"]',
      ...options,
    } as Required<ScrollSpyOptions>;

    this._nav = null;
    this.contents = [];
    this.current = [];
    this.navMap = new Map();
    this._observer = null;
    this._listeners = [];

    this.init();
  }

  /**
   * Gets the navigation element
   */
  get nav(): HTMLElement | null {
    return this._nav;
  }

  /**
   * Sets the navigation element
   */
  private set nav(value: HTMLElement | null) {
    this._nav = value;
  }

  /**
   * Initializes the navigation system by selecting the navigation element
   * based on the provided settings, verifying its existence, and then
   * invoking helper methods to perform the necessary operations: retrieving content,
   * detecting changes, and setting up event listeners.
   */
  init(): void {
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
   */
  getContents(): void {
    let navItems: NodeListOf<Element>;
    const { fragmentAttribute, navItemSelector } = this.settings;

    if (fragmentAttribute) {
      navItems = this.nav?.querySelectorAll(navItemSelector || 'a') ?? new NodeList() as unknown as NodeListOf<Element>;
    } else {
      navItems = this.nav?.querySelectorAll(navItemSelector || 'a[href*="#"]') ?? new NodeList() as unknown as NodeListOf<Element>;
    }

    this.contents = [];
    this.navMap.clear();

    navItems.forEach((item) => {
      let fragment: string | null;

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
   * It checks for any changes in the active state and updates the status accordingly by
   * deactivating all and activating the new active position.
   */
  detect(): void {
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
   * @returns An array of objects containing the content element and its corresponding top offset.
   */
  getPositions(): ContentPosition[] {
    return this.contents.map((content) => ({
      content,
      offset: this.getOffsetTop(content),
    }));
  }

  /**
   * Computes the total offset top value of a given DOM element relative to its offset parent chain.
   *
   * @param element - The DOM element for which to calculate the offset top value.
   * @returns The total offset top in pixels relative to the document.
   */
  getOffsetTop(element: Element): number {
    let offset = 0;
    let current: Element | null = element;

    while (current && (current as HTMLElement).offsetParent) {
      offset += (current as HTMLElement).offsetTop;
      current = (current as HTMLElement).offsetParent as Element;
    }

    return offset;
  }

  /**
   * Calculates and returns the current viewport position, taking into account the scroll position
   * and a dynamic offset based on proximity to the bottom of the document.
   *
   * @returns The calculated viewport position.
   */
  getViewportPosition(): number {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const nearBottom = scrollTop + windowHeight >= documentHeight - 50;
    const offsetValue = typeof this.settings.offset === 'function'
      ? this.settings.offset()
      : this.settings.offset;
    const dynamicOffset = nearBottom ? offsetValue - 100 : offsetValue;

    return scrollTop + dynamicOffset;
  }

  /**
   * Determines the currently active sections based on the provided positions and the current scroll position.
   *
   * @param positions - An array of objects representing sections, each including an `offset` for its position and `content` for its HTML element.
   * @param position - The current scroll position or offset of the viewport.
   * @returns An array of HTML elements representing the currently active sections. If near the bottom, includes the most visible section.
   */
  getCurrentActive(positions: ContentPosition[], position: number): Element[] {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const nearBottom =
      scrollTop + windowHeight >= documentHeight - this.settings.bottomThreshold;

    if (nearBottom && this.settings.bottomThreshold > 0) {
      return [positions[positions.length - 1]?.content || positions[0]?.content].filter(
        Boolean,
      );
    }

    for (let i = positions.length - 1; i >= 0; i -= 1) {
      if (position >= positions[i].offset) {
        return [positions[i].content];
      }
    }

    return [];
  }

  /**
   * Compares the provided active array with the current array to determine if the active state represents a new change.
   *
   * @param active - The active array to compare with the current array.
   * @returns Returns true if the active array is different from the current array, otherwise false.
   */
  isNewActive(active: Element[]): boolean {
    return active[0] !== this.current[0];
  }

  /**
   * Deactivates all elements marked as active within the navigation element.
   * Removes the 'active' class from all elements. If nested settings are enabled,
   * it also removes the specified nested class from those elements.
   */
  deactivateAll(): void {
    this.nav?.querySelectorAll('.active').forEach((item) => {
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
   * @param active - An array of elements to be activated. Each element represents a piece of
   * content that corresponds to a navigation item.
   */
  activate(active: Element[]): void {
    active.forEach((content) => {
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
   * @param content - The content object, which should contain an `id` property used to locate the corresponding navigation item.
   * @returns The closest list item (`li`) containing the matching anchor, or the anchor element itself if no list item is found.
   * Returns null if no matching element is found.
   */
  getNavItem(content: Element): Element | null {
    const anchor = this.navMap.get(content.id);
    return anchor?.closest('li') || anchor || null;
  }

  /**
   * Adds nested navigation functionality by applying a specified class to parent list items.
   * This method ensures that parent `<li>` elements of the provided item are assigned a nested class
   * if the `nested` setting is enabled.
   *
   * @param item - The navigation item for which parent hierarchy should be processed for adding nested classes.
   */
  addNestedNavigation(item: Element): void {
    if (!this.settings.nested) return;

    let parent: Element | null = item.parentElement;
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
   * @param type - The type of the event to be emitted ('activate' or 'deactivate').
   * @param content - The content associated with the event.
   * @param nav - The navigation-related details to be included in the event.
   */
  emitEvent(type: string, content: Element, nav: Element): void {
    if (!this.settings.events) return;

    const eventName = `gumshoe${type}`;
    const CustomEventClass = (typeof window !== 'undefined' && window.CustomEvent) || CustomEvent;
    const event = new CustomEventClass<ScrollSpyEvent>(eventName, {
      bubbles: true,
      detail: { target: content, content, nav },
    } as CustomEventInit<ScrollSpyEvent>);

    document.dispatchEvent(event as Event);
  }

  /**
   * Sets up event listeners for scroll and, optionally, resize events.
   * These events trigger the detect method after debouncing via requestAnimationFrame.
   */
  setupListeners(): void {
    let timeout: number | null = null;

    const onScrollOrResize = () => {
      if (timeout !== null) cancelAnimationFrame(timeout);
      timeout = requestAnimationFrame(() => this.detect());
    };

    window.addEventListener('scroll', onScrollOrResize, false);
    this._listeners.push(['scroll', onScrollOrResize]);

    if (this.settings.reflow) {
      window.addEventListener('resize', onScrollOrResize, false);
      this._listeners.push(['resize', onScrollOrResize]);
    }
  }

  /**
   * Removes all registered event listeners.
   */
  destroyListeners(): void {
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
   */
  setup(): void {
    this.getContents();
    this.detect();
  }

  /**
   * Refreshes the current state by retrieving the latest contents and performing necessary updates.
   */
  refresh(): void {
    this.getContents();
    this.detect();
  }

  /**
   * Observes changes in the DOM structure, such as the addition or removal of child elements,
   * within specific target elements and triggers a refresh when mutations occur.
   */
  observeChanges(): void {
    type GlobalWithMutationObserver = typeof globalThis & { MutationObserver: typeof MutationObserver };
    const MutationObserverClass = typeof MutationObserver !== 'undefined' 
      ? MutationObserver 
      : (globalThis as unknown as GlobalWithMutationObserver).MutationObserver;
    
    const observer = new MutationObserverClass(() => this.refresh());
    const config: MutationObserverInit = { childList: true, subtree: true };

    if (this.nav) observer.observe(this.nav, config);

    this.contents.forEach((content) => {
      const parent = content.parentElement;
      if (parent) observer.observe(parent, config);
    });

    this._observer = observer;
  }

  /**
   * Cleans up and removes any active event listeners or data associated with the instance.
   * Resets the current state and deactivates all active components or tasks.
   */
  destroy(): void {
    this.current = [];
    this.deactivateAll();
    this.destroyListeners();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}

// Re-export types for public API
export type {
  ContentPosition,
  ScrollSpyEvent,
  ScrollSpyOptions,
} from './types';
