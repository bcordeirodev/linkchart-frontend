import { Box, Alert } from '@mui/material';
import { useMemo, useState } from 'react';

import { DashboardMetrics } from '@/features/analytics/components/dashboard/DashboardMetrics';
import { LinksFilters, LinksHeader, LinksMobileCards, useLinksTableColumns } from '@/features/links/components/list';
import { useLinks } from '@/features/links/hooks/useLinks';
import { useResponsive } from '@/lib/theme';
import { LinkListSkeleton } from '@/shared/ui/feedback/skeletons';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
import DataTable from '../../shared/ui/data-display/DataTable';


/**
 * Página de listagem de links refatorada
 * Componentizada para melhor organização
 */
function LinkPage() {
	const { isMobile, isTablet, isLargeScreen } = useResponsive();
	const { links, loading, deleteLink } = useLinks();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	// Filtrar links
	const filteredLinks = useMemo(() => {
		return links.filter((link) => {
			const matchesSearch =
				link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(link.slug || link.custom_slug)?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && link.is_active) ||
				(statusFilter === 'inactive' && !link.is_active);

			return matchesSearch && matchesStatus;
		});
	}, [links, searchTerm, statusFilter]);

	// Colunas da tabela (hook customizado)
	const columns = useLinksTableColumns({ onDelete: deleteLink });

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<LinkListSkeleton isMobile={isMobile} count={5} />
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer variant='page'>
					<LinksHeader />

					<DashboardMetrics
						linksData={links}
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
							severity='info'
							sx={{ mt: 2 }}
						>
							{searchTerm || statusFilter !== 'all'
								? 'Nenhum link encontrado com os filtros aplicados.'
								: 'Nenhum link criado ainda. Clique em "Criar Novo Link" para começar.'}
						</Alert>
					) : (
						<>
							{/* Mobile: Cards otimizados */}
							{isMobile ? (
								<LinksMobileCards
									data={filteredLinks}
									loading={loading}
									onDelete={deleteLink}
								/>
							) : (
								/* Desktop/Tablet: Tabela responsiva */
								<Box sx={{ width: '100%', overflowX: 'auto' }}>
									<DataTable
										data={filteredLinks}
										columns={columns}
										enableRowSelection={false}
										enableRowActions={false}
										enableSelectAll={false}
										enableColumnFilters={false}
										enableGlobalFilter={false}
										enableColumnResizing={false}
										enableColumnOrdering={false}
										enableHiding
										displayColumnDefOptions={{
											'mrt-row-actions': {
												size: 0
											},
											'mrt-row-select': {
												size: 0
											}
										}}
										initialState={{
											pagination: {
												pageIndex: 0,
												pageSize: 10
											},
											columnVisibility: {
												// Esconder colunas de sistema do MRT
												'mrt-row-actions': false,
												'mrt-row-select': false,
												'mrt-row-expand': false,
												// Responsividade inteligente baseada em breakpoints
												original_url: isLargeScreen, // Apenas em telas grandes (>1280px)
												created_at: !isTablet, // Não mostrar em tablet (<960px)
												is_active: !isMobile, // Apenas desktop/tablet
												clicks: true // Sempre mostrar
											},
											density: 'comfortable'
										}}
										muiTableContainerProps={{
											sx: {
												maxWidth: '100%',
												overflowX: 'auto'
											}
										}}
										muiTableProps={{
											sx: {
												tableLayout: 'auto',
												width: '100%',
												'& .MuiTableCell-root': {
													padding: { xs: '8px 4px', sm: '10px 8px', md: '12px 12px' },
													fontSize: { xs: '0.813rem', sm: '0.875rem' }
												},
												'& .MuiTableHead-root': {
													'& .MuiTableCell-root': {
														fontWeight: 700,
														fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' }
													}
												}
											}
										}}
									/>
								</Box>
							)}
						</>
					)}
				</ResponsiveContainer>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkPage;
