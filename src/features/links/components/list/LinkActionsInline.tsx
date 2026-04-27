import { CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { BarChart3, ClipboardCopy } from 'lucide-react';
import { ICON_MD } from '@/lib/theme/iconDefaults';

import { useAppDispatch } from '@/lib/store/hooks';
import { showMessage } from '@/lib/store/messageSlice';
import useClipboard from '@/hooks/useClipboard';

interface LinkActionsInlineProps {
	shortUrl: string;
	onAnalytics: () => void;
}

export function LinkActionsInline({ shortUrl, onAnalytics }: LinkActionsInlineProps) {
	const dispatch = useAppDispatch();
	const { copied, copy } = useClipboard({
		timeout: 1500,
		onSuccess: () => dispatch(showMessage({ message: 'Link copiado!', variant: 'success' }))
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
						'&:hover': { color: 'success.main', bgcolor: 'rgba(46, 125, 50, 0.08)' }
					}}
				>
					<BarChart3 {...ICON_MD} />
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
						'&:hover': { color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.08)' }
					}}
				>
					{copied ? (
						<CircularProgress
							size={14}
							color='primary'
						/>
					) : (
						<ClipboardCopy {...ICON_MD} />
					)}
				</IconButton>
			</Tooltip>
		</Stack>
	);
}
