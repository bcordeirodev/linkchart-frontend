import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BioPublicPage from "@/page-components/bio/BioPublicPage";
import { buildBioPageMetadata } from "@/page-components/bio/bioMetadata";

import type { BioApiResponse, BioPageData } from "@/page-components/bio/types";

interface Props {
  params: Promise<{ handle: string }>;
}

/**
 * Allowed character set for a bio handle: lowercase alphanumerics and
 * internal hyphens, 3–30 characters total. Mirrors the `/@{handle}` pretty
 * URL rewritten by `middleware.ts`. Anything outside this set 404s before it
 * reaches an upstream fetch — the same defensive pattern used by
 * `/public-analytics/[slug]`.
 */
const HANDLE_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://linkcharts.com.br";

/**
 * Fetches the bio payload for a handle from the backend, already validated
 * against {@link HANDLE_PATTERN} by the caller.
 *
 * Uses `revalidate: 300` so repeated visits within 5 minutes (this page is
 * shared and re-opened constantly from Instagram/WhatsApp) are served from
 * Next.js's data cache instead of hitting the backend on every hit. Network
 * failures resolve to `null` rather than throwing, so a backend hiccup 404s
 * cleanly instead of crashing the route.
 *
 * @param handle - the pre-validated bio handle (no `@` prefix).
 * @returns the resolved {@link BioPageData}, or `null` if not found/unreachable.
 */
async function fetchBioData(handle: string): Promise<BioPageData | null> {
  const apiUrl = process.env.API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/public/bio/${handle}`, {
    // Tag por handle: o editor fura este cache na hora do save via
    // POST /api/bio/revalidate — visitante segue servido do cache.
    next: { revalidate: 300, tags: [`bio-handle:${handle}`] },
  }).catch(() => null);

  if (!res?.ok) {
    return null;
  }

  const json = (await res.json()) as BioApiResponse;
  return json.data ?? null;
}

/**
 * Generates pt-BR metadata for a public bio page: title, description, Open
 * Graph and Twitter Card. Unlike `/public-analytics/[slug]` (noindex, thin
 * per-link content), bio pages are the indexable, shareable surface — closer
 * to a Linktree profile than a dashboard — so `robots` stays at the default
 * `index, follow`.
 *
 * Metadata is always pt-BR: this page renders a stranger's content to a
 * visitor with no established language preference (most arrive cold from a
 * social app), and the product's SEO target is the Brazilian market.
 *
 * @param props - route props carrying the `handle` params promise.
 * @returns the resolved Next.js {@link Metadata}, or triggers `notFound()`.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;

  // Soft-404 do App Router (streaming devolve 200 mesmo com notFound() —
  // vercel/next.js#45801/#76474): quando a página não existe, este metadata
  // RETORNA noindex em vez de lançar, garantindo que o HTML 200 da UI de
  // não-encontrado nunca seja indexado. O notFound() da page cuida da UI.
  const NOT_FOUND_METADATA: Metadata = {
    title: "Página não encontrada",
    robots: { index: false, follow: false },
  };

  if (!HANDLE_PATTERN.test(handle)) {
    return NOT_FOUND_METADATA;
  }

  const data = await fetchBioData(handle);
  if (!data) {
    return NOT_FOUND_METADATA;
  }

  // Subdomain-first: quando a página tem subdomínio associado, o backend
  // devolve `url` ABSOLUTA (a raiz do subdomínio) — essa é a URL canônica,
  // e esta rota /@{handle} vira apenas um fallback técnico não-canônico.
  // Sem subdomínio (página legada), o canonical continua sendo /@{handle}.
  const canonicalUrl = data.url?.startsWith("http")
    ? data.url
    : `${appUrl}/@${handle}`;

  return buildBioPageMetadata(data, canonicalUrl);
}

/**
 * Public link-in-bio page. Served at the pretty URL `/@{handle}` via the
 * rewrite in `middleware.ts`; this file is the real route Next.js renders.
 *
 * Validates the handle format against {@link HANDLE_PATTERN} before touching
 * the network, so a malformed handle 404s immediately instead of
 * round-tripping to the backend.
 */
export default async function BioPage({ params }: Props) {
  const { handle } = await params;
  if (!HANDLE_PATTERN.test(handle)) {
    notFound();
  }

  const data = await fetchBioData(handle);
  if (!data) {
    notFound();
  }

  return <BioPublicPage data={data} />;
}
