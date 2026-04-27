import { Box, Grid, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import { AccessTime, CalendarToday, TrendingUp, Star } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { MetricCardOptimized as MetricCard } from '@/shared/ui/base/MetricCardOptimized';
import type { PeakAnalysis } from '@/types';

interface PeakAnalysisCardProps {
	peakAnalysis: PeakAnalysis;
}

/**
 * Componente para exibir análise de picos temporais (do back-end)
 */
export function PeakAnalysisCard({ peakAnalysis }: PeakAnalysisCardProps) {
	const theme = useTheme();

	const { peak_hour, peak_day, peak_hour_clicks, peak_day_clicks } = peakAnalysis;

	// Formatar hora para exibição
	const formatHour = (hour: number) => {
		return `${hour.toString().padStart(2, '0')}:00`;
	};

	// Determinar período do dia
	const getPeriodOfDay = (hour: number) => {
		if (hour >= 6 && hour < 12) {
			return { label: 'Manhã', emoji: '🌅', color: 'warning' as const };
		}

		if (hour >= 12 && hour < 18) {
			return { label: 'Tarde', emoji: '☀️', color: 'info' as const };
		}

		if (hour >= 18 && hour < 22) {
			return { label: 'Noite', emoji: '🌆', color: 'primary' as const };
		}

		return { label: 'Madrugada', emoji: '🌙', color: 'secondary' as const };
	};

	const period = getPeriodOfDay(peak_hour);

	return (
		<Box>
			<Grid
				container
				spacing={3}
			>
				{/* Cards de Métricas */}
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title='Hora de Pico'
						value={formatHour(peak_hour)}
						icon={<AccessTime />}
						color='primary'
						subtitle={`${peak_hour_clicks.toLocaleString()} cliques`}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title='Dia de Pico'
						value={peak_day}
						icon={<CalendarToday />}
						color='secondary'
						subtitle={`${peak_day_clicks.toLocaleString()} cliques`}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title='Período do Dia'
						value={period.label}
						icon={<TrendingUp />}
						color={period.color}
						subtitle={period.emoji}
					/>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<MetricCard
						title='Performance'
						value={`${((peak_hour_clicks / peak_day_clicks) * 100).toFixed(1)}%`}
						icon={<Star />}
						color='success'
						subtitle='da atividade diária'
					/>
				</Grid>

				{/* Card de Insights */}
				<Grid
					item
					xs={12}
				>
					<Card
						elevation={0}
						sx={{ border: '1px solid', borderColor: 'divider' }}
					>
						<CardContent>
							<Stack>
								<Box>
									<Typography
										variant='h6'
										gutterBottom
										sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
									>
										⚡ Análise de Picos de Engajamento
									</Typography>
								</Box>

								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										md={6}
									>
										<Box
											sx={{
												p: 2,
												bgcolor: 'background.paper',
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider'
											}}
										>
											<Typography
												variant='subtitle2'
												color='primary'
												sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<AccessTime fontSize='small' />
												Horário de Maior Impacto
											</Typography>
											<Typography
												variant='h4'
												sx={{ mb: 0.5, fontWeight: 600 }}
											>
												{formatHour(peak_hour)}
											</Typography>
											<Typography variant='body2'>
												<strong>{peak_hour_clicks.toLocaleString()}</strong> cliques
												concentrados neste horário
											</Typography>
											<Stack
												direction='row'
												spacing={1}
												sx={{ mt: 1.5 }}
											>
												<Chip
													label={period.label}
													size='small'
													color={period.color}
												/>
												<Chip
													label={period.emoji}
													size='small'
													variant='outlined'
												/>
											</Stack>
										</Box>
									</Grid>

									<Grid
										item
										xs={12}
										md={6}
									>
										<Box
											sx={{
												p: 2,
												bgcolor: 'background.paper',
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider'
											}}
										>
											<Typography
												variant='subtitle2'
												color='secondary'
												sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
											>
												<CalendarToday fontSize='small' />
												Dia de Maior Engajamento
											</Typography>
											<Typography
												variant='h4'
												sx={{ mb: 0.5, fontWeight: 600 }}
											>
												{peak_day}
											</Typography>
											<Typography variant='body2'>
												<strong>{peak_day_clicks.toLocaleString()}</strong> cliques totais neste
												dia da semana
											</Typography>
											<Box sx={{ mt: 1.5 }}>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													Este é o melhor dia para lançamentos e campanhas importantes
												</Typography>
											</Box>
										</Box>
									</Grid>
								</Grid>

								{/* Recomendações */}
								<Box
									sx={{
										p: 2,
										mt: 2,
										bgcolor: 'background.paper',
										borderRadius: 1,
										border: '1px solid',
										borderColor: 'divider'
									}}
								>
									<Typography
										variant='subtitle2'
										gutterBottom
										sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
									>
										💡 Recomendações Estratégicas
									</Typography>
									<Stack spacing={0.5}>
										<Typography variant='body2'>
											• Programe posts e campanhas para <strong>{peak_day}</strong> às{' '}
											<strong>{formatHour(peak_hour)}</strong>
										</Typography>
										<Typography variant='body2'>
											• {peak_hour_clicks} cliques na hora de pico representam{' '}
											{((peak_hour_clicks / peak_day_clicks) * 100).toFixed(1)}% da atividade do
											dia
										</Typography>
										<Typography variant='body2'>
											• Foco em conteúdo de <strong>{period.label.toLowerCase()}</strong> pode
											maximizar o engajamento
										</Typography>
									</Stack>
								</Box>
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

export default PeakAnalysisCard;
