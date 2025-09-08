import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useGeographicData } from '../../hooks/useGeographicData';
import { GeographicChart } from './GeographicChart';
import { GeographicInsights } from './GeographicInsights';
import { GeographicMetrics } from './GeographicMetrics';
import TabDescription from '@/shared/ui/base/TabDescription';

interface GeographicAnalysisProps {
    linkId?: string;
    globalMode?: boolean;
    showTitle?: boolean;
    title?: string;
    enableRealtime?: boolean;
    minClicks?: number;
}

/**
 * 🌍 GEOGRAPHIC ANALYSIS - COMPONENTE INTEGRADO
 * 
 * @description
 * Componente principal do módulo geográfico que usa o hook dedicado
 * useGeographicData para buscar e gerenciar dados geográficos.
 * 
 * @features
 * - Hook específico useGeographicData
 * - Suporte a modo global e link específico
 * - Realtime opcional
 * - Filtros por cliques mínimos
 * - Estados de loading e error integrados
 * 
 * @usage
 * ```tsx
 * // Modo global
 * <GeographicAnalysis 
 *   globalMode={true}
 *   enableRealtime={true}
 * />
 * 
 * // Link específico
 * <GeographicAnalysis 
 *   linkId="123"
 *   minClicks={5}
 * />
 * ```
 */
export function GeographicAnalysis({
    linkId,
    globalMode = false,
    showTitle = true,
    title = "🌍 Análise Geográfica",
    enableRealtime = false,
    minClicks = 1
}: GeographicAnalysisProps) {

    // Usar hook específico para dados geográficos
    const {
        data,
        stats,
        loading,
        error,
        refresh,
        isRealtime
    } = useGeographicData({
        linkId,
        globalMode,
        enableRealtime,
        minClicks,
        includeHeatmap: true,
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
                    Carregando dados geográficos...
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
                    📍 Dados Geográficos Indisponíveis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Não há dados geográficos suficientes para análise.
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
                        icon="🌍"
                        title={title}
                        description="Distribuição global dos seus cliques com insights detalhados por países, estados e cidades."
                        highlight={`${stats?.totalCountries || 0} países alcançados`}
                        metadata={isRealtime ? "Tempo Real" : undefined}
                    />
                </Box>
            )}

            {/* Métricas Geográficas */}
            <Box sx={{ mb: 3 }}>
                <GeographicMetrics
                    data={data}
                    stats={stats}
                    showTitle={true}
                    title="🌍 Métricas Geográficas"
                />
            </Box>

            {/* Gráficos Geográficos */}
            <Box sx={{ mb: 3 }}>
                <GeographicChart
                    countries={data.top_countries || []}
                    states={data.top_states || []}
                    cities={data.top_cities || []}
                    totalClicks={stats?.topCountryClicks || 0}
                />
            </Box>

            {/* Insights Geográficos */}
            <Box>
                <GeographicInsights
                    data={data.heatmap_data || []}
                    countries={data.top_countries || []}
                    states={data.top_states || []}
                    cities={data.top_cities || []}
                />
            </Box>
        </Box>
    );
}

export default GeographicAnalysis;
