"use client";
import { useMemo } from "react";
import { Zap } from "lucide-react";
import { Box, Chip, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { ClickVelocityData } from "@/types/analytics/temporal";

/** Props for {@link ClickVelocityChart}. */
interface ClickVelocityChartProps {
  /** Click velocity distribution returned by the temporal endpoint. */
  data: ClickVelocityData;
}

/**
 * Horizontal bar chart showing the distribution of click velocity buckets
 * (time between consecutive clicks on the link).
 *
 * When `phase2_available` is `false`, a disclaimer chip is rendered to inform
 * the user that velocity data only exists for clicks recorded after Phase 2
 * tracking began. The chart is hidden entirely when no velocity data is present.
 */
export function ClickVelocityChart({ data }: ClickVelocityChartProps) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();

  const totalCount = useMemo(
    () => data.velocity_distribution.reduce((sum, b) => sum + b.count, 0),
    [data.velocity_distribution],
  );

  const hasData = totalCount > 0;

  const bucketLabels = useMemo(
    () =>
      data.velocity_distribution.map((b) => {
        const key = `temporal.${b.label_key}`;
        return t(key, { defaultValue: b.bucket });
      }),
    [data.velocity_distribution, t],
  );

  const bucketCounts = useMemo(
    () => data.velocity_distribution.map((b) => b.count),
    [data.velocity_distribution],
  );

  const options = useMemo(
    () => ({
      plotOptions: {
        bar: { horizontal: true, borderRadius: 4, barHeight: "55%" },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) =>
          totalCount > 0 ? `${((val / totalCount) * 100).toFixed(1)}%` : "0%",
      },
      xaxis: { categories: bucketLabels },
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${val.toLocaleString()} ${t("temporal.chart.clicks")}`,
        },
      },
      legend: { show: false },
    }),
    [bucketLabels, totalCount, t],
  );

  const series = useMemo(
    () => [{ name: t("temporal.chart.clicks"), data: bucketCounts }],
    [bucketCounts, t],
  );

  if (!hasData) return null;

  return (
    <ChartCard
      title={t("temporal.clickVelocity.title")}
      icon={<Zap {...ICON_MD} />}
      subtitle={t("temporal.clickVelocity.description")}
    >
      {!data.phase2_available && (
        <Box sx={{ mb: 2 }}>
          <Chip
            size="small"
            label={t("temporal.clickVelocity.phaseDisclaimer")}
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.12),
              color: theme.palette.warning.main,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
              fontSize: "0.7rem",
              height: "auto",
              py: 0.25,
              "& .MuiChip-label": {
                whiteSpace: "normal",
                textAlign: "center",
              },
            }}
          />
        </Box>
      )}

      <ApexChartWrapper
        type="bar"
        series={series}
        options={options}
        height={220}
      />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        {t("temporal.clickVelocity.totalWithData", {
          count: data.total_with_data,
        })}
      </Typography>
    </ChartCard>
  );
}

export default ClickVelocityChart;
