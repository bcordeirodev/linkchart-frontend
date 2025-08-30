import { useMediaQuery, useTheme } from '@mui/material';

export function useThemeMediaQuery(query: (theme: any) => string) {
    const theme = useTheme();
    return useMediaQuery(query(theme));
}
