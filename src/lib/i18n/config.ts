"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAnalytics from "./locales/en/analytics.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enLegal from "./locales/en/legal.json";
import enLinks from "./locales/en/links.json";
import enProfile from "./locales/en/profile.json";
import enPublic from "./locales/en/public.json";
import enReports from "./locales/en/reports.json";
import enSubdomains from "./locales/en/subdomains.json";
import enTools from "./locales/en/tools.json";
import ptBRAnalytics from "./locales/pt-BR/analytics.json";
import ptBRAuth from "./locales/pt-BR/auth.json";
import ptBRCommon from "./locales/pt-BR/common.json";
import ptBRLegal from "./locales/pt-BR/legal.json";
import ptBRLinks from "./locales/pt-BR/links.json";
import ptBRProfile from "./locales/pt-BR/profile.json";
import ptBRPublic from "./locales/pt-BR/public.json";
import ptBRReports from "./locales/pt-BR/reports.json";
import ptBRSubdomains from "./locales/pt-BR/subdomains.json";
import ptBRTools from "./locales/pt-BR/tools.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    links: enLinks,
    analytics: enAnalytics,
    profile: enProfile,
    public: enPublic,
    legal: enLegal,
    reports: enReports,
    subdomains: enSubdomains,
    tools: enTools,
  },
  "pt-BR": {
    common: ptBRCommon,
    auth: ptBRAuth,
    links: ptBRLinks,
    analytics: ptBRAnalytics,
    profile: ptBRProfile,
    public: ptBRPublic,
    legal: ptBRLegal,
    reports: ptBRReports,
    subdomains: ptBRSubdomains,
    tools: ptBRTools,
  },
};

/**
 * Initialises `i18next` with the bundled `pt-BR` and `en` resources.
 *
 * @param lng - initial language; defaults to `"en"`. The server passes the
 *              cookie-detected value so SSR and client hydrate with the same
 *              language and no mismatch warnings fire.
 *
 * @remarks
 * Idempotent — bails out if `i18n.isInitialized` is already `true`. After
 * hydration, `detectAndApplyLanguage()` switches to the stored preference.
 */
export function initI18n(lng: string = "en") {
  if (i18n.isInitialized) {
    // The singleton persists across server requests in the same Node.js process.
    // Without this, a second request with a different language would silently
    // keep the language from the first request, causing SSR/client className mismatches.
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng);
    }
    return;
  }
  void i18n.use(initReactI18next).init({
    lng,
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "auth",
      "links",
      "analytics",
      "profile",
      "public",
      "legal",
      "reports",
      "subdomains",
      "tools",
    ],
    supportedLngs: ["en", "pt-BR"],
    interpolation: { escapeValue: false },
    // SSR determinism: resources are bundled inline, so initialise synchronously
    // and without Suspense. This guarantees the first client render uses `lng`
    // (the server's pt-BR) instead of momentarily falling back to `en` while an
    // async init settles — which is what caused the SSR/client hydration
    // mismatch. The post-hydration `detectAndApplyLanguage()` still reconciles
    // to the visitor's stored preference.
    initImmediate: false,
    react: { useSuspense: false },
  });
}

/**
 * Reconciles the active i18n language with the user's stored preference.
 *
 * Called from a client effect after hydration. Reads the language from the
 * `i18nextLng` cookie, then `localStorage`, and otherwise stays on the pt-BR
 * default. `navigator.language` is intentionally NOT consulted: it made the
 * page reconcile to English for any en-locale visitor — including Googlebot
 * (en-US) — which rewrote `<html lang>` to `en` and swapped the visible copy to
 * English while the static `<title>`/`<meta description>` stayed pt-BR. That
 * mismatch diluted the pt-BR language signal (the target market). English is
 * now strictly opt-in via the language toggle, which writes the cookie.
 */
export function detectAndApplyLanguage() {
  const cookie = document.cookie.match(/(?:^|; )i18nextLng=([^;]*)/)?.[1];
  const stored = cookie ?? localStorage.getItem("i18nextLng") ?? "pt-BR";
  if (stored && stored !== i18n.language) {
    void i18n.changeLanguage(stored);
    // SSR renders with the static pt-BR default; keep <html lang> in sync when
    // the client reconciles to a different stored preference.
    document.documentElement.lang = stored;
  }
}

export default i18n;
