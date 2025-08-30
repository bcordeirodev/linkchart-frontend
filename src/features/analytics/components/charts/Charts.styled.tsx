import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// Disable TypeScript warnings for styled components type inference

/**
 * 📊 STYLED COMPONENTS PARA CHARTS
 * Componentes estilizados para seção de gráficos
 */

// ========================================
// 📦 CONTAINERS
// ========================================

export const ChartsContainer = styled(Grid)(({ theme }) => ({
    width: '100%',
    margin: 0,

    '& .MuiGrid-item': {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(1.5),
        paddingLeft: theme.spacing(1.5),
    },

    // Melhor responsividade
    [theme.breakpoints.down('md')]: {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        }
    }
}));

export const ChartSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),

    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),
    },
}));

export const ChartTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    fontSize: '1.1rem',

    [theme.breakpoints.down('sm')]: {
        fontSize: '1rem',
        marginBottom: theme.spacing(1.5),
    },
}));

// ========================================
// 📈 CHART WRAPPERS
// ========================================

export const MainChartsWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'contents', // Para que os Grid items funcionem corretamente

    '& .MuiGrid-item': {
        '& .chart-card': {
            height: '100%',
            minHeight: 320,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
            },
        },
    },

    [theme.breakpoints.down('lg')]: {
        '& .MuiGrid-item': {
            '& .chart-card': {
                minHeight: 280,
            },
        },
    },
}));

export const DeviceCountryWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'contents',

    '& .MuiGrid-item': {
        '& .chart-card': {
            height: '100%',
            minHeight: 300,
            transition: 'all 0.3s ease',

            '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[6],
            },
        },
    },

    [theme.breakpoints.down('md')]: {
        '& .MuiGrid-item': {
            '& .chart-card': {
                minHeight: 250,
            },
        },
    },
}));

export const AdvancedChartsWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'contents',

    '& .MuiGrid-item': {
        '& .chart-card': {
            height: '100%',
            minHeight: 350,
            transition: 'all 0.3s ease',

            '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[6],
            },
        },
    },

    [theme.breakpoints.down('md')]: {
        '& .MuiGrid-item': {
            '& .chart-card': {
                minHeight: 280,
            },
        },
    },
}));

// ========================================
// 🎯 LOADING E ERROR STATES
// ========================================

export const ChartsLoadingContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)'
        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(25, 118, 210, 0.01) 100%)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
}));

export const ChartsLoadingIcon = styled(Box)(({ theme }) => ({
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
}));

export const ChartsLoadingText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
}));

// ========================================
// 🎯 EMPTY STATE COMPONENTS
// ========================================

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)',
    borderRadius: theme.spacing(2),
    border: `1px solid ${theme.palette.info.main}30`,
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        background: `linear-gradient(135deg, ${theme.palette.info.main}20 0%, transparent 70%)`,
        borderRadius: '50%',
    },

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
    },
}));

export const DemoControlsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    background: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1),
        alignItems: 'stretch',
    },
}));

export const BackButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1, 2),
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(['all'], {
        duration: theme.transitions.duration.short,
    }),

    '&:hover': {
        background: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        transform: 'translateX(-2px)',
    },

    [theme.breakpoints.down('sm')]: {
        width: '100%',
        justifyContent: 'center',
    },
}));

// ========================================
// 🎨 CHART CONTAINERS ENHANCED
// ========================================

export const ChartCardWrapper = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .MuiCard-root': {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.short,
        }),

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8],
        },
    },

    '& .MuiCardContent-root': {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',

        '&:last-child': {
            paddingBottom: theme.spacing(2),
        },
    },
}));

export const ChartContentArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 300,
    position: 'relative',

    '& .apexcharts-canvas': {
        margin: '0 auto',
    },

    [theme.breakpoints.down('md')]: {
        minHeight: 250,
    },

    [theme.breakpoints.down('sm')]: {
        minHeight: 200,
    },
}));

// ========================================
// 📊 RESPONSIVE GRID SYSTEM
// ========================================

export const ResponsiveChartsGrid = styled(Grid, {
    shouldForwardProp: (prop) => prop !== 'variant',
})<{
    variant?: 'dashboard' | 'analytics' | 'full';
}>(({ theme, variant = 'full' }) => ({
    width: '100%',
    margin: 0,

    '& .MuiGrid-item': {
        paddingTop: theme.spacing(1.5),
        paddingLeft: theme.spacing(1.5),
        display: 'flex',
    },

    // Variant-specific spacing
    ...(variant === 'dashboard' && {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
    }),

    [theme.breakpoints.down('md')]: {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
        },
    },

    [theme.breakpoints.down('sm')]: {
        '& .MuiGrid-item': {
            paddingTop: theme.spacing(0.75),
            paddingLeft: theme.spacing(0.75),
        },
    },
}));
