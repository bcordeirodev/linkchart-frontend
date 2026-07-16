import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

/**
 * Builds the metadata for the URL shortener landing.
 *
 * Shared by the canonical homepage (`/`) and the legacy `/shorter` route so
 * both render identical `<title>`, description and structured signals. The
 * canonical URL is always the bare homepage (`/`): the homepage is the
 * strongest URL of the domain, so search authority is consolidated there and
 * `/shorter` declares it as its canonical to avoid duplicate-content splitting.
 *
 * The metadata is static pt-BR — the SEO target and crawler default — so the
 * pages stay cacheable (reading the request language would force dynamic
 * rendering). The `title` uses `absolute` so the homepage carries the brand
 * suffix too: title templates from the root layout do not apply to the root
 * segment, so without this `/` would render the bare title.
 *
 * No `hreflang` alternates are emitted: the site serves both languages on a
 * single URL, so language alternates would all point at the same URL — a no-op
 * Google ignores.
 *
 * @returns the Next.js {@link Metadata} for the shortener landing.
 */
export function buildLandingMetadata(): Metadata {
  const canonicalUrl = `${appUrl}/`;

  const title = "Encurtador de Link Gratuito com Analytics em Tempo Real";
  const fullTitle = `${title} | Link Charts`;
  const description =
    "Encurte qualquer URL gratuitamente, sem cadastro. Rastreie cliques por país, dispositivo e campanha UTM. Até 3 subdomínios personalizados, QR Code e relatórios de todos os seus links — grátis.";
  const ogImageAlt = "Link Charts — Encurtador de Link com Analytics";

  return {
    title: { absolute: fullTitle },
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
