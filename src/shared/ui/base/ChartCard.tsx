/**
 * 📈 CHART CARD - COMPONENTE BASE
 * Container padronizado para gráficos
 */

import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createGlassCard } from '@/lib/theme';
import { BaseComponentProps } from '../components';

interface ChartCardProps extends BaseComponentProps {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    height?: number | string;
    loading?: boolean;
}

/**
 * Componente ChartCard seguindo padrões arquiteturais
 * Container padronizado para todos os gráficos da aplicação
 */
export function ChartCard({
    title,
    subtitle,
    action,
    height = 400,
    loading = false,
    children,
    sx,
    ...other
}: ChartCardProps) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                ...createGlassCard(theme, 'neutral'),
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                ...sx
            } as any}
            {...other}
        >
            {(title || action) && (
                <CardHeader
                    title={title && (
                        <Typography variant="h6" component="h3">
                            {title}
                        </Typography>
                    )}
                    subheader={subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                    action={action}
                    sx={{ pb: 1 }}
                />
            )}

            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    pt: title || action ? 1 : 3
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        height: typeof height === 'number' ? `${height}px` : height,
                        minHeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}
                >
                    {loading ? (
                        <Typography color="text.secondary">
                            Carregando gráfico...
                        </Typography>
                    ) : (
                        children
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}

export default ChartCard;
