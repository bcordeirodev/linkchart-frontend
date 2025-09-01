/**
 * 🦶 FOOTER COMPONENT - LINK CHART
 * Componente de rodapé da aplicação
 * 
 * @description
 * Footer responsivo com informações da aplicação, links úteis e copyright.
 * Integra com o sistema de temas para consistência visual.
 * 
 * @features
 * - ✅ Design responsivo
 * - ✅ Integração com temas
 * - ✅ Links úteis
 * - ✅ Informações de copyright
 * - ✅ Estilo minimalista
 * 
 * @since 2.0.0
 */

import {
    Box,
    Container,
    Typography,
    Link,
    useTheme,
    alpha
} from '@mui/material';
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material';

/**
 * Props do componente Footer
 */
interface FooterProps {
    /** Estilo do footer */
    style?: 'fixed' | 'static' | 'sticky';
}

/**
 * Componente de rodapé da aplicação
 */
export function Footer({ style = 'static' }: FooterProps) {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    const footerSx = {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        py: 3,
        mt: 'auto',
        ...(style === 'fixed' && {
            position: 'fixed' as const,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar - 1
        }),
        ...(style === 'sticky' && {
            position: 'sticky' as const,
            bottom: 0
        })
    };

    return (
        <Box component="footer" sx={footerSx}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    {/* Copyright */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: { xs: 'center', md: 'left' } }}
                    >
                        © {currentYear} Link Chart. Todos os direitos reservados.
                    </Typography>

                    {/* Links */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            alignItems: 'center'
                        }}
                    >
                        <Link
                            href="/privacy"
                            color="text.secondary"
                            underline="hover"
                            variant="body2"
                        >
                            Privacidade
                        </Link>
                        <Link
                            href="/terms"
                            color="text.secondary"
                            underline="hover"
                            variant="body2"
                        >
                            Termos
                        </Link>
                        <Link
                            href="/support"
                            color="text.secondary"
                            underline="hover"
                            variant="body2"
                        >
                            Suporte
                        </Link>
                    </Box>

                    {/* Social Links */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.5,
                                borderRadius: 1,
                                '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <GitHub fontSize="small" />
                        </Link>
                        <Link
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.5,
                                borderRadius: 1,
                                '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <LinkedIn fontSize="small" />
                        </Link>
                        <Link
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="text.secondary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.5,
                                borderRadius: 1,
                                '&:hover': {
                                    color: 'primary.main',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <Twitter fontSize="small" />
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
