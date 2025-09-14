import { Box, Typography } from '@mui/material';

interface BasicAnalyticsHeaderProps {
	title?: string;
	subtitle?: string;
}

/**
 * 📊 HEADER DO BASIC ANALYTICS
 *
 * Componente de cabeçalho padronizado seguindo design system
 * Reutiliza padrões visuais do projeto
 */
export function BasicAnalyticsHeader({
	title = ' Analytics Básicos',
	subtitle = 'Estatísticas públicas do seu link encurtado'
}: BasicAnalyticsHeaderProps) {
	return (
		<Box sx={{ mb: 4, textAlign: 'center' }}>
			<Typography
				variant="h3"
				component="h1"
				gutterBottom
				sx={{
					fontWeight: 700,
					background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
					marginBottom: 1
				}}
			>
				{title}
			</Typography>
			<Typography
				variant="h6"
				color="text.secondary"
				gutterBottom
				sx={{
					fontWeight: 500,
					opacity: 0.8,
					maxWidth: 600,
					mx: 'auto'
				}}
			>
				{subtitle}
			</Typography>
		</Box>
	);
}
