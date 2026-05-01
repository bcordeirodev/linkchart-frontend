'use client';
import { useTranslation } from 'react-i18next';

import { AuthLayout } from '@/shared/layout';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
import authRoles from '../../lib/auth/authRoles';
import AuthJsForm from '../../lib/auth/forms/AuthJsForm';

/**
 * Página de login com layout moderno
 */
function SignInPage() {
	const { t } = useTranslation('auth');

	return (
		<AuthGuardRedirect auth={authRoles.onlyGuest}>
			<AuthLayout
				title={t('signIn.title')}
				subtitle={t('signIn.subtitle')}
				variant='signin'
				footerLinks={[
					{
						text: t('signIn.noAccount'),
						linkText: t('signIn.signUpLink'),
						href: '/sign-up'
					}
				]}
			>
				<AuthJsForm formType='signin' />
			</AuthLayout>
		</AuthGuardRedirect>
	);
}

export default SignInPage;
