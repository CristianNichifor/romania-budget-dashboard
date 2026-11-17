import { useCallback, useState } from "react";

/**
 * Callback ref plus a flag that is true while the element's content is wider
 * than the element itself, i.e. while it scrolls sideways. Scroll regions use
 * it to become keyboard-focusable only when there is something to scroll.
 */
export function useHorizontalOverflow<T extends HTMLElement>(): [
  (element: T | null) => void,
  boolean,
] {
  const [overflows, setOverflows] = useState(false);

  const ref = useCallback((element: T | null) => {
    if (element === null || typeof ResizeObserver === "undefined") {
      return;
    }
    const measure = () => {
      setOverflows(element.scrollWidth > element.clientWidth + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild !== null) {
      observer.observe(element.firstElementChild);
    }
    return () => observer.disconnect();
  }, []);

  return [ref, overflows];
}
