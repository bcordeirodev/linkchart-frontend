import type { BioPage } from "../types";

/**
 * Fire-and-forget: expira o cache de dados da página bio pública logo após
 * um save no editor (POST /api/bio/revalidate → `revalidateTag`). Sem isto,
 * a edição levaria até 5 minutos (`revalidate: 300` nas rotas `/b` e `/s`)
 * para aparecer aos visitantes — foi exatamente a confusão de "salvei a bio
 * e a página pública não mostra".
 *
 * Melhor esforço de propósito: se a chamada falhar, o cache expira sozinho
 * no prazo normal; nunca propaga erro para o fluxo de save.
 *
 * @param page - página recém-salva (ou do cache do TanStack); no-op se ausente.
 */
export function revalidatePublicBio(page: BioPage | null | undefined): void {
  if (!page) {
    return;
  }

  let subdomain: string | undefined;
  if (page.url?.startsWith("http")) {
    try {
      subdomain = new URL(page.url).hostname.split(".")[0];
    } catch {
      subdomain = undefined;
    }
  }

  void fetch("/api/bio/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle: page.handle, subdomain }),
  }).catch(() => {
    /* melhor esforço — o revalidate por tempo cobre a falha */
  });
}
