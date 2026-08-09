"use client";

import { Box, Skeleton, Stack } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";

/**
 * Loading skeleton that mirrors the Overview tab layout: a bare metric row
 * (five hairline-separated numbers, no card) → 2 chart sections (Temporal /
 * Audience), each with a divider label and two side-by-side charts.
 */
export function OverviewSkeleton() {
  return (
    <Box>
      {/* Metric row — mirrors OverviewMetricRow (size="md", 5 metrics):
          2-col grid on xs with the 5th metric spanning the full row,
          single hairline-separated row from sm up. Number skeleton height
          tracks the compact value size (2rem × 1.1 line-height ≈ 36px). */}
      <Box
        sx={{
          display: { xs: "grid", sm: "flex" },
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: { xs: 1.5, sm: 3 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: { sm: 1 },
              minWidth: 0,
              gridColumn: i === 4 ? "span 2" : undefined,
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
