import {
	Card,
	CardContent,
	Typography,
	Box,
	Grid,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Tooltip
} from '@mui/material';
import { Refresh, Computer, Smartphone, Tablet, Public, Schedule, TrendingUp } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ClicksRealTimeProps {
	linkId: string;
}

interface ClickData {
	link_info: {
		id: number;
		slug: string;
		title: string | null;
		original_url: string;
		created_at: string;
		clicks: number;
	};
	stats: {
		total_clicks: number;
		unique_ips: number;
		last_click: string | null;
		first_click: string | null;
		clicks_by_hour: Record<string, number>;
		top_countries: Record<string, number>;
		top_devices: Record<string, number>;
		top_referrers: Record<string, number>;
		utm_campaigns: Record<string, number>;
	};
	recent_clicks: {
		id: number;
		ip: string;
		country: string;
		city: string;
		device: string;
		referer: string;
		user_agent: string;
		created_at: string;
		utm: any;
	}[];
}

/**
 * Componente de dados de cliques em tempo real
 */
export function LinkClicksRealTime({ linkId }: ClicksRealTimeProps) {
	const [data, setData] = useState<ClickData | null>(null);
	const [loading, setLoading] = useState(false);
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

	const fetchClicksData = async () => {
		try {
			setLoading(true);
			const response = await api.get(`link/${linkId}/clicks`);
			setData(response as ClickData);
			setLastUpdate(new Date());
		} catch (error) {
			console.error('Erro ao carregar dados de cliques:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClicksData();

		// Atualizar a cada 15 segundos para dados em tempo real
		const interval = setInterval(fetchClicksData, 15000);

		return () => clearInterval(interval);
	}, [linkId]);

	if (!data) {
		return (
			<Card>
				<CardContent>
					<Typography>Carregando dados de cliques...</Typography>
				</CardContent>
			</Card>
		);
	}

	const getDeviceIcon = (device: string) => {
		switch (device.toLowerCase()) {
			case 'mobile':
				return <Smartphone color="primary" />;
			case 'tablet':
				return <Tablet color="secondary" />;
			case 'desktop':
				return <Computer color="success" />;
			default:
				return <Computer color="disabled" />;
		}
	};

	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);

		if (diffMins < 1) return 'Agora mesmo';

		if (diffMins < 60) return `${diffMins}min atrás`;

		if (diffHours < 24) return `${diffHours}h atrás`;

		return date.toLocaleDateString('pt-BR');
	};

	return (
		<Box>
			{/* Header com estatísticas rápidas */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2
						}}
					>
						<Typography
							variant="h6"
							fontWeight={600}
						>
							📊 Dados em Tempo Real
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Chip
								label={`Atualizado: ${lastUpdate.toLocaleTimeString()}`}
								size="small"
								variant="outlined"
							/>
							<Tooltip title="Atualizar agora">
								<IconButton
									onClick={fetchClicksData}
									disabled={loading}
									size="small"
								>
									<Refresh
										sx={{
											animation: loading ? 'spin 1s linear infinite' : 'none',
											'@keyframes spin': {
												'0%': { transform: 'rotate(0deg)' },
												'100%': { transform: 'rotate(360deg)' }
											}
										}}
									/>
								</IconButton>
							</Tooltip>
						</Box>
					</Box>

					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant="h4"
									color="primary"
									fontWeight="bold"
								>
									{data.stats.total_clicks}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Total de Cliques
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant="h4"
									color="secondary"
									fontWeight="bold"
								>
									{data.stats.unique_ips}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									IPs Únicos
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant="h4"
									color="success.main"
									fontWeight="bold"
								>
									{data.stats.last_click ? formatTimeAgo(data.stats.last_click) : 'Nunca'}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Último Clique
								</Typography>
							</Box>
						</Grid>
						<Grid
							item
							xs={6}
							md={3}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant="h4"
									color="info.main"
									fontWeight="bold"
								>
									{Object.keys(data.stats.clicks_by_hour).length}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Horas Ativas (24h)
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Distribuições */}
			<Grid
				container
				spacing={3}
				sx={{ mb: 3 }}
			>
				{/* Top Países */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🌍 Países
							</Typography>
							{Object.entries(data.stats.top_countries).map(([country, clicks]) => (
								<Box
									key={country}
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										py: 1
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Public
											fontSize="small"
											color="primary"
										/>
										<Typography variant="body2">{country}</Typography>
									</Box>
									<Chip
										label={clicks}
										size="small"
										color="primary"
									/>
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>

				{/* Top Dispositivos */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								📱 Dispositivos
							</Typography>
							{Object.entries(data.stats.top_devices).map(([device, clicks]) => (
								<Box
									key={device}
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										py: 1
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										{getDeviceIcon(device)}
										<Typography variant="body2">
											{device.charAt(0).toUpperCase() + device.slice(1)}
										</Typography>
									</Box>
									<Chip
										label={clicks}
										size="small"
										color="secondary"
									/>
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>

				{/* Top Referrers */}
				<Grid
					item
					xs={12}
					md={4}
				>
					<Card>
						<CardContent>
							<Typography
								variant="h6"
								gutterBottom
							>
								🔗 Fontes
							</Typography>
							{Object.entries(data.stats.top_referrers)
								.slice(0, 5)
								.map(([referer, clicks]) => (
									<Box
										key={referer}
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											py: 1
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<TrendingUp
												fontSize="small"
												color="success"
											/>
											<Typography
												variant="body2"
												sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}
											>
												{referer}
											</Typography>
										</Box>
										<Chip
											label={clicks}
											size="small"
											color="success"
										/>
									</Box>
								))}
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Cliques Recentes */}
			<Card>
				<CardContent>
					<Typography
						variant="h6"
						gutterBottom
					>
						🕒 Cliques Recentes
					</Typography>
					<TableContainer
						component={Paper}
						variant="outlined"
					>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Horário</TableCell>
									<TableCell>País/Cidade</TableCell>
									<TableCell>Dispositivo</TableCell>
									<TableCell>Fonte</TableCell>
									<TableCell>IP</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.recent_clicks.map((click) => (
									<TableRow key={click.id}>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<Schedule
													fontSize="small"
													color="info"
												/>
												{formatTimeAgo(click.created_at)}
											</Box>
										</TableCell>
										<TableCell>
											<Box>
												<Typography
													variant="body2"
													fontWeight={600}
												>
													{click.country || 'Desconhecido'}
												</Typography>
												{click.city && (
													<Typography
														variant="caption"
														color="text.secondary"
													>
														{click.city}
													</Typography>
												)}
											</Box>
										</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												{getDeviceIcon(click.device)}
												<Typography variant="body2">
													{click.device.charAt(0).toUpperCase() + click.device.slice(1)}
												</Typography>
											</Box>
										</TableCell>
										<TableCell>
											<Typography
												variant="body2"
												sx={{
													maxWidth: 100,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap'
												}}
											>
												{click.referer ? new URL(click.referer).hostname : 'Direct'}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography
												variant="body2"
												fontFamily="monospace"
											>
												{click.ip}
											</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>
		</Box>
	);
}

export default LinkClicksRealTime;
