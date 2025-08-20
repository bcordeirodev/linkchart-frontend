'use client';

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, useTheme } from '@mui/material';
import { Search } from '@mui/icons-material';

interface LinksFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
}

/**
 * Filtros para a listagem de links
 * Busca por texto e filtro por status
 */
export function LinksFilters({ searchTerm, onSearchChange, statusFilter, onStatusChange }: LinksFiltersProps) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				background:
					theme.palette.mode === 'dark' ? `${theme.palette.background.paper}CC` : 'rgba(255, 255, 255, 0.9)',
				backdropFilter: 'blur(20px)',
				borderRadius: 3,
				p: 3,
				mb: 4,
				border: `1px solid ${
					theme.palette.mode === 'dark' ? `${theme.palette.primary.main}20` : `${theme.palette.divider}80`
				}`,
				boxShadow:
					theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
				display: 'flex',
				gap: 3,
				flexDirection: { xs: 'column', sm: 'row' },
				alignItems: { xs: 'stretch', sm: 'center' },
				transition: 'all 0.3s ease-in-out',
				'&:hover': {
					background:
						theme.palette.mode === 'dark'
							? `${theme.palette.background.paper}E6`
							: 'rgba(255, 255, 255, 0.95)',
					boxShadow:
						theme.palette.mode === 'dark'
							? '0 12px 40px rgba(0, 0, 0, 0.5)'
							: '0 12px 40px rgba(0, 0, 0, 0.15)',
					transform: 'translateY(-2px)'
				}
			}}
		>
			<TextField
				placeholder="Buscar por título, URL ou slug..."
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
				sx={{
					flex: 1,
					minWidth: 300,
					'& .MuiOutlinedInput-root': {
						borderRadius: 3,
						background:
							theme.palette.mode === 'dark'
								? `${theme.palette.background.default}80`
								: 'rgba(255, 255, 255, 0.8)',
						transition: 'all 0.3s ease-in-out',
						border: `1px solid ${theme.palette.divider}`,
						'&:hover': {
							background:
								theme.palette.mode === 'dark'
									? `${theme.palette.background.default}CC`
									: 'rgba(255, 255, 255, 0.95)',
							transform: 'translateY(-1px)',
							boxShadow:
								theme.palette.mode === 'dark'
									? '0 4px 12px rgba(0, 0, 0, 0.3)'
									: '0 4px 12px rgba(0, 0, 0, 0.1)',
							borderColor: theme.palette.primary.main
						},
						'&.Mui-focused': {
							background:
								theme.palette.mode === 'dark'
									? theme.palette.background.default
									: 'rgba(255, 255, 255, 1)',
							boxShadow: `0 4px 20px ${theme.palette.primary.main}33`,
							borderColor: theme.palette.primary.main
						}
					}
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search sx={{ color: 'primary.main', fontSize: 20 }} />
						</InputAdornment>
					)
				}}
			/>

			<FormControl
				sx={{
					minWidth: 200,
					'& .MuiOutlinedInput-root': {
						borderRadius: 3,
						background:
							theme.palette.mode === 'dark'
								? `${theme.palette.background.default}80`
								: 'rgba(255, 255, 255, 0.8)',
						transition: 'all 0.3s ease-in-out',
						border: `1px solid ${theme.palette.divider}`,
						'&:hover': {
							background:
								theme.palette.mode === 'dark'
									? `${theme.palette.background.default}CC`
									: 'rgba(255, 255, 255, 0.95)',
							transform: 'translateY(-1px)',
							boxShadow:
								theme.palette.mode === 'dark'
									? '0 4px 12px rgba(0, 0, 0, 0.3)'
									: '0 4px 12px rgba(0, 0, 0, 0.1)',
							borderColor: theme.palette.primary.main
						},
						'&.Mui-focused': {
							background:
								theme.palette.mode === 'dark'
									? theme.palette.background.default
									: 'rgba(255, 255, 255, 1)',
							boxShadow: `0 4px 20px ${theme.palette.primary.main}33`,
							borderColor: theme.palette.primary.main
						}
					}
				}}
			>
				<InputLabel>Status</InputLabel>
				<Select
					value={statusFilter}
					label="Status"
					onChange={(e) => onStatusChange(e.target.value)}
				>
					<MenuItem value="all">Todos</MenuItem>
					<MenuItem value="active">Ativos</MenuItem>
					<MenuItem value="inactive">Inativos</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
}

export default LinksFilters;
