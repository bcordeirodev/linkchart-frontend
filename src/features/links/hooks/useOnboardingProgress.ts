"use client";

import { useCallback, useEffect, useState } from "react";

import { useLinks } from "@/features/links/hooks/useLinks";

const DISMISSED_KEY = "onboarding.links.dismissed";
const ANALYTICS_SEEN_KEY = "onboarding.links.analyticsSeen";

/**
 * Lê um flag booleano do localStorage de forma SSR-safe.
 *
 * @param key Chave do storage.
 * @returns `true` quando o flag está setado; `false` no servidor ou em erro.
 */
function readFlag(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/**
 * Grava/limpa um flag booleano no localStorage, ignorando erros de quota/modo privado.
 *
 * @param key Chave do storage.
 * @param value `true` para setar, `false` para remover.
 */
function writeFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (value) {
      window.localStorage.setItem(key, "1");
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Marca que o usuário já conheceu o analytics. Função pura (sem hooks), para ser
 * chamada de páginas que não devem carregar a lista de links (ex.: analytics).
 */
export function markAnalyticsOnboardingSeen(): void {
  writeFlag(ANALYTICS_SEEN_KEY, true);
}

/** Estado e ações do onboarding de primeiros passos da /links. */
export interface OnboardingProgress {
  /** O usuário já tem pelo menos 1 link. */
  hasCreatedLink: boolean;
  /** O usuário já abriu uma página de analytics. */
  hasSeenAnalytics: boolean;
  /** As duas tarefas foram concluídas. */
  completed: boolean;
  /** O card foi dispensado pelo usuário. */
  dismissed: boolean;
  /** O card deve ser exibido (não concluído e não dispensado). */
  visible: boolean;
  /** Marca a tarefa de analytics como concluída. */
  markAnalyticsSeen: () => void;
  /** Dispensa o card. */
  dismiss: () => void;
  /** Reexibe o card (limpa o "dispensado"). */
  reopen: () => void;
}

/**
 * Deriva o progresso do onboarding de primeiros passos: "criar link" vem do
 * estado real (`useLinks`), "conhecer analytics" e "dispensado" vêm do localStorage.
 * SSR-safe: os flags são hidratados no cliente após o mount.
 *
 * @returns Estado e ações do onboarding.
 */
export function useOnboardingProgress(): OnboardingProgress {
  const { links } = useLinks();
  const hasCreatedLink = links.length > 0;

  const [hasSeenAnalytics, setHasSeenAnalytics] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // Gates `visible` until localStorage is read on the client, so a returning
  // user who already dismissed/completed onboarding never sees the card flash
  // for one paint on a warm-cache navigation (when `loading` is already false).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHasSeenAnalytics(readFlag(ANALYTICS_SEEN_KEY));
    setDismissed(readFlag(DISMISSED_KEY));
    setHydrated(true);
  }, []);

  const markAnalyticsSeen = useCallback(() => {
    writeFlag(ANALYTICS_SEEN_KEY, true);
    setHasSeenAnalytics(true);
  }, []);

  const dismiss = useCallback(() => {
    writeFlag(DISMISSED_KEY, true);
    setDismissed(true);
  }, []);

  const reopen = useCallback(() => {
    writeFlag(DISMISSED_KEY, false);
    setDismissed(false);
  }, []);

  const completed = hasCreatedLink && hasSeenAnalytics;
  const visible = hydrated && !completed && !dismissed;

  return {
    hasCreatedLink,
    hasSeenAnalytics,
    completed,
    dismissed,
    visible,
    markAnalyticsSeen,
    dismiss,
    reopen,
  };
}
