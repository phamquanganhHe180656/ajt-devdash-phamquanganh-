/**
 * -------------------------------------------------------------
 * DevDash - Utility Helpers (Day 1 Implementation)
 * -------------------------------------------------------------
 */

/**
 * Debounce utility to rate-limit execution of function calls (e.g. for search inputs).
 * Demonstrates advanced closure and generic parameter typing.
 */
export function debounce<A extends any[], R>(
  fn: (...args: A) => R, 
  delay: number
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: A): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Simple memoization utility to cache heavy computations or function outputs.
 * Demonstrates closure-based state encapsulation.
 */
export function memoize<A extends any[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const cache = new Map<string, R>();

  return (...args: A): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as R;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
