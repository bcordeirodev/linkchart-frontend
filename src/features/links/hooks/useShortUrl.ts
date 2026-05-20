"use client";

import { useSubdomain } from "@/features/profile/hooks/useSubdomain";
import { getShortUrl } from "@/lib/utils/shortUrl";

/**
 * Returns the public short URL for a given slug, respecting the authenticated
 * user's active custom subdomain when one is configured.
 *
 * - Active subdomain → `${subdomain.full_url}/${slug}`
 * - No subdomain (or still loading) → `getShortUrl(slug)` (default redirect base)
 *
 * Relies on the TanStack Query cache shared by `useSubdomain` (key: `["subdomain"]`,
 * staleTime: 5 min) — no extra network requests per card render.
 *
 * @param slug - bare link slug or custom_slug (e.g. "abc123").
 */
export function useShortUrl(slug: string): string {
  const { subdomain } = useSubdomain();

  if (subdomain?.status === "active" && slug) {
    return `${subdomain.full_url}/${slug}`;
  }

  return getShortUrl(slug);
}
