import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    Public,
    Devices,
    Schedule,
    Lightbulb,
    PriorityHigh,
    Info,
    CheckCircle
} from '@mui/icons-material';
import { BusinessInsight } from '@/features/analytics/hooks/useEnhancedAnalytics';

interface BusinessInsightsProps {
    insights: BusinessInsight[];
}

export function BusinessInsights({
    insights
}: BusinessInsightsProps) {

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <PriorityHigh color="error" />;
            case 'medium':
                return <Info color="warning" />;
            case 'low':
                return <CheckCircle color="success" />;
            default:
                return <Lightbulb color="info" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'info';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'geographic':
                return <Public />;
            case 'audience':
                return <Devices />;
            case 'temporal':
                return <Schedule />;
            case 'performance':
                return <TrendingUp />;
            default:
                return <Lightbulb />;
        }
    };

    const allInsights = insights;

    if (allInsights.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        💡 Insights de Negócio
                    </Typography>
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            color: 'text.secondary',
                        }}
                    >
                        <Lightbulb sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Insights em Preparação
                        </Typography>
                        <Typography>
                            Compartilhe seu link para receber insights personalizados sobre performance e oportunidades!
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Resumo dos Insights */}
            <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>🎯 Resumo:</strong> {allInsights.length} insights identificados -
                        {' '}{allInsights.filter(i => i.priority === 'high').length} alta prioridade,
                        {' '}{allInsights.filter(i => i.priority === 'medium').length} média prioridade
                    </Typography>
                </Alert>
            </Grid>

            {/* Lista de Insights */}
            <Grid item xs={12} lg={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            💡 Insights Identificados
                        </Typography>

                        <List>
                            {allInsights.map((insight, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            {getTypeIcon(insight.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {insight.title}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={insight.priority}
                                                        color={getPriorityColor(insight.priority) as any}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {insight.description}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    {index < allInsights.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Painel de Ações Recomendadas */}
            <Grid item xs={12} lg={4}>
                <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🚀 Ações Recomendadas
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                <strong>Próximos Passos:</strong>
                            </Typography>
                            <List dense>
                                {allInsights
                                    .filter(insight => insight.priority === 'high')
                                    .slice(0, 3)
                                    .map((insight, index) => (
                                        <ListItem key={index} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckCircle sx={{ color: 'success.contrastText', fontSize: 16 }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2">
                                                        {insight.title}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                            </List>
                        </Box>

                        <Divider sx={{ bgcolor: 'success.contrastText', opacity: 0.3, my: 2 }} />

                        <Typography variant="body2" gutterBottom>
                            <strong>💡 Dica:</strong>
                        </Typography>
                        <Typography variant="body2">
                            {allInsights.length > 0
                                ? "Continue otimizando com base nos insights para maximizar resultados!"
                                : "Compartilhe mais para obter insights mais precisos e acionáveis!"
                            }
                        </Typography>
                    </CardContent>
                </Card>


            </Grid>
        </Grid>
    );
}
