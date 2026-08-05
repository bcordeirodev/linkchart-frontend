"use client";

import { Grid, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import { SectionLabel } from "@/shared/ui/base";

import { EmptyClicksEngagement } from "../states/EmptyClicksEngagement";

import { BrowsersChart } from "./BrowsersChart";
import { DayOfWeekChart } from "./DayOfWeekChart";
import { DevicesChart } from "./DevicesChart";
import { HourlyClicksChart } from "./HourlyClicksChart";
import { TopCountriesChart } from "./TopCountriesChart";

import type { PublicAnalyticsData } from "../../types";

interface PublicChartsProps {
  analyticsData: PublicAnalyticsData;
  /** Fully-resolved short URL passed to the zero-data engagement block. */
  shortUrl: string;
}

/**
 * Renders the public-analytics chart grid or the empty-state engagement block.
 *
 * Each chart is self-contained (series construction, i18n) — this component is
 * responsible only for:
 * - computing per-chart "has data" guards,
 * - deciding which charts to show,
 * - laying them out in a responsive MUI Grid,
 * - delegating to `EmptyClicksEngagement` when no real data exists.
 *
 * The section is anchored by `SectionLabel` (mono caps with the `/` prefix),
 * the same header the logged-in dashboard's chart sections use — it replaces a
 * caps line with a `TrendingUp` glyph beside it.
 *
 * `PublicChartsProps` is intentionally unchanged so both call sites
 * (`PublicAnalyticsSections` and `PublicAnalyticsPageContent`) keep working.
 */
export function PublicCharts({ analyticsData, shortUrl }: PublicChartsProps) {
  const { t } = useTranslation("public");
  const { charts } = analyticsData;

  // ── Per-chart data guards ────────────────────────────────────────────────

  const hourData = (charts?.temporal?.clicks_by_hour ?? []).map((d) => ({
    hour: `${d.hour}h`,
    clicks: d.clicks,
  }));

  const dowRawData = charts?.temporal?.clicks_by_day_of_week ?? [];

  const countryData = (charts?.geographic?.top_countries ?? []) as {
    country: string;
    clicks: number;
  }[];

  const deviceData = (charts?.audience?.device_breakdown ?? []) as {
    device: string;
    clicks: number;
  }[];

  const browserData = (charts?.audience?.browser_breakdown ?? []) as {
    browser: string;
    clicks: number;
  }[];

  const hasHourData = hourData.some((d) => d.clicks > 0);
  const hasDowData = dowRawData.some((d) => d.clicks > 0);
  const hasCountryData = countryData.length > 0;
  const hasDeviceData = deviceData.length > 0;
  const hasBrowserData = browserData.length > 0;

  const hasRealData =
    analyticsData.has_analytics &&
    charts &&
    (hasHourData ||
      hasDowData ||
      hasDeviceData ||
      hasBrowserData ||
      hasCountryData);

  if (!hasRealData) {
    return <EmptyClicksEngagement shortUrl={shortUrl} />;
  }

  // ── Layout helpers ──────────────────────────────────────────────────────
  //
  // DOW and Countries sit side-by-side at md when both exist; each takes full
  // width when the other is absent. Devices and Browsers use the same pattern
  // but pair up from sm, since a stacked bar reads fine at tablet width.

  const dowMd = hasDowData && hasCountryData ? 6 : 12;
  const countryMd = hasCountryData && hasDowData ? 6 : 12;
  const deviceMd = hasDeviceData && hasBrowserData ? 6 : 12;
  const browserMd = hasBrowserData && hasDeviceData ? 6 : 12;

  return (
    <Stack spacing={{ xs: 2, md: 2.5 }}>
      <SectionLabel headingLevel={2}>
        {t("publicAnalytics.charts.title")}
      </SectionLabel>

      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        {/* Hourly — full-width row */}
        {hasHourData ? (
          <Grid item xs={12}>
            <HourlyClicksChart data={hourData} />
          </Grid>
        ) : null}

        {/* Day of week + Top Countries — share a row at md */}
        {hasDowData ? (
          <Grid item xs={12} md={dowMd}>
            <DayOfWeekChart rawData={dowRawData} />
          </Grid>
        ) : null}

        {hasCountryData ? (
          <Grid item xs={12} md={countryMd}>
            <TopCountriesChart data={countryData} />
          </Grid>
        ) : null}

        {/* Devices + Browsers — share a row from sm */}
        {hasDeviceData ? (
          <Grid item xs={12} sm={deviceMd} md={deviceMd}>
            <DevicesChart data={deviceData} />
          </Grid>
        ) : null}

        {hasBrowserData ? (
          <Grid item xs={12} sm={browserMd} md={browserMd}>
            <BrowsersChart data={browserData} />
          </Grid>
        ) : null}
      </Grid>
    </Stack>
  );
}
