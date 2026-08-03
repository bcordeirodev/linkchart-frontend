"use client";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

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
  /** Outlined card sx (no shadow). */
  outlinedCardSx: Record<string, unknown>;
  /** Row item sx for list rows. */
  itemRowSx: Record<string, unknown>;
}

/**
 * Renders the Rendering Engine tab content for the AudienceChart.
 *
 * Two equal-width cards: horizontal stacked bar of rendering engine
 * distribution on the left and a ranked list of the top engines on the right.
 *
 * Laid out with CSS grid, not MUI's `Grid container spacing`. That one fakes
 * gaps with a negative margin on the container plus padding on the items — and
 * here the negative margin did not land, so the row started 24px right of the
 * panel and overflowed 24px past its right edge, clipping the cards. CSS grid
 * has real gaps and sits flush, like the Client-Hints row further down.
 */
export function AudienceRenderingEngineTab({
  renderingEngineChartData,
  renderingEngine,
  outlinedCardSx,
  itemRowSx,
}: AudienceRenderingEngineTabProps) {
  const { t } = useTranslation("analytics");

  return (
    <Box sx={twoColGridSx}>
      <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t("audience.chart.renderingEngineDistribution")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t("audience.chart.tabDescriptions.renderingEngine")}
          </Typography>
          <ApexChartWrapper
            type="bar"
            {...formatHorizontalStackedBar(
              renderingEngineChartData,
              "name",
              "value",
            )}
            size="standard"
          />
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ ...outlinedCardSx, height: "100%" }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t("audience.chart.topEngines")}
          </Typography>
          {/* Rows absorb the height difference against the donut beside them
                — see AudiencePerformanceTab. */}
          <Stack spacing={1.5} sx={{ flexGrow: 1, mt: 0.5 }}>
            {renderingEngine.slice(0, 5).map((engine) => (
              <Box
                key={engine.engine}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  flex: 1,
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
    </Box>
  );
}
