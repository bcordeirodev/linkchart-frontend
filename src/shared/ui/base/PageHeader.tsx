/**
 * 📋 PAGE HEADER - COMPONENTE UNIFICADO
 * Header padronizado para todas as páginas da aplicação
 */

import { Box, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { createGlassCard, createTextGradient, createPresetAnimations } from '@/lib/theme';
import { responsiveSpacing } from '@/lib/theme';

interface BreadcrumbItem {
	label: string;
	href?: string;
	current?: boolean;
}

interface PageHeaderProps {
	/** Título principal da página */
	title: string;
	/** Subtítulo ou descrição */
	subtitle?: string;
	/** Ícone do header */
	icon?: ReactNode;
	/** Breadcrumbs de navegação */
	breadcrumbs?: BreadcrumbItem[];
	/** Ações do header (botões, etc.) */
	actions?: ReactNode;
	/** Variante visual */
	variant?: 'default' | 'analytics' | 'dashboard' | 'profile';
	/** Mostrar elemento decorativo de fundo */
	showDecorative?: boolean;
	/** Compacto para mobile */
	compact?: boolean;
}

/**
 * Header unificado que consolida todos os padrões de header da aplicação
 */
export function PageHeader({
	title,
	subtitle,
	icon,
	breadcrumbs,
	actions,
	variant = 'default',
	showDecorative = true,
	compact = false
}: PageHeaderProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	// Configuração por variante
	const variantConfig = {
		default: {
			gradient: 'primary' as const,
			decorativeColor: theme.palette.primary.main,
			iconBg: theme.palette.primary.main
		},
		analytics: {
			gradient: 'warning' as const,
			decorativeColor: theme.palette.warning.main,
			iconBg: theme.palette.warning.main
		},
		dashboard: {
			gradient: 'primary' as const,
			decorativeColor: theme.palette.primary.main,
			iconBg: theme.palette.primary.main
		},
		profile: {
			gradient: 'secondary' as const,
			decorativeColor: theme.palette.secondary.main,
			iconBg: theme.palette.secondary.main
		}
	};

	const config = variantConfig[variant];

	return (
		<Box
			sx={{
				// Usar glassmorphism padronizado
				...createGlassCard(theme, 'neutral'),
				// Usar espaçamento responsivo
				...responsiveSpacing.section,
				// Altura mínima responsiva
				minHeight: compact ? { xs: 80, sm: 100, md: 120 } : { xs: 120, sm: 140, md: 160 },
				// Margin bottom
				mb: { xs: 2, sm: 3, md: 4 },
				// Animações
				...animations.fadeIn,
				// Posição relativa para elementos decorativos
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Elemento decorativo de fundo */}
			{showDecorative && (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: { xs: 80, sm: 100, md: 120 },
						height: { xs: 80, sm: 100, md: 120 },
						background: `linear-gradient(135deg, ${config.decorativeColor}40, ${config.decorativeColor}20)`,
						borderRadius: '50%',
						opacity: 0.3,
						transform: 'translate(30%, -30%)'
					}}
				/>
			)}

			{/* Breadcrumbs */}
			{breadcrumbs && breadcrumbs.length > 0 && (
				<Breadcrumbs
					sx={{
						mb: 2,
						'& .MuiBreadcrumbs-separator': {
							color: 'text.secondary'
						}
					}}
				>
					{breadcrumbs.map((crumb, index) => (
						<Link
							key={index}
							href={crumb.href}
							color={crumb.current ? 'primary' : 'text.secondary'}
							sx={{
								textDecoration: crumb.current ? 'none' : 'underline',
								fontWeight: crumb.current ? 600 : 400,
								fontSize: '0.875rem'
							}}
						>
							{crumb.label}
						</Link>
					))}
				</Breadcrumbs>
			)}

			{/* Conteúdo principal */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					position: 'relative',
					zIndex: 1,
					flexDirection: { xs: 'column', sm: 'row' },
					gap: { xs: 2, sm: 3 },
					alignItems: { xs: 'flex-start', sm: 'center' }
				}}
			>
				{/* Lado esquerdo - Título e ícone */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
					{/* Ícone */}
					{icon && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: { xs: 48, sm: 56, md: 64 },
								height: { xs: 48, sm: 56, md: 64 },
								borderRadius: 2,
								background: `linear-gradient(135deg, ${config.iconBg}, ${config.iconBg}80)`,
								color: 'white',
								boxShadow: theme.shadows[4],
								flexShrink: 0,
								fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
							}}
						>
							{icon}
						</Box>
					)}

					{/* Textos */}
					<Box sx={{ minWidth: 0, flex: 1 }}>
						<Typography
							variant={compact ? 'h5' : 'h4'}
							component="h1"
							sx={{
								// Usar gradiente de texto padronizado
								...createTextGradient(theme, config.gradient),
								fontWeight: 700,
								mb: subtitle ? 0.5 : 0,
								fontSize: {
									xs: compact ? '1.25rem' : '1.5rem',
									sm: compact ? '1.5rem' : '1.75rem',
									md: compact ? '1.75rem' : '2rem'
								},
								lineHeight: 1.2,
								// Quebra de texto responsiva
								wordBreak: 'break-word'
							}}
						>
							{title}
						</Typography>

						{subtitle && (
							<Typography
								variant="body1"
								sx={{
									color: 'text.secondary',
									fontSize: { xs: '0.875rem', sm: '1rem' },
									lineHeight: 1.4,
									// Limitar linhas em mobile
									display: '-webkit-box',
									WebkitLineClamp: { xs: 2, sm: 3 },
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden'
								}}
							>
								{subtitle}
							</Typography>
						)}
					</Box>
				</Box>

				{/* Lado direito - Ações */}
				{actions && (
					<Box
						sx={{
							display: 'flex',
							gap: 1,
							flexShrink: 0,
							alignSelf: { xs: 'stretch', sm: 'center' },
							justifyContent: { xs: 'center', sm: 'flex-end' }
						}}
					>
						{actions}
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default PageHeader;
