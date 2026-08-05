import type { MetadataRoute } from "next";

/**
 * `robots.txt` — declares which routes crawlers may index.
 *
 * There is no restrictive allowlist here: any path not listed under `disallow`
 * is crawlable by omission, which is what keeps `/guia/*`, `/comparar/*`,
 * `/ferramentas/*`, the public bio pages (`/b/{handle}`) and the branded
 * subdomain pages indexable without listing each one.
 *
 * `disallow` blocks the authenticated app surface (`app/(app)/*`), the sign-in
 * screen and the internal API — pages that sit behind auth or are worthless in
 * an index. Every entry is a **prefix match**, so `/reports` also covers
 * `/reports/anything`.
 *
 * Careful with `/bio`: it is the **logged-in bio editor**. The public bio page
 * lives under `/b/{handle}` (and on the user's own subdomain) and must stay
 * crawlable — never block `/b/` or the subdomain hosts.
 */
export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/shorter",
          "/public-analytics/",
          "/privacy",
          "/terms",
          "/support",
        ],
        disallow: [
          "/links/",
          "/link/",
          "/profile/",
          "/api/",
          "/reports",
          "/subdomains",
          "/bio",
          "/api-keys",
          "/sign-in",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
