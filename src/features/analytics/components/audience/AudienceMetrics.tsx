"use client";
import { MonitorSmartphone, Globe, Clock, TrendingUp } from "lucide-react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";

import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

interface AudienceMetricsProps {
  data?: any;
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
      (sum: number, device: any) => sum + (device.clicks || 0),
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
  ];

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
    </>
  );
}

export default AudienceMetrics;
