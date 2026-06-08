"use client";
import { Box, Card, Typography } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { TrendingUp, Users, Globe, BarChart3, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { radiusTokens } from "@/lib/theme/designSystem";

/** Props accepted by the {@link OverviewKpiHeader} component. */
interface OverviewKpiHeaderProps {
  /** Total clicks in the active period — the dominant hero metric. */
  totalClicks: number;
  /** Distinct visitors in the active period. */
  uniqueVisitors: number;
  /** Number of countries reached in the active period. */
  countries: number;
  /** Already formatted (e.g. "2") or null when unavailable. */
  avgDaily: string | null;
  /** Already formatted quality label, e.g. "85%". */
  qualityLabel: string;
  /** Hourly (or daily) click counts for the sparkline. */
  sparkline: number[];
  /** Optional period-over-period variation; omit the pill when null. */
  trendPct?: number | null;
}

/**
 * Overview KPI header — Option A: a dominant "hero" metric (total clicks) with a
 * sparkline and optional trend pill on the left, and four compact KPI tiles on
 * the right. Presentational only; LinkDashboard maps the dashboard payload into
 * these resolved props.
 */
export function OverviewKpiHeader({
  totalClicks,
  uniqueVisitors,
  countries,
  avgDaily,
  qualityLabel,
  sparkline,
  trendPct = null,
}: OverviewKpiHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const { t: tl } = useTranslation("links");

  const tiles = [
    {
      label: t("metrics.uniqueVisitors"),
      value: uniqueVisitors.toLocaleString(),
      icon: <Users size={14} />,
      color: theme.palette.primary.main,
    },
    {
      label: t("metrics.countriesReached"),
      value: countries.toString(),
      icon: <Globe size={14} />,
      color: theme.palette.secondary.main,
    },
    {
      label: t("metrics.avgDailyClicks"),
      value: avgDaily ?? t("metrics.noData"),
      icon: <BarChart3 size={14} />,
      color: theme.palette.warning.main,
    },
    {
      label: t("metrics.quality"),
      value: qualityLabel,
      icon: <ShieldCheck size={14} />,
      color: theme.palette.success.main,
    },
  ];

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
          borderRadius: `${radiusTokens.lg}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.info.main, 0.14),
              color: theme.palette.info.main,
              flexShrink: 0,
            }}
          >
            <TrendingUp size={16} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                lineHeight: 1.2,
              }}
            >
              {t("metrics.totalClicks")}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {tl("metrics.totalClicksSubtitle")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.25 }}>
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
          {trendPct != null ? (
            <Box
              component="span"
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
                color: trendPct >= 0 ? "success.main" : "error.main",
                bgcolor: alpha(
                  trendPct >= 0
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  0.12,
                ),
              }}
            >
              {trendPct >= 0 ? "▲" : "▼"} {Math.abs(trendPct)}%
            </Box>
          ) : null}
        </Box>

        <Sparkline data={sparkline} color={theme.palette.info.main} />
      </Card>

      {/* 2×2 compact KPI tiles */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {tiles.map((tile) => (
          <Card
            key={tile.label}
            sx={{
              p: 1.75,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${radiusTokens.lg}px`,
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
                sx={{ color: "text.secondary", fontWeight: 500, minWidth: 0 }}
                noWrap
              >
                {tile.label}
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(tile.color, 0.12),
                  color: tile.color,
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

/** Props accepted by the internal {@link Sparkline} helper. */
interface SparklineProps {
  /** Sequential numeric values plotted left-to-right. */
  data: number[];
  /** Stroke and gradient color (hex/rgb resolved from the theme). */
  color: string;
}

/**
 * Lightweight area sparkline rendered as an inline SVG. Scales to the container
 * width via `preserveAspectRatio="none"`; renders an empty spacer when there is
 * no data so the hero card keeps a stable height.
 */
function Sparkline({ data, color }: SparklineProps) {
  if (!data.length) return <Box sx={{ mt: 2, height: 48 }} />;
  const max = Math.max(...data, 1);
  const step = 320 / Math.max(1, data.length - 1);
  const pts = data.map(
    (v, i) => `${(i * step).toFixed(1)},${(48 - (v / max) * 42).toFixed(1)}`,
  );
  const line = `M${pts.join(" L")}`;
  const area = `${line} L320,48 L0,48 Z`;
  return (
    <Box sx={{ mt: 2 }} aria-hidden="true">
      <svg
        width="100%"
        height="48"
        viewBox="0 0 320 48"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="ovkpi-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.32" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ovkpi-grad)" />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
}

export default OverviewKpiHeader;
