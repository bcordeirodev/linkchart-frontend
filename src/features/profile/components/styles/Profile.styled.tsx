import { Box, Avatar, TextField, Button, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

/**
 * 🎨 STYLED COMPONENTS PARA PROFILE MODULE
 * Componentes estilizados para perfil do usuário
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const ProfileContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	position: 'relative',

	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(3)
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(2)
	}
}));

export const ProfileHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: theme.spacing(3),
	paddingBottom: theme.spacing(2),
	borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,

	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: theme.spacing(2)
	}
}));

export const ProfileTitle = styled('h2')(({ theme }) => ({
	fontWeight: 600,
	fontSize: '1.5rem',
	color: theme.palette.text.primary,
	margin: 0,
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),

	'&::before': {
		content: '"👤"',
		fontSize: '1.2em',
		filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
	},

	[theme.breakpoints.down('sm')]: {
		fontSize: '1.3rem'
	}
}));

// ========================================
// 🎭 AVATAR SECTION
// ========================================

export const AvatarSection = styled(Box)(({ theme }) => ({
	textAlign: 'center',
	position: 'relative',

	[theme.breakpoints.down('sm')]: {
		marginBottom: theme.spacing(3)
	}
}));

export const AvatarContainer = styled(Box)(({ theme }) => ({
	position: 'relative',
	display: 'inline-block',
	marginBottom: theme.spacing(3)
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
	width: 120,
	height: 120,
	fontSize: '3rem',
	fontWeight: 600,
	background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
	boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
	border: `4px solid ${alpha(theme.palette.background.paper, 0.8)}`,
	transition: theme.transitions.create(['transform', 'box-shadow'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		transform: 'scale(1.05)',
		boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`
	},

	[theme.breakpoints.down('sm')]: {
		width: 100,
		height: 100,
		fontSize: '2.5rem'
	}
}));

export const PhotoUploadButton = styled(IconButton)(({ theme }) => ({
	position: 'absolute',
	bottom: 8,
	right: 8,
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	width: 40,
	height: 40,
	boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
		transform: 'scale(1.1)',
		boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`
	},

	'&:active': {
		transform: 'scale(1.05)'
	},

	[theme.breakpoints.down('sm')]: {
		width: 36,
		height: 36,
		bottom: 4,
		right: 4
	}
}));

// ========================================
// 📝 FORM COMPONENTS
// ========================================

export const ProfileForm = styled('form')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3),
	width: '100%'
}));

export const FormFieldsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(3)
}));

export const StyledTextField = styled(TextField, {
	shouldForwardProp: (prop) => prop !== 'isEditing'
})<{
	isEditing?: boolean;
}>(({ theme, isEditing = false }) => ({
	'& .MuiOutlinedInput-root': {
		borderRadius: theme.spacing(1.5),
		transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
			duration: theme.transitions.duration.short
		}),

		...(isEditing && {
			backgroundColor: alpha(theme.palette.background.paper, 0.8),

			'&:hover': {
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.primary.main
				}
			},

			'&.Mui-focused': {
				backgroundColor: theme.palette.background.paper,
				boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,

				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.primary.main,
					borderWidth: 2
				}
			}
		}),

		...(!isEditing && {
			backgroundColor: alpha(theme.palette.action.hover, 0.5),

			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: 'transparent'
			}
		})
	},

	'& .MuiInputLabel-root': {
		fontWeight: 500,

		'&.Mui-focused': {
			color: theme.palette.primary.main
		}
	},

	'& .MuiInputAdornment-root': {
		'& .MuiSvgIcon-root': {
			color: theme.palette.text.secondary,
			transition: theme.transitions.create(['color'], {
				duration: theme.transitions.duration.short
			})
		}
	},

	'&:hover .MuiInputAdornment-root .MuiSvgIcon-root': {
		color: isEditing ? theme.palette.primary.main : theme.palette.text.secondary
	}
}));

// ========================================
// 🎛️ ACTION BUTTONS
// ========================================

export const EditButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.5, 3),
	background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
	boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
	justifyContent: 'flex-end',
	marginTop: theme.spacing(4),
	paddingTop: theme.spacing(3),
	borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,

	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column-reverse',
		gap: theme.spacing(1.5)
	}
}));

export const CancelButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.5, 3),
	border: `2px solid ${theme.palette.divider}`,
	color: theme.palette.text.secondary,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		borderColor: theme.palette.error.main,
		color: theme.palette.error.main,
		backgroundColor: alpha(theme.palette.error.main, 0.04),
		transform: 'translateY(-1px)'
	},

	'&:active': {
		transform: 'translateY(0)'
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%'
	}
}));

interface SaveButtonProps {
	hasChanges?: boolean;
	isLoading?: boolean;
}

export const SaveButton = styled(Button, {
	shouldForwardProp: (prop) => !['hasChanges', 'isLoading'].includes(String(prop))
})<SaveButtonProps>(({ theme, hasChanges = false, isLoading = false }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	padding: theme.spacing(1.5, 3),
	minWidth: 140,
	position: 'relative',
	overflow: 'hidden',
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	...(hasChanges &&
		!isLoading && {
			background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
			boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,

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
				boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.4)}`,

				'&::before': {
					left: '100%'
				}
			},

			'&:active': {
				transform: 'translateY(-1px)'
			}
		}),

	...(isLoading && {
		background: alpha(theme.palette.primary.main, 0.6),
		cursor: 'not-allowed',

		'&:hover': {
			transform: 'none'
		}
	}),

	'&:disabled': {
		background: alpha(theme.palette.action.disabled, 0.3),
		color: theme.palette.action.disabled
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		minWidth: 'auto'
	}
}));

// ========================================
// 📱 RESPONSIVE GRID
// ========================================

export const ProfileGrid = styled(Box)(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '1fr 2fr',
	gap: theme.spacing(4),
	alignItems: 'start',

	[theme.breakpoints.down('md')]: {
		gridTemplateColumns: '1fr',
		gap: theme.spacing(3)
	}
}));

// ========================================
// 🎯 LOADING STATES
// ========================================

export const LoadingOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: alpha(theme.palette.background.paper, 0.8),
	backdropFilter: 'blur(4px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 'inherit',
	zIndex: theme.zIndex.modal - 1
}));

// ========================================
// 🎨 VISUAL ENHANCEMENTS
// ========================================

export const ProfileBadge = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: theme.spacing(2),
	right: theme.spacing(2),
	background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
	color: theme.palette.success.contrastText,
	padding: theme.spacing(0.5, 1.5),
	borderRadius: theme.spacing(3),
	fontSize: '0.75rem',
	fontWeight: 600,
	textTransform: 'uppercase',
	letterSpacing: 0.5,
	boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,

	[theme.breakpoints.down('sm')]: {
		top: theme.spacing(1),
		right: theme.spacing(1),
		fontSize: '0.7rem',
		padding: theme.spacing(0.25, 1)
	}
}));
