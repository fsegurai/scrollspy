/**
 * Creates and returns a debounced version of the provided function. The debounced
 * function delays the invocation of the original function until after the specified
 * delay has elapsed since the last time the debounced function was called.
 *
 * @param func - The original function to debounce.
 * @param delay - Delay time in milliseconds (default: 300).
 * @returns A debounced version of the original function.
 */
export function debounce<Args extends unknown[], This = unknown>(
  func: (this: This, ...args: Args) => void,
  delay = 300,
): (this: This, ...args: Args) => void {
  let timer: number;

  return function(this: This, ...args: Args): void {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
