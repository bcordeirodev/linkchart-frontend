"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { Globe, Map as MapIcon, List as ListIcon, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useResponsive } from "@/lib/theme";
import { ICON_SM } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { CountryData, StateData, CityData, HeatmapPoint } from "@/types";
import type { GeographicStats } from "../../hooks/useGeographicData";

import { GeographicChart } from "./GeographicChart";
import { GeographicChoropleth } from "./GeographicChoropleth";
import { RealTimeHeatmapChart } from "./RealTimeHeatmapChart";

/** The three interchangeable visualisations of the same "where is my audience?" question. */
type GeoView = "map" | "list" | "heat";

/** Props accepted by the {@link GeographicMapAndList} component. */
interface GeographicMapAndListProps {
  /** Top countries by click volume. */
  countries: CountryData[];
  /** Top states/regions by click volume. */
  states: StateData[];
  /** Top cities by click volume. */
  cities: CityData[];
  /** Total clicks used to compute per-country/state percentages in the list view. */
  totalClicks: number;
  /** ISO alpha-2 code of the currently selected country, shared between both views. */
  selectedCountry: string | null;
  /** Called when a country is selected or cleared, from either view. */
  onCountrySelect: (isoCode: string | null) => void;
  /** City-level heat points. When empty, the "Calor" toggle is not offered. */
  heatmapData: HeatmapPoint[];
  /** Aggregate geo stats, forwarded to the heat view. */
  stats?: GeographicStats | null;
  /** Loading flag, forwarded to the heat view. */
  loading?: boolean;
  /** Error message, forwarded to the heat view. */
  error?: string | null;
  /** Retry callback, forwarded to the heat view. */
  onRefresh?: () => void;
}

/**
 * Single card that answers "where is my audience?" with three interchangeable
 * visualisations of the same location data: a world choropleth
 * ({@link GeographicChoropleth}), a ranked list with bar charts
 * ({@link GeographicChart}), and a city-level heat map
 * ({@link RealTimeHeatmapChart}). A `ToggleButtonGroup` — styled after the
 * view switcher in `LinkActionsViewSwitch` — swaps between them.
 *
 * They used to be separate sub-tabs, which forced the user to guess *which of
 * the two maps* held the answer. They are one question ("where?") asked three
 * ways, so they share one card and one screen.
 *
 * `selectedCountry`/`onCountrySelect` are lifted to the parent so a selection
 * made in either view (map click or list row click) is preserved the next time
 * the user toggles.
 *
 * The heat view is only offered when there are points to show, and only mounts
 * while it is active — Leaflet and its tiles are never fetched otherwise.
 */
export function GeographicMapAndList({
  countries,
  states,
  cities,
  totalClicks,
  selectedCountry,
  onCountrySelect,
  heatmapData,
  stats,
  loading = false,
  error = null,
  onRefresh,
}: GeographicMapAndListProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const { isMobile } = useResponsive();
  const isDark = theme.palette.mode === "dark";
  const [view, setView] = useState<GeoView>("map");

  const hasHeatmap = heatmapData.length > 0;

  /**
   * Handles the view toggle's change event. MUI's exclusive `ToggleButtonGroup`
   * emits `null` when the already-active button is clicked again — ignored so
   * the card never ends up with no view selected.
   *
   * @param _event - Underlying MUI change event (unused).
   * @param newView - Newly selected view, or `null` if the active one was re-clicked.
   */
  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: GeoView | null,
  ) => {
    if (newView) setView(newView);
  };

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  return (
    <Card sx={cardSx}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Globe size={16} strokeWidth={1.5} />
              {t("geographic.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("geographic.description")}
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            aria-label={t("geographic.mapListToggle.ariaLabel")}
            sx={{
              gap: 0.375,
              p: 0.375,
              flexShrink: 0,
              backgroundColor: theme.palette.action.hover,
              borderRadius: `${radiusTokens.md}px`,
              "& .MuiToggleButtonGroup-grouped": {
                margin: 0,
                border: 0,
                borderRadius: `${radiusTokens.sm}px`,
                "&:not(:first-of-type)": {
                  marginLeft: 0,
                  borderLeft: 0,
                },
              },
              "& .MuiToggleButton-root": {
                minHeight: { xs: 44, sm: 36 },
                minWidth: 44,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.8125rem",
                py: 0.5,
                px: { xs: 1.25, sm: 1.5 },
                color: theme.palette.text.secondary,
                transition: theme.transitions.create(
                  ["color", "background-color", "box-shadow"],
                  { duration: theme.transitions.duration.shortest },
                ),
                "&:hover": {
                  backgroundColor: "transparent",
                  color: theme.palette.text.primary,
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  boxShadow: theme.shadows[1],
                },
                "&.Mui-selected:hover": {
                  backgroundColor: theme.palette.background.paper,
                },
              },
            }}
          >
            <ToggleButton
              value="map"
              aria-label={t("geographic.mapListToggle.map")}
            >
              <Box
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                <MapIcon {...ICON_SM} strokeWidth={1.75} />
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("geographic.mapListToggle.map")}
                </Box>
              </Box>
            </ToggleButton>
            <ToggleButton
              value="list"
              aria-label={t("geographic.mapListToggle.list")}
            >
              <Box
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                <ListIcon {...ICON_SM} strokeWidth={1.75} />
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("geographic.mapListToggle.list")}
                </Box>
              </Box>
            </ToggleButton>
            {hasHeatmap ? (
              <ToggleButton
                value="heat"
                aria-label={t("geographic.mapListToggle.heat")}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Flame {...ICON_SM} strokeWidth={1.75} />
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "none", sm: "inline" },
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("geographic.mapListToggle.heat")}
                  </Box>
                </Box>
              </ToggleButton>
            ) : null}
          </ToggleButtonGroup>
        </Box>

        {view === "map" ? (
          <GeographicChoropleth
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        ) : null}

        {view === "list" ? (
          <GeographicChart
            countries={countries}
            states={states}
            cities={cities}
            totalClicks={totalClicks}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        ) : null}

        {/* Mounted only while the "Calor" view is active, so the Leaflet chunk
            and the map tiles stay off the wire until the user asks for them.

            The explicit pixel height is load-bearing: this chart collapsed to
            0px on mobile once before, because a percentage height inside a
            flex parent has nothing to resolve against. Do not swap it for
            `height: "100%"`.

            It sizes the whole widget, not the map — the heat map's own header
            (controls, legend, min-clicks slider) eats ~250px on desktop and
            more on mobile, where the controls wrap. Shrink these numbers and
            the map, not the header, is what gets squeezed. */}
        {view === "heat" && hasHeatmap ? (
          <RealTimeHeatmapChart
            bare
            data={heatmapData}
            loading={loading}
            error={error}
            onRefresh={onRefresh}
            height={isMobile ? 960 : 700}
            showControls
            showStats={false}
            stats={stats}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default GeographicMapAndList;
