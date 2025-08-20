'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';

interface ChartCardProps {
	title: string;
	children: React.ReactNode;
	action?: React.ReactNode;
}

/**
 * Componente de card para gráficos reutilizável
 * Padroniza a apresentação de gráficos em todo o sistema
 *
 * @example
 * ```tsx
 * <ChartCard title="Vendas por Mês">
 *   <ApexChart {...chartProps} />
 * </ChartCard>
 * ```
 */
export function ChartCard({ title, children, action }: ChartCardProps) {
	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 3,
				boxShadow: (theme) =>
					theme.palette.mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
				border: (theme) => `1px solid ${theme.palette.divider}`,
				transition: 'all 0.3s ease-in-out',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: (theme) =>
						theme.palette.mode === 'dark'
							? '0 8px 30px rgba(0, 0, 0, 0.4)'
							: '0 8px 30px rgba(0, 0, 0, 0.12)',
					borderColor: 'primary.main'
				}
			}}
		>
			<CardContent sx={{ flexGrow: 1, p: 3 }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 3,
						pb: 2,
						borderBottom: '1px solid',
						borderColor: 'divider'
					}}
				>
					<Typography
						variant="h6"
						sx={{
							mb: 0,
							fontWeight: 600,
							color: 'text.primary',
							fontSize: '1.1rem'
						}}
					>
						{title}
					</Typography>
					{action}
				</Box>
				<Box sx={{ position: 'relative' }}>{children}</Box>
			</CardContent>
		</Card>
	);
}

export default ChartCard;
