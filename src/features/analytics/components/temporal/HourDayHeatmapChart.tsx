"use client";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { heatmapBlueScale } from "@/lib/theme/colors/chart";
import { getWeekdayLabel } from "@/features/analytics/utils/weekday";
import type { HeatmapSeriesEntry } from "@/types/analytics/temporal";

interface HourDayHeatmapChartProps {
  data: HeatmapSeriesEntry[];
}

export function HourDayHeatmapChart({ data }: HourDayHeatmapChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  // The backend (`TemporalAnalyticsService::getHourDayHeatmap`) always
  // returns exactly 7 rows, one per ISO weekday in order (Monday first), but
  // labels each row's `name` with a hardcoded Portuguese abbreviation ("Seg",
  // "Ter", …) — correct for pt-BR, wrong for every other locale. The row
  // order is the only day signal the payload carries reliably, so it is used
  // here (`index + 1` = ISO weekday) to relabel each row through the same
  // localized weekday name every other temporal chart uses, instead of
  // rendering the raw API string.
  const localizedData = useMemo(
    () =>
      (data ?? []).map((entry, index) => ({
        ...entry,
        name: getWeekdayLabel(index + 1, t, entry.name),
      })),
    [data, t],
  );

  if (!data || data.length === 0) {
    return null;
  }

  // `heatmapBlueScale` is a genuine sequential intensity scale (empty → low →
  // medium → high → very high), not decorative series variety — it is kept
  // as the one legitimate exception to "colors come from the base theme"
  // here, the same way a semantic severity ramp would be. Everything else
  // (axis label styling, grid, tooltip theme, legend colors) is stripped so
  // the shared base theme shows through.
  const options = {
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.8,
        radius: 2,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: isDark
                ? heatmapBlueScale.empty.dark
                : heatmapBlueScale.empty.light,
              name: t("temporal.heatmap.colorScaleNone"),
            },
            {
              from: 1,
              to: 5,
              color: heatmapBlueScale.low[theme.palette.mode],
              name: t("temporal.heatmap.colorScaleLow"),
            },
            {
              from: 6,
              to: 15,
              color: heatmapBlueScale.medium[theme.palette.mode],
              name: t("temporal.heatmap.colorScaleMedium"),
            },
            {
              from: 16,
              to: 50,
              color: heatmapBlueScale.high[theme.palette.mode],
              name: t("temporal.heatmap.colorScaleHigh"),
            },
            {
              from: 51,
              to: 99999,
              color: heatmapBlueScale.veryHigh[theme.palette.mode],
              name: t("temporal.heatmap.colorScaleVeryHigh"),
            },
          ],
        },
      },
    },
    xaxis: {
      type: "category",
      labels: { rotate: -45 },
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          `${val} ${val === 1 ? t("temporal.heatmap.clickSingular") : t("temporal.heatmap.clickPlural")}`,
      },
    },
    legend: { show: true, position: "bottom" as const },
  };

  return (
    <ChartCard
      title={t("temporal.heatmap.title")}
      subtitle={t("temporal.heatmap.subtitle")}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {t("temporal.heatmap.hint")}
        </Typography>
      </Box>
      <ApexChartWrapper
        type="heatmap"
        size="standard"
        series={localizedData}
        options={options}
      />
    </ChartCard>
  );
}

export default HourDayHeatmapChart;
