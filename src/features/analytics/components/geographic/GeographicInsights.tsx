"use client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Globe, Lightbulb, Target, Trophy, TrendingUp } from "lucide-react";

import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface GeographicInsightsProps {
  countries: {
    country: string;
    iso_code?: string;
    clicks: number;
    currency?: string;
  }[];
  states: {
    country?: string;
    state: string;
    state_name?: string;
    clicks: number;
  }[];
  cities: { city: string; state?: string; country?: string; clicks: number }[];
  totalCountries?: number;
}

export function GeographicInsights({
  countries,
  states: _states,
  cities,
  totalCountries,
}: GeographicInsightsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  const countryChartData = countries.slice(0, 8).map((country) => ({
    name: country.country,
    value: country.clicks,
    currency: country.currency || "USD",
  }));

  if (countries.length === 0 && cities.length === 0) return null;

  return (
    <Grid container spacing={3} sx={{ mt: 0 }}>
      {/* Pie: distribuição por país */}
      {countryChartData.length > 0 && (
        <Grid item xs={12} md={5}>
          <Card sx={{ ...cardSx, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Globe size={16} strokeWidth={1.5} />
                {t("geographic.insights.countryDistribution")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("geographic.insights.pieSubtitle")}
              </Typography>
              <ApexChartWrapper
                type="pie"
                size="standard"
                {...formatPieChart(countryChartData, "name", "value", isDark)}
              />
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Market insights + recomendações */}
      <Grid item xs={12} md={countryChartData.length > 0 ? 7 : 12}>
        <Card sx={{ ...cardSx, height: "100%" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Lightbulb size={16} strokeWidth={1.5} />
              {t("geographic.insights.marketInsights")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("geographic.insights.marketSubtitle")}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Target size={16} strokeWidth={1.5} />
                  {t("geographic.insights.mainMarkets")}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  {countries.slice(0, 5).map((country, index) => (
                    <Chip
                      key={country.country}
                      label={`${country.country} (${country.clicks})`}
                      size="small"
                      color={index === 0 ? "primary" : "default"}
                      variant={index === 0 ? "filled" : "outlined"}
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Trophy size={16} strokeWidth={1.5} />
                  {t("geographic.insights.topCities")}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {cities.slice(0, 5).map((city, index) => (
                    <Chip
                      key={index}
                      label={`${city.city} (${city.clicks})`}
                      size="small"
                      color={index === 0 ? "secondary" : "default"}
                      variant={index === 0 ? "filled" : "outlined"}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TrendingUp size={16} strokeWidth={1.5} />
                {t("geographic.insights.strategicRecs")}
              </Typography>
              <Stack spacing={1}>
                {countries.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t("geographic.insights.mainMarketRec", {
                      country: countries[0].country,
                      clicks: countries[0].clicks,
                    })}
                  </Typography>
                )}
                {cities.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t("geographic.insights.topCityRec", {
                      city: cities[0].city,
                    })}
                  </Typography>
                )}
                {(totalCountries ?? countries.length) > 3 && (
                  <Typography variant="body2" color="text.secondary">
                    {t("geographic.insights.internationalRec", {
                      count: totalCountries ?? countries.length,
                    })}
                  </Typography>
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
