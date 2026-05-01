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

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
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
    },
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "auth", "links", "analytics", "profile", "public"],
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("i18nextLng") ?? "en"
        : "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
