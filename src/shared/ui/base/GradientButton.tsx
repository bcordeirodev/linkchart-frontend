/**
 * 🎨 GRADIENT BUTTON - COMPONENTE BASE
 * Botão com gradiente padronizado
 */

import { Button, ButtonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    gradient?: boolean;
    shimmerEffect?: boolean;
    loading?: boolean;
}

/**
 * Componente GradientButton seguindo padrões arquiteturais
 * Botão com gradiente para CTAs importantes
 */
export function GradientButton({
    variant = 'primary',
    gradient = true,
    shimmerEffect = false,
    loading = false,
    children,
    sx,
    ...other
}: GradientButtonProps) {
    const theme = useTheme();

    const gradientMap = {
        primary: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
        secondary: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
        success: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
        warning: `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`,
        error: `linear-gradient(45deg, ${theme.palette.error.main} 30%, ${theme.palette.error.light} 90%)`,
    };

    return (
        <Button
            variant="contained"
            disabled={loading}
            sx={{
                ...(gradient && {
                    background: gradientMap[variant],
                    boxShadow: `0 3px 5px 2px ${theme.palette[variant].main}30`,
                    '&:hover': {
                        background: gradientMap[variant],
                        boxShadow: `0 6px 10px 4px ${theme.palette[variant].main}30`,
                        transform: 'translateY(-1px)',
                    },
                }),
                ...(shimmerEffect && {
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
                        animation: loading ? 'shimmer 1.5s infinite' : 'none',
                    },
                    '@keyframes shimmer': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' }
                    }
                }),
                transition: theme.transitions.create(['transform', 'box-shadow']),
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: theme.spacing(1),
                ...sx
            }}
            {...other}
        >
            {children}
        </Button>
    );
}

export default GradientButton;
