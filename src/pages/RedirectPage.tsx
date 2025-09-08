import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';

// Components
import { RedirectLoader } from '@/features/redirect/components/RedirectLoader';
import RedirectStats from '@/features/redirect/components/RedirectStats';

// Hooks
import { useRedirectWithDelay } from '@/features/redirect/hooks/useRedirectWithDelay';

/**
 * Página de redirecionamento - REFATORADA
 * Seguindo regra de < 100 linhas por página
 */
function RedirectPage() {
	const theme = useTheme();
	const { shortCode } = useParams<{ shortCode: string }>();
	const [targetUrl, setTargetUrl] = useState<string>('');
	const [isValidLink, setIsValidLink] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const { countdown, isRedirecting } = useRedirectWithDelay(targetUrl, { delay: 3000 });

	useEffect(() => {
		const fetchRedirectData = async () => {
			if (!shortCode) {
				setError('Código de redirecionamento não fornecido');
				return;
			}

			try {
				// Simular busca dos dados do link
				// Em produção, isso viria da API
				const mockData = {
					original_url: 'https://www.example.com',
					is_active: true,
					title: 'Link de Exemplo'
				};

				if (mockData.is_active) {
					setTargetUrl(mockData.original_url);
					setIsValidLink(true);
				} else {
					setError('Link inativo ou expirado');
				}
			} catch (err) {
				setError('Erro ao carregar dados do link');
			}
		};

		fetchRedirectData();
	}, [shortCode]);

	if (error) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background:
						theme.palette.mode === 'dark'
							? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
							: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
					color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'white'
				}}
			>
				<RedirectStats
					error={error}
					shortCode={shortCode || ''}
				/>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background:
					theme.palette.mode === 'dark'
						? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
						: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
				color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'white'
			}}
		>
			{isValidLink && targetUrl ? (
				<RedirectLoader
					targetUrl={targetUrl}
					countdown={countdown}
					isRedirecting={isRedirecting}
				/>
			) : (
				<RedirectLoader
					targetUrl="Carregando..."
					countdown={0}
					isRedirecting={false}
				/>
			)}
		</Box>
	);
}

export default RedirectPage;
