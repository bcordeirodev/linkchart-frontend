import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Box } from "@mui/material";

import { radiusTokens } from "@/lib/theme/designSystem";

import { BioItemFavicon } from "./BioItemFavicon";
import { BIO_FONT_MONO } from "./bioPalette";

import type { BioPalette } from "./bioPalette";

interface BioLinkButtonProps {
  /** Button label — the row's first line, bold, truncating at one line. */
  label: string;
  /** Destination URL — a Link Charts short link; the redirect owns tracking. */
  url: string;
  /**
   * Destination favicon (preview pipeline), or null/undefined when not
   * fetched yet — the tile then falls back to the label's initial, so every
   * row keeps the same anchor and rhythm.
   */
  faviconUrl?: string | null;
  /**
   * Host of the final destination ("github.com") — the row's second line,
   * the trust signal no generic link-in-bio shows. Omitted line when absent
   * (older cached payloads).
   */
  destinationHost?: string | null;
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * A single full-width tappable link rendered as a plain `<a>` (via MUI's
 * `Box component="a"`) — no client JS, no click handler. Click tracking is
 * the redirect route's job (`/r/{slug}`), never this page's; adding an
 * `onClick` here would double-count or race the server-side tracking. Every
 * interaction state below is pure CSS (`sx`'s `&:hover`/`&:active`/
 * `&:focus-visible`), so this stays a zero-JS anchor.
 *
 * Row anatomy, left to right: a 38px favicon tile (initial fallback), the
 * text block — label above, destination host below, the "where does this
 * click take me" answer — and an outward arrow marking the row as external.
 * Rows are left-aligned on purpose: two lines of real information read as a
 * card, and centered pills are exactly the template look this page moves
 * away from.
 *
 * The row is the page's card grammar, verbatim: a translucent veil
 * (`palette.surface`, the app's shared `surfaceOverlayTokens.card` alpha)
 * over the flat canvas, raised by a 1px hairline, cornered with the app's
 * container radius (`radiusTokens.lg`). Hover and active step the *same two*
 * properties one notch (veil → `surfaceHover`, hairline → `hairlineStrong`)
 * instead of the violet-blue gradient border and colored drop-glow this row
 * carried until 2026-08-04 — an instrument reacts, it doesn't light up.
 *
 * The destination host is set in JetBrains Mono: the product's mono is
 * reserved for technical text (slugs, URLs, chart axes), and a host is
 * exactly that — it also makes the trust signal visually distinct from the
 * creator's own label above it.
 */
export default function BioLinkButton({
  label,
  url,
  faviconUrl,
  destinationHost,
  palette,
}: BioLinkButtonProps) {
  const initial = (label.trim()[0] ?? "•").toUpperCase();
  // Host exibido sempre limpo: minúsculo e sem "www." — é selo de confiança,
  // não URL técnica.
  const displayHost = destinationHost
    ? destinationHost.toLowerCase().replace(/^www\./, "")
    : null;

  return (
    <Box
      component="a"
      href={url}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.75,
        minHeight: 64,
        py: 1.5,
        px: 2,
        borderRadius: `${radiusTokens.lg}px`,
        backgroundColor: palette.surface,
        border: `1px solid ${palette.hairline}`,
        color: palette.textPrimary,
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "background-color 160ms ease, border-color 160ms ease",
        "&:hover": {
          backgroundColor: palette.surfaceHover,
          borderColor: palette.hairlineStrong,
          "& [data-bio-arrow]": { opacity: 0.85 },
        },
        "&:focus-visible": {
          outline: `2px solid ${palette.focusRing}`,
          outlineOffset: 2,
        },
        "&:active": {
          backgroundColor: palette.surfaceHover,
          borderColor: palette.hairlineStrong,
        },
      }}
    >
      {/* Tile do favicon com fallback de inicial: toda linha tem a mesma
          âncora visual, com ou sem preview buscado. Componente próprio (ver
          BioItemFavicon) para isolar o único pedaço client-side (onError)
          desta linha, que continua um Server Component zero-JS. */}
      <BioItemFavicon
        faviconUrl={faviconUrl}
        initial={initial}
        palette={palette}
      />

      <Box component="span" sx={{ minWidth: 0, flex: "1 1 auto" }}>
        <Box
          component="span"
          sx={{
            display: "block",
            fontSize: "0.9375rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Box>
        {displayHost ? (
          <Box
            component="span"
            sx={{
              display: "block",
              mt: 0.375,
              fontFamily: BIO_FONT_MONO,
              fontSize: "0.75rem",
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              color: palette.textSecondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayHost}
          </Box>
        ) : null}
      </Box>

      <ArrowOutwardIcon
        data-bio-arrow
        aria-hidden
        sx={{
          fontSize: 18,
          flexShrink: 0,
          color: palette.textSecondary,
          opacity: 0.45,
          transition: "opacity 160ms ease",
        }}
      />
    </Box>
  );
}
