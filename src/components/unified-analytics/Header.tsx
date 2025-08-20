'use client';

import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { Refresh, Download, Share, Dashboard, Analytics } from '@mui/icons-material';
import PageBreadcrumb from '@/components/utilities/PageBreadcrumb';

interface HeaderProps {
    variant: 'dashboard' | 'analytics';
    onRefresh?: () => void;
    onDownload?: () => void;
    onShare?: () => void;
    loading?: boolean;
    title?: string;
    subtitle?: string;
}

/**
 * Cabeçalho unificado para dashboard e analytics
 * Adapta-se ao contexto mantendo consistência visual
 */
export function Header({
    variant,
    onRefresh,
    onDownload,
    onShare,
    loading = false,
    title,
    subtitle
}: HeaderProps) {
    const theme = useTheme();

    // Configurações por variante
    const config = {
        dashboard: {
            title: title || 'Dashboard',
            subtitle: subtitle || 'Visão geral dos seus links e métricas de performance',
            icon: <Dashboard />,
            color: theme.palette.primary.main,
            lightColor: theme.palette.primary.light,
        },
        analytics: {
            title: title || 'Analytics Dashboard',
            subtitle: subtitle || 'Análise detalhada do desempenho dos seus links',
            icon: <Analytics />,
            color: theme.palette.warning?.main || '#ed6c02',
            lightColor: theme.palette.warning?.light || '#ff9800',
        }
    };

    const currentConfig = config[variant];

    return (
        <Box sx={{ mb: 5 }}>
            {/* <PageBreadcrumb /> */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${currentConfig.color}1A 0%, ${currentConfig.color}0D 100%)`,
                    borderRadius: 3,
                    p: 4,
                    border: `1px solid ${currentConfig.color}1A`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Elemento decorativo de fundo */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: variant === 'dashboard' ? -30 : -25,
                        [variant === 'dashboard' ? 'right' : 'left']: variant === 'dashboard' ? -30 : -25,
                        width: variant === 'dashboard' ? 150 : 120,
                        height: variant === 'dashboard' ? 150 : 120,
                        background: `linear-gradient(135deg, ${currentConfig.color}1A 0%, ${currentConfig.color}0D 100%)`,
                        borderRadius: '50%',
                        opacity: 0.6
                    }}
                />

                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Ícone da variante */}
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${currentConfig.color} 0%, ${currentConfig.lightColor} 100%)`,
                            borderRadius: 2,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: `0 4px 15px ${currentConfig.color}4D`
                        }}
                    >
                        {currentConfig.icon}
                    </Box>

                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${currentConfig.color} 0%, ${currentConfig.lightColor} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            {currentConfig.title}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontWeight: 400,
                                opacity: 0.8
                            }}
                        >
                            {currentConfig.subtitle}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
                    {onRefresh && (
                        <Tooltip title="Atualizar dados">
                            <IconButton
                                onClick={onRefresh}
                                disabled={loading}
                                sx={{
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${currentConfig.color}33`,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        background: `${currentConfig.color}1A`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 15px ${currentConfig.color}4D`
                                    }
                                }}
                            >
                                <Refresh sx={{ color: currentConfig.color }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {onDownload && (
                        <Tooltip title="Baixar relatório">
                            <IconButton
                                onClick={onDownload}
                                sx={{
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${currentConfig.color}33`,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        background: `${currentConfig.color}1A`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 15px ${currentConfig.color}4D`
                                    }
                                }}
                            >
                                <Download sx={{ color: currentConfig.color }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {onShare && (
                        <Tooltip title="Compartilhar">
                            <IconButton
                                onClick={onShare}
                                sx={{
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${currentConfig.color}33`,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        background: `${currentConfig.color}1A`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 15px ${currentConfig.color}4D`
                                    }
                                }}
                            >
                                <Share sx={{ color: currentConfig.color }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Header;
