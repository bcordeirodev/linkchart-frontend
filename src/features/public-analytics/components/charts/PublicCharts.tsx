"use client";
import {
  Clock,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { Box, Typography, Grid } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  formatAreaChart,
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { createPresetAnimations } from "@/lib/theme";
import { chartByType } from "@/lib/theme/colors";
import {
  getPublicChartCardOverrideSx,
  getPublicInsetSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

import type { Theme } from "@mui/material/styles";

import type { PublicAnalyticsData } from "../../types";

interface PublicChartsProps {
  analyticsData: PublicAnalyticsData;
}

export function PublicCharts({ analyticsData }: PublicChartsProps) {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const animations = createPresetAnimations(theme);
  const { charts } = analyticsData;
  const titleColor = alpha(theme.palette.text.primary, isDark ? 0.55 : 0.7);
  const titleAccent = alpha(theme.palette.primary.main, 0.6);

  const hourData = (charts?.temporal?.clicks_by_hour ?? []).map((d) => ({
    hour: `${d.hour}h`,
    clicks: d.clicks,
  }));
  const dowData = (charts?.temporal?.clicks_by_day_of_week ?? []).map((d) => ({
    day: t(`publicAnalytics.charts.dow.${d.day}`, {
      defaultValue: String(d.day),
    }),
    clicks: d.clicks,
  }));

  const hasHourData = hourData.some((d) => d.clicks > 0);
  const hasDowData = dowData.some((d) => d.clicks > 0);
  const hasDeviceData = (charts?.audience?.device_breakdown?.length ?? 0) > 0;
  const hasBrowserData = (charts?.audience?.browser_breakdown?.length ?? 0) > 0;
  const hasCountryData = (charts?.geographic?.top_countries?.length ?? 0) > 0;

  const hasRealData =
    analyticsData.has_analytics &&
    charts &&
    (hasHourData ||
      hasDowData ||
      hasDeviceData ||
      hasBrowserData ||
      hasCountryData);

  if (!hasRealData) {
    return <EmptyChartsState />;
  }

  return (
    <Box sx={{ ...animations.fadeIn }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <TrendingUp size={15} strokeWidth={1.75} color={titleAccent} />
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: titleColor,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {t("publicAnalytics.charts.title")}
        </Typography>
      </Box>

      <ChartsGrid
        theme={theme}
        t={t as (key: string) => string}
        hourData={hasHourData ? hourData : undefined}
        dowData={hasDowData ? dowData : undefined}
        deviceData={
          hasDeviceData
            ? (charts?.audience?.device_breakdown as {
                device: string;
                clicks: number;
              }[])
            : undefined
        }
        browserData={
          hasBrowserData
            ? (charts?.audience?.browser_breakdown as {
                browser: string;
                clicks: number;
              }[])
            : undefined
        }
        countryData={
          hasCountryData
            ? (charts?.geographic?.top_countries as {
                country: string;
                clicks: number;
              }[])
            : undefined
        }
      />
    </Box>
  );
}

interface ChartsGridProps {
  theme: Theme;
  t: (key: string) => string;
  hourData?: { hour: string; clicks: number }[];
  dowData?: { day: string; clicks: number }[];
  deviceData?: { device: string; clicks: number }[];
  browserData?: { browser: string; clicks: number }[];
  countryData?: { country: string; clicks: number }[];
}

function ChartsGrid({
  theme,
  t,
  hourData,
  dowData,
  deviceData,
  browserData,
  countryData,
}: ChartsGridProps) {
  const cardSx = getPublicChartCardOverrideSx(theme);
  const isDark = theme.palette.mode === "dark";
  return (
    <Grid container spacing={{ xs: 1.5, md: 2 }}>
      {hourData ? (
        <Grid item xs={12}>
          <ChartCard
            title={t("publicAnalytics.charts.hourlyClicks")}
            subtitle={t("publicAnalytics.charts.hourlyClicksDesc")}
            icon={<Clock {...ICON_LG} />}
            sx={cardSx}
          >
            <ApexChartWrapper
              type="area"
              size="compact"
              {...formatAreaChart(
                hourData as Record<string, unknown>[],
                "hour",
                "clicks",
                chartByType.temporal.hourly,
                isDark,
              )}
            />
          </ChartCard>
        </Grid>
      ) : null}

      {dowData ? (
        <Grid item xs={12} md={countryData ? 6 : 12}>
          <ChartCard
            title={t("publicAnalytics.charts.dayOfWeek")}
            subtitle={t("publicAnalytics.charts.dayOfWeekDesc")}
            icon={<Calendar {...ICON_LG} />}
            sx={cardSx}
          >
            <ApexChartWrapper
              type="bar"
              size="compact"
              {...formatBarChart(
                dowData as Record<string, unknown>[],
                "day",
                "clicks",
                chartByType.temporal.weekly,
                false,
                isDark,
              )}
            />
          </ChartCard>
        </Grid>
      ) : null}

      {countryData ? (
        <Grid item xs={12} md={dowData ? 6 : 12}>
          <ChartCard
            title={t("publicAnalytics.charts.topCountries")}
            subtitle={t("publicAnalytics.charts.topCountriesDesc")}
            icon={<Globe {...ICON_LG} />}
            sx={cardSx}
          >
            <ApexChartWrapper
              type="bar"
              size="compact"
              {...formatBarChart(
                countryData as Record<string, unknown>[],
                "country",
                "clicks",
                chartByType.geographic.countries,
                true,
                isDark,
              )}
            />
          </ChartCard>
        </Grid>
      ) : null}

      {deviceData ? (
        <Grid item xs={12} md={browserData ? 6 : 12}>
          <ChartCard
            title={t("publicAnalytics.charts.devices")}
            subtitle={t("publicAnalytics.charts.devicesDesc")}
            icon={<Smartphone {...ICON_LG} />}
            sx={cardSx}
          >
            <ApexChartWrapper
              type="donut"
              size="compact"
              {...formatPieChart(
                deviceData as Record<string, unknown>[],
                "device",
                "clicks",
                isDark,
              )}
            />
          </ChartCard>
        </Grid>
      ) : null}

      {browserData ? (
        <Grid item xs={12} md={deviceData ? 6 : 12}>
          <ChartCard
            title={t("publicAnalytics.charts.browsers")}
            subtitle={t("publicAnalytics.charts.browsersDesc")}
            icon={<Monitor {...ICON_LG} />}
            sx={cardSx}
          >
            <ApexChartWrapper
              type="donut"
              size="compact"
              {...formatPieChart(
                browserData as Record<string, unknown>[],
                "browser",
                "clicks",
                isDark,
              )}
            />
          </ChartCard>
        </Grid>
      ) : null}
    </Grid>
  );
}

function EmptyChartsState() {
  const theme = useTheme();
  const { t } = useTranslation("public");
  const isDark = theme.palette.mode === "dark";
  const iconColor = alpha(theme.palette.text.primary, isDark ? 0.18 : 0.22);
  const titleColor = alpha(theme.palette.text.primary, isDark ? 0.45 : 0.55);
  const subColor = alpha(theme.palette.text.primary, isDark ? 0.3 : 0.4);

  return (
    <Box
      sx={{
        ...getPublicInsetSx(theme),
        py: { xs: 4, md: 5 },
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <BarChart2 size={28} color={iconColor} strokeWidth={1.5} />
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: titleColor,
          textAlign: "center",
        }}
      >
        {t("publicAnalytics.charts.emptyText")}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.75rem",
          color: subColor,
          textAlign: "center",
          maxWidth: 340,
          lineHeight: 1.6,
        }}
      >
        {t("publicAnalytics.charts.emptySub")}
      </Typography>
    </Box>
  );
}
