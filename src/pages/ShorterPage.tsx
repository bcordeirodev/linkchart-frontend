import { Container, Box, Alert, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Analytics as AnalyticsIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

// Components
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { UpgradeCTA, ShorterHero, ShorterStats } from '@/features/shorter/components';
import { HeroSection, BenefitsSection, PublicLayout } from '@/shared/layout';
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
			{/* Hero Section */}
			<ShorterHero />

			{/* Main Content */}
			<Container
				maxWidth="md"
				sx={{ py: 4 }}
			>
				{!shortenedLink ? (
					<>
						<URLShortenerForm
							onSuccess={handleSuccess}
							onError={handleError}
						/>

						{/* Upgrade CTA for non-logged users */}
						{!user && <UpgradeCTA onSignUp={() => navigate('/sign-up')} />}
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

							<Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
								<Typography variant="body2">
									<strong>💡 Dica:</strong> Seus analytics básicos estarão disponíveis em tempo real.
									Para relatórios avançados, crie uma conta gratuita!
								</Typography>
							</Alert>
						</Box>
					</EnhancedPaper>
				)}
			</Container>

			{/* Stats Section */}
			<Container maxWidth="lg">
				<ShorterStats />
			</Container>

			{/* Benefits Section */}
			<BenefitsSection />

			{/* Hero Section (bottom) */}
			<HeroSection />
		</PublicLayout>
	);
}

export default ShorterPage;
