'use client';

import { Button, Box } from '@mui/material';
import { Login, PersonAdd, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useUser from '@auth/useUser';

interface AuthButtonsProps {
	variant?: 'default' | 'compact';
	dashboardRoute?: string;
}

/**
 * Componente de botões de autenticação reutilizável
 * Mostra login/cadastro para usuários não logados
 * Mostra botão dashboard para usuários logados
 */
export function AuthButtons({ variant = 'default', dashboardRoute = '/dashboard' }: AuthButtonsProps) {
	const navigate = useNavigate();
	const { data: user } = useUser();

	const buttonProps = {
		borderRadius: 3,
		textTransform: 'none' as const,
		fontWeight: 600,
		...(variant === 'compact' && { size: 'small' as const })
	};

	if (user) {
		return (
			<Button
				variant="contained"
				startIcon={<Visibility />}
				onClick={() => navigate(dashboardRoute)}
				sx={{
					...buttonProps,
					background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
					'&:hover': {
						background: 'linear-gradient(135deg, #0960C0 0%, #0090D1 100%)'
					}
				}}
			>
				Dashboard
			</Button>
		);
	}

	return (
		<Box sx={{ display: 'flex', gap: 2 }}>
			<Button
				variant="outlined"
				startIcon={<Login />}
				onClick={() => navigate('/sign-in')}
				sx={buttonProps}
			>
				Entrar
			</Button>
			<Button
				variant="contained"
				startIcon={<PersonAdd />}
				onClick={() => navigate('/sign-up')}
				sx={{
					...buttonProps,
					background: 'linear-gradient(135deg, #0A74DA 0%, #00A4EF 100%)',
					'&:hover': {
						background: 'linear-gradient(135deg, #0960C0 0%, #0090D1 100%)'
					}
				}}
			>
				Cadastrar
			</Button>
		</Box>
	);
}

export default AuthButtons;
