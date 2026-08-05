import { Box } from "@mui/material";

import { SocialPlatformIcon } from "@/shared/ui/icons";

import type { BioLinkItem } from "./types";
import type { BioPalette } from "./bioPalette";

export interface BioSocialIconsRowProps {
  /**
   * Items to render as icons — callers pass only the `display === "icon"`
   * subset (see `BioPublicPage`'s split of `data.items`), already in
   * position order.
   */
  items: BioLinkItem[];
  /** Resolved color set for the page's theme. */
  palette: BioPalette;
}

/**
 * Centered horizontal row of round icon buttons — the bio page's social
 * links (Instagram, TikTok, ...) — rendered under the bio text and above the
 * full-width item buttons, per the product decision that icons read as part
 * of the person's identity block rather than as content in the items list.
 *
 * Each icon IS the underlying item's tracked link: a plain `<a>` to the same
 * Link Charts short URL every `BioLinkButton` opens, so a tap goes through
 * the exact same `/r/{slug}` redirect + click tracking, no special-casing.
 * Zero client JS, same as `BioLinkButton` — every interaction state below is
 * pure CSS.
 *
 * Hover/focus reuse `BioLinkButton`'s exact recipe (the gradient-border
 * reveal via the double-background clip trick, the same glow/translate on
 * hover, the same focus ring) scaled down to a 44px circle — the same accent
 * spent a third time (avatar, link buttons, now icons) so the page reads as
 * one system. The glyph's own color never changes on interaction — only the
 * circle's chrome does — matching how `BioLinkButton`'s outward arrow stays
 * one constant color throughout.
 *
 * Renders nothing when `items` is empty, so callers can include it
 * unconditionally without an extra length check.
 */
export function BioSocialIconsRow({ items, palette }: BioSocialIconsRowProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 1.25,
        width: "100%",
        // The parent (`BioPublicPage`) is a plain flex column with no
        // `Stack`-style automatic gap — every sibling here carries its own
        // `mt` inline (title `2.5`, bio text `1.25`). Baked in here, not
        // applied at the call site, so this component still renders nothing
        // (zero DOM footprint, no stray margin) when `items` is empty.
        mt: 2.5,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.id}
          component="a"
          href={item.url}
          aria-label={item.label || item.destination_host || item.url}
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: palette.buttonBg,
            border: `1px solid ${palette.buttonBorder}`,
            color: palette.textSecondary,
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
            },
            "&:focus-visible": {
              outline: `2px solid ${palette.focusRing}`,
              outlineOffset: 2,
            },
            "&:active": {
              backgroundColor: palette.buttonBgHover,
              boxShadow: `0 4px 14px -10px ${palette.interactiveGlow}`,
              "@media (prefers-reduced-motion: no-preference)": {
                transform: "translateY(0) scale(0.96)",
              },
            },
          }}
        >
          <SocialPlatformIcon
            platform={item.social_platform ?? "website"}
            size={20}
          />
        </Box>
      ))}
    </Box>
  );
}

export default BioSocialIconsRow;
