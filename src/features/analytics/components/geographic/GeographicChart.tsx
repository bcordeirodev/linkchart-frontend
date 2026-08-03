"use client";
import { Box, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { dataVizPalette } from "@/lib/theme/dataViz";
import { AnalyticsEmptyState } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { HorizontalBreakdownBars } from "../audience/HorizontalBreakdownBars";

import type { HorizontalBreakdownItem } from "../audience/HorizontalBreakdownBars";
import type { CountryData, StateData, CityData } from "@/types";

/** Countries and states sit side by side on desktop; cities span the full width. */
const twoColGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
  gap: 3,
  alignItems: "start",
} as const;

/** Props accepted by the {@link GeographicChart} component. */
interface GeographicChartProps {
  /** Top countries by click volume. */
  countries: CountryData[];
  /** Top states/regions by click volume. */
  states: StateData[];
  /** Top cities by click volume. */
  cities: CityData[];
  /** Total clicks used to compute percentages. */
  totalClicks: number;
  /** ISO alpha-2 code of the currently selected country, or `null`. */
  selectedCountry: string | null;
  /** Called when a country row (or map country) is selected or cleared. */
  onCountrySelect: (isoCode: string | null) => void;
  /** Hides the "Top Countries" section. */
  hideCountries?: boolean;
  /** Hides the "Top States" section. */
  hideStates?: boolean;
}

/**
 * Converts a 2-letter ISO country code into its flag emoji.
 *
 * @param countryCode - ISO alpha-2 code (e.g. `"BR"`). Anything else yields `""`.
 */
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Top countries, states and cities — the rankings that read under the heat map.
 *
 * Each section is **one** horizontal-bar list, not a bar chart plus a second
 * list repeating the same numbers underneath it. That is what it used to be:
 * "United States 350" appeared twice per section, once as a bar and once as a
 * row, so a reader scrolled past the same three facts twice. The bars carry the
 * label, the value and the percentage on one line — they are the chart and the
 * table at once — which is the same mark the Público tab uses.
 *
 * Country rows are clickable: selecting one filters the states list to that
 * country and drives the choropleth's selection on the "Mundo" sub-tab.
 */
export function GeographicChart({
  countries,
  states,
  cities,
  totalClicks,
  selectedCountry,
  onCountrySelect,
  hideCountries = false,
  hideStates = false,
}: GeographicChartProps) {
  const { t } = useTranslation("analytics");

  /** Share of the total, guarding the zero-clicks case. */
  const pct = (clicks: number) =>
    totalClicks > 0 ? (clicks / totalClicks) * 100 : 0;

  const selectedCountryName =
    countries.find((c) => c.iso_code === selectedCountry)?.country ?? "";

  const filteredStates = selectedCountry
    ? states.filter(
        (s) => s.country?.toLowerCase() === selectedCountryName.toLowerCase(),
      )
    : states;

  const countryItems: HorizontalBreakdownItem[] = countries
    .slice(0, 10)
    .map((c) => ({
      key: c.iso_code,
      label: c.country,
      value: c.clicks,
      percentage: pct(c.clicks),
      color: dataVizPalette.primary,
      icon: <span aria-hidden>{getFlagEmoji(c.iso_code)}</span>,
    }));

  const stateItems: HorizontalBreakdownItem[] = filteredStates
    .slice(0, 10)
    .map((s) => ({
      key: `${s.country}-${s.state}`,
      label: `${s.state_name || s.state} · ${s.country}`,
      value: s.clicks,
      percentage: pct(s.clicks),
      color: dataVizPalette.secondary,
    }));

  const cityItems: HorizontalBreakdownItem[] = cities.slice(0, 10).map((c) => ({
    key: `${c.country}-${c.state}-${c.city}`,
    label: [
      c.state ? `${c.city}, ${c.state}` : c.city,
      c.most_common_postal_code ? `ZIP ${c.most_common_postal_code}` : null,
      c.country,
    ]
      .filter(Boolean)
      .join(" · "),
    value: c.clicks,
    percentage: pct(c.clicks),
    color: dataVizPalette.tertiary,
  }));

  return (
    <Box>
      <Box sx={twoColGridSx}>
        {!hideCountries && (
          <ChartCard
            title={t("geographic.chart.topCountries")}
            subtitle={t("geographic.chart.countriesSubtitle")}
          >
            {countryItems.length > 0 ? (
              <HorizontalBreakdownBars
                items={countryItems}
                valueSuffix={t("geographic.chart.clicks")}
                onItemClick={(key) =>
                  onCountrySelect(selectedCountry === key ? null : key)
                }
                selectedKey={selectedCountry}
              />
            ) : (
              <AnalyticsEmptyState
                title={t("geographic.chart.noCountriesData")}
              />
            )}
          </ChartCard>
        )}

        {!hideStates && (
          <ChartCard
            title={t("geographic.chart.topStates")}
            subtitle={t("geographic.chart.statesSubtitle")}
            action={
              selectedCountry ? (
                <Chip
                  size="small"
                  label={`${getFlagEmoji(selectedCountry)} ${
                    selectedCountryName || selectedCountry
                  }`}
                  onDelete={() => onCountrySelect(null)}
                  color="primary"
                  variant="outlined"
                />
              ) : undefined
            }
          >
            {stateItems.length > 0 ? (
              <HorizontalBreakdownBars
                items={stateItems}
                valueSuffix={t("geographic.chart.clicks")}
              />
            ) : (
              <AnalyticsEmptyState title={t("geographic.chart.noStatesData")} />
            )}
          </ChartCard>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <ChartCard
          title={t("geographic.chart.topCities")}
          subtitle={t("geographic.chart.citiesSubtitle")}
        >
          {cityItems.length > 0 ? (
            <HorizontalBreakdownBars
              items={cityItems}
              valueSuffix={t("geographic.chart.clicks")}
            />
          ) : (
            <AnalyticsEmptyState title={t("geographic.chart.noCitiesData")} />
          )}
        </ChartCard>
      </Box>
    </Box>
  );
}

/** Alias kept for the barrel's named export. */
export default GeographicChart;
