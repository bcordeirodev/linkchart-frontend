import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { MetricCardProps } from '../components';

/**
 * Card de métricas otimizado e reutilizável
 */
export function MetricCardOptimized({
	title,
	value,
	subtitle,
	icon,
	color = 'primary',
	trend,
	sx,
	...other
}: MetricCardProps) {
	const theme = useTheme();

	const colorConfig = {
		primary: theme.palette.primary.main,
		secondary: theme.palette.secondary.main,
		success: theme.palette.success.main,
		warning: theme.palette.warning.main,
		error: theme.palette.error.main,
		info: theme.palette.info.main
	};

	const selectedColor = colorConfig[color];

	return (
		<Card
			className='metric-container'
			sx={{
				height: '100%',
				backgroundColor: theme.palette.background.paper, // Background sólido consistente
				borderRadius: 2,
				transition: theme.transitions.create(['transform', 'box-shadow']),
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: theme.shadows[8]
				},
				...sx
			}}
			{...other}
		>
			<CardContent sx={{ p: 3 }}>
				<Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
					<Box sx={{ flex: 1 }}>
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{ mb: 1, fontWeight: 500 }}
						>
							{title}
						</Typography>

						<Typography
							variant='h4'
							component='div'
							sx={{
								fontWeight: 700,
								color: selectedColor,
								mb: subtitle ? 0.5 : 0
							}}
						>
							{value}
						</Typography>

						{subtitle ? (
							<Typography
								variant='caption'
								color='text.secondary'
							>
								{subtitle}
							</Typography>
						) : null}
					</Box>

					<Box
						sx={{
							color: selectedColor,
							fontSize: '2rem',
							opacity: 0.8
						}}
					>
						{icon}
					</Box>
				</Box>

				{trend ? (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography
							variant='body2'
							sx={{
								color: trend.isPositive ? 'success.main' : 'error.main',
								fontWeight: 600
							}}
						>
							{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							vs período anterior
						</Typography>
					</Box>
				) : null}
			</CardContent>
		</Card>
	);
}

export default MetricCardOptimized;
