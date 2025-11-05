import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { publicLinkService } from '@/services/link-public.service';

import type { PublicLinkResponse } from '@/services/link-public.service';

/**
 * Gerencia todo o estado e lógica da página de encurtamento
 * Seguindo padrões arquiteturais do projeto
 */
export function useShorter() {
	const navigate = useNavigate();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Handler para sucesso na criação do link
	const handleSuccess = useCallback(
		(result: PublicLinkResponse) => {
			// Verificar se o resultado tem slug válido
			if (!result?.slug) {
				setError('Erro: Link criado mas sem slug válido');
				return;
			}

			// Mostrar estado de redirecionamento
			setIsRedirecting(true);

			// Redirecionar para analytics básicos com delay adequado
			setTimeout(() => {
				try {
					const analyticsUrl = publicLinkService.getPublicAnalyticsUrl(result.slug);
					navigate(analyticsUrl, {
						replace: true,
						state: {
							fromShorter: true,
							newLink: true,
							linkData: result
						}
					});
				} catch (error) {
					console.error('Erro ao redirecionar:', error);
					setError('Erro ao redirecionar para analytics');
					setIsRedirecting(false);
				}
			}, 1200);
		},
		[navigate]
	);

	// Handler para erro na criação do link
	const handleError = useCallback((errorMessage: string) => {
		setError(errorMessage);
		setIsRedirecting(false);
	}, []);

	// Handler para limpar erro
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Handler para navegação para sign up
	const handleSignUp = useCallback(() => {
		navigate('/sign-up');
	}, [navigate]);

	// Handler para navegação para login
	const handleLogin = useCallback(() => {
		navigate('/sign-in');
	}, [navigate]);

	return {
		// Estados
		isRedirecting,
		error,

		// Handlers
		handleSuccess,
		handleError,
		clearError,
		handleSignUp,
		handleLogin
	};
}
