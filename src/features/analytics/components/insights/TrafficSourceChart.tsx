"use client";
import {
  Activity,
  TrendingUp,
  Users2,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Box, Typography, Alert, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_LG } from "@/lib/theme/iconDefaults";
import { chartPalette } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import type { TrafficSourceData } from "../../hooks/useInsightsData";
import {
  INSIGHTS_BLOCK_PAD,
  INSIGHTS_SECTION_SPACING,
  insightsMetricRowSx,
  insightsTwoColSx,
} from "./insightsLayout";
import {
  TrafficChannelDetailsView,
  TrafficChannelsView,
} from "./sub-views/TrafficChannelsView";
import { TrafficSourcesView } from "./sub-views/TrafficSourcesView";
import { TrafficContextView } from "./sub-views/TrafficContextView";
import { TrafficQualityChart } from "./TrafficQualityChart";
import type { QualityData } from "./TrafficQualityChart";

interface TrafficSourceChartProps {
  data: TrafficSourceData;
  quality?: QualityData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * Orchestrates traffic-source analytics: KPIs → channels → sources/context →
 * recommendations → quality. Sub-views are presentational only.
 */
export function TrafficSourceChart({
  data,
  quality,
  loading = false,
  showTitle = true,
  title,
}: TrafficSourceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.traffic.title");

  const channelColors: Record<string, string> = {
    social: chartPalette[0],
    search: chartPalette[1],
    direct: chartPalette[3],
    email: chartPalette[2],
    referral: chartPalette[5],
    paid: chartPalette[6],
    other: theme.palette.text.secondary,
  };

  const hasNavigation =
    !!data.navigation_context && data.navigation_context.length > 0;
  const hasRecommendations = data.recommendations.length > 0;
  const hasChannels = data.channels.length > 0;

  if (loading) {
    return (
      <EnhancedPaper>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>{t("insights.traffic.loading")}</Typography>
        </Box>
      </EnhancedPaper>
    );
  }

  if (data.sources.length === 0) {
    return (
      <EnhancedPaper>
        <AnalyticsEmptyState title={t("insights.traffic.noData")} />
      </EnhancedPaper>
    );
  }

  return (
    <EnhancedPaper animated={false} sx={{ height: "100%" }}>
      <Box sx={{ p: INSIGHTS_BLOCK_PAD }}>
        {showTitle ? (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
              }}
            >
              <Activity
                {...ICON_LG}
                style={{ color: "var(--mui-palette-primary-main)" }}
              />
              {displayTitle}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75, lineHeight: 1.55, maxWidth: 720 }}
            >
              {t("insights.traffic.description")}
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ ...insightsMetricRowSx, mb: 3 }}>
          <MetricCard
            title={t("insights.traffic.topSource")}
            value={data.top_source?.source || "N/A"}
            icon={<TrendingUp {...ICON_LG} />}
            color="primary"
            subtitle={t("insights.traffic.trafficPercent", {
              n: data.top_source?.percentage || 0,
            })}
          />
          <MetricCard
            title={t("insights.traffic.diversity")}
            value={data.source_diversity}
            icon={<Users2 {...ICON_LG} />}
            color="info"
            subtitle={t("insights.traffic.differentSources")}
          />
          <MetricCard
            title={t("insights.traffic.totalClicks")}
            value={data.total_clicks}
            icon={<BarChart3 {...ICON_LG} />}
            color="success"
            subtitle={t("insights.traffic.allChannels")}
          />
          <MetricCard
            title={t("insights.traffic.activeChannels")}
            value={data.channels.length}
            icon={<Activity {...ICON_LG} />}
            color="secondary"
            subtitle={t("insights.traffic.categories")}
          />
        </Box>

        {data.source_diversity < 3 ? (
          <Box sx={{ mb: 3 }}>
            <Alert
              severity="warning"
              icon={<AlertTriangle {...ICON_MD} />}
              sx={{ borderRadius: `${radiusTokens.lg}px` }}
            >
              <Typography variant="body2">
                {t("insights.traffic.lowDiversityAlert", {
                  n: data.source_diversity,
                })}
              </Typography>
            </Alert>
          </Box>
        ) : null}

        <Stack spacing={INSIGHTS_SECTION_SPACING}>
          {hasChannels ? (
            <TrafficChannelsView
              channels={data.channels}
              totalClicks={data.total_clicks}
              channelColors={channelColors}
            />
          ) : null}

          <Box
            sx={{
              ...insightsTwoColSx,
              gridTemplateColumns: hasChannels
                ? { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" }
                : "1fr",
            }}
          >
            {hasChannels ? (
              <TrafficChannelDetailsView
                channels={data.channels}
                channelColors={channelColors}
              />
            ) : null}
            <TrafficSourcesView sources={data.sources} />
          </Box>

          {hasNavigation ? (
            <TrafficContextView
              navigationContext={data.navigation_context}
              recommendations={[]}
              mode="navigation"
            />
          ) : null}

          {hasRecommendations ? (
            <TrafficContextView
              navigationContext={undefined}
              recommendations={data.recommendations}
              mode="recommendations"
            />
          ) : null}

          {quality?.tier_breakdown?.length ? (
            <TrafficQualityChart data={quality} embedded />
          ) : null}
        </Stack>
      </Box>
    </EnhancedPaper>
  );
}

export default TrafficSourceChart;
