import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Box, CircularProgress } from "@mui/material";
import SignInPageContent from "@/page-components/auth/SignInPage";
import enAuth from "@/lib/i18n/locales/en/auth.json";
import ptBRAuth from "@/lib/i18n/locales/pt-BR/auth.json";

/**
 * Generates a language-aware `<title>`/`<meta name="description">` for the
 * sign-in screen by reading the `i18nextLng` cookie server-side — the same
 * cookie `detectAndApplyLanguage()` reads client-side, so SSR and hydration
 * agree on the language.
 *
 * This mirrors the cookie-based `generateMetadata` pattern the public legal
 * pages (`/privacy`, `/terms`, `/support`) used to follow before they were
 * pinned to static pt-BR for cacheability (see `perf(seo): render public
 * pages statically in pt-BR for cacheability`). That constraint doesn't apply
 * here: `/sign-in` is `noindex` (set by the `(auth)` layout) and isn't a
 * static-caching target, so resolving the title per-request is safe.
 *
 * @returns the resolved Next.js {@link Metadata} for the sign-in page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const isEn = cookieStore.get("i18nextLng")?.value === "en";
  const { title, description } = isEn
    ? enAuth.signIn.meta
    : ptBRAuth.signIn.meta;
  return { title, description };
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}
