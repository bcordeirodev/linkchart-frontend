"use client";
import { Box, Typography, Stack } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { AnalyticsEmptyState, OverviewMetricRow } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { INSIGHTS_BLOCK_PAD } from "../insights/insightsLayout";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { RetentionData } from "../../hooks/useInsightsData";

/** Props accepted by {@link RetentionAnalysisChart}. */
interface RetentionAnalysisChartProps {
  data: RetentionData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * Visualises visitor retention as a horizontal stacked bar (return vs. new
 * visitors) and a summary row with raw numbers.
 *
 * Removed fabricated displays: `retention_score` gauge and `benchmark_comparison` chip.
 * Rates from the API are [0.0, 1.0] decimals; they are multiplied by 100 for display.
 */
export function RetentionAnalysisChart({
  data,
  loading = false,
  showTitle = true,
  title,
}: RetentionAnalysisChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.retention.title");

  // Convert [0.0, 1.0] rates to display percentages
  const returnPct = Math.round(data.return_visitor_rate * 100 * 10) / 10;
  const newPct = Math.round(data.new_visitor_rate * 100 * 10) / 10;

  const visitorsBarChart = formatHorizontalStackedBar(
    [
      {
        name: t("insights.retention.returningLabel"),
        value: data.return_visitors,
      },
      { name: t("insights.retention.newLabel"), value: data.new_visitors },
    ],
    "name",
    "value",
  );

  if (loading) {
    return (
      <EnhancedPaper variant="outlined">
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.retention.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.total_visitors === 0) {
    return (
      <EnhancedPaper variant="outlined">
        <AnalyticsEmptyState title={t("insights.retention.noData")} />
      </EnhancedPaper>
    );
  }

  // Section separator between the bare sub-blocks below — a single top
  // hairline, not a bordered box. `insightsChartPanelSx` (bg + border +
  // shadow) used to wrap each of these sections on top of the card's own
  // border, stacking two surfaces; the card itself is now the only surface
  // and these blocks are plain content, divided by spacing + one hairline.
  const sectionDividerSx = {
    pt: 3,
    borderTop: `1px solid ${theme.palette.divider}`,
  } as const;

  return (
    // No `height: 100%`: a percentage height on a grid item resolves against
    // the *row*, whose height is the taller sibling's — so it stretched this
    // card past its own content and opened ~200px of dead space inside the
    // border. The parent grid aligns to `start`; let the card be its own height.
    //
    // `variant="outlined"` — a single hairline card, no fill/shadow layered
    // on top. This is the ONE surface for the whole component now.
    <EnhancedPaper variant="outlined" animated={false}>
      <Box sx={{ p: INSIGHTS_BLOCK_PAD }}>
        {showTitle ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {displayTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t("insights.retention.description")}
            </Typography>
          </Box>
        ) : null}

        {/* Real Metrics.
            `labelLines={2}`: at this card's width in the `lg`+ two-column
            retention/session grid, "Visitantes Recorrentes" is the one label
            of the three long enough to wrap, and the wrap pushed its number a
            line below "Taxa de Recorrência" and "Total de Visitantes" — three
            numbers meant to be read across, sitting at two heights. Reserving
            the second line in every column of the row is what pins them to one
            baseline; the label keeps its full name instead of being clipped to
            "Recorrentes", which read as a different metric from the
            "Visitantes Recorrentes" the bar chart right below it labels.
            `SessionDepthChart`, the sibling card in this same grid row, gets
            the same reservation so the two cards' numbers stay level with each
            other, not just within themselves. Opt-in prop: the other 10 call
            sites of `OverviewMetricRow` have single-line labels and are
            untouched. */}
        <Box sx={{ mb: 3 }}>
          <OverviewMetricRow
            size="md"
            labelLines={2}
            metrics={[
              {
                label: t("insights.retention.retentionRate"),
                value: `${returnPct}%`,
                caption: t("insights.retention.returningVisitorsSub"),
              },
              {
                label: t("insights.retention.returningVisitors"),
                value: data.return_visitors,
                caption: t("insights.retention.loyalUsers"),
              },
              {
                label: t("insights.retention.totalVisitors"),
                value: data.total_visitors,
                caption: t("insights.retention.uniqueVisitors"),
              },
            ]}
          />
        </Box>

        {/* Visitor Distribution — bare block, no nested card */}
        <Box sx={{ ...sectionDividerSx, mb: 3 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            {t("insights.retention.visitorDistribution")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 1 }}
          >
            {t("insights.retention.visitorDistributionDesc", {
              returning: data.return_visitors,
              total: data.total_visitors,
            })}
          </Typography>
          <ApexChartWrapper
            options={visitorsBarChart.options}
            series={visitorsBarChart.series}
            type="bar"
            size="standard"
          />
        </Box>

        {/* Insights panel — bare block, no nested card */}
        <Box sx={sectionDividerSx}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t("insights.retention.insightsTitle")}
            </Typography>

            <Typography variant="body1">
              {t("insights.retention.analysisRaw", {
                rate: returnPct,
                newPct,
                returning: data.return_visitors,
                total: data.total_visitors,
              })}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {returnPct >= 25
                ? t("insights.retention.recHigh")
                : t("insights.retention.recLow")}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default RetentionAnalysisChart;
