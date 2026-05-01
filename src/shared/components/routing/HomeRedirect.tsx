"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/lib/auth/useUser";
import { useAuth } from "@/lib/auth/AuthContext";
import Loading from "@/shared/ui/feedback/Loading";

/**
 * Componente de redirecionamento baseado no status de autenticação do usuário
 */
export function HomeRedirect() {
  const { data: user, isGuest } = useUser();
  const { isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user && !isGuest) {
      router.replace("/links");
    } else {
      router.replace("/shorter");
    }
  }, [user, isGuest, isLoading, router]);

  return <Loading />;
}
