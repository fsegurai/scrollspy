import { m as mdRender, g as generateTOC, s as setupMobileToggle, a as setupSmoothScroll, i as initScrollspy } from './toc-BaAAtinT.js';

const mdSample = `
# 🎢 ScrollSpy Playground Sample

Welcome to the playground! Scroll around and watch the navigation glow like a disco floor on a Saturday night. 💃🕺

---

# Introduction

Hey there! This playground is designed to push ScrollSpy to its limits.  
Scroll through the sections, nested content, and funny notes, and see how the TOC stays perfectly in sync — no matter how wild the ride!

---

# Chapter 1 - The Basics

## Section 1.1 - Hello World

Let’s start simple: scrollspy tracks the section currently in view and highlights the corresponding nav link.

Did you know?  
*Scrolling* is like teleportation — but slower.

---

## Section 1.2 - Why ScrollSpy?

Because no one likes to get lost on a page!  
ScrollSpy keeps your navigation alive and kicking.

---

# Chapter 2 - Advanced Techniques

Welcome to the deeper end of the pool. 🏊‍♀️

---

## Section 2.1 - Nested Navigation

This section shows nested navigation support:

- Parent item gets highlighted when any child is active.
- Smooth behavior for complex TOCs.

Scroll down slowly to watch the magic.

---

## Section 2.2 - Dynamic Offset

Adjust the scroll offset to handle fixed headers or sticky navbars.

---

## Section 2.3 - Edge Cases

What if two sections overlap or the page ends?

ScrollSpy handles those gracefully (we hope).

---

# Chapter 3 - Fun with ScrollSpy

## Section 3.1 - Easter Eggs

If you spot any bugs, they're *undocumented features*. 😎

---

## Section 3.2 - Party Mode

Imagine if scrollspy triggered confetti every time you reach a new section. 🎉

(Pssst… maybe you should add that yourself!)

---

# Chapter 4 - The Final Frontier

Last chapter, but not least.

Keep scrolling — you’re almost there!

---

# Conclusion

Thanks for visiting the ScrollSpy playground!

Now go forth and build amazing docs, blogs, or websites —  
and never let your users get lost in the scroll abyss again.

---

# Appendix: Bonus Content

Just because we can…

- Item 1: Lorem ipsum dolor sit amet.
- Item 2: Consectetur adipiscing elit.
- Item 3: ScrollSpy rules! 🚀

---

# Huge Section for Scroll Testing

The Tale of ScrollSpy: The Navigator's Best Friend

Once upon a time, in the vast lands of the Internet, users wandered through endless pages, lost in the wilderness of long content and sprawling documents. They clicked and scrolled, but their navigation menus lay silent, never telling them where they were or where to go next.

Enter ScrollSpy, the vigilant guardian of the navigation realm. Born from the need to keep explorers oriented, ScrollSpy watched the user’s scroll position like a lighthouse keeper watches the sea. With every flick of the wheel or swipe of the finger, ScrollSpy lit up the correct path in the navigation, guiding travelers safely through nested forests of headings and vast deserts of paragraphs.

No longer did users stumble or get confused. With ScrollSpy’s watchful eye, the active section was always highlighted — a friendly beacon shining bright — making the journey smooth, intuitive, and delightful.

And so, ScrollSpy became the navigator’s best friend, silently working behind the scenes, ensuring no one ever got lost again in the endless scroll.

---

# Thanks for scrolling! 👏 

Huge shoutout to all the wonderful folks who make the web a better place every day:

- 🚀 Developers who tirelessly build open source projects that inspire and empower us all.
- 📚 Writers and educators who share knowledge generously, helping us learn and grow.
- 🎨 Designers crafting beautiful, intuitive interfaces that make our digital journeys delightful.
- 🐞 Bug reporters who help us squash those pesky issues before they multiply.
- ☕ Coffee and tea — the real MVPs fueling late-night coding marathons.
- 🐱‍💻 Everyone who’s ever tried, tested, debugged, and pushed the boundaries of what’s possible on the web.

And a special thanks to:

- The creators of the scrolling libraries that paved the way.
- The browsers that faithfully render our code with every update.
- The internet itself — a wild, wonderful place where ideas meet reality.
- Your cat, dog, or pet of choice, who patiently tolerates your coding sessions.
- The cosmic forces that align to keep our bits flowing and bytes buzzing.

Without you, this project would be just a bunch of code lines. Instead, it’s a little beacon of navigation joy!

---

Feel free to take a moment and appreciate the magic of scrolling — it’s a simple act that connects us all.

Keep scrolling, keep exploring, and keep being awesome! 🚀✨


---

### Notes

- Nested sections show how parent highlighting works.
- Long sections test offset and bottom-of-page logic.
`;

/**
 * Creates and returns a debounced version of the provided function. The debounced
 * function delays the invocation of the original function until after the specified
 * delay has elapsed since the last time the debounced function was called.
 *
 * @param func - The original function to debounce.
 * @param delay - Delay time in milliseconds (default: 300).
 * @returns A debounced version of the original function.
 */
function debounce(func, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Debug event listener
document.addEventListener('gumshoeactivate', (event) => {
    console.log('Scrollspy activated section:', event.detail.target.id);
    console.log('Nav item:', event.detail.nav);
});
const mdBody = document.querySelector('.md-body');
const mdEditor = document.querySelector('.md-editor');
/**
 * Handles changes in the Markdown editor with a debounced function.
 *
 * This function retrieves the current value of the Markdown editor, processes it
 * to render the Markdown content, generates a table of contents (TOC),
 * and initializes the scrollspy functionality. It is debounced to delay invocation
 * by 300 milliseconds to optimize performance and reduce unnecessary executions
 * during rapid input changes.
 */
const handleEditorChange = debounce(() => {
    const value = mdEditor.value || '';
    mdRender(value, mdBody);
    generateTOC(mdBody);
    initScrollspy();
}, 250);
// Initialize the Markdown editor and render the initial content
document.addEventListener('DOMContentLoaded', () => {
    if (mdEditor && mdBody) {
        // Render Markdown content
        mdEditor.value = mdSample;
        mdRender(mdSample, mdBody);
        // Watch the textarea for changes
        mdEditor.addEventListener('input', handleEditorChange);
        // Generate TOC from rendered content
        generateTOC(mdBody);
        // Setup functionality
        setupMobileToggle();
        setupSmoothScroll();
        // Initialize scrollspy after TOC is generated
        initScrollspy(); // Start with the progressive mode
    }
});
