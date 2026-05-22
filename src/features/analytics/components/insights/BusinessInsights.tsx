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
  Briefcase,
  Lightbulb,
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
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { useTheme } from "@mui/material/styles";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

interface BusinessInsight {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

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
 * array is empty an info Alert is shown instead. An auto-summary Alert is
 * rendered below the list when at least one card is visible.
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

  if (!insights || insights.length === 0) {
    return (
      <Alert
        severity="info"
        sx={{
          m: 2,
          borderRadius: `${radiusTokens.lg}px`,
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
          },
        }}
      >
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
    const iconMap = {
      geographic: <MapPin {...ICON_MD} />,
      audience: <MonitorSmartphone {...ICON_MD} />,
      temporal: <TrendingUp {...ICON_MD} />,
      performance: <BarChart3 {...ICON_MD} />,
      business: <Briefcase {...ICON_MD} />,
      schedule: <Clock {...ICON_MD} />,
    };
    return iconMap[type as keyof typeof iconMap] || <Info {...ICON_MD} />;
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

  // Organizar insights por prioridade e categoria
  const organizedInsights = [...insights]
    .sort((a, b) => {
      // Primeiro por prioridade
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Depois por categoria
      const categoryOrder = {
        security: 10,
        performance: 9,
        geographic: 8,
        engagement: 7,
        growth: 6,
        optimization: 5,
        audience: 4,
        temporal: 3,
        conversion: 2,
        business: 1,
      };
      return (
        (categoryOrder[b.type as keyof typeof categoryOrder] || 0) -
        (categoryOrder[a.type as keyof typeof categoryOrder] || 0)
      );
    })
    .slice(0, maxItems);

  return (
    <Box sx={{ mt: 2 }}>
      {showTitle ? (
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 3,
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

      {/* Insights organizados por categoria */}
      <Stack spacing={3}>
        {organizedInsights.map((insight, index) => {
          const palette = getPriorityPalette(insight.priority);
          const prevInsight = organizedInsights[index - 1];
          const showCategoryDivider =
            index > 0 && prevInsight && prevInsight.type !== insight.type;

          return (
            <Box key={index}>
              {/* Divisor de categoria */}
              {showCategoryDivider ? (
                <Box sx={{ mb: 2, mt: 1 }}>
                  <Divider
                    sx={{
                      borderColor: "divider",
                      "&::before, &::after": {
                        borderColor: "divider",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        px: 2,
                        color: "text.secondary",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {t(`filters.insightTypeOptions.${insight.type}`, {
                        defaultValue:
                          insight.type.charAt(0).toUpperCase() +
                          insight.type.slice(1),
                      })}
                    </Typography>
                  </Divider>
                </Box>
              ) : null}

              <Card
                sx={{
                  borderRadius: `${radiusTokens.lg}px`,
                  backgroundColor: "background.paper",
                  border: `1px solid`,
                  borderColor: "divider",
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
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    {/* Ícone representativo */}
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: palette.main,
                        color: palette.contrastText,
                        borderRadius: `${radiusTokens.md}px`,
                      }}
                    >
                      {getInsightIcon(insight.type)}
                    </Avatar>

                    {/* Conteúdo principal */}
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
                          {insight.title}
                        </Typography>

                        {/* Badge de prioridade padronizado */}
                        <Chip
                          icon={getPriorityIcon(insight.priority)}
                          label={insight.priority.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: palette.main,
                            color: palette.contrastText,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            "& .MuiChip-icon": {
                              color: palette.contrastText,
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
                          mb: 2,
                        }}
                      >
                        {insight.description}
                      </Typography>

                      {/* Categoria com divisória sutil */}
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

      {/* Resumo dos insights */}
      {organizedInsights.length > 0 && (
        <Alert
          severity="success"
          sx={{
            mt: 3,
            borderRadius: `${radiusTokens.lg}px`,
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
            }}
          >
            {t("insights.autoSummary", { count: organizedInsights.length })}
          </Typography>
        </Alert>
      )}

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
              variant="h6"
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

            {/* Destaque HTTP/2 */}
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
