import type { Metadata } from "next";
import LinkEditPageContent from "@/pages/links/LinkEditPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit Link" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LinkEditPage({ params }: Props) {
  const { id } = await params;
  return <LinkEditPageContent id={id} />;
}
