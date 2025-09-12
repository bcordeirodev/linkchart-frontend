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
import { Search, FilterList } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { createGlassCard } from '@/lib/theme';
import EnhancedPaper from '@/shared/ui/base/EnhancedPaper';

interface LinksFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
}

/**
 * Filtros para a listagem de links - melhorados
 * Busca por texto e filtro por status com design padronizado
 */
export function LinksFilters({ searchTerm, onSearchChange, statusFilter, onStatusChange }: LinksFiltersProps) {
	const theme = useTheme();

	const getStatusLabel = (status: string) => {
		const labels = {
			all: 'Todos os Links',
			active: 'Links Ativos',
			inactive: 'Links Inativos'
		};
		return labels[status as keyof typeof labels] || status;
	};

	const getStatusColor = (status: string) => {
		const colors = {
			all: 'default',
			active: 'success',
			inactive: 'warning'
		};
		return colors[status as keyof typeof colors] || 'default';
	};

	const glassCardStyles = createGlassCard(theme);

	return (
		<EnhancedPaper variant="glass" animated sx={{ p: 3, mb: 4 }}>
			{/* Header dos filtros */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<FilterList sx={{ color: 'primary.main', mr: 1 }} />
				<Typography
					variant="h6"
					sx={{
						fontWeight: 600,
						color: 'text.primary',
						fontFamily: 'Inter, system-ui, sans-serif'
					}}
				>
					Filtros
				</Typography>
				{(searchTerm || statusFilter !== 'all') && (
					<Chip
						label={`${searchTerm ? '1' : '0'} filtro${searchTerm ? '' : 's'} ativo${searchTerm ? '' : 's'}`}
						size="small"
						color="primary"
						sx={{ ml: 'auto', fontWeight: 500 }}
					/>
				)}
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
					variant="filled"
					placeholder="Buscar por título, URL ou slug..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					fullWidth
					sx={{
						flex: 1,
						minWidth: 300,
						'& .MuiFilledInput-root': {
							minHeight: 52
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search
									sx={{
										color: 'primary.main',
										fontSize: 22,
										opacity: 0.7
									}}
								/>
							</InputAdornment>
						)
					}}
				/>

				<FormControl
					sx={{
						minWidth: 180,
						'& .MuiFilledInput-root': {
							borderRadius: '12px',
							backgroundColor:
								theme.palette.mode === 'dark'
									? alpha(theme.palette.background.default, 0.6)
									: alpha('#ffffff', 0.8),
							border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							'&:hover': {
								backgroundColor:
									theme.palette.mode === 'dark'
										? alpha(theme.palette.background.default, 0.8)
										: alpha('#ffffff', 0.95),
								borderColor: alpha(theme.palette.primary.main, 0.5),
								boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
							},
							'&.Mui-focused': {
								backgroundColor:
									theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff',
								borderColor: theme.palette.primary.main,
								boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
							},
							'& fieldset': {
								border: 'none'
							}
						},
						'& .MuiInputLabel-root': {
							fontFamily: 'Inter, system-ui, sans-serif',
							fontWeight: 500
						},
						'& .MuiSelect-select': {
							fontFamily: 'Inter, system-ui, sans-serif',
							fontWeight: 500
						}
					}}
				>
					<InputLabel>Status do Link</InputLabel>
					<Select
						value={statusFilter}
						label="Status do Link"
						onChange={(e) => onStatusChange(e.target.value)}
					>
						<MenuItem
							value="all"
							sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}
						>
							<Chip
								label="Todos"
								size="small"
								color="default"
								sx={{ mr: 1, fontWeight: 500 }}
							/>
							Todos os Links
						</MenuItem>
						<MenuItem
							value="active"
							sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}
						>
							<Chip
								label="Ativo"
								size="small"
								color="success"
								sx={{ mr: 1, fontWeight: 500 }}
							/>
							Links Ativos
						</MenuItem>
						<MenuItem
							value="inactive"
							sx={{ fontFamily: 'Inter, system-ui, sans-serif' }}
						>
							<Chip
								label="Inativo"
								size="small"
								color="warning"
								sx={{ mr: 1, fontWeight: 500 }}
							/>
							Links Inativos
						</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</EnhancedPaper>
	);
}

export default LinksFilters;
