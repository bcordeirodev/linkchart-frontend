"use client";
import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";

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
  const { t } = useTranslation("analytics");

  if (countries.length === 0 && cities.length === 0) return null;

  return (
    <ChartCard
      title={t("geographic.insights.marketInsights")}
      subtitle={t("geographic.insights.marketSubtitle")}
    >
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
    </ChartCard>
  );
}
