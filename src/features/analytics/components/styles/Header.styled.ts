import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA ANALYTICS HEADER
 * Header padronizado com variantes para dashboard e analytics
 */

// ========================================
// 📦 HEADER CONTAINER
// ========================================

export const HeaderContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    width: '100%',
}));

export const HeaderContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant',
})<{
    variant: 'dashboard' | 'analytics';
}>(({ theme, variant }) => {
    const colors = {
        dashboard: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        analytics: {
            main: theme.palette.warning?.main || '#ed6c02',
            light: theme.palette.warning?.light || '#ff9800',
        },
    };

    const currentColors = colors[variant];

    return {
        background: `linear-gradient(135deg, ${currentColors.main}15 0%, ${currentColors.main}08 100%)`,
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(3),
        border: `1px solid ${currentColors.main}15`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            background: `linear-gradient(135deg, ${currentColors.main}20 0%, ${currentColors.main}10 100%)`,
            border: `1px solid ${currentColors.main}25`,
            transform: 'translateY(-1px)',
            boxShadow: `0 8px 25px ${currentColors.main}20`,
        },

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(2.5),
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: theme.spacing(2),
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            borderRadius: theme.spacing(1),
        },
    };
});

// ========================================
// 🎨 DECORATIVE ELEMENTS
// ========================================

export const HeaderDecoration = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant',
})<{
    variant: 'dashboard' | 'analytics';
}>(({ theme, variant }) => {
    const colors = {
        dashboard: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        analytics: {
            main: theme.palette.warning?.main || '#ed6c02',
            light: theme.palette.warning?.light || '#ff9800',
        },
    };

    const currentColors = colors[variant];

    return {
        position: 'absolute',
        top: variant === 'dashboard' ? -30 : -25,
        [variant === 'dashboard' ? 'right' : 'left']: variant === 'dashboard' ? -30 : -25,
        width: variant === 'dashboard' ? 150 : 120,
        height: variant === 'dashboard' ? 150 : 120,
        background: `linear-gradient(135deg, ${currentColors.main}1A 0%, ${currentColors.main}0D 100%)`,
        borderRadius: '50%',
        opacity: 0.6,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.standard,
        }),

        [theme.breakpoints.down('md')]: {
            width: variant === 'dashboard' ? 120 : 100,
            height: variant === 'dashboard' ? 120 : 100,
            top: variant === 'dashboard' ? -20 : -15,
            [variant === 'dashboard' ? 'right' : 'left']: variant === 'dashboard' ? -20 : -15,
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    };
});

// ========================================
// 📝 CONTENT SECTION
// ========================================

export const HeaderMainContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flex: 1,

    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
}));

export const HeaderIcon = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant',
})<{
    variant: 'dashboard' | 'analytics';
}>(({ theme, variant }) => {
    const colors = {
        dashboard: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        analytics: {
            main: theme.palette.warning?.main || '#ed6c02',
            light: theme.palette.warning?.light || '#ff9800',
        },
    };

    const currentColors = colors[variant];

    return {
        background: `linear-gradient(135deg, ${currentColors.main} 0%, ${currentColors.light} 100%)`,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: `0 4px 15px ${currentColors.main}4D`,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${currentColors.main}60`,
        },

        '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1.5),
            borderRadius: theme.spacing(0.75),

            '& .MuiSvgIcon-root': {
                fontSize: '1.25rem',
            },
        },
    };
});

export const HeaderTextContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    minWidth: 0, // Allow text truncation
    flex: 1,
}));

export const HeaderTitle = styled('h1', {
    shouldForwardProp: (prop) => prop !== 'colorVariant',
})<{
    colorVariant: 'dashboard' | 'analytics';
}>(({ theme, colorVariant }) => {
    const colors = {
        dashboard: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        analytics: {
            main: theme.palette.warning?.main || '#ed6c02',
            light: theme.palette.warning?.light || '#ff9800',
        },
    };

    const currentColors = colors[colorVariant];

    return {
        fontWeight: 700,
        background: `linear-gradient(135deg, ${currentColors.main} 0%, ${currentColors.light} 100%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
        marginBottom: theme.spacing(0.5),
        fontSize: '1.75rem',
        lineHeight: 1.2,
        fontFamily: theme.typography.h4.fontFamily,

        // Fallback for browsers that don't support background-clip: text
        '@supports not (background-clip: text)': {
            color: currentColors.main,
            WebkitTextFillColor: 'unset',
        },

        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem',
        },

        [theme.breakpoints.down('sm')]: {
            fontSize: '1.25rem',
        },
    };
});

export const HeaderSubtitle = styled(Typography)(({ theme }) => ({
    fontWeight: 400,
    opacity: 0.8,
    fontSize: '0.95rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.4,

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
    },
}));

// ========================================
// 🎛️ ACTIONS SECTION
// ========================================

export const HeaderActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',

    [theme.breakpoints.down('md')]: {
        width: '100%',
        justifyContent: 'flex-end',
    },

    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.75),
    },
}));

export const HeaderActionButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'variant',
})<{
    variant: 'dashboard' | 'analytics';
}>(({ theme, variant }) => {
    const colors = {
        dashboard: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        analytics: {
            main: theme.palette.warning?.main || '#ed6c02',
            light: theme.palette.warning?.light || '#ff9800',
        },
    };

    const currentColors = colors[variant];

    return {
        borderRadius: theme.spacing(1.5),
        background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${currentColors.main}33`,
        padding: theme.spacing(1.25),
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            background: `${currentColors.main}1A`,
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 15px ${currentColors.main}4D`,
            borderColor: `${currentColors.main}66`,
        },

        '&:active': {
            transform: 'translateY(-1px)',
        },

        '&.Mui-disabled': {
            opacity: 0.5,
            transform: 'none',
        },

        '& .MuiSvgIcon-root': {
            color: currentColors.main,
            fontSize: '1.25rem',
            transition: theme.transitions.create(['color'], {
                duration: theme.transitions.duration.short,
            }),
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            borderRadius: theme.spacing(1),

            '& .MuiSvgIcon-root': {
                fontSize: '1.125rem',
            },
        },
    };
});

// ========================================
// 🎯 LOADING STATES
// ========================================

export const HeaderLoadingOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'inherit',
    zIndex: 10,
    transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.short,
    }),
}));

// ========================================
// 🎨 BREADCRUMB INTEGRATION
// ========================================

export const HeaderWithBreadcrumb = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),

    '& .page-breadcrumb': {
        '& .MuiBreadcrumbs-root': {
            fontSize: '0.875rem',

            '& .MuiBreadcrumbs-separator': {
                color: theme.palette.text.disabled,
            },

            '& .MuiLink-root': {
                color: theme.palette.text.secondary,
                textDecoration: 'none',
                fontWeight: 500,
                transition: theme.transitions.create(['color'], {
                    duration: theme.transitions.duration.short,
                }),

                '&:hover': {
                    color: theme.palette.primary.main,
                },
            },

            '& .MuiTypography-root': {
                color: theme.palette.text.primary,
                fontWeight: 600,
            },
        },
    },
}));
