'use client';

import { Box, Typography } from '@mui/material';

/**
 * Página principal do control panel - Dashboard Analytics
 * Versão ultra-simplificada para debug
 */
export default function ControlPanelPage() {
	return (
		<Box sx={{ p: 3 }}>
			<Typography
				variant="h4"
				gutterBottom
			>
				🎯 Dashboard Analytics
			</Typography>
			<Typography variant="body1">Página principal funcionando!</Typography>
		</Box>
	);
}
