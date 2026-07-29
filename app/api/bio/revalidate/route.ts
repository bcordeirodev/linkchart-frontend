import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

/** Mirrors the backend's handle rule — 3–30 chars, lowercase/digits/hyphens. */
const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/;

/**
 * POST /api/bio/revalidate — expira o cache de dados das páginas bio
 * públicas (`/b/{handle}` e `/s/{sub}`) na hora, chamado pelo editor logo
 * após um save bem-sucedido. Sem isto, uma edição levaria até 5 minutos
 * (`revalidate: 300`) para aparecer aos visitantes — o cache continua
 * valendo para tráfego público; só a EDIÇÃO fura a fila.
 *
 * Sem autenticação de propósito: revalidar só derruba cache (a próxima
 * visita re-busca do backend, que é a fonte de verdade) — não expõe nem
 * altera dado. Os inputs são validados contra o padrão de handle/label
 * para não virarem vetor de tag arbitrária.
 */
export async function POST(request: NextRequest) {
  let body: { handle?: unknown; subdomain?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ revalidated: false }, { status: 400 });
  }

  const revalidated: string[] = [];

  if (typeof body.handle === "string" && HANDLE_PATTERN.test(body.handle)) {
    revalidateTag(`bio-handle:${body.handle}`);
    revalidated.push(`bio-handle:${body.handle}`);
  }
  if (
    typeof body.subdomain === "string" &&
    HANDLE_PATTERN.test(body.subdomain)
  ) {
    revalidateTag(`bio-sub:${body.subdomain}`);
    revalidated.push(`bio-sub:${body.subdomain}`);
  }

  return NextResponse.json({ revalidated: revalidated.length > 0 });
}
