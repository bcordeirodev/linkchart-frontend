import { Box } from "@mui/material";

import { darkNeutral } from "@/lib/theme/colors/dark";

/**
 * Route-level loading UI for `/@{handle}` (real route `/b/[handle]`).
 *
 * The page blocks on a single upstream fetch; this streams a skeleton
 * immediately instead of a blank tab while it resolves. Shaped like the
 * final page (avatar circle, two text lines, three button bars) so there's
 * no layout jump on hydration.
 *
 * Always renders in the dark palette — the page's payload (and therefore its
 * `theme`) isn't known yet at this point, and dark is the product default.
 * Pure CSS pulse animation, so this stays a Server Component (no
 * `useTheme()`/client JS needed).
 */
export default function BioLoading() {
  const pulseSx = {
    borderRadius: "16px",
    bgcolor: darkNeutral.elevated,
    animation: "bio-skeleton-pulse 1.4s ease-in-out infinite",
    "@keyframes bio-skeleton-pulse": {
      "0%, 100%": { opacity: 0.6 },
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
        px: 2.5,
        pt: { xs: 6, sm: 8 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Box
          sx={{
            ...pulseSx,
            width: 88,
            height: 88,
            borderRadius: "50%",
            mx: "auto",
          }}
        />
        <Box sx={{ ...pulseSx, width: "60%", height: 22, mx: "auto", mt: 3 }} />
        <Box
          sx={{ ...pulseSx, width: "85%", height: 16, mx: "auto", mt: 1.5 }}
        />
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[0, 1, 2].map((index) => (
            <Box key={index} sx={{ ...pulseSx, height: 52, width: "100%" }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
