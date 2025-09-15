import { Paper, Typography, Chip, Button, Box, alpha, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { AppIcon } from '@/lib/icons';

interface UpgradeCTAProps {
	onSignUp: () => void;
	onCreateLink?: () => void;
}

/**
 * CTA para upgrade/cadastro na página shorter
 * Componentizado seguindo padrão do projeto
 */
export function UpgradeCTA({ onSignUp }: UpgradeCTAProps) {
	const theme = useTheme();

	return (
		<Paper
			sx={{
				p: 3,
				background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
				border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
				borderRadius: 2,
				position: 'relative'
			}}
		>
			<Chip
				label={
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
						<AppIcon
							intent="trending"
							size={16}
						/>
						OPORTUNIDADE
					</Box>
				}
				size="small"
				sx={{
					position: 'absolute',
					top: -8,
					left: '50%',
					transform: 'translateX(-50%)',
					background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
					color: 'white',
					fontWeight: 700,
					animation: 'pulse 2s infinite'
				}}
			/>
			<Typography
				variant="h6"
				sx={{
					mb: 1,
					fontWeight: 700,
					textAlign: 'center',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1
				}}
			>
				<AppIcon
					intent="trending"
					size={24}
				/>
				Desbloqueie Todo o Potencial!
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ mb: 2, textAlign: 'center' }}
			>
				Crie uma conta gratuita e tenha acesso a:
			</Typography>

			<Box sx={{ mb: 3 }}>
				{[
					{ icon: 'analytics', text: 'Analytics detalhados dos seus links' },
					{ icon: 'link', text: 'Histórico completo de links criados' },
					{ icon: 'settings', text: 'Personalização de URLs' },
					{ icon: 'trending', text: 'Métricas de performance em tempo real' },
					{ icon: 'url', text: 'Análise geográfica dos cliques' }
				].map((feature, index) => (
					<Box
						key={index}
						sx={{
							display: 'flex',
							alignItems: 'center',
							mb: 1,
							opacity: 0,
							animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
						}}
					>
						<AppIcon
							intent={feature.icon as any}
							size={16}
							color={theme.palette.primary.main}
							style={{ marginRight: 8 }}
						/>
						<Typography variant="body2">{feature.text}</Typography>
					</Box>
				))}
			</Box>

			<Button
				variant="contained"
				fullWidth
				size="large"
				endIcon={<ArrowForward />}
				onClick={onSignUp}
				sx={{
					background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
					'&:hover': {
						background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
						transform: 'translateY(-2px)',
						boxShadow: 4
					},
					transition: 'all 0.3s ease',
					fontWeight: 600,
					py: 1.5
				}}
			>
				Criar Conta Gratuita
			</Button>
		</Paper>
	);
}

export default UpgradeCTA;
