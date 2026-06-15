import type { Metadata } from "next";
import { resolveServerLanguage } from "@/lib/i18n/serverLanguage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

/**
 * Builds the language-aware metadata for the URL shortener landing.
 *
 * Shared by the canonical homepage (`/`) and the legacy `/shorter` route so
 * both render identical `<title>`, description and structured signals. The
 * canonical URL is always the bare homepage (`/`): the homepage is the
 * strongest URL of the domain, so search authority is consolidated there and
 * `/shorter` declares it as its canonical to avoid duplicate-content splitting.
 *
 * No `hreflang` alternates are emitted: the site uses Accept-Language dynamic
 * serving on a single URL (no per-language paths), so language alternates would
 * all point at the same URL — a no-op that Google ignores. pt-BR is the SEO
 * target and the crawler default (see {@link resolveServerLanguage}).
 *
 * @returns the resolved Next.js {@link Metadata} for the shortener landing.
 */
export async function buildLandingMetadata(): Promise<Metadata> {
  const isEn = (await resolveServerLanguage()) === "en";
  const canonicalUrl = `${appUrl}/`;

  const title = isEn
    ? "Free URL Shortener with Real-Time Analytics"
    : "Encurtador de Link Gratuito com Analytics em Tempo Real";
  const fullTitle = `${title} | Link Charts`;
  const description = isEn
    ? "Shorten any URL for free, no sign-up required. Track clicks by country, device and UTM campaign. Free custom subdomain, QR Code and custom slug."
    : "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Subdomínio personalizado, QR Code e slug customizado grátis.";
  const ogImageAlt = isEn
    ? "Link Charts — URL Shortener with Analytics"
    : "Link Charts — Encurtador de Link com Analytics";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: `${appUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${appUrl}/og-default.png`],
    },
  };
}
