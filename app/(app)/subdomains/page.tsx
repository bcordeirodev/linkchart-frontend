import type { Metadata } from "next";
import SubdomainsPageContent from "@/page-components/subdomains/SubdomainsPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Subdomínios" };

/**
 * Rota /subdomains — gerenciamento dos subdomínios personalizados do usuário.
 */
export default function SubdomainsPage() {
  return <SubdomainsPageContent />;
}
