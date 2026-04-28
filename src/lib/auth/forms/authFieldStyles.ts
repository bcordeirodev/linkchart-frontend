import type { SxProps, Theme } from '@mui/material/styles';

import { darkNeutral, lightNeutral } from '@/lib/theme/colors';

export function authTextFieldSx(theme: Theme): SxProps<Theme> {
	const isDark = theme.palette.mode === 'dark';
	const neutral = isDark ? darkNeutral : lightNeutral;

	return {
		'& .MuiOutlinedInput-root': {
			borderRadius: 2,
			backgroundColor: neutral.input,
			'& input': {
				color: theme.palette.text.primary,
				'&::placeholder': {
					color: theme.palette.text.secondary,
					opacity: 1
				}
			},
			'& fieldset': {
				borderColor: theme.palette.divider
			},
			'&:hover fieldset': {
				borderColor: theme.palette.primary.main
			},
			'&.Mui-focused fieldset': {
				borderColor: theme.palette.primary.main
			},
			'&.Mui-error fieldset': {
				borderColor: theme.palette.error.main
			}
		},
		'& .MuiInputLabel-root': {
			color: theme.palette.text.secondary,
			'&.Mui-focused': {
				color: theme.palette.primary.main
			},
			'&.Mui-error': {
				color: theme.palette.error.main
			}
		},
		'& .MuiFormHelperText-root': {
			color: theme.palette.text.secondary,
			'&.Mui-error': {
				color: theme.palette.error.main
			}
		}
	};
}
