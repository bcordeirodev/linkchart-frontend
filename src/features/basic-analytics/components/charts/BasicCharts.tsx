import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';
import { formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { AppIcon } from '@/lib/icons';
import { createGlassCard, createPresetShadows, createPresetAnimations, createTextGradient } from '@/lib/theme';
import type { BasicAnalyticsData } from '../../types';

interface BasicChartsProps {
	analyticsData: BasicAnalyticsData;
}

/**
 * 📊 GRÁFICOS BÁSICOS
 *
 * Componente que renderiza gráficos básicos de dispositivos e países
 * Reutiliza componentes e formatadores do dashboard
 */
export function BasicCharts({ analyticsData }: BasicChartsProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	// Usa utilitários de tema seguindo padrão do shorter
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	// Verificar se há dados de gráficos
	if (!analyticsData.has_analytics || !analyticsData.charts) {
		return <EmptyChartsState />;
	}

	const { charts } = analyticsData;
	const hasDeviceData = charts.audience?.device_breakdown && charts.audience.device_breakdown.length > 0;
	const hasCountryData = charts.geographic?.top_countries && charts.geographic.top_countries.length > 0;

	// Se não há dados, renderizar fallback
	if (!hasDeviceData && !hasCountryData) {
		return <EmptyChartsState />;
	}

	return (
		<Box
			sx={{
				py: { xs: 2, md: 3 },
				...animations.fadeIn
			}}
		>
			<Typography
				variant="h5"
				component="h2"
				sx={{
					textAlign: 'center',
					mb: 3,
					fontWeight: 700,
					// Usa gradiente de texto padronizado seguindo padrão do shorter
					...createTextGradient(theme, 'primary'),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.5
				}}
			>
				Gráficos de Analytics
			</Typography>

			<Grid
				container
				spacing={3}
			>
				{/* Gráfico de Dispositivos */}
				{hasDeviceData && (
					<Grid
						item
						xs={12}
						md={6}
					>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								height: '100%',
								// Usa glassmorphism padronizado seguindo padrão do shorter
								...createGlassCard(theme, 'neutral'),
								boxShadow: shadows.card,
								// Usa animações padronizadas
								...animations.cardHover,
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: shadows.cardHover,
									borderColor: theme.palette.primary.main
								}
							}}
						>
							<Typography
								variant="h6"
								sx={{
									mb: 2,
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									color: 'primary.main'
								}}
							>
								<AppIcon
									name="content.mobile"
									size={20}
								/>
								Dispositivos
							</Typography>
							<Box sx={{ p: 0.5 }}>
								<ApexChartWrapper
									type="donut"
									height={300}
									{...formatPieChart(charts.audience!.device_breakdown!, 'device', 'clicks', isDark)}
								/>
							</Box>
						</Paper>
					</Grid>
				)}

				{/* Gráfico de Países */}
				{hasCountryData && (
					<Grid
						item
						xs={12}
						md={6}
					>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								height: '100%',
								// Usa glassmorphism padronizado seguindo padrão do shorter
								...createGlassCard(theme, 'neutral'),
								boxShadow: shadows.card,
								// Usa animações padronizadas
								...animations.cardHover,
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: shadows.cardHover,
									borderColor: theme.palette.success.main
								}
							}}
						>
							<Typography
								variant="h6"
								sx={{
									mb: 2,
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									color: 'success.main'
								}}
							>
								<AppIcon
									name="location.map"
									size={20}
								/>
								Top Países
							</Typography>
							<Box sx={{ p: 0.5 }}>
								<ApexChartWrapper
									type="bar"
									height={300}
									{...formatBarChart(
										charts.geographic!.top_countries!,
										'country',
										'clicks',
										theme.palette.success.main,
										true, // horizontal bars
										isDark
									)}
								/>
							</Box>
						</Paper>
					</Grid>
				)}
			</Grid>
		</Box>
	);
}

/**
 * 📊 FALLBACK PARA GRÁFICOS VAZIOS
 *
 * Componente de fallback consistente seguindo padrão visual do shorter
 */
function EmptyChartsState() {
	const theme = useTheme();
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	return (
		<Box
			sx={{
				py: { xs: 2, md: 3 },
				...animations.fadeIn
			}}
		>
			<Typography
				variant="h5"
				component="h2"
				sx={{
					textAlign: 'center',
					mb: 3,
					fontWeight: 700,
					...createTextGradient(theme, 'primary'),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.5
				}}
			>
				<AppIcon
					intent="chart"
					size={28}
					color="currentColor"
				/>
				Gráficos de Analytics
			</Typography>

			<Paper
				elevation={0}
				sx={{
					p: 4,
					textAlign: 'center',
					// Usa glassmorphism padronizado
					...createGlassCard(theme, 'neutral'),
					boxShadow: shadows.card,
					borderRadius: 3,
					background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}05 100%)`,
					border: `2px dashed ${theme.palette.divider}`
				}}
			>
				<Box
					sx={{
						display: 'inline-flex',
						p: 3,
						borderRadius: '50%',
						bgcolor: 'primary.light',
						color: 'primary.dark',
						mb: 3
					}}
				>
					<AppIcon
						intent="analytics"
						size={48}
					/>
				</Box>

				<Typography
					variant="h5"
					sx={{
						mb: 2,
						fontWeight: 600,
						color: 'text.primary'
					}}
				>
					Dados Insuficientes
				</Typography>

				<Typography
					variant="body1"
					color="text.secondary"
					sx={{
						maxWidth: 400,
						mx: 'auto',
						lineHeight: 1.6
					}}
				>
					Este link ainda não possui dados suficientes para gerar gráficos. Os gráficos aparecerão após alguns
					cliques serem registrados.
				</Typography>

				<Box
					sx={{
						mt: 4,
						display: 'flex',
						justifyContent: 'center',
						gap: 2,
						flexWrap: 'wrap'
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<AppIcon
							intent="url"
							size={16}
							color={theme.palette.info.main}
						/>
						<Typography
							variant="body2"
							color="info.main"
						>
							Dispositivos
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<AppIcon
							name="location.map"
							size={16}
							color={theme.palette.success.main}
						/>
						<Typography
							variant="body2"
							color="success.main"
						>
							Localização
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}
