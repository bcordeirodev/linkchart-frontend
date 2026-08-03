"use client";
/**
 * Ranked horizontal bars of the click distribution across one selectable
 * dimension (country, city, device, os, browser, social platform, navigation
 * context or quality tier), with a `Select` in the `ChartCard` action slot.
 *
 * Replaces the previous donut (`BreakdownChart`): for ranked categorical
 * data, aligned horizontal bars with explicit counts/percentages are far
 * easier to scan than angular slices. Pure MUI boxes — no ApexCharts.
 */

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { SelectChangeEvent } from "@mui/material";
import type {
  BreakdownRow,
  ReportsBreakdownDimension,
} from "@/features/reports/types";

/** Every dimension the backend whitelist (`ReportsAnalyticsService::DIMENSIONS`) accepts, in menu order. */
const DIMENSIONS: readonly ReportsBreakdownDimension[] = [
  "country",
  "city",
  "device",
  "os",
  "browser",
  "social_platform",
  "navigation_context",
  "quality_tier",
];

/** Maps each dimension to its full i18n label key (avoids a template-literal key, which the typed `t()` rejects). */
const DIMENSION_LABEL_KEY: Record<
  ReportsBreakdownDimension,
  | "breakdown.dimensions.country"
  | "breakdown.dimensions.city"
  | "breakdown.dimensions.device"
  | "breakdown.dimensions.os"
  | "breakdown.dimensions.browser"
  | "breakdown.dimensions.social_platform"
  | "breakdown.dimensions.navigation_context"
  | "breakdown.dimensions.quality_tier"
> = {
  country: "breakdown.dimensions.country",
  city: "breakdown.dimensions.city",
  device: "breakdown.dimensions.device",
  os: "breakdown.dimensions.os",
  browser: "breakdown.dimensions.browser",
  social_platform: "breakdown.dimensions.social_platform",
  navigation_context: "breakdown.dimensions.navigation_context",
  quality_tier: "breakdown.dimensions.quality_tier",
};

/**
 * Props accepted by {@link BreakdownBars}.
 *
 * Loading/error/empty are gated by the caller's `AnalyticsStateManager`
 * (see `ReportsPage`) — this component only ever mounts with a non-empty
 * `data`.
 */
interface BreakdownBarsProps {
  /** Rows for the currently selected `dimension`, sorted by clicks desc. */
  data: BreakdownRow[];
  /** Dimension currently being visualized. */
  dimension: ReportsBreakdownDimension;
  /** Called when the user picks a different dimension from the `Select`. */
  onDimensionChange: (dimension: ReportsBreakdownDimension) => void;
}

/**
 * Where the user's clicks come from, along one selectable dimension at a
 * time — each row shows the raw label, absolute clicks, share (%) and a bar
 * scaled to the top row (rank shape, not part-of-whole; the % carries that).
 */
export function BreakdownBars({
  data,
  dimension,
  onDimensionChange,
}: BreakdownBarsProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");

  const max = Math.max(...data.map((row) => row.clicks), 1);

  /** Forwards the `Select`'s native change event as a typed dimension to the caller. */
  const handleChange = (event: SelectChangeEvent) => {
    onDimensionChange(event.target.value as ReportsBreakdownDimension);
  };

  return (
    <ChartCard
      title={t("breakdown.title")}
      subtitle={t("breakdown.subtitle")}
      action={
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <Select
            value={dimension}
            onChange={handleChange}
            aria-label={t("breakdown.title")}
          >
            {DIMENSIONS.map((dim) => (
              <MenuItem key={dim} value={dim}>
                {t(DIMENSION_LABEL_KEY[dim])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <Stack spacing={1.5} sx={{ pt: 0.5 }}>
        {data.map((row) => (
          <Box key={row.label}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="body2"
                noWrap
                title={row.label}
                sx={{ fontWeight: 500, minWidth: 0 }}
              >
                {row.label}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.clicks.toLocaleString()} · {row.pct}%
              </Typography>
            </Box>
            <Box
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(row.clicks / max) * 100}%`,
                  height: "100%",
                  borderRadius: 3,
                  bgcolor: theme.palette.primary.main,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </ChartCard>
  );
}

export default BreakdownBars;
