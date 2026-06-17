"use client";
import { Box, Typography, LinearProgress, Stack, Tooltip } from "@mui/material";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Shield, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";
import EnhancedPaper from "@/shared/ui/base/EnhancedPaper";
import {
  INSIGHTS_BLOCK_PAD,
  insightsChartPanelSx,
  insightsSectionHeadingSx,
  insightsTileSx,
} from "./insightsLayout";

const TIER_COLORS: Record<string, string> = {
  organic: "#4caf50",
  suspicious: "#ff9800",
  likely_fraud: "#f44336",
  unknown: "#9e9e9e",
};

const TIER_ORDER = [
  "organic",
  "suspicious",
  "likely_fraud",
  "unknown",
] as const;

export interface TierEntry {
  tier: string;
  clicks: number;
  percentage: number;
  avg_score: number;
}

export interface QualityData {
  avg_quality_score: number | null;
  tier_breakdown: TierEntry[];
  organic_percentage: number;
}

interface Props {
  data?: QualityData;
  /** When true, renders inside the traffic block without a nested paper. */
  embedded?: boolean;
}

function safePercent(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function scorePalette(score: number, theme: Theme) {
  if (score >= 70) return theme.palette.success;
  if (score >= 40) return theme.palette.warning;
  return theme.palette.error;
}

/**
 * Traffic quality tiers (organic / suspicious / fraud) for the traffic analysis block.
 */
export function TrafficQualityChart({ data, embedded = false }: Props) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  if (!data?.tier_breakdown?.length) return null;

  const sortedTiers = [...data.tier_breakdown].sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a.tier as (typeof TIER_ORDER)[number]);
    const bi = TIER_ORDER.indexOf(b.tier as (typeof TIER_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const tileSx = insightsTileSx(theme);
  const panelSx = insightsChartPanelSx(theme);
  const avgScore =
    data.avg_quality_score != null
      ? Math.round(Number(data.avg_quality_score))
      : null;
  const scoreTheme = avgScore != null ? scorePalette(avgScore, theme) : null;
  const organicPct = safePercent(data.organic_percentage);

  const body = (
    <>
      <Typography
        component="div"
        variant="subtitle1"
        sx={insightsSectionHeadingSx}
      >
        <Shield size={16} strokeWidth={1.75} />
        {t("insights.trafficQuality.title")}
        <Tooltip title={t("insights.trafficQuality.tooltipNote")}>
          <InfoOutlinedIcon fontSize="small" color="action" />
        </Tooltip>
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: -0.5, mb: 2, lineHeight: 1.55, maxWidth: 720 }}
      >
        {t("insights.trafficQuality.description")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: 2,
        }}
      >
        {avgScore != null && scoreTheme ? (
          <Box
            sx={{
              ...panelSx,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t("insights.trafficQuality.avgScoreLabel")}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: scoreTheme.main,
                lineHeight: 1.1,
              }}
            >
              {avgScore}
            </Typography>
            <Typography variant="caption" sx={{ color: scoreTheme.main }}>
              {t("insights.trafficQuality.scoreScale")}
            </Typography>
          </Box>
        ) : null}

        <Box
          sx={{
            ...panelSx,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.5,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Leaf size={14} strokeWidth={1.75} color={TIER_COLORS.organic} />
            <Typography variant="caption" color="text.secondary">
              {t("insights.trafficQuality.organicShareLabel")}
            </Typography>
          </Stack>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: TIER_COLORS.organic,
              lineHeight: 1.1,
            }}
          >
            {organicPct.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("insights.trafficQuality.organicShareHint")}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: `repeat(${Math.min(sortedTiers.length, 4)}, minmax(0, 1fr))`,
          },
          gap: 1.5,
        }}
      >
        {sortedTiers.map((entry) => {
          const color = TIER_COLORS[entry.tier] ?? TIER_COLORS.unknown ?? "";
          const label = t(`insights.trafficQuality.tiers.${entry.tier}`, {
            defaultValue: entry.tier,
          });
          const pct = safePercent(entry.percentage);
          const tierScore =
            entry.avg_score != null && Number.isFinite(Number(entry.avg_score))
              ? Math.round(Number(entry.avg_score))
              : null;

          return (
            <Box key={entry.tier} sx={{ ...tileSx, p: 1.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </Stack>
                {tierScore != null ? (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {t("insights.trafficQuality.tierScore", { n: tierScore })}
                  </Typography>
                ) : null}
              </Stack>

              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  mb: 1,
                  bgcolor: alpha(color, 0.15),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    bgcolor: color,
                  },
                }}
              />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
                >
                  {t("insights.traffic.clicksCount", { n: entry.clicks })}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {pct.toFixed(1)}%
                </Typography>
              </Stack>
            </Box>
          );
        })}
      </Box>
    </>
  );

  if (embedded) {
    return (
      <Box component="section" sx={{ width: "100%", minWidth: 0 }}>
        {body}
      </Box>
    );
  }

  return (
    <EnhancedPaper
      animated={false}
      sx={{ borderRadius: `${radiusTokens.lg}px`, height: "100%" }}
    >
      <Box sx={{ p: INSIGHTS_BLOCK_PAD }}>{body}</Box>
    </EnhancedPaper>
  );
}
