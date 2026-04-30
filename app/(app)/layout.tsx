'use client';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from '@/shared/layout/MainLayout';
import { EmailVerificationGuard } from '@/lib/auth/components/EmailVerificationGuard';

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter>
			<EmailVerificationGuard>
				<MainLayout>{children}</MainLayout>
			</EmailVerificationGuard>
		</BrowserRouter>
	);
}
