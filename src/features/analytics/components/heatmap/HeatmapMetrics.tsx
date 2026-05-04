"use client";
import { MapPin, Globe, TrendingUp } from "lucide-react";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

interface HeatmapStats {
  totalPoints: number;
  totalClicks: number;
  avgClicksPerPoint: number;
  topCountry: string;
  topCity: string;
  coveragePercentage: number;
  uniqueCountries?: number;
  uniqueCities?: number;
}

interface HeatmapMetricsProps {
  stats: HeatmapStats | null;
  showTitle?: boolean;
  title?: string;
}

export function HeatmapMetrics({
  stats,
  showTitle = false,
  title,
}: HeatmapMetricsProps) {
  const { t } = useTranslation("analytics");

  if (!stats) {
    return null;
  }

  const displayTitle = title ?? t("heatmap.metrics.title");

  const metrics = [
    {
      id: "total_clicks",
      title: t("heatmap.metrics.totalClicks"),
      value: stats.totalClicks.toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "primary" as const,
      subtitle: t("heatmap.metrics.mappedClicks"),
    },
    {
      id: "unique_countries",
      title: t("heatmap.metrics.uniqueCountries"),
      value: (stats.uniqueCountries ?? 0).toString(),
      icon: <Globe {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("heatmap.metrics.globalReach"),
    },
    {
      id: "unique_cities",
      title: t("heatmap.metrics.uniqueCities"),
      value: (stats.uniqueCities ?? 0).toString(),
      icon: <MapPin {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("heatmap.metrics.urbanDiversity"),
    },
    {
      id: "avg_clicks_per_location",
      title: t("heatmap.metrics.avgPerLocation"),
      value: stats.avgClicksPerPoint.toFixed(1),
      icon: <Globe {...ICON_LG} />,
      color: "warning" as const,
      subtitle: t("heatmap.metrics.clicksPerLocation"),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {displayTitle}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Box sx={{ height: "100%" }}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
                subtitle={metric.subtitle}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HeatmapMetrics;
