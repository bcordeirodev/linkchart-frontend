import { Theme } from '@mui/material/styles';

/**
 * 🎨 CHART STYLES - Estilos Padronizados para Gráficos
 *
 * @description
 * Utilitários para criar estilos consistentes em todos os gráficos
 * de analytics, garantindo responsividade e acessibilidade.
 */

/**
 * Estilos base para containers de gráficos - MAXIMIZADO
 */
export function createChartContainerStyles(theme: Theme, height = 300) {
	return {
		p: { xs: 1, sm: 1.5, md: 2 }, // Padding reduzido para mais espaço
		height: Math.max(height, 320), // Altura mínima aumentada
		minHeight: 320,
		position: 'relative' as const,
		display: 'flex',
		flexDirection: 'column' as const,
		'&:hover': {
			'& .chart-element': {
				transform: 'scale(1.02)',
				transition: 'transform 0.2s ease'
			}
		}
	};
}

/**
 * Estilos para gráficos de barras verticais - MAXIMIZADO
 */
export function createVerticalBarStyles(theme: Theme) {
	return {
		container: {
			display: 'flex',
			alignItems: 'flex-end',
			gap: { xs: 0.3, sm: 0.5, md: 0.8 }, // Gap reduzido para mais barras
			height: 'calc(100% - 20px)', // Mais altura disponível
			pb: 1.5, // Padding bottom reduzido
			pt: 1, // Padding top reduzido
			flex: 1 // Usar todo espaço disponível
		},
		bar: {
			flex: 1,
			display: 'flex',
			flexDirection: 'column' as const,
			alignItems: 'center',
			gap: { xs: 0.3, sm: 0.5, md: 0.7 }, // Gap reduzido
			minWidth: { xs: 25, sm: 30, md: 35 }, // Largura mínima reduzida
			maxWidth: { xs: 60, sm: 80, md: 100 } // Largura máxima para melhor distribuição
		},
		barElement: (color: string) => ({
			width: '100%',
			borderRadius: '3px 3px 0 0',
			minHeight: { xs: 8, sm: 12, md: 15 }, // Altura mínima aumentada
			transition: 'all 0.3s ease',
			backgroundColor: color,
			'&:hover': {
				backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[700],
				transform: 'scaleY(1.05)'
			}
		}),
		label: {
			fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, // Fonte menor para mais espaço
			textAlign: 'center' as const,
			transform: 'rotate(-45deg)',
			transformOrigin: 'center',
			whiteSpace: 'nowrap' as const,
			maxWidth: { xs: 40, sm: 50, md: 60 }, // Largura máxima responsiva
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			lineHeight: 1.2 // Altura de linha otimizada
		},
		value: {
			fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }, // Fonte responsiva
			fontWeight: 'bold',
			lineHeight: 1.1 // Altura de linha compacta
		}
	};
}

/**
 * Estilos para gráficos de barras horizontais - MAXIMIZADO
 */
export function createHorizontalBarStyles(theme: Theme) {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column' as const,
			gap: { xs: 0.5, sm: 0.8, md: 1 }, // Gap reduzido para mais itens
			height: 'calc(100% - 10px)', // Mais altura disponível
			overflowY: 'auto' as const,
			flex: 1, // Usar todo espaço disponível
			pr: { xs: 0.5, sm: 1 } // Padding para scrollbar
		},
		row: {
			display: 'flex',
			alignItems: 'center',
			gap: { xs: 0.8, sm: 1, md: 1.2 }, // Gap otimizado
			py: { xs: 0.2, sm: 0.3, md: 0.4 }, // Padding vertical reduzido
			minHeight: { xs: 24, sm: 28, md: 32 } // Altura mínima para consistência
		},
		label: {
			minWidth: { xs: 70, sm: 85, md: 100 }, // Largura reduzida para mais espaço do gráfico
			fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, // Fonte responsiva
			textAlign: 'right' as const,
			fontWeight: 500,
			lineHeight: 1.2, // Altura de linha otimizada
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		},
		barContainer: {
			flex: 1,
			position: 'relative' as const
		},
		barElement: (color: string) => ({
			height: { xs: 16, sm: 20, md: 24 }, // Altura otimizada
			backgroundColor: color,
			borderRadius: 1,
			minWidth: 6, // Largura mínima aumentada
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			pr: { xs: 0.3, sm: 0.5, md: 0.8 }, // Padding reduzido para mais espaço
			transition: 'all 0.3s ease',
			'&:hover': {
				backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[700],
				transform: 'scaleX(1.02)'
			}
		}),
		value: {
			color: 'white',
			fontWeight: 'bold',
			fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' }, // Fonte responsiva
			lineHeight: 1.1 // Altura de linha compacta
		}
	};
}

/**
 * Estilos responsivos para diferentes breakpoints
 */
export function createResponsiveChartStyles(theme: Theme) {
	return {
		xs: {
			padding: theme.spacing(1.5),
			fontSize: '0.7rem',
			gap: theme.spacing(0.5)
		},
		sm: {
			padding: theme.spacing(2),
			fontSize: '0.75rem',
			gap: theme.spacing(1)
		},
		md: {
			padding: theme.spacing(3),
			fontSize: '0.8rem',
			gap: theme.spacing(1.5)
		}
	};
}

/**
 * Cores padronizadas para gráficos
 */
export const chartColors = {
	primary: '#1976d2',
	secondary: '#dc004e',
	success: '#2e7d32',
	warning: '#ed6c02',
	info: '#0288d1',
	error: '#d32f2f'
};

/**
 * Animações padronizadas para gráficos
 */
export function createChartAnimations() {
	return {
		fadeIn: {
			'@keyframes fadeIn': {
				from: { opacity: 0, transform: 'translateY(20px)' },
				to: { opacity: 1, transform: 'translateY(0)' }
			},
			animation: 'fadeIn 0.5s ease-out'
		},
		scaleIn: {
			'@keyframes scaleIn': {
				from: { transform: 'scale(0.8)', opacity: 0 },
				to: { transform: 'scale(1)', opacity: 1 }
			},
			animation: 'scaleIn 0.3s ease-out'
		}
	};
}
