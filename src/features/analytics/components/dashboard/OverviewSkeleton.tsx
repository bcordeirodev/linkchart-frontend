"use client";

import { Box, Skeleton, Stack } from "@mui/material";

/**
 * Loading skeleton that mirrors the Overview tab layout: a bare metric row
 * (five hairline-separated numbers, no card) → 2 chart sections (Temporal /
 * Audience), each with a divider label and two side-by-side charts.
 */
export function OverviewSkeleton() {
  return (
    <Box>
      {/* Metric row — 5 hairline-separated numbers, no card/icon-chip,
          mirroring OverviewMetricRow's own layout. */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" animation="wave" width="60%" height={20} />
            <Skeleton variant="text" animation="wave" width="80%" height={44} />
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
                sx={{ borderRadius: 1 }}
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
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rounded"
                animation="wave"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
