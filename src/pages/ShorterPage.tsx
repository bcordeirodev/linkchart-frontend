import { Stack, Box, Typography, Container, Grid, CircularProgress, Alert } from '@mui/material';
import { memo, useMemo, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

// Components
import { PublicLayout } from '@/shared/layout';
import { EnhancedPaper } from '@/shared/ui/base';
import { ShorterStats, UpgradeCTA } from '@/features/shorter/components';
import { URLShortenerForm } from '@/features/links/components/URLShortenerForm';
import { useShorter } from '@/features/shorter/hooks';
import { AppIcon } from '@/lib/icons';

// Hooks
import useUser from '../lib/auth/useUser';
import { useResponsive } from '@/lib/theme/hooks/useResponsive';

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

	// Componente de estado de redirecionamento - Mobile First
	const RedirectingState = () => (
		<EnhancedPaper
			variant="glass"
			sx={{
				textAlign: 'center',
				p: { xs: 3, sm: 4 }, // Padding responsivo
				mb: { xs: 3, sm: 4 }, // Margin responsivo
				background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
				border: '2px solid',
				borderColor: 'success.light',
				borderRadius: { xs: 2, sm: 3 } // Border radius responsivo
			}}
		>
			<CircularProgress
				size={isMobile ? 48 : 56} // Tamanho menor em mobile
				thickness={4}
				sx={{
					mb: { xs: 2, sm: 3 },
					color: 'success.main'
				}}
			/>

			<Typography
				variant={isMobile ? 'h6' : 'h5'} // Variante menor em mobile
				color="success.main"
				sx={{
					fontWeight: 700,
					mb: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: { xs: 'column', sm: 'row' }, // Stack em mobile
					gap: { xs: 0.5, sm: 1 },
					fontSize: { xs: '1.1rem', sm: '1.25rem' } // Font size responsivo
				}}
			>
				<AppIcon
					intent="success"
					size={isMobile ? 20 : 24} // Ícone menor em mobile
					color="currentColor"
				/>
				{isMobile ? 'Sucesso!' : 'Link criado com sucesso!'}
			</Typography>

			<Typography
				variant="body2"
				color="text.secondary"
				sx={{
					fontWeight: 500,
					opacity: 0.8,
					fontSize: { xs: '0.875rem', sm: '1rem' } // Texto menor em mobile
				}}
			>
				{isMobile ? 'Redirecionando...' : 'Redirecionando para analytics...'}
			</Typography>

			{/* Indicador de progresso visual - Mobile Optimized */}
			<Box
				sx={{
					mt: { xs: 2, sm: 3 },
					height: { xs: 3, sm: 4 }, // Altura menor em mobile
					bgcolor: 'grey.200',
					borderRadius: 2,
					overflow: 'hidden',
					position: 'relative'
				}}
			>
				<Box
					sx={{
						height: '100%',
						bgcolor: 'success.main',
						borderRadius: 2,
						animation: isMobile ? 'progressBar 1s ease-in-out' : 'progressBar 1.2s ease-in-out', // Mais rápido em mobile
						'@keyframes progressBar': {
							'0%': { width: '0%' },
							'100%': { width: '100%' }
						}
					}}
				/>
			</Box>
		</EnhancedPaper>
	);

	return (
		<PublicLayout
			variant="shorter"
			showHeader={true}
			showFooter={true}
		>
			<Box
				sx={{
					// Mobile-first: padding menor em mobile, aumenta progressivamente
					py: { xs: 2, sm: 3, md: 4, lg: 6 },
					px: { xs: 1, sm: 2 }, // Padding horizontal para mobile
					background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
					borderBottom: `1px solid ${theme.palette.divider}`,
					minHeight: { xs: 'auto', md: '100vh' } // Full height apenas em desktop
				}}
			>
				<Container
					maxWidth="lg"
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
							mb: { xs: 2, sm: 3, md: 4 } // Margin bottom responsivo
						}}
					>
						<Typography
							variant="h3"
							component="h1" // h1 para SEO
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
								intent="link"
								size={isMobile ? 32 : 48} // Ícone menor em mobile
								color="currentColor"
							/>
							{isMobile ? 'Encurtador' : 'Encurtador de URLs'}
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary"
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
						alignItems="flex-start"
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
								{error && (
									<Alert
										severity="error"
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
								)}
								{/* Estado de Redirecionamento - Mobile Optimized */}
								{isRedirecting && <RedirectingState />}
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
											variant="glass"
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
							mt: { xs: 3, sm: 4, md: 6 }, // Margin top responsivo
							pt: { xs: 2, sm: 3, md: 4 }, // Padding top para separação visual
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
