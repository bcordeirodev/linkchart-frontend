import { AuthLayout } from '@/shared/layout';
import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
import authRoles from '../../lib/auth/authRoles';
import AuthJsForm from '../../lib/auth/forms/AuthJsForm';

/**
 * The sign in page - Enhanced modern design using AuthLayout
 */
function SignInPage() {
	return (
		<AuthGuardRedirect auth={authRoles.onlyGuest}>
			<AuthLayout
				title="Entrar"
				subtitle="Acesse sua conta para gerenciar seus links de forma inteligente"
				variant="signin"
				footerLinks={[
					{
						text: 'Não possui uma conta?',
						linkText: 'Criar conta gratuita',
						href: '/sign-up'
					}
				]}
			>
				<AuthJsForm formType="signin" />
			</AuthLayout>
		</AuthGuardRedirect>
	);
}

export default SignInPage;
