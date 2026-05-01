'use client';
import { Monitor, Link, MousePointer, Shield, Zap, TrendingUp } from 'lucide-react';

import { ICON_MD, ICON_XL } from '@/lib/theme/iconDefaults';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { motion } from 'framer-motion';

import { api } from '@/lib/api/client';
import { useAppDispatch } from '@/lib/store/hooks';
import { showErrorMessage } from '@/lib/store/messageSlice';

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
	error?: string;
	shortCode?: string;
}

/**
 * Componente para exibir estatísticas detalhadas de redirecionamento
 */
export default function RedirectStats({
	refreshInterval = 30000,
	showRecentActivity = true,
	maxTopLinks = 5,
	error,
	shortCode
}: RedirectStatsProps) {
	const dispatch = useAppDispatch();
	const [stats, setStats] = useState<RedirectStatsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

	const fetchStats = async () => {
		try {
			setFetchError(null);
			const response = await api.get<RedirectStatsData>('analytics/redirect-stats');
			setStats(response);
			setLastUpdate(new Date());
		} catch (err: unknown) {
			const errorMessage = (err as Error).message || 'Erro ao carregar estatísticas';
			setFetchError(errorMessage);
			dispatch(showErrorMessage(errorMessage));
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
			<Stack spacing={2}>
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
			</Stack>
		);
	}

	if (error || !stats) {
		return (
			<Card elevation={1}>
				<CardContent sx={{ textAlign: 'center', py: 4 }}>
					<Typography
						color='error'
						variant='h6'
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
			style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
		>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<TrendingUp {...ICON_MD} />
					<Typography variant='h5'>Estatísticas de Redirecionamento</Typography>
				</Box>
				{lastUpdate ? (
					<Chip
						label={`Atualizado ${lastUpdate.toLocaleTimeString()}`}
						size='small'
						variant='outlined'
					/>
				) : null}
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
							<CardContent sx={{ textAlign: 'center' }}>
								<MousePointer {...ICON_XL} />
								<Typography
									variant='h4'
									color='primary'
								>
									{stats.totalClicks.toLocaleString()}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
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
							<CardContent sx={{ textAlign: 'center' }}>
								<Link {...ICON_XL} />
								<Typography
									variant='h4'
									color='secondary'
								>
									{stats.totalLinks.toLocaleString()}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
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
							<CardContent sx={{ textAlign: 'center' }}>
								<Zap {...ICON_XL} />
								<Typography
									variant='h4'
									color='success.main'
								>
									{stats.avgClicksPerLink.toFixed(1)}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
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
							<CardContent sx={{ textAlign: 'center' }}>
								<Shield {...ICON_XL} />
								<Typography
									variant='h4'
									color='info.main'
								>
									100%
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
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
						variant='h6'
						sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<TrendingUp {...ICON_MD} />
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
								<Box
									sx={(theme) => ({
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										p: 1.5,
										borderRadius: 1,
										bgcolor:
											theme.palette.mode === 'dark'
												? theme.palette.background.paper
												: theme.palette.grey[50]
									})}
								>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography
											variant='subtitle2'
											noWrap
										>
											{link.title || link.slug}
										</Typography>
										<Typography
											variant='caption'
											color='text.secondary'
											noWrap
											component='div'
										>
											{link.url}
										</Typography>
									</Box>
									<Chip
										label={`${link.clicks} cliques`}
										color='primary'
										size='small'
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
						variant='h6'
						sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
					>
						<Monitor {...ICON_MD} />
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
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='h4'
									color='primary'
								>
									{stats.deviceStats.desktop}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Desktop
								</Typography>
								<LinearProgress
									variant='determinate'
									value={deviceTotal > 0 ? (stats.deviceStats.desktop / deviceTotal) * 100 : 0}
									sx={{ mt: 1 }}
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='h4'
									color='secondary'
								>
									{stats.deviceStats.mobile}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Mobile
								</Typography>
								<LinearProgress
									variant='determinate'
									value={deviceTotal > 0 ? (stats.deviceStats.mobile / deviceTotal) * 100 : 0}
									color='secondary'
									sx={{ mt: 1 }}
								/>
							</Box>
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
						>
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='h4'
									color='success.main'
								>
									{stats.deviceStats.tablet}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
								>
									Tablet
								</Typography>
								<LinearProgress
									variant='determinate'
									value={deviceTotal > 0 ? (stats.deviceStats.tablet / deviceTotal) * 100 : 0}
									color='success'
									sx={{ mt: 1 }}
								/>
							</Box>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			{showRecentActivity && stats.recentActivity.length > 0 ? (
				<Card elevation={2}>
					<CardContent>
						<Typography
							variant='h6'
							sx={{ mb: 1.5 }}
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
									<Box
										sx={(theme) => ({
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											p: 1,
											borderRadius: 1,
											'&:hover': {
												bgcolor:
													theme.palette.mode === 'dark'
														? theme.palette.background.paper
														: theme.palette.grey[50]
											}
										})}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<MousePointer {...ICON_MD} />
											<Typography variant='body2'>
												Click em <strong>/{activity.slug}</strong>
											</Typography>
											{activity.country ? (
												<Chip
													label={activity.country}
													size='small'
													variant='outlined'
												/>
											) : null}
										</Box>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											{new Date(activity.timestamp).toLocaleTimeString()}
										</Typography>
									</Box>
								</motion.div>
							))}
						</Stack>
					</CardContent>
				</Card>
			) : null}
		</motion.div>
	);
}

export { RedirectStats };
