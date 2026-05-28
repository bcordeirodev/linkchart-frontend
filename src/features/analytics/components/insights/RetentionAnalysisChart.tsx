"use client";
import { Repeat2, TrendingUp, Users, Lightbulb } from "lucide-react";
import { Box, Typography, Card, CardContent, Grid, Stack } from "@mui/material";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { getChartColor } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
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
 * Visualises visitor retention as a donut chart (return vs. new visitors)
 * and a summary card with raw numbers.
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

  const visitorsPieOptions = {
    chart: {
      type: "donut" as const,
      height: 300,
      toolbar: { show: false },
    },
    labels: [
      t("insights.retention.returningLabel"),
      t("insights.retention.newLabel"),
    ],
    colors: [getChartColor(1), getChartColor(0)],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      position: "bottom" as const,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              color: theme.palette.text.primary,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              color: theme.palette.text.primary,
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: t("insights.retention.retentionLabel"),
              fontSize: "14px",
              color: theme.palette.text.secondary,
              formatter: () => `${returnPct}%`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) =>
          t("insights.retention.visitorsTooltip", { n: val }),
      },
    },
  };

  const visitorsPieData = [data.return_visitors, data.new_visitors];

  if (loading) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.retention.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.total_visitors === 0) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("insights.retention.noData")}
          </Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper animated={false}>
      {showTitle ? (
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Repeat2
              {...ICON_LG}
              style={{ color: "var(--mui-palette-primary-main)" }}
            />
            {displayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("insights.retention.description")}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: 3 }}>
        {/* Real Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.retention.retentionRate")}
              value={`${returnPct}%`}
              icon={<Repeat2 {...ICON_LG} />}
              color="success"
              subtitle={t("insights.retention.returningVisitorsSub")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.retention.returningVisitors")}
              value={data.return_visitors}
              icon={<Users {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.retention.loyalUsers")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title={t("insights.retention.totalVisitors")}
              value={data.total_visitors}
              icon={<TrendingUp {...ICON_LG} />}
              color="secondary"
              subtitle={t("insights.retention.uniqueVisitors")}
            />
          </Grid>
        </Grid>

        {/* Visitor Distribution Donut */}
        <Card
          sx={{
            borderRadius: `${radiusTokens.lg}px`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? elevationTokens.xs
                : elevationLightTokens.xs,
            mb: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
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
              options={visitorsPieOptions}
              series={visitorsPieData}
              type="donut"
              size="standard"
            />
          </CardContent>
        </Card>

        {/* Insights Card */}
        <Box sx={{ mt: 3 }}>
          <Card
            sx={{
              borderRadius: `${radiusTokens.lg}px`,
              backgroundColor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? elevationTokens.xs
                  : elevationLightTokens.xs,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 600,
                  }}
                >
                  <Lightbulb size={16} strokeWidth={1.5} />
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
            </CardContent>
          </Card>
        </Box>
      </Box>
    </EnhancedPaper>
  );
}

export default RetentionAnalysisChart;
