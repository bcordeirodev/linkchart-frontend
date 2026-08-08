"use client";
import { Alert, Box, Chip, Stack, Typography } from "@mui/material";
import { Info } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { tDynamic } from "@/lib/i18n/tDynamic";
import { radiusTokens } from "@/lib/theme/designSystem";
import { dataVizCategorical } from "@/lib/theme/dataViz";
import { formatHorizontalStackedBar } from "@/features/analytics/utils/chartFormatters";
import { formatAnalyticsLabel } from "@/features/analytics/utils/displayLabels";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { ICON_MD } from "@/lib/theme/iconDefaults";
import type { PlatformBreakdown } from "@/types/analytics/audience";

import { getPhaseDataChipSx } from "./phaseDataChipSx";
import { normaliseBreakdown } from "./normaliseBreakdown";

/**
 * Height cap for the single-row stacked bar below — a horizontal stacked
 * bar is one line of segments plus its legend, not a chart that needs
 * hundreds of pixels of vertical room (spec: "barra horizontal empilhada
 * única … altura do chart ≤ 120px").
 */
const STACKED_BAR_HEIGHT = 110;

/**
 * Colors for the two-row "mobile vs. desktop" Client-Hint signal below the
 * main platform bar. Previously a hardcoded blue/green pair — green reads as
 * "success" everywhere else in the app, which is wrong for what is just the
 * second of two traffic categories, not a pass/fail state. Sourced from
 * `dataVizCategorical` instead so the pair reads as two categories, matching
 * every other multi-category breakdown on the page.
 */
const CH_MOBILE_COLORS: Record<"mobile" | "not_mobile", string> = {
  mobile: dataVizCategorical[0],
  not_mobile: dataVizCategorical[1],
};

/** Entry in the platform breakdown array returned by the audience API. */
interface PlatformEntry {
  platform: string;
  clicks: number;
  percentage: number;
}

interface PlatformBreakdownCardProps {
  /**
   * Platform distribution data from `audience.platform_breakdown`.
   * Accepts both the new phase-aware shape and the legacy flat array.
   */
  breakdown: PlatformBreakdown | PlatformEntry[];
}

/**
 * Horizontal stacked bar of the operating platform detected via Client Hints
 * (Sec-CH-UA-Platform, Phase 1), with the companion `ch_is_mobile` signal
 * when available. Lives in the Systems sub-tab, complementing the
 * user-agent-derived OS list.
 */
export function PlatformBreakdownCard({
  breakdown,
}: PlatformBreakdownCardProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const platform = normaliseBreakdown<PlatformEntry>(breakdown);

  // ch_mobile_breakdown only exists on the new phase-aware shape
  const chMobile =
    !Array.isArray(breakdown) && "ch_mobile_breakdown" in breakdown
      ? breakdown.ch_mobile_breakdown
      : null;

  if (platform.data.length === 0) return null;

  const chartData = platform.data.map((p) => ({
    name: formatAnalyticsLabel(p.platform),
    value: p.clicks,
  }));

  return (
    <ChartCard
      title={t("audience.extraCharts.platform")}
      subtitle={t("audience.extraCharts.platformDescription")}
    >
      {!platform.phaseAvailable && (
        <Alert
          severity="info"
          icon={<Info {...ICON_MD} />}
          sx={{ mb: 1.5, borderRadius: `${radiusTokens.md}px` }}
        >
          {t("audience.phaseData.unavailable")}
        </Alert>
      )}
      <ApexChartWrapper
        type="bar"
        height={STACKED_BAR_HEIGHT}
        {...formatHorizontalStackedBar(chartData, "name", "value")}
      />

      {/* ch_is_mobile companion signal */}
      {chMobile && chMobile.phase1_available && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, display: "block", mb: 1 }}
          >
            {t("audience.chMobile.title")}
          </Typography>
          <Stack spacing={0.5}>
            {[
              {
                key: "mobile" as const,
                count: chMobile.mobile,
                total: chMobile.mobile + chMobile.not_mobile,
                color: CH_MOBILE_COLORS.mobile,
              },
              {
                key: "not_mobile" as const,
                count: chMobile.not_mobile,
                total: chMobile.mobile + chMobile.not_mobile,
                color: CH_MOBILE_COLORS.not_mobile,
              },
            ].map(({ key, count, total, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <Box key={key}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.25,
                    }}
                  >
                    <Typography variant="caption">
                      {tDynamic(t, `audience.chMobile.${key}`)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pct}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pct}%`,
                        height: "100%",
                        bgcolor: color,
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* phase1 not available for ch_mobile */}
      {chMobile && !chMobile.phase1_available && (
        <Box sx={{ mt: 1.5 }}>
          <Chip
            label={t("audience.phaseData.unavailable")}
            size="small"
            variant="filled"
            sx={getPhaseDataChipSx(theme)}
          />
        </Box>
      )}
    </ChartCard>
  );
}

export default PlatformBreakdownCard;
