import type { Metadata } from "next";
import MainLayout from "@/shared/layout/MainLayout";

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

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
