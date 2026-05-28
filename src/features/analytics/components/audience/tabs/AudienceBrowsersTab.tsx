"use client";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { BrowserData } from "@/types";

/** Processed chart data item for browsers. */
interface BrowserChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: unknown;
}

/** Props for the Browsers tab content. */
export interface AudienceBrowsersTabProps {
  /** Chart-ready browser data (name/value/percentage). */
  browserChartData: BrowserChartItem[];
  /** Raw browser entries for the ranked list. */
  browsers: BrowserData[];
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Browsers tab content for the AudienceChart.
 *
 * Shows a pie chart of browser market share and a ranked list of the top
 * five browsers. All data flows from props — no hooks inside.
 */
export function AudienceBrowsersTab({
  browserChartData,
  browsers,
  isDark,
  outlinedCardSx,
  itemRowSx,
}: AudienceBrowsersTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={0} sx={outlinedCardSx}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Globe size={16} strokeWidth={1.5} />
              {t("audience.chart.browserMarketShare")}
            </Typography>
            <ApexChartWrapper
              type="donut"
              {...formatPieChart(browserChartData, "name", "value", isDark)}
              size="standard"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("audience.chart.topBrowsers")}
            </Typography>
            <Stack spacing={2}>
              {browsers.slice(0, 5).map((browser) => (
                <Box
                  key={`${browser.browser}-${browser.version}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    ...itemRowSx,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {browser.browser}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {browser.version}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {browser.clicks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {browser.percentage?.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
