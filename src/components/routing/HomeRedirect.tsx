import { Navigate } from 'react-router-dom';
import { Loading } from '@/shared/components';
import useUser from '@/lib/auth/useUser';

/**
 * 🏠 COMPONENTE DE REDIRECIONAMENTO DA HOME
 *
 * FUNCIONALIDADE:
 * - Redireciona usuários logados para /analytics (dashboard global)
 * - Redireciona usuários não logados para ShorterPage (página pública)
 * - Gerencia estados de loading durante verificação de autenticação
 *
 * LÓGICA:
 * - Verifica status de autenticação via useUser hook
 * - Aplica redirecionamento condicional baseado no status do usuário
 * - Mantém UX fluida com loading states apropriados
 */
export function HomeRedirect() {
	const { data: user, isGuest } = useUser();

	// Se ainda está carregando dados do usuário, mostra loading
	if (user === undefined) {
		return <Loading />;
	}

	// Se usuário está logado (não é guest), redireciona para analytics
	if (user && !isGuest) {
		return (
			<Navigate
				to="/analytics"
				replace
			/>
		);
	}

	// Se usuário não está logado (é guest ou null), redireciona para shorter
	return (
		<Navigate
			to="/shorter"
			replace
		/>
	);
}

export default HomeRedirect;
