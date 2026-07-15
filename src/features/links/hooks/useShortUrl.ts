"use client";

import { getShortUrlForLink } from "@/lib/utils/shortUrl";

type LinkShortUrlInput = {
  slug?: string;
  custom_slug?: string;
  short_url?: string;
};

/**
 * Returns the public short URL for an EXISTING link.
 *
 * Trusts the link's own recorded `short_url` (server-computed from its
 * immutable `short_domain`, set once at creation) rather than any subdomain
 * currently active on the account — a link keeps the domain it was created
 * with even after the owner later claims or releases other subdomains.
 *
 * @param link - the link record (or a subset exposing slug/custom_slug/short_url).
 * @returns the absolute short URL for the link.
 */
export function useShortUrl(link: LinkShortUrlInput): string {
  return getShortUrlForLink(link);
}
