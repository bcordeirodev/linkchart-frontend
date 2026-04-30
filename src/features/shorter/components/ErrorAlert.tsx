import { Alert, Fade, Box } from '@mui/material';
import { memo } from 'react';

interface ErrorAlertProps {
	error: string | null;
	onClose: () => void;
}

/**
 * ⚠️ COMPONENTE DE ALERTA DE ERRO
 *
 * Mostra erros de forma consistente na página shorter
 * Seguindo padrões arquiteturais do projeto
 */
export function ErrorAlert({ error, onClose }: ErrorAlertProps) {
	if (!error) {
		return null;
	}

	return (
		<Fade
			in={!!error}
			timeout={400}
		>
			<Box sx={{ mb: 3 }}>
				<Alert
					severity='error'
					onClose={onClose}
					sx={{
						borderRadius: 2,
						'& .MuiAlert-message': {
							fontWeight: 500
						}
					}}
				>
					{error}
				</Alert>
			</Box>
		</Fade>
	);
}

export default memo(ErrorAlert);
