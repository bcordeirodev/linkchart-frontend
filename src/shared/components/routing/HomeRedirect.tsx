import { Navigate } from 'react-router-dom';

import useUser from '@/lib/auth/useUser';
import { Loading } from '@/shared/components';

/**
 * Componente de redirecionamento baseado no status de autenticação do usuário
 */
export function HomeRedirect() {
	const { data: user, isGuest } = useUser();

	if (user === undefined) {
		return <Loading />;
	}

	if (user && !isGuest) {
		return (
			<Navigate
				to='/links'
				replace
			/>
		);
	}

	return (
		<Navigate
			to='/shorter'
			replace
		/>
	);
}
