"use client";
import {
  MonitorSmartphone,
  AppWindow,
  Cpu,
  Clock,
  TrendingUp,
  Repeat,
} from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import { formatPieChart } from "@/features/analytics/utils/chartFormatters";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AudienceData = Record<string, any>;

interface AudienceMetricsProps {
  data?: AudienceData;
  showTitle?: boolean;
  title?: string;
}

export function AudienceMetrics({
  data,
  showTitle = false,
  title,
}: AudienceMetricsProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const deviceTypes = data?.audience?.device_breakdown?.length || 0;
  const browserTypes = data?.audience?.browser_breakdown?.length || 0;
  const osTypes = data?.audience?.os_breakdown?.length || 0;
  const totalAudienceClicks =
    data?.audience?.device_breakdown?.reduce(
      (sum: number, device: AudienceData) => sum + (device.clicks || 0),
      0,
    ) || 0;

  const displayTitle = title ?? t("audience.metrics.title");

  const metrics = [
    {
      id: "device_types",
      title: t("audience.metrics.deviceTypes"),
      value: deviceTypes.toString(),
      icon: <MonitorSmartphone {...ICON_LG} />,
      color: "primary" as const,
      subtitle: t("audience.metrics.uniqueDevices"),
    },
    {
      id: "browser_types",
      title: t("audience.metrics.browsers"),
      value: browserTypes.toString(),
      icon: <AppWindow {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("audience.metrics.differentBrowsers"),
    },
    {
      id: "os_types",
      title: t("audience.metrics.operatingSystems"),
      value: osTypes.toString(),
      icon: <Cpu {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("audience.metrics.differentOS"),
    },
    {
      id: "audience_clicks",
      title: t("audience.metrics.audienceClicks"),
      value: totalAudienceClicks.toLocaleString(),
      icon: <TrendingUp {...ICON_LG} />,
      color: "warning" as const,
      subtitle: t("audience.metrics.totalEngagement"),
    },
    {
      id: "return_visitors",
      title: t("audience.metrics.returnVisitors"),
      value:
        data?.audience?.return_visitor_stats != null
          ? data.audience.return_visitor_stats.return_rate.toFixed(1) + "%"
          : "--",
      icon: <Repeat {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("audience.metrics.returnVisitorsSubtitle"),
    },
    {
      id: "avg_session",
      title: t("audience.metrics.avgSession"),
      value:
        data?.audience?.return_visitor_stats != null
          ? data.audience.return_visitor_stats.avg_session_clicks.toFixed(1) +
            "x"
          : "--",
      icon: <Clock {...ICON_LG} />,
      color: "info" as const,
      subtitle: t("audience.metrics.avgSessionSubtitle"),
    },
  ];

  const languageBreakdown: Array<{
    language: string;
    region: string | null;
    clicks: number;
    percentage: number;
  }> = data?.audience?.language_breakdown ?? [];

  const platformBreakdown: Array<{
    platform: string;
    clicks: number;
    percentage: number;
  }> = data?.audience?.platform_breakdown ?? [];

  const connectionBreakdown: Array<{
    type: string;
    clicks: number;
    percentage: number;
  }> = data?.audience?.connection_type_breakdown ?? [];

  const CONNECTION_LABELS: Record<string, string> = {
    residential: "Residencial",
    mobile: "Móvel",
    cellular: "Celular",
    datacenter: "Datacenter",
    broadband: "Banda larga",
    wifi: "Wi-Fi",
    education: "Educação",
    unknown: "Desconhecido",
  };

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    height: "100%",
  };

  const top7Lang = languageBreakdown.slice(0, 7);
  const restLang = languageBreakdown.slice(7);
  const othersLangClicks = restLang.reduce((s, l) => s + l.clicks, 0);
  const langChartData = [
    ...top7Lang.map((l) => ({ name: l.region ?? l.language, value: l.clicks })),
    ...(othersLangClicks > 0
      ? [{ name: "Outros", value: othersLangClicks }]
      : []),
  ];

  const platformChartData = platformBreakdown.map((p) => ({
    name: p.platform,
    value: p.clicks,
  }));

  const connChartData = connectionBreakdown.map((c) => ({
    name: CONNECTION_LABELS[c.type] ?? c.type,
    value: c.clicks,
  }));

  const hasExtraCharts =
    languageBreakdown.length > 0 ||
    platformBreakdown.length > 0 ||
    connectionBreakdown.length > 0;

  return (
    <>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {displayTitle}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              subtitle={metric.subtitle}
            />
          </Grid>
        ))}
      </Grid>

      {hasExtraCharts ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {languageBreakdown.length > 0 ? (
              <Grid item xs={12} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Idioma
                    </Typography>
                    <ApexChartWrapper
                      type="donut"
                      size="compact"
                      {...formatPieChart(
                        langChartData,
                        "name",
                        "value",
                        isDark,
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ) : null}

            {platformBreakdown.length > 0 ? (
              <Grid item xs={12} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Plataforma
                    </Typography>
                    <ApexChartWrapper
                      type="donut"
                      size="compact"
                      {...formatPieChart(
                        platformChartData,
                        "name",
                        "value",
                        isDark,
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ) : null}

            {connectionBreakdown.length > 0 ? (
              <Grid item xs={12} md={4}>
                <Card sx={cardSx}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Tipo de Conexão
                    </Typography>
                    <ApexChartWrapper
                      type="donut"
                      size="compact"
                      {...formatPieChart(
                        connChartData,
                        "name",
                        "value",
                        isDark,
                      )}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      ) : null}
    </>
  );
}

export default AudienceMetrics;
