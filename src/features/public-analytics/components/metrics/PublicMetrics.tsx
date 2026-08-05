"use client";

import { useTranslation } from "react-i18next";

import { formatCount } from "@/lib/utils/formatNumber";
import { useCountUp } from "@/shared/hooks/useCountUp";
import { OverviewMetricRow } from "@/shared/ui/base";

import type { OverviewMetric } from "@/shared/ui/base";
import type { PublicAnalyticsData } from "../../types";

interface PublicMetricsProps {
  analyticsData: PublicAnalyticsData;
}

/**
 * Overview row of the public analytics page: total clicks, link status and
 * creation date, rendered as bare {@link OverviewMetricRow} numbers — loose on
 * the page background, separated by hairlines, values in the display face with
 * tabular figures.
 *
 * This replaces three tinted cards where the total was set in primary blue at
 * 3.25rem with an icon chip over its caps label. The number is the page's
 * headline, so it now gets the same treatment as every headline number in the
 * product (`/links`, analytics, reports): white, Space Grotesk, tabular. Colour
 * is left to carry meaning — the status word is the only value that keeps a
 * semantic tint (success/error).
 *
 * The count-up on mount is kept (`useCountUp` returns the final value straight
 * away under reduced motion). The `aria-hidden` + polite live-region pair the
 * old markup used around the animated number is gone: `OverviewMetricRow` takes
 * a plain value, and a number that settles within 900 ms does not need to be
 * announced twice.
 */
export function PublicMetrics({ analyticsData }: PublicMetricsProps) {
  const { t, i18n } = useTranslation("public");

  const animatedClicks = useCountUp(analyticsData.total_clicks);

  const createdDate = analyticsData.created_at
    ? new Date(analyticsData.created_at)
    : null;
  const isValidDate = createdDate !== null && !isNaN(createdDate.getTime());
  const dateLabel = isValidDate
    ? createdDate.toLocaleDateString(i18n.language)
    : "-";
  const timeLabel = isValidDate
    ? createdDate.toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (analyticsData.total_clicks < 1) {
    return null;
  }

  const isActive = analyticsData.is_active;

  const metrics: OverviewMetric[] = [
    {
      label: t("publicAnalytics.metrics.totalClicks"),
      value: formatCount(animatedClicks, i18n.language),
      caption: t("publicAnalytics.metrics.sinceCreation"),
    },
    {
      label: t("publicAnalytics.metrics.status"),
      value: isActive
        ? t("publicAnalytics.metrics.active")
        : t("publicAnalytics.metrics.inactive"),
      valueColor: isActive ? "success.main" : "error.main",
      caption: t("publicAnalytics.metrics.operational"),
    },
    {
      label: t("publicAnalytics.metrics.createdAt"),
      value: dateLabel,
      caption: timeLabel || undefined,
    },
  ];

  return <OverviewMetricRow metrics={metrics} size="md" />;
}
