export default class scrollspy {
  constructor(selector, options = {}) {
    this.settings = {
      nav: selector,
      content: '[data-gumshoe]',
      nested: false,
      nestedClass: 'active-parent',
      offset: 0,
      reflow: false,
      events: true,
      ...options
    };

    this.nav = null;
    this.contents = [];
    this.current = [];

    this.init();
  }

  init() {
    this.nav = document.querySelector(this.settings.nav);
    if (!this.nav) return;

    this.getContents();
    this.detect();
    this.setupListeners();
  }

  getContents() {
    const navItems = this.nav?.querySelectorAll('a[href*="#"]') || [];
    this.contents = Array.from(navItems)
      .map(item => {
        const href = item.getAttribute('href');
        if (!href) return null;
        return document.querySelector(href);
      })
      .filter(item => item !== null);
  }

  detect() {
    const positions = this.getPositions();
    const position = this.getViewportPosition();
    const active = this.getCurrentActive(positions, position);

    if (this.isNewActive(active)) {
      this.deactivateAll();
      this.activate(active);
    }
  }

  getPositions() {
    return this.contents.map(content => ({
      content,
      offset: this.getOffsetTop(content)
    }));
  }

  getOffsetTop(element) {
    let offset = 0;
    let current = element;

    while (current && current.offsetParent) {
      offset += current.offsetTop;
      current = current.offsetParent;
    }

    return offset;
  }

  // getViewportPosition() {
  //   return window.pageYOffset + this.settings.offset;
  // }

  getViewportPosition() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // If we're near the bottom, use a more aggressive offset
    const nearBottom = (scrollTop + windowHeight) >= (documentHeight - 50);
    const dynamicOffset = nearBottom ? this.settings.offset - 100 : this.settings.offset;

    return scrollTop + dynamicOffset;
  }

  // getCurrentActive(positions, position) {
  //   return positions
  //     .filter(item => position >= item.offset)
  //     .map(item => item.content);
  // }

  // getCurrentActive(positions, position) {
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;
  //   const scrollTop = window.pageYOffset;
  //
  //   // Check if we're at the bottom of the page
  //   const isAtBottom = (scrollTop + windowHeight) >= (documentHeight - 10); // 10px tolerance
  //
  //   if (isAtBottom) {
  //     // When at bottom, activate the last section
  //     const lastSection = positions[positions.length - 1];
  //     return lastSection ? [lastSection.content] : [];
  //   }
  //
  //   // Normal behavior - sections that are scrolled past
  //   const active = positions
  //     .filter(item => position >= item.offset)
  //     .map(item => item.content);
  //
  //   // If no sections are active but we have content, activate the first one
  //   if (active.length === 0 && positions.length > 0) {
  //     return [positions[0].content];
  //   }
  //
  //   return active;
  // }

  getCurrentActive(positions, position) {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;

    // Check if we're near the bottom (within 100px)
    const nearBottom = (scrollTop + windowHeight) >= (documentHeight - 100);

    if (nearBottom) {
      // Find the section that's most visible in the viewport
      let mostVisible = null;
      let maxVisibility = 0;

      positions.forEach(item => {
        const rect = item.content.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = Math.max(0, visibleHeight) / rect.height;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisible = item.content;
        }
      });

      return mostVisible ? [mostVisible] : [];
    }

    // Normal scrollspy behavior
    return positions
      .filter(item => position >= item.offset)
      .map(item => item.content);
  }

  isNewActive(active) {
    return JSON.stringify(active) !== JSON.stringify(this.current);
  }

  deactivateAll() {
    this.nav?.querySelectorAll('.active').forEach(item => {
      item.classList.remove('active');
      if (this.settings.nested) {
        item.classList.remove(this.settings.nestedClass);
      }
    });
  }

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

  getNavItem(content) {
    const anchor = this.nav?.querySelector(`a[href="#${ content.id }"]`);
    return anchor?.closest('li') || anchor;
  }

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

  emitEvent(type, content, nav) {
    if (!this.settings.events) return;

    const event = new CustomEvent(`gumshoe${ type }`, {
      bubbles: true,
      detail: { target: content, content, nav }
    });

    document.dispatchEvent(event);
  }

  setupListeners() {
    window.addEventListener('scroll', () => this.detect(), false);
    if (this.settings.reflow) {
      window.addEventListener('resize', () => this.detect(), false);
    }
  }

  setup() {
    this.getContents();
    this.detect();
  }

  destroy() {
    this.current = [];
    this.deactivateAll();
    document.removeEventListener('scroll', () => this.detect(), false);
    document.removeEventListener('resize', () => this.detect(), false);
  }
}