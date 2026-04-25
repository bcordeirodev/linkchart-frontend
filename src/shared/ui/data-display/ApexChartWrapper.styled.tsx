import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { radiusTokens } from '@/lib/theme/designSystem';

/**
 * 📊 STYLED COMPONENTS PARA CHARTS
 * Componentes estilizados para gráficos ApexCharts
 */

// ========================================
// 📦 CHART CONTAINERS
// ========================================

export const ChartContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	position: 'relative',

	'& .apexcharts-canvas': {
		borderRadius: `${radiusTokens.md}px`,
		overflow: 'hidden'
	},

	'& .apexcharts-legend': {
		padding: `0 ${theme.spacing(2)}`
	},

	'& .apexcharts-tooltip': {
		borderRadius: `${radiusTokens.md}px`,
		boxShadow: theme.shadows[4],
		border: `1px solid ${theme.palette.divider}`,
		background: theme.palette.background.paper
	},

	'&.loading': {
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: theme.palette.action.hover,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 10,
			borderRadius: `${radiusTokens.md}px`
		}
	}
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	gap: theme.spacing(2),
	padding: theme.spacing(3),

	'& .MuiCircularProgress-root': {
		color: theme.palette.primary.main
	}
}));

export const LoadingText = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontSize: '0.9rem',
	fontWeight: 500
}));

// ========================================
// 🚨 ERROR STATES
// ========================================

export const ErrorContainer = styled(Paper)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(3),
	border: `2px dashed ${theme.palette.divider}`,
	backgroundColor: theme.palette.background.paper,
	textAlign: 'center',
	borderRadius: `${radiusTokens.lg}px`
}));

export const ErrorIcon = styled(Box)(({ theme }) => ({
	fontSize: '3rem',
	marginBottom: theme.spacing(2),
	color: theme.palette.error.main
}));

export const ErrorTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	marginBottom: theme.spacing(1),
	color: theme.palette.error.main
}));

export const ErrorDescription = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	marginBottom: theme.spacing(2),
	fontSize: '0.9rem'
}));

export const ErrorStats = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.action.hover,
	borderRadius: `${radiusTokens.md}px`,
	padding: theme.spacing(2),
	marginTop: theme.spacing(2),
	border: `1px solid ${theme.palette.divider}`,

	'& .stat-row': {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.spacing(1),

		'&:last-child': {
			marginBottom: 0
		}
	},

	'& .stat-label': {
		fontSize: '0.8rem',
		color: theme.palette.text.secondary,
		fontWeight: 500
	},

	'& .stat-value': {
		fontSize: '0.9rem',
		color: theme.palette.text.primary,
		fontWeight: 600
	}
}));

// ========================================
// 📈 NO DATA STATES
// ========================================

export const NoDataContainer = styled(Box)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(4),
	textAlign: 'center',
	backgroundColor: theme.palette.background.paper,
	borderRadius: `${radiusTokens.lg}px`,
	border: `1px dashed ${theme.palette.divider}`
}));

export const NoDataIcon = styled(Box)(({ theme }) => ({
	fontSize: '4rem',
	marginBottom: theme.spacing(2),
	color: theme.palette.info.main
}));

export const NoDataTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	marginBottom: theme.spacing(1),
	color: theme.palette.text.primary
}));

export const NoDataDescription = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontSize: '0.9rem',
	maxWidth: 300
}));
