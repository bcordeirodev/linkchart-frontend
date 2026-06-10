"use client";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Zap } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { DevicePerformanceData } from "@/types";

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
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
  /** Bar color for the performance chart. */
  performanceBarColor: string;
}

/**
 * Renders the Device Performance tab content for the AudienceChart.
 *
 * Two equal-width cards: bar chart of average response times on the left
 * and the avg/min/max details list on the right. The list stretches and
 * centers its rows so both cards read as the same height with no dead gap.
 */
export function AudiencePerformanceTab({
  performanceChartData,
  devicePerformance,
  isDark,
  outlinedCardSx,
  itemRowSx,
  performanceBarColor,
}: AudiencePerformanceTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              <Zap {...ICON_MD} /> {t("audience.chart.devicePerformance")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("audience.chart.tabDescriptions.performance")}
            </Typography>
            <ApexChartWrapper
              type="bar"
              {...formatBarChart(
                performanceChartData,
                "name",
                "value",
                performanceBarColor,
                false,
                isDark,
              )}
              size="standard"
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {t("audience.chart.performanceDetails")}
            </Typography>
            <Stack spacing={1.5} sx={{ flexGrow: 1, justifyContent: "center" }}>
              {devicePerformance.map((perf) => (
                <Box key={perf.device} sx={{ p: 1.5, ...itemRowSx }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 0.5, fontWeight: 600 }}
                  >
                    {perf.device}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
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
                    </Grid>
                    <Grid item xs={4}>
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
                    </Grid>
                    <Grid item xs={4}>
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
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
