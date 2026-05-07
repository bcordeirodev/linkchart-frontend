"use client";
import { Globe, Building2, TrendingUp, MapPin, Layers } from "lucide-react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { createPresetAnimations } from "@/lib/theme";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import type { GeographicStats } from "../../hooks/useGeographicData";

interface GeographicMetricsProps {
  stats: GeographicStats | null;
  showTitle?: boolean;
  title?: string;
}

export function GeographicMetrics({
  stats,
  showTitle = false,
  title,
}: GeographicMetricsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const animations = createPresetAnimations(theme);

  const displayTitle = title ?? t("geographic.metrics.title");

  const metrics = [
    {
      id: "countries_reached",
      title: t("geographic.metrics.countriesReached"),
      value: (stats?.totalCountries ?? 0).toString(),
      icon: <Globe {...ICON_LG} />,
      color: "primary" as const,
      subtitle: t("geographic.metrics.globalReach"),
    },
    {
      id: "states_reached",
      title: t("geographic.metrics.statesRegions"),
      value: (stats?.totalStates ?? 0).toString(),
      icon: <Layers {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("geographic.metrics.regionalCoverage"),
    },
    {
      id: "cities_reached",
      title: t("geographic.metrics.citiesReached"),
      value: (stats?.totalCities ?? 0).toString(),
      icon: <Building2 {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("geographic.metrics.urbanDiversity"),
    },
    {
      id: "total_clicks",
      title: t("geographic.metrics.geographicClicks"),
      value: (stats?.totalClicks ?? 0).toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "warning" as const,
      subtitle: t("geographic.metrics.mappedClicks"),
    },
    {
      id: "coverage",
      title: t("geographic.metrics.coverage"),
      value: `${Math.round(stats?.coveragePercentage ?? 0)}%`,
      icon: <MapPin {...ICON_LG} />,
      color: "secondary" as const,
      subtitle: t("geographic.metrics.continentsCoverage"),
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {displayTitle}
        </Typography>
      ) : null}

      <Grid container spacing={3} sx={{ ...animations.fadeIn }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={2.4} key={metric.id}>
            <Box sx={{ height: "100%", ...animations.cardHover }}>
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

export default GeographicMetrics;
