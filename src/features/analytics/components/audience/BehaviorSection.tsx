"use client";
import { Box, Chip, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { SectionLabel } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { HorizontalBreakdownBars } from "./HorizontalBreakdownBars";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

import type { HorizontalBreakdownItem } from "./HorizontalBreakdownBars";
import type {
  NavigationContextEntry,
  NavigationContextBreakdown,
} from "@/types/analytics/audience";

/**
 * Accent colour per navigation context.
 *
 * Two generations of keys live here on purpose. The backend now sends the raw
 * `Sec-Fetch-Site` values (`none`, `cross-site`, `same-origin`, `same-site`);
 * the semantic ones below them are the older shape, still possible in payloads
 * for clicks recorded before that change. The raw values were missing entirely,
 * so every bar fell through to the grey default and the whole breakdown
 * rendered in one colour.
 */
const CONTEXT_COLORS: Record<string, string> = {
  // Current shape — raw Sec-Fetch-Site
  none: "#22c55e", // typed the URL / bookmark → direct
  "cross-site": "#3b82f6", // arrived from another site
  "same-origin": "#a855f7", // navigated inside your own site
  "same-site": "#06b6d4", // another host on the same registrable domain
  // Legacy shape
  browser_direct: "#22c55e",
  browser_referral: "#3b82f6",
  in_app_webview: "#f59e0b",
  api_programmatic: "#ef4444",
  preload: "#64748b",
  unknown: "#94a3b8",
};

interface BehaviorSectionProps {
  /**
   * Navigation context data. Accepts both the new phase-aware shape
   * (`{ data, phase_available }`) and the legacy flat array.
   */
  navigationContext: NavigationContextBreakdown | NavigationContextEntry[];
  /**
   * Whether to render the section heading. Pass `false` inside the Sources
   * sub-tab, whose tab label already provides the context.
   */
  showTitle?: boolean;
}

/**
 * Normalises the navigationContext prop into `{ data, phaseAvailable }`.
 *
 * Legacy callers pass a flat array (phaseAvailable defaults to true so no
 * disclaimer appears for data that predates the phase_available field).
 */
function normalise(
  raw: NavigationContextBreakdown | NavigationContextEntry[],
): { data: NavigationContextEntry[]; phaseAvailable: boolean } {
  if (Array.isArray(raw)) {
    return { data: raw, phaseAvailable: true };
  }
  return { data: raw.data, phaseAvailable: raw.phase_available };
}

/**
 * Renders the navigation-context breakdown for the "Detalhes técnicos" sub-tab.
 *
 * Uses the shared {@link HorizontalBreakdownBars} mark. It used to roll its own
 * `LinearProgress` rows, overriding only the *bar* colour — so the track kept
 * MUI's default, which is a tint of `primary`. The result was a blue track
 * under a coloured fill, which read as an inverted, half-filled bar. Every
 * other breakdown on the page uses this mark; this one now does too.
 *
 * Shows a phase disclaimer when `phase_available` is false, indicating that
 * Phase 1 tracking (Sec-Fetch headers) was not active for most clicks in the
 * selected range. The chart is still rendered so the user understands why
 * data may be sparse.
 */
export function BehaviorSection({
  navigationContext,
  showTitle = true,
}: BehaviorSectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const { data, phaseAvailable } = normalise(navigationContext);

  if (data.length === 0 && phaseAvailable) return null;

  const items: HorizontalBreakdownItem[] = data.map((entry) => ({
    key: entry.context,
    label: tDynamic(t, `audience.behavior.contexts.${entry.context}`, {
      defaultValue: entry.context,
    }),
    value: entry.clicks,
    percentage: entry.percentage,
    color: CONTEXT_COLORS[entry.context] ?? "#94a3b8",
  }));

  return (
    <Box>
      {showTitle ? (
        <Box sx={{ mb: 2 }}>
          <SectionLabel headingLevel={2}>
            {t("audience.behavior.title")}
          </SectionLabel>
        </Box>
      ) : null}

      {!phaseAvailable && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<Info size={14} />}
            label={t("audience.phaseData.unavailable")}
            size="small"
            variant="filled"
            sx={getPhaseDataChipSx(theme)}
          />
        </Box>
      )}

      <ChartCard
        title={t("audience.behavior.navigationContext")}
        subtitle={t("audience.behavior.description")}
      >
        {data.length === 0 ? (
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

export default BehaviorSection;
