/**
 * 📈 CHART CARD - COMPONENTE BASE
 * Container padronizado para gráficos seguindo padrão do GeographicChart e Charts
 */

import { Card, CardContent, Typography, Box, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { createPresetAnimations } from '@/lib/theme';
import { elevationLightTokens, elevationTokens, radiusTokens } from '@/lib/theme/designSystem';

import type { BaseComponentProps } from '../components';
import type React from 'react';

interface ChartCardProps extends BaseComponentProps {
	title?: string;
	icon?: React.ReactNode;
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
	icon,
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
			<Card
				sx={{
					borderRadius: `${radiusTokens.lg}px`,
					boxShadow: theme.palette.mode === 'dark' ? elevationTokens.xs : elevationLightTokens.xs
				}}
			>
				<CardContent>
					{title ? (
						<Typography
							variant='h5'
							gutterBottom
							sx={{
								position: 'relative',
								zIndex: 1,
								mt: 1,
								fontWeight: 500,
								display: 'flex',
								alignItems: 'center',
								gap: 1
							}}
						>
							{icon}
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
						{loading ? (
							<Typography color='text.secondary'>Carregando gráfico...</Typography>
						) : (
							<Fade
								in
								timeout={260}
							>
								<Box>{children}</Box>
							</Fade>
						)}
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}

export default ChartCard;
