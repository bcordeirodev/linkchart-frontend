import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { CountryData, StateData, CityData } from '@/hooks/useEnhancedAnalytics';
import ApexChartWrapper from '@/components/charts/ApexChartWrapper';
import { formatBarChart } from '@/utils/chartFormatters';
import { useTheme } from '@mui/material/styles';

interface GeographicChartProps {
    countries: CountryData[];
    states: StateData[];
    cities: CityData[];
    totalClicks: number;
}

export function GeographicChart({ countries, states, cities, totalClicks }: GeographicChartProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const getPercentage = (clicks: number) => {
        return totalClicks > 0 ? ((clicks / totalClicks) * 100).toFixed(1) : '0.0';
    };

    const getFlagEmoji = (countryCode: string) => {
        // Função simples para converter código do país em emoji da bandeira
        if (!countryCode || countryCode.length !== 2) return '🌍';

        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));

        return String.fromCodePoint(...codePoints);
    };

    return (
        <Grid container spacing={3}>
            {/* Top Países */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🌍 Top Países
                        </Typography>

                        {countries.length > 0 ? (
                            <>
                                {/* Gráfico de barras */}
                                <Box sx={{ mb: 3 }}>
                                    <ApexChartWrapper
                                        type="bar"
                                        height={300}
                                        {...formatBarChart(
                                            countries.slice(0, 8) as Record<string, unknown>[],
                                            'country',
                                            'clicks',
                                            '#1976d2',
                                            true,
                                            isDark
                                        )}
                                    />
                                </Box>

                                {/* Lista detalhada */}
                                <Box>
                                    {countries.slice(0, 10).map((country, index) => (
                                        <Box
                                            key={country.country}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                py: 1,
                                                borderBottom: index < countries.length - 1 ? '1px solid' : 'none',
                                                borderBottomColor: 'divider',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6">
                                                    {getFlagEmoji(country.iso_code)}
                                                </Typography>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {country.country}
                                                    </Typography>
                                                    {country.currency && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {country.currency}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {country.clicks} clicks
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {getPercentage(country.clicks)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    🗺️
                                </Typography>
                                <Typography>
                                    Dados geográficos aparecerão aqui após os primeiros cliques
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Top Estados */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🏛️ Top Estados/Regiões
                        </Typography>

                        {states.length > 0 ? (
                            <>
                                {/* Gráfico de barras */}
                                <Box sx={{ mb: 3 }}>
                                    <ApexChartWrapper
                                        type="bar"
                                        height={300}
                                        {...formatBarChart(
                                            states.slice(0, 8).map(state => ({
                                                ...state,
                                                label: `${state.state_name || state.state}, ${state.country}`,
                                            })),
                                            'label',
                                            'clicks',
                                            '#2e7d32',
                                            true,
                                            isDark
                                        )}
                                    />
                                </Box>

                                {/* Lista detalhada */}
                                <Box>
                                    {states.slice(0, 10).map((state, index) => (
                                        <Box
                                            key={`${state.country}-${state.state}`}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                py: 1,
                                                borderBottom: index < states.length - 1 ? '1px solid' : 'none',
                                                borderBottomColor: 'divider',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {state.state_name || state.state}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {state.country}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {state.clicks} clicks
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    🏛️
                                </Typography>
                                <Typography>
                                    Dados de estados aparecerão aqui após os primeiros cliques
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Top Cidades */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🏙️ Top Cidades
                        </Typography>

                        {cities.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {cities.slice(0, 20).map((city, index) => (
                                    <Chip
                                        key={`${city.country}-${city.state}-${city.city}`}
                                        label={`${city.city} (${city.clicks})`}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            fontSize: '0.75rem',
                                            height: 28,
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 4,
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    🏙️
                                </Typography>
                                <Typography>
                                    Dados de cidades aparecerão aqui após os primeiros cliques
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
