import { Card, CardContent, CardActions, Box, Typography, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA REDIRECT MODULE
 * Componentes estilizados para redirecionamento
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const RedirectContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: 1,
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(4),
	minHeight: '100vh',
	// Usa gradiente padronizado do tema
	background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.05)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.03)} 100%
    )`,

	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(3)
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2)
	}
}));

export const RedirectCard = styled(Card)(({ theme }) => ({
	maxWidth: 400,
	width: '100%',
	borderRadius: theme.spacing(2),
	background: alpha(theme.palette.background.paper, 0.95),
	backdropFilter: 'blur(20px)',
	border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.1)}`,
	position: 'relative',
	overflow: 'hidden',

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '3px',
		background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
	},

	[theme.breakpoints.down('sm')]: {
		maxWidth: '100%',
		borderRadius: theme.spacing(1.5)
	}
}));

export const RedirectContent = styled(CardContent)(({ theme }) => ({
	textAlign: 'center',
	padding: theme.spacing(4),
	position: 'relative',
	zIndex: 1,

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(3)
	}
}));

export const RedirectActions = styled(CardActions)(({ theme }) => ({
	justifyContent: 'center',
	padding: theme.spacing(2, 4, 4),
	gap: theme.spacing(2),

	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
		padding: theme.spacing(2, 3, 3),
		gap: theme.spacing(1.5)
	}
}));

// ========================================
// 🎯 REDIRECT STATES
// ========================================

export const RedirectTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	fontSize: '1.5rem',
	color: theme.palette.text.primary,
	marginBottom: theme.spacing(1),

	[theme.breakpoints.down('sm')]: {
		fontSize: '1.3rem'
	}
}));

export const RedirectMessage = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontSize: '1rem',
	lineHeight: 1.5,

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.875rem'
	}
}));

export const CountdownDisplay = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(4),
	padding: theme.spacing(2),
	background: alpha(theme.palette.primary.main, 0.05),
	borderRadius: theme.spacing(1.5),
	border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
}));

export const CountdownNumber = styled(Typography)(({ theme }) => ({
	fontSize: '3rem',
	fontWeight: 700,
	color: theme.palette.primary.main,
	lineHeight: 1,
	marginBottom: theme.spacing(1),
	fontFamily: 'monospace',
	textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,

	[theme.breakpoints.down('sm')]: {
		fontSize: '2.5rem'
	}
}));

export const CountdownLabel = styled(Typography)(({ theme }) => ({
	fontSize: '0.875rem',
	color: theme.palette.text.secondary,
	fontWeight: 500,
	textTransform: 'uppercase',
	letterSpacing: 0.5,

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.8rem'
	}
}));

// ========================================
// 🎛️ ACTION BUTTONS
// ========================================

export const ContinueButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.5, 4),
	background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
	boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),
	position: 'relative',
	overflow: 'hidden',

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: '-100%',
		width: '100%',
		height: '100%',
		background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
		transition: theme.transitions.create(['left'], {
			duration: theme.transitions.duration.standard
		})
	},

	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,

		'&::before': {
			left: '100%'
		}
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

export const GoNowButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.25, 3),
	background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
	boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

export const CancelRedirectButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.25, 3),
	border: `2px solid ${theme.palette.error.main}`,
	color: theme.palette.error.main,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		backgroundColor: alpha(theme.palette.error.main, 0.08),
		borderColor: theme.palette.error.dark,
		color: theme.palette.error.dark,
		transform: 'translateY(-1px)'
	},

	'&:active': {
		transform: 'translateY(0)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

// ========================================
// 🎨 LOADING COMPONENTS
// ========================================

export const LoadingContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: theme.spacing(2),
	padding: theme.spacing(3)
}));

export const LoadingSpinner = styled(Box)(({ theme }) => ({
	position: 'relative',

	'& .MuiCircularProgress-root': {
		color: theme.palette.primary.main,
		filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.3)})`
	}
}));

export const LoadingText = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontWeight: 500,
	fontSize: '1rem',
	textAlign: 'center',

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.875rem'
	}
}));

// ========================================
// 🎨 DECORATIVE ELEMENTS
// ========================================

export const RedirectDecoration = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: -40,
	right: -40,
	width: 120,
	height: 120,
	background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
	borderRadius: '50%',
	opacity: 0.7,
	animation: 'pulse 4s ease-in-out infinite',

	'@keyframes pulse': {
		'0%, 100%': {
			transform: 'scale(1)',
			opacity: 0.7
		},
		'50%': {
			transform: 'scale(1.1)',
			opacity: 0.9
		}
	},

	[theme.breakpoints.down('sm')]: {
		width: 80,
		height: 80,
		top: -20,
		right: -20
	}
}));
