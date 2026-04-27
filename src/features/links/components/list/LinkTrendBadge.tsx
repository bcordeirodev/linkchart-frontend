import { TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { Stack, Typography } from '@mui/material';
import type { LinkTrend } from '@/types';

interface LinkTrendBadgeProps {
	trend?: LinkTrend | null;
}

export function LinkTrendBadge({ trend }: LinkTrendBadgeProps) {
	if (!trend) {
		return (
			<Typography
				variant='caption'
				color='text.disabled'
			>
				—
			</Typography>
		);
	}

	const { percent_change, current } = trend;
	const isPositive = percent_change > 0;
	const isNeutral = percent_change === 0;
	const color = isPositive ? 'success.main' : isNeutral ? 'text.secondary' : 'error.main';
	const Icon = isPositive ? TrendingUp : isNeutral ? Minus : TrendingDown;
	const sign = isPositive ? '+' : '';

	return (
		<Stack
			direction='row'
			spacing={0.5}
			alignItems='center'
		>
			<Typography
				variant='subtitle2'
				sx={{ fontWeight: 700 }}
			>
				{current.toLocaleString('pt-BR')}
			</Typography>
			<Stack
				direction='row'
				alignItems='center'
				sx={{ color }}
			>
				<Icon size={14} strokeWidth={1.5} />
				<Typography
					variant='caption'
					sx={{ color, fontWeight: 600 }}
				>
					{sign}
					{percent_change.toFixed(1)}%
				</Typography>
			</Stack>
		</Stack>
	);
}
