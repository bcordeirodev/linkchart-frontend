import { Box, Tooltip, Typography } from '@mui/material';
import type { LinkHealth, LinkHealthStatus } from '@/types';

const HEALTH_CONFIG: Record<LinkHealthStatus, { color: string; label: string }> = {
	ok: { color: 'success.main', label: 'Saudável' },
	error: { color: 'error.main', label: 'Erro' },
	unknown: { color: 'text.disabled', label: 'Não verificado' }
};

interface LinkHealthBadgeProps {
	health?: LinkHealth | null;
}

export function LinkHealthBadge({ health }: LinkHealthBadgeProps) {
	const status: LinkHealthStatus = health?.status ?? 'unknown';
	const { color, label } = HEALTH_CONFIG[status];

	return (
		<Tooltip title={label}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
				<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
				<Typography
					variant='caption'
					sx={{ color, fontWeight: 500 }}
				>
					{label}
				</Typography>
			</Box>
		</Tooltip>
	);
}
