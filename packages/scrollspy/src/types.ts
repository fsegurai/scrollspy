/**
 * Configuration options for ScrollSpy instance
 */
export interface ScrollSpyOptions {
  /**
   * Selector for the navigation element. Default: '#nav'
   */
  nav?: string;

  /**
   * Selector for content elements to track. Default: '[data-gumshoe]'
   */
  content?: string;

  /**
   * Enable nested navigation (adds class to parent items). Default: false
   */
  nested?: boolean;

  /**
   * Class name to add to nested parent items. Default: 'active-parent'
   */
  nestedClass?: string;

  /**
   * Offset from the top of the viewport (in pixels) when detecting active section.
   * Can be a fixed number or a function that returns the offset dynamically.
   * Default: 0
   */
  offset?: number | (() => number);

  /**
   * Threshold from bottom of page (in pixels) to activate the last section.
   * Default: 100
   */
  bottomThreshold?: number;

  /**
   * Listen to resize events in addition to scroll. Default: false
   */
  reflow?: boolean;

  /**
   * Emit custom events (gumshoeactivate/gumshoedeactivate). Default: true
   */
  events?: boolean;

  /**
   * Watch for dynamic changes in the DOM using MutationObserver. Default: false
   */
  observe?: boolean;

  /**
   * Custom attribute to use for fragment mapping (e.g., 'data-scrollspy-fragment').
   * If set, ScrollSpy will use this attribute instead of href for mapping nav to content.
   * Can also be a function: (item: Element) => string | null
   */
  fragmentAttribute?: string | null | ((item: Element) => string | null);

  /**
   * Selector for nav items (anchors). Defaults to 'a[href*="#"]'.
   */
  navItemSelector?: string;
}

/**
 * Event detail payload for gumshoe events
 */
export interface ScrollSpyEvent {
  /**
   * The content element that became active
   */
  target: Element;

  /**
   * Alias for target (content element)
   */
  content: Element;

  /**
   * The navigation item (anchor or li) that was activated
   */
  nav: Element;
}

/**
 * Position tracking object for content elements
 */
export interface ContentPosition {
  /**
   * The content element
   */
  content: Element;

  /**
   * The vertical offset (in pixels) from the document top
   */
  offset: number;
}

/**
 * Listener tuple for cleanup tracking
 */
export type EventListener = [event: string, handler: EventListenerOrEventListenerObject];

/**
 * Type augmentation for custom ScrollSpy events in DocumentEventMap
 * 
 * This augmentation makes TypeScript recognize 'gumshoeactivate' and 'gumshoedeactivate'
 * events when using addEventListener/removeEventListener on the document object.
 * 
 * @example
 * ```typescript
 * document.addEventListener('gumshoeactivate', (event) => {
 *   console.log(event.detail.target); // Properly typed as Element
 * });
 * ```
 */
declare global {
  interface DocumentEventMap {
    /**
     * Fired when a section becomes active during scroll
     * @event gumshoeactivate
     * @detail {ScrollSpyEvent} Event detail with target, content, and nav properties
     */
    gumshoeactivate: CustomEvent<ScrollSpyEvent>;

    /**
     * Fired when a section becomes inactive during scroll
     * @event gumshoedeactivate
     * @detail {ScrollSpyEvent} Event detail with target, content, and nav properties
     */
    gumshoedeactivate: CustomEvent<ScrollSpyEvent>;
  }
}


