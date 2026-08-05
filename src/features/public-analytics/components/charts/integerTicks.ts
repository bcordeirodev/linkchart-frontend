/**
 * Tick clamp for count axes on low-volume links.
 *
 * Apex splits a numeric axis into ~5 ticks regardless of scale, so a link
 * with 2 clicks gets fractional steps that render as "0.5 clicks" on value
 * axes or, rounded, as duplicated labels ("0 1 1 2 2") on horizontal bars.
 * Clamping the tick count to the data maximum yields integer-only steps
 * (0, 1, 2). Above the threshold Apex's auto ticks are already integers,
 * so no override is emitted.
 *
 * @param maxValue - Largest count in the series.
 * @returns `{ tickAmount }` to spread into the value axis, or `{}` when the
 *   automatic ticks are already safe.
 */
export function integerTickAmount(maxValue: number): { tickAmount?: number } {
  return maxValue > 0 && maxValue < 5 ? { tickAmount: maxValue } : {};
}
