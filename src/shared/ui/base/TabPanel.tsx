import { Box } from '@mui/material';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

/**
 * Componente de painel para tabs reutilizável
 * Padroniza a apresentação de conteúdo em tabs
 *
 * @example
 * ```tsx
 * <TabPanel value={tabValue} index={0}>
 *   <div>Conteúdo da primeira tab</div>
 * </TabPanel>
 * ```
 */
export function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

export default TabPanel;
