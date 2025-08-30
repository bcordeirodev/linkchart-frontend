import { styled } from '@mui/material/styles';
import { Card, CardContent as MuiCardContent, Typography, Box, Avatar } from '@mui/material';

/**
 * 🎨 STYLED COMPONENTS PARA METRIC CARD
 * Design moderno com melhor contraste e responsividade
 */

// ========================================
// 🎯 MAIN CARD CONTAINER
// ========================================

export const MetricCardContainer = styled(Card)(({ theme }) => ({
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.spacing(1.5),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',

    // Hover effects
    '&:hover': {
        transform: 'translateY(-4px)',
        '&::before': {
            opacity: 1,
        },
    },

    // Glow effect base
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: 0,
    },
}));

// ========================================
// 🎨 COLOR VARIANTS
// ========================================

interface ColorVariantProps {
    colorVariant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const getCardStyles = (theme: any, colorVariant: ColorVariantProps['colorVariant']) => {
    const isDark = theme.palette.mode === 'dark';

    const colorMap = {
        primary: {
            main: theme.palette.primary.main,
            light: theme.palette.primary.light,
        },
        secondary: {
            main: theme.palette.secondary.main,
            light: theme.palette.secondary.light,
        },
        success: {
            main: '#4caf50',
            light: '#81c784',
        },
        warning: {
            main: '#ff9800',
            light: '#ffb74d',
        },
        error: {
            main: theme.palette.error.main,
            light: '#e57373',
        },
        info: {
            main: '#2196f3',
            light: '#64b5f6',
        },
    };

    const colors = colorMap[colorVariant];

    return {
        background: isDark
            ? `linear-gradient(135deg, ${colors.main}25 0%, ${colors.main}15 100%)`
            : `linear-gradient(135deg, ${colors.main}20 0%, ${colors.main}10 100%)`,
        border: `1px solid ${colors.main}50`,
        iconBg: isDark ? `${colors.main}35` : `${colors.main}25`,
        iconColor: colors.main,
        accent: colors.light,
        glowEffect: `linear-gradient(135deg, ${colors.light}30 0%, ${colors.main}15 50%, transparent 70%)`,
        bottomLine: `linear-gradient(90deg, ${colors.main} 0%, ${colors.light} 100%)`,
        hoverShadow: isDark
            ? `0 12px 40px ${colors.main}25`
            : `0 12px 40px ${colors.main}20`,
    };
};

// ========================================
// 📝 CONTENT COMPONENTS
// ========================================

export const CardContentStyled = styled(MuiCardContent)(({ theme }) => ({
    padding: `${theme.spacing(3)} !important`,
    position: 'relative',
    zIndex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(2)} !important`,
    },
}));

export const CardLayout = styled(Box)({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100%',
});

export const CardContentArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}));

// ========================================
// 🔤 TYPOGRAPHY COMPONENTS
// ========================================

export const CardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: '0.75rem',
    lineHeight: 1.2,
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.8)'
        : 'rgba(0, 0, 0, 0.7)',
}));

export const CardValue = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    marginBottom: theme.spacing(1),
    lineHeight: 1.1,
    fontSize: '2rem',

    [theme.breakpoints.down('md')]: {
        fontSize: '1.75rem',
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
    },
}));

export const CardSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.6)'
        : 'rgba(0, 0, 0, 0.6)',
}));

// ========================================
// 📊 TREND COMPONENT
// ========================================

export const TrendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    width: 'fit-content',
}));

export const TrendValue = styled(Typography)({
    fontWeight: 700,
    fontSize: '0.75rem',
});

export const TrendLabel = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(0.5),
    fontSize: '0.7rem',
    opacity: 0.9,
}));

// ========================================
// 🎭 ICON COMPONENT
// ========================================

export const CardIcon = styled(Avatar)(({ theme }) => ({
    width: 64,
    height: 64,
    border: `2px solid transparent`,
    transition: 'all 0.3s ease',

    '& svg': {
        fontSize: '1.75rem',
    },

    [theme.breakpoints.down('sm')]: {
        width: 56,
        height: 56,

        '& svg': {
            fontSize: '1.5rem',
        },
    },
}));

// ========================================
// 🎨 DECORATIVE ELEMENTS
// ========================================

export const DecorativeElement = styled(Box)({
    position: 'absolute',
    top: -20,
    right: -20,
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    opacity: 0.6,
    transition: 'all 0.3s ease',
});

export const BottomLine = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    opacity: 0.8,
});
