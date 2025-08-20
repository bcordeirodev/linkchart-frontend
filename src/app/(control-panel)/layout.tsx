import MainLayout from 'src/components/layout/MainLayout';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

function Layout({ children }) {
	return (
		<AuthGuardRedirect auth={['admin']}>
			<MainLayout>{children}</MainLayout>
		</AuthGuardRedirect>
	);
}

export default Layout;
