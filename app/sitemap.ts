import type { MetadataRoute } from "next";

/**
 * Date of the last significant content change per indexed route (`YYYY-MM-DD`).
 *
 * These are static on purpose. Emitting `new Date()` told crawlers that every
 * page had changed on every build, so `lastmod` carried no information and
 * search engines stop trusting it. Each value below is the date of the last
 * commit that changed what a crawler actually sees for that route — the route
 * file plus the page component it renders.
 *
 * MAINTENANCE: when you change a page's copy or structure, bump its date here
 * in the same commit. When you add a route, add its entry with the day's date.
 * A stale date is much cheaper than a date that lies "changed today".
 */
const LAST_MODIFIED = {
  "/": "2026-08-02",
  "/comparar/bitly": "2026-08-04",
  "/comparar/linktree": "2026-08-05",
  "/comparar/short-io": "2026-08-04",
  "/comparar/dub": "2026-08-04",
  "/guia/cliques-bot-vs-humano": "2026-08-04",
  "/guia/como-ver-cliques-do-link": "2026-08-04",
  "/guia/rastrear-link-instagram": "2026-08-04",
  "/guia/link-curto-para-whatsapp": "2026-08-04",
  "/guia/alternativa-ao-bitly": "2026-08-05",
  "/ferramentas/gerador-utm": "2026-08-04",
  "/ferramentas/verificar-link": "2026-08-04",
  "/support": "2026-08-04",
  "/privacy": "2026-08-04",
  "/terms": "2026-08-04",
} as const;

/**
 * Sitemap for public, indexable pages.
 *
 * Included: the homepage and the public marketing/content pages (comparisons,
 * guides, tools, legal). These are unique, indexable content and belong in the
 * index. Dates come from {@link LAST_MODIFIED} — update them there.
 *
 * Deliberately excluded:
 * - `/shorter` — serves the same landing as `/` but declares `/` as its
 *   canonical, so listing it would point at a non-canonical URL.
 * - `/public-analytics/[slug]` — per-link analytics pages are `noindex`
 *   (thin, user-generated content); they must not be listed here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

  return [
    {
      url: `${appUrl}/`,
      lastModified: LAST_MODIFIED["/"],
      changeFrequency: "weekly",
      priority: 1,
    },
    // Marketing/content pages — index these (add new /comparar/* and /guia/* here).
    {
      url: `${appUrl}/comparar/bitly`,
      lastModified: LAST_MODIFIED["/comparar/bitly"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/comparar/linktree`,
      lastModified: LAST_MODIFIED["/comparar/linktree"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/comparar/short-io`,
      lastModified: LAST_MODIFIED["/comparar/short-io"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/comparar/dub`,
      lastModified: LAST_MODIFIED["/comparar/dub"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/guia/cliques-bot-vs-humano`,
      lastModified: LAST_MODIFIED["/guia/cliques-bot-vs-humano"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/como-ver-cliques-do-link`,
      lastModified: LAST_MODIFIED["/guia/como-ver-cliques-do-link"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/rastrear-link-instagram`,
      lastModified: LAST_MODIFIED["/guia/rastrear-link-instagram"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/link-curto-para-whatsapp`,
      lastModified: LAST_MODIFIED["/guia/link-curto-para-whatsapp"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/guia/alternativa-ao-bitly`,
      lastModified: LAST_MODIFIED["/guia/alternativa-ao-bitly"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Free standalone tools — indexable SEO/funnel pages.
    {
      url: `${appUrl}/ferramentas/gerador-utm`,
      lastModified: LAST_MODIFIED["/ferramentas/gerador-utm"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/ferramentas/verificar-link`,
      lastModified: LAST_MODIFIED["/ferramentas/verificar-link"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${appUrl}/support`,
      lastModified: LAST_MODIFIED["/support"],
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${appUrl}/privacy`,
      lastModified: LAST_MODIFIED["/privacy"],
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${appUrl}/terms`,
      lastModified: LAST_MODIFIED["/terms"],
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
