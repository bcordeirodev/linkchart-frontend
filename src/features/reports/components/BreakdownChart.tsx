"use client";
/**
 * Donut chart of the click distribution across a single dimension (country,
 * device, browser, navigation context or quality tier), with a `Select` in
 * the `ChartCard` action slot to switch dimensions.
 *
 * Sibling to `DeviceBreakdownChart` (per-link dashboard), but the dimension
 * itself is user-selectable here — Reports has no fixed per-tab context to
 * pin it to a single dimension.
 */

import { FormControl, MenuItem, Select } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { SelectChangeEvent } from "@mui/material";
import type {
  BreakdownRow,
  ReportsBreakdownDimension,
} from "@/features/reports/types";

/** Every dimension the backend whitelist (`ReportsAnalyticsService::DIMENSIONS`) accepts, in menu order. */
const DIMENSIONS: readonly ReportsBreakdownDimension[] = [
  "country",
  "device",
  "browser",
  "navigation_context",
  "quality_tier",
];

/** Maps each dimension to its full i18n label key (avoids a template-literal key, which the typed `t()` rejects). */
const DIMENSION_LABEL_KEY: Record<
  ReportsBreakdownDimension,
  | "breakdown.dimensions.country"
  | "breakdown.dimensions.device"
  | "breakdown.dimensions.browser"
  | "breakdown.dimensions.navigation_context"
  | "breakdown.dimensions.quality_tier"
> = {
  country: "breakdown.dimensions.country",
  device: "breakdown.dimensions.device",
  browser: "breakdown.dimensions.browser",
  navigation_context: "breakdown.dimensions.navigation_context",
  quality_tier: "breakdown.dimensions.quality_tier",
};

/**
 * Props accepted by {@link BreakdownChart}.
 *
 * Loading/error/empty are gated by the caller's `AnalyticsStateManager`
 * (see `ReportsPage`) — this component only ever mounts with a non-empty
 * `data`, so it always renders the chart.
 */
interface BreakdownChartProps {
  /** Rows for the currently selected `dimension`. */
  data: BreakdownRow[];
  /** Dimension currently being visualized. */
  dimension: ReportsBreakdownDimension;
  /** Called when the user picks a different dimension from the `Select`. */
  onDimensionChange: (dimension: ReportsBreakdownDimension) => void;
}

/**
 * Where the user's clicks come from, along one selectable dimension at a
 * time. The subtitle spells out that the slice depends on the `Select` above
 * it — without it the donut alone doesn't say what it's a donut *of*.
 */
export function BreakdownChart({
  data,
  dimension,
  onDimensionChange,
}: BreakdownChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");
  const isDark = theme.palette.mode === "dark";

  // Re-mapped into a fresh literal so it structurally satisfies
  // `formatPieChart`'s `Record<string, unknown>[]` parameter — same
  // convention as `DeviceBreakdownChart`.
  const chartInput = data.map((row) => ({
    label: row.label,
    clicks: row.clicks,
  }));

  const pieProps = formatPieChart(chartInput, "label", "clicks", isDark, {
    noData: t("empty"),
  });

  /** Forwards the `Select`'s native change event as a typed dimension to the caller. */
  const handleChange = (event: SelectChangeEvent) => {
    onDimensionChange(event.target.value as ReportsBreakdownDimension);
  };

  return (
    <ChartCard
      title={t("breakdown.title")}
      subtitle={t("breakdown.subtitle")}
      icon={<PieChart {...ICON_LG} />}
      action={
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <Select
            value={dimension}
            onChange={handleChange}
            aria-label={t("breakdown.title")}
          >
            {DIMENSIONS.map((dim) => (
              <MenuItem key={dim} value={dim}>
                {t(DIMENSION_LABEL_KEY[dim])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <ApexChartWrapper type="donut" size="standard" {...pieProps} />
    </ChartCard>
  );
}

export default BreakdownChart;
