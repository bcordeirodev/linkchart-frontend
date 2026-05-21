import { Box, Stack, Skeleton } from "@mui/material";

import { ResponsiveContainer, EnhancedPaper } from "@/shared/ui/base";

export function ProfileSkeleton() {
  return (
    <ResponsiveContainer variant="page">
      <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={160} height={32} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={280} height={18} />
          </Box>
          <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 999 }} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 2fr) minmax(0, 1fr)" },
            gap: { xs: 2, sm: 3 },
            width: "100%",
          }}
        >
          <Stack spacing={{ xs: 2, sm: 3 }}>
              <EnhancedPaper variant="glass">
                <Box sx={{ p: 3 }}>
                  <Skeleton
                    variant="text"
                    width={200}
                    height={32}
                    sx={{ mb: 3 }}
                  />
                  <Stack spacing={2.5}>
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                  </Stack>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Skeleton variant="rounded" width={100} height={40} />
                    <Skeleton variant="rounded" width={120} height={40} />
                  </Box>
                </Box>
              </EnhancedPaper>

              <EnhancedPaper variant="glass">
                <Box sx={{ p: 3 }}>
                  <Skeleton
                    variant="text"
                    width={180}
                    height={32}
                    sx={{ mb: 3 }}
                  />
                  <Stack spacing={2.5}>
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                  </Stack>
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Skeleton variant="rounded" width={150} height={40} />
                  </Box>
                </Box>
              </EnhancedPaper>
          </Stack>

          <EnhancedPaper variant="glass">
              <Box sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={120}
                    height={120}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton variant="text" width={150} height={32} />
                  <Skeleton variant="text" width={200} height={20} />
                </Box>

                <Stack spacing={2}>
                  <Box>
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="90%" height={24} />
                  </Box>
                  <Box>
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="70%" height={24} />
                  </Box>
                  <Box>
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={20}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="80%" height={24} />
                  </Box>
                </Stack>
              </Box>
          </EnhancedPaper>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
}

export default ProfileSkeleton;
