import { cookies, headers } from "next/headers";

/** Languages the app ships translations for. */
export type AppLanguage = "en" | "pt-BR";

/**
 * Resolves the request language on the server.
 *
 * Mirrors the client-side `detectAndApplyLanguage()`: the `i18nextLng` cookie
 * wins; without one, the first `Accept-Language` entry (≈ `navigator.language`)
 * decides, so SSR output matches the language the client settles on after
 * hydration — late-hydrating subtrees would otherwise mismatch against the
 * swapped language. Requests without the header (crawlers) keep the pt-BR
 * product default.
 */
export async function resolveServerLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("i18nextLng")?.value;
  if (cookieLang === "en" || cookieLang === "pt-BR") {
    return cookieLang;
  }
  const headerStore = await headers();
  const browserLang = headerStore
    .get("accept-language")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  return browserLang == null || browserLang.startsWith("pt") ? "pt-BR" : "en";
}
