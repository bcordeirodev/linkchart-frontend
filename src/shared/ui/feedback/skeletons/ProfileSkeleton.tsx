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
 * "Instrumento técnico" (2026-08-03), round 2: mirrors the page's
 * **current** main+side grid (`gridTemplateColumns: {xs:"1fr",
 * lg:"minmax(0,7fr) minmax(0,5fr)"}`) — the exact same breakpoint object
 * `ProfilePage` itself uses, not a hand-tuned approximation, precisely to
 * avoid reintroducing the shape-change bug class an earlier round of this
 * skeleton had (a hardcoded `direction="row"` that didn't match a
 * responsive real component). A prior single-column version of both this
 * skeleton and the real page were rejected at the visual gate ("ficou
 * pobre em informação") in favor of this two-column composition, so the
 * skeleton follows the page back.
 *
 * One {@link SkeletonSection} per real section, in the same column and
 * order as `ProfilePage`, each with its own label-row stub (mirroring
 * `SectionLabel`'s label+hairline shape) — count and order matter more
 * than exact pixels, but heights are still ballparked from each section's
 * real content. LEFT: `ProfileForm` (avatar + one field + button row,
 * ~340), security (~560 — sized for the local-password
 * `PasswordChangeForm` case, since it's ~4x taller than the Auth0
 * `OAuthSecurityCard` alternative and this component can't know the
 * account's login method before `useUser`/`useProfile` resolve),
 * preferences (~110), danger zone (~140). RIGHT: account status (~180),
 * activity (two metric rows, ~220), the optional custom-address teaser
 * (~140, only when `NEXT_PUBLIC_SUBDOMAINS_ENABLED` is set — same env read
 * `ProfilePage` itself gates on).
 */
export function ProfileSkeleton() {
  return (
    <ResponsiveContainer variant="page">
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 7fr) minmax(0, 5fr)",
            },
            gap: { xs: 3, sm: 4 },
            alignItems: "start",
          }}
        >
          <Stack spacing={{ xs: 3, sm: 4 }}>
            <SkeletonSection height={340} />
            <SkeletonSection height={560} />
            <SkeletonSection height={110} />
            <SkeletonSection height={140} />
          </Stack>
          <Stack spacing={{ xs: 3, sm: 4 }}>
            <SkeletonSection height={180} />
            <SkeletonSection height={220} />
            {process.env.NEXT_PUBLIC_SUBDOMAINS_ENABLED === "true" ? (
              <SkeletonSection height={140} />
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </ResponsiveContainer>
  );
}

export default ProfileSkeleton;
