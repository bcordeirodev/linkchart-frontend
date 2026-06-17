"use client";
import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { Info, Navigation } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/i18n/tDynamic";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { SectionDivider } from "@/shared/ui/SectionDivider";
import { getPhaseDataChipSx } from "./phaseDataChipSx";
import type {
  NavigationContextEntry,
  NavigationContextBreakdown,
} from "@/types/analytics/audience";

const CONTEXT_COLORS: Record<string, string> = {
  browser_direct: "#22c55e",
  browser_referral: "#3b82f6",
  in_app_webview: "#f59e0b",
  api_programmatic: "#ef4444",
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
 * Renders the navigation context bar chart for the Audience tab.
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

  return (
    <Box>
      {showTitle ? (
        <SectionDivider title={t("audience.behavior.title")} />
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
        icon={<Navigation {...ICON_MD} />}
      >
        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t("audience.noData")}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {data.map((entry) => {
              const label = tDynamic(
                t,
                `audience.behavior.contexts.${entry.context}`,
                { defaultValue: entry.context },
              );
              const color = CONTEXT_COLORS[entry.context] ?? "#94a3b8";
              return (
                <Box key={entry.context}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.clicks} ({entry.percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={entry.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      "& .MuiLinearProgress-bar": { backgroundColor: color },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        )}
      </ChartCard>
    </Box>
  );
}

export default BehaviorSection;
