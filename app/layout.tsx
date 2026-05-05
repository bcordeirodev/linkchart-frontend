import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter } from "next/font/google";

import { Providers } from "@/lib/providers/Providers";
import { buildOrganizationSchema } from "@/lib/seo/structuredData";
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
    images: [{ url: `${appUrl}/og-default.png`, width: 1200, height: 630, alt: "Link Charts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Charts — URL Shortener with Analytics",
    description:
      "Free URL shortener with powerful real-time analytics, click tracking, and geographic insights.",
    images: [`${appUrl}/og-default.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
        />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
