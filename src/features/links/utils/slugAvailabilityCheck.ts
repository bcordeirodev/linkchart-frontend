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
export function buildNumericSlugVariant(
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
export function buildRandomSlugVariant(
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
 */
export async function checkSlugAvailabilityOnce(
  slug: string,
  mode: SlugValidationMode = "auth",
): Promise<SlugAvailabilityResult> {
  if (!slug || !fitsSlugPattern(slug, mode)) {
    return "invalid";
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
