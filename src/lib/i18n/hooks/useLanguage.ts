"use client";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export type SupportedLanguage = "en" | "pt-BR";

export interface UseLanguageReturn {
  currentLanguage: SupportedLanguage;
  switchLanguage: (lang: SupportedLanguage) => void;
  isEnglish: boolean;
  isPortuguese: boolean;
}

/**
 * Reads the active language and exposes a setter that persists the choice.
 *
 * @returns `{currentLanguage, switchLanguage, isEnglish, isPortuguese}`.
 *
 * @remarks
 * `switchLanguage` writes to both `localStorage.i18nextLng` and the same-named
 * cookie (1 year, `SameSite=Lax`) so SSR can pick up the preference on the
 * next request without a flash of the wrong locale.
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const currentLanguage = (i18n.language as SupportedLanguage) ?? "en";

  const switchLanguage = useCallback(
    (lang: SupportedLanguage) => {
      void i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
      document.cookie = `i18nextLng=${lang};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    },
    [i18n],
  );

  return {
    currentLanguage,
    switchLanguage,
    isEnglish: currentLanguage === "en",
    isPortuguese: currentLanguage === "pt-BR",
  };
}
