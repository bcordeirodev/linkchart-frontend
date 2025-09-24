import { Stack, Box, Typography, Container, Grid, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { memo, useMemo, useState, useEffect } from 'react';

// Components
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { ShorterStats, UpgradeCTA, RedirectingState } from '@/features/shorter/components';
import { useShorter } from '@/features/shorter/hooks';
import { AppIcon } from '@/lib/icons';

// Hooks
import { useResponsive } from '@/lib/theme/hooks/useResponsive';
import { PublicLayout } from '@/shared/layout';
import { EnhancedPaper } from '@/shared/ui/base';

import useUser from '../../lib/auth/useUser';

/**
 * 🔗 PÁGINA DE ENCURTAMENTO DE URLs - REDESENHADA
 *
 * FUNCIONALIDADE:u
 * - Interface limpa e organizada para encurtamento
 * - Formulário centralizado como foco principal
 * - Seções bem definidas e hierarquizadas
 * - Estados visuais claros e informativos
 * - Layout responsivo e moderno
 *
 * ARQUITETURA:
 * - Hook customizado para gerenciamento de estado
 * - Componentes modulares e reutilizáveis
 * - Layout em grid responsivo
 * - Performance otimizada com memo e useMemo
 * - Design centrado no usuário
 */
function ShorterPage() {
	const theme = useTheme();
	const { data: _user } = useUser();
	const { isRedirecting, error, handleSuccess, handleError, clearError, handleSignUp } = useShorter();
	const { isMobile } = useResponsive();

	// Estado para controlar animações de forma segura
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// Garante que o componente está completamente montado antes das animações
		// Reduz delay em mobile para melhor performance
		const timer = setTimeout(() => setMounted(true), isMobile ? 50 : 100);
		return () => clearTimeout(timer);
	}, [isMobile]);

	// Memoizar props dos componentes para otimização
	const formProps = useMemo(
		() => ({
			onSuccess: handleSuccess,
			onError: handleError
		}),
		[handleSuccess, handleError]
	);

	const ctaProps = useMemo(
		() => ({
			onSignUp: handleSignUp
		}),
		[handleSignUp]
	);

	return (
		<PublicLayout
			variant='shorter'
			showHeader
			showFooter
		>
			<Box
				sx={{
					py: 2,
					px: 2,
					background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
					borderBottom: `1px solid ${theme.palette.divider}`,
					minHeight: { xs: 'auto', md: '100vh' } // Full height apenas em desktop
				}}
			>
				<Container
					maxWidth='lg'
					sx={{
						px: { xs: 2, sm: 3, md: 4 } // Container padding responsivo
					}}
				>
					{/* Titulo da Página - Mobile First */}
					<Box
						sx={{
							textAlign: 'center',
							opacity: mounted ? 1 : 0,
							transition: isMobile ? 'opacity 0.4s ease-in-out' : 'opacity 0.6s ease-in-out',
							mb: 1,
							mt: 1
						}}
					>
						<Typography
							variant='h3'
							component='h1' // h1 para SEO
							sx={{
								fontWeight: { xs: 700, md: 800 }, // Peso menor em mobile
								mb: { xs: 1, sm: 1.5 },
								background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								// Mobile-first font sizes
								fontSize: {
									xs: '1.75rem', // 28px - mobile
									sm: '2.25rem', // 36px - tablet
									md: '2.75rem', // 44px - desktop
									lg: '3rem' // 48px - large desktop
								},
								lineHeight: { xs: 1.2, md: 1.1 },
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: { xs: 'column', sm: 'row' }, // Stack em mobile
								gap: { xs: 1, sm: 2 }
							}}
						>
							<AppIcon
								intent='link'
								size={isMobile ? 32 : 48} // Ícone menor em mobile
								color='currentColor'
							/>
							{isMobile ? 'Encurtador' : 'Encurtador de URLs'}
						</Typography>
						<Typography
							variant='body1'
							color='text.secondary'
							sx={{
								fontWeight: 400,
								maxWidth: { xs: '100%', sm: 500, md: 600 },
								mx: 'auto',
								lineHeight: { xs: 1.5, md: 1.6 },
								fontSize: { xs: '0.95rem', sm: '1rem' }, // Texto menor em mobile
								px: { xs: 1, sm: 0 } // Padding lateral em mobile
							}}
						>
							{isMobile
								? 'Transforme URLs longas em links curtos e rastreáveis.'
								: 'Transforme URLs longas em links curtos e poderosos. Acompanhe cliques e analise o desempenho em tempo real.'}
						</Typography>
					</Box>

					{/* Conteúdo Principal - Mobile First Layout */}
					<Grid
						container
						spacing={{ xs: 2, sm: 3, md: 4 }} // Spacing menor em mobile
						alignItems='flex-start'
						direction={{ xs: 'column', lg: 'row' }} // Stack em mobile, row em desktop
					>
						{/* Coluna Principal - Formulário (prioridade em mobile) */}
						<Grid
							item
							xs={12}
							lg={8}
							sx={{
								order: { xs: 1, lg: 1 } // Formulário sempre primeiro
							}}
						>
							<Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
								{/* Spacing responsivo */}
								{/* Error Alert - Mobile Optimized */}
								{error ? (
									<Alert
										severity='error'
										onClose={clearError}
										sx={{
											borderRadius: { xs: 1, sm: 2 },
											fontSize: { xs: '0.875rem', sm: '1rem' },
											'& .MuiAlert-message': {
												fontWeight: 500
											},
											'& .MuiAlert-action': {
												pt: { xs: 0, sm: '7px' } // Ajuste do botão close em mobile
											}
										}}
									>
										{error}
									</Alert>
								) : null}
								{/* Estado de Redirecionamento - Mobile Optimized */}
								{isRedirecting ? <RedirectingState isVisible={isRedirecting} /> : null}
								{/* Formulário Principal - Mobile First */}
								{!isRedirecting && (
									<Box
										sx={{
											opacity: mounted ? 1 : 0,
											transform: mounted ? 'translateY(0)' : 'translateY(20px)',
											transition: isMobile
												? 'all 0.5s ease-in-out 0.1s' // Transição mais rápida em mobile
												: 'all 0.8s ease-in-out 0.2s'
										}}
									>
										<EnhancedPaper
											variant='glass'
											sx={{
												p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
												borderRadius: { xs: 2, sm: 3 } // Border radius menor em mobile
											}}
										>
											<URLShortenerForm {...formProps} />
										</EnhancedPaper>
									</Box>
								)}
							</Stack>
						</Grid>

						{/* Coluna Lateral - CTA (após formulário em mobile) */}
						<Grid
							item
							xs={12}
							lg={4}
							sx={{
								order: { xs: 2, lg: 2 },
								mt: { xs: 1, lg: 0 } // Margin top apenas em mobile
							}}
						>
							<Box
								sx={{
									opacity: mounted ? 1 : 0,
									transform: mounted ? 'translateY(0)' : 'translateY(20px)',
									transition: isMobile
										? 'all 0.5s ease-in-out 0.3s' // Delay menor em mobile
										: 'all 0.8s ease-in-out 0.6s',
									// Sticky em desktop, normal em mobile
									position: { xs: 'static', lg: 'sticky' },
									top: { lg: 24 }
								}}
							>
								<UpgradeCTA {...ctaProps} />
							</Box>
						</Grid>
					</Grid>

					{/* Seção de Estatísticas - Mobile First */}
					<Box
						sx={{
							borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' } // Divisor apenas em mobile
						}}
					>
						<ShorterStats />
					</Box>
				</Container>
			</Box>
		</PublicLayout>
	);
}

export default memo(ShorterPage);
