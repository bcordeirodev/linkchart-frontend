"use client";
import {
  Activity,
  TrendingUp,
  Users2,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD, ICON_LG } from "@/lib/theme/iconDefaults";
import { chartPalette } from "@/lib/theme/colors";
import { radiusTokens } from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import type { TrafficSourceData } from "../../hooks/useInsightsData";
import { TrafficChannelsView } from "./sub-views/TrafficChannelsView";
import { TrafficSourcesView } from "./sub-views/TrafficSourcesView";
import { TrafficContextView } from "./sub-views/TrafficContextView";

interface TrafficSourceChartProps {
  data: TrafficSourceData;
  loading?: boolean;
  showTitle?: boolean;
  title?: string;
}

/**
 * Thin orchestrator that composes the three traffic sub-views:
 * TrafficChannelsView, TrafficSourcesView, and TrafficContextView.
 *
 * Owns the shared colour map and passes data down as props — no data
 * fetching happens inside the sub-views.
 */
export function TrafficSourceChart({
  data,
  loading = false,
  showTitle = true,
  title,
}: TrafficSourceChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const displayTitle = title ?? t("insights.traffic.title");

  /** Colour map keyed by channel name, shared across all sub-views. */
  const channelColors: Record<string, string> = {
    social: chartPalette[0],
    search: chartPalette[1],
    direct: chartPalette[3],
    email: chartPalette[2],
    referral: chartPalette[5],
    paid: chartPalette[6],
    other: theme.palette.text.secondary,
  };

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
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t("insights.traffic.noData")}
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
            <Activity
              {...ICON_LG}
              style={{ color: "var(--mui-palette-primary-main)" }}
            />
            {displayTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {t("insights.traffic.description")}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: 3 }}>
        {/* Métricas Principais */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.topSource")}
              value={data.top_source?.source || "N/A"}
              icon={<TrendingUp {...ICON_LG} />}
              color="primary"
              subtitle={t("insights.traffic.trafficPercent", {
                n: data.top_source?.percentage || 0,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.diversity")}
              value={data.source_diversity}
              icon={<Users2 {...ICON_LG} />}
              color="info"
              subtitle={t("insights.traffic.differentSources")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.totalClicks")}
              value={data.total_clicks}
              icon={<BarChart3 {...ICON_LG} />}
              color="success"
              subtitle={t("insights.traffic.allChannels")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title={t("insights.traffic.activeChannels")}
              value={data.channels.length}
              icon={<Activity {...ICON_LG} />}
              color="secondary"
              subtitle={t("insights.traffic.categories")}
            />
          </Grid>
        </Grid>

        {/* Alertas de Diversidade */}
        {data.source_diversity < 3 && (
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
        )}

        {/* Channels sub-view: donut + bar charts + channel detail cards */}
        <TrafficChannelsView
          channels={data.channels}
          totalClicks={data.total_clicks}
          channelColors={channelColors}
        />

        {/* Sources sub-view: top-5 ranked source list */}
        <TrafficSourcesView sources={data.sources} />

        {/* Context sub-view: navigation context bars + recommendations */}
        <TrafficContextView
          navigationContext={data.navigation_context}
          recommendations={data.recommendations}
        />
      </Box>
    </EnhancedPaper>
  );
}

export default TrafficSourceChart;
