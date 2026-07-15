"use client";
/**
 * KPI header for the `/reports` page — a dominant "hero" metric (total clicks
 * across all owned links, with a period-over-period variation pill) plus
 * three compact tiles (unique visitors, active links, average clicks/day).
 *
 * Sibling to `OverviewKpiHeader` (per-link dashboard) but scoped to the
 * aggregated `ReportsSummary` shape. Unlike that component, the variation
 * pill here is always green (up) or red (down) — Reports has no single link
 * to contextualize a drop against, so the sign itself is the useful signal,
 * whereas the per-link dashboard treats a dip as neutral information.
 */

import { Box, Card, Typography } from "@mui/material";
import { alpha, darken, useTheme } from "@mui/material/styles";
import { BarChart3, Link2, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

import type { Theme } from "@mui/material/styles";
import type { ReportsSummary } from "@/features/reports/types";

/** Props accepted by {@link ReportsKpiHeader}. */
interface ReportsKpiHeaderProps {
  /** Aggregated KPIs for the selected period; `null` while loading or on error. */
  summary: ReportsSummary | null;
}

/**
 * Background + foreground colors for the variation pill.
 *
 * Follows the project's "colored chip" rule: white text in dark mode (a
 * lightened tint of the accent over a same-hue tint never separates enough
 * to read), a darkened tone of the accent in light mode — never a pastel
 * accent sitting on a tint of that same accent. `positive` is `null` when
 * there is no prior period to compare against, rendering a neutral pill.
 */
function getVariationPillSx(theme: Theme, positive: boolean | null) {
  const isDark = theme.palette.mode === "dark";

  if (positive === null) {
    return {
      color: "text.disabled",
      bgcolor: alpha(theme.palette.text.disabled, isDark ? 0.16 : 0.1),
    };
  }

  const color = positive
    ? theme.palette.success.main
    : theme.palette.error.main;

  return {
    color: isDark ? theme.palette.common.white : darken(color, 0.3),
    bgcolor: alpha(color, isDark ? 0.16 : 0.1),
  };
}

/**
 * Renders the aggregated KPI header: hero total-clicks card (with variation
 * pill) + unique-visitors / active-links / avg-per-day tiles.
 *
 * Callers are expected to gate loading/error state themselves (see
 * `AnalyticsStateManager` in `ReportsPage`) — this component renders zeros
 * when `summary` is `null` rather than owning its own skeleton, so it never
 * flashes an empty layout mid-fetch.
 */
export function ReportsKpiHeader({ summary }: ReportsKpiHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation("reports");

  const totalClicks = summary?.total_clicks ?? 0;
  const uniqueVisitors = summary?.unique_visitors ?? 0;
  const activeLinks = summary?.active_links ?? 0;
  const totalLinks = summary?.total_links ?? 0;
  const avgPerDay = summary?.avg_clicks_per_day ?? 0;
  const variationPct = summary?.variation_pct ?? null;

  const tiles = [
    {
      key: "uniqueVisitors",
      label: t("kpis.uniqueVisitors"),
      value: uniqueVisitors.toLocaleString(),
      icon: <Users size={14} />,
      color: theme.palette.primary.main,
    },
    {
      key: "activeLinks",
      label: t("kpis.activeLinks"),
      value:
        totalLinks > 0
          ? `${activeLinks.toLocaleString()}/${totalLinks.toLocaleString()}`
          : activeLinks.toLocaleString(),
      icon: <Link2 size={14} />,
      color: theme.palette.success.main,
    },
    {
      key: "avgPerDay",
      label: t("kpis.avgPerDay"),
      value: avgPerDay.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      icon: <BarChart3 size={14} />,
      color: theme.palette.warning.main,
    },
  ];

  const variationSx = getVariationPillSx(
    theme,
    variationPct === null ? null : variationPct >= 0,
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.45fr 1fr" },
        gap: { xs: 2, md: 1.75 },
        mb: 2,
      }}
    >
      {/* Hero — total clicks */}
      <Card
        sx={{
          p: { xs: 2.25, sm: 2.5 },
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${radiusTokens.md}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: `${radiusTokens.sm}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(
                theme.palette.info.main,
                theme.palette.mode === "dark" ? 0.55 : 0.9,
              ),
              color: theme.palette.common.white,
              flexShrink: 0,
            }}
          >
            <TrendingUp size={17} />
          </Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "text.secondary", lineHeight: 1.2 }}
          >
            {t("kpis.totalClicks")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1.25,
            flexWrap: "wrap",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontSize: { xs: "2.2rem", sm: "2.6rem" },
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
              color: "text.primary",
            }}
          >
            {totalClicks.toLocaleString()}
          </Typography>
          <Box
            component="span"
            title={t("kpis.variation")}
            sx={{
              mb: 0.75,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.375,
              borderRadius: 999,
              fontSize: "0.72rem",
              fontWeight: 600,
              ...variationSx,
            }}
          >
            {variationPct === null
              ? "—"
              : `${variationPct >= 0 ? "▲" : "▼"} ${Math.abs(variationPct)}%`}
          </Box>
        </Box>
      </Card>

      {/* Tiles — unique visitors, active links, average per day */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 1.5,
        }}
      >
        {tiles.map((tile) => (
          <Card
            key={tile.key}
            sx={{
              p: 1.75,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${radiusTokens.md}px`,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  whiteSpace: { xs: "normal", sm: "nowrap" },
                  lineHeight: 1.2,
                }}
              >
                {tile.label}
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: `${radiusTokens.sm}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(
                    tile.color,
                    theme.palette.mode === "dark" ? 0.55 : 0.9,
                  ),
                  color: theme.palette.common.white,
                  flexShrink: 0,
                }}
              >
                {tile.icon}
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 600,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                color: "text.primary",
              }}
            >
              {tile.value}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default ReportsKpiHeader;
