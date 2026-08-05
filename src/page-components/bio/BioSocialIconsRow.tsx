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
 * Surface and interaction states are `BioLinkButton`'s exact recipe scaled
 * down to a 44px circle — translucent veil + hairline at rest, both stepped
 * one notch on hover/active, the same focus ring — so the row reads as the
 * same system as the items below it. (Before 2026-08-04 this shared the old
 * gradient-border reveal and colored glow instead; the recipe changed, the
 * "identical to a link button" rule did not.) The glyph's own color never
 * changes on interaction — only the circle's chrome does — matching how
 * `BioLinkButton`'s outward arrow stays one constant color throughout.
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
            backgroundColor: palette.surface,
            border: `1px solid ${palette.hairline}`,
            color: palette.textSecondary,
            textDecoration: "none",
            WebkitTapHighlightColor: "transparent",
            transition: "background-color 160ms ease, border-color 160ms ease",
            "&:hover": {
              backgroundColor: palette.surfaceHover,
              borderColor: palette.hairlineStrong,
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
