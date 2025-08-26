'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinkIcon from '@mui/icons-material/Link';
import ClickIcon from '@mui/icons-material/Mouse';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import { api } from '@/lib/api';

interface RedirectStatsData {
	totalClicks: number;
	totalLinks: number;
	avgClicksPerLink: number;
	topLinks: {
		slug: string;
		title?: string;
		clicks: number;
		url: string;
	}[];
	deviceStats: {
		desktop: number;
		mobile: number;
		tablet: number;
	};
	recentActivity: {
		slug: string;
		timestamp: string;
		country?: string;
	}[];
}

interface RedirectStatsProps {
	refreshInterval?: number;
	showRecentActivity?: boolean;
	maxTopLinks?: number;
}

/**
 * Componente para exibir estatísticas detalhadas de redirecionamento
 */
export default function RedirectStats({
	refreshInterval = 30000,
	showRecentActivity = true,
	maxTopLinks = 5
}: RedirectStatsProps) {
	const [stats, setStats] = useState<RedirectStatsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

	const fetchStats = async () => {
		try {
			setError(null);
			const response = await api.get<RedirectStatsData>('analytics/redirect-stats');
			setStats(response);
			setLastUpdate(new Date());
		} catch (err: unknown) {
			setError(err.message || 'Erro ao carregar estatísticas');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStats();

		// Auto-refresh
		if (refreshInterval > 0) {
			const interval = setInterval(fetchStats, refreshInterval);
			return () => clearInterval(interval);
		}
	}, [refreshInterval]);

	if (loading) {
		return (
			<Box className="space-y-4">
				{[1, 2, 3].map((i) => (
					<Card
						key={i}
						elevation={1}
					>
						<CardContent>
							<LinearProgress />
						</CardContent>
					</Card>
				))}
			</Box>
		);
	}

	if (error || !stats) {
		return (
			<Card elevation={1}>
				<CardContent className="text-center py-8">
					<Typography
						color="error"
						variant="h6"
					>
						{error || 'Não foi possível carregar as estatísticas'}
					</Typography>
				</CardContent>
			</Card>
		);
	}

	const deviceTotal = stats.deviceStats.desktop + stats.deviceStats.mobile + stats.deviceStats.tablet;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-4"
		>
			{/* Header */}
			<Box className="flex items-center justify-between">
				<Box className="flex items-center gap-2">
					<TrendingUpIcon color="primary" />
					<Typography variant="h5">Estatísticas de Redirecionamento</Typography>
				</Box>
				{lastUpdate && (
					<Chip
						label={`Atualizado ${lastUpdate.toLocaleTimeString()}`}
						size="small"
						variant="outlined"
					/>
				)}
			</Box>

			{/* Overview Cards */}
			<Grid
				container
				spacing={3}
			>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<Card elevation={2}>
							<CardContent className="text-center">
								<ClickIcon
									color="primary"
									sx={{ fontSize: 40, mb: 1 }}
								/>
								<Typography
									variant="h4"
									color="primary"
								>
									{stats.totalClicks.toLocaleString()}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Total de Cliques
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<Card elevation={2}>
							<CardContent className="text-center">
								<LinkIcon
									color="secondary"
									sx={{ fontSize: 40, mb: 1 }}
								/>
								<Typography
									variant="h4"
									color="secondary"
								>
									{stats.totalLinks.toLocaleString()}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Links Ativos
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<Card elevation={2}>
							<CardContent className="text-center">
								<SpeedIcon
									color="success"
									sx={{ fontSize: 40, mb: 1 }}
								/>
								<Typography
									variant="h4"
									color="success.main"
								>
									{stats.avgClicksPerLink.toFixed(1)}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Média por Link
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>

				<Grid
					item
					xs={12}
					sm={6}
					md={3}
				>
					<motion.div
						whileHover={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<Card elevation={2}>
							<CardContent className="text-center">
								<SecurityIcon
									color="info"
									sx={{ fontSize: 40, mb: 1 }}
								/>
								<Typography
									variant="h4"
									color="info.main"
								>
									100%
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Links Seguros
								</Typography>
							</CardContent>
						</Card>
					</motion.div>
				</Grid>
			</Grid>

			{/* Top Links */}
			<Card elevation={2}>
				<CardContent>
					<Typography
						variant="h6"
						className="mb-3 flex items-center gap-2"
					>
						<TrendingUpIcon color="primary" />
						Top {maxTopLinks} Links Mais Clicados
					</Typography>
					<Stack spacing={2}>
						{stats.topLinks.slice(0, maxTopLinks).map((link, index) => (
							<motion.div
								key={link.slug}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Box className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
									<Box className="flex-1 min-w-0">
										<Typography
											variant="subtitle2"
											className="truncate"
										>
											{link.title || link.slug}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary"
											className="truncate"
										>
											{link.url}
										</Typography>
									</Box>
									<Chip
										label={`${link.clicks} cliques`}
										color="primary"
										size="small"
									/>
								</Box>
							</motion.div>
						))}
					</Stack>
				</CardContent>
			</Card>

			{/* Device Stats */}
			<Card elevation={2}>
				<CardContent>
					<Typography
						variant="h6"
						className="mb-3 flex items-center gap-2"
					>
						<DevicesIcon color="primary" />
						Dispositivos
					</Typography>
					<Grid
						container
						spacing={3}
					>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Box className="text-center">
								<Typography
									variant="h4"
									color="primary"
								>
									{stats.deviceStats.desktop}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Desktop
								</Typography>
								<LinearProgress
									variant="determinate"
									value={deviceTotal > 0 ? (stats.deviceStats.desktop / deviceTotal) * 100 : 0}
									className="mt-2"
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Box className="text-center">
								<Typography
									variant="h4"
									color="secondary"
								>
									{stats.deviceStats.mobile}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Mobile
								</Typography>
								<LinearProgress
									variant="determinate"
									value={deviceTotal > 0 ? (stats.deviceStats.mobile / deviceTotal) * 100 : 0}
									color="secondary"
									className="mt-2"
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Box className="text-center">
								<Typography
									variant="h4"
									color="success.main"
								>
									{stats.deviceStats.tablet}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Tablet
								</Typography>
								<LinearProgress
									variant="determinate"
									value={deviceTotal > 0 ? (stats.deviceStats.tablet / deviceTotal) * 100 : 0}
									color="success"
									className="mt-2"
								/>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			{showRecentActivity && stats.recentActivity.length > 0 && (
				<Card elevation={2}>
					<CardContent>
						<Typography
							variant="h6"
							className="mb-3"
						>
							Atividade Recente
						</Typography>
						<Stack spacing={1}>
							{stats.recentActivity.slice(0, 10).map((activity, index) => (
								<motion.div
									key={`${activity.slug}-${activity.timestamp}`}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
								>
									<Box className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
										<Box className="flex items-center gap-2">
											<ClickIcon
												fontSize="small"
												color="action"
											/>
											<Typography variant="body2">
												Click em <strong>/{activity.slug}</strong>
											</Typography>
											{activity.country && (
												<Chip
													label={activity.country}
													size="small"
													variant="outlined"
												/>
											)}
										</Box>
										<Typography
											variant="caption"
											color="text.secondary"
										>
											{new Date(activity.timestamp).toLocaleTimeString()}
										</Typography>
									</Box>
								</motion.div>
							))}
						</Stack>
					</CardContent>
				</Card>
			)}
		</motion.div>
	);
}
