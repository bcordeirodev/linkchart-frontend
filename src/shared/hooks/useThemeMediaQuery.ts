import { useMediaQuery, useTheme } from '@mui/material';

export default function useThemeMediaQuery(query: (theme: any) => string) {
	const theme = useTheme();
	return useMediaQuery(query(theme));
}