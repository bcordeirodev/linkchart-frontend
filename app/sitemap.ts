import type { MetadataRoute } from "next";

/**
 * Sitemap for public indexable pages.
 *
 * The root URL (/) is the canonical homepage: it renders the URL shortener
 * landing with full server-side content. /shorter still serves the same
 * landing for backwards compatibility but declares / as its canonical, so it
 * is intentionally omitted here to avoid listing a non-canonical URL.
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
