"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/lib/auth/useUser";
import Loading from "@/shared/ui/feedback/Loading";

/**
 * Componente de redirecionamento baseado no status de autenticação do usuário
 */
export function HomeRedirect() {
  const { data: user, isGuest } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user && !isGuest) {
      router.replace("/links");
    } else {
      router.replace("/shorter");
    }
  }, [user, isGuest, router]);

  return <Loading />;
}
