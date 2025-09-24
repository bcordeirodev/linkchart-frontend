/**
 * 🔐 AUTH LAYOUT - LINK CHART
 * Layout especializado para páginas de autenticação
 *
 * @description
 * Layout otimizado para login, registro e recuperação de senha.
 * Design moderno com split-screen e elementos visuais atraentes.
 *
 * @features
 * - Split-screen responsivo
 * - Gradientes e glassmorphism
 * - Animações suaves
 * - Mobile-first design
 * - Suporte a temas
 */

import { Box, Typography, alpha, Paper } from '@mui/material';
import { useMemo } from 'react';

import { AppIcon } from '@/lib/icons';
import { useResponsive } from '@/lib/theme';
import { Link } from '@/shared/components';
import { ResponsiveContainer } from '@/shared/ui/base';

import type { ReactNode } from 'react';

interface AuthLayoutProps {
	/** Conteúdo do formulário */
	children: ReactNode;
	/** Título da página */
	title?: string;
	/** Subtítulo da página */
	subtitle?: string;
	/** Variante visual */
	variant?: 'signin' | 'signup' | 'forgot' | 'reset' | 'verify';
	/** Mostrar seção lateral */
	showSideSection?: boolean;
	/** Links de navegação adicionais */
	footerLinks?: {
		text: string;
		linkText: string;
		href: string;
	}[];
	/** Classe CSS adicional */
	className?: string;
}

/**
 * Layout de autenticação com design moderno e responsivo
 */
function AuthLayout({
	children,
	title,
	subtitle,
	variant = 'signin',
	showSideSection = true,
	footerLinks = [],
	className
}: AuthLayoutProps) {
	const { isMobile } = useResponsive();

	// Configurações por variante
	const variantConfig = useMemo(() => {
		const configs = {
			signin: {
				sideTitle: 'Bem-vindo de volta!',
				sideSubtitle: 'Acesse sua conta e continue gerenciando seus links de forma inteligente.',
				gradientColors: ['#0A74DA', '#0D47A1', '#002171'],
				icon: 'login'
			},
			signup: {
				sideTitle: 'Junte-se a nós!',
				sideSubtitle: 'Crie sua conta e comece a encurtar e gerenciar seus links hoje mesmo.',
				gradientColors: ['#2E7D32', '#388E3C', '#1B5E20'],
				icon: 'user-plus'
			},
			forgot: {
				sideTitle: 'Recuperar Senha',
				sideSubtitle: 'Não se preocupe, vamos ajudá-lo a recuperar o acesso à sua conta.',
				gradientColors: ['#F57C00', '#FF9800', '#E65100'],
				icon: 'key'
			},
			reset: {
				sideTitle: 'Nova Senha',
				sideSubtitle: 'Defina uma nova senha segura para sua conta.',
				gradientColors: ['#7B1FA2', '#9C27B0', '#4A148C'],
				icon: 'shield'
			},
			verify: {
				sideTitle: 'Verificação de Email',
				sideSubtitle: 'Estamos verificando seu email para ativar sua conta.',
				gradientColors: ['#2E7D32', '#388E3C', '#1B5E20'],
				icon: 'check-circle'
			}
		};
		return configs[variant];
	}, [variant]);

	return (
		<Box
			className={className}
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 50%, #002171 100%)',
				overflow: 'hidden'
			}}
		>
			{/* Seção do Formulário */}
			<ResponsiveContainer
				variant='form'
				maxWidth='sm'
				sx={{
					flex: { xs: 1, md: showSideSection ? '0 0 45%' : 1 },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `radial-gradient(ellipse at top left, ${alpha('#0A74DA', 0.1)} 0%, transparent 50%)`,
						pointerEvents: 'none'
					}
				}}
			>
				<Paper
					elevation={24}
					sx={{
						width: '100%',
						maxWidth: 480,
						p: { xs: 3, sm: 4, md: 5 },
						background: alpha('#ffffff', 0.95),
						backdropFilter: 'blur(20px)',
						border: `1px solid ${alpha('#ffffff', 0.1)}`,
						borderRadius: 3,
						position: 'relative',
						overflow: 'hidden',
						boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							height: '1px',
							background:
								'linear-gradient(90deg, transparent 0%, rgba(10, 116, 218, 0.5) 50%, transparent 100%)'
						}
					}}
				>
					{/* Logo e Brand */}
					<Box sx={{ mb: 3, textAlign: 'center' }}>
						<Box
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 2,
								mb: 2
							}}
						>
							<Box
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 64,
									height: 64,
									borderRadius: 2,
									background: 'linear-gradient(135deg, #0A74DA 0%, #0D47A1 100%)',
									boxShadow: '0 8px 24px rgba(10, 116, 218, 0.3)',
									transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
									'&:hover': {
										transform: 'scale(1.05)'
									}
								}}
							>
								<AppIcon
									intent='link'
									size={24}
								/>
							</Box>

							<Typography
								variant='h5'
								sx={{
									fontWeight: 700,
									color: '#212121',
									fontSize: '1.5rem',
									letterSpacing: '-0.02em'
								}}
							>
								Link Chart
							</Typography>
						</Box>

						{/* Título */}
						{title ? (
							<Typography
								variant='h4'
								sx={{
									fontWeight: 600,
									color: '#212121',
									mb: 1,
									fontSize: { xs: '1.5rem', sm: '1.75rem' },
									lineHeight: 1.3
								}}
							>
								{title}
							</Typography>
						) : null}

						{/* Subtítulo */}
						{subtitle ? (
							<Typography
								variant='body1'
								sx={{
									color: '#5F6368',
									fontSize: '1rem',
									lineHeight: 1.6
								}}
							>
								{subtitle}
							</Typography>
						) : null}
					</Box>

					{/* Formulário */}
					<Box>
						{children}

						{/* Footer Links */}
						{footerLinks.length > 0 && (
							<Box
								sx={{
									mt: 3,
									pt: 2,
									borderTop: `1px solid ${alpha('#000000', 0.1)}`,
									textAlign: 'center'
								}}
							>
								{footerLinks.map((link) => (
									<Typography
										key={link.href}
										variant='body2'
										sx={{ color: '#5F6368' }}
									>
										{link.text}{' '}
										<Link
											to={link.href}
											sx={{
												color: '#0A74DA',
												fontWeight: 600,
												textDecoration: 'none',
												transition: 'all 0.2s ease',
												'&:hover': {
													color: '#0D47A1',
													textDecoration: 'underline'
												}
											}}
										>
											{link.linkText}
										</Link>
									</Typography>
								))}
							</Box>
						)}
					</Box>
				</Paper>
			</ResponsiveContainer>

			{/* Seção Lateral (apenas desktop) */}
			{showSideSection && !isMobile ? (
				<Box
					sx={{
						flex: { xs: 0, md: '0 0 55%' },
						display: { xs: 'none', md: 'flex' },
						alignItems: 'center',
						justifyContent: 'center',
						p: 6,
						position: 'relative',
						background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%)',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at center, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
							pointerEvents: 'none'
						}
					}}
				>
					{/* Conteúdo Principal */}
					<Box sx={{ textAlign: 'center', zIndex: 10, maxWidth: 600 }}>
						<Typography
							variant='h1'
							sx={{
								fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
								fontWeight: 900,
								lineHeight: 1.1,
								mb: 3,
								background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{variantConfig.sideTitle}
						</Typography>

						<Typography
							variant='h5'
							sx={{
								color: alpha('#ffffff', 0.9),
								lineHeight: 1.6,
								mb: 6,
								fontWeight: 400,
								maxWidth: 500,
								mx: 'auto'
							}}
						>
							{variantConfig.sideSubtitle}
						</Typography>
					</Box>
				</Box>
			) : null}
		</Box>
	);
}

export default AuthLayout;
