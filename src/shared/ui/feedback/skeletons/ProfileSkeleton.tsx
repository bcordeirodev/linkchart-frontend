import { Box, Stack, Skeleton } from "@mui/material";

import { ResponsiveContainer } from "@/shared/ui/base";

/**
 * Loading placeholder for `/profile`, shown by `AuthGuardRedirect`'s
 * `fallback` and by `ProfilePage` itself while `useProfile()` resolves.
 *
 * "Instrumento técnico" (2026-08-03): matches the page's own stacked
 * full-width layout (`maxWidth="md"`, single column) — this used to mirror
 * a 2-column grid (main settings column + a "sidebar"), which caused a
 * visible layout snap once the real content replaced it after the redesign
 * flattened `ProfilePage` to stacked sections. One rounded block per
 * section, roughly sized to that section's real content, no card chrome
 * (the loading state doesn't need the translucent/hairline card styling —
 * only the real, populated cards do).
 */
export function ProfileSkeleton() {
  return (
    <ResponsiveContainer maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={{ xs: 3, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={160} height={40} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={280} height={18} />
          </Box>
          <Skeleton
            variant="rounded"
            width={100}
            height={32}
            sx={{ borderRadius: 999 }}
          />
        </Box>

        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={180} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={90} />
        <Skeleton variant="rounded" height={110} />
      </Stack>
    </ResponsiveContainer>
  );
}

export default ProfileSkeleton;
