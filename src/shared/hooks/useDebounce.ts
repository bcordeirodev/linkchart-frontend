"use client";
import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of `callback` that only fires `delay` ms after
 * the last invocation.
 *
 * @param callback - the function to debounce.
 * @param delay - debounce window in milliseconds.
 * @returns a same-typed function `T` that internally schedules `callback` via `setTimeout`.
 *
 * @remarks
 * The pending timeout is **not** cleared on unmount; if you need that, wrap with
 * a `useEffect` cleanup or replace this with `lodash.debounce`. Stable across
 * renders only if `callback` is referentially stable (memoize it with `useCallback`).
 */
function useDebounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedFn = useCallback(
    (...args: never[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;

  return debouncedFn;
}

export default useDebounce;
