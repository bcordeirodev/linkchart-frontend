"use client";
import { useMemo } from "react";
import { Flame } from "lucide-react";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { ICON_MD } from "@/lib/theme/iconDefaults";
import { radiusTokens } from "@/lib/theme/designSystem";
import { ChartCard } from "@/shared/ui/data-display/ChartCard";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";

interface ViralRankDay {
  date: string;
  peak_rank: "cold" | "warming" | "trending" | "viral" | "unranked";
  click_count: number;
}

/** Color map for all viral rank values, including pre-Phase 2 `unranked`. */
const RANK_COLORS: Record<string, string> = {
  cold: "#475569",
  warming: "#f59e0b",
  trending: "#f97316",
  viral: "#ef4444",
  /** Neutral gray for clicks recorded before Phase 2 tracking began. */
  unranked: "#94a3b8",
};

/**
 * Light-mode overrides for {@link RANK_COLORS}: the dark-calibrated ambers
 * fail WCAG non-text contrast on the light surfaces (warming 1.72:1,
 * trending 2.24:1, unranked 2.05:1 vs card `#E3E6EA`). Each override keeps
 * the hue identity and the cold→viral heat ordering — measured 3.80–5.17:1
 * vs card. Keys absent here keep their dark value (already ≥3:1).
 */
const RANK_COLORS_LIGHT: Record<string, string> = {
  warming: "#B45309",
  trending: "#C2410C",
  viral: "#B91C1C",
  unranked: "#64748B",
};

/**
 * Resolves the rank → color map for the active color mode.
 *
 * @param mode - `theme.palette.mode`; light merges the contrast overrides.
 */
function rankColors(mode: "light" | "dark"): Record<string, string> {
  return mode === "light"
    ? { ...RANK_COLORS, ...RANK_COLORS_LIGHT }
    : RANK_COLORS;
}

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

  // Show the chart when any data exists (including unranked pre-Phase 2 clicks).
  // Previously hidden when all days were 'cold' — now we also surface 'unranked' days.
  const hasAnyData = useMemo(() => (data?.length ?? 0) > 0, [data]);

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
      // `distributed: true` + a per-bar `colors` array is the one legitimate
      // exception to "colors come from the base theme" here: `RANK_COLORS`
      // is a semantic severity ramp (cold→warming→trending→viral), not
      // decorative series variety. Everything else below is structural.
      plotOptions: {
        bar: { borderRadius: 3, columnWidth: "60%", distributed: true },
      },
      colors: (data ?? []).map(
        (d) =>
          rankColors(theme.palette.mode)[d.peak_rank] ??
          rankColors(theme.palette.mode).cold,
      ),
      xaxis: {
        categories: (data ?? []).map((d) => {
          const parts = d.date.split("-");
          return `${parts[2]}/${parts[1]}`;
        }),
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            `${val} ${t("temporal.viralRank.clicksUnit")}`,
        },
        x: {
          formatter: (_: unknown, opts?: { dataPointIndex?: number }) => {
            const idx = opts?.dataPointIndex;
            if (idx === undefined || !data) return "";
            const d = data[idx]!;
            const rankLabel = t(`temporal.viralRank.ranks.${d.peak_rank}`);
            return `${d.date} · ${rankLabel}`;
          },
        },
      },
      legend: { show: false },
    }),
    [data, t, theme.palette.mode],
  );

  if (!hasAnyData) return null;

  return (
    <ChartCard
      title={t("temporal.viralRank.title")}
      icon={<Flame {...ICON_MD} />}
      subtitle={t("temporal.viralRank.description")}
    >
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        {(["cold", "warming", "trending", "viral", "unranked"] as const).map(
          (rank) => (
            <Box
              key={rank}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 0.5,
                  bgcolor: rankColors(theme.palette.mode)[rank],
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {t(`temporal.viralRank.ranks.${rank}`)}
              </Typography>
            </Box>
          ),
        )}
      </Box>

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
            borderRadius: `${radiusTokens.sm}px`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Flame size={16} color={theme.palette.error.main} />
          <Typography variant="caption">
            {/* `error.main`, não `error.light`: o tom claro sobre o tint de
                erro a 8% é o par de menor contraste do card — quase branco-rosa
                sobre rosa no tema claro. `main` é o mesmo tom do ícone de chama
                ao lado, então o rótulo e o ícone passam a ler como um par. */}
            <strong style={{ color: theme.palette.error.main }}>
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
    </ChartCard>
  );
}

export default ViralRankMiniChart;
