/**
 * 🌐 PUBLIC LAYOUT - LINK CHART
 * Layout para páginas públicas (não autenticadas)
 *
 * @description
 * Layout otimizado para páginas públicas como landing page,
 * encurtador público, etc. Sem navbar/footer complexos.
 *
 * @features
 * - Design limpo e moderno
 * - Otimizado para conversão
 * - Responsivo mobile-first
 * - Suporte a temas
 */

import { useMemo, ReactNode } from 'react';
import { Box, useTheme, Container } from '@mui/material';
import { useMainTheme, useResponsive } from '@/lib/theme';
import { Layout } from './core';

interface PublicLayoutProps {
    /** Conteúdo da página */
    children: ReactNode;
    /** Mostrar header simples */
    showHeader?: boolean;
    /** Mostrar footer simples */
    showFooter?: boolean;
    /** Variante visual */
    variant?: 'landing' | 'shorter' | 'simple';
    /** Classe CSS adicional */
    className?: string;
}

/**
 * Layout público otimizado para páginas não autenticadas
 */
function PublicLayout({
    children,
    showHeader = false,
    showFooter = false,
    variant = 'simple',
    className
}: PublicLayoutProps) {
    const theme = useTheme();
    const mainTheme = useMainTheme();
    const { isMobile } = useResponsive();

    // Configurações do layout baseadas na variante
    const layoutConfig = useMemo(() => {
        const configs = {
            landing: {
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
                showPattern: true,
                containerMaxWidth: 'xl' as const
            },
            shorter: {
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                showPattern: false,
                containerMaxWidth: 'lg' as const
            },
            simple: {
                background: theme.palette.background.default,
                showPattern: false,
                containerMaxWidth: 'md' as const
            }
        };
        return configs[variant];
    }, [variant, theme]);

    // Layout personalizado para páginas públicas
    const publicLayouts = useMemo(
        () => ({
            layout1: ({ children }: { children: ReactNode }) => (
                <Box
                    className={className}
                    sx={{
                        minHeight: '100vh',
                        width: '100vw',
                        margin: 0,
                        padding: 0,
                        background: layoutConfig.background,
                        color: theme.palette.text.primary,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        // Transições suaves
                        transition: theme.transitions.create(['background-color', 'color'], {
                            duration: theme.transitions.duration.standard
                        })
                    }}
                >
                    {/* Padrão decorativo de fundo */}
                    {layoutConfig.showPattern && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                opacity: 0.05,
                                backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.primary.light} 0%, transparent 50%),
								                 radial-gradient(circle at 75% 75%, ${theme.palette.secondary.light} 0%, transparent 50%)`,
                                pointerEvents: 'none'
                            }}
                        />
                    )}

                    {/* Header simples (opcional) */}
                    {showHeader && (
                        <Box
                            component="header"
                            sx={{
                                position: 'relative',
                                zIndex: 10,
                                py: 2,
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Container maxWidth={layoutConfig.containerMaxWidth}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* Logo/Brand placeholder */}
                                    <Box sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Link Chart</Box>
                                </Box>
                            </Container>
                        </Box>
                    )}

                    {/* Conteúdo principal */}
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            minHeight: showHeader || showFooter ? 'calc(100vh - 120px)' : '100vh'
                        }}
                    >
                        {children}
                    </Box>

                    {/* Footer simples (opcional) */}
                    {showFooter && (
                        <Box
                            component="footer"
                            sx={{
                                position: 'relative',
                                zIndex: 10,
                                py: 3,
                                borderTop: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.background.paper
                            }}
                        >
                            <Container maxWidth={layoutConfig.containerMaxWidth}>
                                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                    © 2024 Link Chart. Todos os direitos reservados.
                                </Box>
                            </Container>
                        </Box>
                    )}
                </Box>
            )
        }),
        [theme, mainTheme, className, layoutConfig, showHeader, showFooter, isMobile]
    );

    return (
        <Layout
            layouts={publicLayouts}
            settings={{
                style: 'layout1' as const,
                config: {
                    navbar: { display: false, folded: false, position: 'left' },
                    toolbar: { display: false, style: 'static' },
                    footer: { display: false, style: 'static' }
                }
            }}
        >
            {children}
        </Layout>
    );
}

export default PublicLayout;
