import type { Metadata } from "next";
import ReportsPageContent from "@/page-components/reports/ReportsPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Relatórios" };

/**
 * Rota /reports — relatórios agregados de todos os links do usuário.
 */
export default function ReportsPage() {
  return <ReportsPageContent />;
}
