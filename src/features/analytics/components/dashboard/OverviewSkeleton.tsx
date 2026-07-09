"use client";

import { Box, Skeleton, Stack } from "@mui/material";

/**
 * Loading skeleton that mirrors the Overview tab layout:
 * link info card → 6 metric cards (3-col) →
 * 3 chart sections (Temporal / Audience / Acquisition),
 * each with a divider label and two side-by-side charts.
 */
export function OverviewSkeleton() {
  return (
    <Box>
      {/* Link info card */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={72}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      {/* 6 metric cards — xs: 2 cols, sm: 2 cols, md: 3 cols */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, md: 3 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            animation="wave"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* 3 chart sections: Temporal, Audience, Acquisition */}
      <Stack spacing={3}>
        {Array.from({ length: 3 }).map((_, sectionIdx) => (
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
