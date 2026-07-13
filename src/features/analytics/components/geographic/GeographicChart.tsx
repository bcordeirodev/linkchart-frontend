"use client";
import { Box, Typography, Divider, Grid, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Globe, Building2, Map } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { chartByType } from "@/lib/theme/colors";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type { CountryData, StateData, CityData } from "@/types";

/** Props accepted by the {@link GeographicChart} component. */
interface GeographicChartProps {
  /** Top countries by click volume. */
  countries: CountryData[];
  /** Top states/regions by click volume. */
  states: StateData[];
  /** Top cities by click volume. */
  cities: CityData[];
  /** Total clicks used to compute per-country/state percentages. */
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
 * Ranked list view of geographic data — top countries, states and cities,
 * each with a bar chart plus a detailed row list.
 *
 * Renders bare — no `Card` chrome of its own — because it is only ever
 * embedded as the "Lista" view inside {@link GeographicMapAndList}, which
 * owns the shared card, header and view toggle. Each section keeps its own
 * subtitle so it stays self-explanatory in isolation.
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
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const showCountries = !hideCountries;
  const showStates = !hideStates;

  const filteredStates = selectedCountry
    ? states.filter(
        (s) =>
          s.country?.toLowerCase() ===
          (
            countries.find((c) => c.iso_code === selectedCountry)?.country ?? ""
          ).toLowerCase(),
      )
    : states;

  const getPercentage = (clicks: number) => {
    return totalClicks > 0 ? ((clicks / totalClicks) * 100).toFixed(1) : "0.0";
  };

  const getFlagEmoji = (countryCode: string) => {
    // Função simples para converter código do país em emoji da bandeira
    if (!countryCode || countryCode.length !== 2) {
      return "";
    }

    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* Top Países */}
      {showCountries && (
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                position: "relative",
                zIndex: 1,
                mt: 1,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Globe size={16} strokeWidth={1.5} />
              {t("geographic.chart.topCountries")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t("geographic.chart.countriesSubtitle")}
            </Typography>

            {countries.length > 0 ? (
              <>
                {/* Gráfico de barras */}
                <Box sx={{ mb: 3 }}>
                  <ApexChartWrapper
                    type="bar"
                    size="standard"
                    {...formatBarChart(
                      countries.slice(0, 8) as Record<string, unknown>[],
                      "country",
                      "clicks",
                      chartByType.geographic.countries,
                      true,
                      isDark,
                    )}
                  />
                </Box>

                {/* Lista detalhada */}
                <Box>
                  {countries.slice(0, 10).map((country, index) => {
                    const isSelected = selectedCountry === country.iso_code;
                    return (
                      <Box
                        key={country.country}
                        onClick={() =>
                          onCountrySelect(isSelected ? null : country.iso_code)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          py: 1,
                          px: 0.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          bgcolor: isSelected
                            ? "action.selected"
                            : "transparent",
                          borderBottom:
                            index < countries.length - 1
                              ? `1px solid ${theme.palette.divider}`
                              : "none",
                          "&:hover": {
                            bgcolor: isSelected
                              ? "action.selected"
                              : "action.hover",
                          },
                          transition: "background-color 0.15s",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="h6">
                            {getFlagEmoji(country.iso_code)}
                          </Typography>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: isSelected ? 700 : 500 }}
                            >
                              {country.country}
                            </Typography>
                            {country.currency ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {country.currency}
                              </Typography>
                            ) : null}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {country.clicks} {t("geographic.chart.clicks")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getPercentage(country.clicks)}%
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  <Map size={24} strokeWidth={1.5} />
                </Typography>
                <Typography>{t("geographic.chart.noCountriesData")}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      )}

      {/* Top Estados */}
      {showStates && (
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                position: "relative",
                zIndex: 1,
                mt: 1,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Building2 size={16} strokeWidth={1.5} />
              {t("geographic.chart.topStates")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("geographic.chart.statesSubtitle")}
            </Typography>

            {selectedCountry && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Chip
                  size="small"
                  label={`${getFlagEmoji(selectedCountry)} ${
                    countries.find((c) => c.iso_code === selectedCountry)
                      ?.country ?? selectedCountry
                  }`}
                  onDelete={() => onCountrySelect(null)}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {filteredStates.length > 0 ? (
              <>
                {/* Gráfico de barras */}
                <Box sx={{ mb: 3 }}>
                  <ApexChartWrapper
                    type="bar"
                    size="standard"
                    {...formatBarChart(
                      filteredStates.slice(0, 8).map((state) => ({
                        ...state,
                        label: `${state.state_name || state.state}, ${state.country}`,
                      })),
                      "label",
                      "clicks",
                      chartByType.geographic.states,
                      true,
                      isDark,
                    )}
                  />
                </Box>

                {/* Lista detalhada */}
                <Box>
                  {filteredStates.slice(0, 10).map((state, index) => (
                    <Box
                      key={`${state.country}-${state.state}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        borderBottom:
                          index < filteredStates.length - 1
                            ? `1px solid ${theme.palette.divider}`
                            : "none",
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {state.state_name || state.state}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {state.country}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {state.clicks} {t("geographic.chart.clicks")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  <Building2 size={24} strokeWidth={1.5} />
                </Typography>
                <Typography>{t("geographic.chart.noStatesData")}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      )}

      {/* Divider between the countries/states row and the full-width cities section —
          replaces the visual boundary the individual Cards used to provide before
          this list was folded into GeographicMapAndList's single shared card. */}
      {(showCountries || showStates) && (
        <Grid item xs={12}>
          <Divider />
        </Grid>
      )}

      {/* Top Cidades */}
      <Grid item xs={12}>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              position: "relative",
              zIndex: 1,
              mt: 1,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Building2 size={16} strokeWidth={1.5} />
            {t("geographic.chart.topCities")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("geographic.chart.citiesSubtitle")}
          </Typography>

          {cities.length > 0 ? (
            <Box>
              {cities.slice(0, 10).map((city, index) => (
                <Box
                  key={`${city.country}-${city.state}-${city.city}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom:
                      index < cities.length - 1
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {city.state ? `${city.city}, ${city.state}` : city.city}
                      {city.most_common_postal_code
                        ? ` · ZIP ${city.most_common_postal_code}`
                        : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {city.country}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {city.clicks} {t("geographic.chart.clicks")}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" gutterBottom>
                <Building2 size={24} strokeWidth={1.5} />
              </Typography>
              <Typography>{t("geographic.chart.noCitiesData")}</Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
