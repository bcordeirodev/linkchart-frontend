/**
 * ❌ ERROR LAYOUT - LINK CHART
 * Layout especializado para páginas de erro
 *
 * @description
 * Layout otimizado para páginas 404, 500, não autorizado, etc.
 * Design amigável que ajuda o usuário a navegar de volta.
 *
 * @features
 * - Design centrado e limpo
 * - Sugestões de navegação inteligentes
 * - Animações suaves
 * - Responsivo mobile-first
 * - Suporte a temas
 */

import { useMemo, ReactNode } from 'react';
import { Box, useTheme, Container, Typography, Button, Stack } from '@mui/material';
import { useMainTheme, useResponsive, createPresetAnimations } from '@/lib/theme';
import { Layout } from './core';
import { Link } from '@/shared/components';
import { AppIcon } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';

interface ErrorLayoutProps {
	/** Conteúdo da página de erro */
	children: ReactNode;
	/** Tipo de erro */
	errorType?: '404' | '500' | '403' | 'network' | 'generic';
	/** Mostrar botão de voltar */
	showBackButton?: boolean;
	/** Mostrar link para home */
	showHomeLink?: boolean;
	/** Sugestões de navegação */
	suggestions?: Array<{ label: string; href: string }>;
	/** Classe CSS adicional */
	className?: string;
}

/**
 * Layout de erro com design amigável e navegação útil
 */
function ErrorLayout({
	children,
	errorType = 'generic',
	showBackButton = true,
	showHomeLink = true,
	suggestions = [],
	className
}: ErrorLayoutProps) {
	const theme = useTheme();
	const mainTheme = useMainTheme();
	const { isMobile } = useResponsive();
	const animations = createPresetAnimations(theme);
	const navigate = useNavigate();

	// Configurações por tipo de erro
	const errorConfig = useMemo(() => {
		const configs = {
			'404': {
				icon: 'search',
				color: theme.palette.warning.main,
				bgGradient: [theme.palette.warning.light, theme.palette.warning.main]
			},
			'500': {
				icon: 'alert-triangle',
				color: theme.palette.error.main,
				bgGradient: [theme.palette.error.light, theme.palette.error.main]
			},
			'403': {
				icon: 'shield-off',
				color: theme.palette.error.main,
				bgGradient: [theme.palette.error.light, theme.palette.error.main]
			},
			network: {
				icon: 'wifi-off',
				color: theme.palette.info.main,
				bgGradient: [theme.palette.info.light, theme.palette.info.main]
			},
			generic: {
				icon: 'alert-circle',
				color: theme.palette.grey[600],
				bgGradient: [theme.palette.grey[300], theme.palette.grey[500]]
			}
		};
		return configs[errorType];
	}, [errorType, theme]);

	// Handlers de navegação
	const handleGoBack = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate('/');
		}
	};

	// Layout de erro
	const errorLayouts = useMemo(
		() => ({
			layout1: ({ children }: { children: ReactNode }) => (
				<Box
					className={className}
					sx={{
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
						background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					{/* Elementos decorativos de fundo */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 0.03,
							backgroundImage: `radial-gradient(circle at 20% 80%, ${errorConfig.color} 0%, transparent 50%),
							                 radial-gradient(circle at 80% 20%, ${errorConfig.color} 0%, transparent 50%),
							                 radial-gradient(circle at 40% 40%, ${errorConfig.color} 0%, transparent 50%)`,
							pointerEvents: 'none'
						}}
					/>

					{/* Header simples */}
					<Box
						component="header"
						sx={{
							py: 2,
							borderBottom: `1px solid ${theme.palette.divider}`,
							backgroundColor: theme.palette.background.paper
						}}
					>
						<Container maxWidth="lg">
							<Link
								href="/"
								sx={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 1,
									textDecoration: 'none',
									color: 'text.primary',
									fontWeight: 600,
									fontSize: '1.25rem'
								}}
							>
								<AppIcon
									intent="link"
									size={24}
								/>
								Link Chart
							</Link>
						</Container>
					</Box>

					{/* Conteúdo principal */}
					<Box
						component="main"
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							p: { xs: 2, sm: 3, md: 4 },
							position: 'relative',
							zIndex: 1
						}}
					>
						<Container maxWidth="md">
							<Box
								sx={{
									textAlign: 'center',
									...animations.fadeIn
								}}
							>
								{/* Ícone de erro */}
								<Box
									sx={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: { xs: 80, sm: 100, md: 120 },
										height: { xs: 80, sm: 100, md: 120 },
										borderRadius: '50%',
										background: `linear-gradient(135deg, ${errorConfig.bgGradient[0]}, ${errorConfig.bgGradient[1]})`,
										mb: 4,
										boxShadow: theme.shadows[8],
										animation: 'bounce 2s infinite',
										'@keyframes bounce': {
											'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
											'40%': { transform: 'translateY(-10px)' },
											'60%': { transform: 'translateY(-5px)' }
										}
									}}
								>
									<AppIcon
										intent="error"
										size={isMobile ? 40 : 60}
									/>
								</Box>

								{/* Conteúdo do erro */}
								<Box
									sx={{
										mb: 4,
										animation: 'slideInUp 0.6s ease-out',
										'@keyframes slideInUp': {
											from: { opacity: 0, transform: 'translateY(30px)' },
											to: { opacity: 1, transform: 'translateY(0)' }
										}
									}}
								>
									{children}
								</Box>

								{/* Ações de navegação */}
								<Stack
									direction={{ xs: 'column', sm: 'row' }}
									spacing={2}
									justifyContent="center"
									alignItems="center"
									sx={{ mb: 4 }}
								>
									{showBackButton && (
										<Button
											variant="contained"
											size="large"
											onClick={handleGoBack}
											startIcon={
												<AppIcon
													intent="back"
													size={20}
												/>
											}
											sx={{ minWidth: { xs: '100%', sm: 160 } }}
										>
											Voltar
										</Button>
									)}

									{showHomeLink && (
										<Button
											variant="outlined"
											size="large"
											component={Link}
											href="/"
											startIcon={
												<AppIcon
													intent="link"
													size={20}
												/>
											}
											sx={{ minWidth: { xs: '100%', sm: 160 } }}
										>
											Ir para Home
										</Button>
									)}
								</Stack>

								{/* Sugestões de navegação */}
								{suggestions.length > 0 && (
									<Box
										sx={{
											animation: 'slideInUp 0.6s ease-out',
											animationDelay: '0.3s',
											'@keyframes slideInUp': {
												from: { opacity: 0, transform: 'translateY(30px)' },
												to: { opacity: 1, transform: 'translateY(0)' }
											}
										}}
									>
										<Typography
											variant="h6"
											sx={{ mb: 2, color: 'text.secondary' }}
										>
											Talvez você esteja procurando:
										</Typography>
										<Stack
											direction={{ xs: 'column', sm: 'row' }}
											spacing={1}
											justifyContent="center"
											flexWrap="wrap"
										>
											{suggestions.map((suggestion, index) => (
												<Button
													key={index}
													variant="text"
													component={Link}
													href={suggestion.href}
													sx={{
														color: 'text.secondary',
														'&:hover': {
															color: 'primary.main',
															backgroundColor: 'action.hover'
														}
													}}
												>
													{suggestion.label}
												</Button>
											))}
										</Stack>
									</Box>
								)}
							</Box>
						</Container>
					</Box>

					{/* Footer simples */}
					<Box
						component="footer"
						sx={{
							py: 2,
							borderTop: `1px solid ${theme.palette.divider}`,
							backgroundColor: theme.palette.background.paper
						}}
					>
						<Container maxWidth="lg">
							<Typography
								variant="body2"
								sx={{
									textAlign: 'center',
									color: 'text.secondary'
								}}
							>
								© 2024 Link Chart. Todos os direitos reservados.
							</Typography>
						</Container>
					</Box>
				</Box>
			)
		}),
		[
			theme,
			mainTheme,
			className,
			errorConfig,
			isMobile,
			animations,
			children,
			showBackButton,
			showHomeLink,
			suggestions,
			handleGoBack
		]
	);

	return (
		<Layout
			layouts={errorLayouts}
			settings={{
				style: 'layout1' as const,
				config: {
					navbar: { display: false, folded: false, position: 'left' },
					toolbar: { display: false, style: 'static' },
					footer: { display: false, style: 'static' }
				}
			}}
		>
			{children}
		</Layout>
	);
}

export default ErrorLayout;
