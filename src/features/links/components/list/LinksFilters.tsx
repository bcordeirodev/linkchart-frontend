import { Search, ArrowUpDown } from 'lucide-react';
import { ICON_SM, ICON_LG } from '@/lib/theme/iconDefaults';
import {
	Box,
	Chip,
	Divider,
	FormControl,
	InputAdornment,
	MenuItem,
	Select,
	Stack,
	TextField,
	useTheme
} from '@mui/material';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { radiusTokens } from '@/lib/theme/designSystem';

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
	onSortChange
}: LinksFiltersProps) {
	const theme = useTheme();
	const { t } = useTranslation('links');
	const [localSearch, setLocalSearch] = useState(searchTerm);

	const STATUS_CHIPS = [
		{ value: 'all', label: t('filters.all') },
		{ value: 'active', label: t('status.active') },
		{ value: 'inactive', label: t('status.inactive') },
		{ value: 'scheduled', label: t('status.scheduled') },
		{ value: 'expired', label: t('status.expired') }
	];

	const SORT_OPTIONS = [
		{ value: 'created_at', label: t('filters.sortNewest') },
		{ value: 'clicks', label: t('filters.sortMostClicks') },
		{ value: 'trend', label: t('filters.mostTrend') },
		{ value: 'last_activity', label: t('filters.lastActivity') }
	];

	const debouncedSearch = useMemo(() => debounce((value: string) => onSearchChange(value), 200), [onSearchChange]);

	useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);
	useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: `${radiusTokens.lg}px`,
				border: `1px solid ${theme.palette.divider}`,
				mb: 3,
				overflow: 'hidden'
			}}
		>
			{/* Linha 1: busca + ordenação */}
			<Box
				sx={{
					display: 'flex',
					gap: 0,
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: 'stretch'
				}}
			>
				<TextField
					variant='outlined'
					placeholder={t('filters.search')}
					value={localSearch}
					onChange={(e) => {
						setLocalSearch(e.target.value);
						debouncedSearch(e.target.value);
					}}
					fullWidth
					size='small'
					sx={{
						flex: 1,
						'& .MuiOutlinedInput-root': {
							borderRadius: 0,
							border: 'none',
							'& fieldset': { border: 'none' },
							'&:hover fieldset': { border: 'none' },
							'&.Mui-focused fieldset': { border: 'none' },
							fontSize: '0.875rem',
							minHeight: 48
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Search
									{...ICON_LG}
									style={{ opacity: 0.5 }}
								/>
							</InputAdornment>
						)
					}}
				/>

				<Divider
					orientation='vertical'
					flexItem
					sx={{ display: { xs: 'none', sm: 'block' } }}
				/>
				<Divider
					orientation='horizontal'
					sx={{ display: { xs: 'block', sm: 'none' } }}
				/>

				<FormControl
					size='small'
					sx={{ minWidth: 180, flexShrink: 0 }}
				>
					<Select
						value={sortBy}
						onChange={(e) => onSortChange(e.target.value)}
						displayEmpty
						renderValue={(val) => {
							const opt = SORT_OPTIONS.find((o) => o.value === val);
							return (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
									<ArrowUpDown {...ICON_SM} />
									<span>{opt?.label ?? t('filters.sortBy')}</span>
								</Box>
							);
						}}
						sx={{
							borderRadius: 0,
							'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
							'&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
							fontSize: '0.875rem',
							minHeight: 48
						}}
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

			<Divider />

			{/* Linha 2: chips de status */}
			<Stack
				direction='row'
				spacing={0.75}
				flexWrap='wrap'
				useFlexGap
				sx={{ px: 2, py: 1.5 }}
			>
				{STATUS_CHIPS.map((chip) => (
					<Chip
						key={chip.value}
						label={chip.label}
						clickable
						size='small'
						color={statusFilter === chip.value ? 'primary' : 'default'}
						variant={statusFilter === chip.value ? 'filled' : 'outlined'}
						onClick={() => onStatusChange(chip.value)}
						sx={{
							borderRadius: '6px',
							fontWeight: statusFilter === chip.value ? 600 : 400,
							fontSize: '0.75rem'
						}}
					/>
				))}
			</Stack>
		</Box>
	);
}

export default LinksFilters;
