import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { UpgradeCTA, ShorterHero, ShorterStats } from '@/features/shorter/components';
import { HeroSection } from '@/shared/layout/HeroSection';
import { BenefitsSection } from '@/shared/layout/BenefitsSection';

// Hooks
import useUser from '../lib/auth/useUser';

/**
 * Página de encurtamento de URLs - REFATORADA
 * Seguindo regra de < 100 linhas por página
 */
function ShorterPage() {
	const navigate = useNavigate();
	const { data: user } = useUser();

	const handleSuccess = (shortUrl: unknown) => {
		// URL encurtada com sucesso - pode mostrar resultado
	};

	const handleError = (error: string) => {
		// Erro tratado pelo componente
	};

	return (
		<Box sx={{ minHeight: '100vh' }}>
			{/* Hero Section */}
			<ShorterHero />

			{/* Main Content */}
			<Container
				maxWidth="md"
				sx={{ py: 4 }}
			>
				<URLShortenerForm
					onSuccess={handleSuccess}
					onError={handleError}
				/>

				{/* Upgrade CTA for non-logged users */}
				{!user && <UpgradeCTA onSignUp={() => navigate('/sign-up')} />}
			</Container>

			{/* Stats Section */}
			<Container maxWidth="lg">
				<ShorterStats />
			</Container>

			{/* Benefits Section */}
			<BenefitsSection />

			{/* Hero Section (bottom) */}
			<HeroSection />
		</Box>
	);
}

export default ShorterPage;
