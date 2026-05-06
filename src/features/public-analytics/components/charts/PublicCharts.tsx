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
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import {
  formatAreaChart,
  formatBarChart,
  formatPieChart,
} from "@/features/analytics/utils/chartFormatters";
import { createPresetAnimations } from "@/lib/theme";
import { chartByType } from "@/lib/theme/colors";
import { ICON_LG } from "@/lib/theme/iconDefaults";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";

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

  const hourData = (charts?.temporal?.clicks_by_hour ?? []).map((d) => ({
    hour: `${d.hour}h`,
    clicks: d.clicks,
  }));
  const dowData = (charts?.temporal?.clicks_by_day_of_week ?? []).map((d) => ({
    day: t(`publicAnalytics.charts.dow.${d.day}`, { defaultValue: String(d.day) }),
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
        <TrendingUp size={15} strokeWidth={1.75} color="rgba(129,140,248,0.6)" />
        <Typography
          sx={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3px",
          }}
        >
          {t("publicAnalytics.charts.title")}
        </Typography>
      </Box>

      <ChartsGrid
        isDark={isDark}
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
  isDark: boolean;
  t: (key: string) => string;
  hourData?: { hour: string; clicks: number }[];
  dowData?: { day: string; clicks: number }[];
  deviceData?: { device: string; clicks: number }[];
  browserData?: { browser: string; clicks: number }[];
  countryData?: { country: string; clicks: number }[];
}

const darkCardSx = {
  "& .MuiCard-root": {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "none",
  },
  "& .MuiCardContent-root .MuiTypography-h5": {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
  },
};

function ChartsGrid({
  isDark,
  t,
  hourData,
  dowData,
  deviceData,
  browserData,
  countryData,
}: ChartsGridProps) {
  return (
    <Grid container spacing={2}>
      {hourData ? (
        <Grid item xs={12}>
          <ChartCard
            title={t("publicAnalytics.charts.hourlyClicks")}
            icon={<Clock {...ICON_LG} />}
            sx={darkCardSx}
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
            icon={<Calendar {...ICON_LG} />}
            sx={darkCardSx}
          >
            <ApexChartWrapper
              type="bar"
              size="standard"
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
            icon={<Globe {...ICON_LG} />}
            sx={darkCardSx}
          >
            <ApexChartWrapper
              type="bar"
              size="standard"
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
            icon={<Smartphone {...ICON_LG} />}
            sx={darkCardSx}
          >
            <ApexChartWrapper
              type="donut"
              size="standard"
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
            icon={<Monitor {...ICON_LG} />}
            sx={darkCardSx}
          >
            <ApexChartWrapper
              type="donut"
              size="standard"
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
  const { t } = useTranslation("public");
  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <BarChart2 size={28} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "rgba(255,255,255,0.25)",
          textAlign: "center",
        }}
      >
        {t("publicAnalytics.charts.emptyText")}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.13)",
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
