"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  LatLngBoundsExpression,
  LeafletMouseEvent,
  Map as LeafletMap,
  Path as LeafletPath,
  PathOptions,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Paper, alpha } from "@mui/material";
import type { Theme } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { GeoJSON, MapContainer } from "react-leaflet";
import { useTranslation } from "react-i18next";

import type { CountryData } from "@/types";

/**
 * Local, CSP-friendly world topology — country polygons converted from
 * `world-atlas@2/countries-110m.json` (Natural Earth, public domain) to plain
 * GeoJSON so Leaflet can consume it without a runtime TopoJSON decoder.
 * Served from `public/geo/`, same origin, so no `connect-src` CSP exception
 * is needed (unlike the previous `cdn.jsdelivr.net` fetch). Regenerate with
 * `topojson-client`'s `feature()` if the upstream dataset changes; only the
 * `id` (ISO numeric) and `geometry` survive the conversion — `properties`
 * are stripped since this component only needs the id.
 */
const WORLD_GEOJSON_URL = "/geo/countries-110m.geojson";

/**
 * World extent the map fits to — excludes deep Antarctica, mirroring the
 * crop the previous `ComposableMap` (800×432, scale 112) produced. There is
 * no exact equivalent: Leaflet only renders Web Mercator, while the old map
 * used `react-simple-maps`' default Equal Earth projection, so land masses
 * near the poles (Greenland, Antarctica, Russia) are visually larger here
 * than before. This is an inherent trade-off of consolidating onto Leaflet.
 */
const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-58, -180],
  [83, 180],
];

// ISO alpha-2 → ISO numeric (geo.id in world-atlas TopoJSON/GeoJSON)
const ISO2_TO_NUMERIC: Record<string, string> = {
  AF: "004",
  AL: "008",
  DZ: "012",
  AO: "024",
  AR: "032",
  AU: "036",
  AT: "040",
  AZ: "031",
  AM: "051",
  BD: "050",
  BE: "056",
  BA: "070",
  BY: "112",
  BO: "068",
  BR: "076",
  BG: "100",
  CA: "124",
  CI: "384",
  CL: "152",
  CM: "120",
  CN: "156",
  CO: "170",
  CR: "188",
  CU: "192",
  CZ: "203",
  DE: "276",
  DK: "208",
  DO: "214",
  EC: "218",
  EE: "233",
  EG: "818",
  ES: "724",
  ET: "231",
  FI: "246",
  FR: "250",
  GE: "268",
  GH: "288",
  GT: "320",
  HN: "340",
  HR: "191",
  HU: "348",
  ID: "360",
  IE: "372",
  IL: "376",
  IN: "356",
  IQ: "368",
  IR: "364",
  IT: "380",
  JO: "400",
  JP: "392",
  KE: "404",
  KR: "410",
  KW: "414",
  KZ: "398",
  LB: "422",
  LK: "144",
  LT: "440",
  LU: "442",
  LV: "428",
  LY: "434",
  MA: "504",
  MD: "498",
  ME: "499",
  MG: "450",
  MK: "807",
  MX: "484",
  MY: "458",
  MZ: "508",
  NG: "566",
  NI: "558",
  NL: "528",
  NO: "578",
  NZ: "554",
  PA: "591",
  PE: "604",
  PH: "608",
  PK: "586",
  PL: "616",
  PT: "620",
  PY: "600",
  QA: "634",
  RO: "642",
  RS: "688",
  RU: "643",
  SA: "682",
  SE: "752",
  SI: "705",
  SK: "703",
  SN: "686",
  SV: "222",
  SY: "760",
  TH: "764",
  TN: "788",
  TR: "792",
  TW: "158",
  TZ: "834",
  UA: "804",
  UG: "800",
  US: "840",
  UY: "858",
  UZ: "860",
  VE: "862",
  VN: "704",
  YE: "887",
  ZA: "710",
  ZM: "894",
  ZW: "716",
  AE: "784",
  GB: "826",
  CH: "756",
};

interface TooltipState {
  x: number;
  y: number;
  country: string;
  clicks: number;
  percentage: string;
  visible: boolean;
}

/** Props accepted by the {@link GeographicChoropleth} component. */
interface GeographicChoroplethProps {
  /** Top countries by click volume, used to shade the world map. */
  countries: CountryData[];
  /** ISO alpha-2 code of the currently selected country, or `null`. */
  selectedCountry: string | null;
  /** Called when a country is selected or cleared (click again to clear). */
  onCountrySelect: (isoCode: string | null) => void;
}

/** Per-feature lookup entry: the matched click data plus its % share of total. */
interface CountryLookupEntry {
  data: CountryData;
  percentage: string;
}

/**
 * Everything the imperative Leaflet event handlers in `onEachFeature` need
 * to compute up-to-date styling. `onEachFeature` runs once per feature when
 * the GeoJSON layer is created — Leaflet never re-invokes it on prop
 * changes — so the handlers read this snapshot through `latestRef` instead
 * of closing over render-scoped values directly, which would otherwise go
 * stale after the first render (e.g. a click on another country, a theme
 * toggle, or refreshed click counts).
 */
interface StyleContext {
  countryMap: Record<string, CountryLookupEntry>;
  maxClicks: number;
  selectedNumericId: string | null;
  selectedCountry: string | null;
  onCountrySelect: (isoCode: string | null) => void;
  theme: Theme;
  isDark: boolean;
}

/**
 * Computes the fill/stroke for a single country polygon — the single source
 * of truth shared by the reactive `style` prop (re-run by react-leaflet
 * whenever it changes identity) and the imperative hover-revert in
 * `onEachFeature` (see {@link StyleContext}). Mirrors the original
 * `getCountryColor`/inline style formula exactly: an alpha-blended
 * `primary.main` scaled by click share for countries with data, a flat
 * neutral fallback otherwise.
 */
function styleForGeoId(geoId: string, ctx: StyleContext): PathOptions {
  const entry = geoId ? ctx.countryMap[geoId] : undefined;
  const isSelected = !!geoId && ctx.selectedNumericId === geoId;
  const fillColor = entry
    ? alpha(
        ctx.theme.palette.primary.main,
        0.15 + (entry.data.clicks / ctx.maxClicks) * 0.85,
      )
    : ctx.isDark
      ? "#1e2433"
      : "#e8ecf3";

  return {
    fillColor,
    fillOpacity: 1,
    color: isSelected
      ? ctx.theme.palette.primary.main
      : ctx.isDark
        ? "#2a3045"
        : "#c8d0e0",
    weight: isSelected ? 2 : 0.5,
    // Countries without click data get no hover/click handling — same as
    // the original, which left `cursor: default` and no-op handlers on them.
    interactive: !!entry,
  };
}

/**
 * World choropleth of click volume by country.
 *
 * Renders bare — no `Card`/title chrome of its own — because the caller wraps
 * it in a `ChartCard` that supplies the title and the description. It is only
 * rendered at the top of the "Mundo" sub-tab, whose parent owns
 * the shared card, header and view toggle. Keeps its own explanatory
 * subtitle so the map is still self-explanatory in isolation.
 *
 * Built on the same Leaflet engine as `RealTimeHeatmapChart` (the heat map on
 * the "Mapa de calor" sub-tab) instead of `react-simple-maps`, so the tab
 * only ever loads one mapping stack. The country polygons are a GeoJSON
 * layer with no base tile layer underneath — there is no imagery to load,
 * only vector shapes styled exactly like the old SVG paths — and panning/
 * zooming are fully disabled so the interaction model matches the static SVG
 * map it replaces.
 */
export function GeographicChoropleth({
  countries,
  selectedCountry,
  onCountrySelect,
}: GeographicChoroplethProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const mapRef = useRef<LeafletMap | null>(null);
  const [geoData, setGeoData] = useState<FeatureCollection<
    Geometry,
    GeoJsonProperties
  > | null>(null);

  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    country: "",
    clicks: 0,
    percentage: "0",
    visible: false,
  });

  // Loads the local country topology once. Errors are swallowed on purpose:
  // the previous CDN-backed map had no error state either — a failed load
  // just left the map showing no country shapes.
  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_GEOJSON_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load world geometry: ${res.status}`);
        }
        return res.json() as Promise<
          FeatureCollection<Geometry, GeoJsonProperties>
        >;
      })
      .then((data) => {
        if (!cancelled) setGeoData(data);
      })
      .catch(() => {
        // Silent by design — see comment above.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Lookup: numeric geo ID → country data + percentage
  const countryMap = useMemo(() => {
    const totalClicks = countries.reduce((sum, c) => sum + c.clicks, 0);
    const map: Record<string, CountryLookupEntry> = {};
    countries.forEach((c) => {
      const numericId = ISO2_TO_NUMERIC[c.iso_code?.toUpperCase()];
      if (numericId) {
        map[numericId] = {
          data: c,
          percentage:
            totalClicks > 0
              ? ((c.clicks / totalClicks) * 100).toFixed(1)
              : "0.0",
        };
      }
    });
    return map;
  }, [countries]);

  const maxClicks = useMemo(
    () =>
      Math.max(
        1,
        countries.length > 0 ? Math.max(...countries.map((c) => c.clicks)) : 1,
      ),
    [countries],
  );

  const selectedNumericId = useMemo(() => {
    if (!selectedCountry) return null;
    return ISO2_TO_NUMERIC[selectedCountry.toUpperCase()] ?? null;
  }, [selectedCountry]);

  // Always-fresh snapshot for the event handlers bound once in
  // `onEachFeature` (see {@link StyleContext}).
  const latestRef = useRef<StyleContext>({
    countryMap,
    maxClicks,
    selectedNumericId,
    selectedCountry,
    onCountrySelect,
    theme,
    isDark,
  });
  latestRef.current = {
    countryMap,
    maxClicks,
    selectedNumericId,
    selectedCountry,
    onCountrySelect,
    theme,
    isDark,
  };

  const updateTooltip = useCallback(
    (evt: LeafletMouseEvent, entry: CountryLookupEntry) => {
      // `containerPoint` is already relative to the map container's
      // top-left corner — the Leaflet equivalent of the original's manual
      // `clientX - svgRect.left` offset.
      setTooltip({
        x: evt.containerPoint.x + 8,
        y: Math.max(4, evt.containerPoint.y - 32),
        country: entry.data.country,
        clicks: entry.data.clicks,
        percentage: entry.percentage,
        visible: true,
      });
    },
    [],
  );

  // Reactive per-feature style — react-leaflet calls `layer.setStyle(style)`
  // whenever this function's identity changes, and Leaflet's GeoJSON
  // re-evaluates it per feature, so selection, click-count updates and
  // theme changes all repaint without remounting the layer.
  const style = useCallback(
    (feature?: Feature<Geometry, GeoJsonProperties>): PathOptions => {
      const geoId =
        feature?.id != null ? String(feature.id).padStart(3, "0") : "";
      return styleForGeoId(geoId, {
        countryMap,
        maxClicks,
        selectedNumericId,
        selectedCountry,
        onCountrySelect,
        theme,
        isDark,
      });
    },
    [
      countryMap,
      maxClicks,
      selectedNumericId,
      selectedCountry,
      onCountrySelect,
      theme,
      isDark,
    ],
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, GeoJsonProperties>, layer: LeafletPath) => {
      const geoId =
        feature.id != null ? String(feature.id).padStart(3, "0") : "";
      if (!geoId) return;

      layer.on("mouseover", (evt: LeafletMouseEvent) => {
        const ctx = latestRef.current;
        const entry = ctx.countryMap[geoId];
        if (!entry) return;
        layer.setStyle({
          fillColor: alpha(ctx.theme.palette.primary.main, 0.9),
          fillOpacity: 1,
        });
        updateTooltip(evt, entry);
      });

      layer.on("mousemove", (evt: LeafletMouseEvent) => {
        const entry = latestRef.current.countryMap[geoId];
        if (!entry) return;
        updateTooltip(evt, entry);
      });

      layer.on("mouseout", () => {
        const ctx = latestRef.current;
        if (!ctx.countryMap[geoId]) return;
        layer.setStyle(styleForGeoId(geoId, ctx));
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

      layer.on("click", () => {
        const ctx = latestRef.current;
        const entry = ctx.countryMap[geoId];
        if (!entry) return;
        ctx.onCountrySelect(
          ctx.selectedCountry === entry.data.iso_code
            ? null
            : entry.data.iso_code,
        );
      });
    },
    [updateTooltip],
  );

  // Keeps the world fit to the card's actual width across breakpoints. The
  // old SVG map did this continuously via CSS (`width: 100%` + viewBox);
  // Leaflet needs an explicit refit since it isn't a scalable vector by
  // default and panning/zooming are disabled (see MapContainer props below).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoData) return undefined;
    const container = map.getContainer();
    const refit = () => {
      map.invalidateSize();
      map.fitBounds(WORLD_BOUNDS, { animate: false });
    };
    refit();
    const resizeObserver = new ResizeObserver(refit);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [geoData]);

  return (
    <Box>
      {/* paddingTop 54% = 432/800 — container keeps the same aspect ratio the
          old SVG map used so the full world is visible in the same footprint. */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "54%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {geoData ? (
            <MapContainer
              ref={mapRef}
              bounds={WORLD_BOUNDS}
              zoomSnap={0}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              boxZoom={false}
              keyboard={false}
              attributionControl={false}
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            >
              <GeoJSON
                data={geoData}
                style={style}
                onEachFeature={onEachFeature}
              />
            </MapContainer>
          ) : null}
        </Box>

        {/* Tooltip */}
        {tooltip.visible && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: tooltip.y,
              left: tooltip.x,
              px: 1.5,
              py: 1,
              pointerEvents: "none",
              zIndex: 10,
              minWidth: 140,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {tooltip.country}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {tooltip.clicks.toLocaleString()}{" "}
              {t("geographic.choropleth.clicks")} · {tooltip.percentage}%
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Tap-accessible readout: on touch the hover tooltip never fires, so
            surface the selected country's numbers here (set on tap via handleClick). */}
      {selectedNumericId && countryMap[selectedNumericId] ? (
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {countryMap[selectedNumericId].data.country}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {countryMap[selectedNumericId].data.clicks.toLocaleString()}{" "}
            {t("geographic.choropleth.clicks")} ·{" "}
            {countryMap[selectedNumericId].percentage}%
          </Typography>
        </Box>
      ) : null}

      {/* Gradient legend */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          justifyContent: "flex-end",
          mt: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t("geographic.choropleth.less")}
        </Typography>
        <Box
          sx={{
            width: 100,
            height: 8,
            borderRadius: 1,
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.15)}, ${theme.palette.primary.main})`,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {t("geographic.choropleth.more")}
        </Typography>
      </Box>

      {selectedCountry && (
        <Typography
          variant="caption"
          color="primary"
          sx={{ display: "block", mt: 0.5, textAlign: "right" }}
        >
          {t("geographic.choropleth.clickAgainToClear")}
        </Typography>
      )}
    </Box>
  );
}

export default GeographicChoropleth;
