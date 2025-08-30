import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, Link as LinkIcon, Speed, Security } from '@mui/icons-material';

/**
 * Estatísticas da página shorter
 * Componentizado seguindo padrão do projeto
 */
export function ShorterStats() {
    const theme = useTheme();

    const stats = [
        {
            icon: <LinkIcon />,
            title: '1M+',
            subtitle: 'Links Encurtados',
            color: 'primary'
        },
        {
            icon: <TrendingUp />,
            title: '50M+',
            subtitle: 'Cliques Processados',
            color: 'success'
        },
        {
            icon: <Speed />,
            title: '<100ms',
            subtitle: 'Tempo de Resposta',
            color: 'info'
        },
        {
            icon: <Security />,
            title: '99.9%',
            subtitle: 'Uptime Garantido',
            color: 'warning'
        }
    ];

    return (
        <Box sx={{ py: { xs: 4, md: 6 } }}>
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    textAlign: 'center',
                    mb: 4,
                    fontWeight: 700,
                    color: 'text.primary'
                }}
            >
                📈 Números que Impressionam
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {stats.map((stat, index) => (
                    <Grid item xs={6} md={3} key={index}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                height: '100%',
                                background: `linear-gradient(135deg, 
                                    ${theme.palette.background.paper} 0%, 
                                    ${theme.palette.action.hover} 100%
                                )`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                    borderColor: `${stat.color}.main`
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: `${stat.color}.light`,
                                    color: `${stat.color}.dark`,
                                    mb: 2
                                }}
                            >
                                {stat.icon}
                            </Box>

                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 800,
                                    color: `${stat.color}.main`,
                                    mb: 1
                                }}
                            >
                                {stat.title}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                            >
                                {stat.subtitle}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ShorterStats;
