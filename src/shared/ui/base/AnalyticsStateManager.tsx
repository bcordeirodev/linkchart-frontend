import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { createGlassCard, createPresetAnimations } from '@/lib/theme';
import { ReactNode } from 'react';

interface AnalyticsStateManagerProps {
	loading: boolean;
	error: string | null;
	hasData: boolean;
	children: ReactNode;
	onRetry?: () => void;
	loadingMessage?: string;
	errorMessage?: string;
	emptyMessage?: string;
	minHeight?: number;
	compact?: boolean;
}

/**
 * 🎭 ANALYTICS STATE MANAGER - Gerenciador Unificado de Estados
 *
 * @description
 * Componente reutilizável para gerenciar estados de loading, error e empty
 * em todos os componentes de analytics, garantindo consistência visual.
 *
 * @features
 * - Estados unificados (loading, error, empty, success)
 * - Animações consistentes
 * - Ações customizáveis (retry)
 * - Responsivo e acessível
 * - Tema consistente
 */
export function AnalyticsStateManager({
	loading,
	error,
	hasData,
	children,
	onRetry,
	loadingMessage = 'Carregando dados...',
	errorMessage,
	emptyMessage = 'Nenhum dado disponível',
	minHeight = 300,
	compact = false
}: AnalyticsStateManagerProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	// Estado de Loading
	if (loading) {
		return (
			<Box
				sx={{
					...createGlassCard(theme, 'neutral'),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: compact ? minHeight / 2 : minHeight,
					textAlign: 'center',
					gap: 2,
					p: compact ? 2 : 3,
					...animations.fadeIn
				}}
			>
				<CircularProgress size={compact ? 24 : 32} />
				<Typography
					variant={compact ? 'body2' : 'h6'}
					sx={{
						color: 'text.primary',
						fontWeight: 500
					}}
				>
					{loadingMessage}
				</Typography>
			</Box>
		);
	}

	// Estado de Error
	if (error) {
		return (
			<Box
				sx={{
					...createGlassCard(theme, 'neutral'),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: compact ? minHeight / 2 : minHeight,
					textAlign: 'center',
					gap: 2,
					p: compact ? 2 : 3,
					borderColor: 'error.main',
					...animations.fadeIn
				}}
			>
				<Typography
					variant={compact ? 'body2' : 'h6'}
					sx={{
						color: 'error.main',
						fontWeight: 600
					}}
				>
					⚠️ Erro ao carregar
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mb: onRetry ? 1 : 0,
						maxWidth: 400
					}}
				>
					{errorMessage || error}
				</Typography>
				{onRetry && (
					<Button
						variant="outlined"
						size={compact ? 'small' : 'medium'}
						onClick={onRetry}
						sx={{
							...animations.buttonHover,
							borderColor: 'error.main',
							color: 'error.main',
							'&:hover': {
								borderColor: 'error.dark',
								backgroundColor: 'error.light'
							}
						}}
					>
						Tentar Novamente
					</Button>
				)}
			</Box>
		);
	}

	// Estado Empty (sem dados)
	if (!hasData) {
		return (
			<Box
				sx={{
					...createGlassCard(theme, 'neutral'),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: compact ? minHeight / 2 : minHeight,
					textAlign: 'center',
					gap: 2,
					p: compact ? 2 : 3,
					...animations.fadeIn
				}}
			>
				<Typography
					variant={compact ? 'body2' : 'h6'}
					sx={{
						color: 'text.secondary',
						fontWeight: 500
					}}
				>
					📊 {emptyMessage}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ maxWidth: 400 }}
				>
					Compartilhe seus links para ver dados aqui!
				</Typography>
			</Box>
		);
	}

	// Estado Success - renderizar children
	return <>{children}</>;
}

export default AnalyticsStateManager;
