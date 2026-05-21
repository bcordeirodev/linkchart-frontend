"use client";

import { Box, Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Props for the Geographic tab filter bar. */
interface GeographicFilterBarProps {
  continent: string | null;
  onContinentChange: (v: string | null) => void;
}

const CONTINENT_OPTIONS = [
  { code: null, key: "all" as const },
  { code: "NA", key: "NA" as const },
  { code: "EU", key: "EU" as const },
  { code: "AS", key: "AS" as const },
  { code: "AF", key: "AF" as const },
  { code: "OC", key: "OC" as const },
] as const;

/**
 * Filter bar for the Geographic analytics tab.
 *
 * Controls one dimension:
 * - `continent`: backend filter — limits data to clicks from this continent.
 */
export function GeographicFilterBar({
  continent,
  onContinentChange,
}: GeographicFilterBarProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  const hasActiveFilters = continent !== null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 1.5,
        px: 2,
        pt: 1.25,
        pb: 1.5,
        mb: 2,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <SlidersHorizontal
            size={13}
            strokeWidth={2.5}
            color={theme.palette.text.secondary}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {t("filters.title")}
          </Typography>
        </Box>

        {hasActiveFilters && (
          <Typography
            variant="caption"
            color="primary"
            sx={{ fontWeight: 600, letterSpacing: "0.02em" }}
          >
            {t(
              `filters.continentOptions.${
                CONTINENT_OPTIONS.find((o) => o.code === continent)?.key ?? "all"
              }`,
            )}
          </Typography>
        )}
      </Box>

      <Divider sx={{ width: "100%", mt: -0.5 }} />

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
    </Box>
  );
}

export default GeographicFilterBar;
