import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import { AppIcon } from '@/lib/icons';
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
			icon: (
				<AppIcon
					intent="link"
					size={24}
				/>
			),
			title: '1000+',
			subtitle: 'Links Encurtados',
			color: 'primary'
		},
		{
			icon: (
				<AppIcon
					intent="trending"
					size={24}
				/>
			),
			title: '10.000+',
			subtitle: 'Cliques Processados',
			color: 'success'
		},
		{
			icon: (
				<AppIcon
					name="advanced.performance"
					size={24}
				/>
			),
			title: '<100ms',
			subtitle: 'Tempo de Resposta',
			color: 'info'
		},
		{
			icon: (
				<AppIcon
					name="user.security"
					size={24}
				/>
			),
			title: '99.8%',
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
					mb: 2,
					fontWeight: 700,
					// Usa gradiente de texto padronizado
					...createTextGradient(theme, 'primary')
				}}
			>
				Números que Impressionam
			</Typography>

			<Grid
				container
				spacing={3}
				justifyContent="center"
			>
				{stats.map((stat, index) => {
					const colors = createComponentColorSet(
						theme,
						stat.color as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
					);

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
									...createGlassCard(theme, 'neutral'),
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
