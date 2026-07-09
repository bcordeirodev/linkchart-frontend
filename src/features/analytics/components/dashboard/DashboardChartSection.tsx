"use client";

import React, { useMemo, type ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { createPresetAnimations } from "@/lib/theme";
import { SectionDivider } from "@/shared/ui/SectionDivider";

import type { DashboardData } from "@/types/analytics/dashboard";

import { UtmSourceCard, SocialAppCard } from "./cards";
import {
  DayOfWeekChart,
  DeviceBreakdownChart,
  HourlyClicksChart,
  TopCountriesChart,
} from "./charts";

/** Pre-mapped chart data derived from the raw DashboardData payload. */
export interface ChartData {
  temporal?: {
    clicks_by_hour: NonNullable<
      DashboardData["temporal_data"]
    >["clicks_by_hour"];
    clicks_by_day_of_week: NonNullable<
      DashboardData["temporal_data"]
    >["clicks_by_day_of_week"];
  };
  geographic?: {
    top_countries: Array<{ country: string; clicks: number; iso_code: string }>;
  };
  audience?: {
    device_breakdown: NonNullable<
      DashboardData["audience_data"]
    >["device_breakdown"];
  };
  utmTopSources?: NonNullable<DashboardData["summary"]>["utm_top_sources"];
  socialIab?: NonNullable<DashboardData["summary"]>["social_iab"];
}

type DashboardChartSectionId = "temporal" | "audience" | "acquisition";

/** Props accepted by the {@link DashboardChartSection} component. */
interface DashboardChartSectionProps {
  chartData: ChartData;
  height?: number;
  section: DashboardChartSectionId;
}

export function chartFlags(chartData: ChartData) {
  const hasHourly = !!chartData.temporal?.clicks_by_hour?.length;
  const hasWeekly = !!chartData.temporal?.clicks_by_day_of_week?.length;
  const hasTemporal = hasHourly || hasWeekly;
  const hasGeographic = !!chartData.geographic?.top_countries?.length;
  const hasDevice = !!chartData.audience?.device_breakdown?.length;
  const hasUtm = !!(
    chartData.utmTopSources && chartData.utmTopSources.length > 0
  );
  const hasSocial = !!(
    chartData.socialIab &&
    (chartData.socialIab.total > 0 ||
      !chartData.socialIab.navigation_context_available)
  );
  return {
    hasHourly,
    hasWeekly,
    hasTemporal,
    hasGeographic,
    hasDevice,
    hasUtm,
    hasSocial,
    hasAudience: hasDevice || hasGeographic,
    hasAcquisition: hasUtm || hasSocial,
    hasAny: hasTemporal || hasDevice || hasGeographic || hasUtm || hasSocial,
  };
}

/**
 * Renders one dashboard chart section inside its own Grid container so section
 * order stays stable (Temporal → Audience → Acquisition last).
 */
export const DashboardChartSection = React.memo(function DashboardChartSection({
  chartData,
  height,
  section,
}: DashboardChartSectionProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const animations = useMemo(() => createPresetAnimations(theme), [theme]);

  const flags = chartFlags(chartData);
  const {
    hasHourly,
    hasWeekly,
    hasTemporal,
    hasGeographic,
    hasDevice,
    hasUtm,
    hasSocial,
    hasAudience,
    hasAcquisition,
  } = flags;

  if (section === "temporal" && !hasTemporal) return null;
  if (section === "audience" && !hasAudience) return null;
  if (section === "acquisition" && !hasAcquisition) return null;

  const sectionTitle =
    section === "temporal"
      ? t("sections.temporal")
      : section === "audience"
        ? t("sections.audience")
        : t("sections.acquisition");

  const chartCells: { key: string; node: ReactNode }[] = [];

  if (section === "temporal" && hasHourly) {
    chartCells.push({
      key: "hourly",
      node: (
        <HourlyClicksChart
          data={chartData.temporal!.clicks_by_hour}
          height={height}
        />
      ),
    });
  }
  if (section === "temporal" && hasWeekly) {
    chartCells.push({
      key: "weekly",
      node: (
        <DayOfWeekChart
          data={chartData.temporal!.clicks_by_day_of_week}
          height={height}
        />
      ),
    });
  }
  if (section === "audience" && hasDevice) {
    chartCells.push({
      key: "device",
      node: (
        <DeviceBreakdownChart
          data={chartData.audience!.device_breakdown}
          height={height}
        />
      ),
    });
  }
  if (section === "audience" && hasGeographic) {
    chartCells.push({
      key: "countries",
      node: (
        <TopCountriesChart
          data={chartData.geographic!.top_countries}
          height={height}
        />
      ),
    });
  }
  if (section === "acquisition" && hasUtm) {
    chartCells.push({
      key: "utm",
      node: <UtmSourceCard data={chartData.utmTopSources!} />,
    });
  }
  if (section === "acquisition" && hasSocial) {
    chartCells.push({
      key: "social",
      node: <SocialAppCard data={chartData.socialIab!} />,
    });
  }

  const twoColumnLayout = chartCells.length > 1;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <SectionDivider title={sectionTitle} mb={0} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: twoColumnLayout ? "repeat(2, minmax(0, 1fr))" : "1fr",
          },
          gap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {chartCells.map(({ key, node }) => (
          <Box
            key={key}
            sx={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              ...animations.fadeIn,
            }}
          >
            <Box sx={{ width: "100%", minWidth: 0 }}>{node}</Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
});
