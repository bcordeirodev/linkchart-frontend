"use client";
import dynamic from "next/dynamic";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ApexOptions } from "apexcharts";

import { tDynamic } from "@/lib/i18n/tDynamic";

import { chartPalette } from "@/lib/theme/colors";
import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import { AnalyticsEmptyState } from "@/shared/ui/base";

import type { ContinentData } from "@/types/analytics/geographic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

// Same canonical series palette as every other chart (via ApexChartWrapper) —
// a bespoke rainbow here made this donut look like a different product.
const CONTINENT_COLORS = [...chartPalette];

interface ContinentBreakdownProps {
  continents: ContinentData[];
  /** ISO 2-letter continent code that is currently active as a backend filter. When set, highlights the matching legend row. */
  activeContinentCode?: string | null;
}

export function ContinentBreakdown({
  continents,
  activeContinentCode,
}: ContinentBreakdownProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  if (!continents || continents.length === 0) {
    return (
      <Card sx={cardSx}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Globe size={16} strokeWidth={1.5} />
            {t("geographic.continents.title")}
          </Typography>
          <AnalyticsEmptyState
            icon={<Globe size={32} strokeWidth={1.5} />}
            title={t("geographic.continents.empty")}
            compact
          />
        </CardContent>
      </Card>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 },
    },
    labels: continents.map((c) =>
      tDynamic(t, `geographic.continents.${c.continent}`, {
        defaultValue: c.continent_name ?? c.continent,
      }),
    ),
    colors: CONTINENT_COLORS.slice(0, continents.length),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: [isDark ? "#161b27" : "#ffffff"] },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) =>
          `${val.toLocaleString()} ${t("geographic.continents.clicks")}`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("geographic.continents.total"),
              formatter: (w: { globals: { seriesTotals: number[] } }) =>
                w.globals.seriesTotals
                  .reduce((a, b) => a + b, 0)
                  .toLocaleString(),
              color: theme.palette.text.primary,
              fontSize: "13px",
              fontFamily: theme.typography.fontFamily,
            },
          },
        },
      },
    },
    theme: { mode: isDark ? "dark" : "light" },
  };

  const series = continents.map((c) => c.clicks);

  return (
    <Card sx={cardSx}>
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Globe size={16} strokeWidth={1.5} />
          {t("geographic.continents.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t("geographic.continents.subtitle")}
        </Typography>

        {/* Stacks below 360px+ (donut centered on top, legend full-width below) so
            continent names never fight the chart for horizontal space; sits side
            by side from `sm` up where there is room for both. */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box
            sx={{ flex: "0 0 120px", alignSelf: { xs: "center", sm: "auto" } }}
          >
            <ReactApexChart
              type="donut"
              series={series}
              options={options}
              height={130}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {continents.map((c, i) => {
              const isActive = activeContinentCode === c.continent;
              return (
                <Box
                  key={c.continent}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: isActive ? "action.selected" : "transparent",
                    outline: isActive
                      ? `1px solid ${theme.palette.primary.main}40`
                      : "none",
                    transition: "background-color 0.15s",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: 0.5,
                        bgcolor: CONTINENT_COLORS[i] ?? "#888",
                        flexShrink: 0,
                      }}
                    />
                    {/* No fixed maxWidth — the label takes whatever the flex row has
                        left after the swatch and percentage, so long names like
                        "América do Norte" render in full instead of clipping at an
                        arbitrary 120px regardless of the card's actual width. */}
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ minWidth: 0, fontWeight: isActive ? 700 : 400 }}
                    >
                      {tDynamic(t, `geographic.continents.${c.continent}`, {
                        defaultValue: c.continent_name ?? c.continent,
                      })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color={isActive ? "primary" : "text.secondary"}
                    sx={{ fontWeight: 600, flexShrink: 0 }}
                  >
                    {c.percentage?.toFixed(1) ?? "0"}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ContinentBreakdown;
