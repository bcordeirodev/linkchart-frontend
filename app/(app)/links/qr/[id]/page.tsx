import type { Metadata } from "next";
import LinkQRPageContent from "@/pages/links/LinkQRPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "QR Code" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkQRPage({ params }: Props) {
  const { id } = await params;
  return <LinkQRPageContent id={id} />;
}
