"use client";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Lightbulb, Target, TrendingUp, Trophy } from "lucide-react";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

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

  if (countries.length === 0 && cities.length === 0) return null;

  return (
    <Card
      sx={{
        borderRadius: `${radiusTokens.lg}px`,
        boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
        transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
        "&:hover": {
          boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
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
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
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
                  country: countries[0]!.country,
                  clicks: countries[0]!.clicks,
                })}
              </Typography>
            )}
            {cities.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("geographic.insights.topCityRec", {
                  city: cities[0]!.city,
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
  );
}
