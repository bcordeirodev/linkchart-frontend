/**
 * Picks a stable 1-letter avatar initial from a display name, or `"?"` when
 * it's blank. Shared by every place that falls back to an initial instead of
 * an uploaded photo — the phone preview, the editor's avatar field, and (via
 * its own copy in `page-components/bio`, a separately-owned module) the
 * published page itself.
 *
 * @param source - the text to derive the initial from (title, or handle as
 * a secondary fallback).
 * @returns a single uppercased character.
 */
export function getAvatarInitial(source: string): string {
  const trimmed = source.trim();
  return trimmed ? trimmed[0]!.toUpperCase() : "?";
}
