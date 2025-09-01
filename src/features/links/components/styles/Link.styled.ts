import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA LINK MODULE
 * Componentes estilizados para gerenciamento de links
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const LinkPageContainer = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(4),
	width: '100%',

	[theme.breakpoints.down('sm')]: {
		marginBottom: theme.spacing(3)
	}
}));

export const LinksHeaderContainer = styled(Box)(({ theme }) => ({
	background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
	borderRadius: theme.spacing(1.5),
	padding: theme.spacing(4),
	border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	position: 'relative',
	overflow: 'hidden',
	marginBottom: theme.spacing(3),

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '3px',
		background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`
	},

	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(3),
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: theme.spacing(3)
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2.5),
		gap: theme.spacing(2)
	}
}));

export const LinksHeaderDecoration = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: -30,
	left: -30,
	width: 150,
	height: 150,
	background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
	borderRadius: '50%',
	opacity: 0.6,
	animation: 'float 8s ease-in-out infinite',

	'@keyframes float': {
		'0%, 100%': {
			transform: 'translateY(0) rotate(0deg)'
		},
		'50%': {
			transform: 'translateY(-15px) rotate(180deg)'
		}
	},

	[theme.breakpoints.down('md')]: {
		width: 120,
		height: 120,
		top: -20,
		left: -20
	},

	[theme.breakpoints.down('sm')]: {
		display: 'none'
	}
}));

// ========================================
// 📝 HEADER CONTENT
// ========================================

export const LinksHeaderContent = styled(Box)(({ theme }) => ({
	position: 'relative',
	zIndex: 1,
	flex: 1,

	[theme.breakpoints.down('md')]: {
		width: '100%'
	}
}));

export const LinksHeaderTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 700,
	fontSize: '2rem',
	background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
	marginBottom: theme.spacing(1),
	lineHeight: 1.2,

	// Fallback for browsers that don't support background-clip: text
	'@supports not (background-clip: text)': {
		color: theme.palette.secondary.main,
		WebkitTextFillColor: 'unset'
	},

	[theme.breakpoints.down('md')]: {
		fontSize: '1.75rem'
	},

	[theme.breakpoints.down('sm')]: {
		fontSize: '1.5rem'
	}
}));

export const LinksHeaderSubtitle = styled(Typography)(({ theme }) => ({
	color: theme.palette.text.secondary,
	fontSize: '1rem',
	fontWeight: 400,
	opacity: 0.8,

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.875rem'
	}
}));

// ========================================
// 🎛️ ACTION BUTTONS
// ========================================

export const LinksHeaderActions = styled(Box)(({ theme }) => ({
	position: 'relative',
	zIndex: 1,

	[theme.breakpoints.down('md')]: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end'
	},

	[theme.breakpoints.down('sm')]: {
		justifyContent: 'center'
	}
}));

export const CreateLinkButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '1rem',
	padding: theme.spacing(1.5, 4),
	background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
	boxShadow: `0 4px 15px ${alpha(theme.palette.secondary.main, 0.4)}`,
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
		boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.5)}`,
		background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,

		'&::before': {
			left: '100%'
		}
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	'& .MuiSvgIcon-root': {
		fontSize: '1.25rem',
		filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
	},

	[theme.breakpoints.down('md')]: {
		fontSize: '0.875rem',
		padding: theme.spacing(1.25, 3)
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		justifyContent: 'center'
	}
}));

// ========================================
// 🔍 FILTERS COMPONENTS
// ========================================

export const FiltersContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
	alignItems: 'center',
	marginBottom: theme.spacing(3),
	padding: theme.spacing(2),
	background: alpha(theme.palette.background.paper, 0.8),
	borderRadius: theme.spacing(1.5),
	border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	backdropFilter: 'blur(10px)',

	[theme.breakpoints.down('md')]: {
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: theme.spacing(1.5)
	}
}));

export const FilterButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isActive'
})<{
	isActive?: boolean;
}>(({ theme, isActive = false }) => ({
	borderRadius: theme.spacing(1),
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.875rem',
	padding: theme.spacing(1, 2),
	minWidth: 'auto',
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	...(isActive && {
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
		color: theme.palette.primary.contrastText,
		boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,

		'&:hover': {
			background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
			transform: 'translateY(-1px)'
		}
	}),

	...(!isActive && {
		border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
		color: theme.palette.text.secondary,

		'&:hover': {
			borderColor: alpha(theme.palette.primary.main, 0.5),
			color: theme.palette.primary.main,
			backgroundColor: alpha(theme.palette.primary.main, 0.04)
		}
	}),

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		justifyContent: 'center'
	}
}));

// ========================================
// 📊 REAL TIME COMPONENTS
// ========================================

export const RealTimeContainer = styled(Box)(({ theme }) => ({
	background:
		theme.palette.mode === 'dark'
			? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
			: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.04)} 100%)`,
	borderRadius: theme.spacing(1.5),
	padding: theme.spacing(3),
	border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
	position: 'relative',
	overflow: 'hidden',

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '4px',
		height: '100%',
		background: theme.palette.success.main,
		animation: 'pulse 2s infinite'
	},

	'@keyframes pulse': {
		'0%, 100%': {
			opacity: 0.6
		},
		'50%': {
			opacity: 1
		}
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2)
	}
}));

export const RealTimeHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	marginBottom: theme.spacing(2)
}));

export const RealTimeIndicator = styled(Box)(({ theme }) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: theme.palette.success.main,
	animation: 'blink 1.5s infinite',

	'@keyframes blink': {
		'0%, 100%': {
			opacity: 1
		},
		'50%': {
			opacity: 0.3
		}
	}
}));

export const RealTimeTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	fontSize: '1rem',
	color: theme.palette.text.primary,

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.875rem'
	}
}));

export const RealTimeContent = styled(Box)(({ theme }) => ({
	position: 'relative',
	zIndex: 1
}));
