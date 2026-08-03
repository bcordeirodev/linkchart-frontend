"use client";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { DevicePerformanceData } from "@/types";

/**
 * Two equal columns on desktop, stacked on mobile. Real `gap` — no negative
 * margins, so the row sits flush with the panel on both edges.
 */
const twoColGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: 3,
  alignItems: "stretch",
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
  /** Outlined card sx (no shadow). */
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
  outlinedCardSx,
  itemRowSx,
}: AudiencePerformanceTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Box sx={twoColGridSx}>
      <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t("audience.chart.devicePerformance")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("audience.chart.tabDescriptions.performance")}
          </Typography>
          <ApexChartWrapper
            type="bar"
            {...formatBarChart(performanceChartData, "name", "value", false)}
            size="standard"
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t("audience.chart.performanceDetails")}
          </Typography>
          {/* The list is ~150px shorter than the chart beside it, but both cards
              must end on the same line — every other row on this tab does. So
              the rows absorb the extra height (`flex: 1` each) instead of the
              card carrying it as a hole: not under the title (what
              `justifyContent: center` used to cause), not at the bottom. */}
          <Stack spacing={1.5} sx={{ flexGrow: 1, mt: 0.5 }}>
            {devicePerformance.map((perf) => (
              <Box
                key={perf.device}
                sx={{
                  p: 1.5,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  ...itemRowSx,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, fontWeight: 600 }}
                >
                  {perf.device}
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
        </CardContent>
      </Card>
    </Box>
  );
}
