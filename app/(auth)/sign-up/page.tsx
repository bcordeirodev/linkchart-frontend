import type { Metadata } from 'next';
import SignUpPageContent from '@/pages/auth/SignUpPage';
export const metadata: Metadata = { title: 'Create Account' };
export default function SignUpPage() { return <SignUpPageContent />; }
