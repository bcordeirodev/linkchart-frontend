import type { MetadataRoute } from "next";

/**
 * Sitemap for public, indexable pages.
 *
 * Included: the homepage and the public marketing/content pages (comparisons,
 * guides, legal). These are unique, indexable content and belong in the index.
 *
 * Deliberately excluded:
 * - `/shorter` — serves the same landing as `/` but declares `/` as its
 *   canonical, so listing it would point at a non-canonical URL.
 * - `/public-analytics/[slug]` — per-link analytics pages are `noindex`
 *   (thin, user-generated content); they must not be listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
  const now = new Date();

  return [
    {
      url: `${appUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Marketing/content pages — index these (add new /comparar/* and /guia/* here).
    {
      url: `${appUrl}/comparar/bitly`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/comparar/short-io`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/comparar/dub`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/guia/cliques-bot-vs-humano`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/como-ver-cliques-do-link`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/rastrear-link-instagram`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Free standalone tools — indexable SEO/funnel pages.
    {
      url: `${appUrl}/ferramentas/gerador-utm`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/ferramentas/verificar-link`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/support`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${appUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${appUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
