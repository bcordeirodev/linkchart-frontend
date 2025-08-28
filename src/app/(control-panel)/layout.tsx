import MainLayout from '@/components/layout/MainLayout';
// import AuthGuardRedirect from '@auth/AuthGuardRedirect'; // Temporariamente desabilitado

function Layout({ children }: { children: React.ReactNode }) {
	return (
		// <AuthGuardRedirect auth={['admin']}>
		<MainLayout>{children}</MainLayout>
		// </AuthGuardRedirect>
	);
}

export default Layout;
