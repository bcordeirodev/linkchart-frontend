"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Minimal bilingual copy for the global error boundary.
 *
 * `global-error.tsx` REPLACES the root layout, so it renders outside every
 * provider — and possibly before `initI18n()` ever ran (the typical trigger is
 * the root layout itself throwing). `useTranslation` cannot be trusted here,
 * and importing `@/lib/i18n/config` would both drag every locale bundle into
 * this chunk and still not guarantee an initialized instance. A local
 * dictionary, resolved from the same `i18nextLng` cookie the i18n layer
 * writes, is the documented fallback.
 */
const GLOBAL_ERROR_COPY = {
  "pt-BR": {
    title: "Algo deu muito errado",
    description:
      "Ocorreu um erro inesperado ao carregar a aplicação. Tente novamente — se o problema continuar, fale com o suporte.",
    retry: "Tentar novamente",
    supportCode: "Código para o suporte:",
  },
  en: {
    title: "Something went very wrong",
    description:
      "An unexpected error occurred while loading the application. Try again — if the problem persists, contact support.",
    retry: "Try again",
    supportCode: "Support code:",
  },
} as const;

/**
 * Resolves the UI language from the `i18nextLng` cookie (the cookie the
 * language toggle writes). Defaults to pt-BR — the product's primary market —
 * matching the cookieless SSR behavior of the rest of the app.
 */
function resolveLanguage(): keyof typeof GLOBAL_ERROR_COPY {
  if (typeof document === "undefined") {
    return "pt-BR";
  }
  return /(?:^|; )i18nextLng=en(?:;|$)/.test(document.cookie) ? "en" : "pt-BR";
}

/**
 * Handles errors thrown inside the root layout (e.g., provider failures).
 * Must include `<html>` and `<body>` because it replaces the entire layout.
 *
 * Never renders `error.message` to the user in production (it can leak
 * stack/internal details) — the copy is generic and `error.digest` is shown
 * as a small support code. The raw message renders only in development.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  const lang = resolveLanguage();
  const copy = GLOBAL_ERROR_COPY[lang];

  return (
    <html lang={lang}>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "32px",
            textAlign: "center",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>{copy.title}</h2>
          <p style={{ margin: 0, color: "#666", maxWidth: "480px" }}>
            {copy.description}
          </p>
          {process.env.NODE_ENV === "development" && error.message ? (
            <p
              style={{
                margin: 0,
                color: "#c62828",
                fontFamily: "monospace",
                maxWidth: "560px",
                wordBreak: "break-word",
              }}
            >
              {error.message}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              padding: "8px 24px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #1976d2",
              color: "#1976d2",
              background: "transparent",
            }}
          >
            {copy.retry}
          </button>
          {error.digest ? (
            <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>
              {copy.supportCode} {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
