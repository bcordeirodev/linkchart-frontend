/**
 * 📈 CHART CARD - COMPONENTE BASE
 * Container padronizado para gráficos seguindo padrão do GeographicChart e Charts
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { createPresetAnimations } from '@/lib/theme';

import type { BaseComponentProps } from '../components';
import type React from 'react';

interface ChartCardProps extends BaseComponentProps {
	title?: string;
	subtitle?: string;
	action?: React.ReactNode;
	height?: number | string;
	loading?: boolean;
}

/**
 * Componente ChartCard seguindo padrões arquiteturais
 * Container padronizado para todos os gráficos da aplicação
 * Mantém consistência visual com GeographicChart.tsx e Charts.tsx
 */
export function ChartCard({
	title,
	subtitle,
	action,
	height: _height = 300,
	loading = false,
	children,
	sx,
	...other
}: ChartCardProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	return (
		<Box
			sx={{
				height: '100%',
				...animations.cardHover,
				...sx
			}}
			{...other}
		>
			<Card>
				<CardContent>
					{title ? (
						<Typography
							variant='h6'
							gutterBottom
							sx={{
								position: 'relative',
								zIndex: 1,
								mt: 1
							}}
						>
							{title}
						</Typography>
					) : null}

					{subtitle ? (
						<Typography
							variant='body2'
							color='text.secondary'
							sx={{ mb: 1 }}
						>
							{subtitle}
						</Typography>
					) : null}

					{action ? <Box sx={{ mb: 1 }}>{action}</Box> : null}

					<Box sx={{ mb: 2 }}>
						{loading ? <Typography color='text.secondary'>Carregando gráfico...</Typography> : children}
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}

export default ChartCard;
