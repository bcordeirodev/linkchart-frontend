import { Box, Typography, Card, CardContent, Grid, Chip, Stack, Alert } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Traffic, TrendingUp, Diversity3, Assessment, Warning } from '@mui/icons-material';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

interface TrafficSource {
    source: string;
    clicks: number;
    percentage: number;
    avg_response_time: number;
    avg_session_depth: number;
}

interface TrafficChannel {
    channel: string;
    clicks: number;
    percentage: number;
    unique_visitors: number;
    sources: TrafficSource[];
    avg_response_time: number;
    avg_session_depth: number;
}

interface TrafficRecommendation {
    type: 'optimization' | 'growth' | 'diversification';
    message: string;
    priority: 'high' | 'medium' | 'low';
}

interface TrafficSourceData {
    sources: TrafficSource[];
    channels: TrafficChannel[];
    top_source: {
        source: string;
        clicks: number;
        percentage: number;
    } | null;
    source_diversity: number;
    total_clicks: number;
    recommendations: TrafficRecommendation[];
}

interface TrafficSourceChartProps {
    data: TrafficSourceData;
    loading?: boolean;
    showTitle?: boolean;
    title?: string;
}

/**
 * 🎯 TRAFFIC SOURCE CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 * 
 * Componente para visualizar análise de fontes de tráfego
 * Mostra categorização por canais e performance de cada fonte
 */
export function TrafficSourceChart({
    data,
    loading = false,
    showTitle = true,
    title = '🎯 Análise de Fontes de Tráfego'
}: TrafficSourceChartProps) {
    const theme = useTheme();

    // Cores para diferentes canais
    const channelColors: Record<string, string> = {
        social: theme.palette.info.main,
        search: theme.palette.success.main,
        direct: theme.palette.primary.main,
        email: theme.palette.warning.main,
        referral: theme.palette.secondary.main,
        paid: theme.palette.error.main,
        other: theme.palette.text.secondary
    };

    // Configuração do gráfico de pizza para canais
    const channelsPieOptions = {
        chart: {
            type: 'donut' as const,
            height: 350,
            toolbar: { show: false }
        },
        labels: data.channels.map(channel =>
            channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)
        ),
        colors: data.channels.map(channel => channelColors[channel.channel] || channelColors.other),
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(1)}%`
        },
        legend: {
            position: 'bottom' as const,
            labels: {
                colors: theme.palette.text.primary
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            color: theme.palette.text.primary
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            formatter: (val: string) => `${val}%`
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            color: theme.palette.text.secondary,
                            formatter: () => `${data.total_clicks} clicks`
                        }
                    }
                }
            }
        },
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (val: number, { seriesIndex }: any) => {
                    const channel = data.channels[seriesIndex];
                    return `${channel.clicks} clicks (${val.toFixed(1)}%)`;
                }
            }
        }
    };

    const channelsPieData = data.channels.map(channel => channel.percentage);

    // Configuração do gráfico de barras para performance por canal
    const performanceBarOptions = {
        chart: {
            type: 'bar' as const,
            height: 300,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                dataLabels: {
                    position: 'center' as const
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => val.toFixed(2),
            style: {
                colors: ['#fff'],
                fontSize: '12px',
                fontWeight: 'bold'
            }
        },
        xaxis: {
            categories: data.channels.map(channel =>
                channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)
            ),
            labels: {
                style: {
                    colors: theme.palette.text.primary
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.primary
                }
            }
        },
        colors: data.channels.map(channel => channelColors[channel.channel] || channelColors.other),
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (val: number) => `${val.toFixed(2)} clicks/sessão`
            }
        }
    };

    const performanceBarData = [
        {
            name: 'Profundidade Média da Sessão',
            data: data.channels.map(channel => channel.avg_session_depth)
        }
    ];

    // Configuração do gráfico de linha para diversidade
    const diversityLineOptions = {
        chart: {
            type: 'line' as const,
            height: 200,
            toolbar: { show: false },
            sparkline: { enabled: true }
        },
        stroke: {
            curve: 'smooth' as const,
            width: 3
        },
        colors: [theme.palette.primary.main],
        tooltip: {
            theme: theme.palette.mode
        }
    };

    // Simular dados de diversidade ao longo do tempo (seria vindo da API)
    const diversityLineData = [
        {
            name: 'Diversidade de Fontes',
            data: [1, 2, 2, 3, data.source_diversity, data.source_diversity] // Simulação
        }
    ];

    // Função para obter cor da prioridade
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.info.main;
            default: return theme.palette.text.secondary;
        }
    };

    // Função para obter ícone da recomendação
    const getRecommendationIcon = (type: string) => {
        switch (type) {
            case 'optimization': return '⚡';
            case 'growth': return '📈';
            case 'diversification': return '🎯';
            default: return '💡';
        }
    };

    if (loading) {
        return (
            <EnhancedPaper>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Carregando análise de fontes...</Typography>
                </Box>
            </EnhancedPaper>
        );
    }

    if (data.sources.length === 0) {
        return (
            <EnhancedPaper>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Dados insuficientes para análise de fontes de tráfego
                    </Typography>
                </Box>
            </EnhancedPaper>
        );
    }

    return (
        <EnhancedPaper>
            {showTitle && (
                <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Traffic color="primary" />
                        {title}
                    </Typography>
                </Box>
            )}

            <Box sx={{ p: 3 }}>
                {/* Métricas Principais */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Fonte Principal"
                            value={data.top_source?.source || 'N/A'}
                            icon={<TrendingUp />}
                            color="primary"
                            subtitle={`${data.top_source?.percentage || 0}% do tráfego`}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Diversidade"
                            value={data.source_diversity}
                            icon={<Diversity3 />}
                            color="info"
                            subtitle="fontes diferentes"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Total de Clicks"
                            value={data.total_clicks}
                            icon={<Assessment />}
                            color="success"
                            subtitle="todos os canais"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Canais Ativos"
                            value={data.channels.length}
                            icon={<Traffic />}
                            color="secondary"
                            subtitle="categorias"
                        />
                    </Grid>
                </Grid>

                {/* Alertas de Diversidade */}
                {data.source_diversity < 3 && (
                    <Box sx={{ mb: 3 }}>
                        <Alert
                            severity="warning"
                            icon={<Warning />}
                            sx={{ borderRadius: 2 }}
                        >
                            <Typography variant="body2">
                                <strong>Baixa diversidade de fontes!</strong> Você tem apenas {data.source_diversity} fonte
                                {data.source_diversity > 1 ? 's' : ''} de tráfego.
                                Considere diversificar para reduzir riscos de dependência.
                            </Typography>
                        </Alert>
                    </Box>
                )}

                {/* Gráficos Principais */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Gráfico de Pizza - Distribuição por Canais */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                                    Distribuição por Canais
                                </Typography>
                                <ApexChartWrapper
                                    options={channelsPieOptions}
                                    series={channelsPieData}
                                    type="donut"
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Gráfico de Barras - Performance por Canal */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                                    Engajamento por Canal
                                </Typography>
                                <ApexChartWrapper
                                    options={performanceBarOptions}
                                    series={performanceBarData}
                                    type="bar"
                                    height={300}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                                    Profundidade média da sessão por canal
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Detalhes dos Canais */}
                <Box sx={{ mb: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                📊 Performance Detalhada por Canal
                            </Typography>
                            <Grid container spacing={2}>
                                {data.channels.map((channel, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                border: 1,
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                backgroundColor: alpha(channelColors[channel.channel] || channelColors.other, 0.1)
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        backgroundColor: channelColors[channel.channel] || channelColors.other
                                                    }}
                                                />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                    {channel.channel}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {channel.clicks} clicks ({channel.percentage.toFixed(1)}%)
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {channel.unique_visitors} visitantes únicos
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Sessão: {channel.avg_session_depth.toFixed(2)} clicks
                                            </Typography>
                                            {channel.avg_response_time > 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Tempo: {channel.avg_response_time.toFixed(2)}s
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>

                {/* Top Sources */}
                <Box sx={{ mb: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                🏆 Top 5 Fontes Individuais
                            </Typography>
                            <Grid container spacing={1}>
                                {data.sources.slice(0, 5).map((source, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.5,
                                                border: 1,
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                                backgroundColor: index === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                    {index + 1}. {source.source}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Sessão: {source.avg_session_depth.toFixed(2)} clicks
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {source.clicks} clicks
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {source.percentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>

                {/* Recomendações */}
                {data.recommendations.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    💡 Recomendações Estratégicas
                                </Typography>
                                <Stack spacing={2}>
                                    {data.recommendations.map((rec, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                p: 2,
                                                border: 1,
                                                borderColor: getPriorityColor(rec.priority),
                                                borderRadius: 2,
                                                backgroundColor: alpha(getPriorityColor(rec.priority), 0.1)
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                <Typography sx={{ fontSize: '1.2rem' }}>
                                                    {getRecommendationIcon(rec.type)}
                                                </Typography>
                                                <Box sx={{ flex: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                        <Chip
                                                            label={rec.priority.toUpperCase()}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getPriorityColor(rec.priority),
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                height: 20
                                                            }}
                                                        />
                                                        <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                                                            {rec.type}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2">
                                                        {rec.message}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>
        </EnhancedPaper>
    );
}

export default TrafficSourceChart;
