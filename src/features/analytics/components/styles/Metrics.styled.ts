import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 🎨 STYLED COMPONENTS PARA UNIFIED METRICS
 * Componentes estilizados para métricas unificadas
 */

// ========================================
// 📦 MAIN CONTAINERS
// ========================================

export const MetricsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
}));

export const MetricsHeader = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
    },
}));

export const MetricsTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),

    '& .title-icon': {
        fontSize: '1.3rem',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
    },
}));

export const MetricsSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 400,
    marginTop: theme.spacing(0.5),

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

// ========================================
// 📊 GRID SYSTEM
// ========================================

export const MetricsGrid = styled(Grid, {
    shouldForwardProp: (prop) => prop !== 'maxCols',
})<{
    maxCols?: number;
}>(({ theme, maxCols = 4 }) => ({
    width: '100%',
    margin: 0,
    marginBottom: theme.spacing(2),

    '& .MuiGrid-item': {
        paddingTop: theme.spacing(1.5),
        paddingLeft: theme.spacing(1.5),
        display: 'flex',

        '&:first-of-type': {
            paddingTop: 0,
        },

        '&:nth-of-type(-n+${maxCols})': {
            paddingTop: 0,
        },
    },

    // Responsive adjustments
    [theme.breakpoints.down('lg')]: {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1.25),
            paddingLeft: theme.spacing(1.25),
        },
    },

    [theme.breakpoints.down('md')]: {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
    },

    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(1.5),

        '& .MuiGrid-item': {
            paddingTop: theme.spacing(0.75),
            paddingLeft: theme.spacing(0.75),
        },
    },
}));

// ========================================
// 🎯 LOADING & EMPTY STATES
// ========================================

export const MetricsLoadingContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)'
        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(25, 118, 210, 0.01) 100%)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
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

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

export const MetricsLoadingIcon = styled(Box)(({ theme }) => ({
    fontSize: '2rem',
    marginBottom: theme.spacing(1),
    position: 'relative',
    zIndex: 1,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
}));

export const MetricsLoadingText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    position: 'relative',
    zIndex: 1,

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.875rem',
    },
}));

export const MetricsEmptyContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(156, 163, 175, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(156, 163, 175, 0.08) 0%, rgba(156, 163, 175, 0.04) 100%)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}40`,
    color: theme.palette.text.secondary,

    '& .empty-icon': {
        fontSize: '3rem',
        marginBottom: theme.spacing(2),
        opacity: 0.6,
    },

    '& .empty-title': {
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.primary,
    },

    '& .empty-description': {
        fontSize: '0.875rem',
        lineHeight: 1.5,
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),

        '& .empty-icon': {
            fontSize: '2.5rem',
        },

        '& .empty-description': {
            fontSize: '0.8rem',
        },
    },
}));

// ========================================
// 🎨 METRIC CARD WRAPPER
// ========================================

export const MetricCardWrapper = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .MuiPaper-root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[6],
        },
    },
}));

// ========================================
// 🎯 RESPONSIVE UTILITIES
// ========================================

export const ResponsiveMetricsWrapper = styled(Box, {
    shouldForwardProp: (prop) => !['hideOnMobile', 'hideOnTablet'].includes(prop as string),
})<{
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
}>(({ theme, hideOnMobile, hideOnTablet }) => ({
    width: '100%',

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
}));

// ========================================
// 🏷️ CATEGORY INDICATORS
// ========================================

export const CategoryIndicator = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'category',
})<{
    category: 'analytics' | 'dashboard' | 'performance' | 'geographic' | 'audience';
}>(({ theme, category }) => {
    const categoryColors = {
        analytics: theme.palette.primary.main,
        dashboard: theme.palette.secondary.main,
        performance: theme.palette.warning.main,
        geographic: theme.palette.info.main,
        audience: theme.palette.success.main,
    };

    const currentColor = categoryColors[category];

    return {
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(3),
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        background: `${currentColor}20`,
        color: currentColor,
        border: `1px solid ${currentColor}40`,

        [theme.breakpoints.down('sm')]: {
            fontSize: '0.7rem',
            padding: theme.spacing(0.25, 0.75),
        },
    };
});

// ========================================
// 📊 METRICS SUMMARY
// ========================================

export const MetricsSummaryContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,

    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(1.5),
        padding: theme.spacing(1.5),
    },
}));

export const MetricsSummaryTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: 0.5,

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
    },
}));

export const MetricsSummaryGrid = styled(Grid)(({ theme }) => ({
    '& .MuiGrid-item': {
        textAlign: 'center',
        padding: theme.spacing(1),

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0.5),
        },
    },
}));

export const SummaryValue = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.palette.primary.main,
    lineHeight: 1,

    [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
    },
}));

export const SummaryLabel = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    fontWeight: 500,

    [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
    },
}));
