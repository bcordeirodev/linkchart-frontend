"use client";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import ApexChartWrapper from "@/shared/ui/data-display/ApexChartWrapper";
import type { SparklinePoint } from "@/types";

interface LinkSparklineProps {
  data: SparklinePoint[];
  height?: number;
  width?: number | string;
}

/**
 * Tiny click-history area chart for a link card.
 *
 * Rendered in a single muted hue regardless of trend direction — the curve
 * shape already tells the story, and conditional red/green made quiet links
 * read as broken.
 */
export function LinkSparkline({
  data,
  height = 32,
  width = 120,
}: LinkSparklineProps) {
  const theme = useTheme();

  // Um passo mais vivo que o antigo 0.65 — o sparkline é o único elemento
  // gráfico do card e pode carregar cor sem competir com o CTA.
  const color =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.light, 0.95)
      : alpha(theme.palette.primary.main, 0.85);

  const series = useMemo(() => [{ data: data.map((d) => d.clicks) }], [data]);

  const options = useMemo(
    () => ({
      chart: { sparkline: { enabled: true }, animations: { enabled: false } },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.4, opacityTo: 0 },
      },
      colors: [color],
      tooltip: { enabled: false },
      xaxis: { labels: { show: false }, axisBorder: { show: false } },
      yaxis: { labels: { show: false } },
      grid: { show: false },
    }),
    [color],
  );

  if (!data.length) {
    return null;
  }

  return (
    <ApexChartWrapper
      type="area"
      height={height}
      width={width}
      series={series}
      options={options}
    />
  );
}
