import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA HORIZONTAL NAVBAR
 * Navbar horizontal padronizado com glassmorphism e animações
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: alpha(theme.palette.background.paper, 0.98),
	backdropFilter: 'blur(24px)',
	borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
	boxShadow: `
        0 1px 3px ${alpha(theme.palette.common.black, 0.04)},
        0 4px 12px ${alpha(theme.palette.common.black, 0.02)}
    `,
	color: theme.palette.text.primary,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.standard,
		easing: theme.transitions.easing.easeInOut
	}),
	position: 'relative',
	zIndex: theme.zIndex.appBar,

	'&::before': {
		content: '""',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '1px',
		background: `linear-gradient(90deg, 
            transparent 0%,
            ${alpha(theme.palette.primary.main, 0.1)} 20%,
            ${alpha(theme.palette.primary.main, 0.3)} 50%,
            ${alpha(theme.palette.primary.main, 0.1)} 80%,
            transparent 100%
        )`,
		opacity: 0.8
	},

	// Hover effect for the entire navbar
	'&:hover::before': {
		opacity: 1
	},

	[theme.breakpoints.down('md')]: {
		backdropFilter: 'blur(20px)'
	}
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	paddingLeft: theme.spacing(4),
	paddingRight: theme.spacing(4),
	minHeight: '72px !important',
	position: 'relative',

	[theme.breakpoints.down('lg')]: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
		minHeight: '68px !important'
	},

	[theme.breakpoints.down('md')]: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
		minHeight: '64px !important'
	},

	[theme.breakpoints.down('sm')]: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		minHeight: '60px !important'
	}
}));

// ========================================
// 🎯 NAVIGATION COMPONENTS
// ========================================

export const NavButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'isActive'
})<{
	isActive?: boolean;
}>(({ theme, isActive = false }) => ({
	borderRadius: theme.spacing(1.5),
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.875rem',
	padding: theme.spacing(1.5, 3),
	minWidth: 'auto',
	position: 'relative',
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short,
		easing: theme.transitions.easing.easeInOut
	}),
	color: theme.palette.text.primary,

	// Active state
	...(isActive && {
		backgroundColor: alpha(theme.palette.primary.main, 0.1),
		color: theme.palette.primary.main,
		boxShadow: `inset 0 1px 3px ${alpha(theme.palette.primary.main, 0.1)}`,

		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: 0,
			left: '50%',
			transform: 'translateX(-50%)',
			width: '60%',
			height: '2px',
			backgroundColor: theme.palette.primary.main,
			borderRadius: '1px',
			boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.4)}`
		},

		'&:hover': {
			backgroundColor: alpha(theme.palette.primary.main, 0.15)
		}
	}),

	// Hover state
	'&:hover': {
		backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.06),
		transform: 'translateY(-1px)',
		boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
	},

	'&:active': {
		transform: 'translateY(0)'
	},

	[theme.breakpoints.down('lg')]: {
		padding: theme.spacing(1.25, 2.5),
		fontSize: '0.8rem'
	},

	[theme.breakpoints.down('md')]: {
		padding: theme.spacing(1, 2),
		fontSize: '0.75rem'
	}
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
	padding: theme.spacing(1),
	color: theme.palette.text.primary,
	borderRadius: theme.spacing(1.5),
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		backgroundColor: alpha(theme.palette.primary.main, 0.08),
		color: theme.palette.primary.main,
		transform: 'scale(1.05)'
	},

	'&:active': {
		transform: 'scale(0.98)'
	}
}));

// ========================================
// 🚀 ACTION BUTTONS
// ========================================

export const PrimaryActionButton = styled(Button)(({ theme }) => ({
	borderRadius: theme.spacing(2.5),
	textTransform: 'none',
	fontWeight: 700,
	fontSize: '0.875rem',
	padding: theme.spacing(1.25, 3),
	background: `linear-gradient(135deg, 
        ${theme.palette.primary.main} 0%, 
        ${theme.palette.primary.dark} 100%
    )`,
	boxShadow: `
        0 2px 8px ${alpha(theme.palette.primary.main, 0.3)},
        0 1px 3px ${alpha(theme.palette.common.black, 0.1)}
    `,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short,
		easing: theme.transitions.easing.easeInOut
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
		boxShadow: `
            0 4px 16px ${alpha(theme.palette.primary.main, 0.4)},
            0 2px 8px ${alpha(theme.palette.common.black, 0.15)}
        `,

		'&::before': {
			left: '100%'
		}
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	[theme.breakpoints.down('lg')]: {
		fontSize: '0.8rem',
		padding: theme.spacing(1.125, 2.5)
	},

	[theme.breakpoints.down('sm')]: {
		padding: theme.spacing(1, 2)
	}
}));

export const MobileActionButton = styled(IconButton)(({ theme }) => ({
	width: 44,
	height: 44,
	background: `linear-gradient(135deg, 
        ${theme.palette.primary.main} 0%, 
        ${theme.palette.primary.dark} 100%
    )`,
	color: theme.palette.primary.contrastText,
	boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
	transition: theme.transitions.create(['all'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`
	},

	'&:active': {
		transform: 'translateY(-1px)'
	},

	[theme.breakpoints.down('sm')]: {
		width: 40,
		height: 40
	}
}));

// ========================================
// 📱 RESPONSIVE CONTAINERS
// ========================================

export const DesktopNavigation = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	flex: 1,

	[theme.breakpoints.down('md')]: {
		display: 'none'
	}
}));

export const MobileNavigation = styled('div')(({ theme }) => ({
	display: 'none',
	alignItems: 'center',
	flex: 1,
	justifyContent: 'flex-end',
	marginRight: theme.spacing(2),

	[theme.breakpoints.down('md')]: {
		display: 'flex'
	}
}));

export const ActionsContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	marginLeft: 'auto',

	[theme.breakpoints.down('sm')]: {
		gap: theme.spacing(0.5)
	}
}));

// ========================================
// 🏷️ LOGO CONTAINER
// ========================================

export const LogoContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	marginRight: theme.spacing(4),
	transition: theme.transitions.create(['transform'], {
		duration: theme.transitions.duration.short
	}),

	'&:hover': {
		transform: 'scale(1.02)'
	},

	[theme.breakpoints.down('lg')]: {
		marginRight: theme.spacing(3)
	},

	[theme.breakpoints.down('md')]: {
		marginRight: theme.spacing(2)
	},

	[theme.breakpoints.down('sm')]: {
		marginRight: theme.spacing(1.5)
	}
}));

// ========================================
// 🎨 MENU STYLES
// ========================================

export const StyledMenuPaper = {
	sx: (theme: any) => ({
		marginTop: theme.spacing(1),
		minWidth: 200,
		boxShadow: theme.shadows[8],
		borderRadius: theme.spacing(1.5),
		border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
		backdropFilter: 'blur(20px)',
		background: alpha(theme.palette.background.paper, 0.95),

		'& .MuiMenuItem-root': {
			borderRadius: theme.spacing(1),
			margin: theme.spacing(0.5),
			transition: theme.transitions.create(['all'], {
				duration: theme.transitions.duration.short
			}),

			'&:hover': {
				backgroundColor: alpha(theme.palette.primary.main, 0.08),
				transform: 'translateX(4px)'
			},

			'&.Mui-selected': {
				backgroundColor: alpha(theme.palette.primary.main, 0.12),
				color: theme.palette.primary.main,

				'&:hover': {
					backgroundColor: alpha(theme.palette.primary.main, 0.16)
				}
			}
		}
	})
};
