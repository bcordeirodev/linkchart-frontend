"use client";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Info, ShieldAlert, Bot } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { SectionLabel } from "@/shared/ui/base";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import type { QualityBreakdown, QualityTier } from "@/types/analytics/audience";

import {
  HorizontalBreakdownBars,
  type HorizontalBreakdownItem,
} from "./HorizontalBreakdownBars";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

/**
 * Fixed colors per quality tier — local to this component, not the shared
 * chart palette (`normal`/`suspicious`/`likely_fraud` isn't a general-purpose
 * series). `suspicious` was green in the original donut, which reads as
 * "safe" for a tier literally named "suspicious" — semantically wrong and
 * flipped to amber here since the fix is fully contained to this array. A
 * proper semantic-color pass across quality/fraud UI (e.g. aligning with
 * `quality_tier` chips elsewhere) is tracked separately and intentionally
 * out of scope for this change.
 */
const TIER_BAR_COLORS: Record<QualityTier, string> = {
  organic: "#1976d2",
  suspicious: "#F59E0B",
  likely_fraud: "#dc004e",
};

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

  const elevation =
    theme.palette.mode === "dark" ? elevationTokens : elevationLightTokens;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: elevation.xs,
    height: "100%",
  };

  const tStr = t as (k: string, opts?: Record<string, unknown>) => string;

  const tierItems: HorizontalBreakdownItem[] = quality.tiers.map((tier) => ({
    key: tier.tier,
    label: tStr(`audience.quality.tiers.${tier.tier}`),
    value: tier.clicks,
    percentage: tier.percentage,
    color: TIER_BAR_COLORS[tier.tier] ?? theme.palette.grey[500],
  }));

  const fingerprintColor =
    quality.avg_fingerprint_score < 1.0
      ? "success"
      : quality.avg_fingerprint_score < 2.0
        ? "warning"
        : "error";

  const botRateCard = (
    <Card sx={{ ...cardSx, minHeight: 120 }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          height: "100%",
        }}
      >
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
      </CardContent>
    </Card>
  );

  const fingerprintCard = (
    <Card sx={{ ...cardSx, minHeight: 120 }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
          height: "100%",
        }}
      >
        <Box sx={{ textAlign: "center", minWidth: 80 }}>
          <ShieldAlert {...ICON_MD} style={{ marginBottom: 4 }} />
          <Typography
            variant="h4"
            color={`${fingerprintColor}.main`}
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
          <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
            {[0, 1, 2].map((i) => (
              <LinearProgress
                key={i}
                variant="determinate"
                value={quality.avg_fingerprint_score > i ? 100 : 0}
                color={i === 0 ? "success" : i === 1 ? "warning" : "error"}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
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
