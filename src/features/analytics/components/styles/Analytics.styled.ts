import { styled, alpha } from '@mui/material/styles';
import { Box, Container, Paper, Tab, Tabs } from '@mui/material';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA UNIFIED ANALYTICS
 * Sistema padronizado de estilos seguindo design tokens
 */

// ========================================
// 📦 LAYOUT CONTAINERS
// ========================================

export const AnalyticsContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    minHeight: '100vh',
    background: theme.palette.background.default,

    [theme.breakpoints.down('md')]: {
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(3),
    },
}));

export const AnalyticsContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',

    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(1.5),
    },
}));

export const TabPanelContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    '& > *': {
        marginBottom: theme.spacing(2),

        '&:last-child': {
            marginBottom: 0,
        },
    },
}));

// ========================================
// 🎯 STATE CONTAINERS
// ========================================

export const LoadingStateContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    textAlign: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    backdropFilter: 'blur(20px)',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(45deg, transparent 30%, ${theme.palette.primary.main}10 50%, transparent 70%)`,
        animation: 'shimmer 2s infinite',
    },

    '@keyframes shimmer': {
        '0%': {
            transform: 'translateX(-100%)',
        },
        '100%': {
            transform: 'translateX(100%)',
        },
    },

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(4),
    },
}));

export const LoadingIcon = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    position: 'relative',
    zIndex: 1,

    '& .MuiCircularProgress-root': {
        color: theme.palette.primary.main,
        filter: `drop-shadow(0 4px 8px ${theme.palette.primary.main}30)`,
    },
}));

export const LoadingContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,

    '& .loading-title': {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.primary,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },

    '& .loading-subtitle': {
        color: theme.palette.text.secondary,
        fontSize: '1.1rem',
        fontWeight: 400,
    },
}));

export const ErrorStateContainer = styled(Box)(({ theme }) => ({
    width: '100%',

    '& .MuiAlert-root': {
        borderRadius: theme.spacing(2),
        padding: theme.spacing(3),
        fontSize: '1.1rem',
        border: `1px solid ${theme.palette.error.main}30`,
        background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.error.main}15 0%, ${theme.palette.error.main}08 100%)`
            : `linear-gradient(135deg, ${theme.palette.error.main}08 0%, ${theme.palette.error.main}04 100%)`,

        '& .MuiAlert-message': {
            width: '100%',
        },

        '& .error-header': {
            fontWeight: 600,
            marginBottom: theme.spacing(1),
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),
        },
    },
}));

export const EmptyStateContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    textAlign: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)',
    border: `1px solid ${theme.palette.info.main}30`,
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        background: `linear-gradient(135deg, ${theme.palette.info.main}20 0%, transparent 70%)`,
        borderRadius: '50%',
    },

    '& .empty-icon': {
        fontSize: '4rem',
        marginBottom: theme.spacing(2),
        filter: 'drop-shadow(0 4px 8px rgba(33, 150, 243, 0.2))',
    },

    '& .empty-title': {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary,
        position: 'relative',
        zIndex: 1,
    },

    '& .empty-description': {
        fontSize: '1.1rem',
        color: theme.palette.text.secondary,
        maxWidth: 600,
        margin: '0 auto',
        lineHeight: 1.6,
        position: 'relative',
        zIndex: 1,
    },

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(4),

        '& .empty-title': {
            fontSize: '1.3rem',
        },

        '& .empty-description': {
            fontSize: '1rem',
        },
    },
}));

// ========================================
// 🎨 TABS NAVIGATION
// ========================================

export const TabsContainer = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    background: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.7)
        : alpha(theme.palette.background.paper, 0.9),
    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1),
    backdropFilter: 'blur(10px)',
    boxShadow: theme.shadows[1],

    [theme.breakpoints.down('md')]: {
        borderRadius: theme.spacing(1),
        padding: theme.spacing(0.5),
    },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        minHeight: 56,
        fontWeight: 600,
        fontSize: '0.9rem',
        textTransform: 'none',
        borderRadius: theme.spacing(1),
        margin: theme.spacing(0.25),
        minWidth: 120,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
        }),
        color: theme.palette.text.secondary,
        flexDirection: 'row',
        gap: theme.spacing(1),
        position: 'relative',
        overflow: 'hidden',

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            transition: theme.transitions.create(['background'], {
                duration: theme.transitions.duration.short,
            }),
        },

        '&.Mui-selected': {
            background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.85)
                : alpha(theme.palette.background.paper, 0.92),
            color: theme.palette.primary.main,
            fontWeight: 600,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            boxShadow: theme.shadows[2],
            transform: 'translateY(-1px)',

            '&::before': {
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 100%)`,
            },
        },

        '&:hover:not(.Mui-selected)': {
            background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.background.paper, 0.6),
            color: theme.palette.primary.main,
            transform: 'translateY(-0.5px)',

            '&::before': {
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, transparent 100%)`,
            },
        },

        [theme.breakpoints.down('md')]: {
            minHeight: 48,
            fontSize: '0.85rem',
            minWidth: 100,
            padding: theme.spacing(1, 1.5),
        },

        [theme.breakpoints.down('sm')]: {
            minHeight: 44,
            fontSize: '0.8rem',
            minWidth: 80,
            padding: theme.spacing(0.75, 1),
        },
    },

    '& .MuiTabs-indicator': {
        display: 'none',
    },

    '& .MuiTabs-scrollButtons': {
        color: theme.palette.primary.main,
        borderRadius: theme.spacing(1),
        margin: theme.spacing(0.25),
        transition: theme.transitions.create(['all']),

        '&:hover': {
            background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.3)
                : alpha(theme.palette.background.paper, 0.5),
        },

        '&.Mui-disabled': {
            opacity: 0.3,
        },
    },
}));

export const TabLabel = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),

    '& .tab-icon': {
        fontSize: '1.2rem',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',

        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem',
        },
    },

    '& .tab-text': {
        fontSize: 'inherit',
        fontWeight: 'inherit',

        [theme.breakpoints.down('sm')]: {
            display: 'none', // Hide text on mobile, show only icons
        },
    },
}));

// ========================================
// 📊 CONTENT SECTIONS
// ========================================

export const SectionContainer = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    transition: theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.short,
    }),

    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[4],
    },

    [theme.breakpoints.down('md')]: {
        borderRadius: theme.spacing(1.5),
    },
}));

export const GridSection = styled(Box)(({ theme }) => ({
    '& .MuiGrid-container': {
        margin: 0,
        width: '100%',

        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1.5),
            paddingLeft: theme.spacing(1.5),
            display: 'flex',
            flexDirection: 'column',

            [theme.breakpoints.down('md')]: {
                paddingTop: theme.spacing(1),
                paddingLeft: theme.spacing(1),
            },
        },
    },
}));

// ========================================
// 🎯 RESPONSIVE UTILITIES
// ========================================

export const ResponsiveBox = styled(Box, {
    shouldForwardProp: (prop) => !['hideOnMobile', 'hideOnTablet', 'hideOnDesktop'].includes(prop as string),
})<{
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
}>(({ theme, hideOnMobile, hideOnTablet, hideOnDesktop }) => ({
    ...(hideOnMobile && {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    }),

    ...(hideOnTablet && {
        [theme.breakpoints.between('md', 'lg')]: {
            display: 'none',
        },
    }),

    ...(hideOnDesktop && {
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    }),
}));

// ========================================
// 🎨 ANIMATION UTILITIES
// ========================================

export const FadeInBox = styled(Box)(({ theme }) => ({
    animation: 'fadeIn 0.6s ease-out',

    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

export const SlideInBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
    animation: `slideIn 0.8s ease-out ${delay}s both`,

    '@keyframes slideIn': {
        '0%': {
            opacity: 0,
            transform: 'translateX(-30px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateX(0)',
        },
    },
}));
