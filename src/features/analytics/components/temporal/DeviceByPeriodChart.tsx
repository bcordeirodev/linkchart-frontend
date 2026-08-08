"use client";
import { Box, Grid, Typography, Stack } from "@mui/material";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import { dataVizCategorical } from "@/lib/theme/dataViz";
import type { DeviceByPeriodEntry } from "@/types/analytics/temporal";

interface DeviceByPeriodChartProps {
  data: DeviceByPeriodEntry[];
}

export function DeviceByPeriodChart({ data }: DeviceByPeriodChartProps) {
  const { t, i18n } = useTranslation("analytics");

  if (!data || data.length === 0) {
    return null;
  }

  // Map the period key to a translated label. Inline template literal so the
  // i18n type system can resolve the key union. Falls back to `d.period` for
  // any unknown period key.
  const periodLabel = (d: DeviceByPeriodEntry): string =>
    t(
      `temporal.periods.${d.period as "dawn" | "morning" | "afternoon" | "evening"}`,
      {
        defaultValue: d.period,
      },
    );

  const categories = data.map(periodLabel);
  const desktopSeries = data.map((d) => d.desktop);
  const mobileSeries = data.map((d) => d.mobile);
  const tabletSeries = data.map((d) => d.tablet);

  const totalByDevice = {
    desktop: desktopSeries.reduce((s, v) => s + v, 0),
    mobile: mobileSeries.reduce((s, v) => s + v, 0),
    tablet: tabletSeries.reduce((s, v) => s + v, 0),
  };
  const grandTotal =
    totalByDevice.desktop + totalByDevice.mobile + totalByDevice.tablet;

  const options = {
    chart: { stacked: true },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "55%" },
    },
    xaxis: { categories },
    yaxis: {
      labels: { formatter: (v: number) => v.toLocaleString(i18n.language) },
    },
    tooltip: {
      y: {
        formatter: (v: number) =>
          `${v.toLocaleString(i18n.language)} ${t("temporal.chart.clicks")}`,
      },
    },
    legend: { position: "top" as const },
  };

  const series = [
    { name: t("temporal.devicePeriod.desktop"), data: desktopSeries },
    { name: t("temporal.devicePeriod.mobile"), data: mobileSeries },
    { name: t("temporal.devicePeriod.tablet"), data: tabletSeries },
  ];

  const pct = (n: number) =>
    grandTotal > 0 ? `${((n / grandTotal) * 100).toFixed(1)}%` : "0%";

  // Same order as `series` above — the base theme colors stacked-bar series
  // by array position from `dataVizCategorical` (azul/teal/violeta), so these
  // three swatches match the actual bar segments the reader sees.
  const deviceRows = [
    {
      label: t("temporal.devicePeriod.desktop"),
      icon: <Monitor size={18} />,
      color: dataVizCategorical[0],
      count: totalByDevice.desktop,
    },
    {
      label: t("temporal.devicePeriod.mobile"),
      icon: <Smartphone size={18} />,
      color: dataVizCategorical[1],
      count: totalByDevice.mobile,
    },
    {
      label: t("temporal.devicePeriod.tablet"),
      icon: <Tablet size={18} />,
      color: dataVizCategorical[2],
      count: totalByDevice.tablet,
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartCard
            title={t("temporal.devicePeriod.title")}
            subtitle={t("temporal.devicePeriod.subtitle")}
          >
            <ApexChartWrapper
              type="bar"
              size="standard"
              series={series}
              options={options}
            />
          </ChartCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ChartCard title={t("temporal.devicePeriod.summary")}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {deviceRows.map(({ label, icon, color, count }) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ color, flexShrink: 0 }}>{icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {count.toLocaleString(i18n.language)}{" "}
                      {t("temporal.chart.clicks")} · {pct(count)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {t("temporal.devicePeriod.hint")}
              </Typography>
            </Box>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DeviceByPeriodChart;
