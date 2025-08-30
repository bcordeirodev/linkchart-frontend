import { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Components
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { ShortUrlResult } from '@/features/links/components/ShortUrlResult';
import { UpgradeCTA, ShorterHero, ShorterStats } from '@/features/shorter/components';
import { HeroSection } from '@/shared/layout/HeroSection';
import { BenefitsSection } from '@/shared/layout/BenefitsSection';

// Hooks
import useUser from '../lib/auth/useUser';
import { useURLShortener } from '@/features/links/hooks/useURLShortener';

interface IShortUrl {
    slug: string;
    short_url: string;
    original_url: string;
    title?: string;
}

/**
 * Página de encurtamento de URLs - REFATORADA
 * Seguindo regra de < 100 linhas por página
 */
function ShorterPage() {
    const navigate = useNavigate();
    const { data: user } = useUser();
    const [shorted, setShorted] = useState<IShortUrl | null>(null);

    const {
        shortenUrl,
        loading,
        error
    } = useURLShortener();

    const handleShorten = async (data: { original_url: string; title?: string }) => {
        try {
            const result = await shortenUrl(data);
            setShorted({
                slug: result.slug || '',
                short_url: result.short_url || '',
                original_url: result.original_url || data.original_url,
                title: result.title || data.title
            });
        } catch (err) {
            console.error('Erro ao encurtar URL:', err);
        }
    };

    const handleCreateAnother = () => {
        setShorted(null);
    };

    return (
        <Box sx={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <ShorterHero />

            {/* Main Content */}
            <Container maxWidth="md" sx={{ py: 4 }}>
                {!shorted ? (
                    <Box>
                        <URLShortenerForm
                            onSubmit={handleShorten}
                            loading={loading}
                            error={error}
                        />

                        {/* Upgrade CTA for non-logged users */}
                        {!user && (
                            <UpgradeCTA onSignUp={() => navigate('/sign-up')} />
                        )}
                    </Box>
                ) : (
                    <Box>
                        <ShortUrlResult
                            shortUrl={shorted}
                            onCreateAnother={handleCreateAnother}
                        />

                        {/* Upgrade CTA for non-logged users */}
                        {!user && (
                            <UpgradeCTA onSignUp={() => navigate('/sign-up')} />
                        )}
                    </Box>
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
        </Box>
    );
}

export default ShorterPage;
