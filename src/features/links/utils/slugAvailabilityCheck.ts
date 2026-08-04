import { ApiError } from "@/lib/api/client";
import { publicLinkService } from "@/services/link-public.service";

export type SlugValidationMode = "public" | "auth";

const SLUG_RULES = {
  public: {
    maxLength: 100,
    pattern: /^[a-z0-9-]{3,100}$/,
  },
  auth: {
    maxLength: 100,
    pattern: /^[a-z0-9_-]{3,100}$/,
  },
} as const;

/** @deprecated Use mode-specific checks; kept for auth callers. */
export const SLUG_AVAILABILITY_PATTERN = SLUG_RULES.auth.pattern;

export const PUBLIC_SLUG_PATTERN = SLUG_RULES.public.pattern;

export const RESERVED_SLUGS = [
  "api",
  "admin",
  "www",
  "mail",
  "ftp",
  "r",
  "redirect",
] as const;

const SLUG_RANDOM_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const MAX_NUMERIC_SUFFIX = 999;
const MAX_RANDOM_ATTEMPTS = 24;

export type SlugAvailabilityResult = "invalid" | "available" | "taken";

function isReservedSlug(slug: string): boolean {
  return (RESERVED_SLUGS as readonly string[]).includes(slug.toLowerCase());
}

/**
 * Normalizes a raw slug to the rules of the target form (public vs auth).
 */
export function normalizeSlugForMode(
  raw: string,
  mode: SlugValidationMode,
): string | null {
  if (!raw?.trim()) {
    return null;
  }

  const { maxLength, pattern } = SLUG_RULES[mode];
  let slug = raw.toLowerCase().trim();

  if (mode === "public") {
    slug = slug.replace(/_/g, "-").replace(/[^a-z0-9-]/g, "");
  } else {
    slug = slug.replace(/[^a-z0-9_-]/g, "");
  }

  slug = slug
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/^-+|-+$/g, "");

  if (slug.length < 3 || !pattern.test(slug) || isReservedSlug(slug)) {
    return null;
  }

  return slug;
}

function fitsSlugPattern(slug: string, mode: SlugValidationMode): boolean {
  return SLUG_RULES[mode].pattern.test(slug) && !isReservedSlug(slug);
}

/** Appends `-N` while keeping total length within the mode limit. */
function buildNumericSlugVariant(
  baseSlug: string,
  n: number,
  mode: SlugValidationMode = "auth",
): string {
  const maxLength = SLUG_RULES[mode].maxLength;
  const suffix = `-${n}`;
  return `${baseSlug.slice(0, maxLength - suffix.length)}${suffix}`;
}

function randomSlugSuffix(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SLUG_RANDOM_CHARS[bytes[i]! % SLUG_RANDOM_CHARS.length];
  }
  return out;
}

/** Keeps the slug prefix and adds a short random suffix, e.g. `meu-post-k3f9`. */
function buildRandomSlugVariant(
  baseSlug: string,
  mode: SlugValidationMode = "auth",
): string {
  const maxLength = SLUG_RULES[mode].maxLength;
  const suffix = `-${randomSlugSuffix(4)}`;
  return `${baseSlug.slice(0, maxLength - suffix.length)}${suffix}`;
}

function buildTimestampSlugVariant(
  baseSlug: string,
  mode: SlugValidationMode,
): string {
  const maxLength = SLUG_RULES[mode].maxLength;
  const suffix = `-${Date.now().toString(36)}`;
  return `${baseSlug.slice(0, maxLength - suffix.length)}${suffix}`;
}

function* slugCandidateSequence(
  baseSlug: string,
  mode: SlugValidationMode,
): Generator<string> {
  const base = baseSlug.toLowerCase().trim();

  if (fitsSlugPattern(base, mode)) {
    yield base;
  }

  for (let n = 2; n <= MAX_NUMERIC_SUFFIX; n++) {
    const candidate = buildNumericSlugVariant(base, n, mode);
    if (fitsSlugPattern(candidate, mode)) {
      yield candidate;
    }
  }

  for (let i = 0; i < MAX_RANDOM_ATTEMPTS; i++) {
    const candidate = buildRandomSlugVariant(base, mode);
    if (fitsSlugPattern(candidate, mode)) {
      yield candidate;
    }
  }

  for (let i = 0; i < 3; i++) {
    const candidate = buildTimestampSlugVariant(base, mode);
    if (fitsSlugPattern(candidate, mode)) {
      yield candidate;
    }
  }
}

/**
 * Single request: is this slug free for an active link?
 * `GET /api/public/link/{slug}` — 404 means available.
 *
 * @param slug - candidate slug to check.
 * @param mode - slug rules to validate against before issuing the request.
 * @param excludeSlug - the slug a link *already owns* (edit mode). When
 *   `slug` matches it (case-insensitively), the check short-circuits to
 *   `"available"` without any request — this endpoint has no concept of
 *   "who is asking", so a link's own currently-active slug would otherwise
 *   always resolve as `"taken"` against itself. Mirrors the exclusion already
 *   used by {@link resolveAvailableSlug} for the suggestion flow.
 * @returns `"invalid"` (fails the pattern), `"available"`, or `"taken"`.
 */
export async function checkSlugAvailabilityOnce(
  slug: string,
  mode: SlugValidationMode = "auth",
  excludeSlug?: string | null,
): Promise<SlugAvailabilityResult> {
  if (!slug || !fitsSlugPattern(slug, mode)) {
    return "invalid";
  }

  if (isExcludedSlug(slug, excludeSlug)) {
    return "available";
  }

  try {
    await publicLinkService.getLinkBySlug(slug);
    return "taken";
  } catch (err) {
    return err instanceof ApiError && err.status === 404
      ? "available"
      : "invalid";
  }
}

/**
 * Strips a trailing collision token so an alternative can be built from the
 * *meaning* of the slug rather than stacked onto a previous attempt —
 * `meu-post-k3f9` → `meu-post`, never `meu-post-k3f9-a7b2`.
 *
 * Only a 4-character alphanumeric tail is treated as a token, matching what
 * this module and the backend's `SlugSuggestionService` both generate. A real
 * word of the same length (`meu-post-blog`) is left alone — worst case the
 * alternative keeps a word it could have dropped, which is harmless.
 *
 * @param slug - slug that may carry a `-token` tail.
 * @returns the slug without its collision token.
 */
export function stripSlugCollisionToken(slug: string): string {
  const stripped = slug.replace(/-[a-z0-9]{4}$/i, "");
  return stripped.length >= 3 ? stripped : slug;
}

/**
 * Resolves a *different* available slug built on the same base — what "another
 * name" asks for when the suggestion does not fit.
 *
 * Deliberately client-side: the server always answers with the same slug for
 * the same URL (that is what makes suggestions stable), so asking it again
 * would return the name the user just rejected.
 *
 * @param currentSlug - the slug being replaced; never returned again.
 * @param mode - slug rules to respect (`auth` for the app forms).
 * @returns an available slug different from `currentSlug`, or `null` if none
 *   could be verified (caller keeps what it had).
 */
export async function resolveAlternativeSlug(
  currentSlug: string,
  mode: SlugValidationMode = "auth",
): Promise<string | null> {
  const base = normalizeSlugForMode(stripSlugCollisionToken(currentSlug), mode);
  if (!base) {
    return null;
  }

  const current = currentSlug.trim().toLowerCase();

  for (let i = 0; i < MAX_RANDOM_ATTEMPTS; i++) {
    const candidate = buildRandomSlugVariant(base, mode);
    if (
      candidate.toLowerCase() === current ||
      !fitsSlugPattern(candidate, mode)
    ) {
      continue;
    }
    if ((await checkSlugAvailabilityOnce(candidate, mode)) === "available") {
      return candidate;
    }
  }

  return null;
}

export type ResolveAvailableSlugOptions = {
  excludeSlug?: string | null;
  mode?: SlugValidationMode;
};

function isExcludedSlug(
  candidate: string,
  excludeSlug?: string | null,
): boolean {
  if (!excludeSlug?.trim()) {
    return false;
  }
  return candidate.toLowerCase() === excludeSlug.trim().toLowerCase();
}

async function isSlugCandidateAvailable(
  candidate: string,
  mode: SlugValidationMode,
  excludeSlug?: string | null,
): Promise<boolean> {
  if (!fitsSlugPattern(candidate, mode)) {
    return false;
  }
  if (isExcludedSlug(candidate, excludeSlug)) {
    return true;
  }
  return (await checkSlugAvailabilityOnce(candidate, mode)) === "available";
}

export async function resolveAvailableSlug(
  baseSlug: string,
  options: ResolveAvailableSlugOptions = {},
): Promise<string | null> {
  const { excludeSlug = null, mode = "auth" } = options;
  const base = normalizeSlugForMode(baseSlug, mode);
  if (!base) {
    return null;
  }

  for (const candidate of slugCandidateSequence(base, mode)) {
    if (await isSlugCandidateAvailable(candidate, mode, excludeSlug)) {
      return candidate;
    }
  }

  for (let i = 0; i < 12; i++) {
    const candidate = buildTimestampSlugVariant(base, mode);
    if (await isSlugCandidateAvailable(candidate, mode, excludeSlug)) {
      return candidate;
    }
  }

  for (let i = 0; i < 12; i++) {
    const candidate = buildRandomSlugVariant(base, mode);
    if (await isSlugCandidateAvailable(candidate, mode, excludeSlug)) {
      return candidate;
    }
  }

  const fallback = normalizeSlugForMode(
    buildRandomSlugVariant(base, mode),
    mode,
  );
  return fallback;
}
