import type { Metadata } from "next";
import ApiKeysPageContent from "@/page-components/api-keys/ApiKeysPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Chaves de API" };

/**
 * Rota /api-keys — gerenciamento das chaves de API do usuário.
 */
export default function ApiKeysPage() {
  return <ApiKeysPageContent />;
}
