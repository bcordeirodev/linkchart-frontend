import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    CardContent,
    Grid,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Divider,
    Stack
} from '@mui/material';
import {
    Analytics as AnalyticsIcon,
    Link as LinkIcon,
    Schedule as ScheduleIcon,
    Visibility as VisibilityIcon,
    Launch as LaunchIcon,
    Home as HomeIcon
} from '@mui/icons-material';

// Components
import { PublicLayout } from '@/shared/layout';
import { MetricCardOptimized } from '@/shared/ui/base';
import { EnhancedPaper } from '@/shared/ui/base';

// Services
import { api } from '@/lib/api/client';

// Types
interface BasicAnalyticsData {
    total_clicks: number;
    created_at: string;
    is_active: boolean;
    short_url: string;
    has_analytics: boolean;
}

interface LinkData {
    id: number;
    slug: string;
    title: string | null;
    original_url: string;
    short_url: string;
    clicks: number;
    is_active: boolean;
    created_at: string;
    expires_at: string | null;
    is_public: boolean;
    has_analytics: boolean;
    domain: string;
}

/**
 * Página de Analytics Básicos Públicos
 * 
 * FUNCIONALIDADE:
 * - Exibe analytics básicos de um link público
 * - Não requer autenticação
 * - Layout público com informações limitadas
 * - Redireciona para página de encurtamento
 */
function BasicAnalyticsPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [linkData, setLinkData] = useState<LinkData | null>(null);
    const [analyticsData, setAnalyticsData] = useState<BasicAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        if (!slug) {
            setError('Slug do link não fornecido');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('🔍 BasicAnalytics: Iniciando busca de dados para slug:', slug);

                // Buscar informações do link
                const [linkResponse, analyticsResponse] = await Promise.all([
                    api.get(`/api/public/link/${slug}`),
                    api.get(`/api/public/analytics/${slug}`)
                ]);

                console.log('🔍 BasicAnalytics: Resposta do link:', linkResponse);
                console.log('🔍 BasicAnalytics: Resposta do analytics:', analyticsResponse);
                console.log('🔍 BasicAnalytics: linkResponse.data:', (linkResponse as any).data);
                console.log('🔍 BasicAnalytics: analyticsResponse.data:', (analyticsResponse as any).data);

                const linkDataResult = (linkResponse as any).data;
                const analyticsDataResult = (analyticsResponse as any).data;

                console.log('🔍 BasicAnalytics: Definindo linkData:', linkDataResult);
                console.log('🔍 BasicAnalytics: Definindo analyticsData:', analyticsDataResult);

                // Validação adicional
                if (!linkDataResult || !linkDataResult.slug) {
                    console.error('❌ BasicAnalytics: linkDataResult inválido:', linkDataResult);
                    setError('Dados do link inválidos');
                    return;
                }

                if (!analyticsDataResult) {
                    console.error('❌ BasicAnalytics: analyticsDataResult inválido:', analyticsDataResult);
                    setError('Dados de analytics inválidos');
                    return;
                }

                setLinkData(linkDataResult);
                setAnalyticsData(analyticsDataResult);
                setDebugInfo(`Dados carregados: Link ID ${linkDataResult.id}, Slug ${linkDataResult.slug}, Clicks ${analyticsDataResult.total_clicks}`);

                console.log('✅ BasicAnalytics: Dados definidos com sucesso');
                console.log('✅ BasicAnalytics: linkData final:', linkDataResult);
                console.log('✅ BasicAnalytics: analyticsData final:', analyticsDataResult);
            } catch (err: any) {
                console.error('❌ BasicAnalytics: Erro ao buscar dados:', err);
                console.error('❌ BasicAnalytics: Erro response:', err.response);
                setError(err.response?.data?.message || 'Erro ao carregar dados do link');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleCreateLink = () => {
        navigate('/shorter');
    };

    const handleVisitLink = () => {
        if (linkData?.original_url) {
            window.open(linkData.original_url, '_blank');
        }
    };

    if (loading) {
        return (
            <PublicLayout>
                <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Carregando analytics do link...
                    </Typography>
                </Container>
            </PublicLayout>
        );
    }

    // Debug da condição de renderização
    console.log('🔍 BasicAnalytics: Verificando condições de renderização:');
    console.log('🔍 BasicAnalytics: error:', error);
    console.log('🔍 BasicAnalytics: linkData:', linkData);
    console.log('🔍 BasicAnalytics: analyticsData:', analyticsData);
    console.log('🔍 BasicAnalytics: !linkData:', !linkData);
    console.log('🔍 BasicAnalytics: !analyticsData:', !analyticsData);

    if (error || !linkData || !analyticsData) {
        console.log('❌ BasicAnalytics: Mostrando erro - condições:', {
            hasError: !!error,
            noLinkData: !linkData,
            noAnalyticsData: !analyticsData
        });

        return (
            <PublicLayout>
                <Container maxWidth="md" sx={{ py: 8 }}>
                    <Alert
                        severity="error"
                        sx={{ mb: 4 }}
                        action={
                            <Button color="inherit" onClick={handleCreateLink}>
                                Criar Link
                            </Button>
                        }
                    >
                        {error || 'Link não encontrado'}
                        {debugInfo && (
                            <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.7 }}>
                                Debug: {debugInfo}
                            </div>
                        )}
                    </Alert>

                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            startIcon={<HomeIcon />}
                            onClick={handleCreateLink}
                            size="large"
                        >
                            Voltar ao Encurtador
                        </Button>
                    </Box>
                </Container>
            </PublicLayout>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <PublicLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        📊 Analytics Básicos
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Estatísticas públicas do seu link encurtado
                    </Typography>
                </Box>

                {/* Link Info Card */}
                <EnhancedPaper variant="glass" sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">
                                Informações do Link
                            </Typography>
                            {linkData.is_public && (
                                <Chip
                                    label="Público"
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Título:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {linkData.title || 'Sem título'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Domínio de destino:
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {linkData.domain}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    URL curta:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: 'monospace',
                                            backgroundColor: 'grey.100',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        {linkData.short_url}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<LaunchIcon />}
                                        onClick={handleVisitLink}
                                    >
                                        Visitar
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </EnhancedPaper>

                {/* Metrics */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCardOptimized
                            title="Total de Cliques"
                            value={analyticsData.total_clicks.toLocaleString()}
                            icon={<VisibilityIcon />}
                            color="primary"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCardOptimized
                            title="Status"
                            value={analyticsData.is_active ? 'Ativo' : 'Inativo'}
                            icon={<AnalyticsIcon />}
                            color={analyticsData.is_active ? 'success' : 'error'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCardOptimized
                            title="Criado em"
                            value={formatDate(analyticsData.created_at).split(' às ')[0]}
                            subtitle={formatDate(analyticsData.created_at).split(' às ')[1]}
                            icon={<ScheduleIcon />}
                            color="info"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCardOptimized
                            title="Analytics"
                            value={analyticsData.has_analytics ? 'Disponível' : 'Sem dados'}
                            icon={<AnalyticsIcon />}
                            color={analyticsData.has_analytics ? 'success' : 'warning'}
                        />
                    </Grid>
                </Grid>

                {/* Analytics Info */}
                <EnhancedPaper variant="glass">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📈 Sobre os Analytics
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {analyticsData.has_analytics ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Este link já possui dados de analytics! Para ver relatórios detalhados,
                                crie uma conta gratuita.
                            </Alert>
                        ) : (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                Este link ainda não possui cliques. Os analytics aparecerão após o primeiro acesso.
                            </Alert>
                        )}

                        <Typography variant="body2" color="text.secondary" paragraph>
                            • <strong>Analytics Básicos:</strong> Disponíveis publicamente para todos os links
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            • <strong>Analytics Avançados:</strong> Gráficos detalhados, localização, dispositivos (requer conta)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            • <strong>Histórico Completo:</strong> Dados históricos e exportação (requer conta)
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                startIcon={<LinkIcon />}
                                onClick={handleCreateLink}
                                size="large"
                            >
                                Criar Meu Link
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/sign-up')}
                                size="large"
                            >
                                Criar Conta Gratuita
                            </Button>
                        </Stack>
                    </CardContent>
                </EnhancedPaper>
            </Container>
        </PublicLayout>
    );
}

export default BasicAnalyticsPage;
