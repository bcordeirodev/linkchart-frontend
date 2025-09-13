import { Container, Box, Alert, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Analytics as AnalyticsIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

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
	const [shortenedLink, setShortenedLink] = useState<PublicLinkResponse | null>(null);

	const handleSuccess = (result: PublicLinkResponse) => {
		// O resultado já vem no formato correto do publicLinkService
		setShortenedLink(result);

		// Redirecionar automaticamente para analytics básicos após 2 segundos
		setTimeout(() => {
			navigate(`/basic-analytics/${result.slug}`);
		}, 2000);
	};

	const handleError = (error: string) => {
		// Log do erro para debug
		console.warn('Erro no encurtamento:', error);
		setShortenedLink(null);
	};

	const handleCopyLink = async () => {
		if (shortenedLink) {
			const success = await publicLinkService.copyToClipboard(shortenedLink.short_url);
			if (success) {
				// Mostrar feedback de sucesso
			}
		}
	};

	const handleViewAnalytics = () => {
		if (shortenedLink) {
			navigate(publicLinkService.getBasicAnalyticsUrl(shortenedLink.slug));
		}
	};

	const handleCreateAnother = () => {
		setShortenedLink(null);
	};

	return (
		<PublicLayout
			variant="shorter"
			showHeader={true}
			showFooter={true}
		>
			{/* Hero Section - Simplificado */}
			<Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
				<Typography variant="h2" component="h1" gutterBottom>
					🔗 Encurtador de URLs
				</Typography>
				<Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
					Transforme links longos em URLs curtas e rastreáveis
				</Typography>
			</Container>

			{/* Main Content */}
			<Container maxWidth="md" sx={{ py: 2 }}>
				{!shortenedLink ? (
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
							<Typography variant="body2" color="text.secondary">
								[ Espaço para Google Ads - Banner 728x90 ]
							</Typography>
						</Box>

						{/* CTA Simples */}
						{!user && (
							<EnhancedPaper variant="glass" sx={{ mt: 4, p: 3, textAlign: 'center' }}>
								<Typography variant="h6" gutterBottom>
									📊 Quer analytics avançados?
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
									Crie uma conta gratuita para relatórios detalhados
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
				) : (
					/* Success Result */
					<EnhancedPaper variant="glass" sx={{ mb: 4 }}>
						<Box sx={{ p: 4, textAlign: 'center' }}>
							<Typography variant="h5" gutterBottom color="primary">
								✅ Link criado com sucesso!
							</Typography>

							<Box sx={{ my: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
								<Typography variant="body2" color="text.secondary" gutterBottom>
									Seu link encurtado:
								</Typography>
								<Typography
									variant="h6"
									sx={{
										fontFamily: 'monospace',
										wordBreak: 'break-all',
										color: 'primary.main'
									}}
								>
									{shortenedLink.short_url}
								</Typography>
							</Box>

							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
								<Button
									variant="contained"
									startIcon={<CopyIcon />}
									onClick={handleCopyLink}
									size="large"
								>
									Copiar Link
								</Button>
								<Button
									variant="outlined"
									startIcon={<AnalyticsIcon />}
									onClick={handleViewAnalytics}
									size="large"
								>
									Ver Analytics
								</Button>
								<Button
									variant="text"
									onClick={handleCreateAnother}
									size="large"
								>
									Criar Outro
								</Button>
							</Stack>

							<Alert severity="success" sx={{ mt: 3, textAlign: 'left' }}>
								<Typography variant="body2">
									<strong>🚀 Redirecionando...</strong> Você será levado para a página de analytics em alguns segundos.
								</Typography>
							</Alert>
						</Box>
					</EnhancedPaper>
				)}

				{/* Google Ads Space - Vertical Sidebar (apenas quando não há resultado) */}
				{!shortenedLink && (
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
						<Typography variant="body2" color="text.secondary">
							[ Espaço para Google Ads - Rectangle 300x250 ]
						</Typography>
					</Box>
				)}
			</Container>
		</PublicLayout>
	);
}

export default ShorterPage;
