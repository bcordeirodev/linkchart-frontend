/**
 * 📈 CHART CARD - COMPONENTE BASE
 * Container padronizado para gráficos
 */

import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createGlassCard } from '@/lib/theme';
import { BaseComponentProps } from '../components';

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
 */
export function ChartCard({
	title,
	subtitle,
	action,
	height = 400,
	loading = false,
	children,
	sx,
	...other
}: ChartCardProps) {
	const theme = useTheme();

	return (
		<Card
			sx={
				{
					...createGlassCard(theme, 'neutral'),
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					...sx
				} as any
			}
			{...other}
		>
			{(title || action) && (
				<CardHeader
					title={
						title && (
							<Typography
								variant="h6"
								component="h3"
							>
								{title}
							</Typography>
						)
					}
					subheader={
						subtitle && (
							<Typography
								variant="body2"
								color="text.secondary"
							>
								{subtitle}
							</Typography>
						)
					}
					action={action}
					sx={{
						pb: 0.5, // Padding bottom reduzido
						pt: 1.5, // Padding top reduzido
						px: 2 // Padding horizontal otimizado
					}}
				/>
			)}

			<CardContent
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					pt: title || action ? 0.5 : 1.5, // Padding top reduzido
					pb: 1, // Padding bottom reduzido
					px: 1.5, // Padding horizontal reduzido
					'&:last-child': {
						pb: 1 // Override do padding bottom padrão do MUI
					}
				}}
			>
				<Box
					sx={{
						flex: 1,
						height: typeof height === 'number' ? `${height}px` : height,
						minHeight: 280, // Altura mínima reduzida
						display: 'flex',
						flexDirection: 'column', // Para melhor aproveitamento do espaço
						position: 'relative',
						overflow: 'hidden' // Evitar overflow desnecessário
					}}
				>
					{loading ? <Typography color="text.secondary">Carregando gráfico...</Typography> : children}
				</Box>
			</CardContent>
		</Card>
	);
}

export default ChartCard;
