'use client';
import { BrowserRouter } from 'react-router-dom';
import AuthLayout from '@/shared/layout/AuthLayout';

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
	return (
		<BrowserRouter>
			<AuthLayout>{children}</AuthLayout>
		</BrowserRouter>
	);
}
