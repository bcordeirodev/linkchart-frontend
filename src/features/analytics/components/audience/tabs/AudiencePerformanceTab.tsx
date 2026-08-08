"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { DevicePerformanceData } from "@/types";

/**
 * Two equal columns on desktop, stacked on mobile. Real `gap` — no negative
 * margins, so the row sits flush with the panel on both edges.
 *
 * `alignItems: "start"` — the details list is typically shorter than the
 * chart beside it; stretching both to the row's height used to make the
 * list absorb the difference as dead vertical space instead of letting each
 * card end at its own content.
 */
const twoColGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: 3,
  alignItems: "start",
} as const;

/** Avg / min / max, three across, inside a device row. */
const statsGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 1,
} as const;

/** Processed chart data item for device performance. */
interface PerformanceChartItem {
  name: string;
  value: number;
  clicks: number;
  [key: string]: unknown;
}

/** Props for the Device Performance tab content. */
export interface AudiencePerformanceTabProps {
  /** Chart-ready performance data (name/value/clicks). */
  performanceChartData: PerformanceChartItem[];
  /** Raw device performance entries for the details list. */
  devicePerformance: DevicePerformanceData[];
  /**
   * Outlined card sx (no shadow). Unused since the migration to `ChartCard`
   * (refinamento visual 2026-08-08, §3.3) — `ChartCard` owns its own
   * hairline/radius styling. Kept in the prop contract so `AudienceChart`,
   * which still passes it to a sibling tab, does not need an ownership-
   * crossing edit.
   */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Device Performance tab content for the AudienceChart.
 *
 * Two equal-width cards: bar chart of average response times on the left, and
 * the avg/min/max details list on the right. The list is not a second reading
 * of the chart — the bars only carry the average, so min/max are additive.
 *
 * Laid out with CSS grid, not MUI's `Grid container spacing`. That one fakes
 * gaps with a negative margin on the container plus padding on the items — and
 * here the negative margin did not land, so the row started 24px right of the
 * panel and overflowed 24px past its right edge, clipping the cards. CSS grid
 * has real gaps and sits flush, like the Client-Hints row further down.
 */
export function AudiencePerformanceTab({
  performanceChartData,
  devicePerformance,
  itemRowSx,
}: AudiencePerformanceTabProps) {
  const { t } = useTranslation("analytics");

  // Device names arrive as the tracking pipeline's raw values ("desktop",
  // "mobile") — reformatted here for display, same treatment as every other
  // device/browser/OS/engine label on the page.
  const displayChartData = performanceChartData.map((item) => ({
    ...item,
    name: formatAnalyticsLabel(item.name),
  }));

  return (
    <Box sx={twoColGridSx}>
      <ChartCard
        title={t("audience.chart.devicePerformance")}
        subtitle={t("audience.chart.tabDescriptions.performance")}
      >
        <ApexChartWrapper
          type="bar"
          {...formatBarChart(displayChartData, "name", "value", false, {
            clicksLabel: t("temporal.viralRank.clicksUnit"),
          })}
          size="standard"
        />
      </ChartCard>

      <ChartCard title={t("audience.chart.performanceDetails")}>
        {/* Each row sizes to its own content now — no `flex: 1`/stretch to
            match the chart card beside it (see `twoColGridSx`'s
            `alignItems: "start"`). Two cards of honest, different heights
            read better than one padded out to fake-match the other. */}
        <Stack spacing={1.5}>
          {devicePerformance.map((perf) => (
            <Box
              key={perf.device}
              sx={{
                p: 1.5,
                ...itemRowSx,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
                {formatAnalyticsLabel(perf.device)}
              </Typography>
              <Box sx={statsGridSx}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t("audience.chart.performanceAvg")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {perf.avg_response_time}ms
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t("audience.chart.performanceMin")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {perf.min_response_time}ms
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    {t("audience.chart.performanceMax")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {perf.max_response_time}ms
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </ChartCard>
    </Box>
  );
}
