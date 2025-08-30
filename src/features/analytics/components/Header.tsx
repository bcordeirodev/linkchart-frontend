import { Box, Typography, IconButton, Tooltip, useTheme, CircularProgress } from '@mui/material';
import { Refresh, Download, Share, Dashboard, Analytics } from '@mui/icons-material';
import PageBreadcrumb from '@/shared/ui/navigation/PageBreadcrumb';

// Styled Components
import {
    HeaderContainer,
    HeaderContent,
    HeaderDecoration,
    HeaderMainContent,
    HeaderIcon,
    HeaderTextContent,
    HeaderTitle,
    HeaderSubtitle,
    HeaderActions,
    HeaderActionButton,
    HeaderLoadingOverlay,
    HeaderWithBreadcrumb
} from './styles/Header.styled';

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
        <HeaderContainer>
            <HeaderContent variant={variant}>
                {/* Elemento decorativo de fundo */}
                <HeaderDecoration variant={variant} />

                <HeaderMainContent>
                    {/* Ícone da variante */}
                    <HeaderIcon variant={variant}>
                        {currentConfig.icon}
                    </HeaderIcon>

                    <HeaderTextContent>
                        <HeaderTitle colorVariant={variant}>
                            {currentConfig.title}
                        </HeaderTitle>
                        <HeaderSubtitle>
                            {currentConfig.subtitle}
                        </HeaderSubtitle>
                    </HeaderTextContent>
                </HeaderMainContent>

                <HeaderActions>
                    {onRefresh && (
                        <Tooltip title="Atualizar dados">
                            <HeaderActionButton
                                variant={variant}
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Refresh />
                                )}
                            </HeaderActionButton>
                        </Tooltip>
                    )}

                    {onDownload && (
                        <Tooltip title="Baixar relatório">
                            <HeaderActionButton
                                variant={variant}
                                onClick={onDownload}
                            >
                                <Download />
                            </HeaderActionButton>
                        </Tooltip>
                    )}

                    {onShare && (
                        <Tooltip title="Compartilhar">
                            <HeaderActionButton
                                variant={variant}
                                onClick={onShare}
                            >
                                <Share />
                            </HeaderActionButton>
                        </Tooltip>
                    )}
                </HeaderActions>

                {/* Loading overlay quando necessário */}
                {loading && (
                    <HeaderLoadingOverlay>
                        <CircularProgress size={24} />
                    </HeaderLoadingOverlay>
                )}
            </HeaderContent>
        </HeaderContainer>
    );
}

export default Header;
