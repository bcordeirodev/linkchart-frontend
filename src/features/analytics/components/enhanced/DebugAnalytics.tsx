import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Alert } from '@mui/material';
import { api } from '@/lib/api';

interface DebugAnalyticsProps {
    linkId: string;
}

export function DebugAnalytics({ linkId }: DebugAnalyticsProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('🔍 Fazendo requisição para:', `http://localhost:8000/api/test-analytics/${linkId}`);

            // Fazer requisição direta sem usar o cliente API (que adiciona autenticação)
            const response = await fetch(`http://localhost:8000/api/test-analytics/${linkId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Resposta recebida:', data);
            setData(data);
        } catch (err) {
            console.error('❌ Erro na requisição:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [linkId]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                🔧 Debug Analytics - Link {linkId}
            </Typography>

            <Button
                variant="contained"
                onClick={fetchData}
                disabled={loading}
                sx={{ mb: 3 }}
            >
                {loading ? 'Carregando...' : 'Recarregar Dados'}
            </Button>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="h6">Erro:</Typography>
                    <Typography>{error}</Typography>
                </Alert>
            )}

            {data && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📊 Dados Recebidos:
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Overview:
                            </Typography>
                            <Typography>
                                Total Clicks: {data.overview?.total_clicks || 'N/A'}
                            </Typography>
                            <Typography>
                                Países: {data.overview?.countries_reached || 'N/A'}
                            </Typography>
                            <Typography>
                                Visitantes Únicos: {data.overview?.unique_visitors || 'N/A'}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Geografia:
                            </Typography>
                            <Typography>
                                Pontos no Mapa: {data.geographic?.heatmap_data?.length || 0}
                            </Typography>
                            <Typography>
                                Top Países: {data.geographic?.top_countries?.length || 0}
                            </Typography>
                            <Typography>
                                Top Estados: {data.geographic?.top_states?.length || 0}
                            </Typography>
                            <Typography>
                                Top Cidades: {data.geographic?.top_cities?.length || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Temporal:
                            </Typography>
                            <Typography>
                                Dados por Hora: {data.temporal?.clicks_by_hour?.length || 0}
                            </Typography>
                            <Typography>
                                Dados por Dia: {data.temporal?.clicks_by_day_of_week?.length || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Audiência:
                            </Typography>
                            <Typography>
                                Dispositivos: {data.audience?.device_breakdown?.length || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Insights:
                            </Typography>
                            <Typography>
                                Total: {data.insights?.length || 0}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                                {JSON.stringify(data, null, 2)}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
