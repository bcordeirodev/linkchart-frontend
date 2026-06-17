"use client";
import {
  MonitorSmartphone,
  AppWindow,
  Cpu,
  Clock,
  TrendingUp,
  Repeat,
} from "lucide-react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { ICON_LG } from "@/lib/theme/iconDefaults";
import { MetricCardOptimized as MetricCard } from "@/shared/ui/base/MetricCardOptimized";

import type {
  AudienceResponse,
  AudienceStats,
} from "@/types/analytics/audience";

/**
 * Shape consumed by {@link AudienceMetrics}: the audience breakdowns nested
 * under `audience` (so both the hook and legacy payloads resolve through the
 * same `audience.*` reads) plus the client-derived aggregate `stats`.
 */
interface AudienceMetricsData {
  /** Audience breakdowns container (device/browser/OS, return-visitor stats). */
  audience?: AudienceResponse;
  /** Aggregate stats derived client-side from the device breakdown. */
  stats?: AudienceStats;
}

interface AudienceMetricsProps {
  /** Audience data object containing `audience` and `stats` sub-objects. */
  data?: AudienceMetricsData;
  /** Whether to render a title above the metric cards. */
  showTitle?: boolean;
  /** Custom title text. Falls back to the i18n key `audience.metrics.title`. */
  title?: string;
}

/**
 * Renders the six top-level metric cards for the Audience tab:
 * device types, browsers, OS, total clicks, return visitors, and avg session.
 *
 * The supplementary donut charts (Idioma, Plataforma, Tipo de Conexão)
 * live inside the AudienceChart sub-tabs (Languages, Systems, Quality).
 */
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
      (sum, device) => sum + (device.clicks || 0),
      0,
    ) || 0;

  const displayTitle = title ?? t("audience.metrics.title");

  // Narrow once into a local so TypeScript carries the non-null guard into the
  // metric value/subtitle expressions below (it cannot narrow a repeated
  // optional-chain access path inline).
  const returnVisitorStats = data?.audience?.return_visitor_stats;

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
        returnVisitorStats != null
          ? returnVisitorStats.return_rate.toFixed(1) + "%"
          : "--",
      icon: <Repeat {...ICON_LG} />,
      color: "success" as const,
      subtitle:
        returnVisitorStats != null
          ? t("audience.metrics.returnVisitorsSubtitle")
          : t("audience.metrics.insufficientData"),
    },
    {
      id: "avg_session",
      title: t("audience.metrics.avgSession"),
      value:
        returnVisitorStats != null
          ? returnVisitorStats.avg_session_clicks.toFixed(1) + "x"
          : "--",
      icon: <Clock {...ICON_LG} />,
      color: "info" as const,
      subtitle:
        returnVisitorStats != null
          ? t("audience.metrics.avgSessionSubtitle")
          : t("audience.metrics.insufficientData"),
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
          <Grid item xs={6} sm={4} md={2} key={metric.id}>
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
