import { useState } from 'react';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
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
