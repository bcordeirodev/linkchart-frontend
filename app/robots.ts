import type { MetadataRoute } from "next";

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
        disallow: ["/links/", "/link/", "/profile/", "/api/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
