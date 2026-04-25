import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { darkNeutral, lightNeutral } from '@/lib/theme/colors';
import { motionTokens, radiusTokens } from '@/lib/theme/designSystem';

/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * STYLED COMPONENTS PARA HORIZONTAL NAVBAR
 * POV sóbrio (SP2): superfícies sólidas, sem glassmorphism nem gradients.
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? darkNeutral.surface : lightNeutral.surface,
	backgroundImage: 'none',
	borderBottom: `1px solid ${theme.palette.divider}`,
	boxShadow: 'none',
	color: theme.palette.text.primary,
	transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
	position: 'relative',
	zIndex: theme.zIndex.appBar
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
	borderRadius: `${radiusTokens.md}px`,
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.875rem',
	padding: theme.spacing(1.5, 3),
	minWidth: 'auto',
	position: 'relative',
	transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
	color: isActive ? theme.palette.primary.main : theme.palette.text.primary,

	...(isActive && {
		backgroundColor: theme.palette.action.selected,

		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: 0,
			left: '50%',
			transform: 'translateX(-50%)',
			width: '60%',
			height: '2px',
			backgroundColor: theme.palette.primary.main,
			borderRadius: '1px'
		}
	}),

	'&:hover': {
		backgroundColor: theme.palette.action.hover
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
	borderRadius: `${radiusTokens.md}px`,
	transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,

	'&:hover': {
		backgroundColor: theme.palette.action.hover,
		color: theme.palette.primary.main
	}
}));

// ========================================
// 🚀 ACTION BUTTONS
// ========================================

export const PrimaryActionButton = styled(Button)(({ theme }) => ({
	borderRadius: `${radiusTokens.md}px`,
	textTransform: 'none',
	fontWeight: 600,
	fontSize: '0.875rem',
	padding: theme.spacing(1.25, 3),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	boxShadow: 'none',
	transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,

	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
		boxShadow: 'none'
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
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,

	'&:hover': {
		backgroundColor: theme.palette.primary.dark
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
	// @ts-ignore
	sx: (theme: any) => ({
		marginTop: theme.spacing(1),
		minWidth: 200,
		boxShadow: theme.shadows[4],
		borderRadius: `${radiusTokens.md}px`,
		border: `1px solid ${theme.palette.divider}`,
		backgroundColor: theme.palette.background.paper,

		'& .MuiMenuItem-root': {
			borderRadius: `${radiusTokens.sm}px`,
			margin: theme.spacing(0.5),
			transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}`,

			'&:hover': {
				backgroundColor: theme.palette.action.hover
			},

			'&.Mui-selected': {
				backgroundColor: theme.palette.action.selected,
				color: theme.palette.primary.main,

				'&:hover': {
					backgroundColor: theme.palette.action.selected
				}
			}
		}
	})
};
