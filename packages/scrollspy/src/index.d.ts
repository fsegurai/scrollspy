export interface ScrollspyOptions {
  nav?: string;
  content?: string;
  nested?: boolean;
  nestedClass?: string;
  offset?: number;
  bottomThreshold?: number;
  reflow?: boolean;
  events?: boolean;
  observe?: boolean;
}

export interface ScrollspyEvent {
  target: Element;
  content: Element;
  nav: Element;
}

declare class ScrollSpy {
  constructor(selector: string, options?: ScrollspyOptions);

  /**
   * Initialize the scrollspy instance
   */
  init(): void;

  /**
   * Get content elements based on navigation links
   */
  getContents(): void;

  /**
   * Detect the current scroll position and activate corresponding navigation
   */
  detect(): void;

  /**
   * Get positions of all content elements
   */
  getPositions(): { content: Element; offset: number }[];

  /**
   * Get the offset top position of an element
   */
  getOffsetTop(element: Element): number;

  /**
   * Get the current viewport position with offset
   */
  getViewportPosition(): number;

  /**
   * Currently get active elements based on scroll position
   */
  getCurrentActive(positions: { content: Element; offset: number }[], position: number): Element[];

  /**
   * Check if the active elements have changed
   */
  isNewActive(active: Element[]): boolean;

  /**
   * Deactivate all navigation items
   */
  deactivateAll(): void;

  /**
   * Activate navigation items for given content elements
   */
  activate(active: Element[]): void;

  /**
   * Get navigation item for a content element
   */
  getNavItem(content: Element): Element | null;

  /**
   * Add nested navigation classes to parent elements
   */
  addNestedNavigation(item: Element): void;

  /**
   * Emit custom events
   */
  emitEvent(type: string, content: Element, nav: Element): void;

  /**
   * Setup scrolls and resizes event listeners
   */
  setupListeners(): void;

  /**
   * Refresh the scrollspy to detect content changes
   */
  setup(): void;

  /**
   * Refresh the scrollspy to detect content changes
   */
  refresh(): void;

  /**
   * Observe DOM changes and refresh when mutations occur
   */
  observeChanges(): void;

  /**
   * Destroy the scrollspy instance and clean up event listeners
   */
  destroy(): void;
}

export default scrollspy;

declare global {
  interface DocumentEventMap {
    'gumshoeactivate': CustomEvent<ScrollspyEvent>;
  }
}
