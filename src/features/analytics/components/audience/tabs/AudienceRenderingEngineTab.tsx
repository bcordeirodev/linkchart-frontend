"use client";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Monitor } from "lucide-react";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTranslation } from "react-i18next";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

/** Raw rendering engine entry. */
export interface RenderingEngineEntry {
  engine: string;
  clicks: number;
  percentage: number;
}

/** Processed chart data item for rendering engines. */
interface RenderingEngineChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: unknown;
}

/** Props for the Rendering Engine tab content. */
export interface AudienceRenderingEngineTabProps {
  /** Chart-ready rendering engine data (name/value/percentage). */
  renderingEngineChartData: RenderingEngineChartItem[];
  /** Raw rendering engine entries for the ranked list. */
  renderingEngine: RenderingEngineEntry[];
  /** Whether the theme is in dark mode. */
  isDark: boolean;
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Rendering Engine tab content for the AudienceChart.
 *
 * Two equal-width cards: donut of rendering engine distribution on the left
 * and a ranked list of the top engines on the right. The list stretches and
 * centers its rows so both cards read as the same height with no dead gap.
 */
export function AudienceRenderingEngineTab({
  renderingEngineChartData,
  renderingEngine,
  isDark,
  outlinedCardSx,
  itemRowSx,
}: AudienceRenderingEngineTabProps) {
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
              <Monitor {...ICON_MD} />{" "}
              {t("audience.chart.renderingEngineDistribution")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("audience.chart.tabDescriptions.renderingEngine")}
            </Typography>
            <ApexChartWrapper
              type="donut"
              {...formatPieChart(
                renderingEngineChartData,
                "name",
                "value",
                isDark,
              )}
              size="standard"
            />
          </CardContent>
        </Card>
      </Grid>
      {/* No `height: 100%` — see AudiencePerformanceTab. */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={outlinedCardSx}>
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {t("audience.chart.topEngines")}
            </Typography>
            {/* Top-aligned, not centered — see AudiencePerformanceTab. */}
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              {renderingEngine.slice(0, 5).map((engine) => (
                <Box
                  key={engine.engine}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    ...itemRowSx,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{engine.engine}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {engine.clicks}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {engine.percentage.toFixed(1)}%
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
