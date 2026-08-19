import type { Tag } from "@/types";

/**
 * Fixed 8-color palette assigned to newly-created tags. Every entry sits in
 * the mid-luminance band (~45–60% relative luminance) on purpose: light
 * enough to survive `alpha(color, 0.25)` over the dark canvas, dark enough
 * that `darken(color, 0.35)` stays readable as text on the light theme — the
 * two recipes in `getTagChipSx` (`linksPanelStyles.ts`). Hues are spaced
 * around the wheel so adjacent tags never read as the same swatch:
 *
 * - `#4E82E6` azure — the family of the primary blue, the default first pick.
 * - `#2FA47A` emerald — desaturated so it never reads as a success state.
 * - `#C98A2B` ochre — warm/amber slot, muted to stay clear of the warning orange.
 * - `#B85C8A` mulberry — magenta slot, dulled so it does not shout on dark.
 * - `#7B68C9` violet — bridges the blue and magenta slots.
 * - `#3C9FB0` teal — cyan slot, dark enough to hold text on the light theme.
 * - `#C96A50` terracotta — red-orange slot, kept off the error red.
 * - `#8A8F5C` olive — the one low-chroma neutral, for "misc"-style tags.
 */
export const TAG_COLOR_PALETTE = [
  "#4E82E6",
  "#2FA47A",
  "#C98A2B",
  "#B85C8A",
  "#7B68C9",
  "#3C9FB0",
  "#C96A50",
  "#8A8F5C",
] as const;

/** Exactly the 7-char hex form the backend `TagResource` promises. */
const TAG_COLOR_HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

/**
 * Guards every tag color before it reaches a MUI color helper.
 *
 * `alpha()`/`darken()` **throw** (`MUI: Unsupported \`x\` color.`) on anything
 * that is not a parseable color, so an empty, `null` or legacy 3-char value
 * coming back from the API would take down the entire links list — not just
 * the one chip. Anything that is not a strict 7-char hex falls back to the
 * caller-supplied color (in practice `theme.palette.primary.main`).
 *
 * @param color - raw `Tag.color` as received from the API.
 * @param fallback - color used when `color` is missing or malformed.
 * @returns a color string that is always safe to hand to MUI.
 */
export function sanitizeTagColor(
  color: string | null | undefined,
  fallback: string,
): string {
  return color && TAG_COLOR_HEX_PATTERN.test(color) ? color : fallback;
}

/**
 * Picks the least-used color in {@link TAG_COLOR_PALETTE} among a user's
 * existing tags, so new tags spread across the palette instead of clustering
 * on the first color. Ties resolve to the earliest palette entry.
 *
 * @param existingTags - the user's current tags (from `useTags()`).
 * @returns a hex color from `TAG_COLOR_PALETTE`.
 */
export function pickLeastUsedTagColor(existingTags: Tag[]): string {
  const usageCount = new Map<string, number>(
    TAG_COLOR_PALETTE.map((color) => [color, 0]),
  );

  for (const tag of existingTags) {
    const normalized = tag.color?.toLowerCase();
    const match = TAG_COLOR_PALETTE.find(
      (color) => color.toLowerCase() === normalized,
    );
    if (match) {
      usageCount.set(match, (usageCount.get(match) ?? 0) + 1);
    }
  }

  let leastUsedColor: string = TAG_COLOR_PALETTE[0];
  let minCount = Infinity;

  for (const color of TAG_COLOR_PALETTE) {
    const count = usageCount.get(color) ?? 0;
    if (count < minCount) {
      minCount = count;
      leastUsedColor = color;
    }
  }

  return leastUsedColor;
}
