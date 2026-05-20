"use client";
import { useMemo } from "react";
import { Flame } from "lucide-react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import {
  elevationLightTokens,
  elevationTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface ViralRankDay {
  date: string;
  peak_rank: "cold" | "warming" | "trending" | "viral";
  click_count: number;
}

const RANK_COLORS: Record<string, string> = {
  cold: "#475569",
  warming: "#f59e0b",
  trending: "#f97316",
  viral: "#ef4444",
};

interface Props {
  data?: ViralRankDay[];
}

/**
 * Bar chart showing daily click counts colored by peak viral rank.
 * Hidden when all days are cold or data is empty.
 */
export function ViralRankMiniChart({ data }: Props) {
  const { t } = useTranslation("analytics");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const elevation = isDark ? elevationTokens : elevationLightTokens;

  const hasNonCold = useMemo(
    () => data?.some((d) => d.peak_rank !== "cold") ?? false,
    [data],
  );

  const peakDay = useMemo(() => {
    if (!data) return null;
    return (
      [...data]
        .filter((d) => d.peak_rank !== "cold")
        .sort(
          (a, b) =>
            b.click_count - a.click_count ||
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0] ?? null
    );
  }, [data]);

  const series = useMemo(
    () => [
      {
        name: t("temporal.viralRank.clicks"),
        data: (data ?? []).map((d) => d.click_count),
      },
    ],
    [data, t],
  );

  const options = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        toolbar: { show: false },
        background: "transparent",
      },
      plotOptions: {
        bar: { borderRadius: 3, columnWidth: "60%", distributed: true },
      },
      colors: (data ?? []).map(
        (d) => RANK_COLORS[d.peak_rank] ?? RANK_COLORS.cold,
      ),
      xaxis: {
        categories: (data ?? []).map((d) => {
          const parts = d.date.split("-");
          return `${parts[2]}/${parts[1]}`;
        }),
        labels: {
          style: { colors: theme.palette.text.secondary, fontSize: "11px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: theme.palette.text.secondary } },
      },
      grid: { borderColor: theme.palette.divider },
      theme: { mode: isDark ? ("dark" as const) : ("light" as const) },
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${val} ${t("temporal.viralRank.clicksUnit")}`,
        },
        x: {
          formatter: (_: unknown, opts?: { dataPointIndex?: number }) => {
            const idx = opts?.dataPointIndex;
            if (idx === undefined || !data) return "";
            const d = data[idx];
            const rankLabel = t(`temporal.viralRank.ranks.${d.peak_rank}`);
            return `${d.date} · ${rankLabel}`;
          },
        },
      },
      legend: { show: false },
    }),
    [data, theme, t, isDark],
  );

  if (!data || data.length === 0 || !hasNonCold) return null;

  return (
    <Card
      sx={{ borderRadius: `${radiusTokens.lg}px`, boxShadow: elevation.xs }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 0.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Flame {...ICON_MD} />
          {t("temporal.viralRank.title")}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          {(["cold", "warming", "trending", "viral"] as const).map((rank) => (
            <Box
              key={rank}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 0.5,
                  bgcolor: RANK_COLORS[rank],
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {t(`temporal.viralRank.ranks.${rank}`)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t("temporal.viralRank.description")}
        </Typography>

        <ApexChartWrapper
          type="bar"
          series={series}
          options={options}
          height={180}
        />

        {peakDay && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              bgcolor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Flame size={16} color={theme.palette.error.main} />
            <Typography variant="caption">
              <strong style={{ color: theme.palette.error.light }}>
                {t("temporal.viralRank.peak")}
              </strong>{" "}
              <span style={{ color: theme.palette.text.secondary }}>
                {peakDay.date} · {peakDay.click_count}{" "}
                {t("temporal.viralRank.clicksUnit")} ·{" "}
                {t(`temporal.viralRank.ranks.${peakDay.peak_rank}`)}
              </span>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ViralRankMiniChart;
