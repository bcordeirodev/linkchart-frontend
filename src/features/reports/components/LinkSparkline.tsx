"use client";
/**
 * Tiny pure-SVG sparkline for the `/reports` leaderboard rows — daily clicks
 * of one link across the window. No ApexCharts here on purpose: ten Apex
 * instances inside a table would cost far more than they're worth; a single
 * `<polyline>` is enough for a trend glance.
 */

import { useTheme } from "@mui/material/styles";

/** Props accepted by {@link LinkSparkline}. */
interface LinkSparklineProps {
  /** Daily click counts, zero-filled, in chronological order. */
  data: number[];
  /** Rendered width in px. */
  width?: number;
  /** Rendered height in px. */
  height?: number;
}

/**
 * Renders the sparkline as a single rounded polyline, scaled to the row's own
 * max (each row shows its own shape, not a cross-row comparison — the Clicks
 * column already does absolute comparison). Renders a muted flat baseline
 * when there is no signal (fewer than 2 points or all zeros).
 */
export function LinkSparkline({
  data,
  width = 96,
  height = 28,
}: LinkSparklineProps) {
  const theme = useTheme();

  const flat = data.length < 2 || data.every((v) => v === 0);
  const max = Math.max(...data, 1);
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data
    .map((v, i) => {
      const x = (i * stepX).toFixed(1);
      const y = (height - 2 - (v / max) * (height - 4)).toFixed(1);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {flat ? (
        <line
          x1={0}
          y1={height - 2}
          x2={width}
          y2={height - 2}
          stroke={theme.palette.divider}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ) : (
        <polyline
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      )}
    </svg>
  );
}

export default LinkSparkline;
