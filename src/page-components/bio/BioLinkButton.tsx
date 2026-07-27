import { Box } from "@mui/material";

import type { BioPalette } from "./bioPalette";

interface BioLinkButtonProps {
  /** Button label, shown centered with ellipsis overflow. */
  label: string;
  /** Destination URL — a Link Charts short link; the redirect owns tracking. */
  url: string;
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * A single full-width tappable link rendered as a plain `<a>` (via MUI's
 * `Box component="a"`) — no client JS, no click handler. Click tracking is
 * the redirect route's job (`/r/{slug}`), never this page's; adding an
 * `onClick` here would double-count or race the server-side tracking.
 *
 * Sized for thumbs first: 52px tall is comfortably above the 48px minimum
 * touch target, with a generous 16px radius so the stack reads as soft
 * pills rather than boxy list rows.
 */
export default function BioLinkButton({
  label,
  url,
  palette,
}: BioLinkButtonProps) {
  return (
    <Box
      component="a"
      href={url}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
        px: 3,
        borderRadius: "16px",
        bgcolor: palette.buttonBg,
        border: `1px solid ${palette.buttonBorder}`,
        color: palette.textPrimary,
        textDecoration: "none",
        fontSize: "0.9375rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        textAlign: "center",
        transition:
          "background-color 160ms ease, border-color 160ms ease, transform 160ms ease",
        "@media (prefers-reduced-motion: reduce)": {
          transition: "background-color 160ms ease, border-color 160ms ease",
        },
        "&:hover": {
          bgcolor: palette.buttonBgHover,
        },
        "&:active": {
          bgcolor: palette.buttonBgHover,
          "@media (prefers-reduced-motion: no-preference)": {
            transform: "scale(0.985)",
          },
        },
      }}
    >
      <Box
        component="span"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {label}
      </Box>
    </Box>
  );
}
