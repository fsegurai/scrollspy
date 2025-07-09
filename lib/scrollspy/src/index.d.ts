export interface ScrollspyOptions {
  nav?: string;
  content?: string;
  nested?: boolean;
  nestedClass?: string;
  offset?: number;
  reflow?: boolean;
  events?: boolean;
}

export interface ScrollspyEvent {
  target: Element;
  content: Element;
  nav: Element;
}

declare class scrollspy {
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
   * Detect current scroll position and activate corresponding navigation
   */
  detect(): void;

  /**
   * Get positions of all content elements
   */
  getPositions(): Array<{ content: Element; offset: number }>;

  /**
   * Get offset top position of an element
   */
  getOffsetTop(element: Element): number;

  /**
   * Get current viewport position with offset
   */
  getViewportPosition(): number;

  /**
   * Get currently active elements based on scroll position
   */
  getCurrentActive(positions: Array<{ content: Element; offset: number }>, position: number): Element[];

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
   * Setup scroll and resize event listeners
   */
  setupListeners(): void;

  /**
   * Refresh the scrollspy to detect content changes
   */
  setup(): void;

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