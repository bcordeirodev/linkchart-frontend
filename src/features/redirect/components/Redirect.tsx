"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RedirectProps {
  to: string;
  children?: React.ReactNode;
}

function Redirect({ to }: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
}

export default Redirect;
export { Redirect };
