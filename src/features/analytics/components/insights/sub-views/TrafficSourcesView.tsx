"use client";
import { Trophy } from "lucide-react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  insightsRankBadgeSx,
  insightsSectionHeadingSx,
  insightsTileSx,
} from "../insightsLayout";

interface TrafficSource {
  source: string;
  clicks: number;
  percentage: number;
  avg_response_time: number;
  avg_session_depth: number;
}

interface TrafficSourcesViewProps {
  sources: TrafficSource[];
}

function safePercent(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

/**
 * Ranked top-5 individual traffic sources with share bars.
 */
export function TrafficSourcesView({ sources }: TrafficSourcesViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const tileSx = insightsTileSx(theme);

  return (
    <Box component="section" sx={{ minWidth: 0, width: "100%" }}>
      <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
        <Trophy size={16} strokeWidth={1.5} />
        {t("insights.traffic.topSources")}
      </Typography>
      <Stack spacing={1.25}>
        {sources.slice(0, 5).map((source, index) => {
          const pct = safePercent(source.percentage);
          const channelColor = theme.palette.primary.main;

          return (
            <Box key={`${source.source}-${index}`} sx={{ ...tileSx, p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.25,
                  mb: 1,
                }}
              >
                <Box sx={insightsRankBadgeSx(theme, index)}>{index + 1}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 0.25,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: index === 0 ? 600 : 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {source.source}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        flexShrink: 0,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {t("insights.traffic.clicksCount", {
                        n: source.clicks,
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("insights.traffic.session", {
                      n: Number(source.avg_session_depth).toFixed(2),
                    })}{" "}
                    · {pct.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: alpha(channelColor, 0.12),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    bgcolor: channelColor,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
