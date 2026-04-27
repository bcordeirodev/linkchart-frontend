// src/pages/links/LinkListPage.tsx
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { LinkMetrics } from '@/features/links/components/LinkMetrics';
import {
	LinkDetailDrawer,
	LinksEmptyState,
	LinksFilters,
	LinksHeader,
	LinksMobileCards,
	useLinksTableColumns
} from '@/features/links/components/list';
import { useLinks } from '@/features/links/hooks/useLinks';
import { useResponsive } from '@/lib/theme';
import { LinkListSkeleton } from '@/shared/ui/feedback/skeletons';
import MainLayout from '@/shared/layout/MainLayout';
import { ResponsiveContainer } from '@/shared/ui/base';
import type { LinkResponse } from '@/types';

import AuthGuardRedirect from '../../lib/auth/AuthGuardRedirect';
import DataTable from '../../shared/ui/data-display/DataTable';

function LinkListPage() {
	const { isMobile } = useResponsive();
	const { links, loading, deleteLink } = useLinks();
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [drawerLink, setDrawerLink] = useState<LinkResponse | null>(null);

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

	const columns = useLinksTableColumns({ onDelete: deleteLink });

	if (loading) {
		return (
			<AuthGuardRedirect auth={['user', 'admin']}>
				<MainLayout>
					<LinkListSkeleton
						isMobile={isMobile}
						count={6}
					/>
				</MainLayout>
			</AuthGuardRedirect>
		);
	}

	return (
		<AuthGuardRedirect auth={['user', 'admin']}>
			<MainLayout>
				<ResponsiveContainer variant='page'>
					<LinksHeader />

					<LinkMetrics
						linksData={links}
						showTitle={false}
					/>

					<LinksFilters
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
						statusFilter={statusFilter}
						onStatusChange={setStatusFilter}
					/>

					{filteredLinks.length === 0 ? (
						<LinksEmptyState
							hasActiveFilters={Boolean(searchTerm) || statusFilter !== 'all'}
							onClearFilters={() => {
								setSearchTerm('');
								setStatusFilter('all');
							}}
						/>
					) : isMobile ? (
						<LinksMobileCards
							data={filteredLinks}
							loading={loading}
							onDelete={deleteLink}
						/>
					) : (
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
								initialState={{
									pagination: { pageIndex: 0, pageSize: 10 }
								}}
								muiTableBodyRowProps={({ row }) => ({
									onClick: () => setDrawerLink(row.original),
									sx: { cursor: 'pointer' }
								})}
								muiTableContainerProps={{
									sx: { maxWidth: '100%', overflowX: 'auto' }
								}}
								muiTableProps={{
									sx: {
										tableLayout: 'auto',
										'& .MuiTableCell-root': {
											padding: { xs: '10px 8px', md: '14px 16px' }
										},
										'& .MuiTableRow-root': {
											height: 56
										}
									}
								}}
							/>
						</Box>
					)}
				</ResponsiveContainer>

				<LinkDetailDrawer
					link={drawerLink}
					onClose={() => setDrawerLink(null)}
				/>
			</MainLayout>
		</AuthGuardRedirect>
	);
}

export default LinkListPage;
