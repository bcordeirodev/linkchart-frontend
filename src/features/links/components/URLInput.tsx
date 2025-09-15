import { TextField, Box, useTheme } from '@mui/material';
import { Public } from '@mui/icons-material';
import { UseFormRegisterReturn } from 'react-hook-form';
import { createComponentColorSet } from '@/lib/theme';

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
	const primaryColors = createComponentColorSet(theme, 'primary');

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
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',

							borderRadius: 2,
							background: primaryColors.background,
							border: `1px solid ${primaryColors.border}`
						}}
					>
						<Public
							sx={{
								color: 'primary.main',
								fontSize: 20,
								filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
							}}
						/>
					</Box>
				)
			}}
		/>
	);
}

export default URLInput;
