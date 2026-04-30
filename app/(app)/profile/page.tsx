import type { Metadata } from 'next';
import ProfilePageContent from '@/pages/user/ProfilePage';
export const metadata: Metadata = { title: 'Profile Settings' };
export default function ProfilePage() { return <ProfilePageContent />; }
