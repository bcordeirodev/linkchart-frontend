/**
 * Brand tints for the social platforms the referer classifier can identify,
 * co-located with {@link SocialBrandIcon} — the glyph and the color of a
 * platform are one fact, and keeping them in separate modules is how they
 * drift apart.
 *
 * Moved here from `SocialPlatformSection` (analytics/audience), which owned
 * the only copy while three surfaces needed it: that section's bars, the UTM
 * source list in the Origem tab, and the `social_platform` dimension of
 * `/reports`' breakdown.
 */

/** Canonical brand hex per platform key, as emitted by the referer classifier. */
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c",
  tiktok: "#69C9D0",
  facebook: "#1877f2",
  youtube: "#ff0000",
  twitter: "#1da1f2",
  whatsapp: "#25d366",
  telegram: "#0088cc",
  linkedin: "#0077b5",
};

/**
 * Light-mode overrides for the three brand colors that fail WCAG non-text
 * contrast on the light card `#E3E6EA` (tiktok 1.54:1, whatsapp 1.58:1,
 * twitter 2.26:1). Each override is a darker shade of the same brand hue
 * (3.44–3.83:1 measured) — recognizable, and every consumer also renders the
 * brand glyph plus the platform name, so color is never the sole identifier.
 * The other five brands already clear 3:1 and keep their canonical hex in
 * both modes.
 */
const PLATFORM_COLORS_LIGHT: Record<string, string> = {
  tiktok: "#0F7E8B",
  twitter: "#0C7ABF",
  whatsapp: "#128C4A",
};

/**
 * Resolves the platform → brand color map for the active color mode.
 *
 * @param mode - `theme.palette.mode`; light merges the contrast overrides.
 * @returns the full map to read a platform key against.
 */
export function socialBrandColors(
  mode: "light" | "dark",
): Record<string, string> {
  return mode === "light"
    ? { ...PLATFORM_COLORS, ...PLATFORM_COLORS_LIGHT }
    : PLATFORM_COLORS;
}

/**
 * Brand tint for a single platform key, or `null` when the platform has no
 * known mark — the same contract as {@link SocialBrandIcon}, so a caller can
 * test one and trust the other: if there is a glyph there is a tint, and if
 * there is neither the row stays on its neutral/categorical color.
 *
 * @param platform - Platform key (e.g. `"instagram"`). Case-insensitive.
 * @param mode - `theme.palette.mode`.
 * @returns the brand hex, or `null` for an unknown platform.
 */
export function socialBrandColor(
  platform: string,
  mode: "light" | "dark",
): string | null {
  return socialBrandColors(mode)[platform.toLowerCase()] ?? null;
}
