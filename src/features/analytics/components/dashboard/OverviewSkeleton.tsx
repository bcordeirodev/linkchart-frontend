"use client";

import { Box, Skeleton, Stack, useTheme } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";
import { getCardSurfaceSx } from "@/shared/ui/base/cardSurface";

/**
 * Loading skeleton that mirrors the Overview tab layout: the metric tile row
 * → 2 chart sections (Temporal / Audience), each with a divider label and two
 * side-by-side charts.
 */
export function OverviewSkeleton() {
  const theme = useTheme();

  return (
    <Box>
      {/* Metric row — mirrors OverviewMetricRow (size="md", 5 metrics, loose
          on the page so NOT `nested`): 2-col grid on xs with the 5th metric
          spanning the full row, one row of equal-width tiles from sm up.
          Since the 2026-08-17 tile redesign each metric is a bordered box —
          the placeholder has to be the box, not a bare pair of text lines,
          or the layout jumps when data lands. `gap` at sm is 1 because 5
          metrics trip the dense step-down. Number skeleton height tracks the
          compact value size (2rem × 1.1 line-height ≈ 36px). */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(5, minmax(0, 1fr))",
          },
          gap: { xs: 1.5, sm: 1 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              minWidth: 0,
              gridColumn: { xs: i === 4 ? "span 2" : "auto", sm: "auto" },
              ...getCardSurfaceSx(theme),
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${radiusTokens.md}px`,
              p: 1.5,
            }}
          >
            <Skeleton variant="text" animation="wave" width="60%" height={18} />
            <Skeleton variant="text" animation="wave" width="80%" height={36} />
          </Box>
        ))}
      </Box>

      {/* 2 chart sections: Temporal, Audience */}
      <Stack spacing={3}>
        {Array.from({ length: 2 }).map((_, sectionIdx) => (
          <Box key={sectionIdx}>
            {/* Section divider with overline label */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
              <Skeleton
                variant="rounded"
                animation="wave"
                width={110}
                height={18}
                sx={{ borderRadius: `${radiusTokens.sm}px` }}
              />
              <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
            </Box>

            {/* Two charts side-by-side */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2, md: 3 },
              }}
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                height={300}
                sx={{ borderRadius: `${radiusTokens.lg}px` }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                height={300}
                sx={{ borderRadius: `${radiusTokens.lg}px` }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
