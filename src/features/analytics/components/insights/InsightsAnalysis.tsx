import { Box, Typography, Alert, CircularProgress, Grid, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { useInsightsData } from '../../hooks/useInsightsData';
import { BusinessInsights } from './BusinessInsights';
import TabDescription from '@/shared/ui/base/TabDescription';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { Lightbulb, TrendingUp, Flag, Assessment } from '@mui/icons-material';
import type { InsightType, InsightPriority } from '@/types/analytics';

interface InsightsAnalysisProps {
    linkId?: string;
    globalMode?: boolean;
    showTitle?: boolean;
    title?: string;
    enableRealtime?: boolean;
    showFilters?: boolean;
    maxInsights?: number;
}

/**
 * 💡 INSIGHTS ANALYSIS - COMPONENTE INTEGRADO
 * 
 * @description
 * Componente principal do módulo de insights que usa o hook dedicado
 * useInsightsData para buscar e gerenciar insights de negócio.
 * 
 * @features
 * - Hook específico useInsightsData
 * - Filtros interativos por categoria e prioridade
 * - Métricas de confiança e impacto
 * - Insights acionáveis destacados
 * - Estatísticas em tempo real
 * 
 * @usage
 * ```tsx
 * // Insights globais com filtros
 * <InsightsAnalysis 
 *   globalMode={true}
 *   showFilters={true}
 *   maxInsights={10}
 * />
 * 
 * // Insights de link específico
 * <InsightsAnalysis 
 *   linkId="123"
 *   enableRealtime={false}
 * />
 * ```
 */
export function InsightsAnalysis({
    linkId,
    globalMode = false,
    showTitle = true,
    title = "💡 Insights de Negócio",
    enableRealtime = false,
    showFilters = true,
    maxInsights = 20
}: InsightsAnalysisProps) {

    const [selectedCategories, setSelectedCategories] = useState<InsightType[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<InsightPriority[]>([]);
    const [minConfidence, setMinConfidence] = useState(0.5);

    // Usar hook específico para dados de insights
    const {
        data,
        stats,
        loading,
        error,
        refresh,
        isRealtime
    } = useInsightsData({
        linkId,
        globalMode,
        enableRealtime,
        minConfidence,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        refreshInterval: 300000 // 5 minutos (insights não mudam frequentemente)
    });

    // Opções disponíveis
    const categoryOptions: InsightType[] = [
        'geographic', 'temporal', 'audience', 'performance',
        'conversion', 'engagement', 'optimization', 'security', 'growth'
    ];

    const priorityOptions: InsightPriority[] = ['high', 'medium', 'low'];

    // Estado de loading
    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                gap: 2
            }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Gerando insights inteligentes...
                </Typography>
            </Box>
        );
    }

    // Estado de error
    if (error) {
        return (
            <Alert
                severity="error"
                action={
                    <button onClick={refresh}>
                        Tentar Novamente
                    </button>
                }
            >
                {error}
            </Alert>
        );
    }

    // Estado sem dados
    if (!data || !data.insights.length) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    💡 Insights Indisponíveis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Não há insights suficientes com os filtros atuais.
                </Typography>
                {showFilters && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Tente reduzir a confiança mínima ou remover filtros.
                    </Typography>
                )}
            </Box>
        );
    }

    return (
        <Box>
            {/* Título e descrição */}
            {showTitle && (
                <Box sx={{ mb: 2 }}>
                    <TabDescription
                        icon="💡"
                        title={title}
                        description="Insights automáticos gerados pela análise dos seus dados com recomendações acionáveis."
                        highlight={`${data.insights.length} insights disponíveis`}
                        metadata={isRealtime ? "Tempo Real" : `Confiança ≥ ${Math.round(minConfidence * 100)}%`}
                    />
                </Box>
            )}

            {/* Filtros */}
            {showFilters && (
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Categorias</InputLabel>
                                <Select
                                    multiple
                                    value={selectedCategories}
                                    onChange={(e) => setSelectedCategories(e.target.value as InsightType[])}
                                    input={<OutlinedInput label="Categorias" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {categoryOptions.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Prioridades</InputLabel>
                                <Select
                                    multiple
                                    value={selectedPriorities}
                                    onChange={(e) => setSelectedPriorities(e.target.value as InsightPriority[])}
                                    input={<OutlinedInput label="Prioridades" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                    color={
                                                        value === 'high' ? 'error' :
                                                            value === 'medium' ? 'warning' : 'default'
                                                    }
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {priorityOptions.map((priority) => (
                                        <MenuItem key={priority} value={priority}>
                                            {priority}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Confiança Mínima</InputLabel>
                                <Select
                                    value={minConfidence}
                                    onChange={(e) => setMinConfidence(e.target.value as number)}
                                    input={<OutlinedInput label="Confiança Mínima" />}
                                >
                                    <MenuItem value={0.3}>30%</MenuItem>
                                    <MenuItem value={0.5}>50%</MenuItem>
                                    <MenuItem value={0.7}>70%</MenuItem>
                                    <MenuItem value={0.8}>80%</MenuItem>
                                    <MenuItem value={0.9}>90%</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Métricas de Insights */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Total de Insights"
                        value={stats?.totalInsights?.toString() || '0'}
                        icon={<Lightbulb />}
                        color="primary"
                        subtitle="insights gerados"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Alta Prioridade"
                        value={stats?.highPriorityCount?.toString() || '0'}
                        icon={<Flag />}
                        color="error"
                        subtitle="requerem atenção"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Acionáveis"
                        value={stats?.actionableCount?.toString() || '0'}
                        icon={<TrendingUp />}
                        color="success"
                        subtitle="podem ser implementados"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Confiança Média"
                        value={`${Math.round((stats?.avgConfidence || 0) * 100)}%`}
                        icon={<Assessment />}
                        color="info"
                        subtitle="precisão dos insights"
                    />
                </Grid>
            </Grid>

            {/* Lista de Insights */}
            <BusinessInsights
                insights={data.insights.slice(0, maxInsights)}
                showTitle={false}
                maxItems={maxInsights}
                priorityFilter={selectedPriorities.length > 0 ? selectedPriorities : undefined}
                categoryFilter={selectedCategories.length > 0 ? selectedCategories : undefined}
            />

            {/* Informações adicionais */}
            {stats && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Categoria principal: {stats.topCategory} •
                        Última geração: {new Date(stats.lastGenerated).toLocaleString()} •
                        {data.insights.length} de {stats.totalInsights} insights exibidos
                        {isRealtime && " • Atualizações automáticas ativas"}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default InsightsAnalysis;
