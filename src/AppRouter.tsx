import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loading } from '@/shared/components';

// Lazy load components for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const LinkPage = lazy(() => import('./pages/LinkPage'));
const LinkCreatePage = lazy(() => import('./pages/LinkCreatePage'));
const LinkEditPage = lazy(() => import('./pages/LinkEditPage'));
const LinkAnalyticsPage = lazy(() => import('./pages/LinkAnalyticsPage'));
const LinkQRPage = lazy(() => import('./pages/LinkQRPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ShorterPage = lazy(() => import('./pages/ShorterPage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const SignOutPage = lazy(() => import('./pages/SignOutPage'));
const BasicAnalyticsPage = lazy(() => import('./pages/BasicAnalyticsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

const LoadingWrapper = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<Loading />}>{children}</Suspense>
);

function AppRouter() {
	return (
		<Routes>
			{/* Redirect root to dashboard */}
			<Route
				path="/"
				element={
					<Navigate
						to="/analytics"
						replace
					/>
				}
			/>

			{/* Public routes */}
			<Route
				path="/shorter"
				element={
					<LoadingWrapper>
						<ShorterPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/sign-in"
				element={
					<LoadingWrapper>
						<SignInPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/sign-up"
				element={
					<LoadingWrapper>
						<SignUpPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/sign-out"
				element={
					<LoadingWrapper>
						<SignOutPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/r/:slug"
				element={
					<LoadingWrapper>
						<RedirectPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/basic-analytics/:slug"
				element={
					<LoadingWrapper>
						<BasicAnalyticsPage />
					</LoadingWrapper>
				}
			/>

			{/* Protected routes */}
			<Route
				path="/analytics"
				element={
					<LoadingWrapper>
						<AnalyticsPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/link"
				element={
					<LoadingWrapper>
						<LinkPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/link/create"
				element={
					<LoadingWrapper>
						<LinkCreatePage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/link/edit/:id"
				element={
					<LoadingWrapper>
						<LinkEditPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/link/analytic/:id"
				element={
					<LoadingWrapper>
						<LinkAnalyticsPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/link/qr/:id"
				element={
					<LoadingWrapper>
						<LinkQRPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="/links"
				element={
					<Navigate
						to="/link"
						replace
					/>
				}
			/>
			<Route
				path="/profile"
				element={
					<LoadingWrapper>
						<ProfilePage />
					</LoadingWrapper>
				}
			/>

			{/* Error pages */}
			<Route
				path="/401"
				element={
					<LoadingWrapper>
						<UnauthorizedPage />
					</LoadingWrapper>
				}
			/>
			<Route
				path="*"
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
