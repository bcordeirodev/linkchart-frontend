import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";

import { Providers } from "@/lib/providers/Providers";
import { buildOrganizationSchema } from "@/lib/seo/structuredData";
import { CookieConsentInit } from "@/shared/components/CookieConsentInit";
import "@/styles/index.css";
import "@/styles/animations.css";
import "@/styles/app-base.css";
import "@/styles/splash-screen.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

export const metadata: Metadata = {
  title: {
    default: "Link Charts — URL Shortener with Analytics",
    template: "%s | Link Charts",
  },
  description:
    "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
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
    title: "Link Charts — URL Shortener with Analytics",
    description:
      "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
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
    title: "Link Charts — URL Shortener with Analytics",
    description:
      "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
    images: [`${appUrl}/og-default.png`],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLang = cookieStore.get("i18nextLng")?.value ?? "en";

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body className={inter.variable}>
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
        {gaId ? (
          <>
            <Script
              id="gtm"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="gtag-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        ) : null}
        <Script
          id="adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1396026257166470"
          crossOrigin="anonymous"
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
