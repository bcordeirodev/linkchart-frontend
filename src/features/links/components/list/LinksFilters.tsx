import { FilterList, Search, Sort } from '@mui/icons-material';
import {
	Box,
	Chip,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { elevationLightTokens, elevationTokens, motionTokens, radiusTokens } from '@/lib/theme/designSystem';

const STATUS_CHIPS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'active', label: 'Ativos' },
	{ value: 'inactive', label: 'Inativos' },
	{ value: 'scheduled', label: 'Agendados' },
	{ value: 'expired', label: 'Expirados' },
];

const SORT_OPTIONS = [
	{ value: 'created_at', label: 'Criado mais recente' },
	{ value: 'clicks', label: 'Mais clicks' },
	{ value: 'trend', label: 'Maior tendência' },
	{ value: 'last_activity', label: 'Última atividade' },
];

interface LinksFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	sortBy: string;
	onSortChange: (value: string) => void;
}

export function LinksFilters({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusChange,
	sortBy,
	onSortChange,
}: LinksFiltersProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const [localSearch, setLocalSearch] = useState(searchTerm);

	const debouncedSearch = useMemo(
		() => debounce((value: string) => onSearchChange(value), 200),
		[onSearchChange]
	);

	useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
	useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

	const activeFiltersCount =
		(searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (sortBy !== 'created_at' ? 1 : 0);

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
				'&:hover': { boxShadow: isDark ? elevationTokens.sm : elevationLightTokens.sm },
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<FilterList sx={{ color: 'primary.main', mr: 1 }} />
				<Typography
					variant='h6'
					sx={{ fontWeight: 600, color: 'text.primary' }}
				>
					Filtros
				</Typography>
				{activeFiltersCount > 0 && (
					<Chip
						label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'ativo' : 'ativos'}`}
						size='small'
						color='primary'
						sx={{ ml: 'auto', fontWeight: 500 }}
					/>
				)}
			</Box>

			<Box
				sx={{
					display: 'flex',
					gap: 2,
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'center' },
					mb: 2,
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
					sx={{ flex: 1, minWidth: 260, '& .MuiFilledInput-root': { minHeight: 52 } }}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Search sx={{ color: 'text.secondary', fontSize: 22 }} />
							</InputAdornment>
						),
					}}
				/>

				<FormControl sx={{ minWidth: 200, flexShrink: 0 }}>
					<InputLabel>
						<Stack
							direction='row'
							spacing={0.5}
							alignItems='center'
						>
							<Sort sx={{ fontSize: 16 }} />
							<span>Ordenar por</span>
						</Stack>
					</InputLabel>
					<Select
						value={sortBy}
						label='Ordenar por'
						onChange={(e) => onSortChange(e.target.value)}
					>
						{SORT_OPTIONS.map((opt) => (
							<MenuItem
								key={opt.value}
								value={opt.value}
							>
								{opt.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Stack
				direction='row'
				spacing={1}
				flexWrap='wrap'
				useFlexGap
			>
				{STATUS_CHIPS.map((chip) => (
					<Chip
						key={chip.value}
						label={chip.label}
						clickable
						color={statusFilter === chip.value ? 'primary' : 'default'}
						variant={statusFilter === chip.value ? 'filled' : 'outlined'}
						onClick={() => onStatusChange(chip.value)}
						size='small'
					/>
				))}
			</Stack>
		</Box>
	);
}

export default LinksFilters;
