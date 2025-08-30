import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    Stack
} from '@mui/material';
import {
    TrendingUp,
    Public,
    Devices,
    PriorityHigh,
    Info,
    CheckCircle
} from '@mui/icons-material';

interface BusinessInsight {
    type: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

interface BusinessInsightsProps {
    insights: BusinessInsight[];
}

/**
 * Componente para exibir insights de negócio baseados nos dados reais da API
 * Mostra análises automáticas dos padrões encontrados nos dados
 */
export function BusinessInsights({ insights }: BusinessInsightsProps) {
    if (!insights || insights.length === 0) {
        return (
            <Alert severity="info" sx={{ m: 2 }}>
                <Typography variant="h6" gutterBottom>
                    📊 Insights não disponíveis
                </Typography>
                <Typography variant="body2">
                    Não há insights suficientes para exibir. Mais dados são necessários para gerar análises.
                </Typography>
            </Alert>
        );
    }

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'geographic': return <Public />;
            case 'audience': return <Devices />;
            case 'temporal': return <TrendingUp />;
            default: return <Info />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <PriorityHigh />;
            case 'medium': return <Info />;
            case 'low': return <CheckCircle />;
            default: return <Info />;
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                💡 Insights de Negócio
            </Typography>

            <Grid container spacing={3}>
                {insights.map((insight, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card
                            elevation={2}
                            sx={{
                                height: '100%',
                                border: `2px solid`,
                                borderColor: `${getPriorityColor(insight.priority)}.light`,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: '50%',
                                            bgcolor: `${getPriorityColor(insight.priority)}.light`,
                                            color: `${getPriorityColor(insight.priority)}.dark`
                                        }}
                                    >
                                        {getInsightIcon(insight.type)}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {insight.title}
                                        </Typography>
                                        <Chip
                                            icon={getPriorityIcon(insight.priority)}
                                            label={`Prioridade ${insight.priority.toUpperCase()}`}
                                            color={getPriorityColor(insight.priority) as any}
                                            size="small"
                                        />
                                    </Box>
                                </Stack>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.6 }}
                                >
                                    {insight.description}
                                </Typography>

                                <Box sx={{ mt: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        📈 Categoria: {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {insights.length > 0 && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    <Typography variant="body2">
                        <strong>💡 {insights.length} insights</strong> gerados automaticamente baseados nos seus dados reais.
                        Estes insights são atualizados conforme novos dados chegam.
                    </Typography>
                </Alert>
            )}
        </Box>
    );
}

export default BusinessInsights;
