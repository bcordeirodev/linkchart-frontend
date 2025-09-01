import { Box, Typography, Grid, Paper, Fade, Grow, alpha, useTheme } from '@mui/material';

interface Benefit {
	title: string;
	description: string;
}

interface BenefitsSectionProps {
	title?: string;
	subtitle?: string;
	benefits?: Benefit[];
}

const defaultBenefits: Benefit[] = [
	{
		title: '📊 Analytics Detalhados',
		description: 'Veja de onde vêm seus cliques, dispositivos, países e muito mais'
	},
	{
		title: '🎨 Links Personalizados',
		description: 'Crie slugs personalizados para sua marca (ex: linkcht.com/minha-empresa)'
	},
	{
		title: '📱 QR Codes Automáticos',
		description: 'Gere QR codes personalizáveis para seus links automaticamente'
	},
	{
		title: '⏰ Controle de Tempo',
		description: 'Configure data de início e expiração para seus links'
	},
	{
		title: '🎯 Limite de Cliques',
		description: 'Defina quantos cliques cada link pode receber'
	},
	{
		title: '📈 Dashboard Avançado',
		description: 'Gerencie todos seus links em um painel intuitivo e poderoso'
	},
	{
		title: '🔒 Links Seguros',
		description: 'Proteção contra spam e links maliciosos'
	},
	{
		title: '⚡ Velocidade Garantida',
		description: 'Redirecionamento ultrarrápido com 99.9% de uptime'
	}
];

/**
 * Seção de benefícios com animações suaves e design moderno
 * Grid responsivo de cards com todos os recursos disponíveis
 */
export function BenefitsSection({
	title = '🚀 Recursos Incríveis e Completos',
	subtitle = 'Crie sua conta e tenha acesso completo a todas as funcionalidades do sistema.',
	benefits = defaultBenefits
}: BenefitsSectionProps) {
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 12 },
				px: { xs: 2, sm: 3, md: 4 },
				background:
					theme.palette.mode === 'dark'
						? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
						: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			{/* Header */}
			<Fade
				in
				timeout={800}
			>
				<Box sx={{ textAlign: 'center', mb: 8, maxWidth: 800, mx: 'auto' }}>
					<Typography
						variant="h2"
						sx={{
							fontWeight: 700,
							mb: 3,
							color: 'text.primary',
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							fontFamily: 'Inter, system-ui, sans-serif'
						}}
					>
						{title}
					</Typography>
					<Typography
						variant="h5"
						color="text.secondary"
						sx={{
							lineHeight: 1.6,
							fontWeight: 400,
							fontSize: { xs: '1.1rem', sm: '1.25rem' },
							fontFamily: 'Inter, system-ui, sans-serif'
						}}
					>
						{subtitle}
					</Typography>
				</Box>
			</Fade>

			{/* Benefits Grid */}
			<Grid
				container
				spacing={4}
				sx={{ maxWidth: 1200, mx: 'auto' }}
			>
				{benefits.map((benefit, index) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						key={index}
					>
						<Grow
							in
							timeout={1000 + index * 200}
						>
							<Paper
								elevation={0}
								sx={{
									p: 4,
									height: '100%',
									borderRadius: '16px',
									background:
										theme.palette.mode === 'dark'
											? alpha(theme.palette.background.paper, 0.8)
											: alpha(theme.palette.background.paper, 0.9),
									border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									cursor: 'pointer',
									boxShadow: theme.shadows[3],
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: theme.shadows[8],
										borderColor: alpha(theme.palette.primary.main, 0.4),
										background:
											theme.palette.mode === 'dark'
												? alpha(theme.palette.background.paper, 0.95)
												: alpha(theme.palette.background.paper, 1)
									},
									'&:focus': {
										outline: 'none',
										borderColor: theme.palette.primary.main,
										boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
									}
								}}
							>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 600,
										mb: 2,
										color: 'text.primary',
										lineHeight: 1.3,
										fontFamily: 'Inter, system-ui, sans-serif'
									}}
								>
									{benefit.title}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{
										lineHeight: 1.6,
										fontSize: '0.95rem',
										fontFamily: 'Inter, system-ui, sans-serif'
									}}
								>
									{benefit.description}
								</Typography>
							</Paper>
						</Grow>
					</Grid>
				))}
			</Grid>

			{/* Background Decoration - Elementos sutis */}
			<Box
				sx={{
					position: 'absolute',
					top: '20%',
					right: '-10%',
					width: '30%',
					height: '60%',
					background: `radial-gradient(circle, ${alpha(theme.palette.divider, 0.08)} 0%, transparent 70%)`,
					borderRadius: '50%',
					zIndex: -1
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					bottom: '10%',
					left: '-5%',
					width: '25%',
					height: '40%',
					background: `radial-gradient(circle, ${alpha(theme.palette.divider, 0.06)} 0%, transparent 70%)`,
					borderRadius: '50%',
					zIndex: -1
				}}
			/>
		</Box>
	);
}

export default BenefitsSection;
