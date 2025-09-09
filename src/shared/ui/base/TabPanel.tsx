/**
 * 🎯 TAB PANEL - COMPONENTE BASE
 * Componente base para painéis de tabs reutilizável
 */

import { Box } from '@mui/material';
import { TabPanelProps } from '../components';

/**
 * Componente TabPanel base seguindo padrões arquiteturais
 * Reutilizável em todos os módulos que precisam de tabs
 */
export function TabPanel({ children, value, index, sx, ...other }: TabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ py: 3, ...sx }}>{children}</Box>}
		</div>
	);
}

export default TabPanel;
