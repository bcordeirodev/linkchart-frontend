'use client';

import { useCallback, useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from '@fuse/core/Link';
import { useNavigate } from '@/hooks';
import { getSessionRedirectUrl, resetSessionRedirectUrl } from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
import { ErrorPageLayout } from '@/components/error/ErrorPageLayout';

/**
 * Página de erro 401 refatorada
 * Usa o layout padrão de erro com lógica específica de autenticação
 */
function Error401Refactored() {
	const { status } = useSession();
	const navigate = useNavigate();
	const isAuthenticated = status === 'authenticated';
	const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

	// Get the intended redirect URL
	useEffect(() => {
		const savedUrl = getSessionRedirectUrl();
		setRedirectUrl(savedUrl);
	}, []);

	// Handle navigation back to intended destination or home
	const handleGoBack = useCallback(() => {
		if (isAuthenticated) {
			const targetUrl = redirectUrl && redirectUrl !== '/401' ? redirectUrl : '/';
			resetSessionRedirectUrl();
			navigate(targetUrl);
		} else {
			navigate('/sign-in');
		}
	}, [isAuthenticated, redirectUrl, navigate]);

	// Auto-redirect after a delay if user is authenticated
	useEffect(() => {
		if (isAuthenticated && redirectUrl && redirectUrl !== '/401') {
			const timer = setTimeout(() => {
				handleGoBack();
			}, 3000); // 3 second delay

			return () => clearTimeout(timer);
		}
	}, [isAuthenticated, redirectUrl, handleGoBack]);

	// Ações específicas para 401
	const actions = isAuthenticated ? (
		<>
			{redirectUrl && redirectUrl !== '/401' && (
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center mb-4"
				>
					Redirecionando em 3 segundos...
				</Typography>
			)}
			<div className="flex gap-4">
				<Button
					variant="contained"
					onClick={handleGoBack}
					className="min-w-[120px]"
				>
					{redirectUrl && redirectUrl !== '/401' ? 'Voltar' : 'Ir para Home'}
				</Button>
				<Link to="/">
					<Button variant="outlined">Home</Button>
				</Link>
			</div>
		</>
	) : (
		<>
			<Typography
				variant="body2"
				color="text.secondary"
				className="text-center mb-4"
			>
				Faça login para acessar esta página
			</Typography>
			<div className="flex gap-4">
				<Link to="/sign-in">
					<Button
						variant="contained"
						className="min-w-[120px]"
					>
						Fazer Login
					</Button>
				</Link>
				<Link to="/">
					<Button variant="outlined">Home</Button>
				</Link>
			</div>
		</>
	);

	return (
		<ErrorPageLayout
			errorCode="401"
			title="Acesso Não Autorizado"
			subtitle="Você não tem permissão para visualizar esta página."
			actions={actions}
		/>
	);
}

export default Error401Refactored;
