import type { Metadata } from "next";
import BioEditorPageContent from "@/page-components/bio-editor/BioEditorPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Página bio" };

/**
 * Rota /bio — editor da página de link-in-bio do usuário autenticado.
 */
export default function BioPage() {
  return <BioEditorPageContent />;
}
