import { useEffect, useState } from "react";

/** After this long a pending request stops being "normal" and the UI says so. */
export const SLOW_LOADING_MS = 2000;

/**
 * True once the component has been mounted for `thresholdMs`. Loading
 * placeholders use it to switch from a silent skeleton to a visible,
 * announced "still waiting" message when the BFF is slow.
 */
export function useSlowLoading(thresholdMs: number = SLOW_LOADING_MS): boolean {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), thresholdMs);
    return () => window.clearTimeout(timer);
  }, [thresholdMs]);

  return slow;
}
