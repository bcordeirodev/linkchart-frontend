import React, { useState } from 'react';
import { Box, Container, Paper, Stack, Chip, Grid, Button, Typography, alpha, useTheme } from '@mui/material';
import { Security, Speed, Analytics, Star, PersonAdd, CheckCircle, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Componentes reutilizáveis
import { BrandLogo } from '@/shared/ui/base/BrandLogo';
import { AuthButtons } from '@/shared/ui/base/AuthButtons';
import { HeroSection } from '@/shared/layout/HeroSection';
import { BenefitsSection } from '@/shared/layout/BenefitsSection';
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { ShortUrlResult } from '@/features/links/components/ShortUrlResult';

// Hooks
import useUser from '../lib/auth/useUser';
import { pulse } from '@/shared/ui/animations';

interface IShortUrl {
    slug: string;
    short_url: string;
    original_url: string;
    expires_at: string | null;
}

const ShorterPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { data: user } = useUser();
    const [shorted, setShorted] = useState<IShortUrl | null>(null);

    const stats = [
        { value: '1M+', label: 'Links Criados' },
        { value: '50M+', label: 'Cliques Redirecionados' },
        { value: '99.9%', label: 'Uptime Garantido' },
        { value: '150+', label: 'Países Atendidos' }
    ];

    const handleFormSuccess = (shortUrl: IShortUrl) => {
        setShorted(shortUrl);
    };

    const handleCreateAnother = () => {
        setShorted(null);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, 
					${alpha(theme.palette.primary.main, 0.1)} 0%, 
					${alpha(theme.palette.secondary.main, 0.05)} 50%,
					${alpha(theme.palette.primary.main, 0.08)} 100%
				)`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
						radial-gradient(circle at 75% 75%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
                    zIndex: 0
                }}
            />

            {/* Header */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 10,
                    pt: 3,
                    pb: 2
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <BrandLogo onClick={() => navigate('/')} />
                        <AuthButtons />
                    </Box>
                </Container>
            </Box>

            <Container
                maxWidth="lg"
                sx={{ position: 'relative', zIndex: 1, py: 2 }}
            >
                {/* Hero Section */}
                <HeroSection />

                {/* URL Shortener Form/Result */}
                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: { xs: '100%', sm: 700, md: 800, lg: 900 },
                        mx: 'auto',
                        p: 3,
                        borderRadius: 3,
                        background: alpha(theme.palette.background.paper, 0.95),
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        mb: 4
                    }}
                >
                    {!shorted ? (
                        <>
                            <URLShortenerForm onSuccess={handleFormSuccess} />

                            {/* Indicadores de benefícios */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Stack
                                    direction="row"
                                    spacing={{ xs: 1.5, sm: 2.5 }}
                                    justifyContent="center"
                                    flexWrap="wrap"
                                    sx={{ gap: { xs: 1.5, sm: 2.5 } }}
                                >
                                    <Chip
                                        icon={<Security sx={{ fontSize: '18px !important' }} />}
                                        label="100% Seguro"
                                        size="medium"
                                        variant="outlined"
                                        sx={{
                                            borderColor: alpha(theme.palette.success.main, 0.4),
                                            color: 'success.main',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            height: 36,
                                            background: alpha(theme.palette.success.main, 0.05),
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.success.main,
                                                background: alpha(theme.palette.success.main, 0.1),
                                                transform: 'translateY(-1px)',
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`
                                            }
                                        }}
                                    />
                                    <Chip
                                        icon={<Speed sx={{ fontSize: '18px !important' }} />}
                                        label="Ultra Rápido"
                                        size="medium"
                                        variant="outlined"
                                        sx={{
                                            borderColor: alpha(theme.palette.primary.main, 0.4),
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            height: 36,
                                            background: alpha(theme.palette.primary.main, 0.05),
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                background: alpha(theme.palette.primary.main, 0.1),
                                                transform: 'translateY(-1px)',
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                                            }
                                        }}
                                    />
                                    <Chip
                                        icon={<Analytics sx={{ fontSize: '18px !important' }} />}
                                        label="Analytics Inclusos"
                                        size="medium"
                                        variant="outlined"
                                        sx={{
                                            borderColor: alpha(theme.palette.secondary.main, 0.4),
                                            color: 'secondary.main',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            height: 36,
                                            background: alpha(theme.palette.secondary.main, 0.05),
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme.palette.secondary.main,
                                                background: alpha(theme.palette.secondary.main, 0.1),
                                                transform: 'translateY(-1px)',
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}`
                                            }
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <ShortUrlResult
                                shortUrl={shorted}
                                onCreateAnother={handleCreateAnother}
                            />

                            {/* Upgrade CTA for non-logged users */}
                            {!user && (
                                <Paper
                                    sx={{
                                        p: 3,
                                        mt: 3,
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        borderRadius: 2,
                                        position: 'relative'
                                    }}
                                >
                                    <Chip
                                        label="🔥 OPORTUNIDADE"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                            color: 'white',
                                            fontWeight: 700,
                                            animation: `${pulse} 2s infinite`
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{ mb: 1, fontWeight: 700, textAlign: 'center' }}
                                    >
                                        🎯 Transforme este link em uma máquina de dados!
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2, textAlign: 'center' }}
                                    >
                                        Com uma conta GRÁTIS, você teria acesso a:
                                    </Typography>
                                    <Grid
                                        container
                                        spacing={1}
                                        sx={{ mb: 2 }}
                                    >
                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                                                Analytics em tempo real
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                                                QR Code automático
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                                                Link personalizado
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                            >
                                                <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                                                Controle total
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        startIcon={<Star />}
                                        onClick={() => navigate('/sign-up')}
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0960C0 0%, #0090D1 100%)',
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                    >
                                        🚀 Criar Conta e Desbloquear Tudo
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Benefits Section */}
                <BenefitsSection />

                {/* Stats Section */}
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        mb: 4
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ mb: 3, fontWeight: 700 }}
                    >
                        Números que impressionam
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                    >
                        {stats.map((stat, index) => (
                            <Grid
                                item
                                xs={6}
                                md={3}
                                key={index}
                            >
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 0.5,
                                            background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontSize: { xs: '1.8rem', md: '2.5rem' }
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* CTA Section */}
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 4,
                        px: 3,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        color: 'white'
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ mb: 1, fontWeight: 700 }}
                    >
                        Pronto para começar?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mb: 3, opacity: 0.9 }}
                    >
                        Junte-se a milhares de usuários que já confiam no LinkChart
                    </Typography>

                    {!user ? (
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => navigate('/sign-up')}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                '&:hover': {
                                    bgcolor: alpha('#fff', 0.9),
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Criar Conta Grátis
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            startIcon={<TrendingUp />}
                            onClick={() => navigate('/analytics')}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                '&:hover': {
                                    bgcolor: alpha('#fff', 0.9),
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            Acessar Dashboard
                        </Button>
                    )}
                </Box>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    py: 2,
                    textAlign: 'center',
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: alpha(theme.palette.background.paper, 0.5)
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        © 2024 LinkChart. Feito com ❤️ para tornar seus links mais inteligentes.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default ShorterPage;
