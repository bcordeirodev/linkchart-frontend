import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";

import BioPublicPage from "@/page-components/bio/BioPublicPage";
import { buildBioPageMetadata } from "@/page-components/bio/bioMetadata";

import type { BioApiResponse, BioPageData } from "@/page-components/bio/types";

interface Props {
  params: Promise<{ sub: string }>;
}

/**
 * Forces per-request dynamic rendering. This route's content — and, via
 * {@link assertCanonicalHost}, whether it renders at all vs. redirects —
 * depends on the incoming `Host` header, which sits outside the cache key
 * Next's Full Route Cache and Data Cache key on (pathname + search params
 * only, never `Host`). Calling `headers()` is documented to opt a route
 * into dynamic rendering on its own, but that only takes effect from the
 * first render that observes it; a request for the exact same `/s/{sub}`
 * URL arriving before that (or hitting an already-cached entry) can still
 * be served the cached HTML from a *different* Host. Declaring `dynamic`
 * explicitly removes that ambiguity instead of relying on it.
 */
export const dynamic = "force-dynamic";

/**
 * Allowed character set for a bio-page subdomain label: lowercase
 * alphanumerics and internal hyphens, 3–30 characters total. Mirrors
 * `BIO_SUBDOMAIN_PATTERN` in `middleware.ts` (which already filters the host
 * before rewriting here) and `HANDLE_PATTERN` in `/b/[handle]/page.tsx`.
 * Re-checked here — not just trusted from the rewrite — because this route
 * is directly reachable at `/s/{sub}` on the main domain too (see
 * {@link assertCanonicalHost}), where nothing upstream has validated `sub`
 * yet.
 */
const SUBDOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

/** `NEXT_PUBLIC_APP_URL`, decomposed for building a subdomain-hosted URL. */
interface AppOriginParts {
  protocol: string;
  hostname: string;
  port: string;
}

/**
 * Decomposes `NEXT_PUBLIC_APP_URL` into the parts needed to build a
 * subdomain origin (protocol, root hostname, dev port). Falls back to the
 * production apex when the env var is missing or unparsable — mirrors the
 * fallback in `middleware.ts`'s `resolveRootDomain` and
 * `src/features/bio/utils/publicBioUrl.ts`.
 */
function resolveAppOriginParts(): AppOriginParts {
  try {
    const url = new URL(appUrl);
    return { protocol: url.protocol, hostname: url.hostname, port: url.port };
  } catch {
    return { protocol: "https:", hostname: "linkcharts.com.br", port: "" };
  }
}

/**
 * Builds the canonical absolute URL for a bio page's subdomain host, e.g.
 * `https://bruno.linkcharts.com.br` in production or
 * `http://bruno.localhost:3000` in dev.
 *
 * @param sub - the pre-validated subdomain label.
 */
function getSubdomainOrigin(sub: string): string {
  const { protocol, hostname, port } = resolveAppOriginParts();
  return `${protocol}//${sub}.${hostname}${port ? `:${port}` : ""}`;
}

/**
 * Fetches the bio payload for a subdomain from the backend
 * (`GET /api/public/bio/by-subdomain/{sub}`), already validated against
 * {@link SUBDOMAIN_PATTERN} by the caller. Same shape and caching contract
 * as `fetchBioData` in `/b/[handle]/page.tsx`'s by-handle lookup — see that
 * file for the `revalidate: 300` rationale.
 *
 * @param sub - the pre-validated subdomain label.
 * @returns the resolved {@link BioPageData}, or `null` if not found/unreachable.
 */
async function fetchBioDataBySubdomain(
  sub: string,
): Promise<BioPageData | null> {
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/public/bio/by-subdomain/${sub}`, {
    // Tag por label do subdominio — mesma revalidacao sob demanda do /b.
    next: { revalidate: 300, tags: [`bio-sub:${sub}`] },
  }).catch(() => null);

  if (!res?.ok) {
    return null;
  }

  const json = (await res.json()) as BioApiResponse;
  return json.data ?? null;
}

/**
 * Guards against this route being reached on the wrong host. `/s/{sub}` is a
 * real Next.js path, so — unlike `/b/{handle}`, which only exists behind the
 * `/@{handle}` rewrite — it is directly addressable on the main app domain
 * too (e.g. `linkcharts.com.br/s/bruno`). Serving content there would
 * duplicate the subdomain's page at a second URL, splitting SEO signal and
 * defeating the "the subdomain IS the page" premise.
 *
 * Reads the `Host` header via `headers()` rather than trusting the route's
 * own URL, because a same-origin rewrite (what `middleware.ts` performs for
 * `{sub}.{root}/`) does not change the Host header the browser actually
 * sent — it stays `{sub}.{root}`, letting this check tell "arrived via the
 * subdomain rewrite" apart from "typed `/s/{sub}` directly on the apex".
 * Accepts both root domains `middleware.ts`'s `extractBioSubdomain` does
 * (the resolved app origin and, unconditionally, `localhost`) for the same
 * dev-convenience reason.
 *
 * When the host doesn't match, issues a permanent (308) redirect to the
 * canonical subdomain URL instead of rendering — a `notFound()` here would
 * be wrong (the page does exist, just at a different address) and a
 * temporary redirect would leave the wrong URL eligible to accumulate SEO
 * signal.
 *
 * Called from both `generateMetadata` and the page component itself, same
 * as the `SUBDOMAIN_PATTERN`/`notFound()` checks below — this route has a
 * sibling `loading.tsx`, which wraps the page component's own render in an
 * implicit Suspense boundary; by the time a redirect thrown *there* is
 * observed, an initial 200 shell may already be streaming, so it can only
 * become a client-side navigation. `generateMetadata` resolves fully before
 * any bytes are sent (the `<head>` must be complete first), so calling it
 * there too is what makes this an actual HTTP 308 rather than a redirect
 * only a JS-executing client (not curl, not every crawler) will follow.
 *
 * @param sub - the pre-validated subdomain label.
 */
async function assertCanonicalHost(sub: string): Promise<void> {
  const hostHeader = (await headers()).get("host") ?? "";
  const requestHostname = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  const { hostname: rootHostname } = resolveAppOriginParts();
  const expectedHostnames = new Set([
    `${sub}.${rootHostname}`,
    `${sub}.localhost`,
  ]);

  if (!expectedHostnames.has(requestHostname)) {
    permanentRedirect(getSubdomainOrigin(sub));
  }
}

/**
 * Generates pt-BR metadata for a subdomain-hosted bio page. Same content as
 * `/b/[handle]/page.tsx`'s `generateMetadata`, except `canonical` (and the
 * Open Graph `url`) point at the subdomain host itself
 * (`https://{sub}.linkcharts.com.br`) rather than `/@{handle}` on the main
 * domain — this route's whole purpose is that the subdomain IS the
 * canonical address, so metadata must agree with the address bar the
 * visitor actually sees. Indexable (`index, follow`): like `/b/[handle]`,
 * this is the product's shareable public surface, not thin/duplicate
 * content — see {@link assertCanonicalHost} for how the main-domain
 * duplicate is prevented instead of just de-indexed. The host check runs
 * here, before the data fetch, both so the redirect is a real HTTP 308 (see
 * {@link assertCanonicalHost}) and so a request about to be redirected away
 * doesn't also pay for a wasted backend round-trip.
 *
 * @param props - route props carrying the `sub` params promise.
 * @returns the resolved Next.js {@link Metadata}, or triggers `notFound()`/redirects.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sub } = await params;

  // Soft-404 do App Router (streaming devolve 200 mesmo com notFound() —
  // vercel/next.js#45801/#76474): retorna noindex em vez de lançar, para o
  // HTML 200 da UI de não-encontrado nunca ser indexado (subdomínios sem bio
  // são a superfície mais exposta a crawler aqui). O notFound() da page cuida
  // da UI.
  const NOT_FOUND_METADATA: Metadata = {
    title: "Página não encontrada",
    robots: { index: false, follow: false },
  };

  if (!SUBDOMAIN_PATTERN.test(sub)) {
    return NOT_FOUND_METADATA;
  }

  await assertCanonicalHost(sub);

  const data = await fetchBioDataBySubdomain(sub);
  if (!data) {
    return NOT_FOUND_METADATA;
  }

  const canonicalUrl = getSubdomainOrigin(sub);

  return buildBioPageMetadata(data, canonicalUrl);
}

/**
 * Public link-in-bio page rendered directly at a creator's subdomain,
 * `{sub}.linkcharts.com.br/` (dev: `{sub}.localhost:3000/`) — reached via
 * the host-based rewrite in `middleware.ts`'s `extractBioSubdomain`/rewrite
 * to `/s/{sub}`. Unlike `/b/[handle]` (whose pretty `/@{handle}` URL always
 * lives on the main domain), the whole point of this route is that the
 * address bar shows the subdomain, never `/s/{sub}` or the main domain.
 *
 * Renders the same `BioPublicPage` component as `/b/[handle]` — the two
 * routes are just different ways to resolve to the same payload shape
 * (`BioPageData`), by handle or by subdomain.
 *
 * Re-runs the `SUBDOMAIN_PATTERN`/`assertCanonicalHost` checks `generateMetadata`
 * already ran — defense-in-depth for direct rendering, not the primary
 * enforcement point; see {@link assertCanonicalHost} for why `generateMetadata`
 * is the one that determines the actual HTTP status.
 */
export default async function SubdomainBioPage({ params }: Props) {
  const { sub } = await params;
  if (!SUBDOMAIN_PATTERN.test(sub)) {
    notFound();
  }

  await assertCanonicalHost(sub);

  const data = await fetchBioDataBySubdomain(sub);
  if (!data) {
    notFound();
  }

  return <BioPublicPage data={data} />;
}
