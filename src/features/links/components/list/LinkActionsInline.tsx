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
						'&:hover': { color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.08)' }
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
