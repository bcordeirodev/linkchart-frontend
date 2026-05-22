/**
 * Converts an arbitrary string (typically an og:title) into a URL-safe slug
 * that satisfies the backend's `alpha_dash` rule and the frontend's regex
 * `/^[a-zA-Z0-9\-_]+$/` with a 3–50 character length constraint.
 *
 * Transformation pipeline:
 *   1. Lowercase
 *   2. NFD-normalise to decompose accented characters
 *   3. Strip Unicode combining marks (diacritics)
 *   4. Keep only ASCII letters, digits, spaces, hyphens, underscores
 *   5. Replace spaces with hyphens
 *   6. Collapse consecutive hyphens/underscores sequences into a single hyphen
 *   7. Trim leading/trailing hyphens and underscores
 *   8. Truncate at 50 characters and trim again
 *
 * Returns an empty string when the result would be shorter than 3 characters
 * (signals "no suggestion available" to callers).
 *
 * @param text - Raw string to slugify (e.g. "Meu Post Incrível! 🚀")
 * @returns Slug string (e.g. "meu-post-incrivel") or `""` if unsluggable.
 *
 * @example
 * slugify("Meu Post Incrível! 🚀 (2024)") // "meu-post-incrivel-2024"
 * slugify("🚀🎉")                         // ""
 * slugify("")                              // ""
 */
export function slugify(text: string): string {
  if (!text) return "";

  const result = text
    .toLowerCase()
    // Decompose accented characters (é → e + combining accent)
    .normalize("NFD")
    // Strip combining diacritical marks
    .replace(/[̀-ͯ]/g, "")
    // Keep only ASCII letters, digits, spaces, hyphens, underscores
    .replace(/[^a-z0-9 \-_]/g, "")
    // Replace whitespace runs with a single hyphen
    .replace(/\s+/g, "-")
    // Collapse consecutive separators into a single hyphen
    .replace(/[-_]{2,}/g, "-")
    // Trim leading/trailing separators
    .replace(/^[-_]+|[-_]+$/g, "")
    // Truncate to max 50 chars
    .slice(0, 50)
    // Trim again after truncation (might have left a trailing hyphen)
    .replace(/^[-_]+|[-_]+$/g, "");

  // Return empty string when below minimum length (backend rejects < 3 chars)
  return result.length >= 3 ? result : "";
}
