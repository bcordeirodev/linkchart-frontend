/**
 * 📊 METRIC CARD OTIMIZADO - LINK CHART
 * Versão otimizada usando os novos utilitários de tema
 * 
 * @description
 * MetricCard refatorado para demonstrar o uso dos novos
 * utilitários de tema, resultando em código mais limpo e consistente.
 * 
 * @since 2.0.0
 */

import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme } from '@mui/material';
import {
    createComponentColorSet,
    createGlassCard,
    createSpacingUtils,
    createPresetShadows,
    createTextGradient
} from '@/lib/theme';
import { ColorVariant } from '@/lib/theme/utils/colorUtils';

interface MetricCardOptimizedProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: ColorVariant;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

/**
 * 📊 METRIC CARD OTIMIZADO
 * Demonstra o uso dos novos utilitários de tema
 */
export const MetricCardOptimized: React.FC<MetricCardOptimizedProps> = ({
    title,
    value,
    subtitle,
    icon,
    color = 'primary',
    trend
}) => {
    const theme = useTheme();

    // Usa os novos utilitários para criar o conjunto de cores
    const colors = createComponentColorSet(theme, color);
    const spacing = createSpacingUtils(theme);
    const shadows = createPresetShadows(theme);

    return (
        <Card
            sx={{
                // Usa glassmorphism utilitário
                ...createGlassCard(theme, color === 'primary' ? 'primary' : 'neutral'),

                // Usa espaçamento padronizado
                p: 3,

                // Usa sombras pré-definidas
                boxShadow: shadows.card,

                // Usa animações de estado
                transition: theme.transitions.create(['all'], {
                    duration: theme.transitions.duration.short
                }),
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                    borderColor: colors.main
                },

                // Responsividade
                minHeight: { xs: 140, sm: 160, md: 180 }
            }}
        >
            <CardContent sx={{ p: '0 !important' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        height: '100%'
                    }}
                >
                    {/* Área de conteúdo */}
                    <Box sx={{ flexGrow: 1, pr: 2 }}>
                        {/* Título */}
                        <Typography
                            variant="body2"
                            sx={{
                                ...spacing.margin.sm,
                                marginBottom: 1.5,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: 0.8,
                                fontSize: '0.75rem',
                                color: colors.text.secondary,
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }}
                        >
                            {title}
                        </Typography>

                        {/* Valor principal com gradiente de texto */}
                        <Typography
                            variant="h3"
                            sx={{
                                // Usa utilitário de gradiente de texto
                                ...createTextGradient(theme, color),
                                fontWeight: 800,
                                marginBottom: 1,
                                lineHeight: 1.1,
                                fontFamily: 'Inter, system-ui, sans-serif',
                                // Responsividade
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                            }}
                        >
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>

                        {/* Subtitle */}
                        {subtitle && (
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: colors.text.hint,
                                    fontFamily: 'Inter, system-ui, sans-serif'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}

                        {/* Trend indicator */}
                        {trend && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 1,
                                    p: 1,
                                    borderRadius: 1,
                                    width: 'fit-content',
                                    backgroundColor: trend.isPositive
                                        ? colors.background.elevated
                                        : colors.background.elevated,
                                    color: trend.isPositive ? 'success.main' : 'error.main'
                                }}
                            >
                                <Typography variant="caption" fontWeight={700}>
                                    {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                                </Typography>
                                <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.9 }}>
                                    vs. anterior
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Ícone */}
                    <Avatar
                        sx={{
                            width: { xs: 56, sm: 64 },
                            height: { xs: 56, sm: 64 },
                            background: colors.gradients.subtle,
                            color: colors.main,
                            border: `2px solid ${colors.border.default}`,
                            boxShadow: shadows.primaryGlow,
                            borderRadius: '12px',
                            '& svg': {
                                fontSize: { xs: '1.5rem', sm: '1.75rem' }
                            }
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MetricCardOptimized;
