"use client";
import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { chartPalette } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { AnalyticsEmptyState } from "@/shared/ui/base";

import type { ContinentData } from "@/types/analytics/geographic";

import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "../audience/HorizontalBreakdownBars";

// Same canonical series palette as every other chart (via ApexChartWrapper) —
// a bespoke rainbow here made this card look like a different product.
const CONTINENT_COLORS = [...chartPalette];

/** Props for {@link ContinentBreakdown}. */
interface ContinentBreakdownProps {
  /** Continent-level click breakdown. */
  continents: ContinentData[];
  /** ISO 2-letter continent code that is currently active as a backend filter. When set, highlights the matching row. */
  activeContinentCode?: string | null;
  /**
   * Called with the clicked row's continent code (or `null` to clear) when
   * the user selects a continent. Rows render as static bars, matching every
   * other read-only breakdown, when this is omitted.
   */
  onContinentSelect?: (code: string | null) => void;
}

/**
 * Renders the "Continentes" card for the Geographic tab: a single
 * horizontal-bar breakdown of clicks by continent, replacing the previous
 * donut + legend pair (donut legends truncate long names — "América do
 * Norte" — and are one of three ways this same country/continent data used
 * to appear on this tab).
 *
 * Doubles as the continent filter: when `onContinentSelect` is provided,
 * clicking a row toggles the backend `continent` filter (clicking the
 * already-active row clears it) — the same interaction the previous
 * donut+legend implied via its `activeContinentCode` highlight but never
 * actually wired up to a click handler.
 */
export function ContinentBreakdown({
  continents,
  activeContinentCode,
  onContinentSelect,
}: ContinentBreakdownProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  if (!continents || continents.length === 0) {
    return (
      <Card sx={cardSx}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Globe size={16} strokeWidth={1.5} />
            {t("geographic.continents.title")}
          </Typography>
          <AnalyticsEmptyState
            icon={<Globe size={32} strokeWidth={1.5} />}
            title={t("geographic.continents.empty")}
            compact
          />
        </CardContent>
      </Card>
    );
  }

  const items: HorizontalBreakdownItem[] = continents.map((c, index) => ({
    key: c.continent,
    label: tDynamic(t, `geographic.continents.${c.continent}`, {
      defaultValue: c.continent_name ?? c.continent,
    }),
    value: c.clicks,
    percentage: c.percentage ?? 0,
    color: CONTINENT_COLORS[index % CONTINENT_COLORS.length],
  }));

  /**
   * Toggles the continent filter: selecting the already-active continent
   * clears it back to "all", mirroring `GeographicFilterBar`'s clear-all (×)
   * behavior for the same `continent` state.
   */
  const handleItemClick = onContinentSelect
    ? (key: string) =>
        onContinentSelect(activeContinentCode === key ? null : key)
    : undefined;

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
          <Globe size={16} strokeWidth={1.5} />
          {t("geographic.continents.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("geographic.continents.subtitle")}
        </Typography>

        <HorizontalBreakdownBars
          items={items}
          onItemClick={handleItemClick}
          selectedKey={activeContinentCode ?? null}
        />
      </CardContent>
    </Card>
  );
}

export default ContinentBreakdown;
