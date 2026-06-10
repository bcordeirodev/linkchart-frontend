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
 * Two equal-width cards: donut of browser market share on the left and a
 * ranked list of the top five browsers on the right. The list stretches and
 * centers its rows so both cards read as the same height with no dead gap.
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
              <Globe size={16} strokeWidth={1.5} />
              {t("audience.chart.browserMarketShare")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("audience.chart.tabDescriptions.browsers")}
            </Typography>
            <ApexChartWrapper
              type="donut"
              {...formatPieChart(browserChartData, "name", "value", isDark)}
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
              {t("audience.chart.topBrowsers")}
            </Typography>
            <Stack spacing={1.5} sx={{ flexGrow: 1, justifyContent: "center" }}>
              {browsers.slice(0, 5).map((browser) => (
                <Box
                  key={`${browser.browser}-${browser.version}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
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
