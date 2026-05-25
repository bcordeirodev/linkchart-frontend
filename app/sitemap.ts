import type { MetadataRoute } from "next";

/**
 * Sitemap for public indexable pages.
 *
 * The root URL (/) is intentionally excluded — it is an auth-aware JS redirect
 * (guest → /shorter, logged-in → /links) and carries no indexable content.
 * /shorter is the canonical homepage for SEO purposes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
  const now = new Date();

  return [
    {
      url: `${appUrl}/shorter`,
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
