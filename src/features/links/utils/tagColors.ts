import type { Tag } from "@/types";

/**
 * Fixed 8-color palette assigned to newly-created tags. Desaturated,
 * "business" tones chosen to read well as chip backgrounds in both dark
 * and light mode (see `getTagChipSx` in `linksPanelStyles.ts`).
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
