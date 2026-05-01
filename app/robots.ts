import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://linkchart.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shorter", "/public-analytics/"],
        disallow: ["/links/", "/link/", "/profile/", "/api/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
