import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function PublicAnalyticsCtaStrip() {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				background: 'rgba(255,255,255,0.03)',
				border: '1px solid rgba(255,255,255,0.07)',
				borderRadius: '12px',
				p: '18px 22px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 3,
				flexDirection: { xs: 'column', sm: 'row' }
			}}
		>
			<Box>
				<Typography
					sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', mb: 0.5 }}
				>
					Ver analytics completos.
				</Typography>
				<Typography sx={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
					Crie uma conta grátis para acessar dispositivos, países, horários de pico e histórico de cliques.
				</Typography>
			</Box>
			<Button
				variant='contained'
				onClick={() => navigate('/sign-up')}
				sx={{
					background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
					fontWeight: 700,
					fontSize: '0.8125rem',
					px: 3,
					py: 1.25,
					borderRadius: '8px',
					boxShadow: 'none',
					whiteSpace: 'nowrap',
					flexShrink: 0,
					'&:hover': { boxShadow: 'none', opacity: 0.9 }
				}}
			>
				Criar conta grátis
			</Button>
		</Box>
	);
}
