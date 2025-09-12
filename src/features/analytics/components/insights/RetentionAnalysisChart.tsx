import { Box, Typography, Card, CardContent, Grid, Chip, Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Repeat, TrendingUp, People, Assessment } from '@mui/icons-material';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

interface RetentionData {
	return_visitor_rate: number;
	new_visitor_rate: number;
	total_visitors: number;
	return_visitors: number;
	new_visitors: number;
	retention_score: number;
	benchmark_comparison: 'excellent' | 'good' | 'average' | 'needs_improvement' | 'insufficient_data';
}

interface RetentionAnalysisChartProps {
	data: RetentionData;
	loading?: boolean;
	showTitle?: boolean;
	title?: string;
}

/**
 * 🔄 RETENTION ANALYSIS CHART - ETAPA 3: INSIGHTS ENHANCEMENTS
 *
 * Componente para visualizar análise de retenção de visitantes
 * Mostra taxa de visitantes recorrentes vs novos com benchmarks
 */
export function RetentionAnalysisChart({
	data,
	loading = false,
	showTitle = true,
	title = '🔄 Análise de Retenção'
}: RetentionAnalysisChartProps) {
	const theme = useTheme();

	// Configuração do gráfico de pizza para visitantes
	const visitorsPieOptions = {
		chart: {
			type: 'donut' as const,
			height: 300,
			toolbar: { show: false }
		},
		labels: ['Visitantes Recorrentes', 'Novos Visitantes'],
		colors: [theme.palette.success.main, theme.palette.info.main],
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val.toFixed(1)}%`
		},
		legend: {
			position: 'bottom' as const,
			labels: {
				colors: theme.palette.text.primary
			}
		},
		plotOptions: {
			pie: {
				donut: {
					size: '60%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '16px',
							color: theme.palette.text.primary
						},
						value: {
							show: true,
							fontSize: '24px',
							fontWeight: 'bold',
							color: theme.palette.text.primary,
							formatter: (val: string) => `${val}%`
						},
						total: {
							show: true,
							label: 'Retenção',
							fontSize: '14px',
							color: theme.palette.text.secondary,
							formatter: () => `${data.return_visitor_rate}%`
						}
					}
				}
			}
		},
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val: number) => `${val} visitantes`
			}
		}
	};

	const visitorsPieData = [data.return_visitors, data.new_visitors];

	// Configuração do gráfico de barras para benchmark
	const benchmarkBarOptions = {
		chart: {
			type: 'bar' as const,
			height: 200,
			toolbar: { show: false }
		},
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 4,
				dataLabels: {
					position: 'center' as const
				}
			}
		},
		dataLabels: {
			enabled: true,
			formatter: (val: number) => `${val}%`,
			style: {
				colors: ['#fff'],
				fontSize: '12px',
				fontWeight: 'bold'
			}
		},
		xaxis: {
			categories: ['Sua Taxa', 'Benchmark Médio'],
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
		colors: [
			data.benchmark_comparison === 'excellent'
				? theme.palette.success.main
				: data.benchmark_comparison === 'good'
					? theme.palette.info.main
					: data.benchmark_comparison === 'average'
						? theme.palette.warning.main
						: theme.palette.error.main,
			alpha(theme.palette.text.secondary, 0.3)
		],
		tooltip: {
			theme: theme.palette.mode,
			y: {
				formatter: (val: number) => `${val}% de retenção`
			}
		}
	};

	// Benchmark de referência da indústria
	const industryBenchmark = 20; // 20% é considerado médio
	const benchmarkBarData = [
		{
			name: 'Taxa de Retenção',
			data: [data.return_visitor_rate, industryBenchmark]
		}
	];

	// Cor do benchmark baseada na performance
	const getBenchmarkColor = (comparison: string) => {
		switch (comparison) {
			case 'excellent':
				return theme.palette.success.main;
			case 'good':
				return theme.palette.info.main;
			case 'average':
				return theme.palette.warning.main;
			case 'needs_improvement':
				return theme.palette.error.main;
			default:
				return theme.palette.text.secondary;
		}
	};

	const getBenchmarkLabel = (comparison: string) => {
		switch (comparison) {
			case 'excellent':
				return 'Excelente';
			case 'good':
				return 'Bom';
			case 'average':
				return 'Médio';
			case 'needs_improvement':
				return 'Precisa Melhorar';
			default:
				return 'Dados Insuficientes';
		}
	};

	if (loading) {
		return (
			<EnhancedPaper>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography>Carregando análise de retenção...</Typography>
				</Box>
			</EnhancedPaper>
		);
	}

	if (data.total_visitors === 0) {
		return (
			<EnhancedPaper>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography color="text.secondary">Dados insuficientes para análise de retenção</Typography>
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
						<Repeat color="primary" />
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
							title="Taxa de Retenção"
							value={`${data.return_visitor_rate}%`}
							icon={<Repeat />}
							color="success"
							subtitle="visitantes recorrentes"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Score de Retenção"
							value={data.retention_score}
							icon={<Assessment />}
							color="info"
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
							title="Visitantes Recorrentes"
							value={data.return_visitors}
							icon={<People />}
							color="primary"
							subtitle="usuários fiéis"
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
					>
						<MetricCard
							title="Total de Visitantes"
							value={data.total_visitors}
							icon={<TrendingUp />}
							color="secondary"
							subtitle="visitantes únicos"
						/>
					</Grid>
				</Grid>

				{/* Benchmark Status */}
				<Box sx={{ mb: 3, textAlign: 'center' }}>
					<Chip
						label={`Performance: ${getBenchmarkLabel(data.benchmark_comparison)}`}
						sx={{
							backgroundColor: getBenchmarkColor(data.benchmark_comparison),
							color: 'white',
							fontWeight: 'bold',
							fontSize: '0.9rem',
							px: 2,
							py: 1
						}}
					/>
				</Box>

				{/* Gráficos */}
				<Grid
					container
					spacing={3}
				>
					{/* Gráfico de Pizza - Distribuição de Visitantes */}
					<Grid
						item
						xs={12}
						md={6}
					>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ textAlign: 'center' }}
								>
									Distribuição de Visitantes
								</Typography>
								<ApexChartWrapper
									options={visitorsPieOptions}
									series={visitorsPieData}
									type="donut"
									height={300}
								/>
							</CardContent>
						</Card>
					</Grid>

					{/* Gráfico de Barras - Benchmark Comparison */}
					<Grid
						item
						xs={12}
						md={6}
					>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ textAlign: 'center' }}
								>
									Comparação com Benchmark
								</Typography>
								<ApexChartWrapper
									options={benchmarkBarOptions}
									series={benchmarkBarData}
									type="bar"
									height={200}
								/>
								<Box sx={{ mt: 2, textAlign: 'center' }}>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										Benchmark da indústria: {industryBenchmark}%
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Insights e Recomendações */}
				<Box sx={{ mt: 3 }}>
					<Card sx={{ backgroundColor: alpha(getBenchmarkColor(data.benchmark_comparison), 0.1) }}>
						<CardContent>
							<Stack spacing={2}>
								<Typography
									variant="h6"
									sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
								>
									💡 Insights de Retenção
								</Typography>

								<Typography variant="body1">
									<strong>Análise:</strong> Sua taxa de retenção de {data.return_visitor_rate}% está{' '}
									{data.benchmark_comparison === 'excellent' &&
										'muito acima da média da indústria. Excelente trabalho!'}
									{data.benchmark_comparison === 'good' &&
										'acima da média da indústria. Bom desempenho!'}
									{data.benchmark_comparison === 'average' && 'na média da indústria.'}
									{data.benchmark_comparison === 'needs_improvement' &&
										'abaixo da média da indústria.'}
								</Typography>

								<Typography
									variant="body2"
									color="text.secondary"
								>
									<strong>Recomendação:</strong>{' '}
									{data.return_visitor_rate >= 25
										? 'Continue criando conteúdo de qualidade para manter a alta lealdade dos usuários.'
										: 'Considere implementar estratégias como newsletters, notificações push ou conteúdo serializado para aumentar o retorno de visitantes.'}
								</Typography>
							</Stack>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</EnhancedPaper>
	);
}

export default RetentionAnalysisChart;
