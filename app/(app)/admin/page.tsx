import type { Metadata } from "next";
import AdminPage from "@/page-components/admin/AdminPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administração",
};

/**
 * Rota /admin — painel do dono do produto (requer is_admin no backend).
 * O route group (app) já aplica robots noindex.
 */
export default function Page() {
  return <AdminPage />;
}
