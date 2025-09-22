import { TextField, Box, useTheme } from '@mui/material';
import { Public } from '@mui/icons-material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface URLInputProps {
	register?: UseFormRegisterReturn;
	error?: string;
	placeholder?: string;
	fullWidth?: boolean;
}

/**
 * Componente de input para URLs reutilizável
 * Design consistente com validação visual integrada
 */
export function URLInput({
	register,
	error,
	placeholder = 'Cole sua URL aqui... (ex: https://exemplo.com/pagina-muito-longa)',
	fullWidth = true
}: URLInputProps) {
	const theme = useTheme();

	return (
		<TextField
			{...register}
			variant="filled"
			placeholder={placeholder}
			fullWidth={fullWidth}
			error={!!error}
			helperText={error || ' '}
			sx={{
				'& .MuiFilledInput-root': {
					minHeight: 52
				},
				'& .MuiFormHelperText-root': {
					minHeight: 20,
					fontSize: '0.875rem',
					fontWeight: 500
				}
			}}
			InputProps={{
				startAdornment: (
					<Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
						<Public
							sx={{
								color: 'primary.main',
								fontSize: 20
							}}
						/>
					</Box>
				)
			}}
		/>
	);
}

export default URLInput;
