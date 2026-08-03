import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/lib/providers/Providers";
import { buildOrganizationSchema } from "@/lib/seo/structuredData";
import { CookieConsentInit } from "@/shared/components/CookieConsentInit";
import { MarketingScripts } from "@/shared/components/MarketingScripts";
import FrontendObservability from "@/shared/observability/FrontendObservability";
import "@/styles/index.css";
import "@/styles/animations.css";
import "@/styles/app-base.css";
import "@/styles/splash-screen.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: {
    default: "Link Charts — Free URL Shortener with Analytics",
    template: "%s | Link Charts",
  },
  description:
    "Free URL shortener with click analytics, geographic insights, QR codes and UTM tracking. No account needed — shorten any link in seconds.",
  metadataBase: new URL(appUrl),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: "Link Charts",
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Free URL shortener with click analytics, geographic insights, QR codes and UTM tracking. No account needed — shorten any link in seconds.",
    images: [
      {
        url: `${appUrl}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Link Charts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Charts — Free URL Shortener with Analytics",
    description:
      "Free URL shortener with click analytics, geographic insights, QR codes and UTM tracking. No account needed — shorten any link in seconds.",
    images: [`${appUrl}/og-default.png`],
  },
  verification: {
    google: "ScMRnsLtVWdaMwHKhOHLIK2wVXpdb68uwa6kHzuDUTU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // pt-BR is the SEO target and the static SSR default, so the public pages
  // stay cacheable (reading the cookie/Accept-Language here would force every
  // route to render dynamically with `no-store`). The client reconciles to the
  // visitor's stored preference after hydration via `detectAndApplyLanguage()`.
  const initialLang = "pt-BR";

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      >
        <FrontendObservability />
        {/*
         * Consent Mode v2 defaults — must fire before any gtag/AdSense call.
         * `beforeInteractive` is injected by Next.js into the raw HTML outside
         * React's vDOM, so it never triggers a hydration mismatch.
         */}
        <Script
          id="consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
          }}
        />
        {/*
         * gtag (GA4/Ads) + AdSense live behind a client-side gate that skips
         * them on personal bio surfaces (/@handle, /b, /s and bio
         * subdomains) — see MarketingScripts. Faro RUM above is deliberately
         * NOT gated: operational telemetry covers every route.
         */}
        <MarketingScripts
          gaId={gaId}
          googleAdsId={googleAdsId}
          adsenseId={adsenseId}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildOrganizationSchema()),
          }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers initialLang={initialLang}>{children}</Providers>
        </AppRouterCacheProvider>
        <CookieConsentInit />
      </body>
    </html>
  );
}
