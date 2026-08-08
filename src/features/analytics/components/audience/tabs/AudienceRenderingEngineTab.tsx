"use client";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

/**
 * Two equal columns on desktop, stacked on mobile. Real `gap` — no negative
 * margins, so the row sits flush with the panel on both edges.
 *
 * `alignItems: "start"` — the ranked list is typically shorter than the
 * stacked-bar card beside it; stretching both to the row's height used to
 * make the list absorb the difference as dead vertical space instead of
 * letting each card end at its own content.
 */
const twoColGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: 3,
  alignItems: "start",
} as const;

/**
 * Height cap for the single-row stacked bar below — a horizontal stacked
 * bar is one line of segments plus its legend, not a chart that needs
 * hundreds of pixels of vertical room (spec: "barra horizontal empilhada
 * única … altura do chart ≤ 120px").
 */
const STACKED_BAR_HEIGHT = 110;

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
  itemRowSx,
}: AudienceRenderingEngineTabProps) {
  const { t, i18n } = useTranslation("analytics");

  // Engine names arrive as the tracking pipeline's raw values ("blink",
  // "webkit") — reformatted here for display, same treatment as every other
  // device/browser/OS/engine label on the page.
  const displayChartData = renderingEngineChartData.map((item) => ({
    ...item,
    name: formatAnalyticsLabel(item.name),
  }));

  return (
    <Box sx={twoColGridSx}>
      <ChartCard
        title={t("audience.chart.renderingEngineDistribution")}
        subtitle={t("audience.chart.tabDescriptions.renderingEngine")}
      >
        <ApexChartWrapper
          type="bar"
          height={STACKED_BAR_HEIGHT}
          {...formatHorizontalStackedBar(
            displayChartData,
            "name",
            "value",
            undefined,
            i18n.language,
          )}
        />
      </ChartCard>

      <ChartCard title={t("audience.chart.topEngines")}>
        {/* Each row sizes to its own content now — no `flex: 1`/stretch to
            match the chart card beside it (see `twoColGridSx`'s
            `alignItems: "start"`). */}
        <Stack spacing={1.5}>
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
                <Typography variant="subtitle2">
                  {formatAnalyticsLabel(engine.engine)}
                </Typography>
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
      </ChartCard>
    </Box>
  );
}
