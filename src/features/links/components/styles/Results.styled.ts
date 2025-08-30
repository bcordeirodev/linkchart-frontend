import { styled } from '@mui/material/styles';
import { Paper, Box, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA RESULTS MODULE
 * Componentes estilizados para resultados de URLs
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const ResultContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
    border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',

    // Success glow animation
    animation: 'successGlow 3s ease-in-out infinite',

    '@keyframes successGlow': {
        '0%, 100%': {
            boxShadow: `0 0 20px ${alpha(theme.palette.success.main, 0.2)}`,
        },
        '50%': {
            boxShadow: `0 0 30px ${alpha(theme.palette.success.main, 0.4)}`,
        },
    },

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
    },

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        borderRadius: theme.spacing(1.5),
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2.5),
    },
}));

export const SuccessHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    position: 'relative',
    zIndex: 1,
}));

export const SuccessIcon = styled(Box)(({ theme }) => ({
    fontSize: '3rem',
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
    filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.success.main, 0.3)})`,
    animation: 'bounce 1s ease-in-out',

    '@keyframes bounce': {
        '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
        },
        '40%': {
            transform: 'translateY(-10px)',
        },
        '60%': {
            transform: 'translateY(-5px)',
        },
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '2.5rem',
    },
}));

export const SuccessTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.5rem',
    color: theme.palette.success.main,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),

    [theme.breakpoints.down('sm')]: {
        fontSize: '1.3rem',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
    },
}));

export const SuccessSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    fontWeight: 400,

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
    },
}));

// ========================================
// 🔗 URL DISPLAY
// ========================================

export const UrlDisplayContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    background: alpha(theme.palette.background.paper, 0.9),
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: `linear-gradient(180deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

export const UrlLabel = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing(1),
    display: 'block',
}));

export const UrlDisplay = styled(Typography)(({ theme }) => ({
    fontFamily: 'monospace',
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '1.125rem',
    wordBreak: 'break-all',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: theme.spacing(1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
    }),

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderColor: alpha(theme.palette.primary.main, 0.2),
    },

    [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
        padding: theme.spacing(1),
    },
}));

// ========================================
// 🎛️ ACTION BUTTONS
// ========================================

export const ActionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1),
    },
}));

export const CopyActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.25, 2.5),
    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
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
            duration: theme.transitions.duration.standard,
        }),
    },

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 20px ${alpha(theme.palette.info.main, 0.4)}`,

        '&::before': {
            left: '100%',
        },
    },

    '&:active': {
        transform: 'translateY(-1px)',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

export const ShareActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.25, 2.5),
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
    }),

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.4)}`,
    },

    '&:active': {
        transform: 'translateY(-1px)',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

// ========================================
// 🔄 ADDITIONAL ACTIONS
// ========================================

export const AdditionalActionsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1.5),
    },
}));

export const CreateAnotherButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
    }),

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
    },

    '&:active': {
        transform: 'translateY(0)',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

// ========================================
// 🎨 DECORATIVE ELEMENTS
// ========================================

export const SuccessDecoration = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
    borderRadius: '50%',
    opacity: 0.6,
    animation: 'float 6s ease-in-out infinite',

    '@keyframes float': {
        '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
        },
        '50%': {
            transform: 'translateY(-10px) rotate(180deg)',
        },
    },

    [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80,
        top: -20,
        right: -20,
    },
}));

export const UrlHighlight = styled(Box)(({ theme }) => ({
    position: 'relative',

    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
        borderRadius: '1px',
        animation: 'slideIn 1s ease-out',
    },

    '@keyframes slideIn': {
        '0%': {
            transform: 'scaleX(0)',
        },
        '100%': {
            transform: 'scaleX(1)',
        },
    },
}));
