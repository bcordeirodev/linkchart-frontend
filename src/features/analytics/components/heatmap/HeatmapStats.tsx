import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack
} from '@mui/material';
import { Public, LocationOn } from '@mui/icons-material';
import type { HeatmapPoint } from '@/types';

interface HeatmapStatsProps {
    data: HeatmapPoint[];
    stats?: {
        totalPoints: number;
        totalClicks: number;
        maxClicks: number;
        topCountry: string;
        topCity: string;
        avgClicksPerPoint: number;
        coveragePercentage: number;
    };
    showDetailed?: boolean;
}

/**
 * 📊 HEATMAP STATS - ESTATÍSTICAS DO MAPA
 * 
 * @description
 * Componente responsável por exibir estatísticas agregadas do mapa de calor:
 * - Métricas principais (total de pontos, cliques, etc.)
 * - Top localizações
 * - Indicadores de cobertura
 * - Estatísticas calculadas
 * 
 * @responsibilities
 * - Calcular estatísticas em tempo real
 * - Renderizar métricas em cards
 * - Mostrar top localizações
 */
export function HeatmapStats({
    data,
    stats,
    showDetailed = true
}: HeatmapStatsProps) {

    // Calcular estatísticas se não fornecidas
    const calculatedStats = stats || {
        totalPoints: data.length,
        totalClicks: data.reduce((sum, point) => sum + point.clicks, 0),
        maxClicks: Math.max(...data.map(point => point.clicks), 0),
        topCountry: data[0]?.country || 'N/A',
        topCity: data[0]?.city || 'N/A',
        avgClicksPerPoint: data.length > 0 ?
            Math.round(data.reduce((sum, point) => sum + point.clicks, 0) / data.length) : 0,
        coveragePercentage: Math.min((data.length / 100) * 100, 100) // Estimativa
    };

    // Top 5 países por cliques
    const topCountries = data
        .reduce((acc: Record<string, number>, point) => {
            acc[point.country] = (acc[point.country] || 0) + point.clicks;
            return acc;
        }, {})
    const topCountriesArray = Object.entries(topCountries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([country, clicks]) => ({ country, clicks }));

    // Top 5 cidades por cliques
    const topCities = data
        .reduce((acc: Record<string, number>, point) => {
            const cityKey = `${point.city}, ${point.country}`;
            acc[cityKey] = (acc[cityKey] || 0) + point.clicks;
            return acc;
        }, {});
    const topCitiesArray = Object.entries(topCities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([cityCountry, clicks]) => ({ cityCountry, clicks }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📊 Estatísticas do Mapa
                </Typography>

                {/* Métricas principais */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="primary.main">
                                {calculatedStats.totalPoints}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Localizações
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="success.main">
                                {calculatedStats.totalClicks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Cliques
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="warning.main">
                                {calculatedStats.maxClicks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Máximo
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="info.main">
                                {calculatedStats.avgClicksPerPoint}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Média/Local
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {showDetailed && (
                    <>
                        {/* Top países */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                🏆 Top Países
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {topCountriesArray.map(({ country, clicks }) => (
                                    <Chip
                                        key={country}
                                        label={`${country}: ${clicks}`}
                                        size="small"
                                        variant="outlined"
                                        icon={<Public fontSize="small" />}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Top cidades */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                🏙️ Top Cidades
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {topCitiesArray.map(({ cityCountry, clicks }) => (
                                    <Chip
                                        key={cityCountry}
                                        label={`${cityCountry}: ${clicks}`}
                                        size="small"
                                        variant="outlined"
                                        icon={<LocationOn fontSize="small" />}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default HeatmapStats;
