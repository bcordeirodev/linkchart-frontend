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

	return (
		<Box
			className="filter-container"
			sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: 2,
				p: 3,
				mb: 4,
				transition: theme.transitions.create(['transform', 'box-shadow']),
				'&:hover': {
					transform: 'translateY(-1px)',
					boxShadow: theme.shadows[8]
				}
			}}
		>
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

				<FormControl sx={{ minWidth: 180 }}>
					<InputLabel>Status do Link</InputLabel>
					<Select
						value={statusFilter}
						label="Status do Link"
						onChange={(e) => onStatusChange(e.target.value)}
					>
						<MenuItem value="all">
							<Chip
								label="Todos"
								size="small"
								color="default"
								sx={{ mr: 1, fontWeight: 500 }}
							/>
							Todos os Links
						</MenuItem>
						<MenuItem value="active">
							<Chip
								label="Ativo"
								size="small"
								color="success"
								sx={{ mr: 1, fontWeight: 500 }}
							/>
							Links Ativos
						</MenuItem>
						<MenuItem value="inactive">
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
		</Box>
	);
}

export default LinksFilters;
