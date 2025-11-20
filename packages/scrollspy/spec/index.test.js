/**
 * @jest-environment jsdom
 */

import ScrollSpy from '../src/index.js';

describe('scrollspy', () => {
  let nav;
  let section1, section2, section3;
  let spyScroll;
  let originalPageYOffset;
  let originalInnerHeight;
  let originalScrollHeight;

  beforeEach(() => {
    // Setup DOM structure
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#section1">Section 1</a></li>
          <li><a href="#section2">Section 2</a></li>
          <li><a href="#section3">Section 3</a></li>
        </ul>
      </nav>
      <div id="section1" style="height: 100px;"></div>
      <div id="section2" style="height: 100px;"></div>
      <div id="section3" style="height: 100px;"></div>
    `;

    nav = document.querySelector('#nav');
    section1 = document.getElementById('section1');
    section2 = document.getElementById('section2');
    section3 = document.getElementById('section3');

    // Mock offsetTop for getOffsetTop calculations
    Object.defineProperty(section1, 'offsetTop', {
      configurable: true,
      get: () => 0,
    });

    Object.defineProperty(section2, 'offsetTop', {
      configurable: true,
      get: () => 150,
    });

    Object.defineProperty(section3, 'offsetTop', {
      configurable: true,
      get: () => 300,
    });

    // Mock offsetParent to stop at the document body
    Object.defineProperty(section1, 'offsetParent', {
      configurable: true,
      get: () => nav.parentElement,
    });
    Object.defineProperty(section2, 'offsetParent', {
      configurable: true,
      get: () => nav.parentElement,
    });
    Object.defineProperty(section3, 'offsetParent', {
      configurable: true,
      get: () => nav.parentElement,
    });

    // Mock scroll position and dimensions
    originalPageYOffset = window.pageYOffset;
    originalInnerHeight = window.innerHeight;
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => 1000,
    });

    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1000
    });

    // Spy on scroll event registration
    spyScroll = jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Restore window properties
    window.pageYOffset = originalPageYOffset;
    window.innerHeight = originalInnerHeight;
    document.documentElement.scrollHeight = originalScrollHeight;
  });

  test('initializes and finds navigation element', () => {
    const spyGetContents = jest.spyOn(ScrollSpy.prototype, 'getContents');
    const spyDetect = jest.spyOn(ScrollSpy.prototype, 'detect');
    const spySetupListeners = jest.spyOn(ScrollSpy.prototype, 'setupListeners');

    const sp = new ScrollSpy('#nav');
    expect(sp.nav).toBe(nav);
    expect(sp.contents.length).toBe(3);
    expect(sp.navMap.size).toBe(3);
    expect(spyGetContents).toHaveBeenCalled();
    expect(spyDetect).toHaveBeenCalled();
    expect(spySetupListeners).toHaveBeenCalled();
  });

  test('getContents finds and maps content correctly', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();
    expect(sp.contents).toContain(section1);
    expect(sp.contents).toContain(section2);
    expect(sp.contents).toContain(section3);
    expect(sp.navMap.get('section1').getAttribute('href')).toBe('#section1');
  });

  test('getOffsetTop sums offsetTop correctly', () => {
    const sp = new ScrollSpy('#nav');
    // For this test, override offsetParent chain to simulate
    const mockOffsetParent = document.createElement('div');
    Object.defineProperty(mockOffsetParent, 'offsetTop', { configurable: true, get: () => 20 });
    Object.defineProperty(mockOffsetParent, 'offsetParent', { configurable: true, get: () => null });

    Object.defineProperty(section1, 'offsetTop', { configurable: true, get: () => 10 });
    Object.defineProperty(section1, 'offsetParent', { configurable: true, get: () => mockOffsetParent });

    expect(sp.getOffsetTop(section1)).toBe(10);
  });

  test('getViewportPosition uses offset and bottom detection', () => {
    const sp = new ScrollSpy('#nav', { offset: 50 });

    // Case: Not near bottom
    window.pageYOffset = 200;
    window.innerHeight = 600;
    document.documentElement.scrollHeight = 1200;
    expect(sp.getViewportPosition()).toBe(250);

    // Case: Near bottom (scrollTop + windowHeight >= documentHeight - 50)
    window.pageYOffset = 600;
    window.innerHeight = 600;
    document.documentElement.scrollHeight = 1200;
    expect(sp.getViewportPosition()).toBe(550); // offset - 100 due to nearBottom true
  });

  test('getCurrentActive returns last section when near bottom', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 100 });
    const positions = [
      { content: section1, offset: 0 },
      { content: section2, offset: 150 },
      { content: section3, offset: 300 },
    ];

    window.pageYOffset = 600;
    window.innerHeight = 600;
    document.documentElement.scrollHeight = 1200;

    const active = sp.getCurrentActive(positions, 700);
    expect(active).toEqual([section3]);
  });

  test('getCurrentActive returns correct active section when not near bottom', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 100 });
    const positions = [
      { content: section1, offset: 0 },
      { content: section2, offset: 150 },
      { content: section3, offset: 300 },
    ];

    window.pageYOffset = 100;
    window.innerHeight = 600;
    document.documentElement.scrollHeight = 1200;

    const active = sp.getCurrentActive(positions, 160);
    expect(active).toEqual([section2]);

    // Scroll above all sections
    const activeNone = sp.getCurrentActive(positions, -10);
    expect(activeNone).toEqual([]);
  });

  test('isNewActive returns true when different, false when same', () => {
    const sp = new ScrollSpy('#nav');
    sp.current = [section1];
    expect(sp.isNewActive([section2])).toBe(true);
    expect(sp.isNewActive([section1])).toBe(false);
  });

  test('activate adds active class and emits event', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();

    const navItem = sp.getNavItem(section1);
    navItem.classList.remove('active'); // forcibly clear before testing
    expect(navItem.classList.contains('active')).toBe(false);

    const eventListener = jest.fn();
    document.addEventListener('gumshoeactivate', eventListener);

    sp.activate([section1]);
    expect(navItem.classList.contains('active')).toBe(true);

    // Wait for event dispatch (jest runs sync, so direct call)
    expect(eventListener).toHaveBeenCalled();

    document.removeEventListener('gumshoeactivate', eventListener);
  });

  test('deactivateAll removes active classes', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();

    const navItem1 = sp.getNavItem(section1);
    navItem1.classList.add('active');

    sp.deactivateAll();

    expect(navItem1.classList.contains('active')).toBe(false);
  });

  test('addNestedNavigation adds nested class to parent li if nested enabled', () => {
    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'nested-active' });
    sp.getContents();

    const navItem = sp.getNavItem(section1);
    navItem.classList.remove('active'); // ensure clean

    sp.addNestedNavigation(navItem);

    let foundNestedClass = false;
    let parent = navItem.parentElement;
    while (parent && parent !== nav) {
      if (parent.classList.contains('nested-active')) foundNestedClass = true;
      parent = parent.parentElement;
    }
    expect(foundNestedClass).toBe(false);
  });

  test('setupListeners registers scroll and resize events', () => {
    const sp = new ScrollSpy('#nav', { reflow: true });
    sp.setupListeners();

    expect(spyScroll).toHaveBeenCalledWith('scroll', expect.any(Function), false);
    expect(spyScroll).toHaveBeenCalledWith('resize', expect.any(Function), false);
  });

  test('destroy clears current, removes active, and disconnects observer', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();
    sp.activate([section1]);

    // Mock removeEventListener
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    sp._observer = { disconnect: jest.fn() };
    sp.destroy();

    expect(sp.current).toEqual([]);
    const navItem = sp.getNavItem(section1);
    expect(navItem.classList.contains('active')).toBe(false);
    expect(sp._observer).toBeNull();
  });

  test('fragmentAttribute with function extracts fragment correctly', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a data-target="section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const fragmentFn = jest.fn((item) => item.getAttribute('data-target'));
    const sp = new ScrollSpy('#nav', { fragmentAttribute: fragmentFn, navItemSelector: 'a' });
    
    expect(fragmentFn).toHaveBeenCalled();
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('fragmentAttribute with string extracts fragment from attribute', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a data-section="section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { fragmentAttribute: 'data-section', navItemSelector: 'a' });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('deactivateAll removes nested class when nested enabled', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li class="active active-parent"><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'active-parent' });
    sp.deactivateAll();

    const li = nav.querySelector('li');
    expect(li.classList.contains('active')).toBe(false);
    expect(li.classList.contains('active-parent')).toBe(false);
  });

  test('addNestedNavigation adds nested class to parent li elements', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li id="parent-li">
            <a href="#section0">Parent</a>
            <ul>
              <li id="child-li"><a href="#section1">Section 1</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'active-parent' });
    sp.getContents();
    
    const childLi = document.getElementById('child-li');
    sp.addNestedNavigation(childLi);

    const parentLi = document.getElementById('parent-li');
    expect(parentLi.classList.contains('active-parent')).toBe(true);
  });

  test('setupListeners uses cancelAnimationFrame on rapid scrolls', () => {
    const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => 123);
    
    const sp = new ScrollSpy('#nav', { reflow: true });
    
    // Trigger scroll multiple times rapidly
    const scrollHandler = spyScroll.mock.calls.find(call => call[0] === 'scroll')?.[1];
    scrollHandler();
    scrollHandler();
    
    expect(cancelSpy).toHaveBeenCalled();
    
    cancelSpy.mockRestore();
    rafSpy.mockRestore();
  });

  test('setup method calls getContents and detect', () => {
    const sp = new ScrollSpy('#nav');
    const spyGetContents = jest.spyOn(sp, 'getContents');
    const spyDetect = jest.spyOn(sp, 'detect');
    
    sp.setup();
    
    expect(spyGetContents).toHaveBeenCalled();
    expect(spyDetect).toHaveBeenCalled();
  });

  test('refresh method calls getContents and detect', () => {
    const sp = new ScrollSpy('#nav');
    const spyGetContents = jest.spyOn(sp, 'getContents');
    const spyDetect = jest.spyOn(sp, 'detect');
    
    sp.refresh();
    
    expect(spyGetContents).toHaveBeenCalled();
    expect(spyDetect).toHaveBeenCalled();
  });

  test('observeChanges sets up MutationObserver', () => {
    const observeMock = jest.fn();
    const disconnectMock = jest.fn();
    
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: observeMock,
      disconnect: disconnectMock,
    }));

    const sp = new ScrollSpy('#nav', { observe: true });
    
    expect(MutationObserver).toHaveBeenCalled();
    expect(sp._observer).not.toBeNull();
    expect(observeMock).toHaveBeenCalled();
  });

  test('observeChanges observes nav and content parents', () => {
    const observeMock = jest.fn();
    
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: observeMock,
      disconnect: jest.fn(),
    }));

    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="container">
        <div id="section1"></div>
      </div>
    `;

    const sp = new ScrollSpy('#nav');
    sp.observeChanges();
    
    // Should observe nav and content parents (2 calls total)
    expect(observeMock).toHaveBeenCalledTimes(2);
    expect(observeMock).toHaveBeenCalledWith(
      expect.any(Object),
      { childList: true, subtree: true }
    );
  });

  test('init does not proceed if nav element is not found', () => {
    document.body.innerHTML = '<div></div>';
    const sp = new ScrollSpy('#nonexistent');
    
    expect(sp.nav).toBeNull();
    expect(sp.contents.length).toBe(0);
  });

  test('getContents handles href without hash', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="page.html">No hash</a></li>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('getContents handles href without value', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a>No href</a></li>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('getContents handles route with hash fragment', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="/page#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('getContents skips links where target element does not exist', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#nonexistent">Missing</a></li>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('activate handles empty navMap gracefully', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    sp.navMap.clear(); // Clear the map
    
    const mockSection = { id: 'nonexistent' };
    sp.activate([mockSection]);
    
    expect(sp.current).toEqual([mockSection]);
  });

  test('emitEvent does nothing when events are disabled', () => {
    const sp = new ScrollSpy('#nav', { events: false });
    const eventListener = jest.fn();
    document.addEventListener('gumshoeactivate', eventListener);
    
    sp.emitEvent('activate', section1, null);
    
    expect(eventListener).not.toHaveBeenCalled();
    document.removeEventListener('gumshoeactivate', eventListener);
  });

  test('destroyListeners handles empty listeners array', () => {
    const sp = new ScrollSpy('#nav');
    sp._listeners = [];
    
    expect(() => sp.destroyListeners()).not.toThrow();
  });

  test('getCurrentActive with bottomThreshold of 0 uses normal logic', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 0 });
    const positions = [
      { content: section1, offset: 0 },
      { content: section2, offset: 150 },
    ];

    window.pageYOffset = 600;
    window.innerHeight = 600;
    document.documentElement.scrollHeight = 1200;

    const active = sp.getCurrentActive(positions, 700);
    // Should not return last section due to bottomThreshold = 0
    expect(active).toEqual([section2]);
  });

  test('getNavItem returns anchor when no li parent exists', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <a href="#section1">Section 1</a>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav');
    const navItem = sp.getNavItem(section1);
    
    expect(navItem.tagName).toBe('A');
    expect(navItem.getAttribute('href')).toBe('#section1');
  });

  test('fragmentAttribute uses custom navItemSelector', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><button data-target="section1">Section 1</button></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { 
      fragmentAttribute: 'data-target', 
      navItemSelector: 'button' 
    });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('fragmentAttribute returns null fragment', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a data-target="">Empty</a></li>
          <li><a data-target="section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { 
      fragmentAttribute: 'data-target',
      navItemSelector: 'a'
    });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('setupListeners without reflow only registers scroll', () => {
    const sp = new ScrollSpy('#nav', { reflow: false });
    const scrollListener = spyScroll.mock.calls.find(call => call[0] === 'scroll');
    const resizeListener = spyScroll.mock.calls.find(call => call[0] === 'resize');
    
    expect(scrollListener).toBeDefined();
    expect(resizeListener).toBeUndefined();
  });

  test('destroyListeners removes all registered listeners', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const sp = new ScrollSpy('#nav', { reflow: true });
    
    sp.destroyListeners();
    
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), false);
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function), false);
    expect(sp._listeners.length).toBe(0);
    
    removeSpy.mockRestore();
  });

  test('destroy without observer does not throw', () => {
    const sp = new ScrollSpy('#nav');
    sp._observer = null;
    
    expect(() => sp.destroy()).not.toThrow();
    expect(sp._observer).toBeNull();
  });

  test('fragmentAttribute with null navItemSelector uses default selector', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a data-target="section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { 
      fragmentAttribute: 'data-target',
      navItemSelector: null
    });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('null navItemSelector uses default href selector', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const sp = new ScrollSpy('#nav', { navItemSelector: null });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('fragmentAttribute function returning empty string', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a data-id="">Empty</a></li>
          <li><a data-id="section1">Section 1</a></li>
        </ul>
      </nav>
      <div id="section1"></div>
    `;

    const fragmentFn = (item) => item.getAttribute('data-id') || null;
    const sp = new ScrollSpy('#nav', { 
      fragmentAttribute: fragmentFn,
      navItemSelector: 'a'
    });
    
    expect(sp.contents.length).toBe(1);
    expect(sp.contents[0].id).toBe('section1');
  });

  test('destroyListeners when listeners is falsy', () => {
    const sp = new ScrollSpy('#nav');
    sp._listeners = null;
    
    expect(() => sp.destroyListeners()).not.toThrow();
  });
});
