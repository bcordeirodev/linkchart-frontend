import { cookies } from "next/headers";

import type { Metadata } from "next";
import MainLayout from "@/shared/layout/MainLayout";
import AppThemeScope from "@/shared/layout/AppThemeScope";
import {
  THEME_COOKIE_NAME,
  resolveThemeMode,
} from "@/lib/theme/themeCookie";

/**
 * Authenticated app shell.
 *
 * Exported as a Server Component (it renders the client `MainLayout` but uses
 * no client APIs itself) so it can declare `noindex, nofollow` for every
 * private route below it (`/links`, `/profile`, …). Those routes return HTTP
 * 200 with a client-rendered shell before the auth guard redirects, so without
 * this Google could crawl and index empty/thin private pages — bare `/links`
 * is not even covered by the `robots.txt` disallow. The meta tag removes the
 * whole class of pages from the index regardless.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // A preferência de tema é lida AQUI — e só aqui — porque `cookies()` torna
  // a rota dynamic: aceitável para os shells auth-gated (já `noindex`),
  // nunca para o root layout (as públicas precisam continuar estáticas).
  const cookieStore = await cookies();
  const initialMode = resolveThemeMode(
    cookieStore.get(THEME_COOKIE_NAME)?.value,
  );

  return (
    <AppThemeScope initialMode={initialMode}>
      <MainLayout>{children}</MainLayout>
    </AppThemeScope>
  );
}
