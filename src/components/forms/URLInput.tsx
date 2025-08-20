'use client';

import { TextField, Box, alpha, useTheme } from '@mui/material';
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
			placeholder={placeholder}
			fullWidth={fullWidth}
			error={!!error}
			helperText={error || ' '}
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: 3,
					fontSize: '1rem',
					minHeight: 52,
					background: alpha(theme.palette.background.paper, 0.9),
					backdropFilter: 'blur(20px)',
					border: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					'&:hover': {
						borderColor: alpha(theme.palette.primary.main, 0.4),
						background: alpha(theme.palette.background.paper, 0.95),
						transform: 'translateY(-1px)',
						boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.15)}`
					},
					'&.Mui-focused': {
						borderColor: theme.palette.primary.main,
						background: alpha(theme.palette.background.paper, 1),
						boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
						transform: 'translateY(-1px)'
					},
					'&.Mui-error': {
						borderColor: theme.palette.error.main,
						'&:hover': {
							borderColor: theme.palette.error.main
						}
					}
				},
				'& .MuiInputBase-input': {
					padding: '14px 16px',
					'&::placeholder': {
						opacity: 0.7,
						fontWeight: 400
					}
				},
				'& .MuiFormHelperText-root': {
					minHeight: 20,
					margin: '4px 0 0 0',
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
							mr: 1.2,
							p: 1.2,
							borderRadius: 2,
							background: alpha(theme.palette.primary.main, 0.12),
							border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
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
