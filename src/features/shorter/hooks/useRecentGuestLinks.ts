"use client";

import { useEffect, useState } from "react";

/**
 * Persistência local dos links criados por visitantes anônimos no `/shorter`.
 *
 * Julho/2026 mostrou 62 links públicos com tráfego real e nenhum dono: o
 * visitante encurta, fecha a aba e perde o acesso às estatísticas públicas.
 * Esta lista devolve esse acesso (cada item linka para
 * `/public-analytics/{slug}`) e vira o gancho de conversão "crie uma conta
 * para não perdê-los".
 *
 * Armazenamento: `localStorage` first-party, sem PII — apenas slug, URLs e
 * timestamp. Melhor esforço por desenho: qualquer falha (Safari privado,
 * quota) é engolida e a UI simplesmente não renderiza a lista.
 */

/** Um link criado por um visitante sem conta neste navegador. */
export interface RecentGuestLink {
  slug: string;
  short_url: string;
  original_url: string;
  created_at: string;
}

const STORAGE_KEY = "lc_guest_links";
const MAX_ITEMS = 10;

/**
 * Lê a lista salva, mais recente primeiro. Devolve `[]` no servidor, quando
 * não há nada salvo ou quando o JSON está corrompido.
 *
 * @returns Lista de links do visitante, possivelmente vazia.
 */
export function readGuestLinks(): RecentGuestLink[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is RecentGuestLink =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as RecentGuestLink).slug === "string" &&
        typeof (item as RecentGuestLink).short_url === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Registra um link recém-criado no topo da lista (dedupe por slug, máximo de
 * {@link MAX_ITEMS}). Chamar apenas no fluxo de visitante — usuários logados
 * têm a lista real em `/links`.
 *
 * @param link - O link devolvido pelo encurtador público.
 */
export function recordGuestLink(
  link: Pick<RecentGuestLink, "slug" | "short_url" | "original_url">,
): void {
  if (typeof window === "undefined") return;

  try {
    const next: RecentGuestLink[] = [
      { ...link, created_at: new Date().toISOString() },
      ...readGuestLinks().filter((item) => item.slug !== link.slug),
    ].slice(0, MAX_ITEMS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Best-effort: sem quota ou storage bloqueado, a lista só não cresce.
  }
}

/**
 * Hook de leitura da lista para renderização.
 *
 * @param refreshToken - Qualquer valor que muda quando um link novo é criado
 *                       (ex.: o slug recém-criado); força a releitura.
 * @returns Lista atual, mais recente primeiro (vazia no primeiro render SSR).
 */
export function useRecentGuestLinks(
  refreshToken: string | null,
): RecentGuestLink[] {
  const [links, setLinks] = useState<RecentGuestLink[]>([]);

  useEffect(() => {
    setLinks(readGuestLinks());
  }, [refreshToken]);

  return links;
}
