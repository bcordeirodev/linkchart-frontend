// src/lib/consent/cookie-consent.ts
import type { CookieConsentConfig } from "vanilla-cookieconsent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function updateConsentMode(categories: string[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("consent", "update", {
    analytics_storage: categories.includes("analytics") ? "granted" : "denied",
    ad_storage: categories.includes("advertising") ? "granted" : "denied",
    ad_user_data: categories.includes("advertising") ? "granted" : "denied",
    ad_personalization: categories.includes("advertising")
      ? "granted"
      : "denied",
  });
}

export const cookieConsentConfig: CookieConsentConfig = {
  /*
   * Position the consent prompt as a bottom bar so it never overlaps
   * the page's focal form.  Using the library's own `guiOptions` keeps
   * the positioning declarative and avoids fighting the CSS.
   */
  guiOptions: {
    consentModal: {
      layout: "bar",
      position: "bottom",
    },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {},
    advertising: {},
  },
  language: {
    default: "pt",
    // "document" reads `<html lang>`, which the app always SSRs as pt-BR
    // (see `initialLang` in `app/layout.tsx`) and only ever rewrites to "en"
    // when a visitor explicitly opts in via the language toggle
    // (`detectAndApplyLanguage()` in `src/lib/i18n/config.ts`).
    //
    // The previous value, "browser", instead reads `navigator.language`
    // directly — the exact signal `detectAndApplyLanguage()` deliberately
    // stopped consulting (see its own doc comment) because it flips any
    // en-locale visitor to English even though the product's default is
    // pt-BR and English is meant to be strictly opt-in. That mismatch is
    // why the cookie banner rendered in English on first visit (most
    // visibly on public bio pages, reached cold from Instagram/WhatsApp by
    // visitors who never touched the in-app language toggle) while the rest
    // of the UI correctly stayed pt-BR.
    autoDetect: "document",
    translations: {
      pt: {
        consentModal: {
          title: "Usamos cookies",
          description:
            'Usamos cookies para analytics e publicidade personalizada. Você pode aceitar todos ou personalizar suas preferências. <a href="/privacy" class="cc__link">Política de Privacidade</a>',
          acceptAllBtn: "Aceitar todos",
          acceptNecessaryBtn: "Só necessários",
          showPreferencesBtn: "Personalizar",
        },
        preferencesModal: {
          title: "Preferências de cookies",
          acceptAllBtn: "Aceitar todos",
          acceptNecessaryBtn: "Só necessários",
          savePreferencesBtn: "Salvar preferências",
          closeIconLabel: "Fechar",
          sections: [
            {
              title: "Uso de cookies",
              description:
                "Usamos cookies para melhorar sua experiência e exibir publicidade relevante.",
            },
            {
              title: 'Necessários <span class="pm__badge">Sempre ativo</span>',
              description:
                "Indispensáveis para o funcionamento da plataforma: sessão autenticada e preferência de idioma.",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics",
              description:
                "Google Analytics — ajuda a entender como o site é usado. Nenhum dado pessoal identificável é coletado.",
              linkedCategory: "analytics",
            },
            {
              title: "Publicidade",
              description:
                "Google AdSense — exibe anúncios. Sem ativação, anúncios não-personalizados podem ainda aparecer.",
              linkedCategory: "advertising",
            },
            {
              title: "Mais informações",
              description:
                'Dúvidas? <a href="mailto:linkcharts@gmail.com" class="cc__link">linkcharts@gmail.com</a>',
            },
          ],
        },
      },
      en: {
        consentModal: {
          title: "We use cookies",
          description:
            'We use cookies for analytics and personalized advertising. <a href="/privacy" class="cc__link">Privacy Policy</a>',
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Necessary only",
          showPreferencesBtn: "Manage preferences",
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Necessary only",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie usage",
              description:
                "We use cookies to improve your experience and display relevant ads.",
            },
            {
              title: 'Necessary <span class="pm__badge">Always active</span>',
              description:
                "Required for basic functionality: authenticated session and language preference.",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics",
              description:
                "Google Analytics — helps understand site usage. No personally identifiable data.",
              linkedCategory: "analytics",
            },
            {
              title: "Advertising",
              description:
                "Google AdSense — displays ads. Without activation, non-personalized ads may still appear.",
              linkedCategory: "advertising",
            },
            {
              title: "More information",
              description:
                'Questions? <a href="mailto:linkcharts@gmail.com" class="cc__link">linkcharts@gmail.com</a>',
            },
          ],
        },
      },
    },
  },
  onConsent: ({ cookie }) => {
    updateConsentMode(cookie.categories);
  },
  onChange: ({ cookie }) => {
    updateConsentMode(cookie.categories);
  },
};
