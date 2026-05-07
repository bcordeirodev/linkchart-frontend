"use client";
import { MonitorSmartphone, Globe, Clock, TrendingUp } from "lucide-react";
import { Box, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";
import { LanguageBreakdownChart } from "./LanguageBreakdownChart";

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
      icon: <Globe {...ICON_LG} />,
      color: "success" as const,
      subtitle: t("audience.metrics.differentBrowsers"),
    },
    {
      id: "os_types",
      title: t("audience.metrics.operatingSystems"),
      value: osTypes.toString(),
      icon: <Clock {...ICON_LG} />,
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
      icon: <TrendingUp {...ICON_LG} />,
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
    datacenter: "Datacenter",
    education: "Educação",
    unknown: "Desconhecido",
  };

  return (
    <>
      {showTitle ? (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {displayTitle}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
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

      {languageBreakdown.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Idioma (Parsed)
          </Typography>
          <LanguageBreakdownChart data={languageBreakdown} />
        </Box>
      ) : null}

      {platformBreakdown.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Plataforma (Client Hints)
          </Typography>
          {platformBreakdown.map((entry) => (
            <Box key={entry.platform} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">{entry.platform}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.clicks} ({entry.percentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={entry.percentage}
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </Box>
      ) : null}

      {connectionBreakdown.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Tipo de Conexão
          </Typography>
          {connectionBreakdown.map((entry) => (
            <Box key={entry.type} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">
                  {CONNECTION_LABELS[entry.type] ?? entry.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.clicks} ({entry.percentage}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={entry.percentage}
                color="info"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          ))}
        </Box>
      ) : null}
    </>
  );
}

export default AudienceMetrics;
