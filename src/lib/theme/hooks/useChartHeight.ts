import { useResponsive } from "./useResponsive";

export type ChartSize = "compact" | "standard" | "large";

const HEIGHTS: Record<
  ChartSize,
  Record<"xs" | "sm" | "md" | "lg" | "xl", number>
> = {
  compact: { xs: 180, sm: 200, md: 220, lg: 240, xl: 260 },
  standard: { xs: 220, sm: 260, md: 300, lg: 350, xl: 380 },
  large: { xs: 260, sm: 300, md: 380, lg: 440, xl: 480 },
};

/**
 * Returns a responsive chart height based on breakpoint.
 * Pass `override` to bypass responsiveness (backward compat for callers with fixed heights).
 */
export function useChartHeight(
  size: ChartSize = "standard",
  override?: number,
): number {
  const { currentBreakpoint } = useResponsive();

  if (override !== undefined) {
    return override;
  }

  return HEIGHTS[size][currentBreakpoint];
}
