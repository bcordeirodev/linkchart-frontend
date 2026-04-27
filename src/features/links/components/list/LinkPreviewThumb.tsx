import { Language } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useState } from 'react';
import type { LinkPreviewMeta } from '@/types';

interface LinkPreviewThumbProps {
	preview?: LinkPreviewMeta | null;
	size?: number;
}

export function LinkPreviewThumb({ preview, size = 24 }: LinkPreviewThumbProps) {
	const [error, setError] = useState(false);

	if (!preview?.favicon_url || error) {
		return (
			<Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Language sx={{ fontSize: size, color: 'text.disabled' }} />
			</Box>
		);
	}

	return (
		<Box
			component='img'
			src={preview.favicon_url}
			alt=''
			onError={() => setError(true)}
			sx={{ width: size, height: size, borderRadius: '4px', objectFit: 'contain', flexShrink: 0 }}
		/>
	);
}
