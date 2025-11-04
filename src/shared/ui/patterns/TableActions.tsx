/**
 * 📊 TABLE ACTIONS - STANDARDIZED PATTERNS
 * Componente padronizado para ações de tabela
 */

import { Stack, IconButton, Tooltip } from '@mui/material';

import { AppIcon } from '@/shared/ui/icons';

// Mapear tamanhos customizados para tamanhos MUI
const mapSize = (size: 'xs' | 'sm' | 'md' | 'lg'): 'small' | 'medium' | 'large' => {
	switch (size) {
		case 'xs':
		case 'sm':
			return 'small';
		case 'md':
			return 'medium';
		case 'lg':
			return 'large';
		default:
			return 'medium';
	}
};

interface TableActionsProps {
	onEdit?: () => void;
	onDelete?: () => void;
	onAnalytics?: () => void;
	onQR?: () => void;
	onCopy?: () => void;
	onShare?: () => void;
	onDownload?: () => void;
	loading?: boolean;
	customActions?: React.ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	spacing?: number;
}

export function TableActions({
	onEdit,
	onDelete,
	onAnalytics,
	onQR,
	onCopy,
	onShare,
	onDownload,
	loading = false,
	customActions,
	size = 'sm',
	spacing = 0.5
}: TableActionsProps) {
	return (
		<Stack
			direction='row'
			spacing={spacing}
			alignItems='center'
		>
			{onAnalytics ? (
				<Tooltip title='Ver Analytics'>
					<IconButton
						onClick={onAnalytics}
						disabled={loading}
						color='success'
						size={mapSize(size)}
					>
						<AppIcon
							intent='analytics'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{onEdit ? (
				<Tooltip title='Editar'>
					<IconButton
						onClick={onEdit}
						disabled={loading}
						color='warning'
						size={mapSize(size)}
					>
						<AppIcon
							intent='edit'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{onCopy ? (
				<Tooltip title='Copiar'>
					<IconButton
						onClick={onCopy}
						disabled={loading}
						color='info'
						size={mapSize(size)}
					>
						<AppIcon
							intent='copy'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{onShare ? (
				<Tooltip title='Compartilhar'>
					<IconButton
						onClick={onShare}
						disabled={loading}
						color='secondary'
						size={mapSize(size)}
					>
						<AppIcon
							intent='share'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{onQR ? (
				<Tooltip title='Gerar QR Code'>
					<IconButton
						onClick={onQR}
						disabled={loading}
						color='secondary'
						size={mapSize(size)}
					>
						<AppIcon
							intent='qr'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{onDownload ? (
				<Tooltip title='Download'>
					<IconButton
						onClick={onDownload}
						disabled={loading}
						color='info'
						size={mapSize(size)}
					>
						<AppIcon
							intent='download'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}

			{customActions}

			{onDelete ? (
				<Tooltip title='Excluir'>
					<IconButton
						onClick={onDelete}
						disabled={loading}
						color='error'
						size={mapSize(size)}
					>
						<AppIcon
							intent='delete'
							size={20}
						/>
					</IconButton>
				</Tooltip>
			) : null}
		</Stack>
	);
}

export function LinkTableActions({
	onAnalytics,
	onEdit,
	onCopy,
	onQR,
	onDelete,
	loading
}: Pick<TableActionsProps, 'onAnalytics' | 'onEdit' | 'onCopy' | 'onQR' | 'onDelete' | 'loading'>) {
	return (
		<TableActions
			onAnalytics={onAnalytics}
			onEdit={onEdit}
			onCopy={onCopy}
			onQR={onQR}
			onDelete={onDelete}
			loading={loading}
			size='sm'
		/>
	);
}

export function AnalyticsTableActions({
	onEdit,
	onDownload,
	onShare,
	loading
}: Pick<TableActionsProps, 'onEdit' | 'onDownload' | 'onShare' | 'loading'>) {
	return (
		<TableActions
			onEdit={onEdit}
			onDownload={onDownload}
			onShare={onShare}
			loading={loading}
			size='sm'
		/>
	);
}

export default TableActions;
