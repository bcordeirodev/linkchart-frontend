'use client';

import { Grid, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { AnalyticsData } from '@/types/analytics';
import { useLinkPerformance } from '@/hooks/useLinkPerformance';

// Componentes de UI para performance
import { UnifiedMetrics } from '../metrics/UnifiedMetrics';
import { ChartCard } from '@/components/ui/ChartCard';

interface PerformanceAnalysisProps {
    data: AnalyticsData;
    linksData?: { id: number; title?: string; clicks?: number }[];
}

/**
 * Análise de performance dos links
 * Foca apenas em métricas de performance e analytics dos links
 */
export function PerformanceAnalysis({ data, linksData = [] }: PerformanceAnalysisProps) {
    const { data: performanceData, loading: performanceLoading, error: performanceError } = useLinkPerformance();

    if (performanceLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography
                        variant="h6"
                        sx={{ mt: 2 }}
                    >
                        ⚡ Carregando métricas de performance...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (performanceError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    ⚠️ Não foi possível carregar as métricas de performance. Tente novamente em alguns momentos.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header da Performance */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mb: 1, color: 'primary.main' }}
                >
                    ⚡ Performance dos Links
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Monitoramento em tempo real do desempenho e saúde dos seus links
                </Typography>
            </Box>

            {/* Métricas de Performance */}
            {performanceData?.summary ? (
                <Box sx={{ mb: 4 }}>
                    <UnifiedMetrics
                        data={data}
                        linksData={linksData}
                        performanceData={performanceData}
                        categories={['performance']}
                        showTitle={false}
                        maxCols={4}
                    />
                </Box>
            ) : (
                <Box sx={{ mb: 4 }}>
                    <Alert severity="info">
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            📊 Métricas de Performance
                        </Typography>
                        <Typography variant="body2">Carregando dados de performance...</Typography>
                    </Alert>
                </Box>
            )}

            {/* Status Resumo */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 3 }}
                >
                    🎯 Status dos Links
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <ChartCard title="✅ Status Atual">
                            <Box sx={{ p: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Taxa de Sucesso:</strong>{' '}
                                    {Math.round(performanceData?.summary?.success_rate ?? 100)}%
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Links Ativos:</strong>{' '}
                                    {performanceData?.summary?.total_links_with_traffic ?? linksData.length}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="success.main"
                                >
                                    {(performanceData?.summary?.success_rate ?? 100) >= 95
                                        ? '🟢 Excelente performance!'
                                        : '🟡 Performance satisfatória'}
                                </Typography>
                            </Box>
                        </ChartCard>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <ChartCard title="⚙️ Sistema">
                            <Box sx={{ p: 2 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Status:</strong> Online
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: 2 }}
                                >
                                    <strong>Analytics:</strong> Ativo
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="success.main"
                                >
                                    ✅ Sistema funcionando perfeitamente!
                                </Typography>
                            </Box>
                        </ChartCard>
                    </Grid>
                </Grid>
            </Box>

            {/* Insights de Performance */}
            <Box>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ mb: 3 }}
                >
                    💡 Insights de Performance
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    {/* Eficiência dos Links */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <ChartCard title="📈 Eficiência">
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2">
                                    {linksData.length > 0 ? (
                                        <>
                                            <strong>{linksData.length} links</strong> em uso.
                                            {(performanceData?.summary?.success_rate ?? 0) >= 95
                                                ? ' Performance excelente!'
                                                : ' Pode ser otimizada.'}
                                        </>
                                    ) : (
                                        'Crie seus primeiros links para ver métricas!'
                                    )}
                                </Typography>
                            </Box>
                        </ChartCard>
                    </Grid>

                    {/* Velocidade de Resposta */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <ChartCard title="⚡ Velocidade">
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2">
                                    Tempo médio: <strong>{performanceData?.summary?.avg_response_time ?? 0}ms</strong>
                                    <br />
                                    {(performanceData?.summary?.avg_response_time ?? 0) < 100
                                        ? '🚀 Resposta muito rápida!'
                                        : '✅ Resposta satisfatória'}
                                </Typography>
                            </Box>
                        </ChartCard>
                    </Grid>

                    {/* Tráfego */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <ChartCard title="📊 Tráfego 24h">
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2">
                                    <strong>{performanceData?.summary?.total_redirects_24h ?? 0}</strong>{' '}
                                    redirecionamentos
                                    <br />
                                    <strong>{performanceData?.summary?.unique_visitors ?? 0}</strong> visitantes únicos
                                </Typography>
                            </Box>
                        </ChartCard>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default PerformanceAnalysis;
