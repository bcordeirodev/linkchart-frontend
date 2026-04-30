/**
 * 🎯 TAB PANEL - COMPONENTE BASE
 * Componente base para painéis de tabs reutilizável
 */

import { Box, Fade } from '@mui/material';

import type { TabPanelProps } from '../components';

/**
 * Componente TabPanel base seguindo padrões arquiteturais
 * Reutilizável em todos os módulos que precisam de tabs
 */
export function TabPanel({ children, value, index, sx, ...other }: TabPanelProps) {
	const isActive = value === index;

	return (
		<div
			role='tabpanel'
			hidden={!isActive}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{isActive ? (
				<Fade
					in
					timeout={180}
				>
					<Box sx={{ py: 3, ...sx }}>{children}</Box>
				</Fade>
			) : null}
		</div>
	);
}

export default TabPanel;
