'use client';
import { useState } from 'react';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreVertical, Pencil, QrCode, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ICON_SM, ICON_MD } from '@/lib/theme/iconDefaults';

interface LinkActionsMenuProps {
	onEdit: () => void;
	onQR: () => void;
	onDelete: () => void;
}

export function LinkActionsMenu({ onEdit, onQR, onDelete }: LinkActionsMenuProps) {
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);
	const { t: tCommon } = useTranslation('common');
	const { t } = useTranslation('links');

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
			<Tooltip title={t('table.actions')}>
				<IconButton
					size='small'
					onClick={handleOpen}
					sx={{
						color: 'text.secondary',
						'&:hover': { color: 'text.primary', bgcolor: 'action.hover' }
					}}
				>
					<MoreVertical {...ICON_MD} />
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
						<Pencil {...ICON_SM} />
					</ListItemIcon>
					<ListItemText>{tCommon('actions.edit')}</ListItemText>
				</MenuItem>

				<MenuItem onClick={() => run(onQR)}>
					<ListItemIcon>
						<QrCode {...ICON_SM} />
					</ListItemIcon>
					<ListItemText>{tCommon('actions.qrCode')}</ListItemText>
				</MenuItem>

				<Divider />

				<MenuItem
					onClick={() => run(onDelete)}
					sx={{ color: 'error.main' }}
				>
					<ListItemIcon sx={{ color: 'error.main' }}>
						<Trash2 {...ICON_SM} />
					</ListItemIcon>
					<ListItemText>{tCommon('actions.delete')}</ListItemText>
				</MenuItem>
			</Menu>
		</>
	);
}
