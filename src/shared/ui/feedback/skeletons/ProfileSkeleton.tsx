import { Box, Stack, Skeleton } from "@mui/material";

import { ResponsiveContainer } from "@/shared/ui/base";

/**
 * One `SectionLabel` + card stub — a small mono-label-shaped bar next to a
 * hairline (echoing `/ LABEL`'s own shape) followed by a rounded block sized
 * to that section's real content.
 *
 * @param props.height - Approximate height (px) of the real card this stands in for.
 */
function SkeletonSection({ height }: { height: number }) {
  return (
    <Stack spacing={1.25}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton
          variant="rounded"
          height={1}
          sx={{ flex: 1, borderRadius: 0 }}
        />
      </Stack>
      <Skeleton variant="rounded" height={height} />
    </Stack>
  );
}

/**
 * Loading placeholder for `/profile`, shown by `AuthGuardRedirect`'s
 * `fallback` and by `ProfilePage` itself while `useProfile()` resolves.
 *
 * "Instrumento técnico" (2026-08-03): matches the page's own stacked
 * full-width layout (`maxWidth="md"`, single column) — this used to mirror
 * a 2-column grid (main settings column + a "sidebar"), which caused a
 * visible layout snap once the real content replaced it after the redesign
 * flattened `ProfilePage` to stacked sections.
 *
 * Review fix (same day): the first version of this rewrite still collapsed
 * multiple real section cards into one flat block (one 180px block for
 * BOTH `ProfileSidebar` cards, one 220px block standing in for
 * `PasswordChangeForm`'s real ~560px) — a *more* pronounced snap for
 * local-account users than the pre-redesign skeleton had. Now renders one
 * {@link SkeletonSection} per real section, in the same order as
 * `ProfilePage`, each with its own label-row stub (mirroring
 * `SectionLabel`'s label+hairline shape) — count and order matter more
 * than exact pixels here, but heights are still ballparked from each
 * section's real content: `ProfileForm` (avatar + one field + button row,
 * ~340), account status (~180), activity (two metric rows, ~220),
 * security (~560 — sized for the local-password `PasswordChangeForm` case,
 * since it's ~4x taller than the Auth0 `OAuthSecurityCard` alternative and
 * this component can't know the account's login method before `useUser`/
 * `useProfile` resolve), preferences (~110), the optional custom-address
 * teaser (~140, only when `NEXT_PUBLIC_SUBDOMAINS_ENABLED` is set — same
 * env read `ProfilePage` itself gates on), and the danger zone (~140).
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

        <SkeletonSection height={340} />
        <SkeletonSection height={180} />
        <SkeletonSection height={220} />
        <SkeletonSection height={560} />
        <SkeletonSection height={110} />
        {process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" ? (
          <SkeletonSection height={140} />
        ) : null}
        <SkeletonSection height={140} />
      </Stack>
    </ResponsiveContainer>
  );
}

export default ProfileSkeleton;
