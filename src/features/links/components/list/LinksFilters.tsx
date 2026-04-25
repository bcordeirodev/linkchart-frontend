import { Search, FilterList } from '@mui/icons-material';
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	useTheme,
	Typography,
	Chip
} from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import {
	elevationLightTokens,
	elevationTokens,
	motionTokens,
	radiusTokens
} from '@/lib/theme/designSystem';

interface LinksFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
}

/**
 * Filtros para a listagem de links.
 * Busca por texto (debounced) e filtro por status.
 */
export function LinksFilters({ searchTerm, onSearchChange, statusFilter, onStatusChange }: LinksFiltersProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const [localSearch, setLocalSearch] = useState(searchTerm);

	const debouncedSearch = useMemo(() => debounce((value: string) => onSearchChange(value), 200), [onSearchChange]);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	// Sincroniza estado local quando o pai limpa/altera externamente.
	useEffect(() => {
		setLocalSearch(searchTerm);
	}, [searchTerm]);

	const activeFiltersCount = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: `${radiusTokens.lg}px`,
				border: `1px solid ${theme.palette.divider}`,
				p: 3,
				mb: 4,
				boxShadow: isDark ? elevationTokens.xs : elevationLightTokens.xs,
				transition: `box-shadow ${motionTokens.duration.base} ${motionTokens.easing.default}`,
				'&:hover': {
					boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm
				}
			}}
		>
			{/* Header dos filtros */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<FilterList sx={{ color: 'primary.main', mr: 1 }} />
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, color: 'text.primary' }}
				>
					Filtros
				</Typography>
				{activeFiltersCount > 0 ? (
					<Chip
						label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}`}
						size='small'
						color='primary'
						sx={{ ml: 'auto', fontWeight: 500 }}
					/>
				) : null}
			</Box>

			{/* Controles de filtro */}
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'center' }
				}}
			>
				<TextField
					variant='filled'
					placeholder='Buscar por título, URL ou slug...'
					value={localSearch}
					onChange={(e) => {
						setLocalSearch(e.target.value);
						debouncedSearch(e.target.value);
					}}
					fullWidth
					sx={{
						flex: 1,
						minWidth: 300,
						'& .MuiFilledInput-root': { minHeight: 52 }
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Search sx={{ color: 'text.secondary', fontSize: 22 }} />
							</InputAdornment>
						)
					}}
				/>

				<FormControl sx={{ minWidth: 180 }}>
					<InputLabel>Status do Link</InputLabel>
					<Select
						value={statusFilter}
						label='Status do Link'
						onChange={(e) => onStatusChange(e.target.value)}
					>
						<MenuItem value='all'>Todos os Links</MenuItem>
						<MenuItem value='active'>Links Ativos</MenuItem>
						<MenuItem value='inactive'>Links Inativos</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</Box>
	);
}

export default LinksFilters;
