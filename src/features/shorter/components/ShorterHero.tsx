import { Box, Typography, Container, alpha, useTheme } from '@mui/material';

/**
 * Hero section da página shorter
 * Componentizado seguindo padrão do projeto
 */
export function ShorterHero() {
	const theme = useTheme();

	return (
		<Box
			sx={{
				background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                    ${alpha(theme.palette.secondary.main, 0.05)} 50%,
                    ${alpha(theme.palette.primary.main, 0.08)} 100%
                )`,
				py: { xs: 6, md: 10 },
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'url("/assets/images/patterns/grid.svg")',
					opacity: 0.1,
					zIndex: 0
				}
			}}
		>
			<Container
				maxWidth="lg"
				sx={{ position: 'relative', zIndex: 1 }}
			>
				<Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
					<Typography
						variant="h2"
						component="h1"
						sx={{
							fontWeight: 800,
							fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 2,
							lineHeight: 1.2
						}}
					>
						Encurte URLs com
						<br />
						<Box
							component="span"
							sx={{ color: 'primary.main' }}
						>
							Analytics Poderosos
						</Box>
					</Typography>

					<Typography
						variant="h5"
						color="text.secondary"
						sx={{
							mb: 4,
							fontWeight: 400,
							lineHeight: 1.5,
							fontSize: { xs: '1.1rem', md: '1.3rem' }
						}}
					>
						Transforme links longos em URLs curtas e elegantes.
						<br />
						Acompanhe cada clique com métricas detalhadas.
					</Typography>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 4,
							flexWrap: 'wrap',
							mb: 4
						}}
					>
						{[
							{ icon: '🔗', text: 'URLs Personalizadas' },
							{ icon: '📊', text: 'Analytics Detalhados' },
							{ icon: '🌍', text: 'Análise Geográfica' },
							{ icon: '⚡', text: 'Super Rápido' }
						].map((feature, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									opacity: 0,
									animation: `fadeInUp 0.6s ease forwards ${index * 0.1 + 0.5}s`
								}}
							>
								<Typography variant="h6">{feature.icon}</Typography>
								<Typography
									variant="body1"
									fontWeight={500}
								>
									{feature.text}
								</Typography>
							</Box>
						))}
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default ShorterHero;
