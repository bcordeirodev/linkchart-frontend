'use client';

import { MousePointer2 } from 'lucide-react';
import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';

import { useLinkClicks } from '@/features/links/hooks/useLinkClicks';
import { ICON_LG } from '@/lib/theme/iconDefaults';
import AnalyticsStateManager from '@/shared/ui/base/AnalyticsStateManager';
import TabDescription from '@/shared/ui/base/TabDescription';
import DataTable from '@/shared/ui/data-display/DataTable';

import type { LinkClickItem } from '@/features/links/types/click';
import type { MRT_Cell, MRT_ColumnDef, MRT_PaginationState, MRT_Row, MRT_SortingState } from 'material-react-table';

interface ClicksTableProps {
	linkId: string;
}

interface CellProps {
	row: MRT_Row<LinkClickItem>;
	cell?: MRT_Cell<LinkClickItem, unknown>;
}

const SORTABLE_COLUMNS = new Set([
	'created_at',
	'country',
	'city',
	'state',
	'device',
	'browser',
	'os',
	'ip',
	'referer'
]);

function formatDate(value: string | null): string {
	if (!value) {
		return '—';
	}

	const d = new Date(value);

	if (!isValid(d)) {
		return '—';
	}

	return format(d, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
}

function formatLocation(click: LinkClickItem): string {
	const parts = [click.city, click.state_name || click.state, click.country].filter(Boolean);
	return parts.length > 0 ? parts.join(', ') : '—';
}

function formatReferer(click: LinkClickItem): string {
	if (!click.referer || click.referer === '-') {
		return 'Direto';
	}

	return click.referer_host || click.referer;
}

function WhenCell({ row }: CellProps) {
	return (
		<Stack spacing={0.25}>
			<Typography variant='body2'>{formatDate(row.original.created_at)}</Typography>
			{row.original.timezone ? (
				<Typography
					variant='caption'
					color='text.secondary'
				>
					{row.original.timezone}
				</Typography>
			) : null}
		</Stack>
	);
}

function LocationCell({ row }: CellProps) {
	return (
		<Stack spacing={0.25}>
			<Typography variant='body2'>{formatLocation(row.original)}</Typography>
			{row.original.iso_code ? (
				<Typography
					variant='caption'
					color='text.secondary'
				>
					{row.original.iso_code}
					{row.original.continent ? ` · ${row.original.continent}` : ''}
				</Typography>
			) : null}
		</Stack>
	);
}

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

function DeviceCell({ row }: CellProps) {
	const click = row.original;
	const label = click.device || (click.is_mobile ? 'Mobile' : click.is_desktop ? 'Desktop' : '—');
	let color: ChipColor = 'default';

	if (click.is_bot) {
		color = 'warning';
	} else if (click.is_mobile || click.is_tablet) {
		color = 'info';
	}

	return (
		<Chip
			size='small'
			color={color}
			label={click.is_bot ? `Bot · ${label}` : label}
			variant='outlined'
		/>
	);
}

function BrowserCell({ row }: CellProps) {
	const { browser, browser_version: ver } = row.original;

	if (!browser) {
		return <span>—</span>;
	}

	return <span>{ver ? `${browser} ${ver}` : browser}</span>;
}

function OsCell({ row }: CellProps) {
	const { os, os_version: ver } = row.original;

	if (!os) {
		return <span>—</span>;
	}

	return <span>{ver ? `${os} ${ver}` : os}</span>;
}

function RefererCell({ row }: CellProps) {
	const label = formatReferer(row.original);

	if (label === 'Direto') {
		return (
			<Chip
				size='small'
				label='Direto'
				variant='outlined'
			/>
		);
	}

	return (
		<Tooltip
			title={row.original.referer || ''}
			arrow
		>
			<Typography
				variant='body2'
				noWrap
			>
				{label}
			</Typography>
		</Tooltip>
	);
}

function UtmCell({ row }: CellProps) {
	const utm = row.original.utm;

	if (!utm || (!utm.source && !utm.medium && !utm.campaign)) {
		return (
			<Typography
				variant='caption'
				color='text.secondary'
			>
				—
			</Typography>
		);
	}

	return (
		<Stack spacing={0.25}>
			{utm.campaign ? <Typography variant='body2'>{utm.campaign}</Typography> : null}
			<Typography
				variant='caption'
				color='text.secondary'
			>
				{[utm.source, utm.medium].filter(Boolean).join(' · ') || '—'}
			</Typography>
		</Stack>
	);
}

function IpCell({ row }: CellProps) {
	return (
		<Typography
			variant='body2'
			fontFamily='monospace'
		>
			{row.original.ip || '—'}
		</Typography>
	);
}

const COLUMNS: MRT_ColumnDef<LinkClickItem>[] = [
	{ accessorKey: 'created_at', header: 'Quando', size: 200, Cell: WhenCell },
	{
		id: 'location',
		accessorFn: (row) => formatLocation(row),
		header: 'Localização',
		enableSorting: false,
		size: 240,
		Cell: LocationCell
	},
	{ accessorKey: 'device', header: 'Dispositivo', size: 140, Cell: DeviceCell },
	{ accessorKey: 'browser', header: 'Navegador', size: 160, Cell: BrowserCell },
	{ accessorKey: 'os', header: 'Sistema', size: 140, Cell: OsCell },
	{
		id: 'referer',
		accessorFn: (row) => formatReferer(row),
		header: 'Origem',
		size: 200,
		Cell: RefererCell
	},
	{
		id: 'utm',
		header: 'Campanha (UTM)',
		enableSorting: false,
		size: 220,
		accessorFn: (row) => row.utm?.campaign || '',
		Cell: UtmCell
	},
	{ accessorKey: 'ip', header: 'IP', size: 140, Cell: IpCell }
];

export function ClicksTable({ linkId }: ClicksTableProps) {
	const { items, meta, loading, error, params, setPage, setPerPage, setSearch, setSort, refresh } = useLinkClicks({
		linkId
	});

	const [pagination, setPagination] = useState<MRT_PaginationState>({
		pageIndex: params.page - 1,
		pageSize: params.per_page
	});
	const [sorting, setSorting] = useState<MRT_SortingState>([
		{ id: params.sort_by, desc: params.sort_dir === 'desc' }
	]);
	const [globalFilter, setGlobalFilter] = useState('');

	useEffect(() => {
		setPage(pagination.pageIndex + 1);
		setPerPage(pagination.pageSize);
	}, [pagination, setPage, setPerPage]);

	useEffect(() => {
		const sort = sorting[0];

		if (sort && SORTABLE_COLUMNS.has(sort.id)) {
			setSort(sort.id, sort.desc ? 'desc' : 'asc');
		}
	}, [sorting, setSort]);

	useEffect(() => {
		const handle = setTimeout(() => setSearch(globalFilter ?? ''), 350);
		return () => clearTimeout(handle);
	}, [globalFilter, setSearch]);

	const total = meta?.total ?? 0;
	const columns = useMemo(() => COLUMNS, []);
	const isInitialLoading = loading && items.length === 0;

	return (
		<Box>
			<Box sx={{ mb: 3 }}>
				<TabDescription
					icon={<MousePointer2 {...ICON_LG} />}
					title='Cliques do Link'
					description='Lista detalhada de cada acesso registrado: origem, localização, dispositivo, navegador e UTM.'
					highlight={`${total} clique${total === 1 ? '' : 's'} registrado${total === 1 ? '' : 's'}`}
				/>
			</Box>

			<AnalyticsStateManager
				loading={isInitialLoading}
				error={error}
				hasData={items.length > 0 || loading}
				onRetry={refresh}
				loadingMessage='Carregando cliques...'
				emptyMessage='Este link ainda não recebeu cliques.'
				minHeight={300}
			>
				<DataTable<LinkClickItem>
					columns={columns}
					data={items}
					manualPagination
					manualSorting
					manualFiltering
					rowCount={total}
					state={{
						pagination,
						sorting,
						globalFilter,
						isLoading: loading,
						showProgressBars: loading
					}}
					onPaginationChange={setPagination}
					onSortingChange={setSorting}
					onGlobalFilterChange={setGlobalFilter}
					enableRowSelection={false}
					enableRowActions={false}
					enableGrouping={false}
					enableColumnFilters={false}
					muiPaginationProps={{
						color: 'secondary',
						rowsPerPageOptions: [10, 25, 50, 100],
						shape: 'rounded',
						variant: 'outlined',
						showRowsPerPage: true
					}}
					muiSearchTextFieldProps={{
						placeholder: 'Buscar por país, cidade, IP, navegador...',
						sx: { minWidth: '320px' },
						variant: 'outlined',
						size: 'small'
					}}
				/>
			</AnalyticsStateManager>
		</Box>
	);
}

export default ClicksTable;
