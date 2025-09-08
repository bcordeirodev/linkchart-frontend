import { styled } from '@mui/material/styles';
import { Box, Button, Alert } from '@mui/material';
import { alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA FORMS MODULE
 * Componentes estilizados para formulários
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const FormContainer = styled(Box)(({ theme }) => ({
	width: '100%',
	position: 'relative'
}));

export const FormHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginBottom: theme.spacing(3),
	gap: theme.spacing(2),

	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: theme.spacing(1.5)
	}
}));

export const FormTitle = styled('h1')(({ theme }) => ({
	fontWeight: 700,
	fontSize: '2rem',
	color: theme.palette.text.primary,
	margin: 0,
	background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',

	// Fallback for browsers that don't support background-clip: text
	'@supports not (background-clip: text)': {
		color: theme.palette.primary.main,
		WebkitTextFillColor: 'unset'
	},

	[theme.breakpoints.down('md')]: {
		fontSize: '1.75rem'
	},

	[theme.breakpoints.down('sm')]: {
		fontSize: '1.5rem'
	}
}));

export const BackButton = styled(Button)(({ theme }) => ({
	borderRadius: 12,
	textTransform: 'none',
	fontWeight: 600,
	padding: '12px 24px',
	minHeight: 44,
	border: `2px solid ${theme.palette.divider}`,
	color: theme.palette.text.secondary,
	transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',

	'&:hover': {
		borderColor: theme.palette.primary.main,
		color: theme.palette.primary.main,
		backgroundColor: alpha(theme.palette.primary.main, 0.08),
		transform: 'translateY(-1px)',
		boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
	},

	'&:active': {
		transform: 'translateY(0)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		justifyContent: 'center'
	}
}));

// ========================================
// 📝 FORM CONTENT
// ========================================

export const FormContent = styled(Box)(({ theme }) => ({
	background: theme.palette.background.paper,
	borderRadius: theme.spacing(2),
	padding: theme.spacing(4),
	border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,

	position: 'relative',
	overflow: 'hidden',

	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(3),
		borderRadius: theme.spacing(1.5)
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2.5)
	}
}));

export const FormFieldsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3),
	marginBottom: theme.spacing(4),

	[theme.breakpoints.down('sm')]: {
		gap: theme.spacing(2.5),
		marginBottom: theme.spacing(3)
	}
}));

// ========================================
// 🎛️ ACTION BUTTONS
// ========================================

export const FormActionsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'flex-end',
	gap: theme.spacing(2),
	marginTop: theme.spacing(4),
	paddingTop: theme.spacing(3),
	borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,

	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column-reverse',
		gap: theme.spacing(1.5)
	}
}));

export const CancelButton = styled(Button)(({ theme }) => ({
	borderRadius: 12,
	textTransform: 'none',
	fontWeight: 600,
	padding: '12px 24px',
	minHeight: 44,
	border: `2px solid ${theme.palette.divider}`,
	color: theme.palette.text.secondary,
	transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',

	'&:hover': {
		borderColor: theme.palette.error.main,
		color: theme.palette.error.main,
		backgroundColor: alpha(theme.palette.error.main, 0.08),
		transform: 'translateY(-1px)',
		boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}`
	},

	'&:active': {
		transform: 'translateY(0)'
	},

	'&:disabled': {
		opacity: 0.6,
		transform: 'none'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

export const SubmitButton = styled(Button, {
	shouldForwardProp: (prop) => !['mode', 'isLoading'].includes(prop as string)
})<{
	mode?: 'create' | 'edit';
	isLoading?: boolean;
}>(({ theme, mode = 'create', isLoading = false }) => ({
	minWidth: 140,
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.5, 4),
	position: 'relative',
	overflow: 'hidden',
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	// Mode-specific styling
	background:
		mode === 'create'
			? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
			: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,

	boxShadow:
		mode === 'create'
			? `0 4px 15px ${alpha(theme.palette.secondary.main, 0.4)}`
			: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,

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

	'&:hover:not(:disabled)': {
		transform: 'translateY(-2px)',
		boxShadow:
			mode === 'create'
				? `0 6px 20px ${alpha(theme.palette.secondary.main, 0.5)}`
				: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,

		'&::before': {
			left: '100%'
		}
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	'&:disabled': {
		background: alpha(theme.palette.action.disabled, 0.3),
		color: theme.palette.action.disabled,
		transform: 'none',
		boxShadow: 'none'
	},

	...(isLoading && {
		background: alpha(theme.palette.primary.main, 0.6),
		cursor: 'not-allowed',

		'&:hover': {
			transform: 'none'
		}
	}),

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		minWidth: 'auto'
	}
}));

// ========================================
// 📋 FORM FIELDS - REMOVIDO
// StyledFormField removido - usar TextField padrão com tema global
// ========================================

// ========================================
// ⚠️ ALERT COMPONENTS
// ========================================

export const FormAlert = styled(Alert, {
	shouldForwardProp: (prop) => prop !== 'variant'
})<{
	variant?: 'info' | 'warning' | 'error' | 'success';
}>(({ theme, variant = 'info' }) => ({
	marginTop: theme.spacing(2),
	borderRadius: theme.spacing(1.5),
	border: `1px solid ${alpha((theme.palette as any)[variant].main, 0.2)}`,
	background: alpha((theme.palette as any)[variant].main, 0.08),

	'& .MuiAlert-icon': {
		fontSize: '1.25rem'
	},

	'& .MuiAlert-message': {
		fontWeight: 500,
		fontSize: '0.875rem'
	},

	[theme.breakpoints.down('sm')]: {
		'& .MuiAlert-message': {
			fontSize: '0.8rem'
		}
	}
}));

// ========================================
// 🎯 ADVANCED SECTIONS
// ========================================

export const AdvancedSection = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isExpanded'
})<{
	isExpanded?: boolean;
}>(({ theme, isExpanded = false }) => ({
	marginTop: theme.spacing(3),
	padding: theme.spacing(2),
	background: alpha(theme.palette.background.default, 0.5),
	borderRadius: theme.spacing(1.5),
	border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.standard
	}),

	...(isExpanded && {
		background: alpha(theme.palette.primary.main, 0.03),
		border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
		boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
	}),

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(1.5),
		marginTop: theme.spacing(2)
	}
}));

export const AdvancedToggle = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1),
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.875rem',
	padding: theme.spacing(1, 2),
	color: theme.palette.text.secondary,
	border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		color: theme.palette.primary.main,
		borderColor: alpha(theme.palette.primary.main, 0.3),
		backgroundColor: alpha(theme.palette.primary.main, 0.04),
		transform: 'scale(1.02)'
	},

	'&:active': {
		transform: 'scale(0.98)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		justifyContent: 'center'
	}
}));

// ========================================
// 🔗 URL SPECIFIC COMPONENTS
// ========================================

export const UrlPreview = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	background: alpha(theme.palette.background.default, 0.8),
	borderRadius: theme.spacing(1),
	border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
	fontFamily: 'monospace',
	fontSize: '0.875rem',
	color: theme.palette.text.primary,
	wordBreak: 'break-all',
	position: 'relative',
	overflow: 'hidden',

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '4px',
		height: '100%',
		background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
	},

	[theme.breakpoints.down('sm')]: {
		fontSize: '0.8rem',
		padding: theme.spacing(1.5)
	}
}));

export const UrlLabel = styled(Box)(({ theme }) => ({
	fontSize: '0.75rem',
	fontWeight: 600,
	color: theme.palette.text.secondary,
	textTransform: 'uppercase',
	letterSpacing: 0.5,
	marginBottom: theme.spacing(1),
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(0.5),

	'&::before': {
		content: '"🔗"',
		fontSize: '1em'
	}
}));

// ========================================
// 🎨 VISUAL ENHANCEMENTS
// ========================================

export const FormBadge = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'mode'
})<{
	mode?: 'create' | 'edit';
}>(({ theme, mode = 'create' }) => ({
	position: 'absolute',
	top: theme.spacing(2),
	right: theme.spacing(2),
	background:
		mode === 'create'
			? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
			: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
	color: theme.palette.common.white,
	padding: theme.spacing(0.5, 1.5),
	borderRadius: theme.spacing(3),
	fontSize: '0.75rem',
	fontWeight: 600,
	textTransform: 'uppercase',
	letterSpacing: 0.5,
	boxShadow: `0 2px 8px ${alpha(mode === 'create' ? theme.palette.secondary.main : theme.palette.primary.main, 0.3)}`,

	[theme.breakpoints.down('sm')]: {
		top: theme.spacing(1),
		right: theme.spacing(1),
		fontSize: '0.7rem',
		padding: theme.spacing(0.25, 1)
	}
}));

export const LoadingOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: alpha(theme.palette.background.paper, 0.9),
	backdropFilter: 'blur(4px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 'inherit',
	zIndex: theme.zIndex.modal - 1,

	'& .loading-content': {
		textAlign: 'center',

		'& .loading-text': {
			marginTop: theme.spacing(2),
			color: theme.palette.text.secondary,
			fontWeight: 500
		}
	}
}));

// ========================================
// 📊 FORM PROGRESS
// ========================================

export const FormProgress = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	height: '3px',
	background: alpha(theme.palette.divider, 0.2),
	overflow: 'hidden',

	'& .progress-bar': {
		height: '100%',
		background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
		transition: theme.transitions.create(['width'], {
			duration: theme.transitions.duration.standard
		}),
		borderRadius: '0 2px 2px 0'
	}
}));
