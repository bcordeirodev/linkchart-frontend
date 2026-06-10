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
import { Info, ShieldCheck, ShieldAlert, Bot } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import { SectionDivider } from "@/shared/ui/SectionDivider";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import type {
  ConnectionTypeBreakdown,
  QualityBreakdown,
} from "@/types/analytics/audience";
import { ConnectionTypeCard } from "./ConnectionTypeCard";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

/**
 * First slice colors of `formatPieChart` — keeps the tier legend dots in
 * sync with the donut slices rendered above them.
 */
const TIER_DONUT_COLORS = ["#1976d2", "#2e7d32", "#dc004e"];

interface QualitySectionProps {
  quality: QualityBreakdown;
  /**
   * ISP connection type distribution. When provided, the section renders a
   * balanced 2×2 grid: quality donut + connection donut on the first row,
   * bot-rate + fingerprint stat cards on the second.
   */
  connectionBreakdown?: ConnectionTypeBreakdown;
  /**
   * Whether to render the section heading. Defaults to `true`; pass `false`
   * when the section lives inside the Quality sub-tab, whose tab label
   * already names it.
   */
  showTitle?: boolean;
}

/**
 * Traffic-quality section of the Audience tab: tier distribution donut,
 * optional ISP connection donut, bot-rate stat card and
 * fingerprint-consistency stat card — laid out in equal-width columns.
 */
export function QualitySection({
  quality,
  connectionBreakdown,
  showTitle = true,
}: QualitySectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: elevation.xs,
    height: "100%",
  };

  const tStr = t as (k: string, opts?: Record<string, unknown>) => string;

  const tierChartData = quality.tiers.map((tier) => ({
    name: tStr(`audience.quality.tiers.${tier.tier}`),
    value: tier.clicks,
    percentage: tier.percentage,
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
        <SectionDivider title={t("audience.quality.title")} />
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

      <Grid container spacing={2}>
        {/* Row 1 — quality tier donut + ISP connection donut, equal widths */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title={t("audience.quality.distribution")}
            subtitle={t("audience.quality.description")}
            icon={<ShieldCheck {...ICON_MD} />}
          >
            {quality.tiers.length > 0 ? (
              <ApexChartWrapper
                type="donut"
                size="compact"
                {...formatPieChart(tierChartData, "name", "value", isDark)}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t("audience.noData")}
              </Typography>
            )}
            <Stack spacing={1} sx={{ mt: 1 }}>
              {quality.tiers.map((tier, index) => (
                <Box
                  key={tier.tier}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: TIER_DONUT_COLORS[index] ?? "#94a3b8",
                      }}
                    />
                    <Typography variant="caption">
                      {tStr(`audience.quality.tiers.${tier.tier}`)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {tier.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </ChartCard>
        </Grid>

        {connectionBreakdown ? (
          <>
            <Grid item xs={12} md={6}>
              <ConnectionTypeCard breakdown={connectionBreakdown} />
            </Grid>

            {/* Row 2 — bot rate + fingerprint stat cards, equal widths */}
            <Grid item xs={12} md={6}>
              {botRateCard}
            </Grid>
            <Grid item xs={12} md={6}>
              {fingerprintCard}
            </Grid>
          </>
        ) : (
          <Grid item xs={12} md={6}>
            <Stack spacing={2} sx={{ height: "100%" }}>
              <Box sx={{ flex: 1, minHeight: 120 }}>{botRateCard}</Box>
              <Box sx={{ flex: 1, minHeight: 120 }}>{fingerprintCard}</Box>
            </Stack>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default QualitySection;
