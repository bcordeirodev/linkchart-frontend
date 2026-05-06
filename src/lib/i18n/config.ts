"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAnalytics from "./locales/en/analytics.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enLinks from "./locales/en/links.json";
import enProfile from "./locales/en/profile.json";
import enPublic from "./locales/en/public.json";
import ptBRAnalytics from "./locales/pt-BR/analytics.json";
import ptBRAuth from "./locales/pt-BR/auth.json";
import ptBRCommon from "./locales/pt-BR/common.json";
import ptBRLinks from "./locales/pt-BR/links.json";
import ptBRProfile from "./locales/pt-BR/profile.json";
import ptBRPublic from "./locales/pt-BR/public.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    links: enLinks,
    analytics: enAnalytics,
    profile: enProfile,
    public: enPublic,
  },
  "pt-BR": {
    common: ptBRCommon,
    auth: ptBRAuth,
    links: ptBRLinks,
    analytics: ptBRAnalytics,
    profile: ptBRProfile,
    public: ptBRPublic,
  },
};

// Called once from Providers with the server-detected language (from cookie).
// Both the server and the client use this same initial language, preventing
// hydration mismatches. Post-hydration, detectAndApplyLanguage() updates to
// the user's actual stored preference.
export function initI18n(lng: string = "en") {
  if (i18n.isInitialized) return;
  void i18n.use(initReactI18next).init({
    lng,
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "links", "analytics", "profile", "public"],
    supportedLngs: ["en", "pt-BR"],
    interpolation: { escapeValue: false },
  });
}

// Run after hydration to apply the user's actual language preference.
export function detectAndApplyLanguage() {
  const cookie = document.cookie.match(/(?:^|; )i18nextLng=([^;]*)/)?.[1];
  const stored =
    cookie ??
    localStorage.getItem("i18nextLng") ??
    (navigator.language.startsWith("pt") ? "pt-BR" : "en");
  if (stored && stored !== i18n.language) {
    void i18n.changeLanguage(stored);
  }
}

export default i18n;
