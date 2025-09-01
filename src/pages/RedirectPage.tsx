import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Components
import { RedirectLoader } from '@/features/redirect/components/RedirectLoader';
import RedirectStats from '@/features/redirect/components/RedirectStats';

// Hooks
import { useRedirectWithDelay } from '@/features/redirect/hooks/useRedirectWithDelay';

// Tema profissional para a página de redirecionamento
const redirectTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#3b82f6'
		},
		background: {
			default: '#0f172a',
			paper: '#1e293b'
		}
	}
});

/**
 * Página de redirecionamento - REFATORADA
 * Seguindo regra de < 100 linhas por página
 */
function RedirectPage() {
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
			<ThemeProvider theme={redirectTheme}>
				<CssBaseline />
				<Box
					sx={{
						minHeight: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
					}}
				>
					<RedirectStats
						error={error}
						shortCode={shortCode || ''}
					/>
				</Box>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider theme={redirectTheme}>
			<CssBaseline />
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
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
		</ThemeProvider>
	);
}

export default RedirectPage;
