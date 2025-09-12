import { Box, Typography, Card, CardContent, Grid, Chip, Stack, LinearProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { TouchApp, TrendingUp, Star, Assessment } from '@mui/icons-material';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

interface SessionDistribution {
	session_clicks: number;
	users: number;
	percentage: number;
	avg_response_time: number;
}

interface SessionDepthData {
	avg_session_depth: number;
	max_session_depth: number;
	session_distribution: SessionDistribution[];
	power_users_count: number;
	power_users_percentage: number;
	engagement_score: number;
	session_quality: 'excellent' | 'good' | 'average' | 'low' | 'no_data';
	total_sessions: number;
}

interface SessionDepthChartProps {
	data: SessionDepthData;
	loading?: boolean;
	showTitle?: boolean;
	title?: string;
}

/**
 * 📈 SESSION DEPTH CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 *
 * Componente para visualizar análise de profundidade de sessão
 * Mostra distribuição de clicks por sessão e identifica power users
 */
export function SessionDepthChart({
	data,
	loading = false,
	showTitle = true,
	title = '📈 Análise de Profundidade de Sessão'
}: SessionDepthChartProps) {
	const theme = useTheme();

	// Configuração do gráfico de barras para distribuição de sessões
	const distributionBarOptions = {
		chart: {
			type: 'bar' as const,
			height: 350,
			toolbar: { show: false }
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				dataLabels: {
					position: 'top' as const
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val}%`,
			offsetY: -20,
			style: {
				fontSize: '12px',
				colors: [theme.palette.text.primary]
			}
		},
		xaxis: {
			categories: data.session_distribution.map(
				(item) => `${item.session_clicks} click${item.session_clicks > 1 ? 's' : ''}`
			),
			labels: {
				style: {
					colors: theme.palette.text.primary
				}
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.primary
				},
				formatter: (val: number) => `${val}%`
			}
		},
		colors: [theme.palette.primary.main],
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val: number, { dataPointIndex }: any) => {
					const item = data.session_distribution[dataPointIndex];
					return `${item.users} usuários (${val}%)`;
				}
			}
		}
	};

	const distributionBarData = [
		{
			name: 'Porcentagem de Usuários',
			data: data.session_distribution.map((item) => item.percentage)
		}
	];

	// Configuração do gráfico de área para engagement progression
	const engagementAreaOptions = {
		chart: {
			type: 'area' as const,
			height: 250,
			toolbar: { show: false },
			sparkline: { enabled: false }
		},
		stroke: {
			curve: 'smooth' as const,
			width: 3
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.1,
				stops: [0, 90, 100]
			}
		},
		dataLabels: {
			enabled: false
		},
		xaxis: {
			categories: data.session_distribution.map((item) => `${item.session_clicks}`),
			labels: {
				style: {
					colors: theme.palette.text.primary
				}
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.primary
				}
			}
		},
		colors: [theme.palette.success.main],
		tooltip: {
			theme: theme.palette.mode,
			x: {
				formatter: (val: number) => `${val} clicks por sessão`
			},
			y: {
				formatter: (val: number) => `${val} usuários`
			}
		}
	};

	const engagementAreaData = [
		{
			name: 'Usuários',
			data: data.session_distribution.map((item) => item.users)
		}
	];

	// Cor da qualidade da sessão
	const getQualityColor = (quality: string) => {
		switch (quality) {
			case 'excellent':
				return theme.palette.success.main;
			case 'good':
				return theme.palette.info.main;
			case 'average':
				return theme.palette.warning.main;
			case 'low':
				return theme.palette.error.main;
			default:
				return theme.palette.text.secondary;
		}
	};

	const getQualityLabel = (quality: string) => {
		switch (quality) {
			case 'excellent':
				return 'Excelente';
			case 'good':
				return 'Bom';
			case 'average':
				return 'Médio';
			case 'low':
				return 'Baixo';
			default:
				return 'Sem Dados';
		}
	};

	if (loading) {
		return (
			<EnhancedPaper>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography>Carregando análise de sessão...</Typography>
				</Box>
			</EnhancedPaper>
		);
	}

	if (data.total_sessions === 0) {
		return (
			<EnhancedPaper>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography color="text.secondary">Dados insuficientes para análise de sessão</Typography>
				</Box>
			</EnhancedPaper>
		);
	}

	return (
		<EnhancedPaper>
			{showTitle && (
				<Box sx={{ p: 3, pb: 0 }}>
					<Typography
						variant="h6"
						sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<TouchApp color="primary" />
						{title}
					</Typography>
				</Box>
			)}

			<Box sx={{ p: 3 }}>
				{/* Métricas Principais */}
				<Grid
					container
					spacing={2}
					sx={{ mb: 3 }}
				>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Profundidade Média"
							value={data.avg_session_depth}
							icon={<TouchApp />}
							color="primary"
							subtitle="clicks por sessão"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Score de Engajamento"
							value={data.engagement_score}
							icon={<Assessment />}
							color="success"
							subtitle="pontuação (0-100)"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Power Users"
							value={`${data.power_users_percentage}%`}
							icon={<Star />}
							color="warning"
							subtitle={`${data.power_users_count} usuários`}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Máximo de Clicks"
							value={data.max_session_depth}
							icon={<TrendingUp />}
							color="info"
							subtitle="em uma sessão"
						/>
					</Grid>
				</Grid>

				{/* Status da Qualidade */}
				<Box sx={{ mb: 3, textAlign: 'center' }}>
					<Chip
						label={`Qualidade da Sessão: ${getQualityLabel(data.session_quality)}`}
						sx={{
							backgroundColor: getQualityColor(data.session_quality),
							color: 'white',
							fontWeight: 'bold',
							fontSize: '0.9rem',
							px: 2,
							py: 1
						}}
					/>
				</Box>

				{/* Indicador de Engajamento */}
				<Box sx={{ mb: 3 }}>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								Nível de Engajamento
							</Typography>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box sx={{ flex: 1 }}>
									<LinearProgress
										variant="determinate"
										value={data.engagement_score}
										sx={{
											height: 12,
											borderRadius: 6,
											backgroundColor: alpha(theme.palette.primary.main, 0.1),
											'& .MuiLinearProgress-bar': {
												backgroundColor: getQualityColor(data.session_quality),
												borderRadius: 6
											}
										}}
									/>
								</Box>
								<Typography
									variant="h6"
									sx={{ minWidth: 60, textAlign: 'right' }}
								>
									{data.engagement_score}/100
								</Typography>
							</Box>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mt: 1 }}
							>
								Baseado na profundidade média de sessão e distribuição de usuários
							</Typography>
						</CardContent>
					</Card>
				</Box>

				{/* Gráficos */}
				<Grid
					container
					spacing={3}
				>
					{/* Gráfico de Barras - Distribuição de Sessões */}
					<Grid
						item
						xs={12}
						md={7}
					>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
								>
									Distribuição de Clicks por Sessão
								</Typography>
								<ApexChartWrapper
									options={distributionBarOptions}
									series={distributionBarData}
									type="bar"
									height={350}
								/>
							</CardContent>
						</Card>
					</Grid>

					{/* Gráfico de Área - Curva de Engajamento */}
					<Grid
						item
						xs={12}
						md={5}
					>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
								>
									Curva de Engajamento
								</Typography>
								<ApexChartWrapper
									options={engagementAreaOptions}
									series={engagementAreaData}
									type="area"
									height={250}
								/>
								<Box sx={{ mt: 2 }}>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ textAlign: 'center' }}
									>
										Usuários por nível de clicks
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Detalhes da Distribuição */}
				<Box sx={{ mt: 3 }}>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								📊 Detalhes da Distribuição
							</Typography>
							<Grid
								container
								spacing={2}
							>
								{data.session_distribution.slice(0, 6).map((item, index) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										key={index}
									>
										<Box
											sx={{
												p: 2,
												border: 1,
												borderColor: 'divider',
												borderRadius: 2,
												backgroundColor: alpha(theme.palette.primary.main, 0.05)
											}}
										>
											<Typography
												variant="subtitle2"
												sx={{ fontWeight: 'bold' }}
											>
												{item.session_clicks} Click{item.session_clicks > 1 ? 's' : ''}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{item.users} usuários ({item.percentage}%)
											</Typography>
											{item.avg_response_time > 0 && (
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Tempo médio: {item.avg_response_time.toFixed(2)}s
												</Typography>
											)}
										</Box>
									</Grid>
								))}
							</Grid>
						</CardContent>
					</Card>
				</Box>

				{/* Insights e Recomendações */}
				<Box sx={{ mt: 3 }}>
					<Card sx={{ backgroundColor: alpha(getQualityColor(data.session_quality), 0.1) }}>
						<CardContent>
							<Stack spacing={2}>
								<Typography
									variant="h6"
									sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
								>
									💡 Insights de Engajamento
								</Typography>

								<Typography variant="body1">
									<strong>Análise:</strong> Seus usuários clicam em média {data.avg_session_depth}{' '}
									vezes por sessão, com {data.power_users_percentage}% sendo power users (5+ clicks).
									A qualidade da sessão está classificada como{' '}
									<strong>{getQualityLabel(data.session_quality).toLowerCase()}</strong>.
								</Typography>

								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>Recomendação:</strong>{' '}
									{data.avg_session_depth >= 2.5
										? 'Excelente engajamento! Continue criando conteúdo de qualidade para manter os usuários interessados.'
										: 'Considere adicionar call-to-actions, links relacionados ou conteúdo interativo para aumentar o engajamento.'}
								</Typography>

								{data.power_users_percentage > 20 && (
									<Typography
										variant="body2"
										sx={{
											color: theme.palette.success.main,
											fontWeight: 'medium'
										}}
									>
										🌟 Destaque: Você tem uma base sólida de power users (
										{data.power_users_percentage}%)! Considere criar conteúdo premium ou programas
										de fidelidade.
									</Typography>
								)}
							</Stack>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</EnhancedPaper>
	);
}

export default SessionDepthChart;
