"use client";

import { useTheme } from "@mui/material/styles";
import { getPublicChartCardOverrideSx } from "@/lib/theme/publicPageStyles";
import { ChartCard as SharedChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type { ReactNode } from "react";
import type { ApexOptions } from "apexcharts";

interface PublicChartCardProps {
  /** Chart title shown in the card header. */
  title: string;
  /** Optional Lucide icon rendered left of the title. */
  icon?: ReactNode;
  /**
   * ApexCharts options object.
   * Passed to `ApexChartWrapper` which accepts `Record<string, unknown>`;
   * `ApexOptions` is a strict superset so the cast is safe.
   */
  options: ApexOptions;
  /**
   * Series data.
   * Numeric array for donut/pie charts, `{ name, data[] }` objects for area/bar.
   */
  series: ApexOptions["series"];
  /** Chart type forwarded to ApexChartWrapper. */
  type: "area" | "bar" | "donut";
}

/**
 * Thin wrapper combining the shared `ChartCard` shell with `ApexChartWrapper`,
 * automatically applying `getPublicChartCardOverrideSx` so every public-analytics
 * chart renders with the correct border, no shadow, and muted title styling.
 *
 * @example
 * ```tsx
 * <PublicChartCard
 *   title="Clicks by Hour"
 *   icon={<Clock size={16} />}
 *   type="area"
 *   options={mergedOptions}
 *   series={series}
 * />
 * ```
 */
export function PublicChartCard({
  title,
  icon,
  options,
  series,
  type,
}: PublicChartCardProps) {
  const theme = useTheme();
  const cardSx = getPublicChartCardOverrideSx(theme);

  return (
    <SharedChartCard title={title} icon={icon} sx={cardSx}>
      <ApexChartWrapper
        type={type}
        size="compact"
        options={options as Record<string, unknown>}
        series={(series ?? []) as unknown[]}
      />
    </SharedChartCard>
  );
}
