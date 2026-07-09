import type { Metadata } from "next";
import ProfilePageContent from "@/page-components/user/ProfilePage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Profile Settings" };
export default function ProfilePage() {
  return <ProfilePageContent />;
}
