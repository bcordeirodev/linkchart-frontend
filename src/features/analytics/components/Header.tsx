import { Tooltip, useTheme, CircularProgress, Box, Typography, IconButton } from '@mui/material';
import { Refresh, Download, Share, Dashboard, Analytics } from '@mui/icons-material';
import {
	createComponentColorSet,
	createGlassCard,
	createSpacingUtils,
	createPresetShadows,
	createTextGradient,
	createPresetAnimations
} from '@/lib/theme';

interface HeaderProps {
	variant: 'dashboard' | 'analytics';
	onRefresh?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	loading?: boolean;
	title?: string;
	subtitle?: string;
}

/**
 * Cabeçalho unificado para dashboard e analytics
 * Adapta-se ao contexto mantendo consistência visual com utilitários de tema
 */
export function Header({ variant, onRefresh, onDownload, onShare, loading = false, title, subtitle }: HeaderProps) {
	const theme = useTheme();

	// Usa utilitários de tema para cores consistentes
	const primaryColors = createComponentColorSet(theme, 'primary');
	const warningColors = createComponentColorSet(theme, 'warning');
	const spacing = createSpacingUtils(theme);
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	// Configurações por variante usando utilitários
	const config = {
		dashboard: {
			title: title || 'Dashboard',
			subtitle: subtitle || 'Visão geral dos seus links e métricas de performance',
			icon: <Dashboard />,
			colors: primaryColors
		},
		analytics: {
			title: title || 'Analytics Dashboard',
			subtitle: subtitle || 'Análise detalhada do desempenho dos seus links',
			icon: <Analytics />,
			colors: warningColors
		}
	};

	const currentConfig = config[variant];

	return (
		<Box
			sx={{
				// Usa glassmorphism utilitário
				...(createGlassCard(theme, variant === 'dashboard' ? 'primary' : 'neutral') as any),

				// Usa espaçamento padronizado
				p: 3,
				mb: 3,

				// Usa sombras pré-definidas
				boxShadow: shadows.card,

				// Responsividade
				minHeight: { xs: 120, sm: 140, md: 160 }
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					position: 'relative'
				}}
			>
				{/* Elemento decorativo de fundo */}
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						right: 0,
						width: 100,
						height: 100,
						background: currentConfig.colors.gradients.subtle,
						borderRadius: '50%',
						opacity: 0.3,
						transform: 'translate(30px, -30px)'
					}}
				/>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
					{/* Ícone da variante */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 56,
							height: 56,
							borderRadius: 2,
							background: currentConfig.colors.gradients.primary,
							color: 'white',
							boxShadow: shadows.primaryGlow,
							...animations.iconSpin
						}}
					>
						{currentConfig.icon}
					</Box>

					<Box>
						<Typography
							variant="h5"
							sx={{
								// Usa gradiente de texto
								...createTextGradient(theme, variant === 'dashboard' ? 'primary' : 'warning'),
								fontWeight: 700,
								mb: 0.5
							}}
						>
							{currentConfig.title}
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: 'text.secondary',
								maxWidth: { xs: 200, sm: 300, md: 400 }
							}}
						>
							{currentConfig.subtitle}
						</Typography>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', gap: 1, zIndex: 1 }}>
					{onRefresh && (
						<Tooltip title="Atualizar dados">
							<IconButton
								onClick={onRefresh}
								disabled={loading}
								sx={{
									...animations.buttonHover,
									bgcolor: currentConfig.colors.alpha10,
									'&:hover': {
										bgcolor: currentConfig.colors.alpha20
									}
								}}
							>
								{loading ? <CircularProgress size={20} /> : <Refresh />}
							</IconButton>
						</Tooltip>
					)}

					{onDownload && (
						<Tooltip title="Baixar relatório">
							<IconButton
								onClick={onDownload}
								sx={{
									...animations.buttonHover,
									bgcolor: currentConfig.colors.alpha10,
									'&:hover': {
										bgcolor: currentConfig.colors.alpha20
									}
								}}
							>
								<Download />
							</IconButton>
						</Tooltip>
					)}

					{onShare && (
						<Tooltip title="Compartilhar">
							<IconButton
								onClick={onShare}
								sx={{
									...animations.buttonHover,
									bgcolor: currentConfig.colors.alpha10,
									'&:hover': {
										bgcolor: currentConfig.colors.alpha20
									}
								}}
							>
								<Share />
							</IconButton>
						</Tooltip>
					)}
				</Box>

				{/* Loading overlay quando necessário */}
				{loading && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							bgcolor: 'rgba(255, 255, 255, 0.8)',
							borderRadius: 2,
							zIndex: 10
						}}
					>
						<CircularProgress size={24} />
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default Header;
