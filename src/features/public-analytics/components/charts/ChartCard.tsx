"use client";

import { ChartCard as SharedChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface PublicChartCardProps {
  /** Chart title shown in the card header. */
  title: string;
  /**
   * Descriptive subtitle rendered below the title. Required: every chart in
   * the product carries a visible explanation of what it shows.
   */
  subtitle: string;
  /**
   * ApexCharts options for this chart — only what is structural (orientation,
   * stacking, axis type, markers). Colour, stroke, grid, fonts, tooltip and
   * legend come from the shared base theme injected by `ApexChartWrapper`.
   *
   * Typed as `Record<string, unknown>` (not `ApexOptions`) to match
   * `ApexChartWrapper`'s own prop and the `@/features/analytics` formatters,
   * so no call site needs a cast.
   */
  options: Record<string, unknown>;
  /** Series data — numeric array for stacked bars, `{ name, data[] }` for area/bar. */
  series: unknown[];
  /** Chart type forwarded to ApexChartWrapper. */
  type: "area" | "bar";
}

/**
 * Thin wrapper combining the shared `ChartCard` shell with `ApexChartWrapper`.
 *
 * It passes **no `sx` override**. The card used to receive
 * `getPublicChartCardOverrideSx`, which repainted border, radius and fill —
 * the exact values `SharedChartCard` and the global `MuiCard` override already
 * produce (hairline + translucent veil + no shadow). Dropping it is what makes
 * a public chart card and a logged-in chart card the same object.
 *
 * There is no `icon` prop anymore either: a decorative glyph next to a chart
 * title is the banned pattern in the "instrumento técnico" language.
 *
 * @example
 * ```tsx
 * <PublicChartCard
 *   title={t("publicAnalytics.charts.hourlyClicks")}
 *   subtitle={t("publicAnalytics.charts.hourlyClicksDesc")}
 *   type="area"
 *   options={options}
 *   series={series}
 * />
 * ```
 */
export function PublicChartCard({
  title,
  subtitle,
  options,
  series,
  type,
}: PublicChartCardProps) {
  return (
    <SharedChartCard title={title} subtitle={subtitle}>
      <ApexChartWrapper
        type={type}
        size="compact"
        options={options}
        series={series}
      />
    </SharedChartCard>
  );
}
