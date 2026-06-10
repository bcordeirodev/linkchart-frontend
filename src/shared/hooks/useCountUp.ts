import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/theme/usePrefersReducedMotion";

/**
 * Animates an integer from 0 to `value` over `durationMs`. Returns `value`
 * immediately when the user prefers reduced motion.
 *
 * @param value    - Target integer to animate toward.
 * @param durationMs - Animation duration in milliseconds (default 900).
 * @returns The current animated display value.
 */
export function useCountUp(value: number, durationMs = 900): number {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / durationMs, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduced]);

  return display;
}
