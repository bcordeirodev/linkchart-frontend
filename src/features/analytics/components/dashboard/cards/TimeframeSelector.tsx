/**
 * ⏱️ TIMEFRAME SELECTOR - Seletor de Período de Tempo
 */

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

type Timeframe = '1h' | '24h' | '7d' | '30d';

interface TimeframeSelectorProps {
	value: Timeframe;
	onChange: (timeframe: Timeframe) => void;
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
	const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: Timeframe | null) => {
		if (newValue) {
			onChange(newValue);
		}
	};

	return (
		<Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
			<ToggleButtonGroup
				value={value}
				exclusive
				onChange={handleChange}
				size='small'
				sx={{
					'& .MuiToggleButton-root': {
						px: 2,
						py: 0.5,
						border: '1px solid rgba(255,255,255,0.2)',
						color: 'text.secondary',
						'&.Mui-selected': {
							backgroundColor: 'primary.main',
							color: 'white',
							'&:hover': {
								backgroundColor: 'primary.dark'
							}
						}
					}
				}}
			>
				<ToggleButton value='1h'>1h</ToggleButton>
				<ToggleButton value='24h'>24h</ToggleButton>
				<ToggleButton value='7d'>7d</ToggleButton>
				<ToggleButton value='30d'>30d</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	);
}

export default TimeframeSelector;
