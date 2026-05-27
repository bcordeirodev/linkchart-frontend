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
 * Shows a bar chart of average response times per device type and a
 * detailed list with avg/min/max breakdown. All data flows from props.
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
      <Grid item xs={12}>
        <Card elevation={0} sx={outlinedCardSx}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Zap {...ICON_MD} /> {t("audience.chart.devicePerformance")}
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

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t("audience.chart.performanceDetails")}
              </Typography>
              <Stack spacing={1}>
                {devicePerformance.map((perf) => (
                  <Box
                    key={perf.device}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      ...itemRowSx,
                    }}
                  >
                    <Typography variant="body2">{perf.device}</Typography>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption">
                        {t("audience.chart.performanceAvg")}{" "}
                        {perf.avg_response_time}ms |{" "}
                        {t("audience.chart.performanceMin")}{" "}
                        {perf.min_response_time}ms |{" "}
                        {t("audience.chart.performanceMax")}{" "}
                        {perf.max_response_time}ms
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
