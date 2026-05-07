"use client";
import dynamic from "next/dynamic";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ApexOptions } from "apexcharts";

import {
  elevationLightTokens,
  elevationTokens,
  motionTokens,
  radiusTokens,
} from "@/lib/theme/designSystem";

import type { ContinentData } from "@/types/analytics/geographic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false }) as any;

const CONTINENT_COLORS = [
  "#1565C0", "#0288D1", "#00897B", "#558B2F", "#F57F17", "#6A1B9A", "#AD1457",
];

interface ContinentBreakdownProps {
  continents: ContinentData[];
}

export function ContinentBreakdown({ continents }: ContinentBreakdownProps) {
  const theme = useTheme();
  const { t } = useTranslation("analytics");
  const isDark = theme.palette.mode === "dark";

  const cardSx = {
    borderRadius: `${radiusTokens.lg}px`,
    boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
    height: "100%",
    transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
    "&:hover": {
      boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm,
    },
  } as const;

  if (!continents || continents.length === 0) {
    return (
      <Card sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            🌐 {t("geographic.continents.title")}
          </Typography>
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography variant="body2">
              {t("geographic.continents.empty")}
            </Typography>
          </Box>
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
      t(`geographic.continents.${c.continent}`, { defaultValue: c.continent_name })
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
                w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString(),
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
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          🌐 {t("geographic.continents.title")}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ flex: "0 0 120px" }}>
            <ReactApexChart
              type="donut"
              series={series}
              options={options}
              height={130}
            />
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
            {continents.map((c, i) => (
              <Box
                key={c.continent}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 0.5,
                      bgcolor: CONTINENT_COLORS[i] ?? "#888",
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="caption" noWrap sx={{ maxWidth: 120 }}>
                    {t(`geographic.continents.${c.continent}`, { defaultValue: c.continent_name })}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {c.percentage?.toFixed(1) ?? "0"}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ContinentBreakdown;
