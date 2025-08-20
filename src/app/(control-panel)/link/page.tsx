'use client';

import { useMemo, useState } from 'react';
import { Box, Alert, useMediaQuery, useTheme } from '@mui/material';
import { type MRT_RowSelectionState } from 'material-react-table';
import FuseLoading from '@fuse/core/FuseLoading';
import DataTable from 'src/components/data-table/DataTable';

import { useLinks } from '@/hooks/useLinks';
import { LinksHeader } from '@/components/link/LinksHeader';
import { UnifiedMetrics } from '@/components/unified-analytics/metrics/UnifiedMetrics';
import { LinksFilters } from '@/components/link/LinksFilters';
import { useLinksTableColumns } from '@/hooks/useLinksTableColumns';

/**
 * Página de listagem de links refatorada
 * Componentizada para melhor organização
 */
function LinksPage() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.down('md'));
	const isLaptop = useMediaQuery(theme.breakpoints.down('lg'));

	const { links, loading, deleteLink } = useLinks();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

	// Filtrar links
	const filteredLinks = useMemo(() => {
		return links.filter((link) => {
			const matchesSearch =
				link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
				link.slug?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && link.is_active) ||
				(statusFilter === 'inactive' && !link.is_active);

			return matchesSearch && matchesStatus;
		});
	}, [links, searchTerm, statusFilter]);

	// Métricas calculadas
	const totalLinks = links.length;
	const activeLinks = links.filter((link) => link.is_active).length;
	const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
	const avgClicksPerLink = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

	// Colunas da tabela (hook customizado)
	const columns = useLinksTableColumns({ onDelete: deleteLink });

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<Box sx={{ p: 3, maxWidth: '100%', overflow: 'hidden' }}>
			<LinksHeader />

			<UnifiedMetrics
				data={null}
				linksData={links}
				categories={['dashboard']}
				showTitle={false}
			/>

			<LinksFilters
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				statusFilter={statusFilter}
				onStatusChange={setStatusFilter}
			/>

			{filteredLinks.length === 0 && !loading ? (
				<Alert
					severity="info"
					sx={{ mt: 2 }}
				>
					{searchTerm || statusFilter !== 'all'
						? 'Nenhum link encontrado com os filtros aplicados.'
						: 'Nenhum link criado ainda. Clique em "Criar Novo Link" para começar.'}
				</Alert>
			) : (
				<Box sx={{ width: '100%', overflowX: 'auto' }}>
					<DataTable
						data={filteredLinks}
						columns={columns}
						enableRowSelection
						state={{
							rowSelection
						}}
						onRowSelectionChange={setRowSelection}
						enableColumnFilters={false}
						enableGlobalFilter={false}
						enableColumnResizing={true}
						columnResizeMode="onChange"
						enableColumnOrdering={false}
						enableHiding={true}
						initialState={{
							pagination: {
								pageIndex: 0,
								pageSize: 10
							},
							columnVisibility: {
								// Responsividade baseada em breakpoints do Material-UI
								original_url: !isLaptop, // Ocultar em laptops pequenos e menores
								created_at: !isTablet, // Ocultar em tablets e menores
								is_active: !isMobile // Ocultar apenas em mobile
							},
							density: 'comfortable'
						}}
						muiTableContainerProps={{
							sx: {
								maxWidth: '100%',
								overflowX: 'auto',
								'& .MuiTable-root': {
									minWidth: isMobile ? '800px' : '100%'
								}
							}
						}}
						muiTableProps={{
							sx: {
								tableLayout: 'auto',
								width: '100%',
								'& .MuiTableCell-root': {
									padding: '12px 8px'
								}
							}
						}}
					/>
				</Box>
			)}
		</Box>
	);
}

export default LinksPage;
