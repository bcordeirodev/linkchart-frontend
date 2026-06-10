"use client";
import {
  TrendingUp,
  MonitorSmartphone,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  Lightbulb,
  Repeat2,
  Globe,
  Activity,
  Wrench,
} from "lucide-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Stack,
  Divider,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import type { BusinessInsight } from "../../hooks/useInsightsData";

interface HttpProtocolEntry {
  protocol: string;
  clicks: number;
  percentage: number;
}

/** Props accepted by the {@link BusinessInsights} component. */
interface BusinessInsightsProps {
  /** Array of insight objects to render. */
  insights: BusinessInsight[];
  /** When `true`, renders the "Business Insights" section title. Defaults to `true`. */
  showTitle?: boolean;
  /** Maximum number of insight cards to display. Defaults to `20`. */
  maxItems?: number;
  /** Optional HTTP protocol breakdown entries rendered as a bar chart at the bottom. */
  httpProtocol?: HttpProtocolEntry[];
}

/**
 * Renders AI-generated business insights as priority-sorted cards.
 *
 * Displays each insight with a colour-coded priority badge (high/medium/low),
 * a category icon, and optional HTTP protocol usage bars. When the `insights`
 * array is empty an info Alert is shown instead.
 */
export function BusinessInsights({
  insights,
  showTitle = true,
  maxItems = 20,
  httpProtocol,
}: BusinessInsightsProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  /**
   * Resolves insight text by preferring an i18n key (with optional interpolation
   * params) over the raw fallback string. Returns an empty string when both are
   * absent.
   *
   * When `params` contains a `bench_key` entry, its value is treated as a
   * nested translation key whose result is substituted as `bench` in the
   * interpolation map. This enables the retention generator's benchmark label
   * to be fully localised without special-casing the generator on the backend.
   *
   * @param key - Optional i18next translation key.
   * @param params - Optional interpolation variables for the key.
   * @param fallback - Raw string to use when no key is provided.
   */
  const resolveText = (
    key?: string,
    params?: Record<string, string | number>,
    fallback?: string,
  ): string => {
    if (key) {
      let resolved: Record<string, string | number> = { ...(params ?? {}) };
      if (resolved.bench_key && typeof resolved.bench_key === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolved = { ...resolved, bench: t(resolved.bench_key as any) };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return t(key as any, resolved);
    }
    return fallback ?? "";
  };

  if (!insights || insights.length === 0) {
    return (
      <Alert
        severity="info"
        sx={{
          borderRadius: `${radiusTokens.lg}px`,
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BarChart3 size={16} strokeWidth={1.5} />
          {t("insights.unavailableTitle")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("insights.unavailableDesc")}
        </Typography>
      </Alert>
    );
  }

  const getInsightIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      geographic: <MapPin {...ICON_MD} />,
      audience: <MonitorSmartphone {...ICON_MD} />,
      temporal: <Clock {...ICON_MD} />,
      performance: <BarChart3 {...ICON_MD} />,
      security: <AlertCircle {...ICON_MD} />,
      retention: <Repeat2 {...ICON_MD} />,
      traffic_source: <Globe {...ICON_MD} />,
      engagement: <Activity {...ICON_MD} />,
      conversion: <TrendingUp {...ICON_MD} />,
      optimization: <Wrench {...ICON_MD} />,
    };
    return iconMap[type] ?? <Info {...ICON_MD} />;
  };

  const getPriorityPalette = (priority: string) => {
    const palette = {
      high: theme.palette.error,
      medium: theme.palette.warning,
      low: theme.palette.success,
    };
    return palette[priority as keyof typeof palette] || palette.low;
  };

  const getPriorityIcon = (priority: string) => {
    const iconMap = {
      high: <AlertCircle {...ICON_MD} />,
      medium: <Info {...ICON_MD} />,
      low: <CheckCircle {...ICON_MD} />,
    };
    return iconMap[priority as keyof typeof iconMap] || <Info {...ICON_MD} />;
  };

  const organizedInsights = [...insights]
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      const categoryOrder: Record<string, number> = {
        security: 10,
        performance: 9,
        geographic: 8,
        engagement: 7,
        retention: 7,
        traffic_source: 6,
        optimization: 5,
        audience: 4,
        temporal: 3,
        conversion: 2,
        business: 1,
      };
      return (categoryOrder[b.type] || 0) - (categoryOrder[a.type] || 0);
    })
    .slice(0, maxItems);

  return (
    <Box>
      {showTitle ? (
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Lightbulb size={16} strokeWidth={1.5} />
          {t("insights.title")}
        </Typography>
      ) : null}

      <Stack spacing={2}>
        {organizedInsights.map((insight, index) => {
          const palette = getPriorityPalette(insight.priority);

          const recommendationText = resolveText(
            insight.recommendation_key,
            insight.recommendation_params,
            insight.recommendation,
          );

          return (
            <Box key={index}>
              <Card
                sx={{
                  borderRadius: `${radiusTokens.lg}px`,
                  backgroundColor: "background.paper",
                  border: `1px solid`,
                  borderColor: "divider",
                  borderLeft: `3px solid ${palette.main}`,
                  boxShadow: isDark
                    ? elevationTokens.xs
                    : elevationLightTokens.xs,
                  transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
                  "&:hover": {
                    boxShadow: isDark
                      ? elevationTokens.sm
                      : elevationLightTokens.sm,
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: alpha(palette.main, 0.12),
                        color: palette.main,
                        borderRadius: `${radiusTokens.md}px`,
                      }}
                    >
                      {getInsightIcon(insight.type)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        >
                          {resolveText(
                            insight.title_key,
                            insight.title_params,
                            insight.title,
                          )}
                        </Typography>

                        <Chip
                          icon={getPriorityIcon(insight.priority)}
                          label={insight.priority.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: alpha(palette.main, 0.12),
                            color: palette.main,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            border: `1px solid ${alpha(palette.main, 0.3)}`,
                            "& .MuiChip-icon": {
                              color: palette.main,
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.6,
                          color: "text.secondary",
                          mb: recommendationText ? 1.5 : 2,
                        }}
                      >
                        {resolveText(
                          insight.description_key,
                          insight.description_params,
                          insight.description,
                        )}
                      </Typography>

                      {recommendationText ? (
                        <Box
                          sx={{
                            bgcolor: alpha(palette.main, 0.06),
                            borderLeft: `3px solid ${palette.main}`,
                            borderRadius: `${radiusTokens.md}px`,
                            p: 1.5,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: palette.dark ?? palette.main,
                            }}
                          >
                            {recommendationText}
                          </Typography>
                        </Box>
                      ) : null}

                      <Divider sx={{ my: 1 }} />

                      <Typography
                        variant="caption"
                        sx={{
                          color: palette.main,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <TrendingUp size={12} strokeWidth={1.5} />
                        {t(`filters.insightTypeOptions.${insight.type}`, {
                          defaultValue:
                            insight.type.charAt(0).toUpperCase() +
                            insight.type.slice(1),
                        })}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Stack>

      {/* Protocolo HTTP */}
      {httpProtocol && httpProtocol.length > 0 ? (
        <Card
          sx={{
            mt: 3,
            borderRadius: `${radiusTokens.lg}px`,
            backgroundColor: "background.paper",
            border: `1px solid`,
            borderColor: "divider",
            boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <BarChart3 size={16} strokeWidth={1.5} />
              {t("insights.httpProtocolTitle")}
            </Typography>

            {(() => {
              const http2 = httpProtocol.find(
                (e) =>
                  e.protocol === "HTTP/2" ||
                  e.protocol === "h2" ||
                  e.protocol === "http2",
              );
              return http2 ? (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={t("insights.http2Connections", {
                      percent: Number(http2.percentage).toFixed(1),
                    })}
                    color="success"
                    variant="filled"
                    size="small"
                  />
                </Box>
              ) : null;
            })()}

            <Stack spacing={1.5}>
              {httpProtocol.map((entry) => (
                <Box key={entry.protocol}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {entry.protocol}
                    </Typography>
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
      ) : null}
    </Box>
  );
}

export default BusinessInsights;
