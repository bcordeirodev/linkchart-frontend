# Links Listing Visual Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the links listing page to show 5 essential columns, open a detail drawer on row click, and replace 5 color-coded icon buttons with 2 inline primary actions + a `⋯` menu.

**Architecture:** Extract a `getLinkStatus` utility, create `LinkActionsInline` and `LinkActionsMenu` components, build a `LinkDetailDrawer`, slim `useLinksTableColumns` from 446 to ~130 lines, and add drawer state to `LinkListPage`. No new hooks, no new design tokens.

**Tech Stack:** React 18, TypeScript, MUI v6, material-react-table (MRT), react-icons/hi2, Vite

> **Note:** The frontend has no automated test suite. Verification steps use `npm run type-check` for TypeScript correctness, plus visual checks in the browser (`npm run dev` at http://localhost:3000).

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `src/features/links/utils/linkStatus.ts` | `getLinkStatus()` + `STATUS_MAP` shared by table and drawer |
| Create | `src/features/links/components/list/LinkActionsInline.tsx` | Analytics + Copy inline buttons |
| Create | `src/features/links/components/list/LinkActionsMenu.tsx` | `⋯` menu: Edit / QR / Delete |
| Create | `src/features/links/components/list/LinkDetailDrawer.tsx` | Side drawer with full link details |
| Modify | `src/features/links/components/list/useLinksTableColumns.tsx` | Slim to 5 columns, use new components |
| Modify | `src/features/links/components/list/index.ts` | Export new components |
| Modify | `src/pages/links/LinkListPage.tsx` | Add `drawerLink` state + row click |

---

## Task 1 — `getLinkStatus` utility

**Files:**
- Create: `src/features/links/utils/linkStatus.ts`

- [ ] **Step 1: Create the utility file**

```typescript
// src/features/links/utils/linkStatus.ts
import type { LinkResponse } from '@/types';

export type LinkStatus = 'active' | 'inactive' | 'scheduled' | 'expired';

export const STATUS_MAP: Record<LinkStatus, { color: string; label: string }> = {
  active:    { color: 'success.main', label: 'Ativo' },
  inactive:  { color: 'error.main',   label: 'Inativo' },
  scheduled: { color: 'warning.main', label: 'Não iniciado' },
  expired:   { color: 'error.main',   label: 'Expirado' },
};

export function getLinkStatus(link: LinkResponse): LinkStatus {
  const now = new Date();
  if (link.starts_in && new Date(link.starts_in) > now) return 'scheduled';
  if (link.expires_at && new Date(link.expires_at) < now) return 'expired';
  return link.is_active ? 'active' : 'inactive';
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/links/utils/linkStatus.ts
git commit -m "feat(links): add getLinkStatus utility"
```

---

## Task 2 — `LinkActionsInline` component

**Files:**
- Create: `src/features/links/components/list/LinkActionsInline.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkActionsInline.tsx
import { CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { HiChartBar, HiClipboardDocument } from 'react-icons/hi2';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/shared/hooks/useClipboard';

interface LinkActionsInlineProps {
	shortUrl: string;
	onAnalytics: () => void;
}

export function LinkActionsInline({ shortUrl, onAnalytics }: LinkActionsInlineProps) {
	const dispatch = useAppDispatch();
	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () =>
			dispatch(showMessage({ message: 'Link copiado!', variant: 'success' })),
	});

	return (
		<Stack
			direction='row'
			spacing={0.5}
			alignItems='center'
		>
			<Tooltip title='Ver Analytics'>
				<IconButton
					size='small'
					onClick={(e) => {
						e.stopPropagation();
						onAnalytics();
					}}
					sx={{
						color: 'text.secondary',
						'&:hover': { color: 'success.main', bgcolor: 'rgba(46, 125, 50, 0.08)' },
					}}
				>
					<HiChartBar size={18} />
				</IconButton>
			</Tooltip>

			<Tooltip title={copied ? 'Copiado!' : 'Copiar URL'}>
				<IconButton
					size='small'
					onClick={(e) => {
						e.stopPropagation();
						copy(shortUrl);
					}}
					sx={{
						color: 'text.secondary',
						'&:hover': { color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.08)' },
					}}
				>
					{copied ? (
						<CircularProgress
							size={14}
							color='primary'
						/>
					) : (
						<HiClipboardDocument size={18} />
					)}
				</IconButton>
			</Tooltip>
		</Stack>
	);
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

---

## Task 3 — `LinkActionsMenu` component

**Files:**
- Create: `src/features/links/components/list/LinkActionsMenu.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkActionsMenu.tsx
import { useState } from 'react';
import {
	Divider,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material';
import { HiEllipsisVertical, HiPencilSquare, HiQrCode, HiTrash } from 'react-icons/hi2';

interface LinkActionsMenuProps {
	onEdit: () => void;
	onQR: () => void;
	onDelete: () => void;
}

export function LinkActionsMenu({ onEdit, onQR, onDelete }: LinkActionsMenuProps) {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setAnchor(e.currentTarget);
	};

	const handleClose = () => setAnchor(null);

	const run = (action: () => void) => {
		handleClose();
		action();
	};

	return (
		<>
			<Tooltip title='Mais ações'>
				<IconButton
					size='small'
					onClick={handleOpen}
					sx={{
						color: 'text.secondary',
						'&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
					}}
				>
					<HiEllipsisVertical size={18} />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchor}
				open={Boolean(anchor)}
				onClose={handleClose}
				onClick={(e) => e.stopPropagation()}
			>
				<MenuItem onClick={() => run(onEdit)}>
					<ListItemIcon>
						<HiPencilSquare size={16} />
					</ListItemIcon>
					<ListItemText>Editar</ListItemText>
				</MenuItem>

				<MenuItem onClick={() => run(onQR)}>
					<ListItemIcon>
						<HiQrCode size={16} />
					</ListItemIcon>
					<ListItemText>QR Code</ListItemText>
				</MenuItem>

				<Divider />

				<MenuItem
					onClick={() => run(onDelete)}
					sx={{ color: 'error.main' }}
				>
					<ListItemIcon sx={{ color: 'error.main' }}>
						<HiTrash size={16} />
					</ListItemIcon>
					<ListItemText>Excluir</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit Tasks 2 and 3**

```bash
git add src/features/links/components/list/LinkActionsInline.tsx \
        src/features/links/components/list/LinkActionsMenu.tsx
git commit -m "feat(links): add LinkActionsInline and LinkActionsMenu components"
```

---

## Task 4 — Refactor `useLinksTableColumns`

**Files:**
- Modify: `src/features/links/components/list/useLinksTableColumns.tsx`

- [ ] **Step 1: Replace entire file content**

```tsx
// src/features/links/components/list/useLinksTableColumns.tsx
import { Box, Stack, Typography } from '@mui/material';
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';

import { LinkActionsInline } from './LinkActionsInline';
import { LinkActionsMenu } from './LinkActionsMenu';

import type { LinkResponse } from '@/types';
import type { MRT_ColumnDef } from 'material-react-table';

interface UseLinksTableColumnsProps {
	onDelete: (id: string) => Promise<void>;
}

export function useLinksTableColumns({ onDelete }: UseLinksTableColumnsProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleDelete = useCallback(
		async (id: string) => {
			if (window.confirm('Tem certeza que deseja remover este link? Esta ação não pode ser desfeita.')) {
				try {
					await onDelete(id);
				} catch {
					dispatch(showMessage({ message: 'Erro ao excluir o link.', variant: 'error' }));
				}
			}
		},
		[onDelete, dispatch]
	);

	const columns = useMemo<MRT_ColumnDef<LinkResponse>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Link',
				size: 220,
				minSize: 160,
				grow: true,
				Cell: ({ row }) => (
					<Box>
						<Typography
							variant='body2'
							sx={{ fontWeight: 600 }}
						>
							{row.original.title || 'Sem título'}
						</Typography>
						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ fontFamily: 'monospace' }}
						>
							{row.original.slug || row.original.custom_slug}
						</Typography>
					</Box>
				),
			},
			{
				accessorKey: 'short_url',
				header: 'URL Encurtada',
				size: 220,
				minSize: 160,
				grow: true,
				Cell: ({ cell }) => (
					<Box
						sx={{
							display: 'inline-block',
							px: 1,
							py: 0.5,
							bgcolor: 'rgba(25, 118, 210, 0.08)',
							borderRadius: 1,
							fontFamily: 'monospace',
							fontSize: '0.8125rem',
							color: 'primary.main',
							fontWeight: 600,
							maxWidth: 200,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
						title={cell.getValue<string>()}
					>
						{cell.getValue<string>()}
					</Box>
				),
			},
			{
				accessorKey: 'clicks',
				header: 'Clicks',
				size: 90,
				minSize: 70,
				Cell: ({ cell }) => (
					<Typography
						variant='subtitle2'
						sx={{ fontWeight: 700 }}
					>
						{cell.getValue<number>() ?? 0}
					</Typography>
				),
			},
			{
				accessorKey: 'is_active',
				header: 'Status',
				size: 120,
				minSize: 100,
				Cell: ({ row }) => {
					const status = getLinkStatus(row.original);
					const { color, label } = STATUS_MAP[status];
					return (
						<Stack
							direction='row'
							spacing={0.75}
							alignItems='center'
						>
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor: color,
									flexShrink: 0,
								}}
							/>
							<Typography variant='caption'>{label}</Typography>
						</Stack>
					);
				},
			},
			{
				id: 'actions',
				header: 'Ações',
				size: 130,
				minSize: 110,
				enableSorting: false,
				Cell: ({ row }) => {
					const link = row.original;
					const id = String(link.id);
					return (
						<Stack
							direction='row'
							spacing={0.25}
							alignItems='center'
							onClick={(e) => e.stopPropagation()}
						>
							<LinkActionsInline
								shortUrl={link.short_url}
								onAnalytics={() => navigate(`/link/analytic/${id}`)}
							/>
							<LinkActionsMenu
								onEdit={() => navigate(`/link/edit/${id}`)}
								onQR={() => navigate(`/link/qr/${id}`)}
								onDelete={() => handleDelete(id)}
							/>
						</Stack>
					);
				},
			},
		],
		[navigate, handleDelete]
	);

	return columns;
}

export default useLinksTableColumns;
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/links/components/list/useLinksTableColumns.tsx \
        src/features/links/utils/linkStatus.ts
git commit -m "refactor(links): slim useLinksTableColumns to 5 columns"
```

---

## Task 5 — `LinkDetailDrawer` component

**Files:**
- Create: `src/features/links/components/list/LinkDetailDrawer.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/features/links/components/list/LinkDetailDrawer.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	HiChartBar,
	HiClipboardDocument,
	HiPencilSquare,
	HiXMark,
} from 'react-icons/hi2';

import { getLinkStatus, STATUS_MAP } from '@/features/links/utils/linkStatus';
import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/shared/hooks/useClipboard';
import type { LinkResponse } from '@/types';

interface LinkDetailDrawerProps {
	link: LinkResponse | null;
	onClose: () => void;
}

function formatDate(value: string | null | undefined): string {
	if (!value) return '—';
	try {
		return new Date(value).toLocaleDateString('pt-BR');
	} catch {
		return '—';
	}
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<Typography
			variant='caption'
			color='text.secondary'
			sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, mb: 1, display: 'block' }}
		>
			{children}
		</Typography>
	);
}

export function LinkDetailDrawer({ link, onClose }: LinkDetailDrawerProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [urlExpanded, setUrlExpanded] = useState(false);

	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'URL copiada!', variant: 'success' })),
	});

	if (!link) return null;

	const status = getLinkStatus(link);
	const { color: statusColor, label: statusLabel } = STATUS_MAP[status];
	const hasSchedule = !!(link.starts_in || link.expires_at);
	const hasUtm = !!(
		link.utm_source ||
		link.utm_medium ||
		link.utm_campaign ||
		link.utm_term ||
		link.utm_content
	);

	const goTo = (path: string) => {
		onClose();
		navigate(path);
	};

	return (
		<Drawer
			key={String(link.id)}
			anchor='right'
			open={!!link}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: 400 },
					display: 'flex',
					flexDirection: 'column',
				},
			}}
		>
			{/* Header */}
			<Box
				sx={{
					px: 3,
					pt: 2,
					pb: 1.5,
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					flexShrink: 0,
				}}
			>
				<Box>
					<Typography
						variant='h6'
						sx={{ fontWeight: 700, lineHeight: 1.2 }}
					>
						{link.slug || link.custom_slug}
					</Typography>
					<Stack
						direction='row'
						spacing={0.75}
						alignItems='center'
						sx={{ mt: 0.5 }}
					>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								bgcolor: statusColor,
								flexShrink: 0,
							}}
						/>
						<Typography
							variant='caption'
							color='text.secondary'
						>
							{statusLabel}
						</Typography>
					</Stack>
				</Box>
				<IconButton
					size='small'
					onClick={onClose}
					sx={{ ml: 1, mt: -0.5 }}
				>
					<HiXMark size={18} />
				</IconButton>
			</Box>

			<Divider />

			{/* Scrollable body */}
			<Box
				sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}
			>
				{/* URL Original */}
				<Box sx={{ mb: 2 }}>
					<SectionLabel>URL Original</SectionLabel>
					<Typography
						variant='body2'
						sx={{
							wordBreak: 'break-all',
							...(urlExpanded
								? {}
								: {
										display: '-webkit-box',
										WebkitLineClamp: 2,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
									}),
						}}
					>
						{link.original_url}
					</Typography>
					{link.original_url.length > 80 && (
						<Typography
							variant='caption'
							color='primary'
							sx={{ cursor: 'pointer', mt: 0.5, display: 'block' }}
							onClick={() => setUrlExpanded((v) => !v)}
						>
							{urlExpanded ? 'ver menos' : 'ver completa'}
						</Typography>
					)}
				</Box>

				{/* URL Encurtada */}
				<Box sx={{ mb: 2 }}>
					<SectionLabel>URL Encurtada</SectionLabel>
					<Stack
						direction='row'
						alignItems='center'
						spacing={1}
					>
						<Box
							sx={{
								flex: 1,
								px: 1.5,
								py: 0.75,
								bgcolor: 'rgba(25, 118, 210, 0.08)',
								borderRadius: 1,
								fontFamily: 'monospace',
								fontSize: '0.8125rem',
								color: 'primary.main',
								fontWeight: 600,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{link.short_url}
						</Box>
						<Tooltip title={copied ? 'Copiado!' : 'Copiar'}>
							<IconButton
								size='small'
								onClick={() => copy(link.short_url)}
							>
								<HiClipboardDocument size={16} />
							</IconButton>
						</Tooltip>
					</Stack>
				</Box>

				<Divider sx={{ my: 1.5 }} />

				{/* Estatísticas */}
				<Box sx={{ mb: 2 }}>
					<SectionLabel>Estatísticas</SectionLabel>
					<Stack
						direction='row'
						spacing={4}
					>
						<Box>
							<Typography
								variant='h5'
								sx={{ fontWeight: 700 }}
							>
								{link.clicks ?? 0}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Clicks totais
							</Typography>
						</Box>
						<Box>
							<Typography
								variant='h5'
								sx={{ fontWeight: 700 }}
							>
								{link.click_limit ?? '∞'}
							</Typography>
							<Typography
								variant='caption'
								color='text.secondary'
							>
								Limite
							</Typography>
						</Box>
					</Stack>
				</Box>

				{/* Agendamento */}
				{hasSchedule && (
					<>
						<Divider sx={{ my: 1.5 }} />
						<Box sx={{ mb: 2 }}>
							<SectionLabel>Agendamento</SectionLabel>
							<Stack
								direction='row'
								spacing={4}
							>
								<Box>
									<Typography
										variant='caption'
										color='text.secondary'
										display='block'
									>
										Início
									</Typography>
									<Typography
										variant='body2'
										sx={{ fontWeight: 600 }}
									>
										{formatDate(link.starts_in)}
									</Typography>
								</Box>
								<Box>
									<Typography
										variant='caption'
										color='text.secondary'
										display='block'
									>
										Término
									</Typography>
									<Typography
										variant='body2'
										sx={{ fontWeight: 600 }}
									>
										{formatDate(link.expires_at)}
									</Typography>
								</Box>
							</Stack>
						</Box>
					</>
				)}

				{/* UTM */}
				{hasUtm && (
					<>
						<Divider sx={{ my: 1.5 }} />
						<Box sx={{ mb: 2 }}>
							<SectionLabel>Parâmetros UTM</SectionLabel>
							<Stack spacing={0.5}>
								{link.utm_source && (
									<Typography variant='body2'>
										<b>Source:</b> {link.utm_source}
									</Typography>
								)}
								{link.utm_medium && (
									<Typography variant='body2'>
										<b>Medium:</b> {link.utm_medium}
									</Typography>
								)}
								{link.utm_campaign && (
									<Typography variant='body2'>
										<b>Campaign:</b> {link.utm_campaign}
									</Typography>
								)}
								{link.utm_term && (
									<Typography variant='body2'>
										<b>Term:</b> {link.utm_term}
									</Typography>
								)}
								{link.utm_content && (
									<Typography variant='body2'>
										<b>Content:</b> {link.utm_content}
									</Typography>
								)}
							</Stack>
						</Box>
					</>
				)}

				<Divider sx={{ my: 1.5 }} />

				{/* Datas */}
				<Stack spacing={0.5}>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						Criado em: <b>{formatDate(link.created_at)}</b>
					</Typography>
					<Typography
						variant='caption'
						color='text.secondary'
					>
						Atualizado: <b>{formatDate(link.updated_at)}</b>
					</Typography>
				</Stack>
			</Box>

			{/* Footer */}
			<Box
				sx={{
					px: 3,
					py: 2,
					flexShrink: 0,
					borderTop: 1,
					borderColor: 'divider',
				}}
			>
				<Stack
					direction='row'
					spacing={1.5}
				>
					<Button
						variant='contained'
						startIcon={<HiChartBar size={16} />}
						onClick={() => goTo(`/link/analytic/${link.id}`)}
						sx={{ flex: 1 }}
					>
						Analytics
					</Button>
					<Button
						variant='outlined'
						startIcon={<HiPencilSquare size={16} />}
						onClick={() => goTo(`/link/edit/${link.id}`)}
						sx={{ flex: 1 }}
					>
						Editar
					</Button>
				</Stack>
			</Box>
		</Drawer>
	);
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/links/components/list/LinkDetailDrawer.tsx
git commit -m "feat(links): add LinkDetailDrawer with full link details"
```

---

## Task 6 — Update `index.ts` exports

**Files:**
- Modify: `src/features/links/components/list/index.ts`

- [ ] **Step 1: Add exports for new components**

Replace entire file with:

```typescript
// src/features/links/components/list/index.ts
export { LinksHeader } from './LinksHeader';
export { LinksHeaderActions } from './LinksHeaderActions';
export { LinksFilters } from './LinksFilters';
export { LinksMobileCards } from './LinksMobileCards';
export { useLinksTableColumns } from './useLinksTableColumns';
export { LinkActionsInline } from './LinkActionsInline';
export { LinkActionsMenu } from './LinkActionsMenu';
export { LinkDetailDrawer } from './LinkDetailDrawer';
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

---

## Task 7 — Update `LinkListPage`

**Files:**
- Modify: `src/pages/links/LinkListPage.tsx`

- [ ] **Step 1: Replace entire file content**

```tsx
// src/pages/links/LinkListPage.tsx
import { Alert, Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { LinkMetrics } from '@/features/links/components/LinkMetrics';
import {
	LinkDetailDrawer,
	LinksFilters,
	LinksHeader,
	LinksMobileCards,
	useLinksTableColumns,
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
							{isMobile ? (
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
											pagination: { pageIndex: 0, pageSize: 10 },
										}}
										muiTableBodyRowProps={({ row }) => ({
											onClick: () => setDrawerLink(row.original),
											sx: { cursor: 'pointer' },
										})}
										muiTableContainerProps={{
											sx: { maxWidth: '100%', overflowX: 'auto' },
										}}
										muiTableProps={{
											sx: {
												tableLayout: 'auto',
												'& .MuiTableCell-root': {
													padding: { xs: '10px 8px', md: '14px 16px' },
												},
												'& .MuiTableRow-root': {
													height: 56,
												},
											},
										}}
									/>
								</Box>
							)}
						</>
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
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Final commit**

```bash
git add src/features/links/components/list/index.ts \
        src/pages/links/LinkListPage.tsx
git commit -m "feat(links): integrate drawer + simplified table in LinkListPage"
```

---

## Task 8 — Update `LinksMobileCards` actions

**Files:**
- Modify: `src/features/links/components/list/LinksMobileCards.tsx`

The mobile card currently has inline `ContentCopy` + `HiChartBar` icon buttons on the card and a `SwipeableDrawer` with the full action list. Replace both with `LinkActionsInline` + `LinkActionsMenu`.

- [ ] **Step 1: Open the file and locate the action buttons**

Find the two `IconButton` blocks inside `LinkMobileCard` that handle quick actions (copy + analytics on the card surface) and the `List` inside the `SwipeableDrawer` that has Copy / Share / Analytics / Edit / Delete items.

- [ ] **Step 2: Add imports at the top of `LinksMobileCards.tsx`**

Add after the existing react-router-dom import:

```tsx
import { LinkActionsInline } from './LinkActionsInline';
import { LinkActionsMenu } from './LinkActionsMenu';
```

- [ ] **Step 3: Replace the card quick-action buttons**

Find the `Stack` containing the two inline `IconButton` elements (Copy + Analytics) in `LinkMobileCard` and replace it with:

```tsx
<Stack direction='row' spacing={0.5} alignItems='center'>
  <LinkActionsInline
    shortUrl={link.short_url || shortUrl}
    onAnalytics={() => navigate(`/link/analytic/${link.id}`)}
  />
  <LinkActionsMenu
    onEdit={() => {
      setDrawerOpen(false);
      if (onEdit) onEdit(link);
      else navigate(`/link/edit/${link.id}`);
    }}
    onQR={() => {
      setDrawerOpen(false);
      navigate(`/link/qr/${link.id}`);
    }}
    onDelete={() => {
      setDrawerOpen(false);
      if (onDelete) onDelete(String(link.id));
    }}
  />
</Stack>
```

- [ ] **Step 4: Remove the `SwipeableDrawer` action list**

The `SwipeableDrawer` that contains the full action menu (`List` with Copy/Share/Analytics/Edit/Delete `ListItem`s) is now redundant — all actions are accessible via `LinkActionsMenu`. Remove the entire `SwipeableDrawer` block and the `drawerOpen` state.

> **Note:** If the `SwipeableDrawer` also contains link preview info (title, URL), keep that section and only remove the `List` of actions.

- [ ] **Step 5: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/links/components/list/LinksMobileCards.tsx
git commit -m "refactor(links): use LinkActionsInline/Menu in mobile cards"
```

---

## Task 9 — Visual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:3000/link (login first if needed).

- [ ] **Step 2: Verify desktop table**

Check the following:
- Table shows exactly 5 columns: Link, URL Encurtada, Clicks, Status, Ações
- Each row is ~56px tall
- Status column shows dot + label (not full Chip)
- URL Encurtada shows badge style (blue tint bg, monospace)
- Actions column shows `[📊] [📋] [⋯]` in grey — no colored icons

- [ ] **Step 3: Verify inline actions**

- Hover Analytics button → turns green
- Hover Copy button → turns blue, click shows spinner briefly then toast
- Click `⋯` → dropdown opens with Editar / QR Code / (divider) / Excluir in red
- Click Excluir → `window.confirm` dialog appears

- [ ] **Step 4: Verify drawer**

- Click anywhere on a row (not on buttons) → right drawer opens
- Drawer shows: slug, status dot, original URL (truncated), short URL with copy, stats, created_at/updated_at
- Footer has Analytics + Editar buttons
- Clicking outside or `×` closes drawer
- If link has `starts_in`/`expires_at` → Agendamento section appears
- If link has UTM params → Parâmetros UTM section appears

- [ ] **Step 5: Final quality check**

```bash
npm run quality
```

Expected: type-check + lint pass.

- [ ] **Step 6: Verify mobile (resize browser to < 640px)**

- Cards appear instead of table
- Each card shows `[📊] [📋] [⋯]` with the same neutral → color-on-hover behavior
- No `SwipeableDrawer` with old action list appears on card

- [ ] **Step 7: Final quality check**

```bash
npm run quality
```

Expected: type-check + lint pass.

- [ ] **Step 8: Final commit if lint fixed anything**

```bash
git add -A
git commit -m "chore(links): lint fixes after listing upgrade"
```
