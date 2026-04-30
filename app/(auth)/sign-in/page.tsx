import type { Metadata } from 'next';
import SignInPageContent from '@/pages/auth/SignInPage';
export const metadata: Metadata = { title: 'Sign In' };
export default function SignInPage() { return <SignInPageContent />; }
