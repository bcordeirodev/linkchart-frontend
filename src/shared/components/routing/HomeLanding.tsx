"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/lib/auth/useUser";
import { useAuth } from "@/lib/auth/AuthContext";
import Loading from "@/shared/ui/feedback/Loading";
import ShorterPage from "@/page-components/public/ShorterPage";

/**
 * Homepage body for `/`.
 *
 * Renders the public URL shortener landing for guests — and, crucially, for
 * server-side rendering — so the homepage ships full, indexable content to
 * crawlers instead of the old `noindex` JavaScript redirect that threw the
 * homepage's search authority away.
 *
 * Authenticated users have no use for the public landing, so once the session
 * resolves on the client they are forwarded to their dashboard (`/links`).
 * Because the auth state is only known after hydration (`isLoading` starts
 * `true`), SSR and the first client render always emit the landing, keeping
 * hydration consistent and guaranteeing crawlers see the content.
 */
export function HomeLanding() {
  const { data: user, isGuest } = useUser();
  const { isLoading } = useAuth();
  const router = useRouter();

  const isAuthenticated = Boolean(user) && !isGuest;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/links");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && isAuthenticated) {
    return <Loading />;
  }

  return <ShorterPage />;
}
