import scrollspy from '../src/index.js';

// Mock DOM methods
Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  value: 0
});

Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
  writable: true,
  value: 0
});

Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  writable: true,
  value: null
});

describe('scrollspy', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.innerHTML = `
      <nav id="nav">
        <ul>
          <li><a href="#section1">Section 1</a></li>
          <li><a href="#section2">Section 2</a></li>
          <li><a href="#section3">Section 3</a></li>
        </ul>
      </nav>
      <div id="section1">Section 1 Content</div>
      <div id="section2">Section 2 Content</div>
      <div id="section3">Section 3 Content</div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    test('should initialize with default options', () => {
      const spy = new scrollspy('#nav');
      expect(spy).toBeInstanceOf(scrollspy);
      expect(spy.settings.content).toBe('[data-gumshoe]');
      expect(spy.settings.nested).toBe(false);
      expect(spy.settings.offset).toBe(0);
    });

    test('should merge custom options with defaults', () => {
      const options = {
        offset: 50,
        nested: true,
        events: false
      };
      const spy = new scrollspy('#nav', options);
      expect(spy.settings.offset).toBe(50);
      expect(spy.settings.nested).toBe(true);
      expect(spy.settings.events).toBe(false);
    });

    test('should find navigation element', () => {
      const spy = new scrollspy('#nav');
      const nav = document.querySelector('#nav');
      expect(spy.nav).toBe(nav);
    });
  });

  describe('getContents', () => {
    test('should find content elements from navigation links', () => {
      const spy = new scrollspy('#nav');
      expect(spy.contents).toHaveLength(3);
      expect(spy.contents[0].id).toBe('section1');
      expect(spy.contents[1].id).toBe('section2');
      expect(spy.contents[2].id).toBe('section3');
    });

    test('should ignore invalid links', () => {
      container.innerHTML = `
        <nav id="nav">
          <ul>
            <li><a href="#section1">Section 1</a></li>
            <li><a href="#nonexistent">Invalid</a></li>
            <li><a>No href</a></li>
          </ul>
        </nav>
        <div id="section1">Section 1 Content</div>
      `;

      const spy = new scrollspy('#nav');
      expect(spy.contents).toHaveLength(1);
      expect(spy.contents[0].id).toBe('section1');
    });
  });

  describe('getOffsetTop', () => {
    test('should calculate element offset', () => {
      const element = document.getElementById('section1');
      Object.defineProperty(element, 'offsetTop', { value: 100 });
      Object.defineProperty(element, 'offsetParent', { value: document.body });
      Object.defineProperty(document.body, 'offsetTop', { value: 50 });
      Object.defineProperty(document.body, 'offsetParent', { value: null });

      const spy = new scrollspy('#nav');
      const offset = spy.getOffsetTop(element);
      expect(offset).toBe(150);
    });
  });

  describe('getCurrentActive', () => {
    test('should return active elements based on scroll position', () => {
      const spy = new scrollspy('#nav');
      const positions = [
        { content: spy.contents[0], offset: 0 },
        { content: spy.contents[1], offset: 500 },
        { content: spy.contents[2], offset: 1000 }
      ];

      let active = spy.getCurrentActive(positions, 600);
      expect(active).toHaveLength(2);
      expect(active).toContain(spy.contents[0]);
      expect(active).toContain(spy.contents[1]);
    });
  });

  describe('activate and deactivate', () => {
    test('should add active class to navigation items', () => {
      const spy = new scrollspy('#nav');
      const section1 = document.getElementById('section1');

      spy.activate([section1]);

      const activeLink = document.querySelector('#nav a[href="#section1"]');
      expect(activeLink.classList.contains('active')).toBe(true);
    });

    test('should handle nested navigation when enabled', () => {
      container.innerHTML = `
        <nav id="nav">
          <ul>
            <li>
              <a href="#section1">Section 1</a>
              <ul>
                <li><a href="#subsection1">Subsection 1</a></li>
              </ul>
            </li>
          </ul>
        </nav>
        <div id="section1">Section 1</div>
        <div id="subsection1">Subsection 1</div>
      `;

      const spy = new scrollspy('#nav', { nested: true, nestedClass: 'parent-active' });
      const subsection = document.getElementById('subsection1');

      spy.activate([subsection]);

      const parentLi = document.querySelector('#nav li');
      expect(parentLi.classList.contains('parent-active')).toBe(true);
    });

    test('should remove active classes when deactivating', () => {
      const spy = new scrollspy('#nav');
      const link = document.querySelector('#nav a[href="#section1"]');
      link.classList.add('active');

      spy.deactivateAll();

      expect(link.classList.contains('active')).toBe(false);
    });
  });

  describe('events', () => {
    test('should emit custom events when enabled', (done) => {
      const spy = new scrollspy('#nav', { events: true });
      const section1 = document.getElementById('section1');

      document.addEventListener('gumshoeactivate', (event) => {
        expect(event.detail.target).toBe(section1);
        expect(event.detail.content).toBe(section1);
        done();
      });

      const navItem = spy.getNavItem(section1);
      spy.emitEvent('activate', section1, navItem);
    });

    test('should not emit events when disabled', () => {
      const spy = new scrollspy('#nav', { events: false });
      const eventSpy = jest.fn();
      document.addEventListener('gumshoeactivate', eventSpy);

      const section1 = document.getElementById('section1');
      const navItem = spy.getNavItem(section1);
      spy.emitEvent('activate', section1, navItem);

      expect(eventSpy).not.toHaveBeenCalled();
    });
  });

  describe('setup and destroy', () => {
    test('should refresh contents when setup is called', () => {
      const spy = new scrollspy('#nav');
      const originalLength = spy.contents.length;

      // Add new content
      const newSection = document.createElement('div');
      newSection.id = 'section4';
      document.body.appendChild(newSection);

      const newLink = document.createElement('a');
      newLink.href = '#section4';
      document.querySelector('#nav ul').appendChild(newLink);

      spy.setup();

      expect(spy.contents.length).toBe(originalLength + 1);
    });

    test('should clean up when destroyed', () => {
      const spy = new scrollspy('#nav');
      const link = document.querySelector('#nav a[href="#section1"]');
      link.classList.add('active');

      spy.destroy();

      expect(spy.current).toHaveLength(0);
      expect(link.classList.contains('active')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle missing navigation element', () => {
      const spy = new scrollspy('#nonexistent');
      expect(spy.nav).toBeNull();
      expect(spy.contents).toHaveLength(0);
    });

    test('should handle content without id attribute', () => {
      container.innerHTML = `
        <nav id="nav">
          <ul>
            <li><a href="#section1">Section 1</a></li>
          </ul>
        </nav>
        <div>Content without id</div>
      `;

      const spy = new scrollspy('#nav');
      expect(spy.contents).toHaveLength(0);
    });
  });
});