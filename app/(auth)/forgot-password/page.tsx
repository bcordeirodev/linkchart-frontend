import type { Metadata } from 'next';
import ForgotPasswordPageContent from '@/pages/auth/ForgotPasswordPage';
export const metadata: Metadata = { title: 'Reset Password' };
export default function ForgotPasswordPage() { return <ForgotPasswordPageContent />; }
