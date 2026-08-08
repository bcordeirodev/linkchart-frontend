"use client";
import { Alert, Box, Chip, Grid, Tooltip, Typography } from "@mui/material";
import { Info, ShieldAlert, Bot } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import { resolveDataVizCategorical } from "@/lib/theme/dataViz";
import { SectionLabel } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { QualityBreakdown, QualityTier } from "@/types/analytics/audience";
import type { Theme } from "@mui/material/styles";

import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "./HorizontalBreakdownBars";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

/**
 * Resolves the fixed fill color for each quality tier's bar from theme
 * tokens instead of local hex values.
 *
 * `organic` reuses the first dataviz categorical hue — this row is the
 * traffic-mix breakdown, not itself a pass/fail signal, so it keeps the
 * "series 1" identity every other chart's first category uses.
 * `suspicious`/`likely_fraud` are genuine severity levels, so they map to
 * the theme's `warning`/`error` tokens: `suspicious` used to render green in
 * the original donut, which read as "safe" for a tier literally named
 * "suspicious" — semantically backwards. Warning/error keep it aligned with
 * every other severity surface in the app instead of a component-local
 * palette.
 *
 * @param theme - active MUI theme, read for the `warning`/`error` tokens.
 * @returns a color per {@link QualityTier}.
 */
function getTierBarColors(theme: Theme): Record<QualityTier, string> {
  return {
    organic: resolveDataVizCategorical(theme.palette.mode)[0],
    suspicious: theme.palette.warning.main,
    likely_fraud: theme.palette.error.main,
  };
}

interface QualitySectionProps {
  quality: QualityBreakdown;
  /**
   * Whether to render the section heading. Defaults to `true`; pass `false`
   * when the section lives inside the Quality sub-tab, whose tab label
   * already names it.
   */
  showTitle?: boolean;
}

/**
 * Traffic-quality section of the Audience tab: a single horizontal-bar
 * breakdown of the organic/suspicious/fraud tiers, plus bot-rate and
 * fingerprint-consistency stat cards.
 *
 * The ISP connection-type breakdown that used to render alongside these
 * (via `ConnectionTypeCard`) has moved to the "Detalhes técnicos" accordion
 * — it's engineering-only data, not part of the at-a-glance quality read.
 */
export function QualitySection({
  quality,
  showTitle = true,
}: QualitySectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const tStr = t as (k: string, opts?: Record<string, unknown>) => string;

  const tierBarColors = getTierBarColors(theme);
  const tierItems: HorizontalBreakdownItem[] = quality.tiers.map((tier) => ({
    key: tier.tier,
    label: tStr(`audience.quality.tiers.${tier.tier}`),
    value: tier.clicks,
    percentage: tier.percentage,
    color: tierBarColors[tier.tier] ?? theme.palette.grey[500],
  }));

  // Binary read instead of the old 3-tier gauge: either the fingerprint is
  // fully consistent across a click's headers (0) or it isn't (> 0) — see
  // the "Header Consistency" chip below.
  const hasInconsistencies = quality.avg_fingerprint_score > 0;

  const botRateCard = (
    <ChartCard sx={{ minHeight: 120 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ textAlign: "center", minWidth: 80 }}>
          <Bot {...ICON_MD} style={{ marginBottom: 4 }} />
          <Typography
            variant="h4"
            color={quality.bot_percentage > 5 ? "error" : "text.primary"}
            sx={{ fontWeight: 700, lineHeight: 1 }}
          >
            {quality.bot_percentage.toFixed(1)}%
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t("audience.quality.botRate")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("audience.quality.botRateSubtitle")}
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 0.5, display: "block" }}
          >
            {tStr("audience.quality.botClicksDetected", {
              count: quality.bot_clicks,
            })}
          </Typography>
          {quality.bot_percentage > 5 && (
            <Chip
              label={tStr("audience.quality.botAlert", {
                count: quality.bot_clicks,
              })}
              color="error"
              size="small"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>
    </ChartCard>
  );

  const fingerprintCard = (
    <ChartCard sx={{ minHeight: 120 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box sx={{ textAlign: "center", minWidth: 80 }}>
          <ShieldAlert {...ICON_MD} style={{ marginBottom: 4 }} />
          <Typography
            variant="h4"
            color={hasInconsistencies ? "warning.main" : "success.main"}
            sx={{ fontWeight: 700, lineHeight: 1 }}
          >
            {quality.avg_fingerprint_score.toFixed(1)}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            <Tooltip title={t("audience.quality.fingerprintScale")} arrow>
              <span>{t("audience.quality.fingerprint")}</span>
            </Tooltip>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("audience.quality.fingerprintSubtitle")}
          </Typography>
          <Chip
            label={
              hasInconsistencies
                ? t("quality.headerConsistencyWarn")
                : t("quality.headerConsistencyOk")
            }
            color={hasInconsistencies ? "warning" : "success"}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
    </ChartCard>
  );

  return (
    <Box>
      {showTitle ? (
        <Box sx={{ mb: 2 }}>
          <SectionLabel headingLevel={2}>
            {t("audience.quality.title")}
          </SectionLabel>
        </Box>
      ) : null}

      {"phase_available" in quality && !quality.phase_available && (
        <Alert
          severity="info"
          icon={<Info size={16} />}
          sx={{ mb: 2, borderRadius: `${radiusTokens.lg}px` }}
        >
          <Chip
            label={tStr("audience.phaseData.unavailable")}
            size="small"
            variant="filled"
            sx={getPhaseDataChipSx(theme)}
          />
        </Alert>
      )}

      <ChartCard
        title={t("audience.quality.distribution")}
        subtitle={t("audience.quality.description")}
      >
        {tierItems.length > 0 ? (
          <HorizontalBreakdownBars items={tierItems} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t("audience.noData")}
          </Typography>
        )}
      </ChartCard>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={12} md={6}>
          {botRateCard}
        </Grid>
        <Grid item xs={12} md={6}>
          {fingerprintCard}
        </Grid>
      </Grid>
    </Box>
  );
}

export default QualitySection;
