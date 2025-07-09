import scrollspy from "@fsegurai/scrollspy";

// Initialize the scrollspy with explicit content selector
const spy = new scrollspy('#tableOfContents', {
  content: '.demo-section', // Target all demo-section elements
  offset: 50 //120, 64,
  nested: true,
  nestedClass: 'active-parent',
  reflow: true,
  events: true
});

// Add debug logging to see what's happening
document.addEventListener('gumshoeactivate', (event) => {
  console.log('Scrollspy activated section:', event.detail.target.id);
  console.log('Nav item:', event.detail.nav);

  // Force update active states (debugging)
  const activeLinks = document.querySelectorAll('#tableOfContents .active');
  console.log('Active links found:', activeLinks.length);
});

// Rest of your existing code...
const setupMobileToggle = (): void => {
  const tocToggle = document.getElementById('tocToggle');
  const toc = document.getElementById('tableOfContents');

  tocToggle?.addEventListener('click', () => {
    toc?.classList.toggle('mobile-visible');
    toc?.classList.toggle('mobile-hidden');
  });
};

const setupSmoothScroll = (): void => {
  document.querySelectorAll('#tableOfContents a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (link as HTMLAnchorElement).getAttribute('href')?.substring(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (target) {
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }

      if (window.innerWidth <= 768) {
        const toc = document.getElementById('tableOfContents');
        toc?.classList.remove('mobile-visible');
        toc?.classList.add('mobile-hidden');
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupMobileToggle();
  setupSmoothScroll();
});

export { spy };