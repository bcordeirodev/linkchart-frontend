"use client";
import { Box, Typography, Card, CardContent, Grid, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Globe, Building2, Map } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatBarChart } from "@/features/analytics/utils/chartFormatters";
import { chartByType } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

import type { CountryData, StateData, CityData } from "@/types";

interface GeographicChartProps {
  countries: CountryData[];
  states: StateData[];
  cities: CityData[];
  totalClicks: number;
  selectedCountry: string | null;
  onCountrySelect: (isoCode: string | null) => void;
  hideCountries?: boolean;
  hideStates?: boolean;
}

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

  const filteredStates = selectedCountry
    ? states.filter(
        (s) =>
          s.country?.toLowerCase() ===
          (
            countries.find((c) => c.iso_code === selectedCountry)?.country ?? ""
          ).toLowerCase(),
      )
    : states;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

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
    <Grid container spacing={3}>
      {/* Top Países */}
      {!hideCountries && (
        <Grid item xs={12} lg={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography
                variant="h6"
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
                            onCountrySelect(
                              isSelected ? null : country.iso_code,
                            )
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
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {country.clicks} clicks
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
                  <Typography>
                    {t("geographic.chart.noCountriesData")}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Top Estados */}
      {!hideStates && (
        <Grid item xs={12} lg={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography
                variant="h6"
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
                          {state.clicks} clicks
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
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Top Cidades */}
      <Grid item xs={12}>
        <Card sx={cardSx}>
          <CardContent>
            <Typography
              variant="h6"
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {cities.slice(0, 20).map((city) => (
                  <Chip
                    key={`${city.country}-${city.state}-${city.city}`}
                    label={`${city.city} (${city.clicks})`}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      height: 28,
                    }}
                  />
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
