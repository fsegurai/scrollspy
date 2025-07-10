// Extending Jest globals
import '@jest/globals';

declare module '@jest/globals' {
  interface Matchers<R> {
    toBeInstanceOf(expected: Function): R;

    toHaveBeenCalledTimes(expected: number): R;

    toHaveBeenCalledWith(...args: any[]): R;
  }
}

// Custom event typing for gumshoeactivate event
interface GumshoeActivateEvent extends CustomEvent {
  detail: {
    target: HTMLElement;
    content: HTMLElement;
    nav: HTMLElement;
  };
}

// Extend Document to recognize your custom event listener
declare global {
  interface Document {
    addEventListener(
      type: 'gumshoeactivate',
      listener: (event: GumshoeActivateEvent) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;

    removeEventListener(
      type: 'gumshoeactivate',
      listener: (event: GumshoeActivateEvent) => void,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

export {};
