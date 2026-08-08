/**
 * Contrato do cookie de preferência de tema da área logada.
 *
 * Vive num módulo sem diretiva para ser importado tanto pelo Server
 * Component `app/(app)/layout.tsx` (leitura via `cookies()`) quanto pelo
 * provider client `AppThemeScope` (escrita via `document.cookie`).
 */

/** Modo de tema suportado pela área logada. */
export type ThemeMode = "light" | "dark";

/** Nome do cookie que persiste a preferência (`light` | `dark`). */
export const THEME_COOKIE_NAME = "lc_theme";

/** Max-Age do cookie: 1 ano, em segundos. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Normaliza o valor cru do cookie para um `ThemeMode`.
 *
 * @param raw - valor do cookie como chegou do browser (ou `undefined`).
 * @returns `"light"` apenas para o valor exato `"light"`; qualquer outra
 * coisa (ausente, corrompido) cai no default canônico `"dark"`.
 */
export function resolveThemeMode(raw: string | undefined): ThemeMode {
  return raw === "light" ? "light" : "dark";
}
