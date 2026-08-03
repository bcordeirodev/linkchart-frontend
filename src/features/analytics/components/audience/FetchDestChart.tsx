"use client";

import { Box, Chip, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import { HorizontalBreakdownBars } from "./HorizontalBreakdownBars";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

import type { HorizontalBreakdownItem } from "./HorizontalBreakdownBars";
import type { FetchDestBreakdown } from "@/types/analytics/audience";

interface FetchDestChartProps {
  /** Fetch-dest breakdown data from the audience API. */
  fetchDestBreakdown: FetchDestBreakdown;
}

/** Accent colours mapped to common Sec-Fetch-Dest values. */
const FETCH_DEST_COLORS: Record<string, string> = {
  document: "#3b82f6",
  empty: "#22c55e",
  image: "#f59e0b",
  script: "#ef4444",
  style: "#a855f7",
  font: "#06b6d4",
  fetch: "#64748b",
  xhr: "#f97316",
  worker: "#84cc16",
};

/**
 * Breakdown of the Sec-Fetch-Dest header values collected for a link (Phase 1
 * tracking) — how the browser initiated each click request.
 *
 * Renders through {@link ChartCard} and the shared
 * {@link HorizontalBreakdownBars} mark, like every other breakdown on the page.
 * It used to hang its title *above* a bare `Card` while its neighbour put the
 * title inside one, so the two read as different kinds of block sitting side by
 * side; and its rows were `LinearProgress` with only the bar colour overridden,
 * leaving MUI's default blue track under a coloured fill.
 *
 * Displays a phase disclaimer chip when Phase 1 data is not yet meaningfully
 * available for this link (fewer than 5% of clicks have `fetch_dest` set). The
 * chart is always shown alongside the disclaimer so the user understands why
 * data may be empty.
 */
export function FetchDestChart({ fetchDestBreakdown }: FetchDestChartProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const { data, phase1_available } = fetchDestBreakdown;

  const items: HorizontalBreakdownItem[] = data.map((entry) => ({
    key: entry.fetch_dest,
    label: entry.fetch_dest,
    value: entry.clicks,
    percentage: entry.percentage,
    color: FETCH_DEST_COLORS[entry.fetch_dest] ?? theme.palette.primary.main,
  }));

  return (
    <Box>
      {!phase1_available && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<Info size={14} />}
            label={t("audience.fetchDest.phaseDisclaimer")}
            size="small"
            variant="filled"
            sx={getPhaseDataChipSx(theme)}
          />
        </Box>
      )}

      <ChartCard
        title={t("audience.fetchDest.title")}
        subtitle={t("audience.fetchDest.description")}
      >
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("audience.noData")}
          </Typography>
        ) : (
          <HorizontalBreakdownBars items={items} />
        )}
      </ChartCard>
    </Box>
  );
}

export default FetchDestChart;
