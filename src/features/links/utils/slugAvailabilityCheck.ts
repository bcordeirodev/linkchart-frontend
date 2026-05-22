import { ApiError } from "@/lib/api/client";
import { publicLinkService } from "@/services/link-public.service";

export const SLUG_AVAILABILITY_PATTERN = /^[a-z0-9_-]{3,100}$/;

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

function fitsSlugPattern(slug: string): boolean {
  return SLUG_AVAILABILITY_PATTERN.test(slug) && !isReservedSlug(slug);
}

/** Appends `-N` while keeping total length ≤ 100. */
export function buildNumericSlugVariant(baseSlug: string, n: number): string {
  const suffix = `-${n}`;
  return `${baseSlug.slice(0, 100 - suffix.length)}${suffix}`;
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
export function buildRandomSlugVariant(baseSlug: string): string {
  const suffix = `-${randomSlugSuffix(4)}`;
  return `${baseSlug.slice(0, 100 - suffix.length)}${suffix}`;
}

/** Time-based suffix when many collisions occur — still anchored on the base slug. */
function buildTimestampSlugVariant(baseSlug: string): string {
  const suffix = `-${Date.now().toString(36)}`;
  return `${baseSlug.slice(0, 100 - suffix.length)}${suffix}`;
}

function* slugCandidateSequence(baseSlug: string): Generator<string> {
  const base = baseSlug.toLowerCase().trim();

  if (fitsSlugPattern(base)) {
    yield base;
  }

  for (let n = 2; n <= MAX_NUMERIC_SUFFIX; n++) {
    const candidate = buildNumericSlugVariant(base, n);
    if (fitsSlugPattern(candidate)) {
      yield candidate;
    }
  }

  for (let i = 0; i < MAX_RANDOM_ATTEMPTS; i++) {
    const candidate = buildRandomSlugVariant(base);
    if (fitsSlugPattern(candidate)) {
      yield candidate;
    }
  }

  for (let i = 0; i < 3; i++) {
    const candidate = buildTimestampSlugVariant(base);
    if (fitsSlugPattern(candidate)) {
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
): Promise<SlugAvailabilityResult> {
  if (!slug || !fitsSlugPattern(slug)) {
    return "invalid";
  }

  try {
    await publicLinkService.getLinkBySlug(slug);
    return "taken";
  } catch (err) {
    return err instanceof ApiError && err.status === 404 ? "available" : "invalid";
  }
}

/**
 * Finds the first free variant: base slug, then `-2`, `-3`, …, then short random
 * suffixes anchored on the same prefix. Almost always returns a slug when `baseSlug`
 * is valid (3–50 chars); returns `null` only when the base cannot produce candidates.
 */
export type ResolveAvailableSlugOptions = {
  /** Slug owned by the link being edited — skips the public availability check. */
  excludeSlug?: string | null;
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
  excludeSlug?: string | null,
): Promise<boolean> {
  if (isExcludedSlug(candidate, excludeSlug)) {
    return true;
  }
  return (await checkSlugAvailabilityOnce(candidate)) === "available";
}

export async function resolveAvailableSlug(
  baseSlug: string,
  options: ResolveAvailableSlugOptions = {},
): Promise<string | null> {
  const { excludeSlug = null } = options;
  const base = baseSlug.toLowerCase().trim();
  if (!base || !SLUG_AVAILABILITY_PATTERN.test(base)) {
    return null;
  }

  for (const candidate of slugCandidateSequence(base)) {
    if (await isSlugCandidateAvailable(candidate, excludeSlug)) {
      return candidate;
    }
  }

  for (let i = 0; i < 12; i++) {
    const candidate = buildTimestampSlugVariant(base);
    if (!fitsSlugPattern(candidate)) {
      continue;
    }
    if (await isSlugCandidateAvailable(candidate, excludeSlug)) {
      return candidate;
    }
  }

  for (let i = 0; i < 12; i++) {
    const candidate = buildRandomSlugVariant(base);
    if (!fitsSlugPattern(candidate)) {
      continue;
    }
    if (await isSlugCandidateAvailable(candidate, excludeSlug)) {
      return candidate;
    }
  }

  return buildRandomSlugVariant(base);
}
