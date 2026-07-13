"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthContext";
import { queryKeys } from "@/lib/query/keys";

import type { LinkResponse } from "@/types";

/** Janela após o cadastro em que a conta ainda conta como "recém-criada". */
const FRESH_ACCOUNT_MS = 5 * 60 * 1000;

/** Intervalo entre re-consultas à API enquanto o link de exemplo não chega. */
const POLL_INTERVAL_MS = 2_000;

/** Teto da espera: se o seed falhar, a página não fica girando para sempre. */
const POLL_TIMEOUT_MS = 45_000;

interface UseDemoLinkSeeding {
  /** `true` enquanto o link de exemplo ainda não chegou e ainda é esperado. */
  isSeedingDemo: boolean;
}

/**
 * Descobre se o link de exemplo do usuário ainda está sendo semeado e, enquanto
 * estiver, re-consulta a lista até ele aparecer.
 *
 * No cadastro, `UserObserver` enfileira o `SeedDemoLinkJob`, que cria um link
 * `is_demo` com cliques históricos. O job roda **depois** que a resposta do
 * cadastro já foi enviada, então o usuário costuma chegar na `/links` antes de
 * o link existir. A lista é servida do cache do TanStack (`staleTime` de 2min) e
 * nunca revalidava sozinha — por isso só um F5 revelava o link.
 *
 * O sinal é a idade da conta, não a lista vazia: um usuário antigo que apagou
 * todos os seus links também tem zero links, e para ele não há nada chegando.
 *
 * @param links - links já carregados para o usuário.
 * @param loading - se a primeira carga da lista ainda está em voo.
 * @returns `{ isSeedingDemo }` para a lista trocar o estado vazio pelo aviso de
 *   que o exemplo está a caminho.
 */
export function useDemoLinkSeeding(
  links: LinkResponse[],
  loading: boolean,
): UseDemoLinkSeeding {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [gaveUp, setGaveUp] = useState(false);

  const accountAgeMs = user?.created_at
    ? Date.now() - new Date(user.created_at).getTime()
    : Number.POSITIVE_INFINITY;

  const isSeedingDemo =
    !loading &&
    !gaveUp &&
    accountAgeMs < FRESH_ACCOUNT_MS &&
    links.length === 0;

  useEffect(() => {
    if (!isSeedingDemo) {
      return;
    }

    const poll = window.setInterval(() => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links.all() });
    }, POLL_INTERVAL_MS);

    const timeout = window.setTimeout(() => setGaveUp(true), POLL_TIMEOUT_MS);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(timeout);
    };
  }, [isSeedingDemo, queryClient]);

  return { isSeedingDemo };
}

export default useDemoLinkSeeding;
