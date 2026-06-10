"use client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { BarChart3, Smartphone, Trophy } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import {
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { DeviceData } from "@/types";

/** Shared chart data shape for device items. */
interface DeviceChartItem {
  name: string;
  value: number;
  percentage: string;
  [key: string]: unknown;
}

/** Props for the Devices tab content. */
export interface AudienceDevicesTabProps {
  /** Processed chart-ready device data. */
  deviceChartData: DeviceChartItem[];
  /** Raw device breakdown entries. */
  deviceBreakdown: DeviceData[];
  /** Total clicks across all sources. */
  totalClicks: number;
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Bar color for device chart. */
  deviceBarColor: string;
}

/**
 * Renders the Devices tab content for the AudienceChart.
 *
 * Displays summary stat cards, a pie chart, a bar chart, and a ranked
 * list of device entries. All data is received via props — no hooks.
 */
export function AudienceDevicesTab({
  deviceChartData,
  deviceBreakdown,
  totalClicks,
  isDark,
  itemRowSx,
  outlinedCardSx,
  deviceBarColor,
}: AudienceDevicesTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={outlinedCardSx}>
            <CardContent>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 1,
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Smartphone {...ICON_MD} />{" "}
                {t("audience.chart.deviceDistribution")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t("audience.chart.deviceDistributionDesc")}
              </Typography>
              <ApexChartWrapper
                type="pie"
                size="standard"
                {...formatPieChart(deviceChartData, "name", "value", isDark)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={outlinedCardSx}>
            <CardContent>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 1,
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Trophy {...ICON_MD} /> {t("audience.chart.deviceRanking")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t("audience.chart.deviceRankingDesc")}
              </Typography>
              <ApexChartWrapper
                type="bar"
                size="standard"
                {...formatBarChart(
                  deviceChartData,
                  "name",
                  "value",
                  deviceBarColor,
                  true,
                  isDark,
                )}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ ...outlinedCardSx, mt: 3 }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: 600,
              position: "relative",
              zIndex: 1,
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BarChart3 {...ICON_MD} /> {t("audience.chart.deviceDetails")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("audience.chart.deviceDetailsDesc")}
          </Typography>

          <Stack spacing={2}>
            {deviceBreakdown.map((device, index) => (
              <Box
                key={device.device}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  ...itemRowSx,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={index + 1}
                    color={index === 0 ? "primary" : "default"}
                    size="small"
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {device.device}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {((device.clicks / totalClicks) * 100).toFixed(1)}%{" "}
                      {t("audience.chart.ofTotal")}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {device.clicks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("audience.chart.clicks")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
