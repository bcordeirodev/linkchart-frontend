import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { createGlassCard, createPresetAnimations } from '@/lib/theme';
import { Header } from '../Header';

interface AnalyticsStatesProps {
	loading: boolean;
	error: string | null;
	hasData: boolean;
	showHeader?: boolean;
}

/**
 * 🎭 ANALYTICS STATES - GERENCIADOR DE ESTADOS
 * 
 * @description
 * Componente responsável por renderizar os estados especiais:
 * - Loading: Indicador de carregamento
 * - Error: Mensagem de erro com ação de retry
 * - Empty: Estado vazio com orientações
 * 
 * @responsibilities
 * - Renderizar estados de loading, error e empty
 * - Manter consistência visual entre estados
 * - Fornecer ações apropriadas (retry, orientações)
 * 
 * @usage
 * ```tsx
 * <AnalyticsStates
 *   loading={loading}
 *   error={error}
 *   hasData={!!data}
 *   showHeader={true}
 * />
 * ```
 */
export function AnalyticsStates({
	loading,
	error,
	hasData,
	showHeader = true
}: AnalyticsStatesProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	// Estado de Loading
	if (loading) {
		return (
			<Box>
				{showHeader && (
					<Header
						variant="analytics"
						title="Analytics"
						subtitle="Preparando seus dados..."
						loading={true}
					/>
				)}
				<Box
					sx={{
						...createGlassCard(theme, 'neutral'),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 400,
						textAlign: 'center',
						gap: 2,
						p: 4,
						...animations.fadeIn
					}}
				>
					<CircularProgress size={40} />
					<Typography variant="h6" sx={{ mt: 2 }}>
						Carregando Analytics
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Preparando seus dados...
					</Typography>
				</Box>
			</Box>
		);
	}

	// Estado de Error
	if (error) {
		return (
			<Box>
				{showHeader && (
					<Header
						variant="analytics"
						title="Analytics"
						subtitle="Erro ao carregar dados"
					/>
				)}
				<Box
					sx={{
						...createGlassCard(theme, 'neutral'),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 400,
						textAlign: 'center',
						gap: 2,
						p: 4,
						borderColor: 'error.main',
						...animations.fadeIn
					}}
				>
					<Typography variant="h6" sx={{ mb: 1 }}>
						⚠️ Erro ao carregar dados
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 2 }}
					>
						{error || 'Não foi possível carregar os analytics'}
					</Typography>
					<Button
						variant="outlined"
						onClick={() => window.location.reload()}
						sx={{ ...animations.buttonHover }}
					>
						Tentar Novamente
					</Button>
				</Box>
			</Box>
		);
	}

	// Estado Empty (sem dados)
	if (!hasData) {
		return (
			<Box>
				{showHeader && (
					<Header
						variant="analytics"
						title="Analytics"
						subtitle="Aguardando dados para análise"
					/>
				)}
				<Box
					sx={{
						...createGlassCard(theme, 'neutral'),
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: 400,
						textAlign: 'center',
						gap: 2,
						p: 4,
						...animations.fadeIn
					}}
				>
					<Typography variant="h6" sx={{ mb: 1 }}>
						📈 Analytics em Preparação
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Compartilhe seus links para desbloquear insights detalhados!
					</Typography>
				</Box>
			</Box>
		);
	}

	// Se chegou aqui, não deveria renderizar nada
	return null;
}

export default AnalyticsStates;
