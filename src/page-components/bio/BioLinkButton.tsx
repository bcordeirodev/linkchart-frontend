import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Box } from "@mui/material";

import { BioItemFavicon } from "./BioItemFavicon";

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
 * click take me" answer — and an outward arrow that nudges on hover. Rows
 * are left-aligned on purpose: two lines of real information read as a
 * card, and centered pills are exactly the template look this page moves
 * away from.
 *
 * Hover/focus reuse the avatar's gradient as a border that "lights up" via
 * the standard double-background clip trick (`backgroundOrigin: border-box`
 * + `backgroundClip: padding-box, border-box`) — the same accent as the
 * signature avatar glow, spent a second time on purpose so the page reads
 * as one system, not scattered decoration.
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
        borderRadius: "16px",
        backgroundColor: palette.buttonBg,
        border: `1px solid ${palette.buttonBorder}`,
        color: palette.textPrimary,
        textDecoration: "none",
        WebkitTapHighlightColor: "transparent",
        transition:
          "transform 160ms ease, box-shadow 200ms ease, background-color 160ms ease, border-color 160ms ease",
        "@media (prefers-reduced-motion: reduce)": {
          transition:
            "box-shadow 200ms ease, background-color 160ms ease, border-color 160ms ease",
        },
        "&:hover": {
          backgroundColor: palette.buttonBgHover,
          borderColor: "transparent",
          backgroundImage: `linear-gradient(${palette.buttonBgHover}, ${palette.buttonBgHover}), ${palette.avatarGradient}`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: `0 10px 24px -12px ${palette.interactiveGlow}`,
          "@media (prefers-reduced-motion: no-preference)": {
            transform: "translateY(-1px)",
          },
          "& [data-bio-arrow]": {
            opacity: 1,
            transform: "translate(2px, -2px)",
          },
        },
        "&:focus-visible": {
          outline: `2px solid ${palette.focusRing}`,
          outlineOffset: 2,
        },
        "&:active": {
          backgroundColor: palette.buttonBgHover,
          boxShadow: `0 4px 14px -10px ${palette.interactiveGlow}`,
          "@media (prefers-reduced-motion: no-preference)": {
            transform: "translateY(0) scale(0.985)",
          },
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
              mt: 0.25,
              fontSize: "0.8125rem",
              fontWeight: 500,
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
          transition: "opacity 160ms ease, transform 160ms ease",
          "@media (prefers-reduced-motion: reduce)": {
            transition: "opacity 160ms ease",
          },
        }}
      />
    </Box>
  );
}
