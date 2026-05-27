"use client";
import { Activity, Lightbulb, TrendingUp, Target, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

/**
 * A strategic recommendation from the traffic source analysis.
 *
 * `message_key` is an i18n key translated via `t(rec.message_key)`.
 */
interface TrafficRecommendation {
  type: "optimization" | "growth" | "diversification";
  /** i18n key for the recommendation text — use `t(message_key)` to display. */
  message_key: string;
  priority: "high" | "medium" | "low";
}

interface NavigationContextEntry {
  context: string;
  clicks: number;
  percentage: number;
}

interface TrafficContextViewProps {
  /** Navigation context breakdown (may be undefined or empty). */
  navigationContext?: NavigationContextEntry[];
  /** Strategic recommendations list (may be empty). */
  recommendations: TrafficRecommendation[];
}

/**
 * Renders the Context sub-view of TrafficSourceChart.
 *
 * Shows the navigation context breakdown (direct, referral, social, etc.)
 * as labelled progress bars, followed by strategic recommendations.
 */
export function TrafficContextView({
  navigationContext,
  recommendations,
}: TrafficContextViewProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");

  /** Returns the MUI colour token for a given recommendation priority. */
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

  /** Returns the icon node for a given recommendation type. */
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

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow:
      theme.palette.mode === "dark"
        ? elevationTokens.xs
        : elevationLightTokens.xs,
  };

  return (
    <>
      {/* Contexto de Navegação */}
      {navigationContext && navigationContext.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Activity size={16} strokeWidth={1.5} />
                {t("insights.traffic.navigationContext")}
              </Typography>
              <Stack spacing={1.5}>
                {navigationContext.map((entry) => (
                  <Box key={entry.context}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={
                            t(
                              `insights.traffic.contextLabels.${entry.context}` as any,
                            ) || entry.context
                          }
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {entry.clicks} ({Number(entry.percentage).toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Number(entry.percentage)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <Lightbulb size={16} strokeWidth={1.5} />
                {t("insights.traffic.strategicRecs")}
              </Typography>
              <Stack spacing={2}>
                {recommendations.map((rec, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: `${radiusTokens.md}px`,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "primary.main",
                          mt: 0.5,
                        }}
                      >
                        {getRecommendationIcon(rec.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Chip
                            label={rec.priority.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(rec.priority),
                              color: "white",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              height: 20,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {rec.type}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {t(rec.message_key as any)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}
