import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import ScrollSpy from '../src';

// Initialize JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
(globalThis.document as unknown) = dom.window.document;
(globalThis.window as unknown) = dom.window;
(globalThis.MutationObserver as unknown) = dom.window.MutationObserver;

describe('Scrollspy', () => {
  let nav: HTMLElement | null;
  let section1: HTMLElement | null;
  let section2: HTMLElement | null;
  let section3: HTMLElement | null;
  let spyScroll: ReturnType<typeof spyOn<typeof window, 'addEventListener'>>;
  let originalPageYOffset: number;
  let originalInnerHeight: number;
  let originalScrollHeight: number;

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
      get: () => nav?.parentElement,
    });
    Object.defineProperty(section2, 'offsetParent', {
      configurable: true,
      get: () => nav?.parentElement,
    });
    Object.defineProperty(section3, 'offsetParent', {
      configurable: true,
      get: () => nav?.parentElement,
    });

    // Mock scroll position and dimensions
    originalPageYOffset = window.pageYOffset;
    originalInnerHeight = window.innerHeight;
    originalScrollHeight = document.documentElement.scrollHeight;

    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    // Spy on scroll event registration
    spyScroll = spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    // Restore window properties
    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: originalPageYOffset });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: originalScrollHeight,
    });
  });

  // Helper to access private members in tests with proper typing
  function getPrivateMembers<Obj, K extends PropertyKey>(
    obj: Obj,
    ...keys: K[]
  ): Record<K, unknown> {
    const result: Record<string, unknown> = {};
    keys.forEach(key => {
      result[String(key)] = (obj as unknown as Record<string, unknown>)[String(key)];
    });
    return result as Record<K, unknown>;
  }

  test('initializes and finds navigation element', () => {
    const sp = new ScrollSpy('#nav');
    expect(sp.nav).toBe(nav);
    const members = getPrivateMembers(sp, 'contents', 'navMap');
    const contents = members.contents as Element[];
    const navMap = members.navMap as Map<string, Element>;
    expect(contents.length).toBe(3);
    expect(navMap.size).toBe(3);
  });

  test('getContents finds and maps content correctly', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();
    const members = getPrivateMembers(sp, 'contents', 'navMap');
    const contents = members.contents as Element[];
    const navMap = members.navMap as Map<string, Element>;
    expect(contents).toContain(section1!);
    expect(contents).toContain(section2!);
    expect(contents).toContain(section3!);
    
    expect(navMap.get('section1')?.getAttribute('href')).toBe('#section1');
  });

  test('getOffsetTop sums offsetTop correctly', () => {
    const sp = new ScrollSpy('#nav');
    // For this test, override offsetParent chain to simulate
    const mockOffsetParent = document.createElement('div');
    Object.defineProperty(mockOffsetParent, 'offsetTop', { configurable: true, get: () => 20 });
    Object.defineProperty(mockOffsetParent, 'offsetParent', { configurable: true, get: () => null });

    Object.defineProperty(section1, 'offsetTop', { configurable: true, get: () => 10 });
    Object.defineProperty(section1, 'offsetParent', { configurable: true, get: () => mockOffsetParent });

    expect(sp.getOffsetTop(section1!)).toBe(10);
  });

  test('getViewportPosition uses offset and bottom detection', () => {
    const sp = new ScrollSpy('#nav', { offset: 50 });

    // Case: Not near bottom
    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 200 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1200 });
    expect(sp.getViewportPosition()).toBe(250);

    // Case: Near bottom (scrollTop + windowHeight >= documentHeight - 50)
    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1200 });
    expect(sp.getViewportPosition()).toBe(550); // offset - 100 due to nearBottom true
  });

  test('getCurrentActive returns last section when near bottom', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 100 });
    const positions = [
      { content: section1!, offset: 0 },
      { content: section2!, offset: 150 },
      { content: section3!, offset: 300 },
    ];

    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1200 });

    const active = sp.getCurrentActive(positions, 700);
    expect(active).toEqual([section3!]);
  });

  test('getCurrentActive returns correct active section when not near bottom', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 100 });
    const positions = [
      { content: section1!, offset: 0 },
      { content: section2!, offset: 150 },
      { content: section3!, offset: 300 },
    ];

    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 100 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1200 });

    const active = sp.getCurrentActive(positions, 160);
    expect(active).toEqual([section2!]);

    // Scroll above all sections
    const activeNone = sp.getCurrentActive(positions, -10);
    expect(activeNone).toEqual([]);
  });

  test('isNewActive returns true when different, false when same', () => {
    const sp = new ScrollSpy('#nav');
    (sp as unknown as Record<string, unknown>)['current'] = [section1];
    expect(sp.isNewActive([section2!])).toBe(true);
    expect(sp.isNewActive([section1!])).toBe(false);
  });

  test('activate adds active class and emits event', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();

    const navItem = sp.getNavItem(section1!);
    navItem?.classList.remove('active'); // forcibly clear before testing
    expect(navItem?.classList.contains('active')).toBe(false);

    let eventFired = false;
    const eventListener = () => {
      eventFired = true;
    };
    document.addEventListener('gumshoeactivate', eventListener);

    if (section1) sp.activate([section1]);
    expect(navItem?.classList.contains('active')).toBe(true);
    expect(eventFired).toBe(true);

    document.removeEventListener('gumshoeactivate', eventListener);
  });

  test('deactivateAll removes active classes', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();

    const navItem1 = sp.getNavItem(section1!);
    navItem1?.classList.add('active');

    sp.deactivateAll();

    expect(navItem1?.classList.contains('active')).toBe(false);
  });

  test('addNestedNavigation adds nested class to parent li if nested enabled', () => {
    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'nested-active' });
    sp.getContents();

    const navItem = sp.getNavItem(section1!);
    navItem?.classList.remove('active'); // ensure clean

    sp.addNestedNavigation(navItem!);

    let foundNestedClass = false;
    let parent: Element | null | undefined = navItem?.parentElement;
    while (parent && parent !== nav) {
      if (parent.classList.contains('nested-active')) foundNestedClass = true;
      parent = parent.parentElement;
    }
    expect(foundNestedClass).toBe(false);
  });

  test('setupListeners registers scroll and resize events', () => {
    const sp = new ScrollSpy('#nav', { reflow: true });
    sp.setupListeners();

    const scrollCall = spyScroll.mock.calls.find((call: readonly unknown[]) => call[0] === 'scroll');
    const resizeCall = spyScroll.mock.calls.find((call: readonly unknown[]) => call[0] === 'resize');
    
    expect(scrollCall).toBeDefined();
    expect(resizeCall).toBeDefined();
  });

  test('destroy clears current, removes active, and disconnects observer', () => {
    const sp = new ScrollSpy('#nav');
    sp.getContents();
    if (section1) sp.activate([section1]);

    const mockObserver: Partial<MutationObserver> = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      disconnect: () => {},
    };
    (sp as unknown as Record<string, unknown>)['_observer'] = mockObserver;
    sp.destroy();

    const members = getPrivateMembers(sp, 'current', '_observer');
    const current = members.current as Element[];
    const observer = members._observer as MutationObserver | null;
    expect(current).toEqual([]);
    const navItem = sp.getNavItem(section1!);
    expect(navItem?.classList.contains('active')).toBe(false);
    expect(observer).toBeNull();
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

    const fragmentFn = (item: Element) => item.getAttribute('data-target');
    const sp = new ScrollSpy('#nav', { fragmentAttribute: fragmentFn, navItemSelector: 'a' });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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

    nav = document.querySelector('#nav');
    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'active-parent' });
    sp.deactivateAll();

    const li = nav?.querySelector('li');
    expect(li?.classList.contains('active')).toBe(false);
    expect(li?.classList.contains('active-parent')).toBe(false);
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

    nav = document.querySelector('#nav');
    const sp = new ScrollSpy('#nav', { nested: true, nestedClass: 'active-parent' });
    sp.getContents();
    
    const childLi = document.getElementById('child-li');
    sp.addNestedNavigation(childLi!);

    const parentLi = document.getElementById('parent-li');
    expect(parentLi?.classList.contains('active-parent')).toBe(true);
  });

  test('setup method calls getContents and detect', () => {
    const sp = new ScrollSpy('#nav');
    let getContentsCallCount = 0;
    let detectCallCount = 0;

    const originalGetContents = sp.getContents;
    const originalDetect = sp.detect;
    
    sp.getContents = function() {
      getContentsCallCount++;
      return originalGetContents.call(this);
    };
    
    sp.detect = function() {
      detectCallCount++;
      return originalDetect.call(this);
    };
    
    sp.setup();
    
    expect(getContentsCallCount).toBe(1);
    expect(detectCallCount).toBe(1);
  });

  test('refresh method calls getContents and detect', () => {
    const sp = new ScrollSpy('#nav');
    let getContentsCallCount = 0;
    let detectCallCount = 0;

    const originalGetContents = sp.getContents;
    const originalDetect = sp.detect;
    
    sp.getContents = function() {
      getContentsCallCount++;
      return originalGetContents.call(this);
    };
    
    sp.detect = function() {
      detectCallCount++;
      return originalDetect.call(this);
    };
    
    sp.refresh();
    
    expect(getContentsCallCount).toBe(1);
    expect(detectCallCount).toBe(1);
  });

  test('observeChanges sets up MutationObserver', () => {
    const sp = new ScrollSpy('#nav', { observe: true });
    
    const members = getPrivateMembers(sp, '_observer');
    const observer = members._observer;
    expect(observer).not.toBeNull();
  });

  test('observeChanges observes nav and content parents', () => {
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

    nav = document.querySelector('#nav');
    const sp = new ScrollSpy('#nav');
    sp.observeChanges();
    
    // Should observe nav and content parents
    const members = getPrivateMembers(sp, '_observer');
    const observer = members._observer;
    expect(observer).not.toBeNull();
  });

  test('init does not proceed if nav element is not found', () => {
    document.body.innerHTML = '<div></div>';
    const sp = new ScrollSpy('#nonexistent');
    
    expect(sp.nav).toBeNull();
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(0);
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
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
    const members = getPrivateMembers(sp, 'navMap');
    const navMap = members.navMap as Map<string, Element>;
    navMap.clear(); // Clear the map
    
    const mockSection = { id: 'nonexistent' } as Element;
    sp.activate([mockSection]);
    
    const membersCurrent = getPrivateMembers(sp, 'current');
    const current = membersCurrent.current as Element[];
    expect(current).toEqual([mockSection]);
  });

  test('emitEvent does nothing when events are disabled', () => {
    const sp = new ScrollSpy('#nav', { events: false });
    let eventFired = false;
    const eventListener = () => {
      eventFired = true;
    };
    document.addEventListener('gumshoeactivate', eventListener);
    
    sp.emitEvent('activate', section1!, section1!);
    
    expect(eventFired).toBe(false);
    document.removeEventListener('gumshoeactivate', eventListener);
  });

  test('destroyListeners handles empty listeners array', () => {
    const sp = new ScrollSpy('#nav');
    (sp as unknown as Record<string, unknown>)['_listeners'] = [];
    
    expect(() => sp.destroyListeners()).not.toThrow();
  });

  test('getCurrentActive with bottomThreshold of 0 uses normal logic', () => {
    const sp = new ScrollSpy('#nav', { bottomThreshold: 0 });
    const positions = [
      { content: section1!, offset: 0 },
      { content: section2!, offset: 150 },
    ];

    Object.defineProperty(window, 'pageYOffset', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 600 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { writable: true, configurable: true, value: 1200 });

    const active = sp.getCurrentActive(positions, 700);
    // Should not return last section due to bottomThreshold = 0
    expect(active).toEqual([section2!]);
  });

  test('getNavItem returns anchor when no li parent exists', () => {
    document.body.innerHTML = `
      <nav id="nav">
        <a href="#section1">Section 1</a>
      </nav>
      <div id="section1"></div>
    `;

    section1 = document.getElementById('section1');
    const sp = new ScrollSpy('#nav');
    const navItem = sp.getNavItem(section1!);
    
    expect(navItem?.tagName).toBe('A');
    expect(navItem?.getAttribute('href')).toBe('#section1');
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
      navItemSelector: 'button', 
    });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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
      navItemSelector: 'a',
    });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
  });

  test('setupListeners without reflow only registers scroll', () => {
    spyScroll.mockClear();
    const sp = new ScrollSpy('#nav', { reflow: false });
    sp.setupListeners();
    
    const scrollListener = spyScroll.mock.calls.find((call: readonly unknown[]) => call[0] === 'scroll');
    const resizeListener = spyScroll.mock.calls.find((call: readonly unknown[]) => call[0] === 'resize');
    
    expect(scrollListener).toBeDefined();
    expect(resizeListener).toBeUndefined();
  });

  test('destroyListeners removes all registered listeners', () => {
    const sp = new ScrollSpy('#nav', { reflow: true });
    
    sp.destroyListeners();
    
    const members = getPrivateMembers(sp, '_listeners');
    const listeners = members._listeners as EventListener[];
    expect(listeners.length).toBe(0);
  });

  test('destroy without observer does not throw', () => {
    const sp = new ScrollSpy('#nav');
    (sp as unknown as Record<string, unknown>)['_observer'] = null;
    
    expect(() => sp.destroy()).not.toThrow();
    const members = getPrivateMembers(sp, '_observer');
    const observer = members._observer;
    expect(observer).toBeNull();
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
      navItemSelector: null as unknown as string,
    });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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

    const sp = new ScrollSpy('#nav', { navItemSelector: null as unknown as string });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents.length).toBe(1);
    expect(contents[0].id).toBe('section1');
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

    const fragmentFn = (item: Element) => item.getAttribute('data-id') || null;
    const sp = new ScrollSpy('#nav', { 
      fragmentAttribute: fragmentFn,
      navItemSelector: 'a',
    });
    
    const members = getPrivateMembers(sp, 'contents');
    const contents = members.contents as Element[];
    expect(contents[0]?.id).toBe('section1');
    expect(contents.length).toBe(1);
  });

  test('destroyListeners when listeners is falsy', () => {
    const sp = new ScrollSpy('#nav');
    (sp as unknown as Record<string, unknown>)['_listeners'] = null;
    
    expect(() => sp.destroyListeners()).not.toThrow();
  });
});

