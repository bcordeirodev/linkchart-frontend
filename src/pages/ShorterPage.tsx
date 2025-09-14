import { Container, Box, Alert, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { PublicLayout } from '@/shared/layout';
import { EnhancedPaper } from '@/shared/ui/base';

// Hooks
import useUser from '../lib/auth/useUser';

// Services
import { publicLinkService, PublicLinkResponse } from '@/services/publicLink.service';

/**
 * Página de encurtamento de URLs - REFATORADA
 * Seguindo regra de < 100 linhas por página
 */
function ShorterPage() {
	const navigate = useNavigate();
	const { data: user } = useUser();
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSuccess = (result: PublicLinkResponse) => {
		// Verificar se o resultado tem slug válido
		if (!result || !result.slug) {
			setError('Erro: Link criado mas sem slug válido');
			return;
		}

		// Mostrar estado de redirecionamento
		setIsRedirecting(true);

		// Redirecionar para analytics básicos com delay adequado para evitar problemas de transição
		setTimeout(() => {
			try {
				const analyticsUrl = publicLinkService.getBasicAnalyticsUrl(result.slug);
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
		}, 1200); // Delay aumentado para garantir estabilidade
	};

	const handleError = (errorMessage: string) => {
		setError(errorMessage);
		setIsRedirecting(false);
	};

	return (
		<PublicLayout
			variant="shorter"
			showHeader={true}
			showFooter={true}
		>
			{/* Main Content */}
			<Container
				maxWidth="md"
				sx={{ py: 6 }}
			>
				{/* Error Alert */}
				{error && (
					<Alert
						severity="error"
						sx={{ mb: 3 }}
						onClose={() => setError(null)}
					>
						{error}
					</Alert>
				)}

				{/* Estado de Redirecionamento */}
				{isRedirecting && (
					<EnhancedPaper
						variant="glass"
						sx={{
							mb: 4,
							textAlign: 'center',
							p: 4,
							opacity: isRedirecting ? 1 : 0,
							transition: 'opacity 0.3s ease-in-out'
						}}
					>
						<CircularProgress
							size={48}
							sx={{ mb: 2 }}
						/>
						<Typography
							variant="h6"
							color="primary"
							gutterBottom
						>
							✅ Link criado com sucesso!
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							Redirecionando para analytics...
						</Typography>
					</EnhancedPaper>
				)}

				{/* Formulário Principal */}
				{!isRedirecting && (
					<>
						<URLShortenerForm
							onSuccess={handleSuccess}
							onError={handleError}
						/>

						{/* Google Ads Space - Horizontal Banner */}
						<Box
							sx={{
								my: 4,
								p: 2,
								border: '2px dashed #ccc',
								borderRadius: 2,
								textAlign: 'center',
								minHeight: '120px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								bgcolor: 'grey.50'
							}}
						>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								[ Espaço para Google Ads - Banner 728x90 ]
							</Typography>
						</Box>

						{/* CTA Simples */}
						{!user && (
							<EnhancedPaper
								variant="glass"
								sx={{ mt: 4, p: 3, textAlign: 'center' }}
							>
								<Typography
									variant="h6"
									gutterBottom
								>
									📊 Quer analytics avançados?
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 2 }}
								>
									Crie uma conta gratuita e tenha acesso a relatórios detalhados com métricas de
									cliques, localização geográfica, dispositivos, referrers e muito mais. Monitore o
									desempenho dos seus links em tempo real!
								</Typography>
								<Button
									variant="contained"
									onClick={() => navigate('/sign-up')}
									size="large"
								>
									Criar Conta Gratuita
								</Button>
							</EnhancedPaper>
						)}
					</>
				)}

				{/* Google Ads Space - Vertical Sidebar (apenas quando não está redirecionando) */}
				{!isRedirecting && (
					<Box
						sx={{
							mt: 4,
							p: 2,
							border: '2px dashed #ccc',
							borderRadius: 2,
							textAlign: 'center',
							minHeight: '250px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							bgcolor: 'grey.50'
						}}
					>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							[ Espaço para Google Ads - Rectangle 300x250 ]
						</Typography>
					</Box>
				)}
			</Container>
		</PublicLayout>
	);
}

export default ShorterPage;
