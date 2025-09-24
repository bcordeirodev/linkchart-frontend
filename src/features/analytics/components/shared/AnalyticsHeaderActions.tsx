/**
 * 🎯 ANALYTICS HEADER ACTIONS
 * Componente de ações para headers Analytics mantendo todas as funcionalidades
 */

import { Refresh, Download, Share } from '@mui/icons-material';
import { Box, IconButton, Tooltip, CircularProgress, useTheme } from '@mui/material';

import { createComponentColorSet, createPresetAnimations } from '@/lib/theme';

interface AnalyticsHeaderActionsProps {
	variant?: 'dashboard' | 'analytics';
	onRefresh?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	loading?: boolean;
}

/**
 * Componente de ações do header Analytics
 * Mantém toda a funcionalidade do Header customizado original
 */
export function AnalyticsHeaderActions({
	variant = 'analytics',
	onRefresh,
	onDownload,
	onShare,
	loading = false
}: AnalyticsHeaderActionsProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	// Cores baseadas na variante (mantendo lógica original)
	const primaryColors = createComponentColorSet(theme, 'primary');
	const warningColors = createComponentColorSet(theme, 'warning');
	const currentColors = variant === 'dashboard' ? primaryColors : warningColors;

	// Se não há ações, não renderiza nada
	if (!onRefresh && !onDownload && !onShare) {
		return null;
	}

	return (
		<Box sx={{ display: 'flex', gap: 1, position: 'relative' }}>
			{onRefresh ? (
				<Tooltip title='Atualizar dados'>
					<IconButton
						onClick={onRefresh}
						disabled={loading}
						sx={{
							...animations.buttonHover,
							bgcolor: currentColors.alpha10,
							'&:hover': {
								bgcolor: currentColors.alpha20
							}
						}}
					>
						{loading ? <CircularProgress size={20} /> : <Refresh />}
					</IconButton>
				</Tooltip>
			) : null}

			{onDownload ? (
				<Tooltip title='Baixar relatório'>
					<IconButton
						onClick={onDownload}
						sx={{
							...animations.buttonHover,
							bgcolor: currentColors.alpha10,
							'&:hover': {
								bgcolor: currentColors.alpha20
							}
						}}
					>
						<Download />
					</IconButton>
				</Tooltip>
			) : null}

			{onShare ? (
				<Tooltip title='Compartilhar'>
					<IconButton
						onClick={onShare}
						sx={{
							...animations.buttonHover,
							bgcolor: currentColors.alpha10,
							'&:hover': {
								bgcolor: currentColors.alpha20
							}
						}}
					>
						<Share />
					</IconButton>
				</Tooltip>
			) : null}

			{/* Loading overlay quando necessário (mantendo funcionalidade original) */}
			{loading ? (
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
			) : null}
		</Box>
	);
}

export default AnalyticsHeaderActions;
