import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Button, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA UI MODULE
 * Componentes base reutilizáveis em toda aplicação
 */

// ========================================
// 📦 EMPTY STATE COMPONENTS
// ========================================

export const EmptyStateContainer = styled(Paper, {
    shouldForwardProp: (prop) => !['variant', 'customHeight'].includes(prop as string),
})<{
    variant?: 'charts' | 'data' | 'general';
    customHeight?: number | string;
}>(({ theme, variant = 'general', customHeight = 300 }) => {
    const variantColors = {
        charts: theme.palette.info.main,
        data: theme.palette.warning.main,
        general: theme.palette.primary.main,
    };

    const currentColor = variantColors[variant as keyof typeof variantColors];

    return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(6, 4),
        textAlign: 'center',
        minHeight: typeof customHeight === 'number' ? customHeight : 'auto',
        height: typeof customHeight === 'string' ? customHeight : 'auto',
        backgroundColor: theme.palette.mode === 'dark'
            ? `${currentColor}08`
            : `${currentColor}04`,
        border: `2px dashed ${alpha(currentColor, 0.3)}`,
        borderRadius: theme.spacing(2),
        position: 'relative',
        overflow: 'hidden',
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
        }),

        '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            background: `linear-gradient(135deg, ${alpha(currentColor, 0.1)} 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
        },

        '@keyframes float': {
            '0%, 100%': {
                transform: 'translateY(0) rotate(0deg)',
            },
            '50%': {
                transform: 'translateY(-10px) rotate(180deg)',
            },
        },

        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? `${currentColor}12`
                : `${currentColor}08`,
            borderColor: currentColor,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(currentColor, 0.2)}`,
        },

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4, 3),
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3, 2),
        },
    };
});

export const EmptyStateIcon = styled(Box)(({ theme }) => ({
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
    opacity: 0.8,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
    animation: 'pulse 3s infinite',

    '@keyframes pulse': {
        '0%, 100%': {
            opacity: 0.8,
            transform: 'scale(1)',
        },
        '50%': {
            opacity: 1,
            transform: 'scale(1.05)',
        },
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '3rem',
    },
}));

export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.5rem',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,

    [theme.breakpoints.down('sm')]: {
        fontSize: '1.3rem',
    },
}));

export const EmptyStateDescription = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    maxWidth: 400,
    lineHeight: 1.6,
    fontSize: '1rem',

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
        marginBottom: theme.spacing(2),
    },
}));

export const EmptyStateActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    justifyContent: 'center',

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1.5),
        width: '100%',
    },
}));

export const EmptyStateActionButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'buttonVariant',
})<{
    buttonVariant?: 'primary' | 'secondary';
}>(({ theme, buttonVariant = 'primary' }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
    }),

    ...(buttonVariant === 'primary' && {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
        },
    }),

    ...(buttonVariant === 'secondary' && {
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,

        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: 'translateY(-1px)',
        },
    }),

    '&:active': {
        transform: 'translateY(0)',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

// ========================================
// 🎨 HERO SECTION COMPONENTS
// ========================================

export const HeroContainer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    position: 'relative',

    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(3),
    },
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.1,

    // Fallback for browsers that don't support background-clip: text
    '@supports not (background-clip: text)': {
        color: theme.palette.primary.main,
        WebkitTextFillColor: 'unset',
    },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    maxWidth: 500,
    margin: `0 auto ${theme.spacing(3)}px auto`,
    fontWeight: 400,
    fontSize: '1.125rem',
    lineHeight: 1.6,
    color: theme.palette.text.secondary,

    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        marginBottom: theme.spacing(2),
    },
}));

export const HeroChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: theme.spacing(1, 2),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    border: 'none',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
    animation: 'heroChipPulse 3s infinite',

    '@keyframes heroChipPulse': {
        '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        '50%': {
            transform: 'scale(1.05)',
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
        },
    },

    '&:hover': {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
        transform: 'scale(1.02)',
    },

    '& .MuiChip-icon': {
        color: 'inherit',
        marginLeft: 0,
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: theme.spacing(0.75, 1.5),
    },
}));

// ========================================
// 🎛️ GRADIENT BUTTON COMPONENTS
// ========================================

export const GradientButtonContainer = styled(Button, {
    shouldForwardProp: (prop) => !['gradient', 'shimmerEffect', 'isLoading'].includes(prop as string),
})<{
    gradient?: 'primary' | 'success' | 'warning' | 'error';
    shimmerEffect?: boolean;
    isLoading?: boolean;
}>(({ theme, gradient = 'primary', shimmerEffect = false, isLoading = false }) => {
    const gradients = {
        primary: {
            background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 50%, #6366F1 100%)',
            hover: 'linear-gradient(135deg, #0960C0 0%, #0090D1 50%, #5B5CE6 100%)',
        },
        success: {
            background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
            hover: 'linear-gradient(135deg, #45A049 0%, #7CB342 100%)',
        },
        warning: {
            background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
            hover: 'linear-gradient(135deg, #F57C00 0%, #FFA000 100%)',
        },
        error: {
            background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)',
            hover: 'linear-gradient(135deg, #D32F2F 0%, #C2185B 100%)',
        },
    };

    const gradientConfig = gradients[gradient];

    return {
        borderRadius: theme.spacing(1.5),
        textTransform: 'none',
        fontWeight: 700,
        fontSize: '1rem',
        minHeight: 52,
        background: gradientConfig.background,
        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeInOut,
        }),

        ...(shimmerEffect && {
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                transition: theme.transitions.create(['left'], {
                    duration: theme.transitions.duration.complex,
                }),
            },
        }),

        '&:hover:not(:disabled)': {
            background: gradientConfig.hover,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.45)}`,

            ...(shimmerEffect && {
                '&::before': {
                    left: '100%',
                },
            }),
        },

        '&:active:not(:disabled)': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
        },

        '&:disabled': {
            background: alpha(theme.palette.action.disabled, 0.3),
            color: alpha(theme.palette.action.disabled, 0.7),
            transform: 'none',
            boxShadow: 'none',
        },

        ...(isLoading && {
            cursor: 'not-allowed',

            '&:hover': {
                transform: 'none',
            },
        }),

        [theme.breakpoints.down('sm')]: {
            minHeight: 48,
            fontSize: '0.875rem',
        },
    };
});

export const GradientButtonContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.2),
    position: 'relative',
    zIndex: 1,
}));

export const GradientButtonSpinner = styled(Box)(({ theme }) => ({
    width: 20,
    height: 20,
    border: '2.5px solid transparent',
    borderTop: '2.5px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',

    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },

    [theme.breakpoints.down('sm')]: {
        width: 18,
        height: 18,
        borderWidth: '2px',
        borderTopWidth: '2px',
    },
}));

// ========================================
// 📊 TAB COMPONENTS
// ========================================

export const TabPanelContainer = styled(Box, {
    shouldForwardProp: (prop) => !['value', 'index'].includes(prop as string),
})<{
    value: number;
    index: number;
}>(({ theme, value, index }) => ({
    display: value !== index ? 'none' : 'block',
    width: '100%',
    animation: value === index ? 'fadeIn 0.3s ease-in-out' : 'none',

    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

export const TabDescriptionContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.6)
        : alpha(theme.palette.primary.main, 0.03),
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    position: 'relative',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        borderRadius: '0 2px 2px 0',
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
    },
}));

export const TabDescriptionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

export const TabDescriptionIcon = styled(Box)(({ theme }) => ({
    fontSize: '1.5rem',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',

    [theme.breakpoints.down('sm')]: {
        fontSize: '1.25rem',
    },
}));

export const TabDescriptionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.125rem',
    color: theme.palette.text.primary,

    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
}));

export const TabDescriptionText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginBottom: theme.spacing(1),

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

export const TabDescriptionHighlight = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '0.8rem',
    fontWeight: 600,
    fontStyle: 'italic',

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
    },
}));

// ========================================
// 🎯 ENHANCED PAPER VARIANTS
// ========================================

export const StyledEnhancedPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'paperVariant',
})<{
    paperVariant?: 'elevated' | 'outlined' | 'glass';
}>(({ theme, paperVariant = 'elevated' }) => {
    const variantStyles = {
        elevated: {
            borderRadius: theme.spacing(1.5),
            boxShadow: theme.shadows[4],
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: theme.transitions.create(['all'], {
                duration: theme.transitions.duration.short,
            }),

            '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-1px)',
            },
        },

        outlined: {
            borderRadius: theme.spacing(1),
            border: `2px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            transition: theme.transitions.create(['all'], {
                duration: theme.transitions.duration.short,
            }),

            '&:hover': {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
        },

        glass: {
            borderRadius: theme.spacing(1.5),
            background: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.8)
                : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(
                theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.divider,
                0.2
            )}`,
            boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: theme.transitions.create(['all'], {
                duration: theme.transitions.duration.standard,
            }),

            '&:hover': {
                background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.9)
                    : 'rgba(255, 255, 255, 0.95)',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(0, 0, 0, 0.5)'
                    : '0 12px 40px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
                borderColor: theme.palette.primary.main,
            },
        },
    };

    return variantStyles[paperVariant];
});
