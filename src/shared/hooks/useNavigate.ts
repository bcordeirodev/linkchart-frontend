"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useNavigate() {
  const router = useRouter();
  const navigate = useCallback(
    (to: string) => {
      router.push(to);
    },
    [router],
  );
  return navigate;
}

export default useNavigate;
