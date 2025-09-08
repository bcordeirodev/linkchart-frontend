import { Box, Typography, Alert, CircularProgress, Grid, Switch, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useTemporalData } from '../../hooks/useTemporalData';
import { TemporalChart } from './TemporalChart';
import { TemporalInsights } from './TemporalInsights';
import TabDescription from '@/shared/ui/base/TabDescription';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import { Schedule, TrendingUp, AccessTime, CalendarToday } from '@mui/icons-material';

interface TemporalAnalysisEnhancedProps {
    linkId?: string;
    globalMode?: boolean;
    showTitle?: boolean;
    title?: string;
    enableRealtime?: boolean;
    timeRange?: '24h' | '7d' | '30d' | '90d';
    showAdvancedControls?: boolean;
}

/**
 * ⏰ TEMPORAL ANALYSIS ENHANCED - COMPONENTE INTEGRADO
 * 
 * @description
 * Versão melhorada da análise temporal que usa o hook dedicado
 * useTemporalData para buscar e gerenciar dados temporais.
 * 
 * @features
 * - Hook específico useTemporalData
 * - Análise básica + avançada
 * - Controles de tempo interativos
 * - Detecção automática de tendências
 * - Métricas calculadas em tempo real
 * 
 * @usage
 * ```tsx
 * // Modo global com análise avançada
 * <TemporalAnalysisEnhanced 
 *   globalMode={true}
 *   timeRange="30d"
 *   showAdvancedControls={true}
 * />
 * 
 * // Link específico com realtime
 * <TemporalAnalysisEnhanced 
 *   linkId="123"
 *   enableRealtime={true}
 * />
 * ```
 */
export function TemporalAnalysisEnhanced({
    linkId,
    globalMode = false,
    showTitle = true,
    title = "⏰ Análise Temporal",
    enableRealtime = false,
    timeRange = '7d',
    showAdvancedControls = false
}: TemporalAnalysisEnhancedProps) {

    const [includeAdvanced, setIncludeAdvanced] = useState(false);

    // Usar hook específico para dados temporais
    const {
        data,
        stats,
        loading,
        error,
        refresh,
        isRealtime
    } = useTemporalData({
        linkId,
        globalMode,
        enableRealtime,
        includeAdvanced,
        timeRange,
        refreshInterval: 30000
    });

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
                    Analisando padrões temporais...
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
    if (!data) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    ⏰ Dados Temporais Indisponíveis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Não há dados temporais suficientes para análise.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Título e descrição */}
            {showTitle && (
                <Box sx={{ mb: 2 }}>
                    <TabDescription
                        icon="⏰"
                        title={title}
                        description="Análise de padrões temporais dos seus cliques com identificação de picos e tendências."
                        highlight={`Pico: ${stats?.peakHour}h - ${stats?.peakDay}`}
                        metadata={isRealtime ? "Tempo Real" : timeRange}
                    />
                </Box>
            )}

            {/* Controles avançados */}
            {showAdvancedControls && (
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeAdvanced}
                                onChange={(e) => setIncludeAdvanced(e.target.checked)}
                            />
                        }
                        label="Análise Avançada (Timezone, Sazonalidade)"
                    />
                </Box>
            )}

            {/* Métricas Temporais */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Pico de Hora"
                        value={`${stats?.peakHour}h`}
                        icon={<AccessTime />}
                        color="primary"
                        subtitle="maior atividade"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Pico de Dia"
                        value={stats?.peakDay || 'N/A'}
                        icon={<CalendarToday />}
                        color="secondary"
                        subtitle="dia mais ativo"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Média/Hora"
                        value={stats?.averageHourlyClicks?.toString() || '0'}
                        icon={<Schedule />}
                        color="info"
                        subtitle="cliques por hora"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        title="Tendência"
                        value={
                            stats?.trendDirection === 'up' ? '📈 Crescendo' :
                                stats?.trendDirection === 'down' ? '📉 Declinando' :
                                    '📊 Estável'
                        }
                        icon={<TrendingUp />}
                        color={
                            stats?.trendDirection === 'up' ? 'success' :
                                stats?.trendDirection === 'down' ? 'error' :
                                    'warning'
                        }
                        subtitle="direção atual"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Gráficos Temporais */}
                <Grid item xs={12}>
                    <TemporalChart
                        hourlyData={data.clicks_by_hour || []}
                        weeklyData={data.clicks_by_day_of_week || []}
                    />
                </Grid>

                {/* Insights Temporais */}
                <Grid item xs={12}>
                    <TemporalInsights
                        hourlyData={data.clicks_by_hour || []}
                        weeklyData={data.clicks_by_day_of_week || []}
                        stats={stats}
                        includeAdvanced={includeAdvanced}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default TemporalAnalysisEnhanced;
