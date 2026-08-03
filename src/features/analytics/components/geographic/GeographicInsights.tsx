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

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

/** Props accepted by the {@link GeographicInsights} component. */
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

/**
 * Closes out the "Lugares" tab (heat-map sub-tab) with market-facing
 * takeaways derived straight from the country/state/city rankings that read
 * above it: the top markets, the top cities, and a short list of strategic
 * recommendations (invest in the leading market, watch the leading city,
 * consider localizing once enough countries are represented). Renders
 * nothing when there is no country or city data to summarize.
 *
 * @param props.countries - Top countries by click volume (already sorted by the caller).
 * @param props.states - State-level breakdown; accepted for API symmetry with the caller but not read directly (only country/city drive this card's content).
 * @param props.cities - Top cities by click volume (already sorted by the caller).
 * @param props.totalCountries - Total distinct countries in the dataset, used for the "consider localizing" threshold; falls back to `countries.length` when omitted.
 */
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
          }}
        >
          {t("geographic.insights.marketInsights")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("geographic.insights.marketSubtitle")}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
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
            <Typography variant="subtitle2" gutterBottom>
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
          <Typography variant="subtitle2" gutterBottom>
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
