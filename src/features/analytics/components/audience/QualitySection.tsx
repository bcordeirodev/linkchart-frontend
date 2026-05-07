"use client";
import {
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
import { ShieldCheck, ShieldAlert, Bot } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import type { QualityBreakdown } from "@/types/analytics/audience";

const TIER_COLORS: Record<string, string> = {
  organic: "#22c55e",
  suspicious: "#f59e0b",
  likely_fraud: "#ef4444",
};

interface QualitySectionProps {
  quality: QualityBreakdown;
}

export function QualitySection({ quality }: QualitySectionProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
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
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t("audience.quality.title")}
      </Typography>

      <Grid container spacing={2}>
        {/* Donut quality_tier */}
        <Grid item xs={12} md={5}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <ShieldCheck {...ICON_MD} />
                {t("audience.quality.distribution")}
              </Typography>
              {quality.tiers.length > 0 ? (
                <ApexChartWrapper
                  type="donut"
                  size="standard"
                  {...formatPieChart(tierChartData, "name", "value", isDark)}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
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
            </CardContent>
          </Card>
        </Grid>

        {/* Bot rate */}
        <Grid item xs={12} sm={6} md={3.5}>
          <Card sx={cardSx}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Bot {...ICON_MD} />
                {t("audience.quality.botRate")}
              </Typography>
              <Typography variant="h3" color="error" sx={{ fontWeight: 700 }}>
                {quality.bot_percentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("audience.quality.botRateSubtitle")}
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
            </CardContent>
          </Card>
        </Grid>

        {/* Fingerprint score */}
        <Grid item xs={12} sm={6} md={3.5}>
          <Card sx={cardSx}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <ShieldAlert {...ICON_MD} />
                <Tooltip title={t("audience.quality.fingerprintScale")} arrow>
                  <span>{t("audience.quality.fingerprint")}</span>
                </Tooltip>
              </Typography>
              <Typography
                variant="h3"
                color={`${fingerprintColor}.main`}
                sx={{ fontWeight: 700 }}
              >
                {quality.avg_fingerprint_score.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("audience.quality.fingerprintSubtitle")}
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                sx={{ mt: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <LinearProgress
                    key={i}
                    variant="determinate"
                    value={quality.avg_fingerprint_score > i ? 100 : 0}
                    color={i === 0 ? "success" : i === 1 ? "warning" : "error"}
                    sx={{ width: 24, height: 6, borderRadius: 3 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default QualitySection;
