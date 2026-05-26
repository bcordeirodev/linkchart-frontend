import {
  Box,
  Stack,
  Skeleton,
  Container,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import {
  getPublicInsetSx,
  getPublicMetricCardSx,
  getPublicPanelSx,
  publicHairline,
} from "@/lib/theme/publicPageStyles";
import { PublicLayout } from "@/shared/layout";

interface PublicAnalyticsSkeletonProps {
  /** Use true when skeleton is rendered inside `/shorter` layout. */
  embedded?: boolean;
  /** Mirrors `PublicAnalyticsSections.showPageHeading`. */
  showPageHeading?: boolean;
}

export function PublicAnalyticsSkeleton({
  embedded = false,
  showPageHeading = true,
}: PublicAnalyticsSkeletonProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardSx = getPublicMetricCardSx(theme);
  const accentCardSx = getPublicMetricCardSx(theme, true);
  const heroCardSx = getPublicPanelSx(theme);
  const insetSx = getPublicInsetSx(theme);
  const chartCardSx = { ...getPublicInsetSx(theme), p: 2 } as const;
  const dividerColor = publicHairline(theme);

  const content = (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      {showPageHeading ? (
        <Box sx={{ textAlign: "center", mt: { xs: 1, md: 2 }, mb: 0.5 }}>
          <Skeleton
            variant="text"
            width={280}
            height={48}
            sx={{ mx: "auto", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width={350}
            height={24}
            sx={{ mx: "auto", maxWidth: "92%" }}
          />
        </Box>
      ) : null}

      {/* LinkHeroCard skeleton */}
      <Box
        sx={{
          ...heroCardSx,
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: { xs: "20px", md: "24px" },
            display: "grid",
            gap: 2.25,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Skeleton
              variant="rounded"
              width={36}
              height={36}
              sx={{
                borderRadius: "10px",
                flexShrink: 0,
                bgcolor: alpha(theme.palette.common.white, isDark ? 0.11 : 0.6),
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Skeleton
                variant="text"
                width={130}
                height={22}
                sx={{ mb: 0.25 }}
              />
              <Skeleton
                variant="rounded"
                width={190}
                height={20}
                sx={{ borderRadius: 999 }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 0.9,
            }}
          >
            <Skeleton variant="text" width={96} height={16} />
            <Skeleton
              variant="rounded"
              height={50}
              sx={{ ...insetSx, borderRadius: "10px", bgcolor: "action.hover" }}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 0.9,
            }}
          >
            <Skeleton variant="text" width={110} height={16} />
            <Skeleton
              variant="rounded"
              height={44}
              sx={{ ...insetSx, borderRadius: "8px", bgcolor: "action.hover" }}
            />
          </Box>

          <Skeleton
            variant="rounded"
            height={44}
            sx={{
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.45)}, ${alpha(theme.palette.secondary.main, 0.4)})`,
            }}
          />
        </Box>
      </Box>

      {/* PublicMetrics — mirrors CSS grid: xs "1fr 1fr", md "2fr 1fr 1fr" */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 1fr 1fr" },
          gap: { xs: "10px", md: "12px" },
        }}
      >
        <Box
          sx={{ ...accentCardSx, gridColumn: { xs: "span 2", md: "span 1" } }}
        >
          <Skeleton variant="text" width={100} height={16} sx={{ mb: 1.25 }} />
          <Skeleton variant="text" width="55%" height={52} />
          <Skeleton variant="text" width={140} height={14} sx={{ mt: 1 }} />
        </Box>
        <Box sx={cardSx}>
          <Skeleton variant="text" width={60} height={16} sx={{ mb: 1.25 }} />
          <Skeleton
            variant="rounded"
            width={72}
            height={26}
            sx={{ borderRadius: "999px", mt: 0.5 }}
          />
          <Skeleton variant="text" width={90} height={14} sx={{ mt: 1 }} />
        </Box>
        <Box sx={cardSx}>
          <Skeleton variant="text" width={80} height={16} sx={{ mb: 1.25 }} />
          <Skeleton variant="text" width={100} height={24} sx={{ mt: 0.25 }} />
          <Skeleton variant="text" width={60} height={14} sx={{ mt: 1 }} />
        </Box>
      </Box>

      {/* PublicCharts — section label + area chart + 2×bar + 2×donut */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={14} height={14} />
          <Skeleton variant="text" width={110} height={18} />
        </Box>

        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          <Grid item xs={12}>
            <Box sx={chartCardSx}>
              <Skeleton
                variant="text"
                width={140}
                height={20}
                sx={{ mb: 1.5 }}
              />
              <Skeleton variant="rounded" height={160} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={chartCardSx}>
              <Skeleton
                variant="text"
                width={120}
                height={20}
                sx={{ mb: 1.5 }}
              />
              <Skeleton variant="rounded" height={140} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={chartCardSx}>
              <Skeleton
                variant="text"
                width={110}
                height={20}
                sx={{ mb: 1.5 }}
              />
              <Skeleton variant="rounded" height={140} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={chartCardSx}>
              <Skeleton
                variant="text"
                width={80}
                height={20}
                sx={{ mb: 1.5 }}
              />
              <Skeleton variant="rounded" height={140} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={chartCardSx}>
              <Skeleton
                variant="text"
                width={90}
                height={20}
                sx={{ mb: 1.5 }}
              />
              <Skeleton variant="rounded" height={140} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* PublicCtaBlock */}
      <Box
        sx={{
          ...getPublicPanelSx(theme),
          p: { xs: 2.5, md: 3 },
          borderRadius: "14px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
          <Skeleton
            variant="rounded"
            width={36}
            height={36}
            sx={{ borderRadius: "10px" }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={180} height={22} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="74%" height={18} />
          </Box>
        </Box>
        <Divider sx={{ borderColor: dividerColor, my: 2 }} />
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {[96, 120, 104, 132].map((w, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={w}
              height={28}
              sx={{ borderRadius: 8 }}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );

  if (embedded) {
    return content;
  }

  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        {content}
      </Container>
    </PublicLayout>
  );
}

export default PublicAnalyticsSkeleton;
