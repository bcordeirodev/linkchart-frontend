import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { EmailVerificationGuard } from '@/lib/auth/components/EmailVerificationGuard';
import { HomeRedirect } from '@/shared/components/routing/HomeRedirect';
import { PageLoadingSkeleton } from '@/shared/ui/feedback/skeletons';

// Lazy load components for better performance - Organized by category
// 📊 Analytics Pages
const LinkAnalyticsPage = lazy(() => import('./pages/analytics/LinkAnalyticsPage'));
const PublicAnalyticsPage = lazy(() => import('./pages/analytics/PublicAnalyticsPage'));

// 🔗 Links Management Pages
const LinkPage = lazy(() => import('./pages/links/LinkPage'));
const LinkCreatePage = lazy(() => import('./pages/links/LinkCreatePage'));
const LinkEditPage = lazy(() => import('./pages/links/LinkEditPage'));
const LinkQRPage = lazy(() => import('./pages/links/LinkQRPage'));

// 🔐 Authentication Pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));
const SignOutPage = lazy(() => import('./pages/auth/SignOutPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const EmailVerificationPendingPage = lazy(() => import('./pages/auth/EmailVerificationPendingPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// 🌐 Public Pages
const ShorterPage = lazy(() => import('./pages/public/ShorterPage'));
const RedirectPage = lazy(() => import('./pages/public/RedirectPage'));

// 👤 User Pages
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));

// ⚠️ System Pages
const NotFoundPage = lazy(() => import('./pages/system/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/system/UnauthorizedPage'));

function LoadingWrapper({ children }: { children: React.ReactNode }) {
	return <Suspense fallback={<PageLoadingSkeleton />}>{children}</Suspense>;
}

function AppRouter() {
	return (
		<Routes>
			{/* Smart redirect based on authentication status */}
			<Route
				path='/'
				element={<HomeRedirect />}
			/>

			{/* Public routes */}
			<Route
				path='/shorter'
				element={
					<LoadingWrapper>
						<ShorterPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/sign-in'
				element={
					<LoadingWrapper>
						<SignInPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/sign-up'
				element={
					<LoadingWrapper>
						<SignUpPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/sign-out'
				element={
					<LoadingWrapper>
						<SignOutPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/verify-email'
				element={
					<LoadingWrapper>
						<VerifyEmailPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/email-verification-pending'
				element={
					<LoadingWrapper>
						<EmailVerificationPendingPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/forgot-password'
				element={
					<LoadingWrapper>
						<ForgotPasswordPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/reset-password'
				element={
					<LoadingWrapper>
						<ResetPasswordPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/r/:slug'
				element={
					<LoadingWrapper>
						<RedirectPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='/public-analytics/:slug'
				element={
					<LoadingWrapper>
						<PublicAnalyticsPage />
					</LoadingWrapper>
				}
			/>

			{/* Protected routes */}
			<Route
				path='/link'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<LinkPage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>
			<Route
				path='/link/create'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<LinkCreatePage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>
			<Route
				path='/link/edit/:id'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<LinkEditPage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>
			<Route
				path='/link/analytic/:id'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<LinkAnalyticsPage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>
			<Route
				path='/link/qr/:id'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<LinkQRPage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>
			<Route
				path='/links'
				element={
					<Navigate
						to='/link'
						replace
					/>
				}
			/>
			<Route
				path='/profile'
				element={
					<LoadingWrapper>
						<EmailVerificationGuard>
							<ProfilePage />
						</EmailVerificationGuard>
					</LoadingWrapper>
				}
			/>

			{/* Error pages */}
			<Route
				path='/401'
				element={
					<LoadingWrapper>
						<UnauthorizedPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path='*'
				element={
					<LoadingWrapper>
						<NotFoundPage />
					</LoadingWrapper>
				}
			/>
		</Routes>
	);
}

export default AppRouter;
