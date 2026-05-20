"use client";

import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { GeoLevel } from "@/features/links/hooks/useAnalyticsFilters";

/** Props for the Geographic tab filter bar. */
interface GeographicFilterBarProps {
  continent: string | null;
  minClicks: number;
  geoLevel: GeoLevel;
  onContinentChange: (v: string | null) => void;
  onMinClicksChange: (v: number) => void;
  onGeoLevelChange: (v: GeoLevel) => void;
}

const CONTINENT_OPTIONS = [
  { code: null, key: "all" as const },
  { code: "NA", key: "NA" as const },
  { code: "EU", key: "EU" as const },
  { code: "AS", key: "AS" as const },
  { code: "AF", key: "AF" as const },
  { code: "OC", key: "OC" as const },
] as const;

const MIN_CLICKS_OPTIONS = [1, 5, 10, 50] as const;
const GEO_LEVEL_OPTIONS: GeoLevel[] = ["country", "state", "city"];

/**
 * Filter bar for the Geographic analytics tab.
 *
 * Controls three dimensions:
 * - `continent`: backend filter — limits data to clicks from this continent
 * - `minClicks`: backend filter — hides locations below this threshold
 * - `geoLevel`: frontend-only display control — which level the map/list highlights
 */
export function GeographicFilterBar({
  continent,
  minClicks,
  geoLevel,
  onContinentChange,
  onMinClicksChange,
  onGeoLevelChange,
}: GeographicFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 1.5,
        px: 2,
        py: 1.5,
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            minWidth: 80,
          }}
        >
          {t("filters.continent")}
        </Typography>
        {CONTINENT_OPTIONS.map(({ code, key }) => (
          <Chip
            key={key}
            label={t(`filters.continentOptions.${key}`)}
            size="small"
            variant={continent === code ? "filled" : "outlined"}
            color={continent === code ? "primary" : "default"}
            onClick={() => onContinentChange(code)}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={3}
        flexWrap="wrap"
        useFlexGap
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              minWidth: 80,
            }}
          >
            {t("filters.minClicks")}
          </Typography>
          {MIN_CLICKS_OPTIONS.map((v) => (
            <Chip
              key={v}
              label={t(`filters.minClicksOptions.${v}`)}
              size="small"
              variant={minClicks === v ? "filled" : "outlined"}
              color={minClicks === v ? "primary" : "default"}
              onClick={() => onMinClicksChange(v)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              minWidth: 80,
            }}
          >
            {t("filters.geoLevel")}
          </Typography>
          {GEO_LEVEL_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={t(`filters.geoLevelOptions.${opt}`)}
              size="small"
              variant={geoLevel === opt ? "filled" : "outlined"}
              color={geoLevel === opt ? "primary" : "default"}
              onClick={() => onGeoLevelChange(opt)}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

export default GeographicFilterBar;
