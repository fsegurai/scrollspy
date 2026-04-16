import mdSample from './utils/markdown.example';
import { mdRender } from './utils/markdown';
import { generateTOC, initScrollspy, setupMobileToggle, setupSmoothScroll } from './utils/toc';

type MarkdownEditorElement = HTMLElement & { value: string };

interface ScrollSpyEventDetail {
  target?: HTMLElement;
  nav?: HTMLElement;
}

const editor = document.querySelector('#md-editor') as MarkdownEditorElement | null;
const body = document.querySelector('#md-body') as HTMLElement | null;
const loadingSpinner = document.querySelector('#loadingSpinner') as HTMLElement | null;
const copyMarkdownButton = document.querySelector('#copyMarkdown') as HTMLElement | null;
const clearEditorButton = document.querySelector('#clearEditor') as HTMLElement | null;
const resetExampleButton = document.querySelector('#resetExample') as HTMLElement | null;
const copyHtmlButton = document.querySelector('#copyHtml') as HTMLElement | null;

const FEEDBACK_DURATION = 2000;

const render = (): void => {
  if (!editor || !body) return;

  mdRender(editor.value, body);
  generateTOC(body);
  initScrollspy();
};

const setContent = (markdown: string): void => {
  if (!editor) return;

  editor.value = markdown;
  render();
};

const hideSpinner = (): void => {
  if (!loadingSpinner) return;

  loadingSpinner.classList.add('hidden');
  setTimeout(() => {
    loadingSpinner.style.display = 'none';
  }, 300);
};

const showCopyFeedback = (button: HTMLElement | null, iconName: string): void => {
  if (!button) return;

  const icon = button.querySelector('md-icon');
  if (!icon) return;

  const previous = icon.textContent;
  icon.textContent = iconName;

  setTimeout(() => {
    icon.textContent = previous;
  }, FEEDBACK_DURATION);
};

const copyText = async(text: string, button: HTMLElement | null): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    showCopyFeedback(button, 'check');
  } catch (error) {
    console.error('Failed to copy:', error);
    showCopyFeedback(button, 'error');
  }
};

const setupDebugListeners = (): void => {
  document.addEventListener('gumshoeactivate', (event: Event) => {
    const customEvent = event as CustomEvent<ScrollSpyEventDetail>;
    const targetId = customEvent.detail?.target?.id;

    if (!targetId) return;

    console.log('Scrollspy activated section:', targetId);
    console.log('Nav item:', customEvent.detail.nav);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  if (!editor || !body) {
    console.error('Required DOM elements not found');
    hideSpinner();
    return;
  }

  setupDebugListeners();
  setContent(mdSample);

  setTimeout(() => {
    hideSpinner();
  }, 300);

  editor.addEventListener('input', () => {
    render();
  });

  setupMobileToggle();
  setupSmoothScroll();

  copyMarkdownButton?.addEventListener('click', () => {
    void copyText(editor.value, copyMarkdownButton);
  });

  copyHtmlButton?.addEventListener('click', () => {
    void copyText(body.innerHTML, copyHtmlButton);
  });

  clearEditorButton?.addEventListener('click', () => {
    setContent('');
  });

  resetExampleButton?.addEventListener('click', () => {
    setContent(mdSample);
  });
});