import { Box } from "@mui/material";

import type { BioPalette } from "./bioPalette";

interface BioLinkButtonProps {
  /** Button label, shown centered, wrapping up to two lines before truncating. */
  label: string;
  /** Destination URL — a Link Charts short link; the redirect owns tracking. */
  url: string;
  /**
   * Destination favicon (preview pipeline), or null/undefined when not
   * fetched yet — the button then renders as a plain pill, no placeholder.
   */
  faviconUrl?: string | null;
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
 * Sized for thumbs first: 52px is a floor, comfortably above the 48px
 * minimum touch target, with a generous 16px radius so the stack reads as
 * soft pills rather than boxy list rows. Labels wrap up to two lines
 * (`-webkit-line-clamp`) instead of truncating at one — a button that needs
 * the extra line just grows taller by itself; the 12px gap between buttons
 * (set by the caller's `Stack spacing`) stays constant either way, so the
 * stack's rhythm never looks broken, just occasionally uneven.
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
        py: 1.25,
        px: 3,
        borderRadius: "16px",
        backgroundColor: palette.buttonBg,
        border: `1px solid ${palette.buttonBorder}`,
        color: palette.textPrimary,
        textDecoration: "none",
        fontSize: "0.9375rem",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        textAlign: "center",
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
      {/* Favicon do destino à esquerda + espaçador simétrico à direita: o
          label continua opticamente centrado no pill, com ou sem ícone. O
          tile segue o padrão do editor (borda + respiro) para o ícone não
          "vazar" sobre o fundo do botão. */}
      {faviconUrl ? (
        <Box
          component="span"
          aria-hidden
          sx={{
            width: 26,
            height: 26,
            mr: 1.5,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            border: `1px solid ${palette.buttonBorder}`,
            backgroundColor: palette.background,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- favicon externo minúsculo; next/image exigiria domínios remotos liberados para todo destino possível */}
          <img
            src={faviconUrl}
            alt=""
            width={16}
            height={16}
            loading="lazy"
            referrerPolicy="no-referrer"
            style={{ objectFit: "contain" }}
          />
        </Box>
      ) : null}
      <Box
        component="span"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        {label}
      </Box>
      {faviconUrl ? (
        <Box
          component="span"
          aria-hidden
          sx={{ width: 26, mr: 0, ml: 1.5, flexShrink: 0 }}
        />
      ) : null}
    </Box>
  );
}
