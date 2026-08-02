"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

interface MarketingScriptsProps {
  /** GA4 measurement id (`NEXT_PUBLIC_GA_ID`), or undefined to skip GA4. */
  gaId?: string;
  /** Google Ads conversion id (`NEXT_PUBLIC_GOOGLE_ADS_ID`), or undefined to skip Ads. */
  googleAdsId?: string;
  /** AdSense publisher id (`NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`), or undefined to skip AdSense. */
  adsenseId?: string;
}

/**
 * Hosts that belong to the product itself. Any OTHER `*.linkcharts.com.br`
 * host is a user's personal bio subdomain (wildcard vhost) and must not run
 * marketing scripts.
 */
const PRODUCT_HOSTS = new Set(["linkcharts.com.br", "www.linkcharts.com.br"]);

/**
 * Whether the current location is a personal bio surface — the public
 * link-in-bio pages, reachable three ways: the `/@handle` pretty URL, the
 * internal `/b/{handle}` and `/s/{sub}` routes, or a user's own subdomain
 * host (where the browser path is just `/`).
 *
 * Checked client-side on purpose: the subdomain case is invisible to
 * `usePathname()` (the middleware host-rewrite keeps the browser URL at
 * `/`), and reading request headers in the root layout would force every
 * route to render dynamically, killing public-page cacheability.
 *
 * @param pathname - current browser pathname from `usePathname()`.
 * @param host - `window.location.host` (read after mount).
 */
function isBioSurface(pathname: string, host: string): boolean {
  if (
    pathname.startsWith("/@") ||
    pathname.startsWith("/b/") ||
    pathname.startsWith("/s/")
  ) {
    return true;
  }

  return host.endsWith(".linkcharts.com.br") && !PRODUCT_HOSTS.has(host);
}

/**
 * Loads the marketing stack (gtag.js for GA4/Google Ads + AdSense) on every
 * surface EXCEPT personal bio pages.
 *
 * Bio pages are a visitor's window into a creator's identity, not into Link
 * Charts (decision 2026-08-02, same spirit as removing the product branding
 * from their share previews) — so they skip analytics/ads scripts entirely.
 * Grafana Faro RUM is intentionally NOT gated here: operational telemetry
 * stays on for every route, including bio.
 *
 * Rendering is deferred until after mount (`host` state) so the bio check
 * can see `window.location.host`; the scripts already used
 * `afterInteractive`, so nothing loads meaningfully later than before. The
 * Consent Mode v2 default snippet stays in the root layout — it must run
 * `beforeInteractive`, which Next.js only supports there.
 */
export function MarketingScripts({
  gaId,
  googleAdsId,
  adsenseId,
}: MarketingScriptsProps) {
  const pathname = usePathname();
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  if (host === null || isBioSurface(pathname, host)) {
    return null;
  }

  // GA4 and Google Ads both run on gtag.js: load the loader once (keyed on
  // the first available id) and issue a `config` for each id present.
  const gtagLoaderId = gaId || googleAdsId;
  const gtagConfigLines = [gaId, googleAdsId]
    .filter(Boolean)
    .map((id) => `gtag('config','${id}');`)
    .join("");

  return (
    <>
      {gtagLoaderId ? (
        <>
          <Script
            id="gtm"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`}
          />
          <Script
            id="gtag-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${gtagConfigLines}`,
            }}
          />
        </>
      ) : null}
      {/*
       * AdSense — native <script async> instead of Next.js <Script>
       * intentionally: <Script> appends a `data-nscript` attribute that
       * AdSense's own validation rejects with a console warning. React 19
       * hoists an async external script rendered in JSX to <head> and
       * deduplicates it by src.
       */}
      {adsenseId ? (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
