// src/shared/ui/base/AnalyticsTabSkeleton.tsx

import { Box, Grid, Skeleton } from "@mui/material";

interface AnalyticsTabSkeletonProps {
  /** Number of metric card skeletons to render. Default: 4 */
  metricCards?: number;
  /** Whether to render a filter bar skeleton at the top. Default: false */
  hasFilter?: boolean;
}

/**
 * Generic analytics tab skeleton rendered while data is loading.
 *
 * Replicates the base layout shared by all analytics tabs:
 * filter bar (optional) → metric cards row → wide chart → two smaller charts.
 *
 * @param metricCards - number of metric card placeholders (default 4)
 * @param hasFilter - render a filter bar placeholder at the top (default false)
 */
export function AnalyticsTabSkeleton({
  metricCards = 4,
  hasFilter = false,
}: AnalyticsTabSkeletonProps) {
  return (
    <Box>
      {hasFilter && (
        <Skeleton
          variant="rounded"
          animation="wave"
          height={52}
          sx={{ mb: 2, borderRadius: 2 }}
        />
      )}

      {/* Metric cards row */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          {Array.from({ length: metricCards }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton
                variant="rounded"
                animation="wave"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Wide chart */}
      <Skeleton
        variant="rounded"
        animation="wave"
        height={280}
        sx={{ mb: 3, borderRadius: 2 }}
      />

      {/* Two smaller charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rounded"
            animation="wave"
            height={220}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rounded"
            animation="wave"
            height={220}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyticsTabSkeleton;
