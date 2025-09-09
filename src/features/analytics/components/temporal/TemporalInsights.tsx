import { Card, CardContent, Typography, Stack, useTheme } from '@mui/material';
import type { TemporalInsightsProps } from '@/types/analytics';

/**
 * 💡 Componente de Insights Temporais
 *
 * @description
 * Componente dedicado para exibir insights e análises dos dados temporais.
 * Extraído do TemporalChart para uso independente.
 *
 * @features
 * - Análise de picos de horário
 * - Identificação de padrões semanais
 * - Insights de negócio acionáveis
 * - Recomendações baseadas em dados
 */
export function TemporalInsights({
	hourlyData,
	weeklyData,
	showAdvancedInsights: _showAdvancedInsights = true,
	showRecommendations: _showRecommendations = true
}: TemporalInsightsProps) {
	const theme = useTheme();

	// Função auxiliar para obter total de cliques
	const getTotalClicks = (data: { clicks: number }[]) => data.reduce((sum, item) => sum + item.clicks, 0);

	const hourlyTotal = getTotalClicks(hourlyData);
	const weeklyTotal = getTotalClicks(weeklyData);

	// Calcular insights temporais
	const avgClicksPerHour = hourlyTotal / 24;
	const avgClicksPerDay = weeklyTotal / 7;

	// Encontrar pico de hora
	const peakHour = hourlyData.reduce(
		(prev, current) => (current.clicks > prev.clicks ? current : prev),
		hourlyData[0] || { hour: 0, clicks: 0, label: '00:00' }
	);

	// Encontrar pico de dia
	const peakDay = weeklyData.reduce(
		(prev, current) => (current.clicks > prev.clicks ? current : prev),
		weeklyData[0] || { day: 0, clicks: 0, day_name: 'Segunda-feira' }
	);

	// Análise de horário comercial (9h às 17h)
	const businessHoursClicks = hourlyData
		.filter((item) => item.hour >= 9 && item.hour <= 17)
		.reduce((sum, item) => sum + item.clicks, 0);
	const isBusinessHoursActive = businessHoursClicks > hourlyTotal * 0.4;

	// Análise de fim de semana (sábado e domingo)
	const weekendClicks = weeklyData
		.filter((item) => item.day === 5 || item.day === 6) // Sábado e Domingo
		.reduce((sum, item) => sum + item.clicks, 0);
	const isWeekendActive = weekendClicks > weeklyTotal * 0.3;

	// Se não há dados suficientes, não mostrar insights
	if (hourlyTotal === 0 && weeklyTotal === 0) {
		return null;
	}

	return (
		<Card
			sx={{
				background:
					theme.palette.mode === 'dark'
						? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
						: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				color: 'white',
				border: 'none',
				boxShadow: theme.shadows[8]
			}}
		>
			<CardContent>
				<Typography
					variant="h6"
					gutterBottom
					sx={{
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
						gap: 1
					}}
				>
					💡 Insights Temporais
				</Typography>

				<Stack spacing={1.5}>
					{/* Insights básicos */}
					<Typography variant="body2">
						<strong>📊 Resumo:</strong> {hourlyTotal.toLocaleString()} cliques totais, média de{' '}
						{avgClicksPerHour.toFixed(1)} por hora e {avgClicksPerDay.toFixed(1)} por dia.
					</Typography>

					{/* Pico de horário */}
					{peakHour.clicks > 0 && (
						<Typography variant="body2">
							• <strong>{peakHour.label}</strong> é seu horário de pico com {peakHour.clicks} cliques.
							Programe posts importantes neste horário.
						</Typography>
					)}

					{/* Pico de dia */}
					{peakDay.clicks > 0 && (
						<Typography variant="body2">
							• <strong>{peakDay.day_name}</strong> é o dia mais ativo com {peakDay.clicks} cliques.
							Concentre lançamentos e promoções neste dia.
						</Typography>
					)}

					{/* Análise de horário comercial */}
					{isBusinessHoursActive && (
						<Typography variant="body2">
							• Seu público é ativo durante horário comercial (
							{((businessHoursClicks / hourlyTotal) * 100).toFixed(1)}% dos cliques). Foque em conteúdo
							B2B e profissional.
						</Typography>
					)}

					{!isBusinessHoursActive && hourlyTotal > 0 && (
						<Typography variant="body2">
							• Seu público é ativo fora do horário comercial. Foque em conteúdo de entretenimento e
							lifestyle.
						</Typography>
					)}

					{/* Análise de fim de semana */}
					{isWeekendActive && (
						<Typography variant="body2">
							• Boa atividade nos fins de semana ({((weekendClicks / weeklyTotal) * 100).toFixed(1)}% dos
							cliques). Mantenha conteúdo ativo nos sábados e domingos.
						</Typography>
					)}

					{!isWeekendActive && weeklyTotal > 0 && (
						<Typography variant="body2">
							• Baixa atividade nos fins de semana. Foque seus esforços nos dias úteis para melhor
							engajamento.
						</Typography>
					)}

					{/* Recomendação de consistência */}
					{hourlyTotal > 0 && weeklyTotal > 0 && (
						<Typography variant="body2">
							• <strong>💡 Dica:</strong> Mantenha consistência nos horários de maior atividade para
							maximizar o alcance e engajamento.
						</Typography>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default TemporalInsights;
