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
import type { QualityBreakdown } from "@/types/analytics/audience";
import { getPhaseDataChipSx } from "./phaseDataChipSx";

const TIER_COLORS: Record<string, string> = {
  organic: "#22c55e",
  suspicious: "#f59e0b",
  likely_fraud: "#ef4444",
};

interface QualitySectionProps {
  quality: QualityBreakdown;
}

/**
 * Traffic-quality section of the Audience tab: tier distribution donut,
 * bot-rate stat card and fingerprint-consistency stat card.
 */
export function QualitySection({ quality }: QualitySectionProps) {
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

  return (
    <Box>
      <SectionDivider title={t("audience.quality.title")} />

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
        {/* Donut quality_tier */}
        <Grid item xs={12} md={5}>
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
              {quality.tiers.map((tier) => (
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
                        bgcolor: TIER_COLORS[tier.tier] ?? "#94a3b8",
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

        {/* Bot rate + Fingerprint — stacked in right column */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            {/* Bot rate */}
            <Card sx={{ ...cardSx, height: "50%", minHeight: 120 }}>
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
                    color={
                      quality.bot_percentage > 5 ? "error" : "text.primary"
                    }
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

            {/* Fingerprint score */}
            <Card sx={{ ...cardSx, height: "50%", minHeight: 120 }}>
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
                    <Tooltip
                      title={t("audience.quality.fingerprintScale")}
                      arrow
                    >
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
                        color={
                          i === 0 ? "success" : i === 1 ? "warning" : "error"
                        }
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default QualitySection;
