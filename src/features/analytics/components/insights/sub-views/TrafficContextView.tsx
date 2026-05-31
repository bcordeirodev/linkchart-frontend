"use client";
import { Activity, Lightbulb, TrendingUp, Target, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Box, Typography, Chip, Stack, LinearProgress } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { insightsSectionHeadingSx, insightsTileSx } from "../insightsLayout";
import type {
  NavigationContextEntry,
  TrafficRecommendation,
} from "../../../hooks/useInsightsData";

interface TrafficContextViewProps {
  navigationContext?: NavigationContextEntry[];
  recommendations: TrafficRecommendation[];
  /** Which block to render — split by parent layout. */
  mode?: "all" | "navigation" | "recommendations";
}

function safePercent(value: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

/**
 * Navigation context bars and/or strategic recommendation cards.
 */
export function TrafficContextView({
  navigationContext,
  recommendations,
  mode = "all",
}: TrafficContextViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  const showNavigation =
    (mode === "all" || mode === "navigation") && !!navigationContext?.length;
  const showRecommendations =
    (mode === "all" || mode === "recommendations") &&
    recommendations.length > 0;

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getRecommendationIcon = (type: string): ReactNode => {
    switch (type) {
      case "optimization":
        return <Wrench size={16} strokeWidth={1.5} />;
      case "growth":
        return <TrendingUp size={16} strokeWidth={1.5} />;
      case "diversification":
        return <Target size={16} strokeWidth={1.5} />;
      default:
        return <Lightbulb size={16} strokeWidth={1.5} />;
    }
  };

  const tileSx = insightsTileSx(theme);

  return (
    <>
      {showNavigation ? (
        <Box component="section" sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
            <Activity size={16} strokeWidth={1.5} />
            {t("insights.traffic.navigationContext")}
          </Typography>
          <Stack spacing={1.5}>
            {navigationContext!.map((entry) => {
              const pct = safePercent(entry.percentage);
              const barColor = theme.palette.info.main;

              return (
                <Box key={entry.context}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Chip
                      label={
                        t(
                          `insights.traffic.contextLabels.${entry.context}` as "insights.traffic.contextLabels.browser_direct",
                        ) || entry.context
                      }
                      size="small"
                      variant="outlined"
                      sx={{ maxWidth: "70%" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}
                    >
                      {t("insights.traffic.contextClicks", {
                        n: entry.clicks,
                        pct: pct.toFixed(1),
                      })}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(barColor, 0.12),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                        bgcolor: barColor,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      ) : null}

      {showRecommendations ? (
        <Box component="section">
          <Typography variant="subtitle1" sx={insightsSectionHeadingSx}>
            <Lightbulb size={16} strokeWidth={1.5} />
            {t("insights.traffic.strategicRecs")}
          </Typography>
          <Stack spacing={1.25}>
            {recommendations.map((rec, index) => {
              const priorityColor = getPriorityColor(rec.priority);

              return (
                <Box
                  key={`${rec.type}-${rec.message_key}-${index}`}
                  sx={{
                    ...tileSx,
                    borderLeft: `3px solid ${priorityColor}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "primary.main",
                        mt: 0.25,
                        flexShrink: 0,
                      }}
                    >
                      {getRecommendationIcon(rec.type)}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ mb: 0.75, flexWrap: "wrap" }}
                      >
                        <Chip
                          label={rec.priority.toUpperCase()}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            bgcolor: priorityColor,
                            color: theme.palette.getContrastText(priorityColor),
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {t(`insights.traffic.recTypes.${rec.type}`, {
                            defaultValue: rec.type,
                          })}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {t(rec.message_key as any)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      ) : null}
    </>
  );
}
