"use client";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Monitor } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { OSData } from "@/types";

/** Processed chart data item for operating systems. */
interface OSChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: unknown;
}

/** Props for the Operating Systems tab content. */
export interface AudienceOSTabProps {
  /** Chart-ready OS data (name/value/percentage). */
  osChartData: OSChartItem[];
  /** Raw OS entries for the ranked list. */
  operatingSystems: OSData[];
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Operating Systems tab content for the AudienceChart.
 *
 * Two equal-width cards: donut of OS distribution on the left and a ranked
 * list of the top five operating systems on the right. The list stretches
 * and centers its rows so both cards read as the same height with no dead gap.
 */
export function AudienceOSTab({
  osChartData,
  operatingSystems,
  isDark,
  outlinedCardSx,
  itemRowSx,
}: AudienceOSTabProps) {
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
              <Monitor {...ICON_MD} /> {t("audience.chart.osDistribution")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("audience.chart.tabDescriptions.systems")}
            </Typography>
            <ApexChartWrapper
              type="donut"
              {...formatPieChart(osChartData, "name", "value", isDark)}
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
              {t("audience.chart.topOS")}
            </Typography>
            <Stack spacing={1.5} sx={{ flexGrow: 1, justifyContent: "center" }}>
              {operatingSystems.slice(0, 5).map((os) => (
                <Box
                  key={`${os.os}-${os.version}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    ...itemRowSx,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{os.os}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {os.version}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {os.clicks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {os.percentage?.toFixed(1)}%
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
