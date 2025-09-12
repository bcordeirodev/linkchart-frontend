import { Box, Container, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { createPresetAnimations } from '@/lib/theme';

interface AnalyticsLayoutProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    spacing?: number;
    padding?: number;
    animate?: boolean;
}

/**
 * 📐 ANALYTICS LAYOUT - Layout Padronizado para Analytics
 *
 * @description
 * Layout consistente para todas as páginas e componentes de analytics,
 * garantindo espaçamentos, responsividade e animações uniformes.
 *
 * @features
 * - Espaçamentos padronizados
 * - Responsividade automática
 * - Animações consistentes
 * - Container otimizado
 */
export function AnalyticsLayout({
    children,
    maxWidth = 'xl',
    spacing = 3,
    padding = 3,
    animate = true
}: AnalyticsLayoutProps) {
    const theme = useTheme();
    const animations = createPresetAnimations(theme);

    return (
        <Container
            maxWidth={maxWidth}
            sx={{
                py: padding,
                px: { xs: 2, sm: padding },
                ...(animate && animations.fadeIn)
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing,
                    minHeight: 'calc(100vh - 200px)', // Altura mínima responsiva
                    '& > *': {
                        width: '100%'
                    }
                }}
            >
                {children}
            </Box>
        </Container>
    );
}

export default AnalyticsLayout;
