import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { darkNeutral } from "@/lib/theme/colors/dark";
import { radiusTokens, surfaceOverlayTokens } from "@/lib/theme/designSystem";

/**
 * Route-level loading UI for `/@{handle}` (real route `/b/[handle]`).
 *
 * The page blocks on a single upstream fetch; this streams a skeleton
 * immediately instead of a blank tab while it resolves. Shaped like the
 * final page (avatar circle, two text lines, three item rows) — including
 * the avatar's responsive size (see `BioAvatar`'s `AVATAR_SIZE`) and the
 * rows' 64px height (`BioLinkButton`'s `minHeight`) — so there's no layout
 * jump when the real content lands.
 *
 * Uses the page's own surface grammar rather than a lighter grey block: the
 * same translucent veil (`surfaceOverlayTokens.card`) and 1px hairline the
 * real rows carry, pulsing in opacity. A placeholder a step *lighter* than
 * the surface it stands in for reads as a different design; this one reads
 * as the page, unresolved.
 *
 * Always renders in the dark palette — the page's payload (and therefore its
 * `theme`) isn't known yet at this point, and dark is the product default.
 * Pure CSS pulse animation, so this stays a Server Component (no
 * `useTheme()`/client JS needed).
 */
export default function BioLoading() {
  const pulseSx = {
    borderRadius: `${radiusTokens.lg}px`,
    bgcolor: alpha("#FFFFFF", surfaceOverlayTokens.card.dark),
    border: `1px solid ${darkNeutral.border.default}`,
    animation: "bio-skeleton-pulse 1.4s ease-in-out infinite",
    "@keyframes bio-skeleton-pulse": {
      "0%, 100%": { opacity: 0.55 },
      "50%": { opacity: 1 },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        bgcolor: darkNeutral.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 3,
        pt: { xs: 5.5, sm: 7 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Box
          sx={{
            ...pulseSx,
            width: { xs: 108, sm: 116 },
            height: { xs: 108, sm: 116 },
            borderRadius: "50%",
            mx: "auto",
          }}
        />
        <Box
          sx={{ ...pulseSx, width: "60%", height: 24, mx: "auto", mt: 2.5 }}
        />
        <Box
          sx={{ ...pulseSx, width: "85%", height: 16, mx: "auto", mt: 1.5 }}
        />
        <Box
          sx={{ mt: 4.5, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {[0, 1, 2].map((index) => (
            <Box key={index} sx={{ ...pulseSx, height: 64, width: "100%" }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
