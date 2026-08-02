import type { Metadata } from "next";

import type { BioPageData } from "./types";

/**
 * Builds the metadata for a public bio page — deliberately personal and
 * brand-free (feedback 2026-08-02: the share card was rendering the product's
 * marketing banner and a "— Link Charts Bio | Link Charts" title, turning a
 * personal page into an ad).
 *
 * Rules encoded here:
 * - The title is the creator's display name, ABSOLUTE: no "— Link Charts Bio"
 *   suffix and no `%s | Link Charts` template from the root layout.
 * - The share image is the creator's avatar. Without an avatar there is NO
 *   image at all — a text-only card is still personal; the product banner
 *   is not.
 * - Twitter card is `summary` (square thumbnail, the profile-card shape),
 *   not `summary_large_image` (the banner shape).
 * - The description is the creator's bio; the neutral fallback names the
 *   creator, never the product.
 *
 * Shared by `/b/[handle]` (the `/@{handle}` pretty URL) and `/s/[sub]` (the
 * subdomain host) so both surfaces stay byte-identical except for the
 * canonical URL each one owns.
 *
 * @param data - the public bio payload.
 * @param canonicalUrl - the canonical address of THIS surface (subdomain
 *   root when associated, `/@{handle}` otherwise).
 * @returns the resolved Next.js {@link Metadata}.
 */
export function buildBioPageMetadata(
  data: BioPageData,
  canonicalUrl: string,
): Metadata {
  const description = data.bio || `Links de @${data.handle}`;
  const avatarUrl = data.avatar_url ?? null;

  return {
    title: { absolute: data.title },
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "profile",
      title: data.title,
      description,
      url: canonicalUrl,
      ...(avatarUrl ? { images: [{ url: avatarUrl, alt: data.title }] } : {}),
    },
    twitter: {
      card: "summary",
      title: data.title,
      description,
      ...(avatarUrl ? { images: [avatarUrl] } : {}),
    },
  };
}
