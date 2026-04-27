/**
 * ⏱️ TIMEFRAME SELECTOR - Seletor de Período de Tempo
 */

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { motionTokens, radiusTokens } from '@/lib/theme/designSystem';

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
						border: '1px solid',
						borderColor: 'divider',
						color: 'text.secondary',
						fontWeight: 600,
						borderRadius: `${radiusTokens.md}px`,
						transition: `background-color ${motionTokens.duration.base} ${motionTokens.easing.default}, color ${motionTokens.duration.base} ${motionTokens.easing.default}`,
						'&:hover': {
							backgroundColor: 'action.hover'
						},
						'&.Mui-selected': {
							backgroundColor: 'action.selected',
							color: 'text.primary',
							'&:hover': {
								backgroundColor: 'action.selected'
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
