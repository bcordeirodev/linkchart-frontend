import { Box, Card, CardContent, Chip, Grid, Stack, Typography, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { formatBarChart, formatPieChart } from '@/features/analytics/utils/chartFormatters';
import { getStandardChartColors } from '@/lib/theme';
import ApexChartWrapper from '@/shared/ui/data-display/ApexChartWrapper';

import type { DeviceData, BrowserData, OSData, DevicePerformanceData, LanguageData } from '@/types';

interface AudienceChartProps {
	deviceBreakdown: DeviceData[];
	browserBreakdown?: any[];
	osBreakdown?: any[];
	totalClicks: number;
	height?: number;
	showPieChart?: boolean;
	showBarChart?: boolean;
	// NEW: Enhanced data props
	browsers?: BrowserData[];
	operatingSystems?: OSData[];
	devicePerformance?: DevicePerformanceData[];
	languages?: LanguageData[];
}

export function AudienceChart({
	deviceBreakdown,
	browserBreakdown: _browserBreakdown,
	osBreakdown: _osBreakdown,
	totalClicks,
	height: _height = 400,
	showPieChart: _showPieChart = true,
	showBarChart: _showBarChart = true,
	// NEW: Enhanced props
	browsers,
	operatingSystems,
	devicePerformance,
	languages
}: AudienceChartProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const [activeTab, setActiveTab] = useState(0);

	// Cores padronizadas usando novo sistema
	const chartColors = getStandardChartColors(theme);

	// Calcular estatísticas
	const totalDevices = deviceBreakdown.reduce((sum, device) => sum + device.clicks, 0);
	const primaryDevice =
		deviceBreakdown.length > 0
			? deviceBreakdown.reduce((max, device) => (device.clicks > max.clicks ? device : max), deviceBreakdown[0])
			: { device: '--', clicks: 0 };

	// Preparar dados para gráficos existentes
	const deviceChartData = deviceBreakdown.map((device) => ({
		name: device.device,
		value: device.clicks,
		percentage: ((device.clicks / totalClicks) * 100).toFixed(1)
	}));

	// NEW: Preparar dados para gráficos enhanced
	const browserChartData =
		browsers?.map((browser) => ({
			name: `${browser.browser} ${browser.version || ''}`.trim(),
			value: browser.clicks,
			percentage: browser.percentage || 0
		})) || [];

	const osChartData =
		operatingSystems?.map((os) => ({
			name: `${os.os} ${os.version || ''}`.trim(),
			value: os.clicks,
			percentage: os.percentage || 0
		})) || [];

	const performanceChartData =
		devicePerformance?.map((perf) => ({
			name: perf.device,
			value: perf.avg_response_time,
			clicks: perf.total_clicks
		})) || [];

	const languageChartData =
		languages?.map((lang) => ({
			name: lang.language,
			value: lang.clicks,
			percentage: lang.percentage
		})) || [];

	// Verificar se há dados enhanced disponíveis
	const hasEnhancedData =
		browsers?.length || operatingSystems?.length || devicePerformance?.length || languages?.length;

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	return (
		<Box sx={{ p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
			<Typography
				variant='h6'
				gutterBottom
				sx={{
					position: 'relative',
					zIndex: 1,
					mb: 3,
					display: 'flex',
					alignItems: 'center',
					gap: 1
				}}
			>
				👥 Análise de Audiência
				<Chip
					label={`${totalClicks} cliques`}
					size='small'
					color='primary'
					variant='outlined'
				/>
			</Typography>

			{/* NEW: Tabs para análises enhanced (se dados disponíveis) */}
			{hasEnhancedData ? (
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
					>
						<Tab label='📱 Dispositivos' />
						<Tab
							label='🌐 Navegadores'
							disabled={!browsers?.length}
						/>
						<Tab
							label='💻 Sistemas'
							disabled={!operatingSystems?.length}
						/>
						<Tab
							label='⚡ Performance'
							disabled={!devicePerformance?.length}
						/>
						<Tab
							label='🌍 Idiomas'
							disabled={!languages?.length}
						/>
					</Tabs>
				</Box>
			) : null}

			{/* Tab 0: Dispositivos (Conteúdo original) */}
			{(!hasEnhancedData || activeTab === 0) && (
				<>
					{/* Estatísticas rápidas */}
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
							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Typography
										variant='h4'
										color='primary'
										gutterBottom
									>
										{totalDevices}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										Dispositivos Detectados
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
						>
							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Typography
										variant='h4'
										color='secondary'
										gutterBottom
									>
										{primaryDevice?.device || 'N/A'}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										Dispositivo Principal
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
						>
							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Typography
										variant='h4'
										color='info'
										gutterBottom
									>
										{deviceBreakdown.length}
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										Tipos de Dispositivo
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
						>
							<Card>
								<CardContent sx={{ textAlign: 'center' }}>
									<Typography
										variant='h4'
										color='success'
										gutterBottom
									>
										{primaryDevice ? ((primaryDevice.clicks / totalClicks) * 100).toFixed(1) : '0'}%
									</Typography>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										Dominância Principal
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>

					{/* Gráficos */}
					<Grid
						container
						spacing={3}
					>
						{/* Distribuição por Dispositivo */}
						<Grid
							item
							xs={12}
							md={6}
						>
							<Card>
								<CardContent>
									<Typography
										variant='h6'
										gutterBottom
										sx={{
											position: 'relative',
											zIndex: 1,
											mt: 1
										}}
									>
										📱 Distribuição por Dispositivo
									</Typography>
									<ApexChartWrapper
										type='pie'
										height={300}
										{...formatPieChart(deviceChartData, 'name', 'value', isDark)}
									/>
								</CardContent>
							</Card>
						</Grid>

						{/* Ranking de Dispositivos */}
						<Grid
							item
							xs={12}
							md={6}
						>
							<Card>
								<CardContent>
									<Typography
										variant='h6'
										gutterBottom
										sx={{
											position: 'relative',
											zIndex: 1,
											mt: 1
										}}
									>
										🏆 Ranking de Dispositivos
									</Typography>
									<ApexChartWrapper
										type='bar'
										height={300}
										{...formatBarChart(
											deviceChartData,
											'name',
											'value',
											chartColors.primary.main,
											true,
											isDark
										)}
									/>
								</CardContent>
							</Card>
						</Grid>
					</Grid>

					{/* Detalhes dos Dispositivos */}
					<Card sx={{ mt: 3 }}>
						<CardContent>
							<Typography
								variant='h6'
								gutterBottom
								sx={{
									position: 'relative',
									zIndex: 1,
									mt: 1
								}}
							>
								📊 Detalhes por Dispositivo
							</Typography>

							<Stack spacing={2}>
								{deviceBreakdown.map((device, index) => (
									<Box
										key={device.device}
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											p: 2,
											bgcolor: 'background.paper',
											borderRadius: 1,
											border: '1px solid',
											borderColor: 'divider'
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
											<Chip
												label={index + 1}
												color={index === 0 ? 'primary' : 'default'}
												size='small'
											/>
											<Box>
												<Typography
													variant='subtitle2'
													fontWeight='bold'
												>
													{device.device}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{((device.clicks / totalClicks) * 100).toFixed(1)}% do total
												</Typography>
											</Box>
										</Box>
										<Box sx={{ textAlign: 'right' }}>
											<Typography
												variant='h6'
												color='primary'
											>
												{device.clicks}
											</Typography>
											<Typography
												variant='caption'
												color='text.secondary'
											>
												cliques
											</Typography>
										</Box>
									</Box>
								))}
							</Stack>
						</CardContent>
					</Card>
				</>
			)}

			{/* NEW: Tab 1 - Navegadores */}
			{hasEnhancedData && activeTab === 1 && browsers ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									🌐 Market Share de Navegadores
								</Typography>
								<ApexChartWrapper
									type='pie'
									{...formatPieChart(browserChartData, 'name', 'value', isDark)}
									height={350}
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									Top Navegadores
								</Typography>
								<Stack spacing={2}>
									{browsers.slice(0, 5).map((browser) => (
										<Box
											key={`${browser.browser}-${browser.version}`}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												p: 1,
												bgcolor: 'background.paper',
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider'
											}}
										>
											<Box>
												<Typography variant='subtitle2'>{browser.browser}</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{browser.version}
												</Typography>
											</Box>
											<Box sx={{ textAlign: 'right' }}>
												<Typography
													variant='body2'
													fontWeight='bold'
												>
													{browser.clicks}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{browser.percentage?.toFixed(1)}%
												</Typography>
											</Box>
										</Box>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 2 - Sistemas Operacionais */}
			{hasEnhancedData && activeTab === 2 && operatingSystems ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									💻 Distribuição de Sistemas Operacionais
								</Typography>
								<ApexChartWrapper
									type='donut'
									{...formatPieChart(osChartData, 'name', 'value', isDark)}
									height={350}
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									Top Sistemas
								</Typography>
								<Stack spacing={2}>
									{operatingSystems.slice(0, 5).map((os) => (
										<Box
											key={`${os.os}-${os.version}`}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												p: 1,
												bgcolor: 'background.paper',
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider'
											}}
										>
											<Box>
												<Typography variant='subtitle2'>{os.os}</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{os.version}
												</Typography>
											</Box>
											<Box sx={{ textAlign: 'right' }}>
												<Typography
													variant='body2'
													fontWeight='bold'
												>
													{os.clicks}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{os.percentage?.toFixed(1)}%
												</Typography>
											</Box>
										</Box>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 3 - Performance por Dispositivo */}
			{hasEnhancedData && activeTab === 3 && devicePerformance ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									⚡ Performance por Dispositivo
								</Typography>
								<ApexChartWrapper
									type='bar'
									{...formatBarChart(
										performanceChartData,
										'name',
										'value',
										chartColors.warning.main,
										false,
										isDark
									)}
									height={300}
								/>

								<Box sx={{ mt: 3 }}>
									<Typography
										variant='subtitle1'
										gutterBottom
									>
										Detalhes de Performance
									</Typography>
									<Stack spacing={1}>
										{devicePerformance.map((perf) => (
											<Box
												key={perf.device}
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													p: 1,
													bgcolor: 'background.paper',
													borderRadius: 1,
													border: '1px solid',
													borderColor: 'divider'
												}}
											>
												<Typography variant='body2'>{perf.device}</Typography>
												<Box sx={{ textAlign: 'right' }}>
													<Typography variant='caption'>
														Média: {perf.avg_response_time}ms | Min:{' '}
														{perf.min_response_time}ms | Max: {perf.max_response_time}ms
													</Typography>
												</Box>
											</Box>
										))}
									</Stack>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}

			{/* NEW: Tab 4 - Distribuição de Idiomas */}
			{hasEnhancedData && activeTab === 4 && languages ? (
				<Grid
					container
					spacing={3}
				>
					<Grid
						item
						xs={12}
						md={8}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									🌍 Distribuição de Idiomas
								</Typography>
								<ApexChartWrapper
									type='pie'
									{...formatPieChart(languageChartData, 'name', 'value', isDark)}
									height={350}
								/>
							</CardContent>
						</Card>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
					>
						<Card
							elevation={0}
							sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
						>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
								>
									Top Idiomas
								</Typography>
								<Stack spacing={2}>
									{languages.slice(0, 5).map((language) => (
										<Box
											key={language.language}
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												p: 1,
												bgcolor: 'background.paper',
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider'
											}}
										>
											<Box>
												<Typography variant='subtitle2'>{language.language}</Typography>
											</Box>
											<Box sx={{ textAlign: 'right' }}>
												<Typography
													variant='body2'
													fontWeight='bold'
												>
													{language.clicks}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{language.percentage.toFixed(1)}%
												</Typography>
											</Box>
										</Box>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			) : null}
		</Box>
	);
}
