"use client";
import { useState, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { CountryData } from "@/types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO alpha-2 → ISO numeric (geo.id in world-atlas TopoJSON)
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

interface GeographicChoroplethProps {
  countries: CountryData[];
  selectedCountry: string | null;
  onCountrySelect: (isoCode: string | null) => void;
}

export function GeographicChoropleth({
  countries,
  selectedCountry,
  onCountrySelect,
}: GeographicChoroplethProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    country: "",
    clicks: 0,
    percentage: "0",
    visible: false,
  });

  // Lookup: numeric geo ID → country data + percentage
  const countryMap = useMemo(() => {
    const totalClicks = countries.reduce((sum, c) => sum + c.clicks, 0);
    const map: Record<string, { data: CountryData; percentage: string }> = {};
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

  const getCountryColor = useCallback(
    (geoId: string) => {
      const entry = countryMap[geoId];
      if (!entry) return isDark ? "#1e2433" : "#e8ecf3";
      const intensity = entry.data.clicks / maxClicks;
      return alpha(theme.palette.primary.main, 0.15 + intensity * 0.85);
    },
    [countryMap, maxClicks, theme, isDark],
  );

  const handleMouseEnter = useCallback(
    (evt: React.MouseEvent<SVGPathElement>, geoId: string) => {
      const entry = countryMap[geoId];
      if (!entry) return;
      const svgEl = (evt.currentTarget as SVGElement).closest("svg");
      const rect = svgEl?.getBoundingClientRect();
      setTooltip({
        x: evt.clientX - (rect?.left ?? 0) + 8,
        y: Math.max(4, evt.clientY - (rect?.top ?? 0) - 32),
        country: entry.data.country,
        clicks: entry.data.clicks,
        percentage: entry.percentage,
        visible: true,
      });
    },
    [countryMap],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleClick = useCallback(
    (geoId: string) => {
      const entry = countryMap[geoId];
      if (!entry) return;
      const isoCode = entry.data.iso_code;
      onCountrySelect(selectedCountry === isoCode ? null : isoCode);
    },
    [countryMap, selectedCountry, onCountrySelect],
  );

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    mb: 3,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  return (
    <Card sx={cardSx}>
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
          {t("geographic.choropleth.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("geographic.choropleth.subtitle")}
        </Typography>

        {/* paddingTop 54% = 432/800 — container keeps the SVG aspect ratio so the full world is visible */}
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
            <ComposableMap
              width={800}
              height={432}
              projectionConfig={{ scale: 112 }}
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.length === 0
                    ? null
                    : geographies.map((geo) => {
                        const geoId =
                          geo.id != null ? String(geo.id).padStart(3, "0") : "";
                        if (!geoId) return null;
                        const isSelected = selectedNumericId === geoId;
                        const hasData = !!countryMap[geoId];

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getCountryColor(geoId)}
                            stroke={
                              isSelected
                                ? theme.palette.primary.main
                                : isDark
                                  ? "#2a3045"
                                  : "#c8d0e0"
                            }
                            strokeWidth={isSelected ? 2 : 0.5}
                            style={{
                              default: {
                                outline: "none",
                                cursor: hasData ? "pointer" : "default",
                              },
                              hover: {
                                outline: "none",
                                fill: hasData
                                  ? alpha(theme.palette.primary.main, 0.9)
                                  : undefined,
                              },
                              pressed: { outline: "none" },
                            }}
                            onMouseEnter={(evt) => handleMouseEnter(evt, geoId)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(geoId)}
                          />
                        );
                      })
                }
              </Geographies>
            </ComposableMap>
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
      </CardContent>
    </Card>
  );
}

export default GeographicChoropleth;
