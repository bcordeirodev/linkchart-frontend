import { Box, Stack, Skeleton, Container, Grid, Divider } from "@mui/material";

import { PublicLayout } from "@/shared/layout";

export function PublicAnalyticsSkeleton() {
  const cardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "12px",
    p: { xs: "18px", md: "20px" },
  } as const;

  const chartCardSx = {
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "12px",
    p: 2,
  } as const;

  return (
    <PublicLayout variant="shorter" chrome="minimal">
      <Container
        maxWidth="md"
        sx={{ pt: { xs: 7, md: 8 }, pb: { xs: 6, md: 8 } }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          {/* Page header */}
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
              sx={{ mx: "auto" }}
            />
          </Box>

          {/* LinkHeroCard skeleton */}
          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: { xs: "24px", md: "28px" },
                pb: { xs: "20px", md: "24px" },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Skeleton
                  variant="rounded"
                  width={36}
                  height={36}
                  sx={{ borderRadius: "10px", flexShrink: 0 }}
                />
                <Box>
                  <Skeleton
                    variant="text"
                    width={140}
                    height={20}
                    sx={{ mb: 0.25 }}
                  />
                  <Skeleton variant="text" width={200} height={16} />
                </Box>
              </Box>
              <Skeleton
                variant="rounded"
                height={52}
                sx={{ mb: 2, borderRadius: "12px" }}
              />
              <Skeleton variant="text" width="65%" height={20} />
            </Box>

            <Divider />

            <Box sx={{ p: { xs: "20px 24px", md: "22px 28px" } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Skeleton variant="rounded" width={15} height={15} />
                <Skeleton variant="text" width={160} height={22} />
              </Box>
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ mb: 2, borderRadius: "8px" }}
              />
              <Skeleton
                variant="rounded"
                height={48}
                sx={{ borderRadius: "10px" }}
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
            <Box sx={{ ...cardSx, gridColumn: { xs: "span 2", md: "span 1" } }}>
              <Skeleton
                variant="text"
                width={100}
                height={16}
                sx={{ mb: 1.25 }}
              />
              <Skeleton variant="text" width="55%" height={52} />
              <Skeleton variant="text" width={140} height={14} sx={{ mt: 1 }} />
            </Box>
            <Box sx={cardSx}>
              <Skeleton
                variant="text"
                width={60}
                height={16}
                sx={{ mb: 1.25 }}
              />
              <Skeleton
                variant="rounded"
                width={72}
                height={26}
                sx={{ borderRadius: "999px", mt: 0.5 }}
              />
              <Skeleton variant="text" width={90} height={14} sx={{ mt: 1 }} />
            </Box>
            <Box sx={cardSx}>
              <Skeleton
                variant="text"
                width={80}
                height={16}
                sx={{ mb: 1.25 }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={24}
                sx={{ mt: 0.25 }}
              />
              <Skeleton variant="text" width={60} height={14} sx={{ mt: 1 }} />
            </Box>
          </Box>

          {/* PublicCharts — section label + area chart + 2×bar + 2×donut */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Skeleton variant="rounded" width={14} height={14} />
              <Skeleton variant="text" width={80} height={18} />
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
        </Stack>
      </Container>
    </PublicLayout>
  );
}

export default PublicAnalyticsSkeleton;
