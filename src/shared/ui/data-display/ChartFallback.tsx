import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

interface ChartFallbackProps {
    height?: number;
    title?: string;
    data?: any[];
    series?: any[];
    error?: string;
}

export function ChartFallback({
    height = 350,
    title = "Gráfico",
    data = [],
    series = [],
    error
}: ChartFallbackProps) {
    // Calcular estatísticas básicas dos dados
    const getDataStats = () => {
        if (!data || data.length === 0) return null;

        const values = data.flatMap(item => {
            if (typeof item === 'number') return [item];
            if (typeof item === 'object' && item.data) return item.data;
            return [];
        });

        if (values.length === 0) return null;

        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return { sum, avg, max, min, count: values.length };
    };

    const stats = getDataStats();

    return (
        <Paper
            sx={{
                height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                textAlign: 'center',
            }}
        >
            <Typography variant="h6" gutterBottom color="text.secondary">
                📊 {title}
            </Typography>

            {error && (
                <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Visualização temporariamente indisponível
            </Typography>

            {stats && (
                <Box sx={{ width: '100%', maxWidth: 300 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        📈 Resumo dos Dados
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="h6" color="primary.main">
                                {stats.sum.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="h6" color="secondary.main">
                                {stats.avg.toFixed(1)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Média
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="h6" color="success.main">
                                {stats.max.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Máximo
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Typography variant="h6" color="warning.main">
                                {stats.min.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Mínimo
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            {series && series.length > 0 && (
                <Box sx={{ mt: 3, width: '100%', maxWidth: 300 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        📊 Séries de Dados
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {series.map((serie, index) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1,
                                bgcolor: 'background.default',
                                borderRadius: 1
                            }}>
                                <Typography variant="body2">
                                    {serie.name || `Série ${index + 1}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {Array.isArray(serie.data) ? serie.data.length : 0} pontos
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
                💡 Tente recarregar a página para restaurar a visualização
            </Typography>
        </Paper>
    );
}
