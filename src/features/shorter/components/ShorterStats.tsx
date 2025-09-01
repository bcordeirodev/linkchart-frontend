import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, Link as LinkIcon, Speed, Security } from '@mui/icons-material';
import {
	createGlassCard,
	createComponentColorSet,
	createPresetShadows,
	createPresetAnimations,
	createTextGradient
} from '@/lib/theme';

/**
 * Estatísticas da página shorter
 * Componentizado seguindo padrão do projeto com utilitários de tema
 */
export function ShorterStats() {
	const theme = useTheme();

	// Usa utilitários de tema
	const shadows = createPresetShadows(theme);
	const animations = createPresetAnimations(theme);

	const stats = [
		{
			icon: <LinkIcon />,
			title: '1M+',
			subtitle: 'Links Encurtados',
			color: 'primary'
		},
		{
			icon: <TrendingUp />,
			title: '50M+',
			subtitle: 'Cliques Processados',
			color: 'success'
		},
		{
			icon: <Speed />,
			title: '<100ms',
			subtitle: 'Tempo de Resposta',
			color: 'info'
		},
		{
			icon: <Security />,
			title: '99.9%',
			subtitle: 'Uptime Garantido',
			color: 'warning'
		}
	];

	return (
		<Box
			sx={{
				py: { xs: 4, md: 6 },
				...animations.fadeIn
			}}
		>
			<Typography
				variant="h4"
				component="h2"
				sx={{
					textAlign: 'center',
					mb: 4,
					fontWeight: 700,
					// Usa gradiente de texto padronizado
					...createTextGradient(theme, 'primary')
				}}
			>
				📈 Números que Impressionam
			</Typography>

			<Grid
				container
				spacing={3}
				justifyContent="center"
			>
				{stats.map((stat, index) => {
					const colors = createComponentColorSet(theme, stat.color as any);

					return (
						<Grid
							item
							xs={6}
							md={3}
							key={index}
						>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									textAlign: 'center',
									height: '100%',
									// Usa glassmorphism padronizado
									...(createGlassCard(theme, 'neutral') as any),
									boxShadow: shadows.card,
									// Usa animações padronizadas
									...animations.cardHover,
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: shadows.cardHover,
										borderColor: colors.main
									}
								}}
							>
								<Box
									sx={{
										display: 'inline-flex',
										p: 2,
										borderRadius: '50%',
										bgcolor: `${stat.color}.light`,
										color: `${stat.color}.dark`,
										mb: 2
									}}
								>
									{stat.icon}
								</Box>

								<Typography
									variant="h4"
									component="div"
									sx={{
										fontWeight: 800,
										color: `${stat.color}.main`,
										mb: 1
									}}
								>
									{stat.title}
								</Typography>

								<Typography
									variant="body1"
									color="text.secondary"
									sx={{ fontWeight: 500 }}
								>
									{stat.subtitle}
								</Typography>
							</Paper>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}

export default ShorterStats;
