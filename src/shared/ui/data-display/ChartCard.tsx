/**
 * 📊 CHART CARD - Componente Base para Gráficos
 *
 * @description
 * Componente reutilizável que encapsula um gráfico com estilo consistente,
 * incluindo título, ícone e animações. Seguindo os padrões de design do projeto.
 */

import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { createPresetAnimations } from '@/lib/theme';
import { elevationLightTokens, elevationTokens, radiusTokens } from '@/lib/theme/designSystem';

import type { ReactNode } from 'react';

export interface ChartCardProps {
	/** Título do gráfico */
	title: string;
	/** Ícone emoji para o título */
	icon?: string;
	/** Conteúdo do gráfico */
	children: ReactNode;
	/** Altura do card */
	height?: number | string;
	/** Props adicionais de estilo */
	sx?: object;
}

/**
 * ChartCard - Container padronizado para gráficos
 *
 * @example
 * ```tsx
 * <ChartCard title="Cliques por Hora" icon="📈">
 *   <ApexChartWrapper {...chartProps} />
 * </ChartCard>
 * ```
 */
export function ChartCard({ title, icon, children, height = '100%', sx = {} }: ChartCardProps) {
	const theme = useTheme();
	const animations = createPresetAnimations(theme);

	return (
		<Box
			sx={{
				height,
				...animations.cardHover,
				...sx
			}}
		>
			<Card
				sx={{
					height: '100%',
					borderRadius: `${radiusTokens.lg}px`,
					boxShadow: theme.palette.mode === 'dark' ? elevationTokens.xs : elevationLightTokens.xs
				}}
			>
				<CardContent>
					<Typography
						variant='h5'
						gutterBottom
						sx={{
							position: 'relative',
							zIndex: 1,
							mt: 1,
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							fontWeight: 500
						}}
					>
						{icon ? <span>{icon}</span> : null}
						{title}
					</Typography>
					<Box sx={{ mb: 2 }}>{children}</Box>
				</CardContent>
			</Card>
		</Box>
	);
}

export default ChartCard;
