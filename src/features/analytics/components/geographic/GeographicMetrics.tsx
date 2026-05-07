"use client";
import { Globe, Building2, TrendingUp } from "lucide-react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { createPresetAnimations } from "@/lib/theme";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeoData = Record<string, any>;

interface GeographicMetricsProps {
  data?: GeoData | null;
  stats?: GeoData | null;
  showTitle?: boolean;
  title?: string;
}

export function GeographicMetrics({
  data,
  stats,
  showTitle = false,
  title,
}: GeographicMetricsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const animations = createPresetAnimations(theme);

  const countriesReached =
    stats?.totalCountries ||
    data?.top_countries?.length ||
    data?.geographic?.top_countries?.length ||
    data?.overview?.countries_reached ||
    0;
  const citiesReached =
    stats?.totalCities ||
    data?.top_cities?.length ||
    data?.geographic?.top_cities?.length ||
    0;
  const statesReached =
    stats?.totalStates ||
    data?.top_states?.length ||
    data?.geographic?.top_states?.length ||
    0;
  const totalGeographicClicks =
    stats?.totalClicks ||
    data?.top_countries?.reduce(
      (sum: number, country: GeoData) => sum + (country.clicks || 0),
      0,
    ) ||
    data?.geographic?.top_countries?.reduce(
      (sum: number, country: GeoData) => sum + (country.clicks || 0),
      0,
    ) ||
    0;

  const displayTitle = title ?? t("geographic.metrics.title");

  const metrics = [
    {
      id: "countries_reached",
      title: t("geographic.metrics.countriesReached"),
      value: countriesReached.toString(),
      icon: <Globe {...ICON_LG} />,
      color: "primary" as const,
      subtitle: t("geographic.metrics.globalReach"),
    },
    {
      id: "cities_reached",
      title: t("geographic.metrics.citiesReached"),
      value: citiesReached.toString(),
      icon: <Building2 {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("geographic.metrics.urbanDiversity"),
    },
    {
      id: "states_reached",
      title: t("geographic.metrics.statesRegions"),
      value: statesReached.toString(),
      icon: <Globe {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("geographic.metrics.regionalCoverage"),
    },
    {
      id: "geographic_clicks",
      title: t("geographic.metrics.geographicClicks"),
      value: totalGeographicClicks.toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "warning" as const,
      subtitle: t("geographic.metrics.mappedClicks"),
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
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
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
